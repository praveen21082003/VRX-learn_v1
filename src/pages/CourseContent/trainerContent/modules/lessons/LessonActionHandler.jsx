import React from 'react'
import LessonForm from '../../../../../components/forms/LessonForm'
import { BackButton } from '@/components/ui'
import { useModuleContext, useCourse } from "../../layout/CourseManagementLayout";
import { useParams } from 'react-router-dom'
// import useLessons from '../hooks/useLessons'
import LessonPreview from '@/components/lessonViewer/LessonPreview'

function LessonActionHandler({ mode }) {
    const isEdit = mode === "edit";
    const { moduleId } = useParams();
    const { modules, setModules, lessons } = useModuleContext();

    const { lessonId } = useParams();

    const initialData = lessonId
        ? lessons?.find(l => l.id === lessonId)
        : null;


    const { courseId, course, loading } = useCourse();
    return (
        <div>
            <BackButton to={`/course/${courseId}/content/modules/${moduleId}`} label={`Module`} />
            <h2 className="text-h3">
                {isEdit ? "Edit Lesson" : mode === "view" ? "Lesson Preview" : "New Lesson"}
            </h2>
            {mode === "view" ? (
                <LessonPreview initialData={initialData} />
            ) : (
                <LessonForm
                    mode={mode}
                    initialData={initialData}
                    modules={modules}
                    courseId={courseId}
                />
            )}
        </div>
    )
}

export default LessonActionHandler
