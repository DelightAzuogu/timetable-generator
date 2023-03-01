const { Schema, default: mongoose } = require("mongoose");

const classroomSchema = new Schema({
  //buuilding the class is in
  building: {
    type: String,
    required: true,
  },
  //the class number == AS "102"
  classNum: {
    type: Number,
    required: true,
  },
  //number of seats in the classroom
  capacity: {
    type: Number,
    required: true,
  },
});

exports.classroomSchema = classroomSchema;
exports.Classroom = mongoose.model("Classroom", classroomSchema);
