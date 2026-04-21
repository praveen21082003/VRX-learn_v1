export const TRAINER_SECTIONS = [
  {
    key: "content",
    title: "Course Content",
    path: (courseId) => `/course/${courseId}/content`,
    MetaData: (course) =>
      `${course.noOfModules} Modules • ${course.noOfLessons} Lessons • ${course.noOfAssignments} Assignment`,
    icon: "tabler:layout-dashboard-filled",
  },
  {
    key: "roster",
    title: "Trainee Roster",
    path: (courseId) => `/course/${courseId}/roster`,
    MetaData: (course) => `${course.noOfTrainees} Trainees Enrolled`,
    icon: "mdi:users",
  },
  // {
  //   key: "discussion",
  //   title: "Discussion Forum",
  //   description: (course) => `${course.discussion_count} Total Discussions`,
  //   icon: "lucide:message-square-text"
  // },
];

export const TRAINEE_SECTIONS = [
  {
    key: "lesson",
    title: "Lessons",
    path: (courseId) => `/course/${courseId}/learn/lesson`,
    MetaData: (course) => `${course.noOfModules} Modules • ${course.noOfLessons} Lessons`,
    // icon: "mdi:users",
  },
  {
    key: "assignment",
    title: "Assignment",
    path: (courseId) => `/course/${courseId}/learn/assignment`,
    MetaData: (course) => `${course.noOfAssignments} Assignments`,
    // icon: "mdi:users",
  },
  // {
  //   key: "quizzes",
  //   title: "Quiz",
  //   durationKey: "quiz_duration",
  // },

  // {
  //   key: "labs",
  //   title: "Lab Credentials",
  //   durationKey: "lab_duration",
  // },
  // {
  //   key: "feedback",
  //   title: "Feedback",
  //   durationKey: "feedback_duration",
  // },
];