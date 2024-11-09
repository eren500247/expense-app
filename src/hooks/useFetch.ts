import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

const useFetch = (tableName: string, email: string) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onStartUp = async () => {
      try {
        const dataQuery = query(
          collection(db, tableName),
          where("userid", "==", email)
        );
        const unsubscribe = onSnapshot(dataQuery, (querySnanShot) => {
          const dataAttay = querySnanShot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setData(dataAttay);
        });
        return () => {
          unsubscribe();
        };
      } catch (err: any) {
        console.log("fetch error>>>", err);
        toast({
          variant: "destructive",
          description: err.message || "Something Went Wrong!",
        });
      } finally {
        setLoading(false);
      }
    };  
    onStartUp()
  }, [tableName,email]);

  return {data,loading}
};
export default useFetch
