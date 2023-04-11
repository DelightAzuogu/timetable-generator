const { Department } = require("../model/department");
const newError = require("./error");

exports.checkDepartment = async (name) => {
  try {
    name = name.toLowerCase();
    const dept = await Department.findOne({ name });
    if (!dept) {
      throw newError("invalid Department", 400);
    }
    return dept;
  } catch (error) {
    throw error;
  }
};
