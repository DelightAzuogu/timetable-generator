const { Schema, default: mongoose } = require("mongoose");

const adminSchema = new Schema({
  _id: Number,
  password: {
    type: String,
    required: true,
  },
});

exports.Admin = mongoose.model("Admin", adminSchema);
