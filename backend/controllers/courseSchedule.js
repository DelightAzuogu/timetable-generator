const { Course } = require("../model/course");
const { CourseSchedule } = require("../model/courseSchedule");
const { checkCourse } = require("../utils/checkCourse");
const { checkDepartment } = require("../utils/checkDepartment");
const newError = require("../utils/error");
const valError = require("../utils/validationError");

const ArrayIndex = (year, semester) => {
  //this is to get the array that you would inside into
  let arrayindex;
  if (year == 1) arrayindex = 0;
  else if (year == 2) arrayindex = 2;
  else if (year == 3) arrayindex = 4;
  else if (year == 4) arrayindex = 6;

  if (semester == 2) {
    arrayindex++;
  }
  return arrayindex;
};

exports.postAddCourseSchedule = async (req, res, next) => {
  try {
    valError(req);
    let { courses, year, semester, deptName } = req.body;
    deptName = deptName.toLowerCase();

    //check semester
    if (semester < 1 || semester > 2) {
      throw newError("invalid semester", 400);
    }

    //check year
    if (year < 1 || year > 4) {
      throw newError("invalid year", 400);
    }

    //this is to get the array that you would inside into
    let arrayindex = ArrayIndex(year, semester);

    //check the deparmtent ID
    await checkDepartment(deptName);

    //check if that department already have a slot in the database
    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
    });
    let newSchedule = false;
    if (!courseSchedule) {
      newSchedule = true;
      courseSchedule = {
        departmentName: deptName,
        schedule: [[], [], [], [], [], [], [], []],
      };
    }
    const courseArray = courseSchedule.schedule[arrayindex];
    for (let course of courses) {
      //check course
      const c = await checkCourse(course);

      //check if course is already in the schedule
      if (courseArray.includes(c.name)) {
        continue;
      }
      courseArray.push(c.name);
    }
    courseSchedule.schedule[arrayindex] = courseArray;
    if (newSchedule) {
      courseSchedule = await CourseSchedule.create(courseSchedule);
    } else {
      courseSchedule = await courseSchedule.save();
    }
    res.status(201).json({ courseSchedule, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.postRemoveCourseSchedule = async (req, res, next) => {
  try {
    valError(req);
    let { courseNames, year, semester, deptName } = req.body;
    deptName = deptName.toLowerCase();

    //check semester
    if (semester < 1 || semester > 2) {
      throw newError("invalid semester", 400);
    }

    //check year
    if (year < 1 || year > 4) {
      throw newError("invalid year", 400);
    }

    //this is to get the array that you would inside into
    let arrayindex = ArrayIndex(year, semester);

    //check the deparmtent ID
    await checkDepartment(deptName);

    //check if that department already have a slot in the database
    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
    });
    if (!courseSchedule) {
      throw newError("department not in course Schedule");
    }

    let courseArray = courseSchedule.schedule[arrayindex];
    for (let courseName of courseNames) {
      //check course
      const course = await Course.findOne({ name: courseName });
      if (!course) {
        continue;
      }
      courseArray = courseArray.filter((e) => e != course.name);
    }

    courseSchedule.schedule[arrayindex] = courseArray;

    courseSchedule = await courseSchedule.save();

    res.status(201).json({ courseSchedule, msg: "successful" });
  } catch (error) {
    next(error);
  }
};

exports.getCourseSchedule = async (req, res, next) => {
  try {
    valError(req);

    let { year, semester, deptName } = req.body;
    deptName = deptName.toLowerCase();

    //check semester
    if (semester < 1 || semester > 2) {
      throw newError("invalid semester", 400);
    }

    //check year
    if (year < 1 || year > 4) {
      throw newError("invalid year", 400);
    }

    //this is to get the array that you would inside into
    let arrayindex = ArrayIndex(year, semester);

    //check the deparmtent ID
    await checkDepartment(deptName);

    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
    });
    if (!courseSchedule) {
      throw newError("department not in course Schedule");
    }

    res.status(200).json({ courses: courseSchedule.schedule[arrayindex] });
  } catch (error) {
    next(error);
  }
};
