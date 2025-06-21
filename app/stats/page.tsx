"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Navbar } from "../components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import decode from "../hooks/decode";
import { extractPermissions, Permission } from "../hooks/permissions";

export default function StatsPage() {
  const router = useRouter();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/");
      return;
    }
    try {
      const decoded = decode();
      const perms = extractPermissions(decoded);
      setPermission(perms);
      if (decoded?.email) setUserEmail(decoded.email);
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/curry", {
          headers: {
            "k-e-y": process.env.NEXT_PUBLIC_API_KEY,
          },
        });
        setCustomerCount(Array.isArray(response.data) ? response.data.length : 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen text-black dark:text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <Skeleton className="h-40 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black dark:text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-start p-4">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Overview of your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Customers</span>
              <span>{customerCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Permission to view customers</span>
              <span>{permission?.Customers?.acccess ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Time</span>
              <span>{currentTime.toLocaleString()}</span>
            </div>
            {userEmail && (
              <div className="flex justify-between">
                <span>User</span>
                <span>{userEmail}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
