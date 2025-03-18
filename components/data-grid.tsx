
"use client";

import { useSearchParams } from "next/navigation";
import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { formatDateRange } from "@/lib/utils";

import { Banknote, TrendingUp, TrendingDown } from "lucide-react";
import { DataCard } from "./data-card";

export const DataGrid = () => {
    const { data } = useGetSummary();
    const params = useSearchParams();

    // ✅ Get `from` and `to` from the URL since `data` does not contain them
    const from = params.get("from") || undefined;
    const to = params.get("to") || undefined;
  
    const dateRangeLabel = formatDateRange({ from, to });

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard 
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={Banknote}
                dateRange={dateRangeLabel} // ✅ Corrected: Uses `from` and `to` from URL
            />

            <DataCard 
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={TrendingUp}
                dateRange={dateRangeLabel}
            />

            <DataCard 
                title="Expenses"
                value={data?.expenseAmount}
                percentageChange={data?.expenseChange}
                icon={TrendingDown}
                dateRange={dateRangeLabel}
            />
        </div>
    );
};
