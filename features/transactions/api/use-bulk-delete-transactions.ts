
import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteTransactions = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.transactions["bulk-delete"]["$post"]({ json });
                if (!response.ok) {
                    throw new Error(`Failed with status ${response.status}`);
                  }

                console.log("API response:", response);
                
                return await response.json() as ResponseType;

            },
            onSuccess : () => {
                toast.success("Transactions Deleted")
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error deleting transactions:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to delete transactions")
            }
        })
        return mutation;




}