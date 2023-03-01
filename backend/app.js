const express = require("express");
require("dotenv").config();

const database = require("./database.js");
const authRoute = require("./routes/auth");
const timetableRoute = require("./routes/timetable");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  // this allows request from any api
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  //this allows the methods that has been listed below
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  //this allows the headers that has been listed bellow
  next();
});

//auth router
app.use("/auth", authRoute);
//timetable router
app.use("/timetable", timetableRoute);

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
