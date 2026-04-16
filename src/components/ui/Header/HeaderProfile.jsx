

import { useEffect, useRef, useState } from "react";
import Dropdown from "../Dropdown";
import { Icon } from '@/components/ui';


import Pill from "./Pill";


export default function HeaderProfile({ user, role, viewRole, loading, buttons  }) {

    const [open, setOpen] = useState(false);
    const isMobile = window.innerWidth < 768

    const ref = useRef(null);
    

    if (loading) {
        return null;
    }



    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    return (
        <div ref={ref} className="relative flex items-center">

            {/* CLICK TARGET */}
            <div
                className="flex flex-row-reverse md:flex-row items-center gap-2 cursor-pointer select-none"
                onClick={(e) => {
                    e.stopPropagation();
                    setOpen(prev => !prev);
                }}
            >

                {user?.avatar ?
                    <img
                        src={user?.avatar}
                        alt="User profile"
                        className="h-10 w-10 rounded-full object-cover"
                    /> :
                    <Icon name="mingcute:user-4-fill" height="40" width="40" />
                }

                <span className="hidden md:block text-h5 max-w-28 truncate">{user?.username}</span>
                {role === "trainer" && (
                    <Pill viewRole={viewRole || role} />
                )}
                <span className="hidden md:block">
                    <Icon name="iconamoon:arrow-down-2" width="16px" height="16px" />
                </span>
            </div>

            {open && !isMobile && <Dropdown buttons={buttons} className="right-0 top-full mt-2" />}

        </div>
    );
}
