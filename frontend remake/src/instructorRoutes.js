import Classroom from "views/Classroom";
import Course from "views/Course";
import CourseTimetableCompareView from "views/CourseTimetableCompareView";
import Student from "views/Students";
import StudentsTimetableCompareView from "views/studentsTimetableCompare";

var routes = [
  {
    path: "/course-student-timetable-compare",
    name: "Course Student Timetable Compare ",
    component: CourseTimetableCompareView,
    layout: "/instructor",
  },

  {
    path: "/students-timetable-compare",
    name: "Students Timetable Compare ",
    component: StudentsTimetableCompareView,
    layout: "/instructor",
  },

  {
    path: "/classroom",
    name: "Classroom",
    component: Classroom,
    layout: "/instructor",
  },
  {
    path: "/course",
    name: "Course",
    component: Course,
    layout: "/instructor",
  },
  {
    path: "/student",
    name: "Student",
    component: Student,
    layout: "/instructor",
  },
];

export default routes;
