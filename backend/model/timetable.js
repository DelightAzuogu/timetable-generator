const { Schema, default: mongoose } = require("mongoose");
const { classroomSchema } = require("./classroom");
const { courseSchema } = require("./course");
const { instructorSchema } = require("./instructor");

const timetableSchema = new Schema(
  {
    classroom: {
      type: classroomSchema,
      required: true,
    },
    time: {
      type: [Number],
      required: true,
    },
    day: {
      type: String,
      enum: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      required: true,
    },
    instructorId: {
      type: Number,
      required: true,
    },
    course: {
      type: courseSchema,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
  },
  {
    virtuals: {
      name: {
        set(v) {
          this.name = this.course._id + this.group;
        },
      },
    },
  }
);

exports.Timetable = mongoose.model("Timetable", timetableSchema);
