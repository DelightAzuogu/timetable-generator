import React, { useState, useEffect, useRef } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL } from "variables/general";

const AddToTimetable = (props) => {
  //to get the page
  const page = props.location.pathname.split("/")[2][0];

  //initializing the states
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [sameDay, setSameDay] = useState("no");
  const [courseId, setCourseId] = useState(0);
  const [instructorId, setInstructorId] = useState(0);
  const [classroomId, setClassroomId] = useState(0);
  const [studentCount, setStudentCount] = useState(50);
  const [group, setGroup] = useState(1);
  const [startTimes] = useState([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  const [days] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);
  const [startTime, setStartTime] = useState(0);
  const [day, setDay] = useState(0);

  //this is the title of the page something
  let title = "Add Automatically";
  if (page === "m") title = "Add manually";
  useEffect(() => {
    document.title = title;
  }, [title]);

  //for the notification thing
  const notificationAlertRef = useRef(null);
  const notify = (type, message) => {
    let options = {
      place: "tr",
      message: <div>{message}</div>,
      icon: type === "info" ? "icon-alert-circle-exc" : "icon-check-2",
      type: type,
      autoDismiss: 3,
    };
    notificationAlertRef.current.notificationAlert(options);
  };

  //this acts like component did mount
  useEffect(() => {
    //get the courses, classrooms, instructors
    fetch(`${BASE_URL}/timetable/add`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        //set the states from this call
        setInstructors(resData.instructors);
        setCourses(resData.courses);
        setClassrooms(resData.classrooms);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  //this handles the api call
  const onSubmitCall = async (url, body) => {
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authentication: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        if (resData.msg === "success") {
          notify("success", "Timetable created successfully");
        }
      })
      .catch(({ error }) => {
        notify("danger", error.msg);
        console.error(error);
      });
  };

  //for the submit button
  const onSubmit = async (e) => {
    e.preventDefault();

    // check for errors
    if (instructorId <= 0) {
      notify("info", "Select an Instructor");
    } else if (courseId <= 0) {
      notify("info", "Select a Course");
    } else if (group <= 0) {
      notify("info", "Give the course a group");
    } else if (studentCount <= 0) {
      notify("info", "Increase the student count");
    } else if (page === "a") {
      if (sameDay === "yes" || sameDay === "no") {
        // check for sameday
        if (sameDay === "no") {
          //make the call to backend
          await onSubmitCall(`${BASE_URL}/timetable/add`, {
            instructorId,
            courseId,
            studentCount,
            group,
          });
        } else {
          //make the api call
          await onSubmitCall(`${BASE_URL}/timetable/add-same-day`, {
            instructorId,
            courseId,
            studentCount,
            group,
          });
        }
      } else {
        notify("info", "Check same day classes");
      }
    } else if (page === "m") {
      if (classroomId <= 0) {
        notify("info", "Select a classroom");
      } else if (!startTimes.includes(parseInt(startTime))) {
        notify("info", "Select a start time");
      } else if (!days.includes(day)) {
        notify("info", "Select a Day");
      } else {
        await onSubmitCall(`${BASE_URL}/timetable/add-manually`, {
          day,
          group,
          startTime,
          classroomId,
          instructorId,
          courseId,
        });
      }
    }
  };

  return (
    <>
      <div className="content">
        {/* for the pop up  */}
        <div className="react-notification-alert-container">
          <NotificationAlert ref={notificationAlertRef} />
        </div>
        {/* the instructor dropMenu */}
        <form
          className=" d-block justify-content-center"
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          {/* //for the instructor */}
          <div className="form-group m-form">
            <select
              role="menu"
              id="instructor"
              className="custom-select form-control from-select"
              onChange={async (e) => {
                await setInstructorId(e.target.value);
              }}
            >
              <option value={0}>Choose an instructor</option>
              {/* where the map is */}
              {instructors.map((instructor) => (
                <option key={instructor._id} value={instructor._id}>
                  {`${instructor._id} ${instructor.name}`}
                </option>
              ))}
            </select>
          </div>
          {/* the courses dropMenu */}
          <div className="form-group m-form">
            <select
              id="courses"
              className="form-select form-control custom-select"
              onChange={async (e) => {
                await setCourseId(e.target.value);
              }}
            >
              {/* where the map is */}
              <option value={0}>Choose a Course</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {`${course._id} ${course.name}`}
                </option>
              ))}
            </select>
          </div>
          {/* for the classroom */}
          {page === "m" && (
            <div>
              {/* this is the classroom  */}
              <div className="form-group m-form">
                <select
                  id="classroom"
                  className="form-select form-control custom-select"
                  onChange={async (e) => {
                    await setClassroomId(e.target.value);
                  }}
                >
                  {/* where the map is */}
                  <option value={0}>Choose a Classroom</option>
                  {classrooms.map((classroom) => (
                    <option key={classroom._id} value={classroom._id}>
                      {`${classroom.building} ${classroom.classNum}`}
                    </option>
                  ))}
                </select>
              </div>
              {/* this is the start time */}
              <div className="form-group m-form">
                <select
                  id="startTime"
                  className="form-select form-control custom-select"
                  onChange={async (e) => {
                    await setStartTime(e.target.value);
                  }}
                >
                  {/* where the map is */}
                  <option value={0}>Choose a Start Time</option>
                  {startTimes.map((startTime) => (
                    <option key={startTime} value={startTime}>
                      {`${startTime}`}
                    </option>
                  ))}
                </select>
              </div>
              {/* //this is the day */}
              <div className="form-group m-form">
                <select
                  id="day"
                  className="form-select form-control custom-select"
                  onChange={async (e) => {
                    await setDay(e.target.value);
                  }}
                >
                  {/* where the map is */}
                  <option value={0}>Choose a Day</option>
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {`${day}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* group number */}
          <div className="input-group m-form">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="group">
                Group Number
              </label>
            </div>

            <input
              className="form-control"
              style={{
                width: "100px",
                height: "42px",
              }}
              type="number"
              id="group"
              name="group"
              value={group}
              onChange={async (e) => await setGroup(e.target.value)}
              required
            />
          </div>
          {/* same day teaching? */}
          {page === "a" && (
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <span className="input-group-text">Same Day Classes?</span>
              </div>

              <div
                className="form-control custom-control custom-radio custom-control-inline"
                style={{ height: "42px" }}
              >
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    type="radio"
                    id="customRadioInline1"
                    name="customRadioInline1"
                    className="custom-control-input"
                    value={"yes"}
                    onChange={async (e) => await setSameDay(e.target.value)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadioInline1"
                  >
                    Yes
                  </label>
                </div>
                <div className="custom-control custom-radio custom-control-inline">
                  <input
                    defaultChecked
                    type="radio"
                    id="customRadioInline2"
                    name="customRadioInline1"
                    className="custom-control-input"
                    value={"no"}
                    onChange={async (e) => await setSameDay(e.target.value)}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadioInline2"
                  >
                    No
                  </label>
                </div>
              </div>
            </div>
          )}
          {/* for the number of student expected to be in the className */}
          <div className="input-group m-form">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="group">
                Number of Student?
              </label>
            </div>

            <input
              className="form-control"
              id="studentCount"
              type="number"
              name="studentCount"
              value={studentCount}
              onChange={async (e) => await setStudentCount(e.target.value)}
              required
              style={{ height: "42px" }}
            />
          </div>
          {/* //submit button */}
          <div className="text-center m-form">
            <input
              type="submit"
              value="Add To Timetable"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      </div>
    </>
  );
};
export default AddToTimetable;
