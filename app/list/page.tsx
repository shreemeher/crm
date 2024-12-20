"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Navbar } from "../components/Navbar";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import decode from "../hooks/decode";
import { extractPermissions, Permission } from "../hooks/permissions";
// 
interface User {
  custid: string;
  fname: string;
  lname: string;
  mobnum: string;
  email?: string;
  dob?: string;
  doa?: string;
  gender?: string;
  mstatus?: string;
  street?: string;
  area?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  verify: string;
}


export default function TableWithCheckboxes() {
  // 
  const router = useRouter();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  

  useEffect(() => {
    // Handle localStorage access safely on client side
    const token = localStorage.getItem("auth_token");
    
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decodedToken = decode();
      const extractedPermissions = extractPermissions(decodedToken);
      setPermission(extractedPermissions);
    } catch (error) {
      console.error('Error decoding token:', error);
      router.push("/");
    }
  }, []); // Run once on mount

  // Second useEffect to handle permission-based routing
  useEffect(() => {
    if (permission !== null) { // Only run when permission is loaded
      if (!permission?.Customers?.acccess) {
        router.push("/dashboard");
      }
      setLoading(false);
    }
  }, [permission, router]);
    // console.log('ac',permission?.Customers?.acccess)

    // 
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState({
    gender: "all",
    verified: "all",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/curry", {
        headers: {
          "k-e-y": process.env.NEXT_PUBLIC_API_KEY,
        },
      });
      setTimeout(() => {
        setUsers(response.data);
        setFilteredUsers(response.data);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Apply search and filters
    const filtered = users.filter((user) => {
      const matchesSearch =
        user.fname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.mobnum.includes(searchTerm);

      const matchesGender =
        filters.gender === "all" ||
        user.gender?.toLowerCase() === filters.gender.toLowerCase();

      const matchesVerified =
        filters.verified === "all" ||
        (filters.verified === "verified" && user.verify === "1") ||
        (filters.verified === "not_verified" && user.verify === "0");

      return matchesSearch && matchesGender && matchesVerified;
    });

    setFilteredUsers(filtered);
  }, [searchTerm, filters, users]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map((user) => user.mobnum));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectUser = (mobnum: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, mobnum]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== mobnum));
    }
  };

  const isAllSelected =
    filteredUsers.length > 0 && filteredUsers.length === selectedUsers.length;

  function formatDate(dateString?: string): string {
    if (!dateString) return "Not Provided";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  function formatAddress(user: User): string {
    const { street, area, city, state, country, pincode } = user;
    return (
      [street, area, city, state, country, pincode]
        .filter(Boolean)
        .join(", ") || "Not Provided"
    );
  }

  return (
    <div>
      <Navbar />
      <div className="mx-auto w-full sm:w-[90%] mt-3">
        <div className="flex  gap-4 mb-4 p-4 bg-white dark:bg-[#09090B] border-b-2  sticky top-[70px] shadow-sm dark:shadow-xl z-10">
          {/* Search Box with Label */}
          <div className="flex flex-col ">
            <label
              htmlFor="search"
              className="text-sm font-medium text-gray-600 dark:text-gray-400"
            >
              Search Users
            </label>
            <Input
              id="search"
              type="text"
              placeholder="Search by name or number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 "
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Gender Filter with Label */}
            <div className="flex flex-col">
              <label
                htmlFor="genderFilter"
                className="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Gender
              </label>
              <Select
                value={filters.gender}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger className="w-32 mt-1">
                  {filters.gender
                    ? filters.gender.charAt(0).toUpperCase() +
                      filters.gender.slice(1)
                    : "Gender"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Verified Filter with Label */}
            <div className="flex flex-col">
              <label
                htmlFor="verifiedFilter"
                className="text-sm font-medium text-gray-600 dark:text-gray-400"
              >
                Verification Status
              </label>
              <Select
                value={filters.verified}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, verified: value }))
                }
              >
                <SelectTrigger className="w-40 mt-1">
                  {filters.verified
                    ? filters.verified.charAt(0).toUpperCase() +
                      filters.verified.slice(1).replace("_", " ")
                    : "Verified"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="not_verified">Not Verified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Table className="dark:text-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked as boolean)
                  }
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>DOA</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Married</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Verified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-4 rounded" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-6" />
                    </TableCell>
                  </TableRow>
                ))
              : filteredUsers.map((user) => (
                  <TableRow key={user.custid}>
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.mobnum)}
                        onCheckedChange={(checked) =>
                          handleSelectUser(user.mobnum, checked as boolean)
                        }
                        aria-label={`Select ${user.fname} ${user.lname}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={
                            user.gender === "male"
                              ? "/image/male.png"
                              : user.gender === "female"
                              ? "/image/female.png"
                              : ""
                          }
                          alt={user.fname}
                        />
                      </Avatar>
                    </TableCell>
                    <TableCell >
                      {user.fname} {user.lname}
                    </TableCell>
                    <TableCell>{user.mobnum}</TableCell>
                    <TableCell>
                      {user.email || (
                        <span className="text-xs opacity-50 font-mono">
                          Not Provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.dob)}</TableCell>
                    <TableCell>
                      {formatDate(user.doa) === "Not Provided" ? (
                        <span className="text-xs opacity-50 font-mono">
                          Not Provided
                        </span>
                      ) : (
                        formatDate(user.doa)
                      )}
                    </TableCell>
                    <TableCell className="first-letter:uppercase">
                      {user.gender || (
                        <span className="text-xs opacity-50 font-mono">
                          Not Provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="first-letter:uppercase">
                      {user.mstatus || (
                        <span className="text-xs opacity-50 font-mono">
                          Not Provided
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatAddress(user)}</TableCell>
                    <TableCell>
                      {user.verify === "0" ? (
                        <Badge className="bg-red-500 dark:bg-red-600 text-black dark:text-gray-200 font-thin text-xs font-mono">
                          NO
                        </Badge>
                      ) : user.verify === "1" ? (
                        <Badge className="bg-green-500 dark:bg-green-600 text-black dark:text-gray-200 font-thin text-xs font-mono">
                          YES
                        </Badge>
                      ) : (
                        "--"
                      )}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
