import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";


export function displayDate(date: Timestamp | Date) {
  const formattedDate = changeTimestampToDate(date);
  return format(formattedDate, "dd-MM-yyyy");
}
export function changeTimestampToDate(date: Timestamp | Date) {
  return date instanceof Timestamp ? date.toDate() : date;
}

export const YEARS: number[] = [];
for (let i = 2020; i <= 2030; i++) {
    YEARS.push(i);
}
export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const OUTCOME_CATEGORIES = ["Apple", "Banana", "Orange"];

export const INCOME_CATEGORIES = ["Apple", "Banana", "Orange"];
