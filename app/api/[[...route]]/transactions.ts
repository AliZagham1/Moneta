import { z } from "zod";
import {Hono} from 'hono'
import { zValidator } from '@hono/zod-validator'
import { db } from '@/db/drizzle';

import { subDays, parse  } from 'date-fns';

import { transactions , insertTransactionSchema, categories, accounts} from '@/db/schema';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { eq, and, inArray, gte, lte, desc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const app = new Hono()
.get(
    '/', 
    zValidator(
        "query", 
        z.object({
            from: z.string().optional(),
            to: z.string().optional(),
            accountId: z.string().optional(),
        })
    ),
    clerkMiddleware(),

async (c) => {
    
    const auth = getAuth(c);
    const { from, to, accountId} = c.req.valid("query");
    if (!auth || !auth.userId) {
        return c.json({ error: 'Unauthorized' }, 401);
      }
    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo , 30);

    const startDate = from ? parse(from, 'yyyy-MM-dd', new Date()) : defaultFrom;
    const endDate = to ? parse(to, 'yyyy-MM-dd', new Date()) : defaultTo;
    
    
    const data = await db.select({
          id : transactions.id,
          date: transactions.date,
          category: categories.name,
          categoryId : transactions.categoryId,
          payee : transactions.payee,
          amount : transactions.amount,
          notes : transactions.notes,
          account : accounts.name,
          accountId : transactions.accountId
      })

      .from(transactions)
      .innerJoin(accounts,eq(transactions.accountId, accounts.id))
      .leftJoin(categories,eq(transactions.categoryId, categories.id))
       .where (
        and(
            accountId ? eq(transactions.accountId, accountId) : undefined,
            eq(accounts.userId, auth.userId),
            gte(transactions.date, startDate),
            lte(transactions.date, endDate)

        )
       )
       .orderBy(desc(transactions.date))
      return c.json({
         data      
      })
  })
.get(
    "/:id",
    zValidator(
        "param",
        z.object({
            id: z.string().optional(),
        })  
    ),
    clerkMiddleware(),
    async(c) => {
        const auth = getAuth(c);
        const { id } = c.req.valid("param");

        if (!id) {
            return c.json({ error: "Missing id" }, 400);
        }

        if (!auth?.userId) {
            console.error("Unauthorized access")
            return c.json({error : "unauthorized"} , 401);
        }

        const [data] = await db.select({
          id : transactions.id,
          date: transactions.date,
          categoryId : transactions.categoryId,
          payee : transactions.payee,
          amount : transactions.amount,
          notes : transactions.notes,
          accountId : transactions.accountId
        })
        .from(transactions)
        .innerJoin(accounts,eq(transactions.accountId, accounts.id))
        .where(and(
            eq(transactions.id, id),
            eq(accounts.userId, auth.userId)
        ))
        if (!data) {
            return c.json({ error: "Account not found" }, 404);
        }
        return c.json({
            data
        })

    }
  )
.post(
    '/',
    clerkMiddleware(),
    zValidator("json", insertTransactionSchema.omit({
        id:true,
    })), async(c) => {
        console.log("Incoming POST request:", c.req);
        const auth = getAuth(c);
        const values = c.req.valid("json");
 
        if (!auth?.userId) {
            console.error("Unauthorized access")
            return c.json({error : "unauthorized"} , 401);
        }

        try {
            const data = await db
                .insert(transactions)
                .values({
                    id: createId(),
                    ...values,
                })
                .returning();

            console.log("Database insert result:", data); // Log database response
            return c.json({ data });
        } catch (error) {
            console.error("Database error:", error); // Log database error
            return c.json({ error: "Failed to insert into database" }, 500);
        }
    }
    
) 

.post(
    "/bulk-delete",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        ids: z.array(z.string()), // Expect an array of transaction IDs
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");
  
      console.log("Auth Object:", auth);
      console.log("Request Body (IDs):", values.ids);
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      if (!values.ids || values.ids.length === 0) {
        return c.json({ error: "No IDs provided for deletion" }, 400);
      }
  
      try {
        const data = await db
  .delete(transactions)
  .where(
    and(
      // Only delete transactions whose IDs are in the provided array
      inArray(transactions.id, values.ids),
      // AND whose accountId is in the set of accounts that belong to the current user
      inArray(
        transactions.accountId,
        db
          .select({ id: accounts.id })
          .from(accounts)
          .where(eq(accounts.userId, auth.userId))
      )
    )
  )
  .returning({ id: transactions.id });
  
        console.log("Deleted Transactions:", data);
  
        if (data.length === 0) {
          return c.json({ error: "No transactions found to delete" }, 404);
        }
  
        return c.json({ data });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          return c.json({ error: "Some Error", details: error.message }, 500);
        } else {
          // Fallback if it's not an Error instance
          console.error("Unknown error:", error);
          return c.json({ error: "An unknown error occurred" }, 500);
        }
      }
    }
  )
  


.patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    zValidator("json", insertTransactionSchema.omit({ id: true })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");
  
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      // Update the transaction only if its accountId is in the list of accounts
      // owned by the authenticated user.
      const [data] = await db
        .update(transactions)
        .set(values)
        .where(
          and(
            eq(transactions.id, id),
            inArray(
              transactions.accountId,
              db.select({ id: accounts.id })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            )
          )
        )
        .returning();
  
      if (!data) {
        return c.json({ error: "Transaction not found or unauthorized" }, 404);
      }
  
      return c.json({ data });
    }
  )

  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      })
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
  
      if (!id) {
        return c.json({ error: "Missing id" }, 400);
      }
  
      if (!auth?.userId) {
        return c.json({ error: "Unauthorized" }, 401);
      }
  
      // Delete the transaction only if its accountId belongs to an account owned by the user
      const [data] = await db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, id),
            inArray(
              transactions.accountId,
              db.select({ id: accounts.id })
                .from(accounts)
                .where(eq(accounts.userId, auth.userId))
            )
          )
        )
        .returning({ id: transactions.id });
  
      if (!data) {
        return c.json({ error: "Transaction not found or unauthorized" }, 404);
      }
  
      return c.json({ data });
    }
  )


  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
        "json",
        z.array(
            insertTransactionSchema.omit({ id: true })
        )
    ),
    async (c, next) => {
        try {
            // Try to validate the request body
            c.req.valid("json");
            return next();
        } catch (error) {
            console.error("❌ Zod Validation Error:", error);
            return c.json({ error: "Invalid data", details: error }, 400);
        }
    },
    async (c) => { 
        console.log("🔍 Received a request at /bulk-create");
        const body = await c.req.json();
        console.log("🛠 Received Data:", JSON.stringify(body, null, 2));

        const auth = getAuth(c);
        if (!auth?.userId) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        const values = c.req.valid("json");

        const data = await db
            .insert(transactions)
            .values(
                values.map((value) => ({
                    id: createId(),
                    ...value,
                }))
            )
            .returning();

        console.log("Database insert result:", data);
        return c.json({ data });
    }
)


// .post(
//     "/bulk-create",
//     clerkMiddleware(),
//     zValidator(
//         "json",
//         z.array(
//             insertTransactionSchema.omit({
//                 id:true,
//             })
//         )

//     ),
//     async (c) => { 

//   console.log("🔍 Received a request at /bulk-create");
//       const body = await c.req.json();
//       console.log("🛠 Received Data:", JSON.stringify(body, null, 2));
//         const auth = getAuth(c);
//         const values = c.req.valid("json");

//         if(!auth?.userId) {
//             return c.json({error: "Unauthorised"}, 401);
//         }

       
//         const data = await db
//         .insert(transactions)
//         .values(
//             values.map(
//                 (value) => ({
//                     id: createId(),
//                     ...value,
//                 })
//             )
//         )
//         .returning();
//         console.log("Database insert result:", data);
//         return c.json({ data });
//    }
// )

export default app;



//.post(
    // "/bulk-delete",
    // clerkMiddleware(),
    // zValidator(
    //     "json",
    //     z.object({
    //         ids: z.array(z.string())
    //     })
    // ),
    // async(c) => {
    //     const auth = getAuth(c);
    //     const values = c.req.valid("json");
    //     console.log("Request Body (IDs):", values.ids); 

    //     if (!auth?.userId) {
    //         return c.json({error: "Unauthorized"}, 401);
    //     }

    //     if (!values.ids || values.ids.length === 0) {
    //         return c.json({ error: "No IDs provided for deletion" }, 400);
    //       }

    //     try{
    //     const transactionsToDelete = db.$with("transactions_to_delete").as(
    //         db.select({ id:transactions.id}).from(transactions)
    //         .innerJoin(accounts,eq(transactions.accountId, accounts.id))
    //         .where(
    //             and(
    //                 inArray(transactions.id, values.ids),
    //                 eq(accounts.userId, auth.userId)
    //             )
    //         )

    //     );
        

    //     const data = await db
    //     .with(transactionsToDelete)
    //     .delete(transactions)
    //     .where(
    //         inArray(transactions.id, sql`select id from ${transactionsToDelete}`)
    //     )
        
    //     .returning ({
    //         id:transactions.id,
    //     }
    //     )
    //     console.log(data);
    //     if (data.length === 0) {
    //         return c.json({ error: "No matching transactions found" }, 404);
    //       }
    //       return c.json({data});
    // } catch (error) {
    //     if (error instanceof Error) {
    //         console.error("Error message:", error.message);
    //       } else {
    //         console.error("Unexpected error:", error);
    //       }
        
     
        
    // }
      


    // }