//we are going to create dummy admin, instructors, classrooms, courses
const bcrypt = require("bcrypt");
const { Admin } = require("../model/admin");
const { Classroom } = require("../model/classroom");
const { Instructor } = require("../model/instructor");
const { Course } = require("../model/course");
const { Department } = require("../model/department");
const { Student } = require("../model/student");
const { courseSchedule } = require("./courseSchedule");
const { CourseSchedule } = require("../model/courseSchedule");

exports.createDummy = async () => {
  //create an admin
  const hashPassword = bcrypt.hashSync("password", 12);
  await Admin.create({
    _id: 1,
    password: hashPassword,
  });

  //create multiple classrooms
  let capacity = 40;
  let classNum = 100;
  for (let i = 0; i < 10; i++, capacity += 15, classNum += 1) {
    await Classroom.create({ building: "AS", capacity, classNum });
    await Classroom.create({ building: "ECZ", capacity, classNum });
    await Classroom.create({ building: "HK", capacity, classNum });
  }

  //create departments
  const comp = await Department.create({
    name: "computer engineering",
    faculty: "engineering",
  });
  const soft = await Department.create({
    name: "software engineering",
    faculty: "engineering",
  });
  const eee = await Department.create({
    name: "electrical engineering",
    faculty: "engineering",
  });
  const bus = await Department.create({
    name: "business administration",
    faculty: "economics and administrative studies",
  });

  //create courses
  const pseudo = await Course.create({
    _id: "Comp100",
    name: "Pseudo Code",
    classHour: 3,
    department: soft,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const compPro = await Course.create({
    _id: "Comp101",
    name: "Computer Programming",
    classHour: 3,
    department: soft,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const data = await Course.create({
    _id: "Comp102",
    name: "Data Structure",
    classHour: 3,
    department: soft,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const cal_1 = await Course.create({
    _id: "Math100",
    name: "Calculus 1",
    classHour: 3,
    department: comp,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const cal_2 = await Course.create({
    _id: "Math101",
    name: "Calculus 2",
    classHour: 3,
    department: comp,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const dip = await Course.create({
    _id: "EE100",
    name: "Digital Image",
    classHour: 4,
    department: comp,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const dsp = await Course.create({
    _id: "EE101",
    name: "Digital Signal",
    classHour: 3,
    department: eee,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const sp = await Course.create({
    _id: "Busn100",
    name: "Strategic planning",
    classHour: 3,
    department: bus,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });
  const acc = await Course.create({
    _id: "Busn102",
    name: "Accounting",
    classHour: 3,
    department: bus,
    takenBy: [
      "software engineering",
      "computer engineering",
      "electrical engineering",
      "business administration",
    ],
  });

  //create students
  let i = 1;
  await Student.create({
    name: { first: "delight", last: "azuogu" },
    _id: i++,
    department: comp,
    takes: [
      { course: cal_1, group: 1 },
      { course: data, group: 1 },
      { course: dsp, group: 1 },
    ],
  });

  await Student.create({
    name: { first: "delight", last: "azuogu" },
    _id: i++,
    department: comp,
    takes: [
      { course: cal_1, group: 1 },
      { course: data, group: 1 },
      { course: dsp, group: 1 },
    ],
  });

  //create instructors
  i = 1;
  Instructor.create({
    _id: i++,
    name: "delight ikechukwu",
    password: hashPassword,
  });
  Instructor.create({
    _id: i++,
    name: "ikechukwu delight",
    password: hashPassword,
  });

  //course schedule
  // CourseSchedule.create({
  //   departmentName: "software engineering",
  //   schedule: [
  //     ["Data Structure", "Calculus 1", "Computer Programming"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Data Structure", "Calculus 1", "Computer Programming"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Calculus 2", "Digital Image"],
  //     ["Data Structure", "Calculus 1", "Computer Programming"],
  //     ["Calculus 2", "Digital Image"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //   ],
  // });
  // CourseSchedule.create({
  //   departmentName: "computer engineering",
  //   schedule: [
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Data Structure", "Calculus 1"],
  //     ["Data Structure", "Calculus 1", "Computer Programming"],
  //     ["Calculus 2", "Digital Image"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Calculus 2", "Digital Image"],
  //   ],
  // });
  // CourseSchedule.create({
  //   departmentName: "electrical engineering",
  //   schedule: [
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Data Structure", "Calculus 1", "Computer Programming"],
  //     ["Calculus 2", "Digital Image"],
  //     ["Data Structure", "Calculus 1"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Data Structure", "Calculus 1"],
  //     ["Calculus 2", "Digital Image"],
  //   ],
  // });
  // CourseSchedule.create({
  //   departmentName: "business administration",
  //   schedule: [
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Data Structure", "Calculus 1"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Calculus 2", "Digital Image"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //     ["Pseudo Code", "Computer Programming", "Digital Image"],
  //     ["Digital Signal", "Strategic Planning", "Accounting"],
  //   ],
  // });
};
