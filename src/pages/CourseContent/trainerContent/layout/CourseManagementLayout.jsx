import { useEffect, useState, useRef } from "react";
// custom hooks and api
import { useResizable } from '@/hooks/useResizable';
import useCourseContent from "../hooks/useCourseContent";

import { Outlet, useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import CourseManagementSidebar from "./CourseManagementSidebar";

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";


function CourseManagementLayout() {

    // hooks
    const { role, viewRole } = useAuth();
    const { width, isResizing, startResizing } = useResizable(
        window.innerWidth >= 1536 ? 480 : 360
    );
    const { courseId } = useParams();
    const { courseContent, loading, error, refreshCourseContent } = useCourseContent(courseId);

    const effectiveRole = viewRole ?? role;
    const { modules = [], assignments = [] } = courseContent || {};

    // 
    if (effectiveRole === "trainee") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="flex h-full overflow-hidden bg-background">
            <aside style={{ width }} className="relative hidden border-r-2 border-default bg-muted/40 py-1 lg:block overflow-y-auto scrollbar-hide">
                <CourseManagementSidebar
                    courseContent={courseContent}
                />
                <div
                    onMouseDown={startResizing}
                    className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize transition-colors duration-200
                        ${isResizing ? 'bg-primary/20 shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]' : 'bg-transparent hover:bg-primary/16'}
                    `}
                />
            </aside>
            <main className="flex-1 min-h-0 overflow-y-auto text-main py-4 px-6">
                <Outlet />
            </main>
        </div>
    );
}

export default CourseManagementLayout
