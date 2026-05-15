
// User filter options

// This Options are uses to both enrollments and users 
export const ROLE_OPTIONS = [

    { label: "All Users", value: null },
    { label: "Admin", value: "admin" },
    { label: "Sub Admin", value: "subadmin" },
    { label: "Trainer", value: "trainer" },
    { label: "Trainee", value: "trainee" },
]

export const SORT_OPTIONS = [
    { label: "Newest First", value: "create_desc" },
    { label: "Oldest First", value: "create_asc" },
    { label: "Username (A - Z)", value: "user_asc" },
    { label: "Username (Z - A)", value: "user_desc" },

]


export const STATUS_OPTIONS = [
    { label: "All", value: null },
    { label: "Active", value: "active" },
    // { label: "Inactive", value: "inactive" },
    // { label: "Pending", value: "pending" },
]


export const EROLLMENT_SORT_OPTIONS = [
    { label: "Newest First", value: "create_desc" },
    { label: "Oldest First", value: "create_asc" },
    { label: "Course Name (A - Z)", value: "course_asc" },
    { label: "Course Name (Z - A)", value: "course_desc" },
]


export const EROLLMENT_STATUS_OPTIONS = [
    { label: "All", value: null },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Suspended", value: "suspended" },
    { label: "Dropout", value: "dropped" },
    { label: "Completed", value: "completed" },
]


export const COURSE_SORT_OPTION = [
    { label: "Newest First", value: "create_desc" },
    { label: "Oldest First", value: "create_asc" },
    { label: "Name (A - Z)", value: "course_asc" },
    { label: "Name (Z - A)", value: "course_desc" },
    { label: "No.of Trainees (Asc)", value: "trainees_asc" },
    { label: "No.of Trainees (Desc)", value: "trainees_desc" },
]


// sort option for the trainee roster
export const TRAINEE_ROSTER_SORT_OPTIONS = [
    { label: "Newest First", value: "date_asc" },
    { label: "Oldest First", value: "date_desc" },
    { label: "Name (A - Z)", value: "name_asc" },
    { label: "Name (Z - A)", value: "name_desc" },
]

// category options for the reports page
export const REPORT_CATEGORY_OPTIONS = [
    { label: "All", value: null },
    { label: "Course Contents & Materials", value: "course_contents&materials" },
    { label: "Assignments", value: "assignments" },
    { label: "Account & Access", value: "account&access" },
    { label: "Technical Bug", value: "technical_bug" },
    { label: "Others", value: "others" },
]

// status options for the reports page
export const REPORT_STATUS_OPTIONS = [
    { label: "All", value: null },
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
]

// role options for the reports page
export const REPORT_ROLE_OPTIONS = [
    { label: "All", value: null },
    { label: "Trainee", value: "trainee" },
    { label: "Trainer", value: "trainer" },
    { label: "Admin", value: "admin" }
]

export const REPORT_STATUS_OPTIONS_IN_DETAILS_PAGE = [
    { label: "Pending", value: "pending" },
    { label: "Resolved", value: "resolved" },
]




