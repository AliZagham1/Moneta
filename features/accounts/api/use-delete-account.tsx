import { toast } from "sonner"
import {  InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$delete"]>


export const useDeleteAccount = (id ?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error
        
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.accounts[":id"].$delete({  param : { id } });
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Account Deleted")
                queryClient.invalidateQueries({ queryKey : ['account', { id }]})
                queryClient.invalidateQueries({ queryKey : ['accounts']})
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error deleting account:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to delete account")
            }
        })
        return mutation;




}