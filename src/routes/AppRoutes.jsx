import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

// dashboard switcher
import { DashboardSwitcher } from './DashboardSwitcher'

// Routes files
import TraineeRoutes from './TraineeRoutes';
import AdminRoutes from './AdminRoutes'

// layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout'


// auth pages
import Login from '../pages/auth/Login';


// my learning page
import MyCourses from '../pages/Learning/MyLearning';

// courses page
import { CoursesSwitcher } from './CoursesSwitcher';



function AppRoutes() {
  const { user, viewRole, role } = useAuth();
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
      <Route path="/course/:courseId/*" element={<TraineeRoutes />} />

      < Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
