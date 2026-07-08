import React from "react";
import { Button, CourseTumbnail, StatusPill } from "@/components/ui";
import { defaultCourse } from "@/assets";

import clsx from "clsx";
import { useNavigate } from "react-router-dom";


function CourseCard({
    // name,
    // author,
    // buttonName,
    // bgClass = "bg-transparent border border-primary",
    // textClass = "text-main",
    // onClick,
    // vertical
    course

}) {
    const hasCustomImage = course?.image?.trim();
    const navigate = useNavigate();

    return (
        // <div className={`flex flex-col gap-4 p-3 lg:p-4 ${!vertical ? 'w-72' : 'w-full'} md:w-full rounded-2xl bg-card flex-shrink-0 snap-start md:flex-shrink`}>


        //     {/* <div className="relative overflow-hidden rounded-lg h-[140px] sm:h-[150px] lg:h-40 bg-gray-200 group">

        //         <img
        //             src={hasCustomImage ? image : defaultCourse}
        //             alt={`${name} thumbnail`}
        //             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        //         />

        //         {!hasCustomImage && (
        //             <div className="
        //                 absolute inset-0
        //                 flex items-center justify-between
        //                 bg-[#840227A3]
        //                 px-4 text-center
        //             ">
        //                 <img src="/logo-white.svg" alt="logo" />
        //                 <h2 className="text-white font-semibold text-sm leading-snug">
        //                     {name}
        //                 </h2>
        //             </div>
        //         )}
        //     </div> */}
        //     <CourseTumbnail name={name} image={image} />


        //     <div className="flex-1 text-main">
        //         <h1 className="text-h5 truncate">{name}</h1>
        //         <p className="text-small">{author}</p>
        //     </div>
        //     <Button
        //         buttonName={buttonName}
        //         bgClass={bgClass}
        //         textClass={textClass}
        //         className="p-3 rounded-lg w-full"
        //         onClick={onClick}
        //     />
        // </div>
        <div
            className="flex flex-col gap-2 p-2 w-64 border border-default hover:cursor-pointer hover:bg-black/5"
            onClick={() => navigate(`/course/${course.courseId}/overview`)}
        >
            <CourseTumbnail
                name={course?.courseName}
                classRounded="rounded-none"
                image={course?.thumbnailUrl}
            />
            <div className="flex flex-col gap-1">
                <span>
                    <h1 className="text-h5 text-main truncate">{course?.courseName}</h1>
                    <p className="text-small text-muted">{course?.trainerName}</p>
                </span>
                <p className="text-small text-muted">Expires on Dec 25, 2026</p>
            </div>
            <div className="flex gap-2 text-white">
                <StatusPill iconName="fluent:premium-24-regular" status="premium"/>
                <StatusPill status="completed"/>
                <StatusPill iconName="mdi:sparkles-outline" status="free"/>

            </div>
        </div>
    );
}

export default CourseCard;
