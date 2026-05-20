import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import ProtectedRoute from './routeProtection/ProtectedRoute';
import PublicOnlyRoute from './routeProtection/PublicOnlyRoute';


import { DashboardSwitcher } from './DashboardSwitcher';
import TraineeRoutes from './TraineeRoutes';
import TrainerRoutes from './TrainerRoutes';


import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import LearningLayout from '@/layouts/LearningLayout';
import ContentLayout from '../layouts/ContentLayout';
import ReportLayout from '../layouts/ReportLayout';

import CourseOverview from '@/pages/CourseContent/CourseOverview';
import MyCourses from '../pages/Learning/MyLearning';
import { CoursesSwitcher } from './CoursesSwitcher';

import UserManagement from '../pages/Users/UserManagement';
import EnrollmentsManagement from '../pages/Enrollments/EnrollmentsManagement';

// error page
import ErrorPage from '../pages/Errors/ErrorPage';
// report pages
import ReportProblem from '../pages/Report/ReportProblem';
import Reports from '../pages/Report/Reports';
import ReportDeatils from '../pages/Report/ReportDeatils';

// auth pages
import Login from '../pages/auth/Login';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import SignUp from '../pages/auth/SignUp';
import VerifyEmail from '../pages/auth/VerifyEmail';

function AppRoutes() {
  const { loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>

      {/* Public only — redirect to /dashboard if already logged in */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>
      </Route>

      {/* Protected — redirect to /login if not logged in */}
      <Route element={<ProtectedRoute />}>

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardSwitcher />} />
          <Route path="/learning" element={<MyCourses />} />
          <Route path="/courses" element={<CoursesSwitcher />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/enrollments" element={<EnrollmentsManagement />} />
          <Route path="/reports">
            <Route index element={<Reports />} />
            <Route path=":reportId" element={<ReportDeatils />} />
          </Route>
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

        <Route element={<ReportLayout />}>
          <Route path="/report-problem" element={<ReportProblem />} />
        </Route>

      </Route>

      {/* Error pages — public */}
      <Route path="/unauthorized" element={<ErrorPage statusCode={403} />} />
      <Route path="/server-error" element={<ErrorPage statusCode={500} />} />
      <Route path="/maintenance" element={<ErrorPage statusCode={503} />} />
      <Route path="/404" element={<ErrorPage statusCode={404} />} />



      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<ErrorPage statusCode={404} />} />

    </Routes>
  );
}

export default AppRoutes;