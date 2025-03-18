import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetAccount } from "@/features/accounts/api/use-get-accounts";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditAccount } from "@/features/accounts/api/use-edit-accounts";
import  { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"




const formSchema = insertAccountSchema.pick({
    name:true,
})

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet =  () => {
    const { isOpen, onClose, id} = useOpenAccount();

    const [ConfirmDialog, confirm ] = useConfirm (
        "Delete Account",
        "Are you sure you want to delete this account?",
    )

    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);
   

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
        console.log("Submitting data:", values);
       editMutation.mutate(values, {
        onSuccess : () => {
            onClose();
        }
       });
        
    }
    const onDelete = async  () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess : () => {
                    onClose();
                }
            });
        }
    }

    const defaultValues =  accountQuery.data? {
        name:accountQuery.data.name
    } : {
        name : "",
    };
    return (
        <>
          <ConfirmDialog />
        
         <Sheet open = {isOpen } onOpenChange={onClose} >

            <SheetContent className ="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                Edit Account 
                    </SheetTitle>
                    <SheetDescription>
                      Edit an existing account 
                    </SheetDescription>
                </SheetHeader>
                {
                     isLoading ? (
                        <div className = "absolute inset-0 flex items-center justify-center">
                            <Loader2 className = "size-6 text-slate-300 animate-spin "/>

                        </div>
                         
                     ) : (
                        <AccountForm  id = {id} onSubmit = {onSubmit} disabled = {isPending} 
                        defaultValues={ defaultValues } onDelete={onDelete}/>

                     )

                }
                   
               
             

            </SheetContent>
         </Sheet>
        </>
    )
}