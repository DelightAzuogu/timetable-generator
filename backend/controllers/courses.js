const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours, times } = require("../utils/daysAndTime");
const { Student } = require("../model/student");
const { checkCourse } = require("../utils/checkCourse");

//this will return the courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
}

//get the groups of a course in the timetable
exports.getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    //get the course
    const course = await checkCourse(id);

    //get the timetable of the course
    const timetables = await Timetable.find({ course })
    const group = [];
    for (let timetable of timetables) {
      if (!(group.includes(timetable.group)))
        group.push(timetable.group);
    }
    res.status(200).json({ group });

  } catch (error) {
    next(error)
  }
}


//this will get the timetable of the Course
exports.getCourseTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await checkCourse(id);

    const timetable = await Timetable.find({ course })

    res.status(200).json({ msg: "success", timetable, course });
  } catch (error) {
    next(error);
  }
}

//compare the timetable of student in a course, can also take into comsideration the groups of the course if specified
exports.getCompareTimetable = async (req, res, next) => {
  try {
    let { id, group } = req.query;

    if (!id)
      throw newError("invalid id", 400);

    //get the course
    const course = await checkCourse(id);

    let students = [];
    if (!group) {
      //get the students that take the course
      students = await Student.find({ "takes.course": course })
    } else {
      //this is to split the group numbers that was sent to an array
      group = group.split(",")
      for (let g of group) {
        if (g === 0) continue
        const courseStudents = await Student.find({ "takes.course": course })
        const courseGroupStudents = courseStudents.filter(e => {
          const index = e.takes.findIndex(c => c.course._id == course._id)
          return e.takes[index].group == g
        })
        loopCourseGroupStudents:
        for (let s of courseGroupStudents) {
          //make sure i am not going to check for a timetable twice
          for (student of students) {
            if (student._id === s._id) continue loopCourseGroupStudents;
          }
          students.push(s)
        }
      }
    }

    const timetables = [];
    for (let s of students) {
      for (let take of s.takes) {
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
        } else {
          //find the amount of times that time and day occurs in the timetable
          let count = timetables.filter(timetable => timetable.time.includes(times[i]) && timetable.day === day).length;
          timetableCount[i].push(count);
        }
      }
    }

    res.status(200).json({ timetableCount })



  } catch (error) {
    next(error)
  }
}