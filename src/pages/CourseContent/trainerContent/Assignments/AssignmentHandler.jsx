import React, { useEffect } from 'react'
import { useModuleContext, useCourse, useAssignmentContext } from "../layout/CourseManagementLayout";


import { useParams } from 'react-router-dom'

import { BackButton, Icon } from "@/components/ui"

import AssignmentForm from '@/components/forms/AssignmentForm'
import AssignmentView from './AssignmentView';

function AssignmentHandler({ mode }) {
    const { courseId, course, loading } = useCourse();
    const { assignmentId } = useParams();
    const { assignment, assignmentList, fetchAssignmentDetails, detailsError, detailsLoading, setAssignments } = useAssignmentContext()

    const isEdit = mode === "edit";

    useEffect(() => {
        if (isEdit && assignmentId) {
            fetchAssignmentDetails(assignmentId);
        }
    }, [assignmentId]);



    if (isEdit && detailsLoading) {
        return (
            <div className="flex h-screen w-full justify-center items-center">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />
            </div>
        );
    }

    const initialData = isEdit ? assignment : null;

    console.log(assignment)


    return (
        <div>
            <BackButton to={`/course/${courseId}/content/assignments`} label={`${course?.title || "Loading..."} - Assignments`} />

            {mode === "view" ? (
                <AssignmentView assignment={initialData} />
            ) : (
                <>
                    <h2 className="text-h3">
                        {isEdit ? "Edit Assignment" : "New Assignment"}
                    </h2>
                    <AssignmentForm
                        courseId={courseId}
                        mode={mode}
                        initialData={initialData}
                        assignments={assignmentList}
                        setAssignments={setAssignments}
                    />
                </>
            )}
        </div>
    )
}

export default AssignmentHandler
