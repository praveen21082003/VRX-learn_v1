

// User Table
export const USER_COLUMNS_BASE = [
  { key: "profile", label: "Profile", width: "8%", align: "center" },
  { key: "name", label: "Name", width: "15%", align: "left" },
  { key: "email", label: "Email", align: "left", width: "25%" },
  { key: "role", label: "Role", width: "12%" },
  { key: "lastLogin", label: "Last Login", width: "15%" },
  { key: "createdAt", label: "Created At", width: "20%" },
  { key: "status", label: "Status", width: "12%" },
  { key: "actions", label: "Actions", width: "12%", align: "center" },
];


// Enrollment Table
export const ENROLLMENT_COLUMNS_BASE = [
  { key: "profile", label: "Profile", width: "8%", align: "center" },
  { key: "name", label: "Name", width: "15%", align: "left" },
  { key: "email", label: "Email", width: "25%", align: "left" },
  { key: "role", label: "Role", width: "8%", align: "center" },
  { key: "courseName", label: "Course Name", width: "30%", align: "left" },
  { key: "enrolled_at", label: "Enrollment At", width: "18%", align: "left" },
  { key: "date", label: "Expiry Date", width: "18%", align: "left" },
  { key: "status", label: "Status", width: "12%", align: "center" },
  { key: "actions", label: "Actions", width: "12%", align: "center" },
];


//  Course Table
export const COURSE_COLUMNS_BASE = [
  { key: "title", label: "Course Title", align: "left", width: "20%" },
  { key: "shortDescription", label: "Short Description", align: "left", width: "30%" },
  { key: "trainer", label: "Trainer", align: "center", width: "15%" },
  { key: "noOfTrainees", label: "No.of Trainees", align: "center", width: "10%" },
  { key: "createdAt", label: "Created At", align: "center", width: "10%" },
  { key: "actions", label: "Actions", width: "10%", align: "center" },
];


// roster Table
export const TRAINEE_ROSTER_BASE = [
  { key: "profile", label: "Profile", width: "8%", align: "center" },
  { key: "name", label: "Name", width: "20%", align: "left" },
  { key: "email", label: "Email", width: "25%", align: "left" },
  { key: "enrollmentDate", label: "Enrollment Date", width: "20%", align: "left" },
  { key: "role", label: "Role", width: "12%", align: "center" },
];