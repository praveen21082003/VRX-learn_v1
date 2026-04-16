import React, { useState, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { BackButton, Icon } from '@/components/ui';
import ContentAssignmentSidebar from './ContentAssignmentSidebar';
import { useAssignmentContent } from '../../hooks/useAssignmentContent';

function AssignmentLayout() {
    const [activeAssignment, setActiveAssignment] = useState(null);

    const { courseId } = useParams();

    const {
        assignments,
        assignmentDetail,
        loading,
        detailLoading,
        error,
    } = useAssignmentContent(courseId, activeAssignment?.id);

    useEffect(() => {
        if (
            window.innerWidth >= 1024 &&
            !activeAssignment &&
            assignments.length > 0
        ) {
            setActiveAssignment(assignments[0]);
        }
    }, [assignments, activeAssignment]);

    // console.log(activeAssignment);

    if (loading) {
        return <div>Loading assignments...</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <aside
                className={clsx(
                    "w-full lg:w-96 border-r-2 border-default bg-surface overflow-y-auto",
                    activeAssignment ? "hidden lg:block" : "block"
                )}
            >
                <div className="p-2 border-b-2 border-default">
                    <BackButton
                        to={`/course/${courseId}/overview`}
                        iconName="material-symbols:arrow-back-rounded"
                        label="Back to Overview"
                    />
                </div>

                <ContentAssignmentSidebar
                    assignments={assignments}
                    activeAssignment={activeAssignment}
                    setActiveAssignment={setActiveAssignment}
                />
            </aside>

            <main
                className={clsx(
                    "flex-1 overflow-y-auto bg-background flex flex-col",
                    !activeAssignment ? "hidden lg:flex" : "flex"
                )}
            >
                {activeAssignment && (
                    <div className="lg:hidden p-2 flex items-center justify-between border-b bg-surface">
                        <button
                            onClick={() => setActiveAssignment(null)}
                            className="flex items-center gap-2 text-primary font-medium"
                        >
                            <Icon name="mdi:chevron-left" />
                            Back to List
                        </button>

                        {/* <button
                            onClick={() => setOpenPlaylist(true)}
                            className="text-primary p-2"
                        >
                            <Icon
                                name="mdi:playlist-play"
                                width="24"
                            />
                        </button> */}
                    </div>
                )}

                <div className="flex-1">
                    <Outlet
                        context={{
                            courseId,
                            assignments,
                            activeAssignment,
                            setActiveAssignment,
                            assignmentDetail,
                            detailLoading,
                        }}
                    />
                </div>
            </main>
        </div>
    );
}

export default AssignmentLayout;