const { Student } = require("../model/student");
const newError = require("./error");

exports.checkStudent = async (id) => {
  try {
    const student = await Student.findOne({ _id: id });
    if (!student) {
      throw newError("invalid Student", 400);
    }
    // console.log(student);
    return student;
  } catch (error) {
    throw error;
  }
};
