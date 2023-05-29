const { Schema, default: mongoose } = require("mongoose");

const courseScheduleSchema = new Schema({
  departmentName: {
    type: String,
    required: true,
  },
  //the actual course schedule for that year and semester
  schedule: {
    type: [String],
  },
  year: {
    type: Number,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
  },
  //this special cases are in case of carry overs.
  specialCase: { type: {}, default: undefined },
});

exports.CourseSchedule = mongoose.model("CourseSchedule", courseScheduleSchema);
