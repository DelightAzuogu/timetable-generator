const { Router } = require("express");
const { check, body } = require("express-validator");

const departmentController = require("../controllers/department");
const isAdmin = require("../utils/isAdmin");

const router = Router();

router.get("/", departmentController.getDepartments);

module.exports = router;
