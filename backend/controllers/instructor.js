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


    const instructor = await Instructor.findOne({ _id: id })
    if (!instructor) {
      throw newError("invalid instructor", 400);
    }
    const timetable = await Timetable.find({ instructorId: instructor._id })

    delete instructor.password

    res.status(200).json({ msg: "success", timetable, instructor });

  } catch (error) {
    next(error);
  }
}
