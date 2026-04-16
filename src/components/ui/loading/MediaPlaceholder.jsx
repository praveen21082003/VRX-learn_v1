import { Icon } from "@/components/ui";

export default function MediaPlaceholder() {
    return (
        <div className="lg:px-10">
            <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden animate-pulse flex items-center justify-center">
                <Icon name="mingcute:video-fill" className="text-zinc-700 w-16 h-16" />
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
        </div>
    );
}