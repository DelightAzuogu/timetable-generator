const { Course } = require("../model/course");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { times } = require("../utils/daysAndTime");
const { Student } = require("../model/student");
const { checkCourse } = require("../utils/checkCourse");
const { Department } = require("../model/department");

//this will return the courses
exports.getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find();
    res.status(200).json({ courses });
  } catch (error) {
    next(error);
  }
};

//get the groups of a course in the timetable
exports.getGroup = async (req, res, next) => {
  try {
    const { id } = req.params;

    //get the course
    const course = await checkCourse(id);

    //get the timetable of the course
    const timetables = await Timetable.find({ course });
    const group = [];
    for (let timetable of timetables) {
      if (!group.includes(timetable.group)) group.push(timetable.group);
    }
    res.status(200).json({ group });
  } catch (error) {
    next(error);
  }
};

//this will get the timetable of the Course
exports.getCourseTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const course = await checkCourse(id);

    const timetable = await Timetable.find({ course });

    res.status(200).json({ msg: "success", timetable, course });
  } catch (error) {
    next(error);
  }
};

//compare the timetable of student in a course, can also take into comsideration the groups of the course if specified
exports.getCompareTimetable = async (req, res, next) => {
  try {
    let { id, group } = req.query;

    if (!id) throw newError("invalid id", 400);

    //get the course
    const course = await checkCourse(id);

    let students = [];
    if (!group) {
      //get the students that take the course
      students = await Student.find({ "takes.course": course });
    } else {
      //this is to split the group numbers that was sent to an array
      group = group.split(",");
      for (let g of group) {
        if (g === 0) continue;
        const courseStudents = await Student.find({ "takes.course": course });

        const courseGroupStudents = courseStudents.filter((e) => {
          const index = e.takes.findIndex((c) => c.course._id == course._id);
          return e.takes[index].group == g;
        });
        loopCourseGroupStudents: for (let s of courseGroupStudents) {
          //make sure i am not going to check for a timetable twice
          for (student of students) {
            if (student._id === s._id) continue loopCourseGroupStudents;
          }
          students.push(s);
        }
      }
    }

    const timetables = [];
    for (let s of students) {
      for (let take of s.takes) {
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

//adds a course the timetable
exports.postAddCourse = async (req, res, next) => {
  try {
    //validation error
    valError(req);

    let { courseCode, name, classHour, departmentId } = req.body;
    name = name.toLowerCase();

    if (classHour <= 0 || classHour >= 24) {
      throw newError("invalid course Hour");
    }

    // check if courseCode (id) is already in database
    const IdCheck = await Course.findOne({ _id: courseCode });
    if (IdCheck) {
      throw newError("course with code already exists", 400);
    }

    //check if the name already exists in database
    const nameCheck = await Course.findOne({ name });
    if (nameCheck) {
      throw newError("course with name already exists", 400);
    }

    //get the department
    const dept = await Department.findOne({ _id: departmentId });
    if (!dept) {
      throw newError("department does not exist", 400);
    }

    let course = {
      _id: courseCode,
      name,
      classHour,
      department: dept,
    };
    course = await Course.create(course);

    res.status(201).json({ msg: "successful", course });
    next();
  } catch (error) {
    next(error);
  }
};

exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;

    //get the course
    const course = await checkCourse(id);

    //get students that take that course
    const students = await Student.find({ "takes.course": course });

    //remove that course from the takes
    for (let student of students) {
      student.takes = student.takes.filter((e) => e.course._id !== course._id);
      student.save();
    }

    //get the timetable of the course
    const timetables = await Timetable.find({ course });
    //delete the timetable
    for (let timetable of timetables) {
      timetable.delete();
    }

    //delete the course
    course.delete();
    res.status(200).json({ msg: "successful", timetables, students, course });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getAddTakenBy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await checkCourse(id);

    const dept = await Department.find();

    const deptName = [];
    for (let d of dept) {
      if (!course.takenBy.includes(d.name.toLowerCase())) {
        deptName.push(d.name.toLowerCase());
      }
    }
    res.status(200).json({ departments: deptName });
  } catch (error) {
    next(error);
  }
};

exports.postAddTakenBy = async (req, res, next) => {
  try {
    valError(req);
    const { id } = req.params;
    let { dept } = req.body;
    dept = dept.toLowerCase();
    //get course
    let course = await checkCourse(id);

    //check the department
    const deptCheck = await Department.findOne({ name: dept });
    if (!deptCheck) {
      throw newError("department not found", 400);
    }

    if (course.takenBy.includes(dept.toLowerCase())) {
      throw newError("already in the course", 400);
    }

    course.takenBy.push(dept);
    course = await course.save();
    res.status(201).json({ msg: "successful", course });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await checkCourse(id);
    res.status(200).json({ course });
  } catch (error) {
    next(error);
  }
};

exports.postRemoveTakenBy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let { dept } = req.body;
    dept = dept.toLowerCase();

    let course = await checkCourse(id);

    course.takenBy = course.takenBy.filter((e) => e != dept);

    course = await course.save();
    res.status(200).json({ course, msg: "successful" });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getStudentCourse = async (req, res, next) => {
  try {
    let { id, group } = req.query;

    if (!id) throw newError("invalid id", 400);

    //get the course
    const course = await checkCourse(id);

    let students = [];
    if (!group) {
      //get the students that take the course
      students = await Student.find({ "takes.course": course });
    } else {
      //this is to split the group numbers that was sent to an array
      group = group.split(",");
      for (let g of group) {
        if (g === 0) continue;
        const courseStudents = await Student.find({ "takes.course": course });

        const courseGroupStudents = courseStudents.filter((e) => {
          const index = e.takes.findIndex((c) => c.course._id == course._id);
          return e.takes[index].group == g;
        });
        loopCourseGroupStudents: for (let s of courseGroupStudents) {
          //make sure i am not going to check for a timetable twice
          for (student of students) {
            if (student._id === s._id) continue loopCourseGroupStudents;
          }
          students.push(s);
        }
      }
    }

    let { time, day, studentCount } = req.query;
    day = day.toLowerCase();

    const studentCourseArray = [];
    let i = 0;

    loopstudent: for (let student of students) {
      if (i >= studentCount) break;
      for (let take of student.takes) {
        if (i >= studentCount) break loopstudent;
        const timetable = await Timetable.findOne({
          "course.name": take.course.name,
          group: take.group,
          day,
          time,
        });
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
    res.status(200).json({ studentCourseArray });
  } catch (error) {
    next(error);
  }
};
