import { useEffect, useState, useRef, createContext, useContext } from "react";
// custom hooks and api
import { useResizable } from '@/hooks/useResizable';
import useCourseContent from "../hooks/useCourseContent";

import { Outlet, useNavigate, useLocation, useParams, useOutletContext } from "react-router-dom";
import CourseManagementSidebar from "./CourseManagementSidebar";

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import { Icon } from '@/components/ui'

// ─── Contexts ───────────────────────────────────────────
export const CourseContext = createContext(null);
export const ModuleContext = createContext(null);
export const AssignmentContext = createContext(null);


// ─── Custom Hooks ────────────────────────────────────────
export const useCourse = () => {
    const ctx = useContext(CourseContext);
    if (!ctx) throw new Error("useCourse must be used within CourseManagementLayout");
    return ctx;
};

export const useModuleContext = () => {
    const ctx = useContext(ModuleContext);
    if (!ctx) throw new Error("useModuleContext must be used within CourseManagementLayout");
    return ctx;
};

export const useAssignmentContext = () => {
    const ctx = useContext(AssignmentContext);
    if (!ctx) throw new Error("useAssignmentContext must be used within CourseManagementLayout");
    return ctx;
};


function CourseManagementLayout() {

    // hooks
    const { role, viewRole } = useAuth();
    const { width, isResizing, startResizing } = useResizable(
        window.innerWidth >= 1536 ? 480 : 360
    );
    const { courseId } = useParams();
    const { courseContent, setCourseContent, loading, error, refreshCourseContent } = useCourseContent(courseId);

    const effectiveRole = viewRole ?? role;
    const { course, modules = [], assignments = [] } = courseContent || {};
    console.log(course);

    // 
    if (effectiveRole === "trainee") {
        return <Navigate to="/" replace />;
    }


    // handle update success states
    const handleUpdateCourseInfoSuccess = (updatedFields) => {
        setCourseContent((prev) => ({
            ...prev,
            course: {
                ...prev.course,
                ...updatedFields,
            },
        }));
    };


    // modules update
    const setModules = (updated) => {
        setCourseContent(prev => ({ ...prev, modules: updated }));
    };

    // update assignments
    const setAssignments = (updated) => {
        setCourseContent(prev => ({ ...prev, assignments: updated }))
    }


    // handle Reorder sucess
    const handleReorderModulesSuccess = (orderedModules) => {
        setCourseContent(prev => ({
            ...prev,
            modules: orderedModules
        }));
    }


    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />

                <div className="space-y-1 text-center">
                    <h3 className="text-h45 font-semibold text-main">Getting things ready...</h3>
                    <p className="text-caption text-muted">
                        We're preparing your course content for you.
                    </p>
                </div>
            </div>
        )
    }



    return (
        <CourseContext.Provider value={{ courseId, course, handleUpdateCourseInfoSuccess }}>
            <ModuleContext.Provider value={{ modules, setModules }}>
                <AssignmentContext.Provider value={setAssignments}>

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
                </AssignmentContext.Provider>
            </ModuleContext.Provider>
        </CourseContext.Provider>
    );
}

export default CourseManagementLayout




