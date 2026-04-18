import { useAuth } from "../context/AuthContext";

import Courses from '@/pages/Courses/Courses'
import AdminCourseManagement from "@/pages/Courses/AdminCourseManagement";



export const CoursesSwitcher = () => {
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