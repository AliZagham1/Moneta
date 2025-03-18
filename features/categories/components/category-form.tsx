import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";


import { insertCategorySchema } from "@/db/schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = insertCategorySchema.pick({
    name:true,
})

type FormValues = z.input<typeof formSchema>;

type Props = {
    id? : string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
};

export const CategoryForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    const handleSubmit = (values: FormValues) => {
        console.log(values);
        onSubmit(values)
    };
    const handleDelete = () => {
        onDelete?.();
    };
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField name = "name"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input 
                                disabled  = {disabled}
                                placeholder = "e.g. Food, Clothing, etc."
                                {...field}
                                  />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <Button className = "mt-4 w-full  " disabled={disabled} >
                {id? "Save changes" : "Create category"}

                </Button>

                {!!id &&<Button
                  type = "button"
                  disabled ={disabled}
                  onClick = {handleDelete}
                  className = "mt-4 w-full"
                  variant = "outline">
                    <Trash className = "size-4 mr-2 "/>
                    Delete category
                </Button>}
            </form>

        </Form>
    )
}



