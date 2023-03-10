const jwt = require("jsonwebtoken");
const newError = require("./error");
const { Admin } = require("../model/admin");

module.exports = async (req, res, next) => {
  //get the authentication header
  const authHeader = req.get("Authentication");
  if (!authHeader) {
    console.log("1")
    next(newError("authentication required 1", 401));
  }

  //split it [bearer {this is the token}]
  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("2")
    next(newError("authentication required 2", 401));
  }

  var payload;
  try {
    //get the payload
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(err);
  }
  //check if paylaod exists
  if (!payload) {
    console.log("3")
    next(newError("authentication required 3", 401));
  }
  // console.log(payload);

  //check if the admin is in the database
  const admin = await Admin.findOne({ _id: payload.id });
  if (!admin) {
    console.log("4")
    next(newError("authentication required 4", 401));
  }

  //save the admin id in the  request for ease of use later
  req.id = payload.id;
  next();
};
