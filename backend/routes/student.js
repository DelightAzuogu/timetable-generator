const { Router } = require("express");
const { check } = require("express-validator");
const studentController = require("../controllers/student.js");
const isAdmin = require("../utils/isAdmin.js");
const { setTrue, setFalse } = require("../utils/requests.js");

const router = Router();

//compare the timetable of multiple students
router.get(
  "/compare-timetable",
  [
    // check("studentsId").isArray()
  ],
  studentController.getCompareTimetables
);

router.get("/time/details", studentController.getStudentsWithTimeDate);

//this will get the timetable of the student with id
router.get("/timetable/:id", studentController.getStudentTimetable);

//add student
router.post(
  "/add",
  isAdmin,
  [
    check("firstName").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("lastName").isAlphanumeric(undefined, { ignore: " " }).trim(),
    check("id").isNumeric().trim(),
    check("deptId").isAlphanumeric().trim(),
  ],
  setTrue,
  studentController.postAddStudent,
  setFalse
);

//delete a student
router.delete(
  "/:id",
  isAdmin,
  setTrue,
  studentController.deleteStudent,
  setFalse
);

//add to student takes
router.post(
  "/add-takes/:id",
  isAdmin,
  [
    check("group").isNumeric().trim(),
    check("courseId").isAlphanumeric().trim(),
  ],
  setTrue,
  studentController.postAddtakes,
  setFalse
);

// remove from stdent takes
router.post(
  "/remove-takes/:id",
  isAdmin,
  [
    check("group").isNumeric().trim(),
    check("courseId").isAlphanumeric().trim(),
  ],
  setTrue,
  studentController.postRemoveTakes,
  setFalse
);

// get a particular student
router.get("/:id", studentController.getStudent);

//get the students
//this is getting the courses in the database
router.get("/", studentController.getStudents);

module.exports = router;
