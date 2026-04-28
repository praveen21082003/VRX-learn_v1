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
            <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
                <Icon name="line-md:loading-twotone-loop" height="30" width="30" />

                <div className="space-y-1 text-center">
                    <h3 className="text-h45 font-semibold text-main">
                        Loading Assignment Details...
                    </h3>
                    <p className="text-caption text-muted">
                        Fetching existing data so you can review and update the assignment.
                    </p>
                </div>
            </div>
        );
    }

    const initialData = isEdit ? assignment : null;

    console.log(assignment)


    return (
        <div className='p-4 mb-30 lg:mb-0'>
            {
                (mode === "create" || mode === "edit") &&
                <BackButton to={`/course/${courseId}/content/assignments`} label={`${course?.title || "Loading..."} - Assignments`} />

            }


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
