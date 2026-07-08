import React from 'react'
import { CourseCardViewer} from "@/components/ui";

function AllCoursesSection({ courses, loading }) {
    return (
        <CourseCardViewer
            title="Popular Courses"
            courses={courses}
            loading={loading}
            myCourses={false}
            gridSize={3}
            maxCourses={3}
            getButtonName={true}
            emptyTitle="No Courses available"
            // emptyDescription="."
            emptyIcon="uil:book-open"
        />
    )
}

export default AllCoursesSection
