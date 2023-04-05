const { Schema, default: mongoose } = require("mongoose");

const courseScheduleSchema = new Schema({
  departmentName: {
    type: String,
    required: true,
  },
  schedule: { type: [[String]] },
});

exports.CourseSchedule = mongoose.model("CourseSchedule", courseScheduleSchema);
