import React from 'react'
import { BackButton } from '@/components/ui'
import { useCourse } from "../layout/CourseManagementLayout";
import CourseInfoForm from '../../../../components/forms/CourseInfoForm'

function CourseInformationPage() {
  const { course, courseId, handleUpdateCourseInfoSuccess } = useCourse();

  return (
    <>
      <div className="block lg:hidden border-b border-default p-2 px-4">
        <BackButton to={`/course/${courseId}/content`} label="Back" />
      </div>
      <div className='py-4 px-4'>
        <h2 className="text-h3">
          Edit Course Information
        </h2>

        <CourseInfoForm
          courseInfo={course}
          onSuccess={handleUpdateCourseInfoSuccess}
        />

      </div>
    </>
  )
}

export default CourseInformationPage
