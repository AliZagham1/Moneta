import { 
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { TableHeadSelect } from "./table-head-select";

type Props = {
    headers: string[];
    body: string[][];
    selectedColumns: Record<string, string | null>;
    onTableHeadSelectChange: (columnindex: number, value:string | null) =>void;
};

export const ImportTable = ({headers, body, selectedColumns, onTableHeadSelectChange}: Props) => {
    return (
        <div className = "rounded=md border overflow-hidden">
            <Table>
               <TableHeader className = "bg-muted">

                <TableRow>
                    {headers.map((_item, index) => (
                        <TableHead key = {index} >
                            <TableHeadSelect 
                              columnIndex = {index}
                               selectedColumns = {selectedColumns}
                                OnChange = {onTableHeadSelectChange}/>
                           </TableHead>
                    ))}
                </TableRow>
               </TableHeader>
               <TableBody>
                 {body.map((item, index) => (
                    <TableRow key = {index}>
                        {item.map((item, index) => (
                            <TableCell key = {index} className = "p-2">
                                {item}
                            </TableCell>
                        ))}
                    </TableRow>
                 ))}
               </TableBody>
            </Table>

        </div>
    )
}