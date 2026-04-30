import React from "react";

function SkeletonBlock({ className }) {
    return (
        <div className={`bg-gray-200 dark:bg-gray-500 animate-pulse rounded ${className}`} />
    );
}

function ProfileSkeletonCard() {
    return (
        <div className="flex items-center justify-between p-3 py-6 border border-default rounded-lg">
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <SkeletonBlock className="w-10 h-10 rounded-full" />

                <div className="flex flex-col gap-2">
                    <SkeletonBlock className="w-32 h-3" />
                    <SkeletonBlock className="w-48 h-3" />
                    <SkeletonBlock className="w-28 h-3" />
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1">
                    <SkeletonBlock className="w-12 h-5 rounded" />
                    <SkeletonBlock className="w-12 h-5 rounded" />
                </div>
                <div className="flex justify-end items-end gap-5">
                    <SkeletonBlock className="w-5 h-5" />
                    <SkeletonBlock className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

function CourseSkeletonCard() {
    return (
        <div className="p-3 border border-default rounded-lg flex justify-between">
            <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center">
                    <SkeletonBlock className="w-52 h-4" />
                    <SkeletonBlock className="w-24 h-5 rounded-full" />
                </div>

                <SkeletonBlock className="w-40 h-3" />
                <SkeletonBlock className="w-full h-3" />
                <SkeletonBlock className="w-32 h-3" />
            </div>

            <div className="flex items-center gap-3 ml-3">
                <SkeletonBlock className="w-5 h-5" />
                <SkeletonBlock className="w-5 h-5" />
            </div>
        </div>
    );
}

export default function TableMobileSkeleton({
    type = "profile", // "profile" | "course"
    count = 10,
}) {
    const SkeletonComponent =
        type === "course" ? CourseSkeletonCard : ProfileSkeletonCard;

    return (
        <div className="flex flex-col gap-3">
            {Array.from({ length: count }).map((_, index) => (
                <SkeletonComponent key={index} />
            ))}
        </div>
    );
}