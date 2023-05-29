const bcrypt = require("bcrypt");

const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { checkInstructor } = require("../utils/checkInstructor");

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
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;

    //check for instructor
    const instructor = await checkInstructor(id);

    //get the timetable of the instructor
    const timetables = await Timetable.find({ instructorId: instructor.id });

    //delete the timetables one by one
    for (let timetable of timetables) {
      timetable.delete();
    }

    //delete the instructor
    instructor.delete();
    res.json({ msg: "successful", timetables });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getInstructors = async (req, res, next) => {
  try {
    const instructors = await Instructor.find();

    res.status(200).json({ instructors });
  } catch (error) {
    next(error);
  }
};

exports.getInstructor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const instructor = await checkInstructor(id);

    const timetable = await Timetable.find({ instructorId: instructor._id });

    res.status(200).json({ instructor, timetable });
  } catch (error) {
    next(error);
  }
};
