import React, { useState } from "react";
import InputWarnMessage from "./InputWarnMessage";
import Icon from "../Icon";

function Input({
    ref,
    name,
    label,
    placeholder,
    icon,
    type = "text",
    value,
    onChange,
    maxLength,
    min,
    max,
    inputWarning,
    disabled = false,
    bgClass = "",
    textClass = "text-main",
    onKeyDown,
    paddingClass,
    border,
    widthClass = "w-full",
    onFocus,
    ...props


}) {

    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";




    return (
        <div className={`flex flex-col gap-2 ${widthClass}`}>
            {/* Label */}
            {label && (
                <label className="text-h5 text-main dark:text-white">
                    {label}
                </label>
            )}


            {/* Input wrapper */}
            <div className="relative flex items-center text-main dark:text-white">
                {/* Icon */}
                {icon && (
                    <span className="absolute left-3">
                        <Icon name={icon} width="18px" height="18px" />
                    </span>
                )}

                {/* Input */}
                <input
                    {...props}
                    ref={ref}
                    name={name}
                    type={isPassword && showPassword ? "text" : type}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    min={min}
                    max={max}
                    maxLength={maxLength}
                    disabled={disabled}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    className={`
                        w-full
                        rounded border
                        ${paddingClass ? paddingClass : "p-2.5"} ${icon ? "pl-10" : ""}
                        text-body
                        ${textClass}
                        outline-none
                        transition
                        
                        ${!border ? " border border-input-border" : `${border}`}
                        dark:border-default
                        ${bgClass}
                        focus:ring-1 focus:ring-brand
                        focus:border-brand
                        disabled:bg-gray-100 disabled:cursor-not-allowed
                        [&::-ms-reveal]:hidden
                        [&::-ms-clear]:hidden
                        `}

                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                        {showPassword ? <Icon name="solar:eye-bold" width="18" height="18" /> : <Icon name="humbleicons:eye-close" width="18" height="18" />}
                    </button>
                )}
            </div>
            {inputWarning && <InputWarnMessage message={inputWarning} />}

        </div>
    );
}

export default Input;
