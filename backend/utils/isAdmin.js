const jwt = require("jsonwebtoken");
const newError = require("./error");
const { Admin } = require("../model/admin");

module.exports = async (req, res, next) => {
  //get the authentication header
  try {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      throw newError("authentication required 1", 401);
    }

    //split it [bearer {this is the token}]
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw newError("authentication required 2", 401);
    }

    //get the payload
    let payload = jwt.verify(token, process.env.JWT_SECRET_ADMIN);

    //check if paylaod exists
    if (!payload) {
      throw newError("authentication required 3", 401);
    }

    //check if the admin is in the database
    const admin = await Admin.findOne({ _id: payload.id });
    if (!admin) {
      throw newError("authentication required 4", 401);
    }

    //save the admin id in the  request for ease of use later
    req.id = payload.id;
    next();
  } catch (err) {
    next(err);
  }
};
