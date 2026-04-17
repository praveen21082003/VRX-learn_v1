import React from 'react'
import { CourseCardViewer } from "@/components/ui";

function TrainerAssignedCourses({ courses, loading, error }) {

    if (error) {
        return <div className="px-4 py-3 text-caption text-red-600">{error}</div>
    }


    return (
        <CourseCardViewer
            title="Assigned Courses"
            courses={courses}
            loading={loading}
            myCourses={true}
            gridSize={4}
            getButtonName={true}
            emptyTitle="No Assigned Courses yet"
            emptyDescription="It looks like you haven't been enrolled in any courses yet. Check back soon or contact your admin."
            emptyIcon="uil:book-open"
            vertical={true}
        />
    )
}

export default TrainerAssignedCourses
