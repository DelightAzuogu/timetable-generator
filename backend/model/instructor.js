const { Schema, default: mongoose } = require("mongoose");
const { courseSchema } = require("./course");

const instructorSchema = new Schema({
  _id: Number,
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  teaches: {
    type: [{ course: courseSchema, group: Number }],
    required: false,
  },
});

exports.instructorSchema = instructorSchema;
exports.Instructor = mongoose.model("Instructor", instructorSchema);
