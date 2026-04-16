import React, { useState } from "react";
import { Button } from "@/components/ui"
import HeaderUserMenu from "./HeaderUserMenu";
import BreadcrumbMenu from "./BreadcrumbMenu";
import HeaderProfile from "./HeaderProfile";
import { useAuth } from '@/context/AuthContext'
import Sidebar from "@/components/ui/Header/Sidebar";
import { useTheme } from "../../../context/ThemeProvider";
import { getProfileDropdown } from "@/config/DropdownButtons";
import { useNavigate } from "react-router-dom";

import LogOut from '@/pages/auth/LogOut'

function Header({ menu, breadcrumbs = [] }) {

    const navigate = useNavigate();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const { user, role, viewRole, setViewRole, loading } = useAuth();

    const { darkMode, toggleTheme } = useTheme();




    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleSwitchAccount = () => {
        if (viewRole === "trainee") {
            setViewRole(role);
            navigate("/dashboard");
        } else {
            setViewRole("trainee");
            navigate("/dashboard");
        }
    };

    const onLogoutClick = () => {
        setShowLogout(true);
    };


    const buttons = getProfileDropdown({
        mode: darkMode,
        handleMode: toggleTheme,
        role,
        viewRole,
        onSwitch: handleSwitchAccount,
        onLogoutClick
    });

    return (
        <header className="sticky top-0 z-40 flex h-[50px] w-full items-center justify-between bg-brand 
        px-4 md:px-10 text-[#FAFAF8]">

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar open={sidebarOpen} role={role} toggleSidebar={toggleSidebar} darkMode={darkMode} buttons={buttons} />



            <div className="flex items-center gap-3 md:gap-10">

                <div className="lg:hidden   ">
                    <Button
                        frontIconName="charm:menu-hamburger"
                        frontIconHeight="26"
                        frontIconWidth="26"
                        bgClass=""
                        textClass=""
                        onClick={toggleSidebar}
                    />
                </div>


                <img
                    src="/logo-white.svg"
                    alt="Logo"
                    className="h-7 md:h-10 cursor-pointer"
                />


                {!menu && (
                    <div className="hidden md:block">
                        <BreadcrumbMenu items={breadcrumbs} />
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 md:gap-10">
                {menu && (
                    <div className="hidden md:block">
                        <HeaderUserMenu role={role} />
                    </div>
                )}
                <HeaderProfile role={role} viewRole={viewRole} user={user} setViewRole={setViewRole} loading={loading} buttons={buttons} />
            </div>

            <LogOut
                isOpen={showLogout}
                onClose={() => setShowLogout(false)}
            />

        </header>
    );
}

export default Header;