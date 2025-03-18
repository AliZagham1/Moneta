

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver} from "@hookform/resolvers/zod";
import { AmountInput } from "@/components/amount-input";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/select";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

import { convertAmountToMiliunits } from "@/lib/utils";
import { insertTransactionSchema } from "@/db/schema";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";


const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount:z.string(),
    notes: z.string().nullable().optional(),

})

const apiSchema = insertTransactionSchema.omit({
    id:true
});


type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
    id? : string;
    defaultValues?: FormValues;
    onSubmit: (values: ApiFormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    accountOptions: { label:string; value: string; }[];
    categoryOptions : { label:string; value: string; }[];
    onCreateAccount: (name : string) => void;
    onCreateCategory: (name : string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });
    console.log(form.formState.errors);
    const handleSubmit = (values: FormValues) => {
        console.log("HandleSubmit triggered");
        const amount = parseFloat(values.amount);
        console.log("Amount parsed:", amount);
        const amountInMiliunits =  convertAmountToMiliunits(amount);
        onSubmit({
            ...values,
            amount: amountInMiliunits,
           

        });
    };
        
      
        
         
    const handleDelete = () => {
        onDelete?.();
    };
    return(
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}
              className = "space-y-4 pt-4">
                <FormField name = "date"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            
                            <FormControl>
                                <DatePicker
                                    value = {field.value}
                                    onChange = {field.onChange}
                                    disabled = {disabled}
                                />
                             
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <FormField name = "accountId"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Account</FormLabel>
                            <FormControl>
                                <Select
                                   placeholder="Select an account"
                                   options = {accountOptions}
                                   onCreate = {onCreateAccount}
                                   value={field.value}
                                   onChange={field.onChange}
                                   disabled = {disabled}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                  <FormField name = "categoryId"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                                <Select
                                   placeholder="Select a category"
                                   options = {categoryOptions}
                                   onCreate = {onCreateCategory}
                                   value={field.value}
                                   onChange={field.onChange}
                                   disabled = {disabled}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <FormField name = "payee"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Payee</FormLabel>
                            <FormControl>
                                <Input
                                  disabled = {disabled}
                                  placeholder= "Add a payee"
                                  {...field}
                                  value={field.value ?? ""}
                                    />
                                 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <FormField name = "amount"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                                <AmountInput
                                {...field}
                                  disabled = {disabled}
                                  placeholder="0.00"
                                
                                    />
                                 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                 <FormField name = "notes"
                control = {form.control}
                render = {
                    ({field}) => (
                        <FormItem>
                            <FormLabel>Notes</FormLabel>
                            <FormControl>
                                <Textarea
                                 {...field}
                                 value= {field.value ?? " "}
                                 disabled = {disabled}
                                 placeholder="Optional Notes"
                                 />
                    
                                
                                 
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )
                }/>
                <Button className = "mt-4 w-full" type = "submit"  disabled={disabled} >
                {id? "Save changes" : "Create Transaction"}

                </Button>

                {!!id &&<Button
                  type = "button"
                  disabled ={disabled}
                  onClick = {handleDelete}
                  className = "mt-4 w-full"
                  variant = "outline">
                    <Trash className = "size-4 mr-2 "/>
                    Delete Transaction
                </Button>}
            </form>

        </Form>
    )
}



