"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Send,
  Eye,
  EyeOff,
  GripHorizontal,
  Mail,
  Lock,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import axios from "axios";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
// import logo from "../images/favicon.ico"
import ThemeToggleButton from "@/components/ThemeToggleButton";
import { useRouter } from "next/navigation";
// import { Badge } from "@/components/ui/badge";
// import { RedirectToApp } from "../middleware";
import Image from "next/image";
// import logo from 
type FormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  // const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state to show a spinner or loading message
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ mode: "onChange" });
  const { theme } = useTheme(); // Access the current theme

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true); // Set loading to true when the API call starts
    // setMessage("Logging in..."); // Display the logging in message
  
    try {
      const response = await axios.post("/api/login", data, {
        withCredentials: true,
      });
  
      if (response.data.status === "success") {
        const authToken = response.data.auth_token; // Extract auth_token from the response
  
        // Store auth token in localStorage
        if (authToken) {
          localStorage.setItem("auth_token", authToken);
          // console.log("Login successful! Token stored in localStorage.");
        }
  
        // setMessage("Login successful!");
        router.push("/dashboard"); // Redirect to the dashboard

        toast({
          title: "You are logged in !",
          description: "redirecting to dashboard.....",
          variant: "default",
        });
  
      } else {
        // setMessage(response.data.message);
        toast({
          title: "Login Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: "An error occurred while logging in.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Set loading to false after the API call completes
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="flex items-center justify-center min-h-[100dvh] relative bg-background overflow-hidden">
{/* <RedirectToApp/> */}
      <GridPattern
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-0%] h-[100%] "
        )}
      />

      <Card
        className={cn(
          "w-full max-w-md mx-auto z-10",
          theme === "dark"
            ? "shadow-lg shadow-black"
            : "shadow-lg shadow-gray-300"
        )}
      >
        <CardHeader>
          <h1 className="text-sky-500 flex justify-between ">
 <GripHorizontal />
 <Image
  src="/image/favicon.ico"
  alt="Logo"
  width={50}
  height={60}
/>

          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center mx-auto space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className={`space-y-6 w-full ${loading && 'opacity-50 pointer-events-none'}`}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <div className="flex items-center space-x-2">
                <Mail className="text-gray-500 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-2 rounded-none"
                  {...register("email", {
                    required: true,
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <div className="flex items-center space-x-2">
                <Lock className="text-gray-500 w-4 h-4" />
                <div className="relative w-full">
                  <Input
                    id="password"
                    type={passwordVisible ? "text" : "password"}
                    placeholder="*********"
                    className="w-full p-2 rounded-none"
                    {...register("password", { required: true })}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              className="flex items-center justify-center mx-auto w-full max-w-xs bg-sky-400 text-white px-4 py-2 rounded-md dark:bg-sky-600 hover:bg-sky-500 dark:hover:bg-sky-700 transition-colors duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Verifying.....
                </>
              ) : (
                <>
                  Login &nbsp; <Send />
                </>
              )}
            </Button>
            <span className="flex items-center justify-center mx-auto text-[8px] opacity-30 font-mono">
            Beta Version | a.0.1 
            </span>
          </form>
        </CardContent>
      </Card>

      <ThemeToggleButton className="absolute bottom-8 left-1/2 ease-in duration-300" />

    </div>
  );
}
