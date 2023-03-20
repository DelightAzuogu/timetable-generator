const { Router } = require("express");
const { check, body } = require("express-validator");
const isAuth = require("../utils/isAdmin");

const instructorController = require("../controllers/instructor");

const router = Router();


//get instructor-timetable
//this is getting the instructor timetable
router.get(
  "/timetable/:id",
  instructorController.getIntructorTimetable
)


module.exports = router