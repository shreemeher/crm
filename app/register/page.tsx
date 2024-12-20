"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import axios from "axios";
import { Loader2, Phone, Mail, User, Calendar, Home, User2Icon, CheckCircle, XCircle } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useRouter } from "next/navigation";
import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import GridPattern from "@/components/ui/grid-pattern";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type FormData = {
  fname: string;
  lname: string;
  phone: string;
  email: string;
  dob: string;
  doa: string;
  street: string;
  apartment: string;
  city: string;
  area: string;
  state: string;
  pincode: string;
  country: string;
  gender: string;
  mS: string;
  idProof: string;
  idProofValue: string;
};
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
export default function RegisterForm() {
  // 
  const router = useRouter();
  
    useEffect(() => {
      const token = localStorage.getItem('auth_token');
  
      if (!token) {
        router.push('/');
      }else if(token){
        return;

      }
    }, []);
  // 
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true); // Add state to track data loading
  const { register, handleSubmit, setValue, reset } = useForm<FormData>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobnum, setMobnum] = useState("");
  const [phoneValidating, setPhoneValidating] = useState(false);
  const [phoneExists, setPhoneExists] = useState(false);
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState([]);
// 
const fetchData = async () => {
  try {
    const response = await axios.get('/api/curry', {
      headers: {
        'k-e-y': process.env.NEXT_PUBLIC_API_KEY, // Replace with your actual value
      },
    });
    setData(response.data)
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}add.php`;
      const response = await axios.post(apiUrl, data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (response.data.success) {
        setDrawerOpen(true);
      } else {
        toast({
          title: "Registration Failed",
          description:
            response.data.message ||
            "There was an issue with your registration. Please try again.",
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Registration Failed",
        description:
          "There was an issue with your registration. Please try again.",
        variant: "destructive",
      });
      console.log("error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setDataLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}otp.php`;
      const response = await axios.post(
        apiUrl,
        { mobnum: mobnum, otp: otp },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.data.success) {
        setDrawerOpen(false);
        toast({
          title: "Registration Successful",
          description: "Verification and registration are complete.",
        });
        reset();
        router.push(`/success/${parseInt(mobnum, 10).toString(16)}`)
        setMobnum("");
      } else {
        toast({
          title: "Registration Failed",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (e) {
      toast({
        title: "Registration Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      console.log("error", e);
    } finally {
      setDataLoading(true);
      setLoading(false);
    }
  };

  // Fetch country, state, and city data
  useEffect(() => {
    setCountries(Country.getAllCountries());
    setIsMounted(true);
    fetchData();
    setDataLoading(true); // Start loading state
  }, []);

  useEffect(() => {
    if (isMounted) {
      setTimeout(() => {
      setDataLoading(false);
      }, 2000); // Set dataLoading to false after data is fetched
    }
  }, [countries]);

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setStates(State.getStatesOfCountry(countryCode));
    setCities([]);
    setValue("country", countryCode);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    setCities(City.getCitiesOfState(selectedCountry, stateCode));
    setValue("state", stateCode);
  };

  const handleCityChange = (cityName: string) => {
    setValue("city", cityName);
  };

  const validatePhoneNumber = async (phone: string) => {
    setPhoneValidating(true);
    setPhoneExists(false);

    const exists = data.some((item: User) => item?.mobnum === phone);

    setTimeout(() => {
      setPhoneValidating(false);
      setPhoneExists(exists);
    }, 500);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phone = e.target.value;
    setMobnum(phone);
    if (phone.length === 10) {
      validatePhoneNumber(phone);
    } else {
      setPhoneExists(false);
    }
  };

  if (!isMounted || dataLoading) {
    // Show loader if data is still loading
    return (
      <div>
        <Navbar />
        <GridPattern
               className={cn(
                 "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
                 "inset-x-0 inset-y-[-0%] h-[100%] "
               )}
             />
        <div className="flex justify-center items-center h-[100vh]">
          {/* <Loader2 className="animate-spin text-sky-400" size={48} /> */}
          <Skeleton className="h-40 w-40 rounded" />
        </div>
      </div>
    );
  }
  return (
    <div >
      <Navbar />
      <GridPattern
               className={cn(
                 "[mask-image:radial-gradient(700px_circle_at_center,white,transparent)]",
                 "inset-x-0 inset-y-[-0%] h-[100%] "
               )}
             />
      <div className="max-w-2xl mx-auto p-7   shadow-md  w-full sm:w-11/12 md:w-auto relative bg-white dark:bg-[#09090B] ">
       
        <span className=" ml-2 mb-4 flex justify-between font-serif">
        <span className="text-sky-700 dark:text-sky-300 font-extralight">Enrollment</span>
         <User2Icon className="text-sky-400 dark:text-sky-600"/>
        </span>
        <Separator className="bg-sky-400 dark:bg-sky-900"/>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 dark:text-gray-400 mt-6"
        >
          {/* Phone Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number Field */}
            <div>
              <Label
                htmlFor="phone"
                className="flex items-center space-x-2 mb-2"
              >
                <Phone className="w-4 h-4" />
                <span>
                  Phone Number <span className="text-red-500">*</span>
                </span>
              </Label>
              <div className="flex items-center space-x-2 mt-1">
                <span className="inline-block p-2   rounded-l-md">
                  +91
                </span>
                <Input
                  id="phone"
                  {...register("phone", { required: true })}
                  placeholder="Phone Number"
                  onChange={handlePhoneChange}
                  required
                  value={mobnum}
                  // onChange={(e) => setMobnum(e.target.value)}
                  className={cn(
                    "flex-1",
                    phoneExists ? "border-red-500 dark:border-red-800" : "border"
                  )}
                  maxLength={10}
                  minLength={10}
                />
            {phoneValidating && <Loader2 className="animate-spin" />}
              {!phoneValidating && phoneExists && <XCircle className="text-red-500 dark:text-red-800" />}
              {!phoneValidating && !phoneExists && mobnum.length === 10 && (
                <CheckCircle className="text-green-500" />
              )}
              </div>
              {!phoneValidating && phoneExists && <span className="text-red-300 text-xs">Phone Number already registered</span>}
            </div>

            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="flex items-center space-x-2 mb-2"
              >
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="Email"
              />
            </div>
          </div>

          {/* Two Input Row for First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="fname"
                className="flex items-center space-x-2 mb-2"
              >
                <User className="w-4 h-4" />
                <span>
                  First Name <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                id="fname"
                {...register("fname", { required: true })}
                placeholder="First Name"
                required
              />
            </div>
            <div>
              <Label
                htmlFor="lname"
                className="flex items-center space-x-2 mb-2"
              >
                <User className="w-4 h-4" />
                <span>
                  Last Name <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                id="lname"
                {...register("lname", { required: true })}
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dob" className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Date of Birth <span className="text-red-500">*</span>
                </span>
              </Label>
              <Input
                id="dob"
                {...register("dob", { required: true })}
                type="date"
                required
              />
            </div>
            <div>
              <Label htmlFor="doa" className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Date of Anniversary</span>
              </Label>
              <Input id="doa" {...register("doa")} type="date" />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <Label className="mb-2">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <Label className="mb-2">Marital Status</Label>
              <Select onValueChange={(value) => setValue("mS", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Marital Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Address Details */}
          <div className="space-y-4">
            <Label
              htmlFor="street"
              className="flex items-center space-x-2 mb-2"
            >
              <Home className="w-4 h-4" />
              <span>
                Address <span className="text-red-500">*</span>
              </span>
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="street"
                {...register("street")}
                placeholder="Street Number"
                required
              />
              <Input
                id="area"
                {...register("area")}
                placeholder="Area/Locality"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select onValueChange={handleCountryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.isoCode} value={country.isoCode}>
                        {country.name} - {country.flag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Select
                  onValueChange={handleStateChange}
                  disabled={!selectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                onValueChange={handleCityChange}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                id="pincode"
                {...register("pincode")}
                placeholder="Pincode"
                required
              />
            </div>
          </div>

          <Separator className="bg-sky-400 dark:bg-sky-900"/>


          <Button type="submit" className="bg-sky-400 text-white px-4 py-2 rounded-md dark:bg-sky-600 hover:bg-sky-500 dark:hover:bg-sky-700 transition-colors duration-300 ease-in-out" disabled={loading || !phoneValidating && phoneExists}>
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                Please wait
              </>
            ) : (
              "Register"
            )}
          </Button>
        </form>

        {/* OTP Dialog */}
        <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} 
         dismissible={false}
          >
          <DrawerContent 
           onEscapeKeyDown={(e) => e.preventDefault()}
          //  onPointerDown={(e) => e.preventDefault()}
           onInteractOutside={(e) => e.preventDefault()}
          >
            <DrawerHeader>
              <DrawerTitle>Verification Pending</DrawerTitle>
              <DrawerDescription>
                An OTP has been sent to your phone. Please verify.
              </DrawerDescription>
            </DrawerHeader>
            <label className="p-2 w-full sm:w-3/5 mx-auto m-2">Enter OTP</label>
            <Input
              placeholder="- - - -"
              maxLength={4}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="p-2 w-full sm:w-3/5 mx-auto text-center"
            />

            <DrawerFooter>
              <Button
                onClick={handleOtpSubmit}
                className="p-2 w-full sm:w-3/5 mx-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Verifying
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
              <DrawerClose asChild>
                <Button
                  variant="link"
                  className="p-2 w-full sm:w-3/5 mx-auto"
                  onClick={() => {
                    setDataLoading(true);
                    reset();
                    setDrawerOpen(false);
                    router.push(`/success/${parseInt(mobnum, 10).toString(16)}`)
                    setMobnum("");
                    setOtp("")
                  }}
                >
                  verify later
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
