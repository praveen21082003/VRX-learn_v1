import React from 'react'
import ModuleForm from '@/components/forms/ModuleForm'
import { BackButton } from '@/components/ui'
import { useModuleContext, useCourse } from "../layout/CourseManagementLayout";
import { useParams } from 'react-router-dom'



function ModuleActionHandler({ mode }) {
    const isEdit = mode === "edit";
    const { moduleId } = useParams();
    const { modules, setModules } = useModuleContext();

    const { courseId, course, loading } = useCourse();


    const moduleData = moduleId
        ? modules.find(m => m.id === moduleId)
        : null;
    return (

        <div>
            <BackButton to={`/course/${courseId}/content/modules`} label={`${course?.title || "Loading..."} - Modules`} />
            <h2 className="text-h3">
                {isEdit ? "Edit Module" : "New Module"}
            </h2>

            <ModuleForm
                mode={mode}
                initialData={moduleData}
                setModules={setModules}
                modules={modules}
                courseId={courseId}
            />
        </div>

    )
}

export default ModuleActionHandler
