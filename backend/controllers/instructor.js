const bcrypt = require("bcrypt");

const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours } = require("../utils/daysAndTime");

//this will get the timetable of the Instructor
exports.getIntructorTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const instructor = await Instructor.findOne({ _id: id });
    if (!instructor) {
      throw newError("invalid instructor", 400);
    }
    const timetable = await Timetable.find({ instructorId: instructor._id });

    delete instructor.password;

    res.status(200).json({ msg: "success", timetable, instructor });
  } catch (error) {
    next(error);
  }
};

exports.postAddInstuctor = async (req, res, next) => {
  try {
    valError(req);

    const { id, name, password } = req.body;

    if (id <= 0) {
      throw newError("invalid Id", 400);
    }
    //check if id is already in database
    const idCheck = await Instructor.findOne({ _id: id });
    if (idCheck) {
      throw newError("id already exists", 400);
    }

    //hash the password
    const hashPass = bcrypt.hashSync(password, 12);

    let instructor = {
      _id: id,
      name,
      password: hashPass,
    };

    instructor = await Instructor.create(instructor);
    res.status(201).json({ instructor, msg: "successful" });
  } catch (error) {
    next(error);
  }
};
