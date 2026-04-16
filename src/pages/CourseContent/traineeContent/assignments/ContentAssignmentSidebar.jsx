import React from 'react'
import clsx from 'clsx';
import { Icon } from '@/components/ui';
import { useNavigate, useParams } from 'react-router-dom';

function ContentAssignmentSidebar({
    assignments,
    activeAssignment,
    setActiveAssignment,
}) {
    const { courseId } = useParams();


    return (
        <div>
            <ul
                className='space-y-1 overflow-hidden'
            >
                {assignments?.map((assignment, assignmentIndex) => {

                    const isActive =
                        activeAssignment?.id === assignment.id;
                    return (
                        <li key={assignment.id} >
                            <button
                                type="button"
                                onClick={() => setActiveAssignment(assignment)}
                                className={clsx(
                                    "flex h-16 w-full border-primary items-center gap-4 text-dark-gray",
                                    isActive ? "bg-primary/16 dark:bg-primary text-primary dark:text-background border-x-8 p-2" : "hover:bg-primary/16 text-muted p-4"
                                )}
                            >
                                <Icon name="material-symbols:assignment-outline" height="26" width="26" />
                                <p className="text-h5 truncate">
                                    Assignment {assignmentIndex + 1} - {assignment.title}
                                </p>

                            </button>
                        </li>
                    )
                }
                )}
            </ul>

        </div>
    )
}

export default ContentAssignmentSidebar
