import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";


import { insertAccountSchema } from "@/db/schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const formSchema = insertAccountSchema.pick({
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

export const AccountForm = ({
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
                                placeholder = "e.g. Cash, Bank or Credit Card"
                                {...field}
                                  />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <Button className = "mt-4 w-full  " disabled={disabled} >
                {id? "Save changes" : "Create account"}

                </Button>

                {!!id &&<Button
                  type = "button"
                  disabled ={disabled}
                  onClick = {handleDelete}
                  className = "mt-4 w-full"
                  variant = "outline">
                    <Trash className = "size-4 mr-2 "/>
                    Delete account
                </Button>}
            </form>

        </Form>
    )
}



