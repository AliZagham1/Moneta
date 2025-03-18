import {cn} from "@/lib/utils";

import {Select, SelectItem, SelectTrigger, SelectContent, SelectValue} from "@/components/ui/select"
type Props = {
    columnIndex: number
    selectedColumns: Record<string, string | null>
    OnChange: (columnindex: number, value:string | null) =>void
};


const option = [
    "amount",
    "payee",
    "date",
];

export const TableHeadSelect = ({columnIndex, selectedColumns, OnChange}: Props) => {

    const currentSelection= selectedColumns[`column-${columnIndex}`]
    return (
      <Select  
      value = {currentSelection || " "}
      onValueChange = {(value) => OnChange(columnIndex, value)}>

        <SelectTrigger className = {cn("focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize", currentSelection && "text-blue-500",
        )}>

        <SelectValue placeholder="Select" />

        </SelectTrigger>

        <SelectContent>
        <SelectItem value ="skip"> Skip </SelectItem>
            {option.map((option, index) => {
                const disabled = Object.values(selectedColumns).includes(option) &&  
                selectedColumns[`column_${columnIndex}`] !== option;
                return (
                    <SelectItem key = {index} value = {option} disabled = {disabled} className="capitalize"> {option} </SelectItem>
                )
            })}
        </SelectContent>

      </Select>
    )
            }
                
           
       