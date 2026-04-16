import React from "react";
import { Button, CourseTumbnail } from "@/components/ui";

import clsx from "clsx";

function CourseCard({
    name,
    author,
    image,
    buttonName,
    bgClass = "bg-transparent border border-primary",
    textClass = "text-main",
    onClick,
    vertical
}) {
    const hasCustomImage = image?.trim();

    return (
        <div className={`flex flex-col gap-4 p-3 lg:p-4 ${!vertical ? 'w-72' : 'w-full'} md:w-full rounded-2xl bg-card flex-shrink-0 snap-start md:flex-shrink`}>


            {/* <div className="relative overflow-hidden rounded-lg h-[140px] sm:h-[150px] lg:h-40 bg-gray-200 group">

                <img
                    src={hasCustomImage ? image : defaultCourse}
                    alt={`${name} thumbnail`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {!hasCustomImage && (
                    <div className="
                        absolute inset-0
                        flex items-center justify-between
                        bg-[#840227A3]
                        px-4 text-center
                    ">
                        <img src="/logo-white.svg" alt="logo" />
                        <h2 className="text-white font-semibold text-sm leading-snug">
                            {name}
                        </h2>
                    </div>
                )}
            </div> */}
            <CourseTumbnail name={name} image={image} />


            <div className="flex-1 text-main">
                <h1 className="text-h5 truncate">{name}</h1>
                <p className="text-small">{author}</p>
            </div>
            <Button
                buttonName={buttonName}
                bgClass={bgClass}
                textClass={textClass}
                className="p-3 rounded-lg w-full"
                onClick={onClick}
            />
        </div>
    );
}

export default CourseCard;
