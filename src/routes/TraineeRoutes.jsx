


import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts & Pages
import LearningLayout from '@/layouts/LearningLayout';
import LessonLayout from '@/pages/CourseContent/traineeContent/lessons/LessonLayout';
import AssignmentLayout from '@/pages/CourseContent/traineeContent/assignments/AssignmentLayout';
import CourseOverview from '@/pages/CourseContent/CourseOverview';
import LessonContent from '@/pages/CourseContent/traineeContent/lessons/LessonContent';
import AssignmentContent from '@/pages/CourseContent/traineeContent/assignments/AssignmentContent';

function TraineeRoutes() {
    return (
        <Routes>
            <Route element={<LearningLayout />}>
                {/* The path here matches the parent's wildcards */}
                <Route path="overview" element={<CourseOverview />} />

                <Route path="learn/lesson" element={<LessonLayout />}>
                    <Route index element={<LessonContent />} />
                </Route>

                <Route path="learn/assignment" element={<AssignmentLayout />}>
                    <Route index element={<AssignmentContent />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default TraineeRoutes;