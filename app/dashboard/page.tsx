"use client";
import { useRouter } from "next/navigation";
import { Navbar } from "../components/Navbar";
import { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card"; // Assuming this is from ShadCN UI
import Link from "next/link";
import { extractPermissions, Permission } from "../hooks/permissions";
import decode from "../hooks/decode";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming this is from ShadCN UI
import {  BookMarked, LayoutList, BarChart3 } from "lucide-react";

export default function DashboardLayout() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  // State to store permissions and loading state
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    setToken(storedToken);
    
    if (!storedToken) {
      router.push("/");
    }
  }, [router]);

  // Second useEffect to handle permissions after token is available
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = decode();
        const extractedPermissions = extractPermissions(decodedToken);
        setPermission(extractedPermissions);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error decoding token:', error);
        router.push("/");
      }
    }
  }, [token, router]);
  // console.log('ac',permission?.Customers?.acccess)

  // Show skeleton loader while permissions are being fetched
  if (loading) {
    return (
      <div className="min-h-screen text-black dark:text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-start justify-start p-4">
          {/* Grid for Skeleton loader */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 m-10">
            {[...Array(4)].map((index) => (
             <Skeleton className="h-40 w-40 rounded" key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen text-black dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-start justify-start p-4 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  m-10">
        <Link href="/register">
        <Card className="w-full h-auto p-6 rounded-md border ">
            <CardTitle className="font-serif flex"><BookMarked />&nbsp;Registration</CardTitle>
            <CardDescription className="m-3 flex">
             Customer registration form
            </CardDescription>
          </Card>
          </Link>
          {permission?.Customers?.acccess ? (
            <Link href="/list">
            <Card className="w-full h-auto p-6 rounded-md  ">
              <CardTitle className="font-serif flex"><LayoutList />&nbsp;Customer List</CardTitle>
              <CardDescription  className="m-3 flex">
                View Customers
              </CardDescription>
            </Card>
            </Link>
          ) : (
           ''
          )}
          <Link href="/stats">
            <Card className="w-full h-auto p-6 rounded-md border">
              <CardTitle className="font-serif flex"><BarChart3 />&nbsp;Stats</CardTitle>
              <CardDescription className="m-3 flex">
                Application statistics
              </CardDescription>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
