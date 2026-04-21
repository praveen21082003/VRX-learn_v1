import CourseManagementLayout from '../pages/CourseContent/trainerContent/layout/CourseManagementLayout';
import CourseInformationPage from '../pages/CourseContent/trainerContent/course/CourseInformationPage';
import ModulesPage from '../pages/CourseContent/trainerContent/modules/ModulesPage';
import AssignmentsPage from '../pages/CourseContent/trainerContent/Assignments/AssignmentsPage';
import { Route, Navigate } from 'react-router-dom';

export default function TrainerRoutes() {
    return (
        <Route path="content" element={<CourseManagementLayout />}>
            <Route index element={<Navigate to="info" replace />} />
            <Route path="info" element={<CourseInformationPage />} />
            <Route path="modules">
                <Route index element={<ModulesPage />} />
                <Route path="create" element={<ModulesPage />} />
                <Route path=":moduleId" element={<ModulesPage />} />
            </Route>
            <Route path="assignments">
                <Route index element={<AssignmentsPage />} />
                <Route path=":assignmentId" element={<AssignmentsPage />} />
            </Route>
        </Route>
    );
}