import React, { useState } from 'react'
import { BackButton, Button } from '@/components/ui'
import { useCourse } from "../layout/CourseManagementLayout";
import CourseInfoForm from '../../../../components/forms/CourseInfoForm'

function CourseInformationPage() {
  const [isRefresh, setIsRefresh] = useState(false);

  const { course, courseId, refreshCourseContent, handleUpdateCourseInfoSuccess } = useCourse();

  return (
    <>
      <div className="block lg:hidden border-b border-default p-2 px-4">
        <BackButton to={`/course/${courseId}/content`} label="Back" />
      </div>
      <div className='py-4 px-4'>
        <h2 className="text-h3 flex">
          Edit Course Information
          {isRefresh && <Button frontIconName="material-symbols:refresh" frontIconHeight="26" frontIconWidth="26" bgClass="" textClass="" onClick={() => { refreshCourseContent(); setIsRefresh(false) }} />}
        </h2>

        <CourseInfoForm
          courseInfo={course}
          onSuccess={handleUpdateCourseInfoSuccess}
          setIsRefresh={setIsRefresh}
        />

      </div>
    </>
  )
}

export default CourseInformationPage
