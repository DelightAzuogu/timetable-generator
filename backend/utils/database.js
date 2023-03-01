//we are going to create dummy admin, instructors, classrooms, courses
const bcrypt = require("bcrypt");
const { Admin } = require("../model/admin");
const { Classroom } = require("../model/classroom");
const { Instructor } = require("../model/instructor");
const { Course } = require("../model/course");

exports.createDummy = async () => {
  //create an admin
  const hashPassword = bcrypt.hashSync("password", 12);
  await Admin.create({
    _id: 1,
    password: hashPassword,
  });

  //create multiple classrooms
  await Classroom.create({ building: "AS", capacity: 150, classNum: 100 });
  await Classroom.create({ building: "AS", capacity: 30, classNum: 101 });
  await Classroom.create({ building: "AS", capacity: 20, classNum: 103 });
  await Classroom.create({ building: "AS", capacity: 40, classNum: 104 });
  await Classroom.create({ building: "ECZ", capacity: 30, classNum: 100 });
  await Classroom.create({ building: "ECZ", capacity: 50, classNum: 101 });
  await Classroom.create({ building: "ECZ", capacity: 60, classNum: 102 });
  await Classroom.create({ building: "ECZ", capacity: 200, classNum: 103 });
  await Classroom.create({ building: "HK", capacity: 15, classNum: 100 });
  await Classroom.create({ building: "HK", capacity: 35, classNum: 101 });

  //create courses
  await Course.create({
    _id: "Comp100",
    name: "Pseudo Code",
    classHour: 3,
  });
  await Course.create({
    _id: "Comp101",
    name: "Computer Programming",
    classHour: 3,
  });
  await Course.create({
    _id: "Comp102",
    name: "Data Structure",
    classHour: 3,
  });
  await Course.create({
    _id: "Math100",
    name: "Calculus 1",
    classHour: 3,
  });
  await Course.create({
    _id: "Math101",
    name: "Calculus 2",
    classHour: 3,
  });
  await Course.create({
    _id: "EE100",
    name: "Digital Image Processing",
    classHour: 3,
  });
  await Course.create({
    _id: "EE101",
    name: "Digital Signal Processing",
    classHour: 3,
  });
  await Course.create({
    _id: "Busn100",
    name: "Strategic planning",
    classHour: 3,
  });
  await Course.create({
    _id: "Busn102",
    name: "Accounting",
    classHour: 3,
  });

  //create instructors
  Instructor.create({
    _id: 1,
    name: "delight ikechukwu",
    password: hashPassword,
  });
  Instructor.create({
    _id: 2,
    name: "ikechukwu delight",
    password: hashPassword,
  });
  await Instructor.create({
    _id: 3,
    name: "azuogu delight",
    password: hashPassword,
  });
  await Instructor.create({
    _id: 4,
    name: "delight azuogu",
    password: hashPassword,
  });
  await Instructor.create({
    _id: 5,
    name: "ikechukwu azuogu",
    password: hashPassword,
  });
};
