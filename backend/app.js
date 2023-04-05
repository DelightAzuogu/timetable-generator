const express = require("express");
require("dotenv").config();
var cors = require("cors");
//this is for the queue, to manage the requests that come in
var expressQueue = require("express-queue");

const database = require("./database.js");
const authRoute = require("./routes/auth");
const timetableRoute = require("./routes/timetable");
const instructorRoute = require("./routes/instructor");
const courseRoute = require("./routes/courses");
const classroomRoute = require("./routes/classroom");
const studentRoute = require("./routes/student");
const departmentRoute = require("./routes/department");
const courseScheduleRoute = require("./routes/courseSchedule");

const app = express();

app.use(express.json());
app.use(cors());

//activeLimit set the ammount of simultaneous request that can be proccessed
//queueLimit set the amount of requests that can be in the queue (-1 means there is no limit)
// const queue = expressQueue({ activeLimit: 1, queuedLimit: -1 });
// app.use(queue);

// const q = [];
// app.use((req, res, next) => {
//   // console.log(queue);
//   q.push(queue.queue._generateId());
//   console.log(q);
//   console.log(queue);
//   req.socket.on("close", function () {
//     // code to handle connection abort
//     console.log("user cancelled");
//     queue.queue._cancelJob(q[0]);
//   });
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
app.use("/course-schdeule", courseScheduleRoute);

app.use("/", (req, res, next) => {
  res.status(404).json({ msg: "route not found" });
});

//error handling function
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.status || 500;
  error.msg = error.message || "server Error";
  res.status(status).json({ error });
});

const PORT = process.env.PORT || 3000;

database(() => {
  app.listen(PORT, async () => {
    console.log(`Server started on port ${PORT}`);
  });
});
