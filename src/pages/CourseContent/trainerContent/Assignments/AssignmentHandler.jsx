import React from 'react'
import { useModuleContext, useCourse } from "../layout/CourseManagementLayout";
import { useAssignmentContext } from '../layout/CourseManagementLayout'


import { useParams } from 'react-router-dom'

import { BackButton } from "@/components/ui"

import AssignmentForm from '@/components/forms/AssignmentForm'

function AssignmentHandler({ mode }) {
    const { courseId, course, loading } = useCourse();
    const { assignmentId } = useParams();
    const { assignments, setAssignments } = useAssignmentContext()

    const isEdit = mode === "edit";

    const initialData = assignmentId
        ? assignments?.find(a => a.id === assignmentId)
        : null;
    return (
        <div>
            <BackButton to={`/course/${courseId}/content/assignments`} label={`${course?.title || "Loading..."} - Assignments`} />
            <h2 className="text-h3">
                {isEdit ? "Edit Assignment" : "New Assignment"}
            </h2>

            <AssignmentForm
                courseId={courseId}
                mode={mode}
                initialData={initialData}
                assignments={assignments}
                setAssignments={setAssignments}
            />
        </div>
    )
}

export default AssignmentHandler
