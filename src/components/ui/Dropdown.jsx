import clsx from "clsx";
import Icon from "./Icon";
import { usePermission } from "@/hooks/usePermission"
import { useEffect, useRef, useState } from "react";

export default function Dropdown({ buttons, closeDropdown }) {
    const { can } = usePermission();
    const dropdownRef = useRef(null);
    const [openUpwards, setOpenUpwards] = useState(false);


    useEffect(() => {
        if (!dropdownRef.current) return;

        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.top;
        const dropdownHeight = rect.height;

        if (spaceBelow < dropdownHeight + 20) {
            setOpenUpwards(true);
        } else {
            setOpenUpwards(false);
        }
    }, []);




    return (
        <div
            // className="
            //   absolute top-full mt-3
            //   w-full min-w-36 z-20 bg-white border-[#E0E0E0] border text-black text-sm  
            //   shadow-lg overflow-hidden
            // "
            ref={dropdownRef}
            className={clsx(
                'absolute w-full min-w-36 z-20 bg-background border border-default text-main text-sm  overflow-hidden',
                openUpwards
                    ? "bottom-full rounded-t mb-2"
                    : "top-full mt-2 rounded-b"
            )}
        >
            {buttons.map((button) => {
                const hasPermission = !button.permission || can(button.permission)

                return (
                    <button
                        key={button.key}
                        className={clsx('flex gap-1 p-3 h-10 items-center w-full text-sm hover:bg-gray-100 dark:hover:bg-[#334155]',
                            !hasPermission ? 'opacity-50 cursor-default' : 'font-semibold hover:text-primary dark:hover:text-gray-300 cursor-pointer'
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (!hasPermission) return;
                            button.onClick?.();
                            closeDropdown?.();
                        }}
                        disabled={!hasPermission}

                    >
                        <Icon name={button.icon} height="24" width="24" className="text-muted-foreground" />
                        {button.title}
                    </button>

                )

            })}
        </div>
    );
}
