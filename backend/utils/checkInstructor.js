const { Instructor } = require("../model/instructor");
const newError = require("./error");

exports.checkInstructor = async (id) => {
  try {
    const instructor = await Instructor.findOne({ _id: id });
    if (!instructor) {
      throw newError("invalid instructor", 400);
    }
    return instructor;
  } catch (error) {
    throw error;
  }
};
