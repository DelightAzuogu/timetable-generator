const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours } = require("../utils/daysAndTime");

//this will get the timetable of the classroom
exports.getClassroomTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      throw newError("invalid classroom", 400)
    }

    const timetable = await Timetable.find({ classroom })

    res.status(200).json({ msg: "success", timetable, classroom })
  } catch (error) {
    next(error);
  }
}

//this will return the classrooms
exports.getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find();

    res.status(200).json({ classrooms })

  } catch (error) {
    next(error);
  }
}