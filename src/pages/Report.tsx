import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useData } from "@/App";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeTimestampToDate, MONTHS, YEARS } from "@/lib/services";
const Report = () => {
  const date = new Date();
  const { incomes, outcomes, incomeLoading, outcomeLoading } = useData();
  const [year, setYear] = useState(date.getFullYear());
  const getMonthName = (monthIndex: number) => {
    return MONTHS[monthIndex];
  };
  const initializeMonthlyData = () => {
    return Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [getMonthName(i), []])
    );
  };
  console.log("initialize >>", initializeMonthlyData());
  const filteredIncomes = incomes.filter((income) => {
    const incomeDate = changeTimestampToDate(income.createdAt);
    return incomeDate.getFullYear() === year;
  });
  const filteredOutcomes = outcomes.filter((outcome) => {
    const outcomeDate = changeTimestampToDate(outcome.createdAt);
    return outcomeDate.getFullYear() === year;
  });
  // Group data by month
  const groupedIncomes = filteredIncomes.reduce((acc: any, income) => {
    const incomeDate = changeTimestampToDate(income.createdAt);
    const monthName = getMonthName(incomeDate.getMonth());
    acc[monthName].push(income);
    return acc;
  }, initializeMonthlyData());
  // console.log("group incomes >>", Object.values(groupedIncomes));
  // console.log("group incomes >>", Object.values(groupedIncomes).flat());
  const groupedOutcomes = filteredOutcomes.reduce((acc: any, outcome) => {
    const outcomeDate = changeTimestampToDate(outcome.createdAt);
    const monthName = getMonthName(outcomeDate.getMonth());
    acc[monthName].push(outcome);
    return acc;
  }, initializeMonthlyData());
  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
      <div className="py-4">
        <Select
          value={year.toString()}
          onValueChange={(value) => setYear(parseInt(value))}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent className="w-[150px]">
            {YEARS.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A list of report.</TableCaption>
        <TableHeader>
          <TableRow className="font-bold">
            <TableHead className="w-[30%]">Month</TableHead>
            <TableHead className="w-[35%]">Incomes</TableHead>
            <TableHead className="w-[35%]">Outcomes</TableHead>
          </TableRow>
        </TableHeader>
        {incomeLoading || outcomeLoading ? (
          <TableBody>
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="text-start font-bold py-2">
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {Object.keys(initializeMonthlyData()).map((month) => (
              <TableRow key={month}>
                <TableCell className="font-medium">{month}</TableCell>
                <TableCell>
                  {groupedIncomes[month]
                    .reduce(
                      (total: number, income: any) =>
                        total + Number(income.amount),
                      0
                    )
                    .toLocaleString()}{" "}
                  MMK
                </TableCell>
                <TableCell>
                  {groupedOutcomes[month]
                    .reduce(
                      (total: number, outcome: any) =>
                        total + Number(outcome.amount),
                      0
                    )
                    .toLocaleString()}{" "}
                  MMK
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
        <TableFooter>
          <TableRow className="font-bold">
            <TableCell>Total</TableCell>
            <TableCell>
              {Object.values(groupedIncomes)
                .flat()
                .reduce(
                  (total: number, income: any) => total + Number(income.amount),
                  0
                )
                .toLocaleString()}{" "}
              MMK
            </TableCell>
            <TableCell>
              {Object.values(groupedOutcomes)
                .flat()
                .reduce(
                  (total: number, outcome: any) =>
                    total + Number(outcome.amount),
                  0
                )
                .toLocaleString()}{" "}
              MMK
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};
export default Report;
