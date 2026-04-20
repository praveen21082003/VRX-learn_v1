import React from 'react'
import { Routes, Route } from 'react-router-dom';

import CourseManagementLayout from '../pages/CourseContent/trainerContent/layout/CourseManagementLayout';

// pages
import CourseInformationPage from '../pages/CourseContent/trainerContent/course/CourseInformationPage';
import ModulesPage from '../pages/CourseContent/trainerContent/modules/ModulesPage';
import AssignmentsPage from '../pages/CourseContent/trainerContent/Assignments/AssignmentsPage';

function TrainerRoutes() {
    return (
        <Routes>
            <Route path="content" element={<CourseManagementLayout />}>
                <Route index element={<CourseInformationPage />} />
                <Route path="info" element={<CourseInformationPage />} />
                <Route path="modules" element={<ModulesPage />} />
                <Route path="assignments" element={<AssignmentsPage />} />
            </Route>
        </Routes>
    );
}

export default TrainerRoutes
