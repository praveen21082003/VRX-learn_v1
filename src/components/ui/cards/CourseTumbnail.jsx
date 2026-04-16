import React from 'react'
import { defaultCourse } from "@/assets";
import clsx from 'clsx';

function CourseTumbnail({image, name, classRounded = "rounded-lg", classHeight}) {

    const hasCustomImage = image?.trim();


    return (
        <div className={clsx("relative overflow-hidden", classRounded, classHeight ? classHeight : "h-[140px] sm:h-[150px] lg:h-40", "bg-gray-200 group")}>

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
        </div>
    )
}

export default CourseTumbnail
