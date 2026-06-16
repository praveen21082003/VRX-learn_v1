import React from "react";
import { InputWarnMessage, Icon } from "@/components/ui";
import clsx from "clsx";

function TextArea({
    label,
    placeholder,
    value,
    onChange,
    warning,
    rows = 4,
    maxLength,
    autoResize = false,
    showCount = false,
    ...props
}) {
    const handleInput = (e) => {
        if (autoResize) {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
        }
    };

    const limitExceeded =
        maxLength && value?.length > maxLength;


    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-semibold">
                    {label}
                </label>
            )}

            <div className="relative">
                <textarea
                    rows={rows}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onInput={handleInput}
                    // maxLength={maxLength}
                    className="w-full border text-body bg-input-bg border-input-border rounded p-3 focus:outline-none focus:ring-1 focus:ring-brand max-h-96"
                    {...props}
                />

                {showCount && (
                    <span className={clsx('absolute bottom-2 right-3 text-caption', limitExceeded ? 'text-[#D32F2F] font-semibold' : 'text-gray-500')}>
                        ({value?.length || 0}/{maxLength})
                    </span>
                )}
            </div>

            {warning && (
                <InputWarnMessage message={warning} />
            )}
        </div>
    );
}

export default TextArea;