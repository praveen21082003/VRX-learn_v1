import { useEffect, useState, useRef } from "react";
// custom hooks and api
import { useResizable } from '@/hooks/useResizable';
import useCourseContent from "../hooks/useCourseContent";

import { Outlet, useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import CourseManagementSidebar from "./CourseManagementSidebar";


function CourseManagementLayout() {
    const defaultWidth = window.innerWidth >= 1536 ? 480 : 360;
    const { width, isResizing, startResizing } = useResizable(defaultWidth);

    const { courseId } = useParams();

    const { courseContent, setCourseContent, loading, error, refreshCourseContent } = useCourseContent(courseId);
    // console.log(courseContent);
    const { modules = [], assignments = [] } = courseContent || {};





    return (
        <div className="flex h-full overflow-hidden bg-background">
            <aside style={{ width }} className=" relative hidden border-r-2 border-default bg-muted/40 py-1 lg:block overflow-y-auto scrollbar-hide">
                <CourseManagementSidebar
                    courseId={courseId}
                    modules={modules}
                    assignments={assignments}
                />
                {/* Resize line on hover visible */}
                <div
                    onMouseDown={startResizing}
                    className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize transition-colors duration-200
                        ${isResizing ? 'bg-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-transparent hover:bg-primary/16'}
                    `}
                />
            </aside>

            <main className="flex-1 min-h-0 overflow-y-auto text-main py-4 px-6 sm:px-6">
                <Outlet />
            </main>
        </div>
    )
}

export default CourseManagementLayout
