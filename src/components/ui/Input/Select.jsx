import { useState } from "react";
import { Icon } from "@/components/ui";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function FilterSelect({
    inputLabel,
    label,
    value,
    onChange,
    options,
    borderClass = "border-default",
    paddingClass = "px-3 py-2",
    inputWarning,
    disabled = false,
    inputheight,

}) {
    // const [open, setOpen] = useState(false);
    const [open, ref, setOpen, toggle] = useClickOutside(false);
    const selectedOption = options.find(opt => opt.value === value) || options[0];




    return (
        <div className="relative" ref={ref}>
            {inputLabel &&
                <label className="block text-h5 mb-2 text-main dark:text-white">
                    {inputLabel}
                </label>
            }

            <div
                className={`no-select flex items-center ${inputheight && inputheight} ${borderClass ? "border" : "border-2"} ${inputLabel === "" && "mt-2"} ${borderClass} rounded ${paddingClass} gap-2 min-w-44 ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={toggle}
            >
                <span className="flex items-center min-w-0 text-body text-muted">
                    <span className="font-medium shrink-0">
                        {label}
                    </span>

                    <span className="ml-1 truncate">
                        {selectedOption?.label}
                    </span>
                </span>
                <Icon
                    name="ep:arrow-down-bold"
                    height="12"
                    width="12"
                    className="text-body ml-auto"
                />
            </div>


            {!disabled && open && (
                <div className="absolute no-select mt-1 w-full bg-background border border-default shadow-md z-20">
                    {options.map((opt) => {
                        const isActive = value === opt.value;
                        return (<div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={`px-3 py-2 text-body cursor-pointer transition-colors
                                ${isActive
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-main"
                                }`}
                        >
                            {opt.label}
                        </div>)
                    })}
                </div>
            )}
        </div>
    );
}