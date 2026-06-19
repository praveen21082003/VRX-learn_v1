import React, { use, useEffect } from 'react'

import { useDocumentTitle } from '@/hooks/useDocumentTitle';

import LessonForm from '../../../../../components/forms/LessonForm'
import { BackButton } from '@/components/ui'
import { useModuleContext, useCourse } from "../../layout/CourseManagementLayout";
import { useNavigate, useParams } from 'react-router-dom'
// import useLessons from '../hooks/useLessons'
import LessonViewer from '@/components/lessonViewer/LessonViewer'

function LessonActionHandler({ mode }) {
    const isEdit = mode === "edit";
    const navigate = useNavigate();

    const { moduleId, lessonId, courseId } = useParams();
    const { modules, fetchLessons, setModules, lessons, invalidateCache } = useModuleContext();
    const { course, loading } = useCourse();


    // fetch lessons for current module
    useEffect(() => {
        if (moduleId) fetchLessons(moduleId);
    }, [moduleId]);



    // find current module index
    const currentModuleIndex = modules?.findIndex(m => m.id === moduleId);
    const currentModule = modules?.[currentModuleIndex];

    // find current lesson index within current module's lessons
    const currentLessonIndex = lessons?.findIndex(l => l.id === lessonId);
    const currentLesson = lessons?.[currentLessonIndex];

    // ── build prev ──────────────────────────────
    const prevLesson = currentLessonIndex > 0
        ? lessons[currentLessonIndex - 1]
        : null; // null if first lesson — no cross module

    // ── build next ──────────────────────────────
    const nextLesson = currentLessonIndex < lessons?.length - 1
        ? lessons[currentLessonIndex + 1]
        : null; // null if last lesson — no cross module

    // ── navigate handler — simple, no fetch needed ──
    const handleNavigate = (direction) => {
        const target = direction === "prev" ? prevLesson : nextLesson;
        if (!target) return;
        navigate(`/course/${courseId}/content/modules/${moduleId}/lesson/${target.id}/preview`);
    };

    // ── activeLesson object for LessonViewer ────
    const activeLesson = {
        lessonId,
        moduleIndex: currentModuleIndex,
        lessonIndex: currentLessonIndex,
    };


    const initialData = lessonId
        ? lessons?.find(l => l.id === lessonId)
        : null;


    useDocumentTitle(
        mode === "edit" ? `${initialData?.title || ""} - Update Lesson` :
            mode === "view" ? `${currentLesson?.title || ""} - Lesson Preview` :
                `${currentModule?.title || ""} - create lesson`
    );

    const handleBackToModule = () => {
        navigate(`/course/${courseId}/content/modules/${moduleId}`);
    };


    return (
        <div className='p-4 mb-20'>
            <BackButton to={`/course/${courseId}/content/modules/${moduleId}`} label={`Back to Module`} />
            <div className='flex items-center gap-5'>
                <h2 className="text-h3">
                    {isEdit ? "Edit Lesson" : mode === "view" ? "" : "New Lesson"}
                </h2>
            </div>

            {mode === "view" ? (
                <LessonViewer
                    lesson={currentLesson}
                    activeLesson={activeLesson}
                    prevLesson={prevLesson}
                    nextLesson={nextLesson}
                    onNavigate={handleNavigate}
                    onBackToModule={handleBackToModule}
                />
            ) : (
                <LessonForm
                    mode={mode}
                    initialData={initialData}
                    modules={modules}
                    courseId={courseId}
                    invalidateCache={invalidateCache}
                />
            )}
        </div>
    )
}

export default LessonActionHandler
