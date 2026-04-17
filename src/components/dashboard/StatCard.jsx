import { Icon } from "@/components/ui";
import clsx from "clsx";

export default function StatCard({
    icon,
    label,
    value,
    loading
}) {


    if (loading) {
        return (
            <div className="flex items-center justify-center gap-3 p-3 sm:p-4 border border-default rounded-xs shadow-sm w-full overflow-hidden animate-pulse">
                
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg shrink-0" />

                <div className="flex flex-col justify-center items-center w-full gap-2">
                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-[80%]" />
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-8" />
                </div>
            </div>
        );
    }


    return (
        <div className={clsx("flex items-center justify-center gap-3 p-3 sm:p-4 border border-default rounded-xs shadow-sm w-full overflow-hidden",
            !value && "opacity-70"
        )}>

            {/* Icon */}
            <div className="flex  w-10 h-10 text-primary dark:text-white shrink-0">
                <Icon name={icon} width="36" height="36" />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-center items-center w-full">
                <p className="text-h5 sm:text-h4 text-muted text-center wrap-break-word">{label}</p>
                <span className={clsx("font-semibold text-primary text-center",
                    value ? 'text-h2' : 'text-xs'
                )}>
                    {value ? value : <span className="text-muted">Available soon</span>}
                </span>
            </div>

        </div>
    );
}