import React from "react";
import clsx from "clsx";
import { Icon } from "@/components/ui";

export default function StatusBanner({ message, type }) {

    const typeMapping = {
        success: {
            icon: "mdi:checkbox-marked-circle",
            textClass: "text-green-700 dark:text-green-400",
            bgClass: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
        },
        error: {
            icon: "mdi:cross-circle",
            textClass: "text-red-600 dark:text-red-400",
            bgClass: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
        },
    };

    const config = typeMapping[type] || typeMapping.success;

    return (
        <div className={clsx(
            "flex items-center gap-2 text-center bg-[#D1E7DD] border-2 border-[#0F5132] rounded-lg p-2 mb-4 mt-2",
            config.bgClass
        )}>
            <Icon
                name={config.icon}
                height="28"
                width="28"
                className={config.textClass}
            />
            <p className={clsx("text-emphasis leading-5 max-w-xs", config.textClass)}>
                {message}
            </p>
        </div>
    );
}