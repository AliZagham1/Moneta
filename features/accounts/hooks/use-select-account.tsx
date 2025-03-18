import { useState, useRef } from "react";


import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
  } from "@/components/ui/dialog"
import { useGetAccounts } from "../api/accounts";
import { useCreateAccount } from "../api/use-create-accounts";
import { Select } from "@/components/select";

  export const useSelectAccount = (
  ): [() => React.ReactElement, () => Promise<unknown>] => {
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name:string) => accountMutation.mutate({
        name
    });

    const accountOptions = (accountQuery.data || []).map((account) => ({
        label: account.name,
        value: account.id
    }));
    const [promise, setPromise] = useState<{resolve: (value:string | undefined) => void} | null>(null);
    const selectValue = useRef<string | undefined>("");
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve});
    }

    );
    const handleClose = () => {
        setPromise(null);

    };

    const handleConfirm = () => {
        if (selectValue.current !== undefined) {
          promise?.resolve(selectValue.current);
        } else {
          // Handle the case where selectValue.current is undefined
          // For example, you could resolve with a default value or an error message
          promise?.resolve('No account selected');
        }
        handleClose();
      };
    const handleCancel = () => {
        promise?.resolve(undefined);
        handleClose();
    };
    const ConfirmationDioalog = () => (
        <Dialog open = {promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                    </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue
                    </DialogDescription>
                </DialogHeader>
                <Select 
                  placeholder = "Select an account"
                  options = {accountOptions}
                   onCreate = {onCreateAccount}
                    onChange = {(value) => selectValue.current = value}
                     disabled = {accountQuery.isLoading || accountMutation.isPending} />
                <DialogFooter className = "pt-2">
                    <Button
                    onClick = {handleCancel}
                    variant = "outline">
                        Cancel

                    </Button>
                    <Button
                    onClick ={handleConfirm}>
                        Confirm

                    </Button>

                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
    return [ConfirmationDioalog, confirm];
    
  }