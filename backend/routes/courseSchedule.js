const { Router } = require("express");
const { check, body } = require("express-validator");

const courseScheduleController = require("../controllers/courseSchedule");
const isAdmin = require("../utils/isAdmin");

const router = Router();

router.post(
  "/add",
  // isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }),
    check("courses").isArray(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  courseScheduleController.postAddCourseSchedule
);

router.post(
  "/remove",
  // isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }).trim(),
    check("courseNames").isArray(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  courseScheduleController.postRemoveCourseSchedule
);

router.get(
  "/",
  // isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }).trim(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  courseScheduleController.getCourseSchedule
);

module.exports = router;
