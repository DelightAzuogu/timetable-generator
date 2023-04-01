const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours } = require("../utils/daysAndTime");
const { checkClassroom } = require("../utils/checkClassroom");

//this will get the timetable of the classroom
exports.getClassroomTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      throw newError("invalid classroom", 400);
    }

    const timetable = await Timetable.find({ classroom });

    res.status(200).json({ msg: "success", timetable, classroom });
  } catch (error) {
    next(error);
  }
};

//this will return the classrooms
exports.getClassrooms = async (req, res, next) => {
  try {
    const classrooms = await Classroom.find();

    res.status(200).json({ classrooms });
  } catch (error) {
    next(error);
  }
};

//add a classroom to the database
exports.postAddClassroom = async (req, res, next) => {
  try {
    let { building, classNumber, capacity } = req.body;
    building = building.toUpperCase();

    if (classNumber <= 0) {
      throw newError("invalid class number", 400);
    }
    if (capacity <= 0) {
      throw newError("invalid capacity", 400);
    }

    //check if building with classnumber exists
    const checkClassroom = await Classroom.findOne({
      building,
      classNum: classNumber,
    });
    if (checkClassroom) {
      throw newError("classroom already exists");
    }

    let classroom = { building, classNum: classNumber, capacity };

    classroom = await Classroom.create(classroom);

    console.log(classroom);
    res.status(201).json({ classroom, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.DeleteClassroom = async (req, res, next) => {
  try {
    let { id } = req.params;

    //check for the classroom
    const classroom = await checkClassroom(id);

    //get the timetable in that class
    const timetables = await Timetable.find({ classroom });
    for (let timetable of timetables) {
      timetable.delete();
    }

    classroom.delete();
    res.status(204).json({ msg: "successsful" });
  } catch (error) {
    next(error);
  }
};
