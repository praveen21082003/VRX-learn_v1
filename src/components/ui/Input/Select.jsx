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
    const [dropUp, setDropUp] = useState(false); // overflow drop up and down


    // handle toggle function for drop up or down
    const handleToggle = () => {
        if (!open) {
            const rect = ref.current?.getBoundingClientRect();

            const dropdownHeight = Math.min(
                options.length * 40,
                250
            );

            const spaceBelow =
                window.innerHeight - rect.bottom;

            const spaceAbove =
                rect.top;

            if (spaceBelow >= dropdownHeight) {
                // enough space below
                setDropUp(false);
            }
            else if (spaceAbove >= dropdownHeight) {
                // enough space above
                setDropUp(true);
            }
            else {
                // neither side has enough space
                // keep dropdown below and allow scroll
                setDropUp(false);
            }
        }

        toggle();
    };




    return (
        <div className="relative" ref={ref}>
            {inputLabel &&
                <label className="block text-h5 mb-1 text-main dark:text-white">
                    {inputLabel}
                </label>
            }

            <div
                className={`no-select flex items-center ${inputheight && inputheight} ${borderClass ? "border" : "border-2"} ${inputLabel === "" && "mt-2"} ${borderClass} rounded ${paddingClass} gap-2 min-w-44 ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
                onClick={handleToggle}
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
                <div
                    className={`
                        absolute
                        w-full
                        bg-background
                        border
                        border-default
                        shadow-md
                        z-50
                        max-h-60
                        overflow-y-auto
                        ${dropUp ? "bottom-full mb-1" : "top-full mt-1"}
                    `}
                >
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