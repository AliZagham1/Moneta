import { useState } from "react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { ImportTable } from "./import-table"
import { Button } from "@/components/ui/button"
import { convertAmountToMiliunits } from "@/lib/utils";

import {format, parse} from 'date-fns'



const dateFormat = "yyyy-MM-dd HH:mm:ss"; // CSV file required format
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
    "amount",
    "date",
    "payee",
];

interface SelectedColumnsState {
    [key: string]: string | null;
}

type Props = {
    data: string[][];
    onCancel: () => void;
    onSubmit: (data:any) => void

};

export const ImportCard = ({
    data,
    onCancel,
    onSubmit,
}: Props) => {

    const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
        {}
    );
    const headers = data[0];  // The first row is the header
    const body = data.slice(1); // The rest of the rows are the data

    const onTableHeadSelectChange = (
        columnIndex: number,
        value: string | null
    ) => {
        setSelectedColumns((prev) => {
             const newSelectedColumns = {
                ...prev,};
                for (const key in newSelectedColumns) {
                    if (newSelectedColumns[key] === value) {
                        newSelectedColumns[key] = null;
                    }
                }

                if (value == "skip") {
                    value = null;
                }
                newSelectedColumns[`column-${columnIndex}`] = value;
                return newSelectedColumns;
    });
    };

    const progress = Object.values(selectedColumns).filter(Boolean).length;
    const handleContinue = () => {
        const getColumnIndex = (column: string) => {
            return column.split("_")[1];
        };

        const mappedData = {
            headers: headers.map((_header, index) => {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column-${columnIndex}`] || null;
            }),
            body : body.map((row)=> {
            const transformedRow = row.map((cell, index)=> {
                const columnIndex = getColumnIndex(`column_${index}`);
                return selectedColumns[`column-${columnIndex}`] ? cell : null;
            })

             return transformedRow.every((item) => item === null) ? [] : transformedRow;

            }).filter((row)=> row.length > 0),
        };
         console.log({mappedData}); // Debugging line

         const arrayOfData = mappedData.body.map((row) => {
            return row.reduce((acc:any, cell, index) => {
                const header = mappedData.headers[index];
                if (header) {
                    acc[header] = cell;
                }
                return acc;
            }, {});
         
    });

    console.log({arrayOfData}); // Debugging line

    const formattedData = arrayOfData.map((item) => ({
        ...item,
        amount : convertAmountToMiliunits(parseFloat(item.amount)),
        date : item.date
        ? format(parse(item.date.trim(), "yyyy-MM-dd HH:mm:ss", new Date()), outputFormat)
        : "Invalid Date",
        

    }));

    console.log({formattedData}); // Debugging line
    onSubmit(formattedData);
};


    return (
        <div className = " max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className = "border-none drop-shadow-sm">
          <CardHeader className = "gap-y-2 lg:flex-row  lg:items-center lg:justify-between">
           <CardTitle className = "text-xl line-clamp-1">
               Import Transaction
           </CardTitle>
           <div className = "flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
           <Button onClick ={onCancel}  size = "sm" className = "w-full lg:w-auto ">
               Cancel 
           </Button >
           <Button  size = "sm" disabled = {progress < requiredOptions.length} 
                onClick={handleContinue}
                 className = "w-full lg:w-auto ">
            Continue ({progress} / {requiredOptions.length})
           </Button>

           </div>
           </CardHeader> 
           <CardContent>
            <ImportTable 
              headers= {headers}
               body= { body }
                selectedColumns={selectedColumns}
                onTableHeadSelectChange={onTableHeadSelectChange} />
            </CardContent>
        </Card>
        </div>

    )
}