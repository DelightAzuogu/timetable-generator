const { Course } = require("../model/course");
const { Timetable } = require("../model/timetable");
const { CourseSchedule } = require("../model/courseSchedule");
const { checkCourse } = require("../utils/checkCourse");
const { checkDepartment } = require("../utils/checkDepartment");
const newError = require("../utils/error");
const valError = require("../utils/validationError");

function checkYearSemester(year, semester) {
  //check semester
  if (semester < 1 || semester > 2) {
    throw newError("invalid semester", 400);
  }

  //check year
  if (year < 1 || year > 4) {
    throw newError("invalid year", 400);
  }
}

exports.postAddCourseSchedule = async (req, res, next) => {
  try {
    const redirected = Boolean(req.query.redirected);
    valError(req);
    let { course, year, semester, deptName } = req.body;
    deptName = deptName.toLowerCase();

    //check semester and year
    checkYearSemester(year, semester);

    //check the deparmtent
    await checkDepartment(deptName);

    //check if that department already have a slot in the database
    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
      year,
      semester,
    });
    let newSchedule = false;
    if (!courseSchedule) {
      newSchedule = true;
      courseSchedule = {
        departmentName: deptName,
        year,
        semester,
        schedule: [],
        specialCase: {},
      };
    }
    const courseArray = courseSchedule.schedule;
    //check course
    const c = await checkCourse(course);

    //check if course is already in the schedule
    if (courseArray.includes(c.name)) {
      throw newError("course Already in schedule", 400);
    }

    //check if any course already in the schedule have a clashing time
    if (courseArray.length) {
      //the the timetalbe of the adding course
      const addTimetable = await Timetable.find({ "course.name": c.name });

      //loop through all the existing course
      for (let course of courseArray) {
        //get the timetable
        const timetable = await Timetable.find({ "course.name": course });
        for (let time of timetable) {
          for (let addTime of addTimetable) {
            if (addTime.day == time.day) {
              for (let t of addTime.time) {
                if (time.time.includes(t)) {
                  throw newError(
                    `clashing with ${course} on ${time.day} at ${t}`
                  );
                }
              }
            }
          }
        }
      }
    }

    courseArray.push(c.name);

    courseSchedule.schedule = courseArray;
    if (newSchedule) {
      courseSchedule = await CourseSchedule.create(courseSchedule);
    } else {
      courseSchedule = await courseSchedule.save();
    }
    if (!redirected) {
      res.status(201).json({ courseSchedule, msg: "successful" });
      next();
    }
  } catch (error) {
    next(error);
  }
};

exports.postRemoveCourseSchedule = async (req, res, next) => {
  try {
    valError(req);
    let { course, year, semester, deptName } = req.body;
    deptName = deptName.toLowerCase();

    //check semester and year
    checkYearSemester(year, semester);

    //check the deparmtent ID
    await checkDepartment(deptName);

    //check if that department already have a slot in the database
    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
      year,
      semester,
    });
    if (!courseSchedule) {
      throw newError("department not in course Schedule");
    }

    let courseArray = courseSchedule.schedule;
    //check course
    const c = await checkCourse(course);
    courseArray = courseArray.filter((e) => e != c.name);

    //delete the special case for such course;
    let specialCase = courseSchedule.specialCase || {};
    if (specialCase[c.name]) {
      delete specialCase[c.name];
      if (!Object.keys(specialCase).length) {
        specialCase = undefined;
      }
    }

    courseSchedule.specialCase = {};
    courseSchedule = await courseSchedule.save();

    courseSchedule.specialCase = specialCase;
    courseSchedule.schedule = courseArray;
    courseSchedule = await courseSchedule.save();

    res.status(201).json({ courseSchedule, msg: "successful" });
    next();
  } catch (error) {
    next(error);
  }
};

exports.getCourseSchedule = async (req, res, next) => {
  try {
    let { year, semester, deptName } = req.query;
    deptName = deptName.toLowerCase();

    //check semester and year
    checkYearSemester(year, semester);

    //check the deparmtent ID
    await checkDepartment(deptName);

    let courseSchedule = await CourseSchedule.findOne({
      departmentName: deptName,
      year,
      semester,
    });
    if (!courseSchedule) {
      throw newError("department not in course Schedule");
    }

    res.status(200).json({ courses: courseSchedule.schedule });
  } catch (error) {
    next(error);
  }
};

exports.postaddSpecialCase = async (req, res, next) => {
  try {
    valError(req);
    let { year, semester, deptName, courseAddId, course } = req.body;
    deptName = deptName.toLowerCase();

    //check the year and semester
    checkYearSemester(year, semester);

    //check dept
    await checkDepartment(deptName);

    //check the courses
    const courseAdd = await checkCourse(courseAddId);
    const courseSpecial = await checkCourse(course);

    // get the course Schedule for that dept and year and semester
    let courseSchedule = await CourseSchedule.findOne({
      year,
      semester,
      departmentName: deptName,
    });
    //check if there is a course schedule
    if (!courseSchedule) {
      req.query.redirected = true;
      await this.postAddCourseSchedule(req, res, next);

      courseSchedule = await CourseSchedule.findOne({
        year,
      });
    }

    if (!courseSchedule.schedule.includes(courseSpecial.name)) {
      req.query.redirected = true;
      await this.postAddCourseSchedule(req, res, next);

      courseSchedule = await CourseSchedule.findOne({
        year,
      });
    }

    if (courseSchedule.schedule.includes(courseAdd.name)) {
      throw newError("course already in the course schedule", 401);
    }

    let specialCase = courseSchedule.specialCase || {};

    //this is because mongoose does not track objects that well in saving
    courseSchedule.specialCase = {};
    courseSchedule = await courseSchedule.save();

    if (specialCase[courseSpecial.name] == undefined) {
      specialCase[courseSpecial.name] = [courseAdd.name];
    } else {
      if (specialCase[courseSpecial.name].includes(courseAdd.name)) {
        throw newError("course already in the special course", 401);
      }

      specialCase[courseSpecial.name].push(courseAdd.name);
    }

    courseSchedule.specialCase = specialCase;

    courseSchedule = await courseSchedule.save();

    res.status(201).json({ msg: "successfully added", courseSchedule });
    next();
  } catch (error) {
    next(error);
  }
};

exports.postRemoveSpecialCase = async (req, res, next) => {
  try {
    valError(req);
    let { year, semester, deptName, courseRemoveId, courseId } = req.body;
    deptName = deptName.toLowerCase();

    //check semester and year
    checkYearSemester(year, semester);

    const courseRemove = await checkCourse(courseRemoveId);
    const course = await checkCourse(courseId);

    await checkDepartment(deptName);

    // get the course Schedule for that dept and year and semester
    let courseSchedule = await CourseSchedule.findOne({
      year,
      semester,
      departmentName: deptName,
    });
    if (!courseSchedule) {
      throw newError("no course schedule", 401);
    }

    let specialCase = courseSchedule.specialCase;

    //check if there is a special case
    if (specialCase == undefined) {
      throw newError("no special cases");
    }

    //check if there is a special case for the course
    if (!specialCase[course.name]) {
      throw newError("course schedule does not have a special for course");
    }

    specialCase[course.name] = specialCase[course.name].filter(
      (value, i) => value != courseRemove.name
    );

    if (!specialCase[course.name].length) {
      delete specialCase[course.name];
    }

    //this is to check if special case is empty or not in order to set it to undefined
    if (!Object.keys(specialCase).length) {
      specialCase = undefined;
    }

    //this is because mongoose does not track objects that well in saving
    courseSchedule.specialCase = {};
    courseSchedule = await courseSchedule.save();

    courseSchedule.specialCase = specialCase;
    courseSchedule = await courseSchedule.save();

    res.status(200).json({ msg: "removed successfully", courseSchedule });
    next();
  } catch (error) {
    next(error);
  }
};
