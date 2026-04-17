import React from 'react'
import { useDashboardCourses } from '../Dashboards/hooks/useDashoardCourses';

import { CourseCardViewer } from '@/components/ui';


function Courses() {
    const { topCourses, loading, error } = useDashboardCourses(20);
    return (
        <div className='h-full p-6 w-full'>

            <CourseCardViewer
                title="All Courses"
                courses={topCourses}
                loading={loading}
                myCourses={true}
                gridSize={4}
                getButtonName={true}
                emptyTitle="No Courses available"
                // emptyDescription="."
                emptyIcon="uil:book-open"
                vertical={true}
            />
        </div>
    )
}

export default Courses
