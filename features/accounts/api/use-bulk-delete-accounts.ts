
import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteAccounts = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.accounts["bulk-delete"].$post({ json });

                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Accounts Deleted")
                queryClient.invalidateQueries({ queryKey : ['accounts']})
            },
            onError : (error) => {
                console.error("Error deleting accounts:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to delete accounts")
            }
        })
        return mutation;




}