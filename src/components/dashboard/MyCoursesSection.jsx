import React from 'react';
import { CourseCardViewer, Icon } from "@/components/ui";

function MyCoursesSection({ enrolledCourses, loading }) {
    

    return (

        <CourseCardViewer
            title="My Courses"
            courses={enrolledCourses}
            loading={loading}
            myCourses={true}
            gridSize={3}
            getButtonName={true}
            emptyTitle="No Courses enrolled yet"
            emptyDescription="You aren't enrolled in any courses yet. Explore the courses to get started."
            emptyIcon="uil:book-open"
        />

    );
}

export default MyCoursesSection;