const express = require("express");
require("dotenv").config();
var cors = require("cors");

const database = require("./database.js");
const authRoute = require("./routes/auth");
const timetableRoute = require("./routes/timetable");
const instructorRoute = require("./routes/instructor");
const courseRoute = require("./routes/courses");
const classroomRoute = require("./routes/classroom");
const studentRoute = require("./routes/student");
const departmentRoute = require("./routes/department");
const courseScheduleRoute = require("./routes/courseSchedule");
const newError = require("./utils/error.js");
const { setFalse } = require("./utils/requests.js");

const app = express();

app.use(express.json());
app.use(cors());

// let parse = false;

// app.use((req, res, next) => {
//   if (parse == true) {
//     next(newError("deeddeedde", 400));
//   } else {
//     parse = true;
//     next();
//   }
// });

// app.use(async (req, res, next) => {
//   async function myFunction() {
//     // console.log("Before pause");
//     await new Promise((resolve) => setTimeout(resolve, 10000)); // Pause for 3 seconds
//     // console.log("After pause");
//   }

//   await myFunction();
//   next();
// });

//auth router
app.use("/auth", authRoute);

//timetable router
app.use("/timetable", timetableRoute);

//instructor router
app.use("/instructor", instructorRoute);

//course router
app.use("/course", courseRoute);

//classroom router
app.use("/classroom", classroomRoute);

//student router
app.use("/student", studentRoute);

//department router
app.use("/department", departmentRoute);

//courseSchedile router
app.use("/course-schedule", courseScheduleRoute);

app.use("/", (req, res, next) => {
  res.status(404).json({ msg: "route not found" });
});

//error handling function
app.use((error, req, res, next) => {
  // console.log(error.message);
  // console.log(error);
  const status = error.status || 500;
  error.msg = error.message || "server Error";
  res.status(status).json({ error });
  if (error.message !== "another post request is fired up") {
    setFalse();
  }
});

const PORT = process.env.PORT || 3000;

database(() => {
  app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
  });
});
