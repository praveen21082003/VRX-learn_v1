import React from 'react'
import { CourseCardViewer} from "@/components/ui";

function AllCoursesSection({ courses, loading }) {
    return (
        <CourseCardViewer
            title="All Courses"
            courses={courses}
            loading={loading}
            myCourses={true}
            gridSize={3}
            getButtonName={true}
            emptyTitle="No Courses available"
            // emptyDescription="."
            emptyIcon="uil:book-open"
        />
    )
}

export default AllCoursesSection
