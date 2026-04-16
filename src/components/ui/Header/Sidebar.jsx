import { Button, Icon } from '@/components/ui'
import { roleNavigation } from "@/config/headerMenu";
import { Link, useLocation } from "react-router-dom";

import clsx from 'clsx';

function Sidebar({ open, toggleSidebar, role, buttons, darkMode }) {

    const navigationLinks = roleNavigation[role] || [];
    const location = useLocation()


    return (
        <aside
            className={`
            fixed top-0 left-0 z-40 h-full w-68 p-4
            bg-background text-main shadow-lg
            transform transition-transform duration-300
            ${open ? "translate-x-0" : "-translate-x-full"}
        `}

        >
            <div className='flex justify-between items-center border-b border-default py-4 gap-2'>
                <div className='flex gap-2 items-center'>
                    <img
                        src={clsx(darkMode ? "/logo-white.svg" : "/VRX-logo.svg" )}
                        alt="Logo"
                        className="h-10 cursor-pointer"
                    />
                    <h2 className='text-[#3F3F3F] dark:text-white mt-1 text-h2'>VRX Learn</h2>
                </div>

                <Button
                    frontIconName="charm:cross"
                    frontIconHeight="26"
                    frontIconWidth="26"
                    bgClass=""
                    textClass="text-main"
                    onClick={toggleSidebar}
                />
            </div>
            <div className='flex flex-col justify-between h-full'>
                <nav className="flex flex-col gap-2 py-5 text-main w-full">
                    {navigationLinks.map((link) => {
                        const icon = link.icon;
                        const isActive = location.pathname === link.path;

                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors
                                ${isActive
                                        ? "bg-brand text-white"
                                        : "hover:bg-gray-100 hover:text-main"
                                    }`}
                            >
                                <Icon name={icon} width="24" height="24" />
                                <span className="text-sm font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className='mb-40 border-t border-default'>
                    {buttons.map((button) => {
                        const hasPermission = !button.permission || can(button.permission)

                        return (
                            <button
                                key={button.key}
                                className={clsx('flex gap-1 p-3 h-10 items-center w-full text-sm',
                                    !hasPermission ? 'opacity-50 cursor-default' : 'font-semibold cursor-pointer'
                                )}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    if (!hasPermission) return;
                                    button.onClick?.();
                                }}
                                disabled={!hasPermission}

                            >
                                <Icon name={button.icon} height="24" width="24" className="text-muted-foreground" />
                                {button.title}
                            </button>
                        )
                    })}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;