// components/Navbar.jsx
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";


export default function Navbar() {
    const navigate = useNavigate();
    const logoutPage = ()=>{
        localStorage.clear();
        navigate('/login');

    }

    return (
        <nav className="w-full bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center h-16 justify-between">

                    {/* Left: Logo */}
                    <div className="flex-shrink-0">
                        <a href="/" className="font-bold text-xl text-[#1AA39A]">
                            MyApp
                        </a>
                    </div>

                    {/* Center: Navigation Menu */}
                    <NavigationMenu>
                        <NavigationMenuList className="flex space-x-6">
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/about" className="text-gray-700 hover:text-[#1AA39A]">
                                    About
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/funds" className="text-gray-700 hover:text-[#1AA39A]">
                                    Funds
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink href="/contact" className="text-gray-700 hover:text-[#1AA39A]">
                                    Contact
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>

                    {/* Right: Logout Button */}
                    <div>
                        <button
                            onClick={logoutPage}
                            className="px-4 py-2 bg-[#1AA39A] text-white rounded hover:bg-[#178f8a] transition"
                        >
                            Logout
                        </button>
                    </div>

                </div>
            </div>
        </nav>


    );
}
