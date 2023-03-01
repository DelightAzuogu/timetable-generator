const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv");
const valError = require("../utils/validationError");
const { Admin } = require("../model/admin");
const newError = require("../utils/error");
const { Instructor } = require("../model/instructor");

const JWT_SECRET = process.env.JWT_SECRET;

//post login
exports.postLogin = async (req, res, next) => {
  try {
    //check for validation error
    valError(req);

    const { status } = req.query;
    const { id, password } = req.body;

    //when the admin is loggin in
    if (status == "admin") {
      //get the admin from the database
      const admin = await Admin.findOne({ _id: id });
      if (!admin) throw newError("invalid login", 401);

      //check the password
      const isPass = bcrypt.compareSync(password, admin.password);
      if (!isPass) throw newError("invalid credentials", 401);

      //sign jwt token
      const token = jwt.sign({ id }, JWT_SECRET);

      res.json({ token });
    }
    //when its an instructor
    else {
      //find the instructor from the database
      const instructor = await Instructor.findOne({ _id: id });
      if (!instructor) throw newError("invalid login", 401);

      //check the password
      const isPass = bcrypt.compareSync(password, instructor.password);
      if (!isPass) throw newError("invalid credentials", 401);

      //sign jwt token
      const token = jwt.sign({ id }, JWT_SECRET);

      res.json({ token });
    }
  } catch (err) {
    next(err);
  }
};
