const { Router } = require("express");
const { check, body } = require("express-validator");
const isAdmin = require("../utils/isAdmin");
const { setFalse, setTrue } = require("../utils/requests");

const timetableController = require("../controllers/timetable");

const router = Router();

//get add
//this will send the courses, instructors, classrooms
router.get("/add", timetableController.getAddToTimetable);

//post add
//this is adding to the timetable automaticall
router.post(
  "/add",
  isAdmin,

  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("studentCount").isLength({ min: 0 }).notEmpty().trim(),
    check("group").isLength({ min: 0 }).notEmpty().trim(),
  ],
  setTrue,
  timetableController.postAddtoTimetable,
  setFalse
);

//post add-same-day
//this is adding to the timetable automatically but with same day teaching
router.post(
  "/add-same-day",
  isAdmin,
  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("studentCount").isLength({ min: 0 }).notEmpty().trim(),
    check("group").isLength({ min: 0 }).notEmpty().trim(),
  ],
  setTrue,
  timetableController.postSameDayAddToTimetable,
  setFalse
);

//post add-manually
//this is adding to the timetable manually
router.post(
  "/add-manually",
  isAdmin,
  [
    check("instructorId").notEmpty().trim(),
    check("courseId").notEmpty().trim(),
    check("group").notEmpty().trim(),
    check("startTime").notEmpty().trim(),
    check("classroomId").notEmpty().trim(),
    check("day").notEmpty().trim(),
  ],
  setTrue,
  timetableController.postAddToTimetableManually,
  setFalse
);

router.delete(
  "/:id",
  isAdmin,
  setTrue,
  timetableController.deleteFromTimetable,
  setFalse
);

//this will return the timetables
router.get("/", timetableController.getTimetable);

module.exports = router;
