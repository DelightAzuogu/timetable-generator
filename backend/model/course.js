const { Schema, default: mongoose } = require("mongoose");
const { departmentSchema } = require("./department");

const courseSchema = new Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    unique: true,
  },
  classHour: {
    type: Number,
    required: true,
  },
  department: {
    type: departmentSchema,
    required: true,
  },
  takenBy: {
    type: [String],
    required: true,
  },
});

exports.courseSchema = courseSchema;
exports.Course = mongoose.model("Course", courseSchema);
