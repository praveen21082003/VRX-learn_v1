import React, { useState } from "react";
import { Button, Icon } from "@/components/ui"
import HeaderUserMenu from "./HeaderUserMenu";
import BreadcrumbMenu from "./BreadcrumbMenu";
import HeaderProfile from "./HeaderProfile";
import { useAuth } from '@/context/AuthContext'
import Sidebar from "@/components/ui/Header/Sidebar";
import { useTheme } from "../../../context/ThemeProvider";
import { getProfileDropdown } from "@/config/dropdownButtons";
import { Link, useNavigate } from "react-router-dom";
import { useBreadcrumbs } from "@/context/BreadcrumbContext";
import { usePermission } from "@/hooks/usePermission";

import LogOut from '@/pages/auth/LogOut'

function Header({ menu, headerContent }) {

    const navigate = useNavigate();
    const { breadcrumbs } = useBreadcrumbs();
    const { can } = usePermission();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogout, setShowLogout] = useState(false);

    const { user, role, viewRole, setViewRole, loading } = useAuth();

    const { darkMode, toggleTheme } = useTheme();




    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen)
    }

    const handleSwitchAccount = () => {
        if (viewRole === "trainee") {
            // switch back to actual role
            setViewRole(role);
        } else {
            // switch to trainee view
            setViewRole("trainee");
        }
        navigate("/dashboard");
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
        <header className="sticky top-0 z-50 flex h-12.5 w-full items-center justify-between bg-brand px-4 md:px-10 text-[#FAFAF8]">

            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            <Sidebar open={sidebarOpen} role={role} toggleSidebar={toggleSidebar} darkMode={darkMode} buttons={buttons} />



            <div className="flex items-center gap-3 md:gap-6 flex-1 min-w-0">

                <div className="xl:hidden">
                    <Button
                        frontIconName="charm:menu-hamburger"
                        frontIconHeight="26"
                        frontIconWidth="26"
                        bgClass=""
                        textClass=""
                        onClick={toggleSidebar}
                    />
                </div>

                <Link to="/dashboard" className="shrink-0 flex items-center gap-2">
                    <img
                        src="/logo-white.svg"
                        alt="Logo"
                        className="h-7 md:h-10"
                    />

                    <span className="border-[0.8px] rounded-full px-2 py-0.5 text-small">
                        BETA v1.0
                    </span>
                </Link>

                {!menu && !headerContent ? (
                    <div className="hidden md:block min-w-0 flex-1">
                        <BreadcrumbMenu items={breadcrumbs} />
                    </div>

                ) : (
                    headerContent
                )}

            </div>

            <div className="flex items-center shrink-0 gap-3 md:gap-6">

                {/* user menu */}
                {menu && (
                    <div className="hidden xl:block">
                        <HeaderUserMenu role={role} viewRole={viewRole} />
                    </div>
                )}

                {/* report button */}
                {!headerContent && (
                    <button className="flex gap-2 items-center text-label-sm text-surface-80 hover:text-surface hover:cursor-pointer" onClick={() => navigate("/report-problem")}>
                        <Icon name="si:flag-alt-4-line" size="18" />
                        <span className="hidden sm:block">Report a problem</span>
                    </button>
                )}

                {/* profile button */}
                <HeaderProfile role={role} viewRole={viewRole} user={user} setViewRole={setViewRole} loading={loading} buttons={buttons} />
            </div>

            <LogOut
                isOpen={showLogout}
                onClose={() => setShowLogout(false)}
            />

        </header >
    );
}

export default Header;