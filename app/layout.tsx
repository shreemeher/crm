import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./provider";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "SMJ-CRM",
  description: "CRM Application for Enterprises",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
{
  // const router = useRouter();
  
  //   useEffect(() => {
  //     const token = localStorage.getItem('auth_token');
  
  //     if (!token) {
  //       router.push('/');
  //     }else if(token){
  //       router.push('/dashboard');

  //     }
  //   }, [router]);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > 
        <Providers>
      {children}
      </Providers>


      </body>
    </html>
    
  );
}
