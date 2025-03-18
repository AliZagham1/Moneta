"use client";


import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts"
import { useGetAccounts } from "@/features/accounts/api/accounts";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete-accounts";


import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { Loader2, Plus } from "lucide-react"

import {  columns } from "./columns";


import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton";

  

const Accountspage = () => {
    const newAccount = useNewAccount();
    const deleteAccount = useBulkDeleteAccounts();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = accountsQuery.isLoading || deleteAccount.isPending;

    if (accountsQuery.isLoading) {
        return (
            <div className = " max-w-screen-2xl mx-auto w-full pb-10 -mt-24" >
                 <Card className = "border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className = "h-8 w-48"/>
                        <CardContent>
                            <div className = "h-[500px] w-full flex items-center justify-center">
                                <Loader2 className = "size-6 text-slate-300 animate-spin "/>

                            </div>
                        </CardContent>

                    </CardHeader>
                 </Card>

            </div>

        )
    }
    return (
        <div className = " max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
         <Card className = "border-none drop-shadow-sm">
           <CardHeader className = "gap-y-2 lg:flex-row  lg:items-center lg:justify-between">
            <CardTitle className = "text-xl line-clamp-1">
                Accounts Page 
            </CardTitle>
            <Button onClick ={newAccount.onOpen} size = "sm">
                <Plus className = "size-4 mr-2"/>
                Add new

            </Button >
            </CardHeader> 
            <CardContent>
            <DataTable filterkey = "name"  columns={columns} data={accounts} onDelete={(row) =>{
              const ids = row.map((r) => r.original.id);
                deleteAccount.mutate({ids});
            }} disabled = {isDisabled} />

            </CardContent>
         </Card>
        </div>

    )
}

export default Accountspage;