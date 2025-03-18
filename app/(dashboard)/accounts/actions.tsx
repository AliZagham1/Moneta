"use client";
import { MoreHorizontal, Edit } from "lucide-react"

import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";

import { useConfirm } from "@/hooks/use-confirm";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import { Button } from "@/components/ui/button"

  import { Trash } from "lucide-react"
;
  
type Props = {
    id:string;

}

export const Actions = ({ id } : Props) => {

    const [ConfirmDialog, confirm ] = useConfirm (
        "Delete Account",
        "Are you sure you want to delete this account?",
    )
    const deleteMutation = useDeleteAccount(id);



    

    const {onOpen} = useOpenAccount();

    const handleDelete = async () => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate();
          
        }
    }
    return (
        <>
        <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant = "ghost" className = "size-8 p-0">
                        <MoreHorizontal className = "size-4" />

                    </Button>

                </DropdownMenuTrigger>
                <DropdownMenuContent align = "end">
                    <DropdownMenuItem
                    disabled= {deleteMutation.isPending}
                    onClick={() => onOpen(id)}
                    >
                        <Edit className = 'size-4 mr-2'/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    disabled= {deleteMutation.isPending}
                    onClick={handleDelete}
                    >
                        <Edit className = 'size-4 mr-2'/>
                        <Trash />
                       Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>

        </>
    );

};