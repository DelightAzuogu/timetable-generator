const { Classroom } = require("../model/classroom");
const { Course } = require("../model/course");
const { Instructor } = require("../model/instructor");
const { Timetable } = require("../model/timetable");
const valError = require("../utils/validationError");
const newError = require("../utils/error");
const { daysOfWeek, fourHours, threeHours } = require("../utils/daysAndTime");

// find the freetime of a class in {day: "", time:[]}
async function classFreetime(classroom, classHour) {
  try {
    let freetimes = []
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
      freetimes = fourHours.map((hours) => {
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
};

//ArrayShuffle an array
function ArrayShuffle(array) {
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

//check the group and student Count
function groupStudentCountCheck(group, studentCount) {
  //check the group
  if (group <= 0) {
    throw newError("Group error", 400)
  }
  //check the studentCount
  if (studentCount <= 0) {
    throw newError("Student count is too low", 400);
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

    const { studentCount, instructorId, courseId, group } = req.body;

    //check the group and student count
    groupStudentCountCheck(group, studentCount);

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
    if (timetableCheck) {
      throw newError("course with group already exists", 400);
    }

    const maxCapacity = maxClassRoom(); //the max classroom capacity;

    //classrooms that can contain that number of student
    let min = parseInt(studentCount);
    let max = min + 20; //this is the ceiling for the classroom search
    let classrooms = [];
    if (min > maxCapacity) {
      min = maxCapacity;
      max = min + 20;
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
      day: "monday",
      instructorId: instructor._id,
      course,
      group,
    };

    //freetimes of the classroom
    let freetimes;

    loop1:
    for (; ;) {

      for (let i = 0; i < classrooms.length; i++) {
        //get the free time of the classroom
        freetimes = await classFreetime(classrooms[i], course.classHour);

        //take the first classroom with a freetime
        if (freetimes.length > 0) {
          timetable.classroom = classrooms[i];
          break;
        }
        //when there is no free time
        else if (i == classrooms.length) {
          classrooms = [];
          i = 0;
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

      //ArrayShuffle the freetimes and pick the first one
      freetimes = ArrayShuffle(freetimes);
      //find the classroom freetime that the instructor will also be free
      for (let i = 0, j = 0; i < freetimes.length; i++, j = 0) {
        let check = false;
        for (let k = 0; k < freetimes[i].length; k++, j++) {
          const checkInstructorFreetime = await Timetable.findOne({ time: freetimes[i].time[j], day: freetimes[i].day })
          if (checkInstructorFreetime) {
            check = true;
            break;
          }
        }
        if (!check) {
          timetable.day = freetimes[i].day;
          timetable.time = freetimes[i].time;
          break loop1;
        }
      }
    }
    //add the course to the instructor
    instructor.teaches.push({
      course,
      group,
    });
    instructor = await instructor.save();

    //save the timetable
    timetable = await Timetable.create(timetable);

    res.status(201).json({ msg: "success", timetable });

  } catch (err) {
    next(err);
  }
};

exports.postSameDayAddToTimetable = async (req, res, next) => {
  try {
    //check for validation err
    valError(req);

    const { studentCount, instructorId, courseId, group } = req.body;


    //get the times the lecturer has a class
    const instructorClassTime = await Timetable.find({ instructorId });

    //redirect to the normal add route when instructor doenst hve a course in timetable
    if (!(instructorClassTime.length)) {
      res.redirect(307, "add")
    }
    //when instructor have a course in the timetable
    else {
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
      //course with group doesnt exist
      if (!timetableCheck) {
        // the max classroom capacity;
        const maxCapacity = maxClassRoom();

        //classrooms that can contain that number of student
        let max = parseInt(studentCount);
        let min = max + 20; //this is the ceiling for the classroom search
        if (min > maxCapacity) {
          min = maxCapacity;
          max = min + 20;
        }

        let classrooms = [];
        for (let timetable of instructorClassTime) {
          classrooms.push(timetable.classroom)
        }


        classrooms = ArrayShuffle(classrooms);

        let timetable = {
          day: "",
          time: [],
          classroom: [],
          instructorId: instructor._id,
          course,
          group,
        };

        let isClassInstructorTime = false;

        let freetimes
        for (let i = 0; i < classrooms.length; i++) {
          freetimes = await classFreetime(classrooms[i], course.classHour);

          //take the first classroom with a freetime
          if (freetimes.length > 0) {
            let classInstructorTime = freetimes.filter((freetime) => {
              for (let instructorTime of instructorClassTime) {
                if (freetime.day == instructorTime.day && freetime.time[0] != instructorTime.time[0]) {
                  return freetime;
                }
              }
            })
            if (classInstructorTime.length) {
              classInstructorTime = ArrayShuffle(classInstructorTime);

              timetable.day = classInstructorTime[0].day
              timetable.time = classInstructorTime[0].time
              timetable.classroom = classrooms[i];
              break;
            }
            else {
              isClassInstructorTime = true;
              break;
            };
          }
          //when there is no free time
          else if (i == classrooms.length) {
            isClassInstructorTime = true;
            break;
          }
        }
        if (isClassInstructorTime) {
          res.redirect(307, "add")
        }
        else {
          timetable = await Timetable.create(timetable);

          instructor = await Instructor.findOne({ _id: instructorId });
          instructor.teaches.push({ course, group })
          await instructor.save();

          res.status(201).json({ msg: "success", timetable })
        }

      }
      //course with group exists
      else {
        throw newError("course with group already exists", 400);
      }
    }


  } catch (error) {
    next(error)
  }
}

exports.postAddToTimetableManually = async (req, res, next) => {
  try {
    valError(req);

    let { day, startTime, classroomId, instructorId, courseId, group } = req.body;

    //check day
    // days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    day = day.toLowerCase()
    if (!(daysOfWeek.includes(day.toLowerCase()))) {
      throw newError("invalid day");
    }

    // check if classroom
    const classroom = await Classroom.findOne({ _id: classroomId })
    if (!classroom) {
      throw newError("invalid Classroom", 400);
    }
    //check the instructor
    let instructor = await Instructor.findOne({ _id: instructorId })
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
        throw newError("class is not free")
      }


      //check if the instructor is free on that day and time.
      check = await Timetable.findOne({ instructorId, day, time: s })
      if (check) {
        throw newError("instructor has a class", 400);
      }

      //this is incase the check up top succeed, the time will be used in the timetable instead of creating another loop
      time.push(s)

    }


    //add the thing to the timetable
    let timetable = {
      classroom,
      day,
      instructorId,
      course,
      group,
      time: time
    };
    // console.log(timetable)
    timetable = await Timetable.create(timetable);

    instructor.teaches.push({ course, group })
    await instructor.save();

    res.status(201).json({ msg: "success" })
  }
  catch (error) {
    next(error);
  }
}

//this will get the timetable of the Instructor
exports.getIntructorTimetable = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)

    const instructor = await Instructor.findOne({ _id: id })
    if (!instructor) {
      throw newError("invalid instructor", 400);
    }
    const timetable = await Timetable.find({ instructorId: instructor._id })

    res.status(200).json({ msg: "success", timetable });

  } catch (error) {
    next(error);
  }
}

//this will get the timetable of the Course
exports.getCourseTimetable = async (req, res, next) => {
  try {
    const { id } = req.body;

    const course = await Course.findOne({ _id: id });
    if (!course) {
      throw newError("invalid Course", 400);
    }
    const timetable = await Timetable.find({ course })

    res.status(200).json({ msg: "success", timetable });
  } catch (error) {
    next(error);
  }
}


//this will get the timetable of the classroom
exports.getClassroomTimetable = async (req, res, next) => {
  try {
    const { id } = req.body;

    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      throw newError("invalid classroom", 400)
    }

    const timetable = await Timetable.find({ classroom })

    res.status(200).json({ msg: "success", timetable })
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