const { Router } = require("express");
const { check, body } = require("express-validator");

const courseScheduleController = require("../controllers/courseSchedule");
const isAdmin = require("../utils/isAdmin");

const router = Router();

router.post(
  "/add",
  isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }),
    check("course").isAlphanumeric().trim(),
    check("year").isNumeric().trim(),
    check("semester").isNumeric().trim(),
  ],
  courseScheduleController.postAddCourseSchedule
);

router.post(
  "/remove",
  isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }).trim(),
    check("course").isAlphanumeric().trim(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  courseScheduleController.postRemoveCourseSchedule
);

router.get("/", courseScheduleController.getCourseSchedule);

module.exports = router;
