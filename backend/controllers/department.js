const { Department } = require("../model/department");

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find();

    res.status(200).json({ departments });
  } catch (error) {
    next(error);
  }
};
