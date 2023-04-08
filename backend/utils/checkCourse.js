const { Course } = require("../model/course");
const newError = require("./error");

exports.checkCourse = async (id) => {
  try {
    const course = await Course.findOne({ _id: id });
    if (!course) {
      throw newError("invalid Course", 400);
    }
    return course;
  } catch (error) {
    throw error;
  }
};
