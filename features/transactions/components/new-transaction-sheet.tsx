import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { TransactionForm } from "@/features/transactions/components/transaction-form";

import { insertTransactionSchema } from "@/db/schema";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-accounts";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"




const formSchema = insertTransactionSchema.omit({
    id:true,
})

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet =  () => {
    const { isOpen, onClose} = useNewTransaction();

    const createMutation = useCreateTransaction();

   const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name:string) => {
        categoryMutation.mutate({
            name
        })
    } 
    const categoryOptions= (categoryQuery.data || []).map((category) => ({
        label: category.name,
        value: category.id
    }))

  

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name:string) => {
        accountMutation.mutate({
            name
        })
    }

    const accountOptions= (accountQuery.data || []).map((account) => ({
        label: account.name,
        value: account.id
    }))
    const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
    const isLoading =
       categoryQuery.isLoading || accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        console.log("Submitting data:", values);
       createMutation.mutate(values, {
        onSuccess : () => {
            console.log("Mutation successful, closing sheet.");
            onClose();
        },
        onError: (error) => {
            console.error("Mutation error:", error);
        }
       });
        
    }
    return (
        <Sheet open = {isOpen } onOpenChange={onClose} >

            <SheetContent className ="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add a new transaction
                    </SheetDescription>
                </SheetHeader>
                {isLoading ? (
                    <div className = "absolute inset-0 flex items-center justify-center">
                        <Loader2 className = " size-4 text-muted-foreground animate-spin "/>

                    </div>

                ): (
                    <TransactionForm
                    onSubmit = {onSubmit}
                    onDelete={() => console.log('Delete transaction')} 
                    disabled= {isPending}
                    categoryOptions = {categoryOptions}
                    onCreateCategory = {onCreateCategory}
                    accountOptions = {accountOptions}
                    onCreateAccount = {onCreateAccount}   />

                )
                    

                }
                
             

            </SheetContent>
        </Sheet>
    )
}