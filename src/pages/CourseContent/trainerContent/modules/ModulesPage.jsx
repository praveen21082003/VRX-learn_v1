import React, { useState, useEffect, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx';

import { useModuleContext, useCourse } from "../layout/CourseManagementLayout";
import { useReorder } from '@/components/dnd/useReorder';
import useModules from './hooks/useModules';
// import useDeleteModule from '../hooks/useDeleteModule';

import { Icon, Button, Input, Dropdown, Modal, CourseContentEmptyState, DeleteConfirmContent } from '@/components/ui'
import { ContentLoading } from "@/components/ui/loading"
import ReorderList from '@/components/dnd/ReorderList';
import { getModuleButtons } from '@/config/DropdownButtons';
import { useToast } from '@/context/ToastProvider';


function ModulesPage() {
  const isMobile = window.innerWidth < 768;

  const navigate = useNavigate();
  const { addToast } = useToast();

  // context
  const { modules, setModules } = useModuleContext();
  const { courseId, course, loading } = useCourse();


  // hooks
  const { updateModule, isDeleting, deleteModule } = useModules();
  const { reorderModules, isUpdatingModules } = useReorder();

  // state
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [orderedModules, setOrderedModules] = useState([]);
  const [isOpenDropdown, setIsOpenDropdown] = useState(null);
  const [renameModuleId, setRenameModuleId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [isRename, setIsRename] = useState(false);
  const [deleteModuleId, setDeleteModuleId] = useState(null);

  // refs
  const inputRef = useRef(null);
  const rowRefs = useRef({});

  // sync modules from context to local ordered state
  useEffect(() => {
    if (modules) {
      setOrderedModules(modules);
    }
  }, [modules]);

  // focus input when rename mode activates
  useEffect(() => {
    if (renameModuleId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [renameModuleId]);

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
  const handleReorder = () => setIsReorderMode(prev => !prev);

  const handleRename = (moduleId) => {
    const module = orderedModules.find(m => m.id === moduleId);
    setRenameModuleId(moduleId);
    setRenameValue(module?.title || "");
    setIsOpenDropdown(null);
  };

  // rename module
  const renameModuleHandler = async (moduleId) => {
    const newTitle = renameValue.trim();
    if (!newTitle) return;

    try {
      setIsRename(true);
      const result = await updateModule(moduleId, { title: newTitle });

      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      const updated = orderedModules.map(m =>
        m.id === moduleId ? { ...m, title: newTitle } : m
      );
      setOrderedModules(updated);
      setModules(updated);

      addToast("Module Renamed", "success");
      setRenameModuleId(null);
    } catch (error) {
      addToast("Error Occurred", "error");
    } finally {
      setIsRename(false);
    }
  };


  // handle delete module
  const handleDeleteModule = async (moduleId) => {
    try {
      const result = await deleteModule(moduleId);

      if (!result.success) {
        addToast(result.message, "error");
        return;
      }

      const updated = orderedModules.filter(m => m.id !== moduleId);
      setOrderedModules(updated);
      setModules(updated);

      setDeleteModuleId(null);
      addToast("Module deleted successfully.", "success");
    } catch (error) {
      addToast("Failed to delete module. Please try again.", "error");
    }
  };


  return (
    <div className="space-y-4" onClick={() => setRenameModuleId(null)}>
      <div className='flex justify-between'>
        <h2 className="text-h3">Curriculum</h2>
        <div className='flex gap-3'>
          <Button
            disabled={orderedModules?.length === 0}
            title={orderedModules?.length === 0 ? "no modules" : "reorder"}
            buttonName={clsx(isReorderMode ? "Done" : "Reorder")}
            frontIconName={clsx(isReorderMode ? "material-symbols:done-rounded" : "ix:reorder")}
            frontIconWidth="24px" frontIconHeght="24px"
            className="rounded p-1"
            bgClass={clsx(isReorderMode && "bg-primary")}
            textClass={clsx(isReorderMode ? "text-white" : "hover:text-primary hover:dark:text-background")}
            onClick={handleReorder}
            isMobile={isMobile}
          />
          <NavLink to={`/course/${courseId}/content/modules/create`}>
            <Button
              buttonName="Add New Module"
              frontIconName="ic:baseline-plus"
              frontIconWidth="24px"
              frontIconHeght="24px"
              className="p-1 rounded"
              bgClass=""
              textClass="hover:text-primary hover:dark:text-background"
              isMobile={isMobile}
            />
          </NavLink>
        </div>
      </div>

      <p className="text-body">
        {course?.shortDescription || "No short description available"}
      </p>

      <ul className="flex flex-col">
        {isReorderMode ? (
          <ReorderList
            items={orderedModules}
            reorder={reorderModules}
            isUpdating={isUpdatingModules}
            addToast={addToast}
            onReorderUI={(newOrder) => {
              setOrderedModules(newOrder);
              setModules(newOrder); // update context
            }}
          />
        ) : loading ? (
          <div className="h-full w-full">
            <ContentLoading count={7} />
          </div>
        ) : orderedModules?.length > 0 ? (
          <>
            {orderedModules.map((module, index) => {
              const isOpen = isOpenDropdown === module.id;
              return (
                <div
                  key={module.id}
                  ref={(el) => (rowRefs.current[module.id] = el)}
                >
                  <NavLink
                    to={`/course/${courseId}/content/modules/${module.id}`}
                    onDoubleClick={() => navigate(`${module.id}`)}
                    onClick={(e) => {
                      if (isOpenDropdown === module.id) {
                        e.preventDefault();
                        setIsOpenDropdown(null);
                      }
                    }}
                    className={clsx(
                      'flex justify-between items-center p-2 lg:px-5 py-3 rounded text-h45 hover:bg-primary/16 dark:hover:bg-primary',
                      isRename ? "cursor-progress" : "cursor-pointer",
                      (isOpenDropdown === module.id || renameModuleId === module.id) && 'bg-primary/16'
                    )}
                  >
                    <li className="flex items-center gap-2 w-full min-w-0">
                      <span className="hidden md:block shrink-0 text-muted-foreground">
                        Module {index + 1} -
                      </span>

                      {renameModuleId === module.id ? (
                        <span
                          className="flex w-full gap-4"
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                          <Input
                            ref={inputRef}
                            value={renameValue}
                            disabled={isRename}
                            autoFocus
                            className="text-sm"
                            bgClass="bg-primary-border"
                            onChange={(e) => setRenameValue(e.target.value)}
                            onBlur={() => setRenameModuleId(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                if (isRename) return;
                                const trimmed = renameValue.trim();
                                const original = module.title.trim();
                                if (trimmed === original) {
                                  setRenameModuleId(null);
                                  return;
                                }
                                if (!trimmed) return;
                                renameModuleHandler(module.id);
                              }
                              if (e.key === "Escape") {
                                setRenameModuleId(null);
                                setRenameValue(module.title);
                              }
                            }}
                          />
                        </span>
                      ) : (
                        <span className="truncate flex-1">
                          {module.title}
                        </span>
                      )}
                    </li>

                    <div
                      className='relative h-auto flex justify-center mr-5'
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpenDropdown(prev =>
                          prev === module.id ? null : module.id
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
                          buttons={getModuleButtons(courseId, module.id, handleRename, setDeleteModuleId, navigate)}
                          closeDropdown={() => setIsOpenDropdown(null)}
                        />
                      )}
                      {deleteModuleId === module.id && (
                        <Modal
                          isOpen={true}
                          onClose={() => setDeleteModuleId(null)}
                          title="Are you absolutely sure?"
                        >
                          <DeleteConfirmContent
                            onClose={() => setDeleteModuleId(null)}
                            onConfirm={() => handleDeleteModule(module.id)}
                            loading={isDeleting}
                            confirmText={module.title}
                            entityName="module"
                            message={`You are about to permanently delete the ${module.title} module. All associated materials...`}
                          />
                        </Modal>
                      )}
                    </div>
                  </NavLink>
                </div>
              );
            })}
          </>
        ) : (
          <div className="h-full w-full">
            <CourseContentEmptyState
              title="No Modules Found"
              description="You have not added any modules to this Course yet, Start building your course by adding modules."
              buttonText="Add New Module"
              onButtonClick={() => navigate(`/course/${courseId}/content/modules/create`)}
            />
          </div>
        )}
      </ul>
    </div>
  );
}

export default ModulesPage;