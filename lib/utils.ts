import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { eachDayOfInterval, subDays, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// For the user , the amount is showed in the actual form on the frontend
export function convertAmountFromMiliunits( amount : number) {
  return amount / 1000;
}

// For the backend, the amount is stored in miliunits
export function convertAmountToMiliunits( amount : number) {
  return Math.round(amount * 1000);
}

export  function formatCurrency(value: number) {

  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);

};

export function calculatePercentageChange (
  current : number,
  previous:number,
) { 
  if (!previous ||previous == 0 || previous == null) {
    return 0;
  }

  return ((current - previous) / previous * 100)
}

export function fillMissingDays (
  activeDays: {
    date:Date,
    income:number,
    expenses:number,
  }[],
  startDate:Date,
  endDate:Date,
) {
  if (activeDays.length === 0) {
    return [];
  }

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const transactionsByDay = allDays.map((day)=> {
    const found = activeDays.find((d) => d.date.toString() === day.toString());

    if (found) {
      return found;
    }

    return {
      date: day,
      income: 0,
      expenses: 0,
    }
  })

  return transactionsByDay;
}

type Period = {
  from : string | Date | undefined;
  to: string | Date | undefined;
}


export function formatDateRange(period?: Period) {
  // Fallback defaults (30-day window)
  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  // 1. Helper to handle both string ("YYYY-MM-DD") and Date
  function parseDateValue(value?: string | Date) {
    if (!value) return null;
    if (value instanceof Date) {
      // It's already a Date object
      return value;
    }
    // Otherwise, it's a string "YYYY-MM-DD"
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day); // month is zero-based
  }

  // 2. Convert period.from / period.to to Date objects (or use defaults)
  const fromDate = parseDateValue(period?.from) ?? defaultFrom;
  const toDate = parseDateValue(period?.to) ?? defaultTo;

  // 3. If the user never provided a 'from', show the 30-day default range
  if (!period?.from) {
    return `${format(defaultFrom, "LLL dd")} - ${format(defaultTo, "LLL dd, y")}`;
  }

  // 4. If both 'from' and 'to' exist, format them
  if (period?.to) {
    return `${format(fromDate, "LLL dd")} - ${format(toDate, "LLL dd, y")}`;
  }

  // 5. If only 'from' exists, just show that single date
  return format(fromDate, "LLL dd, y");
}



export function formatPercentage (
  value : number,
  options : {addPrefix?: boolean} ={
    addPrefix: false,
  },  
) {
    const result = new Intl.NumberFormat("en-US", {
      style : "percent",
  }).format(value / 100);

  if (options.addPrefix && value > 0) {
    return `+${result}`;
  }

  return result;
}
