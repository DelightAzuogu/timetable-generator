const { expect, assert } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const { createDummy } = require("../utils/database");
const { Timetable } = require("../model/timetable");
const { Classroom } = require("../model/classroom");

describe("Timetable Controller", function () {
  before(function (done) {
    mongoose
      .set("strictQuery", false)
      .connect("mongodb://127.0.0.1:27017/timetable-generator-test")
      .then(() => {
        createDummy();
        return;
      })
      .then(() => {
        done();
      });
  });

  it("dde", function (done) {
    Classroom.findOne({}).then((s) => {
      done();
    });
  });

  after(function (done) {
    mongoose.connection.dropDatabase(() => {
      console.log("deleted");
      done();
      // createDummy();
    });
  });
});
