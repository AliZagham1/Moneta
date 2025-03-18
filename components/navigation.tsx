"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useMedia } from "react-use";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";

import { NavButton } from "./nav-button";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "./ui/sheet";
import { Button } from "./ui/button";


const routes = [
    {
        href: "/",
        label: "Overview"
    },
   {
    href: "/transactions",
    label: "Transactions"
   },
   {
    href: "/accounts",
    label: "Accounts"
   },
   {
    href: "/categories",
    label: "Categories"
   },
   {
    href: "/settings",
    label: "Settings",

   }
]
export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const pathname = usePathname();
    const isMobile = useMedia("(max-width: 1024px)", false);


    const onClick = (href:string) => {
        router.push(href);
        setIsOpen(false);
    }


    if (isMobile) {
        return (
            <Sheet open = {isOpen} onOpenChange = {setIsOpen}>
                <SheetTrigger >
                    <div   className = " font-normal bg-transparent hover:bg-transparent hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white  focus:bg-white/30 transition    ">
                      <Menu className = "size-4" />
                    </div>
                </SheetTrigger>
                <SheetContent side = "left" className ="px-2">
                <DialogTitle className="text-lg font-bold">Navigation</DialogTitle>
                    <nav className = "flex flex-col gap-y-2 pt-6">
                 {
                    routes.map((route)=> (
                        <Button key = {route.href } onClick = {() => onClick(route.href)}  className={cn(
                            "w-full justify-start py-2 px-4 rounded-md text-white transition",
                            pathname === route.href
                                ? "font-bold underline" // Active route styles
                                :"hover-underline" // Inactive styles>
                        )}> 
                            {route.label}
                        </Button>
                    ))
                 }

                    </nav>
                 
                
                </SheetContent>
            </Sheet>

        )

    }
    return (
        <nav className = "hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => ( 
                <NavButton key = {route.href}
                href = {route.href}
                label = {route.label}
                isActive={pathname === route.href} />
            ))}

          

        </nav>
    )
}    