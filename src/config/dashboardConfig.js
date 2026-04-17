
// This for Admin KPIs
export const ADMIN_STAT_CARDS = [
    {
        key: "totalUsers",
        label: "Total Users",
        Icon: "mdi:users",
    },
    {
        key: "totalCourses",
        label: "Total Courses",
        Icon: "mdi:book-education-outline",
    },
    {
        key: "totalEnrollments",
        label: "Total Enrollments",
        Icon: "mdi:book-account",
    },
    {
        key: "averageCompletion",
        label: "Average Completion",
        Icon: "nrk:media-completed",
    }
]

// This for trainer KPIs
export const TRAINER_STAT_CARDS = [
    {
        key: "assignedCourses",
        label: "Assigned Courses",
        Icon: "mdi:book-open-variant"
    },
    {
        key: "totalLearners",
        label: "Active Learners",
        Icon: "mdi:users"
    },
    {
        key: "certificated_issued",
        label: "Certificates Issued",
        Icon: "mdi:certificate-outline",
    },
    {
        key: "average_completion",
        label: "Average Completion",
        Icon: "mdi:check-circle"
    }
]

// This for Quick Action
export const QUICK_ACTIONS_CARDS = [
    {
        key: "user",
        icon: "mdi:users",
        title: "New User",
        caption: "Create account",
        bgClass: "bg-primary"
    },
    {
        key: "course",
        icon: "mdi:book-education-outline",
        title: "New Course",
        caption: "Publish content"
    },
    {
        key: "enroll",
        icon: "mdi:book-account",
        title: "Enroll Trainee",
        caption: "Assign to course"
    }
]