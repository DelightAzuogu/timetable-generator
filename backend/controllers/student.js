const { Department } = require("../model/department");
const { Student } = require("../model/student");
const { Timetable } = require("../model/timetable");
const { checkCourse } = require("../utils/checkCourse");
const { checkStudent } = require("../utils/checkStudent");
const { times } = require("../utils/daysAndTime");
const newError = require("../utils/error");
const valError = require("../utils/validationError");

//get the timetable of a student
exports.getStudentTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    //get the student
    const student = await checkStudent(id);

    let timetable = [];
    //get the timetable of each individual course the student takes and pust it to the timetable array above

    if (student.takes) {
      for (let course of student.takes) {
        const courseTimetable = await Timetable.find({
          course: course.course,
          group: course.group,
        });
        console.log(courseTimetable);
        for (let c of courseTimetable) {
          timetable.push(c);
        }
      }
    }
    res.status(200).json({ timetable, msg: "success", student });
  } catch (error) {
    next(error);
  }
};

//get the student
exports.getStudents = async (req, res, next) => {
  try {
    const students = await Student.find();

    res.status(200).json({ students });
  } catch (error) {
    next(error);
  }
};

//takes an array of student ids and compare there timetable.
exports.getCompareTimetables = async (req, res, next) => {
  try {
    let { studentsId } = req.query;
    if (!studentsId) {
      throw newError("invalid student ids", 400);
    }
    studentsId = studentsId.split(",");

    const timetables = [];
    for (let s of studentsId) {
      //get the student
      const student = await Student.findOne({ _id: s });
      if (!student) continue;
      if (!student.takes) continue;

      for (let take of student.takes) {
        const timetable = await Timetable.findOne({
          course: take.course,
          group: take.group,
        });
        if (timetable) {
          timetables.push(timetable);
        }
      }
    }
    const timetableCount = [];
    const days = [
      "time",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
    ];
    //loop through the times
    for (let i in times) {
      //set the array to 2d array
      timetableCount[i] = [];
      //loop through the days
      for (let day of days) {
        //set the time in the day
        if (day === "time") {
          timetableCount[i].push(`${times[i]}:00`);
        } else {
          //find the amount of times that time and day occurs in the timetable
          let count = timetables.filter(
            (timetable) =>
              timetable.time.includes(times[i]) && timetable.day === day
          ).length;
          timetableCount[i].push(count);
        }
      }
    }
    res.status(200).json({ timetableCount });
  } catch (error) {
    next(error);
  }
};

exports.postAddStudent = async (req, res, next) => {
  try {
    valError(req);
    const { id, firstName, lastName, deptId } = req.body;

    //check the id
    if (id <= 0) {
      throw newError("invalid error", 400);
    }
    const idCheck = await Student.findOne({ _id: id });
    if (idCheck) {
      throw newError("student with id already exists", 400);
    }

    //check the department id
    const deptCheck = await Department.findOne({ _id: deptId });
    if (!deptCheck) {
      throw newError("invalise department", 400);
    }

    let student = {
      _id: id,
      name: { first: firstName, last: lastName },
      department: deptCheck,
    };

    student = await Student.create(student);

    res.status(201).json({ student, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const student = await checkStudent(id);
    student.delete();
    res.status(204).json({ msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.postAddtakes = async (req, res, next) => {
  try {
    valError(req);
    const { id } = req.params;
    const { courseId, group } = req.body;

    //check student
    let student = await checkStudent(id);

    //check course
    const course = await checkCourse(courseId);

    //check group
    if (group <= 0) {
      throw newError("invalid group", 400);
    }

    //check if student has that course with that group
    if (student.takes) {
      for (let take of student.takes) {
        if (take.course._id == course._id && take.group == group) {
          throw newError("course with group already in student", 400);
        }
      }

      //add the the course and gruop to student
      student.takes.push({ course, group });

      student = await student.save();
    } else {
      const takes = { course, group };
      student.takes = [takes];
      student = await student.save();
    }
    res.status(200).json({ student, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.postRemoveTakes = async (req, res, next) => {
  try {
    valError(req);
    const { id } = req.params;
    const { courseId, group } = req.body;

    //check student
    let student = await checkStudent(id);

    if (!student.takes) {
      throw newError("student is not taking any courses", 400);
    }

    //check course
    const course = await checkCourse(courseId);

    const newTakes = student.takes.filter((e) => {
      if (e.group != group) {
        return e;
      } else if (course._id != e.course._id) {
        return e;
      }
    });

    if (newTakes.length == student.takes.length) {
      throw newError("student does not take the course with that group", 400);
    }

    student = await student.save();
    res.status(200).json({ student, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.getStudent = async (req, res, next) => {
  try {
    console.log("11111123456786756453423");
    const { id } = req.params;

    let student = await Student.findOne({ _id: id });
    if (!student) {
      throw newError("invalid student", 400);
    }
    res.status(200).json({ student });
  } catch (error) {
    next(error);
  }
};

//experiment
exports.getStudentsWithTimeDate = async (req, res, next) => {
  console.log("deeddeededeededdeddkkdkdkdkk");
  try {
    let { time, day, studentsId, studentCount } = req.query;
    studentsId = studentsId.split(",");
    day = day.toLowerCase();

    const studentCourseArray = [];
    let i = 0;
    //iterate through the students
    loopstudent: for (let studentid of studentsId) {
      if (i >= studentCount) break;
      //get the student
      const student = await checkStudent(studentid);
      if (!student.takes) continue;
      for (let take of student.takes) {
        if (i >= studentCount) break loopstudent;
        const timetable = await Timetable.findOne({
          "course.name": take.course.name,
          group: take.group,
          day,
          time,
        });
        // console.log(timetable);
        if (timetable) {
          studentCourseArray.push({
            id: student._id,
            name: `${student.name.first} ${student.name.last}`,
            courseId: timetable.course._id,
            courseName: timetable.course.name,
          });
          i++;
        }
      }
    }
    // console.log(studentCourseArray);
    res.status(200).json({ studentCourseArray });
  } catch (error) {
    next(error);
  }
};
