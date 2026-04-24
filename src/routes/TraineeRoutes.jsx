import React from 'react';
import { Route } from 'react-router-dom';

import LessonLayout from '@/pages/CourseContent/traineeContent/lessons/LessonLayout';
import AssignmentLayout from '@/pages/CourseContent/traineeContent/assignments/AssignmentLayout';
import LessonContent from '@/pages/CourseContent/traineeContent/lessons/LessonContent';
import AssignmentContent from '@/pages/CourseContent/traineeContent/assignments/AssignmentContent';

export default function TraineeRoutes() {
    return (
        <>
            <Route path="learn/lesson" element={<LessonLayout />}>
                <Route index element={<LessonContent />} />
            </Route>
            <Route path="learn/assignment" element={<AssignmentLayout />}>
                <Route index element={<AssignmentContent />} />
            </Route>
        </>
    );
}