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
import { TCategory, TOutcome } from "@/types";
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
import { OUTCOME_CATEGORIES, changeTimestampToDate } from "@/lib/services";
import { DatePicker } from "./DatePicker";
import { FiEdit } from "react-icons/fi";

export function CategoryForm({
  isUpdate = false,
  item,
}: {
  isUpdate?: boolean;
  item?: TCategory;
}) {
  const { user, categories } = useData();
  const initialValue = {
    userid: user?.email,
    categoryName: item?.categoryName ?? "",
    categoryType: "",
    description: item?.description ?? "",
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
    if (formData.categoryName.trim() === "") {
      toast({
        variant: "destructive",
        description: "Please enter valid data!",
      });
      setLoading(false);
      return;
    }
    if (isUpdate && item?.id) {
      await updateDoc(doc(db, "categories", item.id), formData);
      setFormData(initialValue);
      toast({
        variant: "default",
        description: "Category Updated Successfully!",
      });
    } else {
      await addDoc(collection(db, "categories"), formData);
      setFormData(initialValue);
      toast({
        variant: "default",
        description: "Category Created Successfully!",
      });
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
          <Button size={"sm"} variant="default" onClick={() => setOpen(true)}>
            Create
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Edit" : "Create"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryName" className="text-right">
              Category Name
            </Label>
            <Input
              id="categoryName"
              value={formData.categoryName}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={handleChange}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="categoryType" className="text-right">
              Category Type
            </Label>
            <Select
              value={formData.categoryType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, categoryType: value }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select Category Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Type</SelectLabel>
                  <SelectItem value="01">Income</SelectItem>
                  <SelectItem value="02">Outcome</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
export default CategoryForm;
