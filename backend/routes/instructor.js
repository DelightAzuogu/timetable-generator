const { Router } = require("express");
const { check } = require("express-validator");

const instructorController = require("../controllers/instructor");
const isAdmin = require("../utils/isAdmin");
const { setTrue, setFalse } = require("../utils/requests");

const router = Router();

//get instructor-timetable
//this is getting the instructor timetable
router.get("/timetable/:id", instructorController.getIntructorTimetable);

//post add
//add a new instructor to the database
router.post(
  "/add",
  [
    check("id").isNumeric().notEmpty().trim(),
    check("name").isAlphanumeric(undefined, { ignore: " " }).notEmpty().trim(),
    check("password")
      .isAlphanumeric(undefined, { ignore: " " })
      .notEmpty()
      .trim(),
  ],
  isAdmin,
  setTrue,
  instructorController.postAddInstuctor,
  setFalse
);

//delete and instructor
router.delete(
  "/:id",
  isAdmin,
  setTrue,
  instructorController.deleteInstructor,
  setFalse
);

router.get("/:id", instructorController.getInstructor);

router.get("/", instructorController.getInstructors);

module.exports = router;
