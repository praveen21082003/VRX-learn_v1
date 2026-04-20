import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

// dashboard switcher
import { DashboardSwitcher } from './DashboardSwitcher'

// Routes files
import TraineeRoutes from './TraineeRoutes';
import TrainerRoutes from './TrainerRoutes';
import AdminRoutes from './AdminRoutes';

// layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout'
import LearningLayout from '@/layouts/LearningLayout';


// auth pages
import Login from '../pages/auth/Login';

// course Overview same for all 3 roles 
import CourseOverview from '@/pages/CourseContent/CourseOverview';

// my learning page
import MyCourses from '../pages/Learning/MyLearning';

// courses page
import { CoursesSwitcher } from './CoursesSwitcher';



function AppRoutes() {
  const { user, viewRole, role } = useAuth();


  const currentRole = viewRole ?? role;

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardSwitcher />} />
        <Route path='/learning' element={<MyCourses />} />
        <Route path='/courses' element={<CoursesSwitcher />} />
        {role === 'admin' && AdminRoutes()}

      </Route>


      {/* means learning layout trainee learning content*/}
      <Route path="/course/:courseId" element={<LearningLayout />}>
        <Route index element={<CourseOverview />} />
        <Route path="overview" element={<CourseOverview />} />
        {currentRole === "trainer" || currentRole === "admin" ? (
          <Route path="content/*" element={<TrainerRoutes />} />
        ) : (
          <Route path="learn/*" element={<TraineeRoutes />} />
        )}

      </Route>

      < Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
