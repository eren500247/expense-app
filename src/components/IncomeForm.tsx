import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { TIncome, TOutcome } from "@/types";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INCOME_CATEGORIES, OUTCOME_CATEGORIES, changeTimestampToDate } from "@/lib/services";
import { DatePicker } from "./DatePicker";
import { FiEdit } from "react-icons/fi";
import useFetch from "@/hooks/useFetch";

export function IncomeForm({
  isUpdate = false,
  item,
}: {
  isUpdate?: boolean;
  item?: TIncome;
}) {
  const { user } = useData();
  const initialValue = {
    userid: user?.email,
    title: item?.title ?? "",
    category: item?.category ?? "",
    amount: item?.amount ?? 0,
    remark: item?.remark ?? "",
    createdAt: item ? changeTimestampToDate(item.createdAt) : new Date(),
    updatedAt: new Date(),
  };

  const [formData, setFormData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setFormData((prevData) => ({
        ...prevData,
        createdAt: selectedDate,
      }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (formData.title.trim() === "" || formData.amount < 0) {
      toast({
        variant: "destructive",
        description: "Please enter valid data!",
      });
      setLoading(false);
      return;
    }
    if (isUpdate && item?.id) {
      await updateDoc(doc(db, "incomes", item.id), formData);
      setFormData(initialValue);
    } else {
      await addDoc(collection(db, "incomes"), formData);
      setFormData(initialValue);
    }
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <Button
            onClick={() => setOpen(true)}
            variant="default"
            className="w-full"
          >
            Edit <FiEdit />
          </Button>
        ) : (
          <Button size={"sm"} variant="outline" onClick={() => setOpen(true)}>
            New
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Edit" : "New"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, category: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  {INCOME_CATEGORIES.map((data) => (
                    <SelectItem key={data} value={data}>
                      {data}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              type="number"
              id="amount"
              value={formData.amount}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="remark" className="text-right">
              Remark
            </Label>
            <Input
              type="text"
              id="remark"
              value={formData.remark}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="createdAt" className="text-right">
              Created At
            </Label>
            <div className="col-span-3">
              <DatePicker
                date={formData.createdAt}
                setDate={handleDateChange}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={loading} onClick={handleSubmit}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
export default IncomeForm;
