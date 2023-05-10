const jwt = require("jsonwebtoken");
const newError = require("./error");
const Instructor = require("../model/instructor");

module.exports = async (req, res, next) => {
  //get the authentication header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    next(newError("authentication required 1", 401));
  }

  //split it [bearer {this is the token}]
  const token = authHeader.split(" ")[1];
  if (!token) {
    next(newError("authentication required 2", 401));
  }

  var payload;
  const JWT_SECRET_INSTRUCTOR = process.env.JWT_SECRET_INSTRUCTOR;
  try {
    //get the payload
    payload = jwt.verify(token, JWT_SECRET_INSTRUCTOR);
  } catch (err) {
    next(err);
  }
  //check if paylaod exists
  if (!payload) {
    next(newError("authentication required 3", 401));
  }

  //check if the instructor is in the database
  const instructor = await Instructor.findOne({ _id: payload.id });
  if (!instructor) {
    next(newError("authentication required 4", 401));
  }

  //save the instructor id in the  request for ease of use later
  // req.id = payload.id;
  next();
};
