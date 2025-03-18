import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories.$post>
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

export const useCreateCategory = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.categories.$post({ json });
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Category created")
                queryClient.invalidateQueries({ queryKey : ['categories']})
            },
            onError : (error) => {
                console.error("Error creating category:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to create category")
            }
        })
        return mutation;




}