import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

export const useEditAccount = (id ?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.accounts[":id"].$patch({ json, param : { id } });
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Account Updated")
                queryClient.invalidateQueries({ queryKey : ['account', { id }]})
                queryClient.invalidateQueries({ queryKey : ['accounts']})
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error editing account:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to edit account")
            }
        })
        return mutation;




}