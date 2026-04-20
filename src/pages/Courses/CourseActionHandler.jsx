import React from 'react'
import CourseForm from '@/components/forms/CourseForm'

function CourseActionHandler({ mode, CourseData, onClose, onSuccess }) {

    const isEdit = mode === "edit";

    return (
        <CourseForm
            initialData={CourseData}
            // onSubmit={handleAction}
            onClose={onClose}
            mode={mode}
            // loading={loading}
        />
    )
}

export default CourseActionHandler
