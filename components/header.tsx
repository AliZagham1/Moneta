"use client";
import { Loader2 } from "lucide-react";
import { ClerkLoaded, UserButton, ClerkLoading } from "@clerk/nextjs";
import { HeaderLogo } from "./header-logo";
import { Navigation } from "./navigation";
import { WelcomeMsg } from "./welcome-msg";
import {Filters} from "./filters";

const DotIcon = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor">
        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
      </svg>
    )
  }


export const Header = () => {
    return (
        <header className ="bg-gradient-to-b from-violet-700 to-violet-700 px-4 py-8 lg:px-14 pb-36">
          <div className= "max-w-screen-2xl mx-auto">
            <div className="w-full flex items-center justtify-between mb-14">
                <div className = "flex items-center lg:gap-x-16">
                    <HeaderLogo />
                    <Navigation/>

                </div>
               
                <div className = "ml-auto">
                <ClerkLoaded>  
                   <UserButton >
                    <UserButton.MenuItems>
                        <UserButton.Action
                           label="Open chat"
                           labelIcon={<DotIcon />}
                            onClick={() => alert('init chat')}
                           />
                    </UserButton.MenuItems>
                    


                   </UserButton>
                </ClerkLoaded>


                </div>

                
                <ClerkLoading>
                    <Loader2 className = " size-8 animate-spin text-slate-400" />
                </ClerkLoading>
            
                
            
                
              
                
                

            </div>
            <WelcomeMsg />
            <Filters/>
          </div>
        </header>
    )
}

export default Header;

