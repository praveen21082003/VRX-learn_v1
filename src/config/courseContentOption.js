// courseContentOption.js — make path a function
export const COURSE_EDIT_SECTIONS = (courseId) => [
    {
        key: "info",
        label: "Course Information",
        path: `/course/${courseId}/content/info`,
    },
    {
        key: "modules",
        label: "Modules",
        path: `/course/${courseId}/content/modules`,
    },
    {
        key: "assignments",
        label: "Assignments",
        path: `/course/${courseId}/content/assignments`,
    },
]