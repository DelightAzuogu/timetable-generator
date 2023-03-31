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
  takes: [
    {
      course: { type: courseSchema, required: true },
      group: { type: Number, required: true },
    },
  ],
});

exports.Student = mongoose.model("Student", studentSchema);
