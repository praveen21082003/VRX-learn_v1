import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import TraineeRoutes from './traineeRoutes/TraineeRoutes';

// layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout'


// auth pages
import Login from '../pages/auth/Login';

// dashboard pages
import TraineeDashboard from '../pages/Dashboards/TraineeDashboard';
import AdminDashboard from '../pages/Dashboards/AdminDashboard';
import TrainerDashboard from '../pages/Dashboards/TrainerDashboard';

// my learning page
import MyCourses from '../pages/Learning/MyLearning';

// courses page
import Courses from '../pages/Courses/Courses';



function AppRoutes() {
  const { user, viewRole, role } = useAuth();
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path='/dashboard'
          element={
            (viewRole === 'admin' || role === 'admin') ? <AdminDashboard /> :
              (viewRole === 'trainer') ? <TrainerDashboard /> :
                <TraineeDashboard />
          } />
        <Route path='/learning' element={<MyCourses />} />
        <Route path='/courses' element={<Courses />} />
      </Route>


      {/* Tainee routes that means learning layout */}
      <Route path="/course/:courseId/*" element={<TraineeRoutes />} />


      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
