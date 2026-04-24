import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import { DashboardSwitcher } from './DashboardSwitcher';
import TraineeRoutes from './TraineeRoutes';
import TrainerRoutes from './TrainerRoutes';
import AdminRoutes from './AdminRoutes';

import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import LearningLayout from '@/layouts/LearningLayout';
import ContentLayout from '../layouts/ContentLayout';

import Login from '../pages/auth/Login';
import CourseOverview from '@/pages/CourseContent/CourseOverview';
import MyCourses from '../pages/Learning/MyLearning';
import { CoursesSwitcher } from './CoursesSwitcher';

function AppRoutes() {
  const { role } = useAuth();

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardSwitcher />} />
        <Route path="/learning" element={<MyCourses />} />
        <Route path="/courses" element={<CoursesSwitcher />} />
        {role === 'admin' && AdminRoutes()}
      </Route>

      <Route path="/course/:courseId" element={<LearningLayout />}>
        <Route index element={<CourseOverview />} />
        <Route path="overview" element={<CourseOverview />} />
        {TraineeRoutes()}
      </Route>


      <Route path="/course/:courseId" element={<ContentLayout />}>
        <Route index element={<CourseOverview />} />
        <Route path="overview" element={<CourseOverview />} />
        {TrainerRoutes()}
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;