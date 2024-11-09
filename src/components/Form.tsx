import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Toaster } from "./ui/toaster";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useData } from "@/App";

type Props = {
  isLogin: boolean;
};

const Form: React.FC<Props> = ({ isLogin }) => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    {
      email: "",
      password: "",
    }
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {user,setUser} = useData()

  useEffect(()=>{
    if(user && user.accessToken){
      navigate("/")
    }
  },[user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast({
        variant: "destructive",
        description: "Invalid Password",
      });
      return;
    }
    setLoading(true);

    if (isLogin) {
      await signInWithEmailAndPassword(auth, formData.email, formData.password)
        .then((userCrendential) => {
          const user: any = userCrendential.user;
          console.log(user);
          setUser({
            uid : user?.uid,
            name : user?.displayName,
            email : user?.email,
            accessToken : user?.accessToken || ""
          })
          navigate("/",{replace : true})
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Login Error >>>", errorCode, errorMessage);
          toast({
            variant: "destructive",
            description: errorMessage || "Invalid Crendential",
          });
        });
    } else {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )
        .then((userCredential) => {
          const user: any = userCredential.user;
          setUser({
            uid : user?.uid,
            name : user?.displayName,
            email : user?.email,
            accessToken : user?.accessToken || ""
          })
          toast({
            description: "Register Successfully!",
          });
          navigate("/", { replace: true });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log("Login Error >>>", errorCode, errorMessage);
          toast({
            variant: "destructive",
            description: errorMessage || "Invalid Crendential",
          });
        });
    }
  };


  if(user && user.accessToken) return null;
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-[90%] max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-center font-bold text-xl">
            {isLogin ? "Login" : "Register"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                className="mt-2"
                required
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Your Password"
                className="mt-2"
                required
              />
            </div>
            <div className="mb-4 text-center">
              {
                isLogin ? ( <p>IF you don't have an account <NavLink to={'/register'} className="text-blue-400 underline">Register</NavLink></p>) :  <p>IF you already have an account <NavLink to={'/login'} className="text-blue-400 underline">Login</NavLink></p>
              }
            </div>
            <Button type="submit" className="w-full">
              {loading ? "loading" : isLogin ? "Login" : "Register"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
