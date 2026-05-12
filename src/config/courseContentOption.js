// courseContentOption.js — make path a function

export const COURSE_EDIT_SECTIONS = (courseId, can) => [
    can("VIEW_COURSE_INFO") && {
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
].filter(Boolean);