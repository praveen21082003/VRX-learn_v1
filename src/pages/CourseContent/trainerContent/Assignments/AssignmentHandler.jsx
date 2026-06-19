import React, { use, useEffect } from 'react'
import { useModuleContext, useCourse, useAssignmentContext } from "../layout/CourseManagementLayout";

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { useParams } from 'react-router-dom'

import { BackButton, Icon } from "@/components/ui"

import AssignmentForm from '@/components/forms/AssignmentForm'
import AssignmentView from './AssignmentView';

function AssignmentHandler({ mode }) {
    const { courseId, course, loading } = useCourse();
    const { assignmentId } = useParams();
    const { assignment, assignmentList, fetchAssignmentDetails, detailsError, detailsLoading, HandlesetAssignments } = useAssignmentContext()

    const isEdit = mode === "edit";

    const initialData = isEdit ? assignment : null;


    useDocumentTitle(
        mode === "view" ? `${assignment?.assignment?.title} - Assignment` : 
        mode === "edit" ? `${initialData?.assignment?.title} - Update` : `${course?.title} - Create Assignment`
    )

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



    return (
        <div className='mb-30'>
            {
                (mode === "create" || mode === "edit") &&
                <div className='pt-2 px-4'>
                    <BackButton to={`/course/${courseId}/content/assignments`} label='Back to Assignments' />
                </div>

            }


            {mode === "view" ? (
                <AssignmentView assignment={initialData} />
            ) : (
                <div className='px-4'>
                    <h2 className="text-h3">
                        {isEdit ? "Edit Assignment" : "New Assignment"}
                    </h2>
                    <AssignmentForm
                        courseId={courseId}
                        mode={mode}
                        initialData={initialData}
                        assignments={assignmentList}
                        HandlesetAssignments={HandlesetAssignments}
                    />
                </div>
            )}
        </div>
    )
}

export default AssignmentHandler
