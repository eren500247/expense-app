import { useData } from "@/App";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { GiExpense } from "react-icons/gi";

import { FaArrowsDownToLine, FaTableList } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { BiCategory } from "react-icons/bi";

const AppStarter = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, setUser } = useData();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setUser({
          uid: user?.id,
          name: user?.displayName,
          email: user?.email,
          accessToken: user?.accessToken || "",
        });
      } else {
        if (location.pathname !== "/register") {
          navigate("/login", { replace: true });
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading && !user?.accessToken && location.pathname !== "/register") {
      navigate("/login", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast({
          description: "Sign Out Successfully!",
        });
        setUser(undefined);
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: error?.message || "Something went wrong!",
        });
      });
  };
  return (
    <div className="w-full min-h-screen">
      {loading ? (
        <p className="font-bold h-screen flex items-center justify-center">
          Checking
        </p>
      ) : (
        <>
          {location.pathname !== "/login" &&
            location.pathname !== "/register" && (
              <nav className="w-[80%] md:w[70%] bg-slate-200 mx-auto shadow-lg px-4 py-2 flex justify-around rounded-b-lg">
                <NavButton title="Expense" link="/" icon={<GiExpense />} />
                <NavButton
                  title="Income"
                  link="/income"
                  icon={<FaArrowsDownToLine />}
                />
                <NavButton
                  title="Report"
                  link="/report"
                  icon={<FaTableList />}
                />
                <NavButton
                  title="Category"
                  link="/category"
                  icon={<BiCategory />}
                />
                <Button onClick={handleLogout}>
                  Logout <IoLogOut />
                </Button>
              </nav>
            )}

          <div>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

function NavButton({
  title,
  link,
  icon,
}: {
  title: string;
  link: string;
  icon: JSX.Element;
}) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Button
      variant={location.pathname == link ? "default" : "outline"}
      onClick={() => navigate(link)}
      className="flex items-center gap-2"
    >
      <span className="hidden md:block">{title} </span>
      {icon}
    </Button>
  );
}

export default AppStarter;
