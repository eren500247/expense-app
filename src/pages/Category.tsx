import { useData } from "@/App";
import CategoryForm from "@/components/CategoryForm";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { CgMoreVerticalO } from "react-icons/cg";

const Category = () => {
  const { categories, categoriesLoading } = useData();
  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      toast({ description: "Deleted successfully!" });
    } catch (err) {
      toast({ variant: "destructive", description: "Something went wrong!" });
      console.log("delete outcome error >>", err);
    }
  };
  return (
    <div className="w-[98%] md:w-[90%] lg:w-[80%]  mx-auto mt-10 space-y-3">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">All Categories List</h1>
        <CategoryForm />
      </div>
      <Table className="border border-slate-300 shadow-lg">
        <TableCaption>A List Of Categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%] font-bold">Title</TableHead>
            <TableHead className="w-[25%] font-bold">Type</TableHead>
            <TableHead className="w-[25%] font-bold">Description</TableHead>
            <TableHead className="w-[10%] font-bold text-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        {categoriesLoading ? (
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
            {categories.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-medium">{i.categoryName}</TableCell>
                <TableCell className="font-medium">
                  {i.categoryType === "01" ? "Income" : "Outcome"}
                </TableCell>
                <TableCell className="font-medium">
                  {i.description ?? ""}
                </TableCell>
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
                      <CategoryForm isUpdate={true} item={i} />
                      <ConfirmDialog onDelete={() => deleteCategory(i.id)} />
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </div>
  );
};

export default Category;
