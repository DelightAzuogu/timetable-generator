const { Schema, default: mongoose } = require("mongoose");
const { departmentSchema } = require("./department");

const courseSchema = new Schema({
  //this is the course code
  _id: String,
  name: {
    type: String,
  },
  //how long for the class
  classHour: {
    type: Number,
  },
  department: {
    type: departmentSchema,
  },
  //what departments take the course
  takenBy: {
    type: [String],
  },
});

exports.courseSchema = courseSchema;
exports.Course = mongoose.model("Course", courseSchema);
