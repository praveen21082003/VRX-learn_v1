import React from 'react'
import { useCourse } from "../layout/CourseManagementLayout";
import CourseInfoForm from '../../../../components/forms/CourseInfoForm'

function CourseInformationPage() {
  const { course, handleUpdateCourseInfoSuccess } = useCourse();

  return (
    <div>
      <h2 className="text-h3">
        Edit Course Information
      </h2>

      <CourseInfoForm
        courseInfo={course}
        onSuccess={handleUpdateCourseInfoSuccess}
      />

    </div>

  )
}

export default CourseInformationPage
