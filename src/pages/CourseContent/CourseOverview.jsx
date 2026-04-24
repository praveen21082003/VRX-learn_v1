import React, { use, useEffect } from 'react'
import { useParams, useOutletContext, NavLink } from "react-router-dom";
import { useBreadcrumbs } from "@/context/BreadcrumbContext";

import { CourseTumbnail, Icon, CourseOverviewPlaceholder, BackButton } from '@/components/ui';

import { useCourseOverview } from './hooks/useCourseOverview';
import { usePermission } from '../../hooks/usePermission';

import { TRAINEE_SECTIONS, TRAINER_SECTIONS } from '../../config/courseOverview';

import { useAuth } from '@/context/AuthContext';

function CourseOverview() {

    const { setCourseBreadcrumb } = useBreadcrumbs();
    const { courseId } = useParams();
    const { can } = usePermission();
    const { viewRole, role } = useAuth();

    const effectiveRole = viewRole ?? role


    const { data, loading, error } = useCourseOverview(courseId, effectiveRole);


    // Breadcrumb setup - we set the course breadcrumb on mount and clear it on unmount

    useEffect(() => {
        if (loading) return;
        if (courseId) {
            const displayTitle = data?.title || "Untitled Course";
            setCourseBreadcrumb(displayTitle, `/course/${courseId}/overview`);
        }
    }, [data?.title, loading, courseId, setCourseBreadcrumb]);


    const totalLessonMinutes =
        data?.module_duration +
        data?.assignment_duration +
        data?.lab_duration +
        data?.quiz_duration +
        data?.feedback_duration;

    const baseSections =
        can("UPDATE_COURSE")
            ? TRAINER_SECTIONS
            : TRAINEE_SECTIONS;


    const sections = baseSections.map((section) => {
        if (section.key === "assignments") {
            return {
                ...section,
            };
        }
        return section;
    });


    const renderCourseOverview = () => {

        const hasContent = (data?.noOfModules || 0) > 0 || (data?.noOfAssignments || 0) > 0;

        if (!hasContent && !can("UPDATE_COURSE")) {
            return (
                <div className="w-full flex justify-center">
                    <CourseOverviewPlaceholder />
                </div>
            );
        }

        return (
            <div className="space-y-1 py-4 lg:px-6 lg:py-2 text-main">
                {sections.map((section) => {

                    const description =
                        typeof section.MetaData === "function"
                            ? section.MetaData(data)
                            : null;

                    return (
                        <NavLink
                            key={section.key}
                            to={section.path(courseId)}
                            state={{ noOfTrainees: data?.noOfTrainees }}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-lg px-4 py-2 transition-colors
                                ${isActive ? "bg-primary/16" : "hover:bg-primary/16"}`
                            }
                        >
                            {section.icon && (
                                <Icon name={section.icon} height="32" width="32" />
                            )}
                            <div className="flex justify-between w-full items-center">
                                <div className="space-y-0">


                                    <h3 className="text-h4">{section.title}</h3>

                                    {/* Trainer Description */}
                                    {description && (
                                        <p className="text-body text-muted">
                                            {description}
                                        </p>
                                    )}

                                    {/* Trainee Meta + Duration
                                    {!description && (meta || duration) && (
                                        <div className="flex items-center gap-1 text-body text-dark-gray">
                                            {meta && <span>{meta}</span>}
                                            {meta && duration && <Icon name="ph:dot-bold" />}
                                            {duration && (
                                                <>
                                                    <Icon name="mdi:clock-outline" height="16" width="16" />
                                                    <span>{duration}</span>
                                                </>
                                            )}
                                        </div>
                                    )} */}
                                </div>

                                <span className="text-xl font-bold">{">"}</span>
                            </div>
                        </NavLink>
                    );
                })}
            </div>
        )
    }


    if (loading) return <div className='flex h-screen w-full justify-center items-center'><Icon name="line-md:loading-twotone-loop" height="30" width="30" />Loading...</div>;
    if (error) return (
        <div className='flex flex-col h-screen w-full justify-center items-center text-red-500'>
            <Icon name="fluent:mail-error-16-filled" height="40" width="40" />
            <span className='items-center'>{error}</span>
        </div>);

    return (
        <div className="space-y-1 py-4 px-4 lg:px-6 lg:py-4 text-main">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start text-main min-w-0">
                <div className="w-full md:w-[320px]">
                    <CourseTumbnail name={data?.title} image={data?.thumbnail} classRounded="rounded" classHeight="h-52 lg:h-48" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="hidden lg:flex justify-between">
                        <h2 className="text-h2">{data?.title}</h2>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Instructor:{" "}
                            <span className="text-foreground">
                                {data?.trainerName}
                            </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-1 text-body text-muted">
                            <span>Course</span>
                            <Icon name="ph:dot-bold" />
                            <span>{totalLessonMinutes ? formatTime(totalLessonMinutes) : "Duration TBD"}</span>
                            <Icon name="ph:dot-bold" />
                            <span>{data?.progress_status || "Not Started"}</span>
                        </div>
                    </div>


                    <p className="text-body text-muted-foreground line-clamp-3">
                        {data?.shortDescription || <span className="italic">No description available.</span>}
                    </p>
                </div>
            </div>


            {renderCourseOverview()}

        </div>
    )
}

export default CourseOverview
