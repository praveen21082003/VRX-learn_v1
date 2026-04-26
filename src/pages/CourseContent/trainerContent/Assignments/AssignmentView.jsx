import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { Icon, Button, CourseContentEmptyState } from '@/components/ui'
import { Tabs } from '@/components/tabs'

import { useCourse, useAssignmentContext } from "../layout/CourseManagementLayout";
import { useSubmissionsData } from './hooks/useSubmissionsData'
import formatDateTime from '@/utils/formatDateTime';

import { InstructionsTab, SubmissionView, SubmissionsTab } from "./tabSections";

function AssignmentView() {
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
    refreshSubmissions
  } = useSubmissionsData(assignmentId, params);

  const { assignment: assignmentData, attachment } = assignment || {};

  // fetch assignment details on mount
  useEffect(() => {
    if (assignmentId) fetchAssignmentDetails(assignmentId);
  }, [assignmentId]);

  // refetch submissions when params change
  // useEffect(() => {
  //   fetchSubmissions();
  // }, [params]);

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
    return <p>Loading...</p>;
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
    <div className="space-y-0">
      <div className='flex justify-between'>
        <h2 className="text-h3">{assignmentData?.title}</h2>
        {activeTab === "instructions" && (
          <Button
            buttonName="Edit Details"
            frontIconName='mingcute:pencil-line'
            frontIconWidth="24px"
            frontIconHeght="24px"
            className="p-1 rounded font-semibold text-md"
            bgClass=""
            textClass="text-primary dark:text-background"
            onClick={() => navigate(`/course/${courseId}/content/assignments/${assignmentId}/edit`)}
          />
        )}
      </div>

      <div className="flex items-center text-caption gap-2 text-muted-foreground">
        <div className="flex gap-2 items-center">
          <Icon name="mdi:clock-outline" width="16px" height="16px" />
          <p>{assignmentData?.dueDate ? formatDateTime(assignmentData.dueDate) : "No due date for this assignment"}</p>
        </div>
        <Icon name="bi:dot" />
        <div className="flex gap-2 items-center">
          <Icon name="streamline:star-badge-remix" width="16px" height="16px" />
          <p>Max: {assignmentData?.maxScore} Marks</p>
        </div>
        <Icon name="bi:dot" />
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
              loading={loading}
              setActiveAssignmentId={setActiveAssignmentId}
            />
          )}
          
          {activeTab === "view_submission" && (
            <SubmissionView
              submissions={submissions}
              setActiveTab={setActiveTab}
              assignmentId={assignmentId}
              activeAssignmentId={activeAssignmentId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AssignmentView;