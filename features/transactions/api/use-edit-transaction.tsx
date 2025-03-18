import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id ?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.transactions[":id"]["$patch"]({ param : { id }, json });
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Transaction Updated")
                queryClient.invalidateQueries({ queryKey : ['transaction', { id }]})
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})

            },
            onError : (error) => {
                console.error("Error editing transaction:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to edit transaction")
            }
        })
        return mutation;




}