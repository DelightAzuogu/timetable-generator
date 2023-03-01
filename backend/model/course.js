const { Schema, default: mongoose } = require("mongoose");

const courseSchema = new Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  classHour: {
    type: Number,
    required: true,
  },
});

exports.courseSchema = courseSchema;
exports.Course = mongoose.model("Course", courseSchema);
