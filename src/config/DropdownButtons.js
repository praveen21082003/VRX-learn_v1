import { usePermission } from "@/hooks/usePermission"

// In courseInfo page create button
export const getCreateButtons = ({
  navigate,
  courseSlug
}) => [
    { key: "module", title: "Module", icon: "codicon:file-submodule", onClick: () => navigate(`/course/${courseSlug}/content/modules/create`), permission: "CREATE_MODULES" },
    { key: "assignment", title: "Assignment", icon: "material-symbols:assignment-outline", onClick: () => navigate(`/course/${courseSlug}/content/assignments/create`), permission: "CREATE_ASSIGNMENTS" },
    // { key: "lab_credential", title: "Lab Credential", icon: "ooui:lab-flask", onClick: () => navigate(`/course/${courseSlug}/content/labs/create`), permission: "CREATE_LABS" },
    // { key: "quiz", title: "Quiz", icon: "hugeicons:quiz-05", onClick: () => navigate(`/course/${courseSlug}/content/quiz/create`), permission: "CREATE_QUIZ" }
  ]


// LessonEditor buttons
export const editButtons = (handleReorder) => [
  { key: "reorder", title: "Reorder", icon: "ix:reorder", onClick: () => handleReorder() },
  { key: "delete", title: "Delete", icon: "ic:baseline-delete", onClick: () => alert("delete clicked") },
];

export const buttons = (courseSlug,moduleId,handleRename, lessonId, navigate, setDeleteLessonId) => [
  { key: "view", title: "View", icon: "material-symbols:view-cozy-sharp", onClick: () => navigate(`/course/${courseSlug}/content/modules/${moduleId}/lesson/${lessonId}/view`) },
  { key: "edit", title: "Edit", icon: "mingcute:pencil-line", onClick: () => navigate(`/course/${courseSlug}/content/modules/${moduleId}/lesson/${lessonId}/edit`) },
  { key: "rename", title: "Rename", icon: "ix:rename", onClick: () => handleRename(lessonId) },
  { key: "delete", title: "Delete", icon: "ic:baseline-delete", onClick: () => setDeleteLessonId(lessonId) }
]


export const getButtons = (courseSlug, assignmentId, handleRename, handleDelete, navigate) => [
  {
    key: "view", title: "View", icon: "material-symbols:view-cozy-sharp", onClick: () => navigate(`/course/${courseSlug}/content/assignments/${assignmentId}`)
  },
  { key: "edit", title: "Edit", icon: "mingcute:pencil-line", onClick: () => navigate(`/course/${courseSlug}/content/assignments/${assignmentId}/edit`), permission: "UPDATE_ASSIGNMENT" },
  {
    key: "rename",
    title: "Rename",
    icon: "ix:rename",
    onClick: () => handleRename(assignmentId),
    permission: "UPDATE_MODULES"
  },
  { key: "delete", title: "Delete", icon: "ic:baseline-delete", onClick: () => handleDelete(assignmentId), permission: "DELETE_MODULES" }
]

export const getModuleButtons = (courseSlug, moduleId, handleRename, setDeleteModuleId, navigate) => [
  {
    key: "view", title: "View", icon: "material-symbols:view-cozy-sharp", onClick: () => navigate(`/course/${courseSlug}/content/modules/${moduleId}`)
  },
  { key: "edit", title: "Edit", icon: "mingcute:pencil-line", onClick: () => navigate(`/course/${courseSlug}/content/modules/${moduleId}/edit`), permission: "UPDATE_MODULES" },
  {
    key: "rename",
    title: "Rename",
    icon: "ix:rename",
    onClick: () => handleRename(moduleId),
    permission: "UPDATE_MODULES"
  },
  { key: "delete", title: "Delete", icon: "ic:baseline-delete", onClick: () => setDeleteModuleId(moduleId), permission: "DELETE_MODULES" }
]


export const getProfileDropdown = ({
  mode,
  handleMode,
  onLogoutClick,
  onSwitch,
  viewRole,
  role,

}) => {
  const { can } = usePermission();

  const buttons = [
    {
      key: "profile",
      title: "Profile",
      icon: "mingcute:user-4-fill",
    },
    {
      key: "theme",
      title: mode ? "Light Mode" : "Dark Mode",
      icon: mode
        ? "line-md:sunny-filled-loop-to-moon-filled-loop-transition"
        : "line-md:moon-filled-alt-to-sunny-filled-loop-transition",
      onClick: handleMode,
    },
  ];


  if (role === "trainer") {
    buttons.push({
      key: "switch",
      title: viewRole === "trainer"
        ? "Switch to Trainee"
        : "Switch to Trainer",
      icon: viewRole === "trainer"
        ? "mdi:account-tie"
        : "mdi:account-school",
      onClick: onSwitch,
    });
  }

  buttons.push({
    key: "logout",
    title: "Log out",
    icon: "mdi:logout",
    onClick: onLogoutClick,
  });

  return buttons;
};