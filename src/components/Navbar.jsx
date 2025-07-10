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
                            Mutual Funds Task App
                        </a>
                    </div>
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
