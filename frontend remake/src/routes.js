import AddToTimetable from "views/add";
import CourseTimetableCompareView from "views/CourseTimetableCompareView";
import StudentsTimetableCompareView from "views/studentsTimetableCompare";
import RemoveTimetable from "views/removeTimetable";
import View from "views/view";

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
    name: "View Instructor Timetable",
    component: View,
    layout: "/admin",

  },
  {
    path: "/classroom",
    name: "View Classroom Timetable",
    component: View,
    layout: "/admin",
  },
  {
    path: "/course",
    name: "View Courses Timetable",
    component: View,
    layout: "/admin",
  },
  {
    path: "/student",
    name: "View Student Timetable",
    component: View,
    layout: "/admin",
  },
];

export default routes;
