import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx';

import useAssignmentContent from './hooks/useAssignmnets'
import { useCourse, useAssignmentContext } from "../layout/CourseManagementLayout";

import { Button, Icon, Input, Dropdown, Modal, CourseContentEmptyState, DeleteConfirmContent } from '@/components/ui'
import { ContentLoading } from "@/components/ui/loading"
import { getAssignmentButtons } from '@/config/DropdownButtons';
import { useToast } from '@/context/ToastProvider';
import formatDateTime from '@/utils/formatDateTime'

function AssignmentsPage() {
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();
  const { addToast } = useToast();

  // context
  const { courseId } = useCourse();
  const { setAssignments } = useAssignmentContext();

  // hook - for fetch, update, delete (add update/delete to hook later)
  const {
    assignments,
    fetchAssignments,
    loading,
    error,
  } = useAssignmentContent();

  // state
  const [isOpenDropdown, setIsOpenDropdown] = useState(null);
  const [renameAssignmentId, setRenameAssignmentId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteAssignmentId, setDeleteAssignmentId] = useState(null);

  // refs
  const inputRef = useRef(null);
  const rowRefs = useRef({});

  // fetch on mount
  useEffect(() => {
    fetchAssignments(courseId);
  }, [courseId]);

  // focus input on rename
  useEffect(() => {
    if (renameAssignmentId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameAssignmentId]);

  // close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!isOpenDropdown) return;
      const currentRow = rowRefs.current[isOpenDropdown];
      if (currentRow && !currentRow.contains(e.target)) {
        setIsOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpenDropdown]);


  // handlers
  const handleRename = (assignmentId) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    setRenameAssignmentId(assignmentId);
    setRenameValue(assignment?.title || "");
    setIsOpenDropdown(null);
  };

  const renameAssignmentHandler = async (assignmentId) => {
    const newTitle = renameValue.trim();
    if (!newTitle) {
      setRenameAssignmentId(null);
      return;
    }

    // TODO: add updateAssignment hook call here
    // const result = await updateAssignment(assignmentId, { title: newTitle });
    // if (!result.success) { addToast(result.message, "error"); return; }

    const updated = assignments.map(a =>
      a.id === assignmentId ? { ...a, title: newTitle } : a
    );
    setAssignments(updated);
    addToast("Assignment Renamed", "success");
    setRenameAssignmentId(null);
  };

  const handleDelete = async (assignmentId) => {
    // TODO: add deleteAssignment hook call here
    // const result = await deleteAssignment(assignmentId);
    // if (!result.success) { addToast(result.message, "error"); return; }

    const updated = assignments.filter(a => a.id !== assignmentId);
    setAssignments(updated);
    setDeleteAssignmentId(null);
    addToast("Assignment Deleted", "success");
  };


  return (
    <div className="space-y-6" onClick={() => setRenameAssignmentId(null)}>
      <div className='flex justify-between'>
        <h2 className="text-h3">Assignments</h2>
        <NavLink to={`/course/${courseId}/content/assignments/create`}>
          <Button
            buttonName="Add New Assignment"
            frontIconName="ic:baseline-plus"
            frontIconWidth="24px"
            frontIconHeght="24px"
            className="p-1 rounded font-semibold text-md"
            bgClass=""
            textClass="hover:text-primary dark:hover:text-white/70"
            isMobile={isMobile}
          />
        </NavLink>
      </div>

      <ul className="flex flex-col">
        {loading ? (
          <div className="h-full w-full">
            <ContentLoading count={7} />
          </div>

        ) : error ? (
          <div className="text-center py-6 text-red-500">
            {error}
          </div>

        ) : assignments?.length > 0 ? (
          assignments.map((assignment) => {
            const isOpen = isOpenDropdown === assignment.id;
            return (
              <li
                key={assignment.id}
                ref={(el) => (rowRefs.current[assignment.id] = el)}
              >
                <NavLink
                  to={`/course/${courseId}/content/assignments/${assignment.id}`}
                  onDoubleClick={() => navigate(`/course/${courseId}/content/assignments/${assignment.id}`)}
                  onClick={(e) => {
                    if (isOpenDropdown === assignment.id) {
                      e.preventDefault();
                      setIsOpenDropdown(null);
                    }
                  }}
                  className={clsx(
                    "flex items-center justify-between px-5 py-3 rounded-md hover:bg-primary/16 dark:hover:bg-primary transition-colors cursor-pointer",
                    (isOpenDropdown === assignment.id || renameAssignmentId === assignment.id) && "bg-primary/16"
                  )}
                >
                  {/* Left side */}
                  <div className="flex items-center w-full min-w-0 gap-3">
                    <Icon
                      name="material-symbols:assignment-outline"
                      height="25"
                      width="25"
                      className="text-muted-foreground"
                    />
                    <div className='flex flex-col w-full'>
                      {renameAssignmentId === assignment.id ? (
                        <span
                          className='flex-1'
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Input
                            ref={inputRef}
                            className="text-sm"
                            paddingClass="p-2"
                            bgClass="bg-primary-border"
                            value={renameValue}
                            autoFocus
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => setRenameAssignmentId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const trimmed = renameValue.trim();
                                const original = assignment.title.trim();
                                if (trimmed === original) {
                                  setRenameAssignmentId(null);
                                  return;
                                }
                                if (!trimmed) return;
                                renameAssignmentHandler(assignment.id);
                              }
                              if (e.key === "Escape") {
                                setRenameAssignmentId(null);
                                setRenameValue(assignment.title);
                              }
                            }}
                          />
                        </span>
                      ) : (
                        <span className="text-h45 text-foreground">
                          {assignment.title}
                        </span>
                      )}
                      <span className='text-caption text-muted-foreground'>
                        Due: {formatDateTime(assignment.dueDate)}
                      </span>
                    </div>
                  </div>

                  {/* Right side - kebab */}
                  <div
                    className='relative w-20 h-auto flex justify-center'
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsOpenDropdown(prev =>
                        prev === assignment.id ? null : assignment.id
                      );
                    }}
                  >
                    <Icon
                      name="iconamoon:menu-kebab-horizontal"
                      height="32px"
                      width="32px"
                      className="cursor-help"
                    />
                    {isOpen && (
                      <Dropdown
                        buttons={getAssignmentButtons(courseId, assignment.id, handleRename, setDeleteAssignmentId, navigate)}
                        closeDropdown={() => setIsOpenDropdown(null)}
                      />
                    )}
                    {deleteAssignmentId === assignment.id && (
                      <Modal
                        isOpen={true}
                        onClose={() => setDeleteAssignmentId(null)}
                        title="Are you absolutely sure?"
                      >
                        <DeleteConfirmContent
                          onClose={() => setDeleteAssignmentId(null)}
                          onConfirm={() => handleDelete(assignment.id)}
                          confirmText={assignment.title}
                          entityName="assignment"
                          message={`You are about to permanently delete ${assignment.title}.`}
                        />
                      </Modal>
                    )}
                  </div>
                </NavLink>
              </li>
            );
          })
        ) : (
          <div className="py-10">
            <CourseContentEmptyState
              title="No Assignments Found"
              description="You have not added any assignments yet. Start by creating one."
              buttonText="Add New Assignment"
              onButtonClick={() => navigate(`/course/${courseId}/content/assignments/create`)}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default AssignmentsPage;