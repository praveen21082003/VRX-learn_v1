import React from "react";
import Icon from "../Icon";
import { Link, useLocation } from "react-router-dom";

import { roleNavigation } from "@/config/headerMenu";


function HeaderUserMenu({role}) {
    const location = useLocation();

    


    const navigationLinks = roleNavigation[role] || [];

    return (
        <nav className="flex items-center gap-8 text-[#fafaf8d3]">
            {navigationLinks.map((link) => {
                const icon = link.icon;
                const isActive = location.pathname === link.path;

                return (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`flex items-center gap-2 transition-colors
              ${isActive
                                ? "text-white border-b-2 border-white"
                                : "hover:text-white"
                            }
            `}
                    >
                        <Icon name={icon} width="24" height="24" />
                        <span className="text-h5">{link.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default HeaderUserMenu;
