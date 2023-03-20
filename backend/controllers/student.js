const { Student } = require("../model/student");
const { Timetable } = require("../model/timetable");
const { times } = require("../utils/daysAndTime");
const newError = require("../utils/error");
const validationError = require("../utils/validationError");


//get the timetable of a student
exports.getStudentTimetable = async (req, res, next) => {

  try {
    const { id } = req.params;

    //get the student
    const student = await Student.findOne({ _id: id });
    if (!student) {
      throw newError("invalid student", 400);
    }


    let timetable = [];
    //get the timetable of each individual course the student takes and pust it to the timetable array above
    for (let course of student.takes) {
      const courseTimetable = await Timetable.find({ course: course.course, group: course.group });
      for (let c of courseTimetable) {
        timetable.push(c);
      }
    }
    res.status(200).json({ timetable, msg: "success", student });
  }
  catch (error) {
    next(error);
  }
}

//get the student
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find()

    res.status(200).json({ students });

  }
  catch (error) {
    next(error);
  }
}

//takes an array of student ids and compare there timetable.
exports.getCompareTimetables = async (req, res, next) => {
  try {
    // validationError(req);

    // const { studentsId } = req.body;

    let { studentsId } = req.query
    if (!studentsId) {
      throw newError("invalid student ids", 400)

    }
    studentsId = studentsId.split(",")

    const timetables = [];
    for (let s of studentsId) {
      //get the student
      const student = await Student.findOne({ _id: s })
      if (!student) continue;
      for (let take of student.takes) {
        const timetable = await Timetable.findOne({ course: take.course, group: take.group })
        if (timetable) {
          timetables.push(timetable);
        }
      }

    }
    const timetableCount = [];
    const days = ["time", "monday", "tuesday", "wednesday", "thursday", "friday"]
    //loop through the times
    for (let i in times) {
      //set the array to 2d array
      timetableCount[i] = [];
      //loop through the days
      for (let day of days) {
        //set the time in the day
        if (day === "time") {
          timetableCount[i].push(`${times[i]}:00`)
        }
        else {
          //find the amount of times that time and day occurs in the timetable
          let count = timetables.filter(timetable => timetable.time.includes(times[i]) && timetable.day === day).length;
          timetableCount[i].push(count);
        }
      }
    }
    res.status(200).json({ timetableCount })
  }
  catch (error) {
    next(error);
  }
}