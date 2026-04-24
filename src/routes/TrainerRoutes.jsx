import CourseManagementLayout from '../pages/CourseContent/trainerContent/layout/CourseManagementLayout';
import CourseInformationPage from '../pages/CourseContent/trainerContent/course/CourseInformationPage';
import ModulesPage from '../pages/CourseContent/trainerContent/modules/ModulesPage';
import AssignmentsPage from '../pages/CourseContent/trainerContent/Assignments/AssignmentsPage';
import { Route, Navigate } from 'react-router-dom';

// modules sub page inside Contents
import ModuleActionHandler from '../pages/CourseContent/trainerContent/modules/ModuleActionHandler';
import LessonsPage from '../pages/CourseContent/trainerContent/modules/lessons/LessonsPage';
import LessonActionHandler from '../pages/CourseContent/trainerContent/modules/lessons/LessonActionHandler';
import AssignmentHandler from '../pages/CourseContent/trainerContent/Assignments/AssignmentHandler';

// Roster trainee
import TraineeRoster from '../pages/Rosters/TraineeRoster';

export default function TrainerRoutes() {
    return (
        <>
            <Route path="content" element={<CourseManagementLayout />}>
                <Route index element={<Navigate to="info" replace />} />
                <Route path="info" element={<CourseInformationPage />} />
                <Route path="modules">
                    <Route index element={<ModulesPage />} />
                    <Route path="create" element={<ModuleActionHandler mode="create" />} />
                    <Route path=":moduleId">
                        <Route index element={<LessonsPage />} />
                        <Route path="edit" element={<ModuleActionHandler mode="edit" />} />

                        <Route path="lesson/create" element={<LessonActionHandler mode="create" />} />
                        <Route path="lesson/:lessonId/edit" element={<LessonActionHandler mode="edit" />} />
                        <Route path="lesson/:lessonId/preview" element={<LessonActionHandler mode="view" />} />
                    </Route>
                </Route>
                <Route path="assignments">
                    <Route index element={<AssignmentsPage />} />
                    <Route path=":assignmentId" element={<AssignmentsPage />} />
                    <Route path="create" element={<AssignmentHandler mode="create" />} />
                    <Route path=':assignmentId/edit' element={<AssignmentHandler mode="edit" />} />
                    <Route path=':assignmentId/view' element={<AssignmentHandler mode="view" />} />
                </Route>
            </Route>
            <Route path='roster' element={<TraineeRoster />} >

            </Route>
        </>
    );
}