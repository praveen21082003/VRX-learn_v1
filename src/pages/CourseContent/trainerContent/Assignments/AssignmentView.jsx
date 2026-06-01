import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import clsx from 'clsx';
import { Icon, Button, CourseContentEmptyState, BackButton } from '@/components/ui'
import { Tabs } from '@/components/tabs'

import { useCourse, useAssignmentContext } from "../layout/CourseManagementLayout";
import { useSubmissionsData } from './hooks/useSubmissionsData'
import formatDateTime from '@/utils/formatDateTime';

import { InstructionsTab, SubmissionView, SubmissionsTab } from "./tabSections";

function AssignmentView() {
  const isMobile = window.innerWidth < 768;

  const { courseId } = useCourse();
  const { assignment, fetchAssignmentDetails, detailsLoading, detailsError } = useAssignmentContext();

  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const [activeTab, setActiveTab] = useState("instructions");
  const [activeAssignmentId, setActiveAssignmentId] = useState(null);

  const [params, setParams] = useState({
    fromDate: null,
    toDate: today,
    status: null,
    sortByGrade: null,
    page: 1,
    limit: 10
  });

  const {
    submissions,
    loading,
    error,
    totalItems,
    refreshSubmissions
  } = useSubmissionsData(assignmentId, params);


  const { assignment: assignmentData, attachment } = assignment || {};

  // fetch assignment details on mount
  useEffect(() => {
    if (assignmentId) fetchAssignmentDetails(assignmentId);
  }, [assignmentId]);


  useEffect(() => {
    setActiveTab("instructions");
    setActiveAssignmentId(null);
  }, [assignmentId]);

  const resetFilters = () => {
    setParams({
      fromDate: null,
      toDate: today,
      status: null,
      sortByGrade: null,
      page: 1,
      limit: 10
    });
  };

  const tabs = [
    { label: "Instructions", value: "instructions" },
    { label: "Submissions", value: ["submissions", "view_submission"] },
  ];

  // loading state
  if (detailsLoading) {

    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-4">
        <Icon name="line-md:loading-twotone-loop" height="30" width="30" />

        <div className="space-y-1 text-center">
          <h3 className="text-h45 font-semibold text-main">Loading Assignment Workspace...</h3>
          <p className="text-caption text-muted">
            Organizing instructions and student submissions for your review.
          </p>
        </div>
      </div>

    );
  }

  // error state — no UI break
  if (detailsError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-red-500">
        <Icon name="fluent:mail-error-16-filled" height="40" width="40" />
        <p>{detailsError}</p>
      </div>
    );
  }

  // empty state
  if (!assignmentData) {
    return (
      <CourseContentEmptyState
        title="Assignment Not Found"
        description="This assignment may have been deleted or does not exist."
      />
    );
  }

  return (
    <>
      <div className="p-2 px-2">
        <BackButton
          to={clsx(
            (activeTab === "instructions" || activeTab === "submissions") && `/course/${courseId}/content/assignments`,
          )}
          onClick={activeTab === "view_submission" && (() => setActiveTab("submissions"))}
          label={clsx(
            (activeTab === "instructions" || activeTab === "submissions") && 'Back to assignments',
            activeTab === "view_submission" && 'Back to Submissions'
          )}
        />
      </div>

      <div className="space-y-0 px-4">
        <div className='flex justify-between'>
          <h2 className="text-h3">{assignmentData?.title}</h2>
          {activeTab === "instructions" && (
            <div className='shrink-0'>
              <Button
                buttonName="Edit Details"
                frontIconName='mingcute:pencil-line'
                frontIconWidth="24px"
                frontIconHeght="24px"
                className="p-1 rounded font-semibold text-md"
                bgClass=""
                textClass="text-primary dark:text-background"
                onClick={() => navigate(`/course/${courseId}/content/assignments/${assignmentId}/edit`)}
                isMobile={isMobile}
              />
            </div>

          )}

          {activeTab === "submissions" && (
            <div className='block md:hidden shrink-0'>
              <Button buttonName="Export as CSV" frontIconName="material-symbols:download" frontIconHeght="24" frontIconWidth="24" className="p-1 px-2 rounded font-semibold text-md" bgClass="" textClass="text-primary dark:text-background" isMobile={isMobile} />
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-center text-caption gap-2 text-muted-foreground">
          <div className="flex gap-2 items-center">
            <Icon name="mdi:clock-outline" width="16px" height="16px" />
            <p>{assignmentData?.dueDate ? formatDateTime(assignmentData.dueDate) : "No due date for this assignment"}</p>
          </div>

          <div className='hidden md:block'>
            <Icon name="bi:dot" />
          </div>

          <div className="flex gap-2 items-center">
            <Icon name="streamline:star-badge-remix" width="16px" height="16px" />
            <p>Max: {assignmentData?.maxScore} Marks</p>
          </div>

          <div className='hidden md:block'>
            <Icon name="bi:dot" />
          </div>

          <div className="flex gap-2 items-center">
            <Icon name="mdi:repeat" width="16px" height="16px" />
            <p>Max Attempts: {assignmentData?.numberOfAttempts}</p>
          </div>
        </div>

        <div className="mt-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <div className="py-5">
            {activeTab === "instructions" && (
              <InstructionsTab
                instructions={assignmentData?.instructions}
                attachment={attachment}
              />
            )}

            {activeTab === "submissions" && (
              <SubmissionsTab
                submissions={submissions}
                setActiveTab={setActiveTab}
                setParms={setParams}
                parms={params}
                totalItems={totalItems}
                loading={loading}
                setActiveAssignmentId={setActiveAssignmentId}
                resetFilters={resetFilters}
              />
            )}

            {activeTab === "view_submission" && (
              <SubmissionView
                submissions={submissions}
                setActiveTab={setActiveTab}
                assignmentId={assignmentId}
                activeAssignmentId={activeAssignmentId}
                setActiveAssignmentId={setActiveAssignmentId}
                refreshSubmissions={refreshSubmissions}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AssignmentView;