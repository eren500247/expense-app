import {
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import {
  AppIndex,
  AppStarter,
  Category,
  Income,
  Login,
  PageNotFound,
  Register,
  Report,
} from "./pages";
import { Toaster } from "./components/ui/toaster";
import { createContext, useContext, useState } from "react";
import { AppContextType, TUser } from "./types";
import useFetch from "./hooks/useFetch";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("user data must be use within an AppContext.provider");
  }
  return context;
};

function App() {
  const [user, setUser] = useState<TUser | undefined>(undefined);
  const {data : outcomes,loading : outcomeLoading} = useFetch("outcomes",user?.email || '')
  const {data : incomes,loading : incomeLoading} = useFetch("incomes",user?.email || '')
  const {data: categories,loading: categoriesLoading} = useFetch("categories",user?.email || "")
  const contextData: AppContextType = {
    user,
    setUser,
    incomeLoading,
    incomes,
    outcomeLoading,
    outcomes,
    categoriesLoading,
    categories
  };
  
  return (
    <AppContext.Provider value={contextData}>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppStarter />}>
            <Route path="" index={true} element={<AppIndex />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="income" element={<Income />} />
            <Route path="report" element={<Report />} />
            <Route path="category" element={<Category />}/>
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
