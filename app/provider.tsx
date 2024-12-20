// Global provider for the entire system, ensuring scalability and efficiency while wrapping the entire system in different providers.
"use client";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import React from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
             <ThemeProvider attribute="class" 
              defaultTheme="light"
             > 
            <TooltipProvider>
            {children}

            </TooltipProvider>

            <Toaster/>
            </ThemeProvider>
    );
};
