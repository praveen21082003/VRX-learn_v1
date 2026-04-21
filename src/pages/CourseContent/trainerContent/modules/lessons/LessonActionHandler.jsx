import React from 'react'
import LessonForm from '../../../../../components/forms/LessonForm'
import { BackButton } from '@/components/ui'
import { useModuleContext, useCourse } from "../../layout/CourseManagementLayout";
import { useParams } from 'react-router-dom'
// import useLessons from '../hooks/useLessons'

function LessonActionHandler({ mode }) {
    const isEdit = mode === "edit";
    const { moduleId } = useParams();
    const { modules, setModules, lessons } = useModuleContext();

    const { lessonId } = useParams();

    const initialData = lessonId
        ? lessons?.find(l => l.id === lessonId)
        : null;

    console.log(lessons)

    const { courseId, course, loading } = useCourse();
    return (
        <div>
            <BackButton to={`/course/${courseId}/content/modules/${moduleId}`} label={`Module`} />
            <h2 className="text-h3">
                {isEdit ? "Edit Lesson" : "New Lesson"}
            </h2>
            <LessonForm
                mode={mode}
                initialData={initialData}
                modules={modules}
                courseId={courseId}
            />
        </div>
    )
}

export default LessonActionHandler
