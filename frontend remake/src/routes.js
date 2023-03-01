
import AddToTimetable from "views/add";
import View from "views/view";

var routes = [
  {
    path: "/automatically-add-to-timetable",
    name: "Add Automatically",
    icon: "tim-icons icon-chart-pie-36",
    component: AddToTimetable,
    layout: "/admin",

  },
  {
    path: "/manually-add-to-timetable",
    name: "Add Manually",
    icon: "tim-icons icon-chart-pie-36",
    component: AddToTimetable,
    layout: "/admin",

  },
  {
    path: "/instructor",
    name: "View Instructor Timetable",
    icon: "tim-icons icon-chart-pie-36",
    component: View,
    layout: "/admin",

  },
  {
    path: "/classroom",
    name: "View Classroom Timetable",
    icon: "tim-icons icon-chart-pie-36",
    component: View,
    layout: "/admin",
  },
];

export default routes;
