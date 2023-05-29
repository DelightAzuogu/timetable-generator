const { Router } = require("express");
const { check, body } = require("express-validator");

const courseController = require("../controllers/courses");
const isAdmin = require("../utils/isAdmin");
const { setTrue, setFalse } = require("../utils/requests");

const router = Router();

//compare the timetable of the students that take a course
//the course and group will be sent
router.get("/compare-timetable", courseController.getCompareTimetable);

router.get("/group/:id", courseController.getGroup);

router.get("/time/details", courseController.getStudentCourse);

//get course-timetable
//this is getting the course timetable
router.get("/timetable/:id", courseController.getCourseTimetable);

//add course
router.post(
  "/add",
  [
    check("courseCode").isAlphanumeric().trim(),
    check("classHour").isNumeric().trim(),
    check("name").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("departmentId").notEmpty().trim(),
  ],
  isAdmin,
  setTrue,
  courseController.postAddCourse,
  setFalse
);

//delete a course
router.delete(
  "/:id",
  isAdmin,
  setTrue,
  courseController.deleteCourse,
  setFalse
);

//add the the takenby of a course
router.post(
  "/add-takenby/:id",
  isAdmin,
  check("dept").isAlpha(undefined, { ignore: " " }),
  setTrue,
  courseController.postAddTakenBy,
  setFalse
);

//get the depts that are not in the
router.get("/add-takenby/:id", courseController.getAddTakenBy);

//get a particular course with id
router.get("/:id", courseController.getCourse);

//post remove a dept from takenby
router.post(
  "/remove-takenby/:id",
  isAdmin,
  check("dept").isAlpha(undefined, { ignore: " " }),
  setTrue,
  courseController.postRemoveTakenBy,
  setFalse
);

//get the courses
//this is getting the courses in the database
router.get("/", courseController.getCourses);

module.exports = router;
