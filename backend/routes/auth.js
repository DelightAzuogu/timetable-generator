const { Router } = require("express");
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");

const router = Router();

router.post(
  "/login",
  [
    check("id").isNumeric().trim(),
    check("password").notEmpty().isLength({ min: 5 }).trim(),
  ],
  authController.postLogin
);

module.exports = router;
