const { Classroom } = require("../model/classroom");
const newError = require("./error");

exports.checkClassroom = async (id) => {
  try {
    const classroom = await Classroom.findOne({ _id: id });
    if (!classroom) {
      throw newError("invalid Classroom", 400);
    }
    return classroom;
  } catch (error) {
    throw error;
  }
};
