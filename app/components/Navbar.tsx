'use client'
// import { useState } from 'react';
import ThemeToggleButton from '@/components/ThemeToggleButton';
// import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
// import userImg from '../images/user.png'
import { AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import decode from '../hooks/decode';
import { Separator } from '@/components/ui/separator';

export const Navbar = () => {
  // const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
const decodedToken = decode();
  const handleLogout = () => {
   
    localStorage.removeItem('auth_token');
  
    // Redirect to the login page
    router.push('/');
  };
  return (
    <header className="dark:bg-[#09090B] bg-white dark:text-gray-300 shadow-md dark:shadow-black p-4 flex justify-between items-center sticky top-0 z-50">
      <h1 className="text-xl flex">
     
      {/*  */}
      <Tooltip>
    <TooltipTrigger>
    <Link href={'/dashboard'}><LayoutDashboard className='mx-7' /></Link>
    </TooltipTrigger>
    <TooltipContent>
      <p>Dashboard</p>
    </TooltipContent>
  </Tooltip>
      </h1>
      <div className="flex items-center space-x-4">
       <ThemeToggleButton/>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* <Button variant="outline" className="p-2 flex items-center"> */}
            <Avatar className='w-8 '>
      <AvatarImage src="/image/user.png" alt="user"  className='rounded-full'/>
      <AvatarFallback>HD</AvatarFallback>
    </Avatar>
              {/* <User2/> */}
            {/* </Button> */}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
          <DropdownMenuItem >
             {decodedToken?.email} 
              </DropdownMenuItem>
              <Separator/>
            <DropdownMenuItem onClick={handleLogout}  className='text-red-500 dark:text-red-700 m-0 cursor-pointer'>
              Logout &nbsp; <LogOut /> 
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
