import CourseTimetableCompareView from "views/CourseTimetableCompareView";
import StudentsTimetableCompareView from "views/studentsTimetableCompare";
import View from "views/view";

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
    name: "View Classroom Timetable",
    component: View,
    layout: "/instructor",
  },
  {
    path: "/course",
    name: "View Courses Timetable",
    component: View,
    layout: "/instructor",
  },
  {
    path: "/student",
    name: "View Student Timetable",
    component: View,
    layout: "/instructor",
  },
];

export default routes;
