
import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"]

export const useBulkCreateTransactions = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.transactions["bulk-create"].$post({ json });

                console.log("API response status:", response.status);

                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Transactions Created")
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error Creating transactions:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to Create transactions")
            }
        })
        return mutation;




}