
import { toast } from "sonner"
import { InferRequestType, InferResponseType} from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";


type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"]

export const useBulkDeleteCategories = () => {

    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
        >({ 
            mutationFn : async (json) => {
                console.log("Sending data to API:", json); 
                const response = await client.api.categories["bulk-delete"].$post({ json });

                console.log("API response:", response);
                
                return await response.json();

            },
            onSuccess : () => {
                toast.success("categories deleted")
                queryClient.invalidateQueries({ queryKey : ['categories']})
                queryClient.invalidateQueries({ queryKey : ['summary']})
            },
            onError : (error) => {
                console.error("Error creating categories:", error.message);
                console.error("Detailed error object:", error);
                toast.error("Failed to delete categories")
            }
        })
        return mutation;




}