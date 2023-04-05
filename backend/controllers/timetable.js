const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours } = require("../utils/daysAndTime");
// const { courseSchedule } = require("../utils/courseSchedule");
const { CourseSchedule } = require("../model/courseSchedule");
const { checkInstructor } = require("../utils/checkInstructor");
const { checkCourse } = require("../utils/checkCourse");

//get the indexes of a course(val) in a department(key) in the course Schedule
const getAllIndex = async (val, dept) => {
  const indexes = [];
  try {
    const deptCourseSchedule = await CourseSchedule.findOne({
      departmentName: dept,
    });
    if (!deptCourseSchedule) {
      return [];
    }

    for (let i in deptCourseSchedule.schedule) {
      if (deptCourseSchedule.schedule[i].includes(val)) {
        indexes.push(i);
      }
    }
    return indexes;
  } catch (error) {
    throw error;
  }
};

// find the freetime of a class in {day: "", time:[]}
async function classFreetime(classroom, classHour) {
  try {
    //error handling
    if (!classroom) throw "classroom is not specified";
    if (!classHour) throw "class hour is not specifed";

    let freetimes = [];
    let classroomUse = await Timetable.find({ classroom });

    //using this for when the class hour is 3
    if (classHour == 3) {
      freetimes = threeHours.filter((hours) => {
        let init = false;
        for (let classes of classroomUse) {
          if (hours.day === classes.day) {
            for (let t of hours.time) {
              if (classes.time.includes(t)) {
                init = true;
                break;
              }
            }
          }
        }
        if (!init) return hours;
      });
    }

    //using this when the class hour is 4
    else if (classHour == 4) {
      freetimes = fourHours.filter((hours) => {
        let init = false;
        for (let classes of classroomUse) {
          if (hours.day === classes.day) {
            for (let t of hours.time) {
              if (classes.time.includes(t)) {
                init = true;
                break;
              }
            }
          }
        }
        if (!init) {
          return hours;
        }
      });
    }

    return freetimes;
  } catch (err) {
    throw err;
  }
}

//to get the max class capacity
async function maxClassRoom() {
  const rooms = await Classroom.find();
  let maxCap = rooms[0].capacity;
  for (let i = 0; i < rooms.length; i++) {
    if (rooms[i].capacity > maxCap) maxCap = rooms[i].capacity;
  }
  return maxCap;
}

//ArrayShuffle an array
function ArrayShuffle(array) {
  if (!(array instanceof Array)) throw "pass an array";

  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to ArrayShuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

async function getCourseSchedules() {
  try {
    const courseSchedule = await CourseSchedule.find();
    return courseSchedule;
  } catch (error) {
    throw error;
  }
}

//get add to timetable
exports.getAddToTimetable = async (req, res, next) => {
  try {
    //get all the classrooms
    const classrooms = await Classroom.find();

    //get all instructors
    const instructors = await Instructor.find();

    //get all courses
    const courses = await Course.find();

    res.json({ classrooms, instructors, courses });
  } catch (err) {
    next(err);
  }
};

/*for a normal adding to timetable
that shuffles the classes and pick one and also shuffles the times the select class is free.
post add to the timetable*/
exports.postAddtoTimetable = async (req, res, next) => {
  try {
    //check for validation err
    valError(req);

    let { studentCount, instructorId, courseId, group } = req.body;

    if (group <= 0) {
      group = 1;
    }
    if (studentCount <= 0) {
      throw newError("invalid student count", 400);
    }

    //get the instructor and the course
    let instructor = await checkInstructor(instructorId);
    const course = await checkCourse(courseId);

    //check if this course with the group is already in timetable
    const timetableCheck = await Timetable.findOne({
      group: group,
      course: course,
    });
    if (timetableCheck) {
      throw newError("course with group already exists", 400);
    }

    const maxCapacity = maxClassRoom(); //the max classroom capacity;

    //classrooms that can contain that number of student
    let min = parseInt(studentCount);
    let max = min + 20; //this is the ceiling for the classroom search
    let classrooms = [];
    if (min > maxCapacity) {
      min = maxCapacity - 10;
      max = maxCapacity;
    }
    //increase the search area until there is a class that can take it.
    //it will always return a classroom because it will reach the max classroom and return it.
    while (classrooms.length == 0) {
      // increase the classroom search area upwards.
      classrooms = await Classroom.find({
        capacity: {
          $lte: max,
          $gte: min,
        },
      });
      //break when classroom is found
      if (classrooms.length > 0) {
        break;
      }
      min = max;
      max += 20;
    }

    //shuffles the classrooms so one classroom won't be used until its filled up
    classrooms = ArrayShuffle(classrooms);

    let timetable = {
      instructorId: instructor._id,
      course,
      group,
    };

    //get the course schedules
    const courseSchedule = await getCourseSchedules();

    //freetimes of the classroom
    let freetimes;

    loopClassrooms: for (let i = 0; i < classrooms.length; i++) {
      //get the free time of the classroom
      freetimes = await classFreetime(classrooms[i], course.classHour);

      //take the first classroom with a freetime
      if (freetimes.length > 0) {
        freetimes = ArrayShuffle(freetimes);
        freetimes = ArrayShuffle(freetimes);
        console.log(freetimes);
        //check for the freetime that does not clash with any other course in the same section as the course in question.
        loopFreetimes: for (let freetime of freetimes) {
          let courseRecord = []; //this keeps record of checked courses

          for (let schedule of courseSchedule) {
            //check departments with course departments
            if (!course.takenBy.includes(schedule.departmentName)) continue;

            //get the indexes the course is in course schedule
            const indexes = await getAllIndex(
              course.name,
              schedule.departmentName
            );

            for (let index of indexes) {
              //check all the courses in that index to if they have a clashing course
              for (let c of schedule.schedule[index]) {
                if (courseRecord.includes(c)) continue;
                //check if the course or instructor has a class in that freetime
                for (let time in freetime.time) {
                  const courseTtableCheck = await Timetable.findOne({
                    day: freetime.day,
                    time: freetime.time[time],
                    "course.name": c,
                  });
                  const instructorTtableCheck = await Timetable.findOne({
                    day: freetime.day,
                    time: freetime.time[time],
                    instructorId: instructor._id,
                  });
                  if (instructorTtableCheck || courseTtableCheck)
                    continue loopFreetimes;
                }
                courseRecord.push(c);
              }
            }
          }
          timetable.time = freetime.time;
          timetable.day = freetime.day;
          timetable.classroom = classrooms[i];
          break loopClassrooms;
        }
      }
      if (i >= classrooms.length) {
        classrooms = [];
        i = -1;
        // make sure there is a classroom to search through
        while (classrooms.length == 0) {
          //when we go thruogh all the classroooms and found no freetime, we increase the search area
          if (min == maxCapacity) {
            throw newError(
              "no classrooms with capacity for this avaliable",
              400
            );
          }
          min = max;
          max += 20;
          classrooms = await Classroom.find({
            capacity: {
              $lte: max,
              $gte: min,
            },
          });
        }
      }
    }
    timetable = await Timetable.create(timetable);
    res.status(201).json({ msg: "success", timetable });
  } catch (error) {
    next(error);
  }
};

//this will find the days the lecturer has a class and add the class in one of those days,
//if the instrcutor was never in the timetable or the days they have a timetable is occupied
//then it will be redirected to the add normally route so they can find a suitable time and put them
exports.postSameDayAddToTimetable = async (req, res, next) => {
  try {
    //check for validation err
    valError(req);

    let { studentCount, instructorId, courseId, group } = req.body;
    if (group <= 0) {
      group = 1;
    }
    if (studentCount <= 0) {
      throw newError("invalid student count", 400);
    }

    //get the times the lecturer has a class
    const instructorClassTime = await Timetable.find({ instructorId });

    //redirect to the normal add route when instructor doenst hve a course in timetable
    if (!instructorClassTime.length) {
      res.redirect(307, "add");
    }
    //when instructor have a course in the timetable
    else {
      //get the course schedules
      const courseSchedule = await getCourseSchedules();

      //get the instructor and the course
      let instructor = await Instructor.findOne({ _id: instructorId });
      if (!instructor) {
        throw newError("invalid instructor", 400);
      }
      const course = await Course.findOne({ _id: courseId });
      if (!course) {
        throw newError("invalid course", 400);
      }

      //check if this course with the group is already in timetable
      const timetableCheck = await Timetable.findOne({
        group: group,
        course: course,
      });
      //course with group exists
      if (timetableCheck) {
        throw newError("course with group already exists", 400);
      }

      let classrooms = [];
      for (let timetable of instructorClassTime) {
        //take only the classrooms that can fit the number of students expected
        if (timetable.classroom.capacity >= studentCount) {
          classrooms.push(timetable.classroom);
        }
      }
      classrooms = ArrayShuffle(classrooms);

      let timetable = {
        instructorId: instructor._id,
        course,
        group,
      };

      let isClassInstructorTime = false;

      let freetimes = [];

      for (let i = 0; i < classrooms.length; i++) {
        freetimes = await classFreetime(classrooms[i], course.classHour);

        if (freetimes.length <= 0) continue;

        //remove the freetimes that are not in that day
        //also remove the onces that clashes with the instructor class time
        let classInstructorTime = freetimes.filter((freetime) => {
          for (let instructorTime of instructorClassTime) {
            if (
              instructorTime.classroom == classrooms[i] &&
              freetime.day === instructorTime.day
            ) {
              let check = false;
              for (let time of freetime.time) {
                if (instructorTime.time.includes(time)) {
                  check = true;
                }
              }
              if (check == false) return freetime;
            }
          }
        });

        if (!classInstructorTime.length) continue;

        //check if the there is a clashing class for those course with the departments schedule
        loopCITime: for (let CITime of classInstructorTime) {
          let courseRecord = [];
          for (let schedule of courseSchedule) {
            if (!course.takenBy.includes(schedule.departmentName)) continue;

            //get the indexes the course is in course schedule
            const indexes = await getAllIndex(
              course.name,
              schedule.departmentName
            );
            for (let index of indexes) {
              //check all the courses in that index to if they have a clashing course
              for (let c of schedule.schedule[index]) {
                if (courseRecord.includes(c)) continue;
                //check if course has class in that time
                for (let time of CITime.time) {
                  const courseTtableCheck = await Timetable.findOne({
                    day: CITime.day,
                    time,
                    "course.name": c,
                  });
                  const instructorTtableCheck = await Timetable.findOne({
                    day: CITime.day,
                    time,
                    instructorId: instructor._id,
                  });
                  if (courseTtableCheck || instructorTtableCheck)
                    continue loopCITime;
                }
                courseRecord.push(c);
              }
            }
          }
          timetable.day = CITime.day;
          timetable.time = CITime.time;
          timetable.classroom = classrooms[i];
          break;
        }
        if (!timetable.day) {
          continue;
        }
      }

      //incase there wasnt a freetime anywhere
      if (!timetable.classroom) {
        isClassInstructorTime = true;
      }

      //check for same day with different classroom that can fit the students
      if (isClassInstructorTime) {
        isClassInstructorTime = false;
        const maxCapacity = await maxClassRoom();

        //classrooms that can contain that number of student
        let min = parseInt(studentCount);
        let max = min + 20; //this is the ceiling for the classroom search
        let classrooms = [];
        if (min > maxCapacity) {
          min = maxCapacity - 10;
          max = maxCapacity;
        }
        //increase the search area until there is a class that can take it.
        //it will always return a classroom because it will reach the max classroom and return it.
        while (classrooms.length == 0) {
          // increase the classroom search area upwards.
          classrooms = await Classroom.find({
            capacity: {
              $lte: max,
              $gte: min,
            },
          });
          //break when classroom is found
          if (classrooms.length > 0) {
            break;
          }
          min = max;
          max += 20;
        }
        classrooms = ArrayShuffle(classrooms);
        classrooms = ArrayShuffle(classrooms);
        classrooms = ArrayShuffle(classrooms);

        loopClassrooms: for (let i = 0; i < classrooms.length; i++) {
          freetimes = await classFreetime(classrooms[i], course.classHour);
          if (freetimes.length > 0) {
            //remove the freetimes that are not in that day
            //also remove the free times that the instructor has a class
            const classInstructorTime = freetimes.filter((freetime) => {
              for (let instructorTime of instructorClassTime) {
                if (freetime.day == instructorTime.day) {
                  let check = false;
                  for (let time of freetime.time) {
                    if (instructorTime.time.includes(time)) {
                      check = true;
                    }
                  }
                  if (check == false) return freetime;
                }
              }
            });
            if (classInstructorTime.length) {
              //check if there is a clashing class for those course with the departments schedule
              loopCITime: for (let CITime of classInstructorTime) {
                let courseRecord = [];
                for (let schedule of courseSchedule) {
                  if (!course.takenBy.includes(schedule.departmentName)) {
                    continue;
                  }

                  //get the indexes the course is in course schedule
                  const indexes = await getAllIndex(
                    course.name,
                    schedule.departmentName
                  );
                  for (let index of indexes) {
                    //check all the courses in that index to if they have a clashing course
                    for (let c of schedule.schedule[index]) {
                      if (courseRecord.includes(c)) {
                        continue;
                      }

                      //check if course has class in that time
                      for (let time of CITime.time) {
                        const courseTtableCheck = await Timetable.findOne({
                          day: CITime.day,
                          time,
                          "course.name": c,
                        });
                        const instructorTtableCheck = await Timetable.findOne({
                          day: CITime.day,
                          time,
                          instructorId: instructor._id,
                        });
                        if (courseTtableCheck || instructorTtableCheck) {
                          continue loopCITime;
                        }
                      }
                      courseRecord.push(c);
                    }
                  }
                }
                timetable.day = CITime.day;
                timetable.time = CITime.time;
                timetable.classroom = classrooms[i];
                break loopClassrooms;
              }
            }
          }
          if (i >= classrooms.length - 1) {
            classrooms = [];
            i = -1; //setting this to -1 so when it increases in the loop it will be at 0
            // make sure there is a classroom to search through
            while (classrooms.length == 0) {
              //when we go thruogh all the classroooms and found no freetime, we increase the search area
              if (min >= maxCapacity) {
                throw newError(
                  "course cannot be fitted on the same day 1",
                  400
                );
              }
              min = max;
              max += 20;
              classrooms = await Classroom.find({
                capacity: {
                  $lte: max,
                  $gte: min,
                },
              });
            }
          }
        }
      }

      if (timetable.day) {
        timetable = await Timetable.create(timetable);
        res.status(201).json({ msg: "success", timetable });
      } else {
        throw newError("instructor cannot be fitted on the same day 2", 400);
      }
    }
  } catch (error) {
    next(error);
  }
};

//this will add to the timetable manually, ie you manually input the time, day  etc
exports.postAddToTimetableManually = async (req, res, next) => {
  try {
    valError(req);

    let { day, startTime, classroomId, instructorId, courseId, group } =
      req.body;
    if (group <= 0) {
      group = 1;
    }

    //check day
    day = day.toLowerCase();
    if (!daysOfWeek.includes(day.toLowerCase())) {
      throw newError("invalid day");
    }

    // check if classroom
    const classroom = await Classroom.findOne({ _id: classroomId });
    if (!classroom) {
      throw newError("invalid Classroom", 400);
    }
    //check the instructor
    let instructor = await Instructor.findOne({ _id: instructorId });
    if (!instructor) {
      throw newError("invalid instructor", 400);
    }
    //check the course
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      throw newError("invalid course", 400);
    }

    //check if the course with group is in the timetable
    const timetableCheck = await Timetable.findOne({
      group,
      course,
    });
    if (timetableCheck) {
      throw newError("course with group already exists", 400);
    }

    //this id the time of the class, it
    const time = [];

    //check if the instructor have a class at the time
    for (let i = 0, s = parseInt(startTime); i < course.classHour; i++, s++) {
      //check for if the class is free on that day and time
      let check = await Timetable.findOne({ classroom, day, time: s });
      if (check) {
        throw newError("class is not free", 400);
      }

      //check if the instructor is free on that day and time.
      check = await Timetable.findOne({ instructorId, day, time: s });
      if (check) {
        throw newError("instructor has a class", 400);
      }

      //this is incase the check up top succeed, the time will be used in the timetable instead of creating another loop
      time.push(s);
    }

    // check if the course has a clash with any course in the courseSchedule list
    const courseSchedule = await getCourseSchedules();
    const courseRecord = [];
    for (let schedule of courseSchedule) {
      if (!course.takenBy.includes(schedule.departmentName)) continue;
      const indexes = await getAllIndex(course.name, schedule.departmentName);
      console.log(indexes);
      for (let index of indexes) {
        for (let c of schedule.schedule[index]) {
          console.log(c);
          if (courseRecord.includes(c)) continue;
          //check if the course in schedule has a class that time
          for (let t of time) {
            const courseTtableCheck = await Timetable.findOne({
              day,
              time: t,
              "course.name": c,
            });
            if (courseTtableCheck) {
              throw newError("clash with course Schedule");
            }
          }
          courseRecord.push(c);
        }
      }
    }

    //add the thing to the timetable
    let timetable = {
      classroom,
      day,
      instructorId,
      course,
      group,
      time: time,
    };
    timetable = await Timetable.create(timetable);

    res.status(201).json({ msg: "success", timetable });
  } catch (error) {
    next(error);
  }
};
//this is just getting all the courses in the timetable
exports.getTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.find();

    res.status(200).json({ timetable });
  } catch (error) {
    next(error);
  }
};

//this is deleting an item from the timetable
exports.deleteFromTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;

    const timetable = await Timetable.findOne({ _id: id });
    if (!timetable) {
      throw newError("timetable not found", 400);
    }

    await Timetable.deleteOne({ _id: id });

    res.status(204).json({ msg: "deleted" });
  } catch (error) {
    next(error);
  }
};

//experimental
