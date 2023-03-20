const { Router } = require("express");
const { check, body } = require("express-validator");
const isAuth = require("../utils/isAdmin");

const classroomController = require("../controllers/classroom");

const router = Router();


//get classroom-timetable
//this is getting the classroom timetable
router.get(
  "/timetable/:id",
  classroomController.getClassroomTimetable
)

//get classroom
//this is getting the classrooms
router.get(
  "/",
  classroomController.getClassrooms
)

module.exports = router;
