import React, { useState } from 'react'
import { Icon, Modal } from "@/components/ui"

import { useAuth } from '@/context/AuthContext'
import { useDashboardKPIs } from './hooks/useDashboardKPIs';
import { useAdminTopCourses } from './hooks/useAdminTopCourses'

import { ADMIN_STAT_CARDS, QUICK_ACTIONS_CARDS } from '@/config/dashboardConfig';

import StatCard from '@/components/dashboard/StatCard';
import AdminTopCourses from '@/components/dashboard/AdminTopCourses';

// Create 
import CreateUser from './components/CreateUser';
import CreateCourse from './components/CreateCourse';
import CreateEnrollment from './components/CreateEnrollment';

function AdminDashboard() {

  const [activeAction, setActiveAction] = useState();
  const [open, setOpen] = useState(false);


  const { user, role } = useAuth();
  const { kpis, loading, setKpis, error: kpisError } = useDashboardKPIs(role);
  const { topCourses, loading: topCoursesLoading, error: topCourseError } = useAdminTopCourses();

  // Maping the config to the actual API data
  const statsWithData = ADMIN_STAT_CARDS.map((card) => ({
    ...card,
    // Fallback to 0 while loading
    value: kpis?.[card.key] || 0,
  }));

  const handleQuickActions = (actionKey) => {
    setActiveAction(actionKey);
    setOpen(true);
  };


  // on Success functions
  const handleAddKips = () => {
    setKpis((prev) => ({
      ...prev,
      totalUsers: (prev.totalUsers || 0) + 1
    }));
  }



  return (
    <div className="space-y-4 text-main py-4 px-6">
      <h2 className='text-h2 mb-1'>Welcome {user?.username}!</h2>
      <p className='mb-1 '>Here's what's happening across your learning platform.</p>

      {/* KPIs */}
      <div className="py-4">
        {kpisError ? (
          <div className="px-4 py-3 text-caption text-red-600">
            Failed to load KPI statistics.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {statsWithData.map((kpi) => (
              <StatCard
                key={kpi.key}
                icon={kpi.Icon}
                label={kpi.label}
                value={kpi.value}
                loading={loading}
              />
            ))}
          </div>
        )}
      </div>


      {/* Quick Actions */}

      <div className='space-y-4'>
        <h4 className="text-h4">Quick Actions</h4>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {QUICK_ACTIONS_CARDS.map((action, index) => {
            const isPrimary = action.bgClass;

            return (
              <button
                key={index}
                className={`flex items-center gap-4 border-2 rounded px-4 py-3 cursor-pointer
                ${isPrimary ? `${action.bgClass} text-white border-primary` : "border-primary hover:bg-primary/10"}`}
                onClick={() => handleQuickActions(action.key)}
              >
                <Icon
                  name={action.icon}
                  width="36"
                  height="36"
                  className={`${isPrimary ? "text-white" : "text-primary dark:text-white"} w-[10%]`}
                />

                <div className="flex justify-center items-center w-[90%] flex-col">
                  <span className="text-h4">{action.title}</span>
                  <span className={`text-caption ${isPrimary ? "text-white/80" : "text-muted"}`}>
                    {action.caption}
                  </span>
                </div>

              </button>
            )
          })}
        </div>
      </div>

      {/* Top N Courses */}

      <AdminTopCourses
        courses={topCourses}
        loading={topCoursesLoading}
        error={topCourseError}
      />

      {open && (
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title={
            activeAction === "user"
              ? "Create New User"
              : activeAction === "course"
                ? "Create Course"
                : "Enroll Trainee"
          }
        >
          {activeAction === "user" && (
            <CreateUser
              onClose={() => setOpen(false)}
              onSuccess={handleAddKips}
            />
          )}

          {activeAction === "course" && (
            <CreateCourse
              // setKpis={setKpis}
              onClose={() => setOpen(false)}
              // onSuccess={handleCourseCreate}
            />
          )}

          {activeAction === "enroll" && (
            <CreateEnrollment
              // onSuccess={
              //   setKpis((prev) => ({
              //     ...prev,
              //     totalEnrollments: (prev.totalEnrollments || 0) + 1
              //   }))}
              onClose={() => setOpen(false)}
            />
          )}

        </Modal>
      )}
    </div>
  )
}

export default AdminDashboard
