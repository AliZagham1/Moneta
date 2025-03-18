import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.transactions.$post>
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

export const useCreateTransaction = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.transactions.$post({ json });
               
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Transaction created")
                queryClient.invalidateQueries({ queryKey : ["transactions"]})
                queryClient.invalidateQueries({ queryKey : ["summary"]})
            },
            onError : (error) => {
                console.error("Error creating transaction:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to create transaction")
            }
        })
        return mutation;




}