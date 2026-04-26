import { Icon } from "@/components/ui";

export default function FilePlaceholder() {
    return (
        <div className="lg:px-10">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-border bg-background flex flex-col justify-center items-center gap-4 animate-pulse">

                {/* Icon */}
                <div className="p-4 rounded-full bg-muted">
                    <Icon
                        name="mdi:file-pdf-box"
                        className="w-12 h-12 text-red-500 dark:text-red-400"
                    />
                </div>

                {/* Title Skeleton */}
                <div className="w-1/2 h-4 bg-muted rounded" />

                {/* Lines Skeleton */}
                <div className="w-2/3 h-3 bg-muted rounded" />
                <div className="w-1/3 h-3 bg-muted rounded" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
        </div>
    );
}