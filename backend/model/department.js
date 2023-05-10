const { Schema, default: mongoose } = require("mongoose");

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  faculty: {
    type: String,
    required: true
  },
})

exports.departmentSchema = departmentSchema;
exports.Department = mongoose.model("Department", departmentSchema);