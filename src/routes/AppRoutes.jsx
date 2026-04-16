import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

// layouts
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout'
import LearningLayout from '../layouts/LearningLayout';
import LessonLayout from '../pages/CourseContent/traineeContent/lessons/LessonLayout';
import AssignmentLayout from '../pages/CourseContent/traineeContent/assignments/AssignmentLayout';


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

// course content pages
import CourseOverview from '../pages/CourseContent/CourseOverview';
import LessonContent from '../pages/CourseContent/traineeContent/lessons/LessonContent';
import AssignmentContent from '../pages/CourseContent/traineeContent/assignments/AssignmentContent';

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


      <Route element={<LearningLayout />}>
        <Route path="/course/:courseId/overview" element={<CourseOverview />} />
        <Route
          path="/course/:courseId/learn/lesson"
          element={<LessonLayout />}
        >
          <Route index element={<LessonContent />} />
        </Route>
        <Route
          path="/course/:courseId/learn/assignment"
          element={<AssignmentLayout />}
        >
          <Route index element={<AssignmentContent />} />
        </Route>
      </Route>


      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
