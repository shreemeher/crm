'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
};

export default function RegisterForm() {
  const [otpSent, setOtpSent] = useState(false);
  const { toast } = useToast();
  const { register, handleSubmit, setError, watch, reset, setValue } = useForm<FormData>();
  const phone = watch('phone');

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await axios.post('/register', data);
      if (response.data.success) {
        reset();
        toast({ description: 'Registration Successful!' });
      }
    } catch (error) {
      toast({ description: 'Registration failed.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Phone Input */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <div className="flex items-center space-x-2">
            <span className="inline-block p-2 bg-gray-100 border border-gray-300 rounded-l-md">+91</span>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Phone Number"
              required
              className="rounded-l-none flex-1"
            />
          </div>
        </div>

        {/* Two Input Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fname">First Name</Label>
            <Input id="fname" {...register('fname')} placeholder="First Name" required />
          </div>
          <div>
            <Label htmlFor="lname">Last Name</Label>
            <Input id="lname" {...register('lname')} placeholder="Last Name" required />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} type="email" placeholder="Email" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" {...register('dob')} type="date" required />
          </div>
          <div>
            <Label htmlFor="doa">Date of Anniversary</Label>
            <Input id="doa" {...register('doa')} type="date" />
          </div>
        </div>
        <div>
          <Label style={{marginBottom:'3px'}}>Gender</Label>
          <Select onValueChange={(value) => setValue('gender', value)}>
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
        <Separator />

        {/* Address Details */}
        <div className="space-y-2">
          <Label htmlFor="street">Address</Label>
          <Input id="street" {...register('street')} placeholder="Street Number" required />
          <Input id="apartment" {...register('apartment')} placeholder="Apartment Name" />
          <Input id="area" {...register('area')} placeholder="Area/Locality" />

          <div className="grid grid-cols-2 gap-4">
          <div>
              {/* <Label>Country</Label> */}
              <Select onValueChange={(value) => setValue('country', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="USA">USA</SelectItem>
                  <SelectItem value="UK">UK</SelectItem>
                </SelectContent>
              </Select>
            </div>  
          <div>
              {/* <Label>State</Label> */}
              <Select onValueChange={(value) => setValue('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="State1">State1</SelectItem>
                  <SelectItem value="State2">State2</SelectItem>
                </SelectContent>
              </Select>
            </div>          
          </div>

          <div className="grid grid-cols-2 gap-4">
          <Input id="city" {...register('city')} placeholder="City" required />
            <Input id="pincode" {...register('pincode')} placeholder="Pincode" required />
          </div>
        </div>

        <Separator />

        

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </div>
  );
}
