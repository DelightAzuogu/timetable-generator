import React, { useEffect, useRef, useState } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL, inputStyle, URL } from "variables/general";

const Course = (props) => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [deleteTimetables, setDeleteTimetables] = useState();
  const [deleteStudents, setDeleteStudents] = useState();
  const [deleteCourse, setDeleteCourse] = useState("");
  const [check, setCheck] = useState(false);
  const [course, setCourse] = useState();
  const [status] = useState(localStorage.getItem("status"));

  useEffect(() => {
    //getting the department
    fetch(`${BASE_URL}/department/`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw res.json();
        }
        return res.json();
      })
      .then((resData) => {
        setDepartments(resData.departments);
      })
      .catch((error) => {
        console.error(error);
      });

    //getting the courses
    fetch(`${BASE_URL}/course/`, { method: "GET" })
      .then((res) => {
        if (!res.ok) {
          throw res.json();
        }
        return res.json();
      })
      .then((resData) => {
        setCourses(resData.courses);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [deleteCourse, check]);

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

  const onAddSubmit = async (e) => {
    e.preventDefault();
    const courseCode = e.target[1].value;
    const classHour = e.target[2].value;
    const courseName = e.target[3].value;
    const dept = e.target[4].value;

    try {
      const res = await fetch(`${BASE_URL}/course/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          courseCode,
          classHour,
          name: courseName,
          departmentId: dept,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setCheck(!check);
      notify("success", "created");
    } catch (error) {
      console.log(error);
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  const onViewCourse = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/course/${id}`, {
        method: "GET",
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setCourse(resData.course);
    } catch (error) {
      console.log(error);
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
    }
  };

  const onDeleteSubmit = async (e) => {
    try {
      e.preventDefault();
      const courseId = e.target[1].value;

      const res = await fetch(`${BASE_URL}/course/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setDeleteStudents(resData.students);
      setDeleteTimetables(resData.timetables);
      setDeleteCourse(resData.course.name);
      notify("success", "Deleted");
    } catch (error) {
      console.log(error);
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
    }
  };

  const onAddTakenSubmit = (e) => {
    e.preventDefault();
    const courseId = e.target[1].value;
    const dept = e.target[2].value;

    fetch(`${BASE_URL}/course/add-takenby/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ dept }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        notify("success", "Added");
      })
      .catch((error) => {
        console.log(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  const onRemoveTakenSubmit = (e) => {
    e.preventDefault();
    const courseId = e.target[1].value;
    const dept = e.target[2].value;

    fetch(`${BASE_URL}/course/remove-takenby/${courseId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ dept }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        notify("success", "Removed");
      })
      .catch((error) => {
        console.log(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
        console.error(error);
      });
  };

  let formBackgroundColour = "#0d0e17";

  // console.log(localStorage.getItem("status"));

  return (
    <div className="content">
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      {/* //view course timetable  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              `${URL}/course/${e.target[1].value}`,
              "_blank",
              "noreferrer"
            );
          }}
        >
          {/* for the <course /> */}
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Course Timetable </legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id}  ${course.name} `}
                  </option>
                ))}
              </select>
            </div>

            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="View Course Timetable"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //viewing the course  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onViewCourse(e);
          }}
        >
          {/* for the <course /> */}
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Course</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id}  ${course.name} `}
                  </option>
                ))}
              </select>
            </div>
            {course && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                <div style={{ margin: "20px" }}>
                  {`${course._id} ${course.name}`}
                  <br />
                  {`${course.department.name}`}
                  <br />
                  Taken By
                  <ul>
                    {course.takenBy.map((take) => (
                      <li key={take}>{`${take}`}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Add Course"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {status === "admin" && (
        <div>
          {/* for add */}
          <div style={{ paddingBottom: "20px" }}>
            <form
              className=" d-block justify-content-center border border-3 rounded"
              style={{ backgroundColor: formBackgroundColour }}
              onSubmit={(e) => {
                onAddSubmit(e);
              }}
            >
              <fieldset className="" style={{ margin: "20px" }}>
                <legend>ADD</legend>
                {/* //for the courseid */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="courseCode">
                      Course Code
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="text"
                    id="courseCode"
                    name="courseCode"
                    required
                  />
                </div>
                {/* //for the classHour */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="ClassHour">
                      Course Hour
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="number"
                    id="ClassHour"
                    name="ClassHour"
                    required
                  />
                </div>
                {/* //for the name */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="courseName">
                      Course name
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="text"
                    id="courseName"
                    name="courseName"
                    required
                  />
                </div>
                {/* for the <departments /> */}
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Department</option>
                    {/* where the map is */}
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {`${dept.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Add Course"
                    className="btn btn-dark btn-lg"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          {/* //for the delete */}
          <div style={{ paddingBottom: "20px" }}>
            <form
              className=" d-block justify-content-center border border-3 rounded"
              style={{ backgroundColor: formBackgroundColour }}
              onSubmit={(e) => {
                onDeleteSubmit(e);
              }}
            >
              {/* for the <course /> */}
              <fieldset className="" style={{ margin: "20px" }}>
                <legend>DELETE</legend>
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Course</option>
                    {/* where the map is */}
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {`${course._id}  ${course.name} `}
                      </option>
                    ))}
                  </select>
                </div>
                {/* this is to show the timetable and student of the deleted course  */}
                {deleteTimetables && (
                  <div className="container " style={{ paddingTop: "20px" }}>
                    <div className="row">
                      <div
                        className="col-sm  border border-3 rounded"
                        style={{
                          color: "white",
                          margin: "20px",
                        }}
                      >
                        Timetable of
                        {` ${deleteCourse}`}
                        <ul>
                          {deleteTimetables.map((time) => (
                            <li key={time._id}>
                              {`${time.day} -- ${time.time[0]} - ${
                                time.time[time.time.length - 1]
                              } -- ${time.classroom.building}${
                                time.classroom.classNum
                              }`}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div
                        className="col-sm  border border-3 rounded"
                        style={{
                          color: "white",
                          margin: "20px",
                        }}
                      >
                        Students that took {` ${deleteCourse}`}
                        <ul>
                          {deleteStudents.map((student) => (
                            <li key={student._id}>
                              {`${student.name.first} ${student.name.last} -- ${student._id}`}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Delete Course"
                    className="btn btn-dark btn-lg"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          {/* //adding department to the course  */}
          <div style={{ paddingBottom: "20px" }}>
            <form
              className=" d-block justify-content-center border border-3 rounded"
              style={{ backgroundColor: formBackgroundColour }}
              onSubmit={(e) => {
                onAddTakenSubmit(e);
              }}
            >
              {/* for the <course /> */}
              <fieldset className="" style={{ margin: "20px" }}>
                <legend>Add A Department To The Course</legend>
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Course</option>
                    {/* where the map is */}
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {`${course._id}  ${course.name} `}
                      </option>
                    ))}
                  </select>
                </div>
                {/* for the <departments not in course /> */}
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Department</option>
                    {/* where the map is */}
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {`${dept.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Add To Course"
                    className="btn btn-dark btn-lg"
                  />
                </div>
              </fieldset>
            </form>
          </div>
          {/* //removeing department from a course */}
          <div style={{ paddingBottom: "20px" }}>
            <form
              className=" d-block justify-content-center border border-3 rounded"
              style={{ backgroundColor: formBackgroundColour }}
              onSubmit={(e) => {
                onRemoveTakenSubmit(e);
              }}
            >
              <fieldset className="" style={{ margin: "20px" }}>
                <legend>Remove A Department From The Course</legend>
                {/* for the <course /> */}
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Course</option>
                    {/* where the map is */}
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {`${course._id}  ${course.name} `}
                      </option>
                    ))}
                  </select>
                </div>
                {/* for the <departments not in course /> */}
                <div className="form-group m-form">
                  <select
                    role="menu"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Department</option>
                    {/* where the map is */}
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept.name}>
                        {`${dept.name}`}
                      </option>
                    ))}
                  </select>
                </div>
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Remove From Course"
                    className="btn btn-dark btn-lg"
                  />
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Course;
