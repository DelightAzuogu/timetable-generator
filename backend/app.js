const express = require("express");
require("dotenv").config();
var cors = require('cors')


const database = require("./database.js");
const authRoute = require("./routes/auth");
const timetableRoute = require("./routes/timetable");
const instructorRoute = require("./routes/instructor")
const courseRoute = require("./routes/courses");
const classroomRoute = require("./routes/classroom");
const studentRoute = require("./routes/student");

const app = express();

app.use(express.json());
app.use(cors())


//auth router
app.use("/auth", authRoute);

//timetable router
app.use("/timetable", timetableRoute);

//instructor router
app.use("/instructor", instructorRoute)

//course router
app.use("/course", courseRoute)

//classroom router
app.use('/classroom', classroomRoute);

//student router
app.use("/student", studentRoute);

app.use('/', (req, res, next) => {
  res.status(404).json({ msg: "route not found" })
})

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
