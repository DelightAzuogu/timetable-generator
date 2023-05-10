const { Schema, default: mongoose } = require("mongoose");
const { departmentSchema } = require("./department");

const courseSchema = new Schema({
  _id: String,
  name: {
    type: String,
  },
  classHour: {
    type: Number,
  },
  department: {
    type: departmentSchema,
  },
  takenBy: {
    type: [String],
  },
});

exports.courseSchema = courseSchema;
exports.Course = mongoose.model("Course", courseSchema);
