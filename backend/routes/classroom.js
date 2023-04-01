const { Router } = require("express");
const { check, body } = require("express-validator");

const classroomController = require("../controllers/classroom");
const isAdmin = require("../utils/isAdmin");

const router = Router();

//get classroom-timetable
//this is getting the classroom timetable
router.get("/timetable/:id", classroomController.getClassroomTimetable);

//get classroom
//this is getting the classrooms
router.get("/", classroomController.getClassrooms);

//post add
//add a classroom to the database
router.post(
  "/add",
  [
    check("building").isAlpha().trim(),
    check("classNumber").isNumeric().trim(),
    check("capacity").isNumeric().trim(),
  ],
  isAdmin,
  classroomController.postAddClassroom
);

//delete remive course
router.delete(
  "/:id",
  // isAdmin,
  classroomController.DeleteClassroom
);

module.exports = router;
