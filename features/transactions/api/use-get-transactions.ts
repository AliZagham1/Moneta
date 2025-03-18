import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

// export const useGetTransactions = () => {
//     const params = useSearchParams();
//     const from = params.get("from") || "";
//     const to = params.get("to") || "";
//     const accountId = params.get('accountId') || "";
  
//     const query = useQuery({
//       queryKey: ['transactions', { from, to, accountId }],
//       queryFn: async () => {
//         const response = await client.api.transactions.$get({
//           query: { from, to, accountId },
//         });
  
//         if (!response.ok) {
//           throw new Error("Failed to fetch transactions");
//         }
  
//         const { data } = await response.json();
//         console.log("Fetched transactions:", data);
//         return data.map((transaction) => ({
//           ...transaction,
//           amount: convertAmountFromMiliunits(transaction.amount),
//         }));
//       },
//       enabled: !!accountId, // only run the query if accountId is truthy
//     });
  
//     return query;
//   };
  

export const useGetTransactions = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get('accountId') || "";
    const query = useQuery ({   
        //TODO: check if params are needed in the key
        queryKey : ['transactions', { from, to, accountId }],
        queryFn : async  () => {
            const response  = await client.api.transactions.$get({
                query : { from, to, accountId }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }

            const { data } = await response.json();
            console.log("Fetched transactions:", data);
            return data.map((transaction) => ({
                ...transaction,
                amount:convertAmountFromMiliunits(transaction.amount),
            }));
        }
    })

    return query;
}