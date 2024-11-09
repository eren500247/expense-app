import { useData } from "@/App";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import IncomeForm from "@/components/IncomeForm";
import MonthYearPicker from "@/components/MonthYearPicker";
import OutComeDetail from "@/components/OutComeDetail";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { OUTCOME_CATEGORIES, changeTimestampToDate, displayDate } from "@/lib/services";
import { TIncome } from "@/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CgMoreVerticalO } from "react-icons/cg";

const Income = () => {
  const date = new Date();
  const { incomeLoading, incomes } = useData();
  const [month, setMonth] = useState(date.getMonth());
  const [year, setYear] = useState(date.getFullYear());
  const [showAll, setShowAll] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredOutcomes, setFilteredOutcomes] = useState<TIncome[]>([]);


  useEffect(() => {
    if (showAll) {
      if (selectedCategory && selectedCategory !== "-") {
        setFilteredOutcomes(
          incomes.filter((income) => income.category === selectedCategory)
        );
      } else {
        setFilteredOutcomes(incomes);
      }
    } else {
      const data =
        selectedCategory && selectedCategory !== "-"
          ? incomes.filter((income) => {
              const incomeDate = changeTimestampToDate(income.createdAt);
              return (
                incomeDate.getMonth() === month &&
                incomeDate.getFullYear() === year &&
                income.category === selectedCategory
              );
            })
          : incomes.filter((income) => {
              const incomeDate = changeTimestampToDate(income.createdAt);
              return (
                incomeDate.getMonth() === month &&
                incomeDate.getFullYear() === year
              );
            });
      setFilteredOutcomes(data);
    }
  }, [selectedCategory, incomes, showAll, month, year]);

  const deleteIncome = async (id: string) => {
    try {
      await deleteDoc(doc(db, "incomes", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete outcome error >>", err);
    }
  };
  const totalAmount = filteredOutcomes.reduce(
    (a, b) => a + Number(b.amount),
    0
  );

  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto">
    <div className="pt-4 flex justify-between items-center">
      <IncomeForm />
      <div className="flex items-center gap-2">
        <Checkbox
          id="showAll"
          checked={showAll}
          onCheckedChange={() => setShowAll((prev) => !prev)}
        />
        <label
          htmlFor="showAll"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Show all?
        </label>
      </div>
    </div>
    <div className="flex items-center justify-between gap-2 py-2">
      <Select
        value={selectedCategory}
        onValueChange={(value) => setSelectedCategory(value)}
      >
        <SelectTrigger className="w-[100px] md:w-[150px]">
          <SelectValue placeholder={"Categories"} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={"-"}>All</SelectItem>
            {OUTCOME_CATEGORIES.map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {!showAll && (
        <MonthYearPicker
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
        />
      )}
    </div>
    <Table className="border border-slate-300 shadow-lg">
      <TableCaption>A list of outcomes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[25%] font-bold">Title</TableHead>
          <TableHead className="w-[23%] font-bold">Amount</TableHead>
          <TableHead className="w-[20%] font-bold hidden md:flex items-center justify-center">
            Category
          </TableHead>
          <TableHead className="w-[22%] font-bold">Created At</TableHead>
          <TableHead className="w-[10%] font-bold text-center">
            Action
          </TableHead>
        </TableRow>
      </TableHeader>
      {incomeLoading ? (
        <TableBody>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell className="text-start font-bold py-2">
              Loading...
            </TableCell>
          </TableRow>
        </TableBody>
      ) : (
        <TableBody>
          {filteredOutcomes
            .sort((a, b) => {
              const dateA = changeTimestampToDate(a.createdAt);
              const dateB = changeTimestampToDate(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            })
            .map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.title}</TableCell>
                <TableCell>{Number(i.amount).toLocaleString()} MMK</TableCell>
                <TableCell className="hidden md:block">
                  {i.category}
                </TableCell>
                <TableCell>{displayDate(i.createdAt)}</TableCell>
                <TableCell className="flex items-center justify-center gap-2">
                  <Popover>
                    <PopoverTrigger>
                      <CgMoreVerticalO size={22} />
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      align="start"
                      className="w-36 space-y-1"
                    >
                      {/* <OutcomeDetail item={i} /> */}
                      <IncomeForm isUpdate={true} item={i} />
                      <OutComeDetail item={i}/>
                      <ConfirmDialog onDelete={()=> deleteIncome(i.id)}/>
                      {/* <ConfirmDialog fn={() => deleteOutcome(i.id)} /> */}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      )}
      <TableFooter>
        <TableRow className="font-bold">
          <TableCell>Total</TableCell>
          <TableCell>{totalAmount.toLocaleString()} MMK</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
  )
}

export default Income