import { z } from "zod";
import { Loader2 } from "lucide-react";

import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { insertCategorySchema } from "@/db/schema";

import { useConfirm } from "@/hooks/use-confirm";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import  { useDeleteCategory } from "@/features/categories/api/use-delete-category";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"




const formSchema = insertCategorySchema.pick({
    name:true,
})

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet =  () => {
    const { isOpen, onClose, id} = useOpenCategory();

    const [ConfirmDialog, confirm ] = useConfirm (
        "Delete Category",
        "Are you sure you want to delete this category?",
    )

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);
   

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;

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

    const defaultValues =  categoryQuery.data? {
        name:categoryQuery.data.name
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
                Edit Category
                    </SheetTitle>
                    <SheetDescription>
                      Edit an existing category
                    </SheetDescription>
                </SheetHeader>
                {
                     isLoading ? (
                        <div className = "absolute inset-0 flex items-center justify-center">
                            <Loader2 className = "size-6 text-slate-300 animate-spin "/>

                        </div>
                         
                     ) : (
                        <CategoryForm  id = {id} onSubmit = {onSubmit} disabled = {isPending} 
                        defaultValues={ defaultValues } onDelete={onDelete}/>

                     )

                }
                   
               
             

            </SheetContent>
         </Sheet>
        </>
    )
}