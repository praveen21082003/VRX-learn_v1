import React from 'react'
import CourseForm from '../../../components/forms/CourseForm'

function CreateCourse({courseData = {}, mode = "create", onSuccess, onClose}) {
    return (
        <div>
            <CourseForm
                initialData={courseData}
                onClose={onClose}
                onSuccess={onSuccess}
                mode={mode}
            />
        </div>
    )
}

export default CreateCourse
