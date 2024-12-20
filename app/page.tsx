'use client'


import { useRouter } from "next/navigation";
import LoginPage from "./components/loginpage";
import { useEffect } from "react";



// The JWT token you provide


export default function App() {
   const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('auth_token');
  
      if (!token) {
        router.push('/');
      }else if(token){
        router.push('/dashboard');

      }
    }, []);
  
    //
  

  return (
<>
<LoginPage/>
</>
  );
}
