import { useAuth } from "../context/AuthContext";

// Site title hook
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import Courses from '@/pages/Courses/Courses'
import AdminCourseManagement from "@/pages/Courses/AdminCourseManagement";
import { use } from "react";



export const CoursesSwitcher = () => {

    useDocumentTitle("Courses");
    
    const { role, viewRole } = useAuth();

    const effectiveRole = viewRole || role;

    const courses = {
        admin: <AdminCourseManagement />,
        trainer: <Courses />,
        // subadmin: <SubAdminDashboard />,
        trainee: <Courses />,
    };

    return courses[effectiveRole];

}