const { Router } = require("express");
const { check, body } = require("express-validator");

const courseScheduleController = require("../controllers/courseSchedule");
const isAdmin = require("../utils/isAdmin");
const { setTrue, setFalse } = require("../utils/requests");

const router = Router();

router.post(
  "/add-special",
  isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }).trim(),
    check("courseAddId").isAlphanumeric().trim(),
    check("course").isAlphanumeric().trim(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  setTrue,
  courseScheduleController.postaddSpecialCase,
  setFalse
);

router.post(
  "/remove-special",
  isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }).trim(),
    check("courseRemoveId").isAlphanumeric().trim(),
    check("courseId").isAlphanumeric().trim(),
    check("year").isNumeric().trim(),
    check("semester").isAlphanumeric().trim(),
  ],
  setTrue,
  courseScheduleController.postRemoveSpecialCase,
  setFalse
);

router.post(
  "/add",
  isAdmin,
  [
    check("deptName").isAlpha(undefined, { ignore: " " }),
    check("course").isAlphanumeric().trim(),
    check("year").isNumeric().trim(),
    check("semester").isNumeric().trim(),
  ],
  setTrue,
  courseScheduleController.postAddCourseSchedule,
  setFalse
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
  setTrue,
  courseScheduleController.postRemoveCourseSchedule,
  setFalse
);

router.get("/", courseScheduleController.getCourseSchedule);

module.exports = router;
