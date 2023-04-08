const { Schema, default: mongoose } = require("mongoose");
const { courseSchema } = require("./course");
const { departmentSchema } = require("./department");

const studentSchema = new Schema({
  _id: Number,
  name: {
    first: { type: String, required: true },
    last: { type: String, required: true },
  },
  department: {
    type: departmentSchema,
    required: true,
  },
  takes: {
    type: [
      {
        course: courseSchema,
        group: Number,
      },
    ],
    default: undefined,
    unique: false,
  },
});

exports.Student = mongoose.model("Student", studentSchema);
