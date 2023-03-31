const { Router } = require("express");
const { check, body } = require("express-validator");

const courseController = require("../controllers/courses");
const isAdmin = require("../utils/isAdmin");

const router = Router();

//compare the timetable of the students that take a course
//the course and group will be sent
router.get("/compare-timetable", courseController.getCompareTimetable);

router.get("/group/:id", courseController.getGroup);

//get course-timetable
//this is getting the course timetable
router.get("/timetable/:id", courseController.getCourseTimetable);

//get the courses
//this is getting the courses in the database
router.get("/", courseController.getCourses);

//add course
router.post(
  "/add",
  [
    check("courseCode").isAlphanumeric().trim(),
    check("classHour").isNumeric().trim(),
    check("name").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("departmentId").notEmpty().trim(),
    check("takenBy").isArray(),
  ],
  // isAdmin,
  courseController.postAddCourse
);

module.exports = router;
