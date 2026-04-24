import React from 'react'
import CourseForm from '@/components/forms/CourseForm'
import { useCourseActions } from '../../../src/components/forms/hooks/useCourseActions' 


function CourseActionHandler({ mode, CourseData, onClose, onSuccess }) {

    const {
        createNewCourse,
        updateCourse,
        deleteCourse,
        creating,
        updating,
        deleting,
    } = useCourseActions();

    const isEdit = mode === "edit";

    return (
        <CourseForm
            initialData={CourseData}
            onClose={onClose}
            mode={mode}
            isEdit={isEdit}
            creating={creating}              
            updating={updating}              
            deleting={deleting}              
            createNewCourse={createNewCourse}   
            updateCourse={updateCourse}         
            deleteCourse={deleteCourse}         
            onSuccess={onSuccess}         
        />
    )
}

export default CourseActionHandler
