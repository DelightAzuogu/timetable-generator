const { Router } = require("express");
const { check, body } = require("express-validator");
const isAuth = require("../utils/isAuth");

const timetableController = require("../controllers/timetable");
const { Instructor } = require("../model/instructor");

const router = Router();

//get add to timetable
//this will send the courses, instructors, classrooms to the frontend
router.get("/add",
  // isAuth,
  timetableController.getAddToTimetable
);

//post add timetable
//this is adding to the timetable automaticall
router.post(
  "/add",
  // isAuth,
  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("studentCount").isLength({ min: 0 }).notEmpty().trim(),
    check("group").isLength({ min: 0 }).notEmpty().trim(),
  ],
  timetableController.postAddtoTimetable
);

//post add-same-day
//this is adding to the timetable automatically but with same day teaching
router.post(
  "/add-same-day",
  // isAuth,
  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("studentCount").isLength({ min: 0 }).notEmpty().trim(),
    check("group").isLength({ min: 0 }).notEmpty().trim(),
  ],
  timetableController.postSameDayAddToTimetable
);

//post add-manually
//this is adding to the timetable manually
router.post(
  "/add-manually",
  // isAuth,
  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("group").notEmpty().trim(),
    check("startTime").notEmpty().trim(),
    check("classroomId").notEmpty().trim(),
    check("day").notEmpty().trim(),
  ],
  timetableController.postAddToTimetableManually
);

//get instructor-timetable
//this is getting the instructor timetable
router.get(
  "/instructor-timetable/:id",
  check("id").notEmpty().trim(),
  timetableController.getIntructorTimetable
)

//get course-timetable
//this is getting the course timetable
router.get(
  "/course-timetable",
  check("id").notEmpty().trim(),
  timetableController.getCourseTimetable
)

//get classroom-timetable
//this is getting the classroom timetable
router.get(
  "/classroom-timetable",
  check("id").notEmpty().trim(),
  timetableController.getClassroomTimetable
)

//get classroom
//this is getting the classroom timetable
router.get(
  "/classrooms",
  timetableController.getClassrooms
)



module.exports = router;
