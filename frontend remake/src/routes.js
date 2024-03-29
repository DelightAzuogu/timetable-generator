import AddToTimetable from "views/add";
import CourseTimetableCompareView from "views/CourseTimetableCompareView";
import StudentsTimetableCompareView from "views/studentsTimetableCompare";
import RemoveTimetable from "views/removeTimetable";
import Instructor from "views/Instructor";
import Classroom from "views/Classroom";
import Course from "views/Course";
import Student from "views/Students";
import CourseSchedule from "views/courseSchedule";

//this route is for the admin
var routes = [
  {
    path: "/automatically-add-to-timetable",
    name: "Add Automatically",
    component: AddToTimetable,
    layout: "/admin",
  },
  {
    path: "/manually-add-to-timetable",
    name: "Add Manually",
    component: AddToTimetable,
    layout: "/admin",
  },
  {
    path: "/remove-timetable",
    name: "Remove from timetable",
    component: RemoveTimetable,
    layout: "/admin",
  },
  {
    path: "/course-student-timetable-compare",
    name: "Course Timetable Compare ",
    component: CourseTimetableCompareView,
    layout: "/admin",
  },
  {
    path: "/students-timetable-compare",
    name: "Students Timetable Compare ",
    component: StudentsTimetableCompareView,
    layout: "/admin",
  },
  {
    path: "/instructor",
    name: "Instructor",
    component: Instructor,
    layout: "/admin",
  },
  {
    path: "/classroom",
    name: "Classroom",
    component: Classroom,
    layout: "/admin",
  },
  {
    path: "/course",
    name: "Course",
    component: Course,
    layout: "/admin",
  },
  {
    path: "/student",
    name: "Student",
    component: Student,
    layout: "/admin",
  },
  {
    path: "/shedule-course",
    name: "Course Schedule",
    component: CourseSchedule,
    layout: "/admin",
  },
];

export default routes;
