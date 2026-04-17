import React from 'react'

import StatCard from '@/components/dashboard/StatCard';
import TrainerAssignedCourses from '@/components/dashboard/TrainerAssignedCourses';

import { useAuth } from '@/context/AuthContext'
import { TRAINER_STAT_CARDS } from '@/config/dashboardConfig';

import { useDashboardKPIs } from './hooks/useDashboardKPIs';
import { useTrainerAssignedCourses } from './hooks/useTrainerAssignedCourses';

function TrainerDashboard() {

  const { user, role } = useAuth();
  const { kpis, loading, setKpis, error: kpisError } = useDashboardKPIs(role);
  const { courses, loading: courseLoading, error } = useTrainerAssignedCourses();

  const statsWithData = TRAINER_STAT_CARDS.map((card) => ({
    ...card,
    // Fallback to 0 while loading
    value: kpis?.[card.key] || 0,
  }));

  return (
    <div className='p-3 sm:p-4 text-main bg-background'>
      <h2 className='text-h2'>Hello,{user?.username}!</h2>
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

      <TrainerAssignedCourses courses={courses} loading={courseLoading} error={error} />

    </div>
  )
}

export default TrainerDashboard
