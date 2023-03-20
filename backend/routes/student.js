const { Router } = require("express");
const { check } = require("express-validator");
const studentController = require("../controllers/student.js");

const router = Router()

//compare the timetable of multiple students
router.get("/compare-timetable", [
  // check("studentsId").isArray()
], studentController.getCompareTimetables)


//this will get the timetable of the student with id
router.get(
  "/timetable/:id",
  studentController.getStudentTimetable
)


//get the students
//this is getting the courses in the database
router.get(
  "/",
  studentController.getStudents
)


module.exports = router