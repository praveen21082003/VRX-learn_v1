import React, { useState, useEffect, useRef } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import { Button, BackButton, Icon, Dropdown, MarkdownContent, Input, Modal, DeleteConfirmContent, CourseContentEmptyState } from '@/components/ui'
import { ContentLoading } from "@/components/ui/loading"
import ReorderList from '@/components/dnd/ReorderList';
import { useToast } from '@/context/ToastProvider';
import { editButtons, buttons } from '@/config/dropdownButtons.js'
import { useReorder } from '@/components/dnd/useReorder';


import { useCourse, useModuleContext } from '../../layout/CourseManagementLayout';

function LessonsPage() {
    const isMobile = window.innerWidth < 768;
    const navigate = useNavigate();
    const { addToast } = useToast();
    const { moduleId } = useParams();

    // context
    const { courseId } = useCourse();
    const {
        modules,
        lessons,
        setLessons,
        lessonLoading,
        error,
        fetchLessons,
        updateLessonAction,
        isUpdating,
        deleteLessonAction,
        isDeleting,
        updateModule,
        moduleDeleting,
        deleteModule,
        handleDeleteModule,
        invalidateCache, //this for cache memory for lessons
    } = useModuleContext();

    // hook
    const { reorderLessons, isUpdatingLessons: reOrdering } = useReorder();

    // state
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [orderedLessons, setOrderedLessons] = useState([]);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [isOpenDropdown, setIsOpenDropdown] = useState(null);
    const [renameLessonId, setRenameLessonId] = useState(null);
    const [renameValue, setRenameValue] = useState("");
    const [deleteLessonId, setDeleteLessonId] = useState(null);
    const [deleteModuleOpen, setDeleteModuleOpen] = useState(false);


    // refs
    const inputRef = useRef();
    const rowRefs = useRef({});

    // find selected module from context
    const selectedModule = modules?.find(m => m.id === moduleId);

    // fetch lessons when moduleId changes
    useEffect(() => {
        if (moduleId) fetchLessons(moduleId);
    }, [moduleId]);

    // sync lessons to ordered state
    useEffect(() => {
        if (lessons) setOrderedLessons(lessons);
    }, [lessons]);

    // focus input on rename
    useEffect(() => {
        if (renameLessonId && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [renameLessonId]);

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
    const handleRename = (lessonId) => {
        const lesson = orderedLessons.find(l => l.id === lessonId);
        setRenameLessonId(lessonId);
        setRenameValue(lesson?.title || "");
        setIsOpenDropdown(null);
    };

    const renameLessonHandler = async (lessonId) => {
        const newTitle = renameValue.trim();
        if (!newTitle) return;

        const original = orderedLessons.find(l => l.id === lessonId)?.title?.trim();
        if (newTitle === original) {
            setRenameLessonId(null);
            return;
        }

        const result = await updateLessonAction(lessonId, { title: newTitle });
        if (!result.success) {
            addToast(result.message, "error");
            return;
        }

        const updated = orderedLessons.map(l =>
            l.id === lessonId ? { ...l, title: newTitle } : l
        );
        setOrderedLessons(updated);
        setLessons(updated);
        invalidateCache(moduleId);
        addToast("Lesson Renamed", "success");
        setRenameLessonId(null);
    };

    const handleDeleteLesson = async (lessonId) => {
        const result = await deleteLessonAction(lessonId);
        if (!result.success) {
            addToast(result.message, "error");
            return;
        }

        const updated = orderedLessons.filter(l => l.id !== lessonId);
        setOrderedLessons(updated);
        setLessons(updated);
        invalidateCache(moduleId);
        setDeleteLessonId(null);
        addToast("Lesson deleted successfully.", "success");
    };

    const handleReorder = () => {
        setIsReorderMode(true)
    }

    useDocumentTitle(selectedModule ? `Lessons - ${selectedModule.title}` : "Lessons");

    if (error) return <div className="p-10 text-red-500">{error}</div>;

    return (
        <>
            <div className='border-b lg:border-0 border-default pt-2 px-2'>
                <BackButton to={`/course/${courseId}/content/modules`} label="Back to Modules" />
            </div>
            <div className="no-select space-y-4 p-4">
                <div className='flex justify-between'>
                    <h2 className={`${isMobile ? 'text-h3' : 'text-h4'} truncate`}>{isMobile ? "Lessons" : selectedModule?.title}</h2>
                    <div className='flex gap-px'>
                        <span className='shrink-0 flex gap-1'>

                            <NavLink to={`/course/${courseId}/content/modules/${moduleId}/lesson/create`}>
                                <Button
                                    buttonName="Add New Lesson"
                                    frontIconName='ic:baseline-plus'
                                    frontIconWidth="24px"
                                    frontIconHeght="24px"
                                    className="shrink-0 p-1 px-2 rounded font-semibold text-md"
                                    bgClass=""
                                    textClass=""
                                    isMobile={isMobile}
                                />
                            </NavLink>

                            {isReorderMode ? (
                                <Button
                                    buttonName='Done'
                                    frontIconWidth="24px"
                                    frontIconHeght="24px"
                                    frontIconName='material-symbols:done-rounded'
                                    className="shrink-0 p-1 px-4 rounded"
                                    onClick={() => setIsReorderMode(false)}
                                    isMobile={isMobile}
                                />
                            ) : (
                                <div className='relative flex flex-row gap-px'>
                                    <Button
                                        buttonName="Edit Details"
                                        frontIconName={isMobile ? "codicon:kebab-vertical" : "mingcute:pencil-line"}
                                        frontIconWidth="24px"
                                        frontIconHeght="24px"
                                        className="shrink-0 p-1 px-2 rounded-r-none rounded font-semibold text-md"
                                        bgClass=""
                                        textClass=""
                                        onClick={() => isMobile ? setOpenDropDown(prev => !prev) : navigate(`/course/${courseId}/content/modules/${moduleId}/edit`)}
                                        isMobile={isMobile}
                                    />
                                    {!isMobile &&
                                        <Button
                                            frontIconName="subway:down-2"
                                            frontIconWidth="16px"
                                            frontIconHeght="16px"
                                            className="p-2 px-2 rounded-l-none rounded"
                                            onClick={() => setOpenDropDown(prev => !prev)}
                                        />
                                    }

                                    {openDropDown && (
                                        <Dropdown
                                            buttons={editButtons(handleReorder, () => setDeleteModuleOpen(true))}
                                            closeDropdown={() => setOpenDropDown(false)}
                                        />
                                    )}

                                </div>
                            )}
                        </span>

                    </div>
                </div>
                <h2 className="text-h5 font-bold truncate">{isMobile && selectedModule?.title}</h2>


                <MarkdownContent content={selectedModule?.description} />

                <ul className="flex flex-col">
                    {isReorderMode ? (
                        <ReorderList
                            items={orderedLessons}
                            reorder={reorderLessons}
                            isUpdating={reOrdering}
                            addToast={addToast}
                            onReorderUI={(newOrder) => {
                                setOrderedLessons(newOrder);
                                setLessons(newOrder);
                            }}
                        />
                    ) : lessonLoading ? (
                        <div className="h-full w-full">
                            <ContentLoading count={7} />
                        </div>
                    ) : orderedLessons?.length > 0 ? (
                        <div>
                            {orderedLessons.map((lesson, index) => {
                                const isOpen = isOpenDropdown === lesson.id;
                                return (
                                    <div
                                        key={lesson.id}
                                        ref={(el) => (rowRefs.current[lesson.id] = el)}
                                    >
                                        <div
                                            className={clsx(
                                                'flex gap-1 sm:gap-2 items-center px-2 lg:px-5 py-3 rounded text-h45 hover:bg-primary/16 dark:hover:bg-primary ',
                                                isUpdating ? "cursor-progress" : "cursor-pointer",
                                                (isOpenDropdown === lesson.id || renameLessonId === lesson.id) && 'bg-primary/16'
                                            )}
                                            onDoubleClick={() => navigate(`/course/${courseId}/content/modules/${moduleId}/lesson/${lesson.id}/preview`)}
                                            onClick={(e) => {
                                                if (isOpenDropdown === lesson.id) {
                                                    e.preventDefault();
                                                    setIsOpenDropdown(null);
                                                }
                                            }}
                                        >
                                            <Icon
                                                name={lesson.mimeType === 'video/mp4' ? "ep:video-play" : "basil:document-outline"}
                                                height="25px"
                                                width="25px"
                                            />
                                            <div className='flex items-center gap-2 w-full min-w-0'>
                                                {/* <span className="py-1 mr-2">{index + 1}.</span> */}

                                                {renameLessonId === lesson.id ? (
                                                    <Input
                                                        ref={inputRef}
                                                        value={renameValue}
                                                        disabled={isUpdating}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setRenameValue(value.toUpperCase());
                                                        }}
                                                        autoFocus
                                                        className="text-sm"
                                                        bgClass="bg-primary-border"
                                                        onBlur={() => setRenameLessonId(null)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                setRenameLessonId(null);
                                                                renameLessonHandler(lesson.id);
                                                            }
                                                            if (e.key === "Escape") {
                                                                setRenameLessonId(null);
                                                                setRenameValue(lesson.title);
                                                            }
                                                        }}
                                                    />
                                                ) : (
                                                    <span className="truncate flex-1">{lesson.title}</span>
                                                )}

                                                <div
                                                    className='relative flex justify-center'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setIsOpenDropdown(prev =>
                                                            prev === lesson.id ? null : lesson.id
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
                                                            buttons={buttons(courseId, moduleId, handleRename, lesson.id, navigate, setDeleteLessonId)}
                                                            closeDropdown={() => setIsOpenDropdown(null)}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {deleteLessonId === lesson.id && (
                                            <Modal
                                                isOpen={true}
                                                onClose={() => setDeleteLessonId(null)}
                                                title="Are you absolutely sure?"
                                            >
                                                <DeleteConfirmContent
                                                    onClose={() => setDeleteLessonId(null)}
                                                    onConfirm={() => handleDeleteLesson(lesson.id)}
                                                    loading={isDeleting}
                                                    confirmText={lesson.title}
                                                    entityName="lesson"
                                                    message={`You are about to permanently delete the ${lesson.title} lesson. All associated materials will be permanently erased.`}
                                                />
                                            </Modal>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            <CourseContentEmptyState
                                title="No Lessons Found"
                                description="You have not added any lessons to this Module yet, Start building your course by adding Lessons."
                                buttonText="Add New Lesson"
                                onButtonClick={() => navigate(`/course/${courseId}/content/modules/${moduleId}/lesson/create`)}
                            />
                        </div>
                    )}
                </ul>
            </div>
            {deleteModuleOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => setDeleteModuleOpen(false)}
                    title="Are you absolutely sure?"
                >
                    <DeleteConfirmContent
                        onClose={() => setDeleteModuleOpen(false)}
                        onConfirm={() =>
                            handleDeleteModule(moduleId, () => {
                                navigate(`/course/${courseId}/content/modules`);
                            })
                        }
                        loading={moduleDeleting}
                        confirmText={selectedModule?.title}
                        entityName="module"
                        message={`You are about to permanently delete the ${selectedModule?.title} module. All associated lessons will be permanently erased.`}
                    />
                </Modal>
            )}
        </>

    );
}

export default LessonsPage;