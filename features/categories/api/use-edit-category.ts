import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

export const useEditCategory = (id ?: string) => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.categories[":id"].$patch({ json, param : { id } });
                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("Category Updated")
                queryClient.invalidateQueries({ queryKey : ['category', { id }]})
                queryClient.invalidateQueries({ queryKey : ['categories']})
                queryClient.invalidateQueries({ queryKey : ['transactions']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error editing category:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to edit category")
            }
        })
        return mutation;




}