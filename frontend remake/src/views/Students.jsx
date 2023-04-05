import React, { useState, useEffect, useRef } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL, inputStyle, URL } from "variables/general";

const Student = (props) => {
  const [departments, setDepartments] = useState([]);
  const [check, setCheck] = useState(false);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [student, setStudent] = useState();

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

    //getting the courses //getting the department
    fetch(`${BASE_URL}/course/`, {
      method: "GET",
    })
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
  }, []);

  useEffect(() => {
    //get students
    fetch(`${BASE_URL}/student/`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          throw res.json();
        }
        return res.json();
      })
      .then((resData) => {
        setStudents(resData.students);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [check]);

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

  const onViewStudentSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/student/${id}`, { method: "GET" });
      const resData = await res.json();
      if (!res.ok) {
        throw await resData;
      }
      setStudent(resData.student);
    } catch (error) {
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  const onAddSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    const firstName = e.target[2].value;
    const lastName = e.target[3].value;
    const deptId = e.target[4].value;
    try {
      const res = await fetch(`${BASE_URL}/student/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ firstName, lastName, id, deptId }),
      });

      if (!res.ok) {
        throw await res.json();
      }
      setCheck(!check);
      notify("success", "Created");
    } catch (error) {
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  const onDeleteSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/student/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!res.ok) {
        throw await res.json();
      }
      setCheck(!check);
      notify("success", "Deleted");
    } catch (error) {
      console.error(error);
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
    }
  };

  const onAddStudentCourseSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    const courseId = e.target[2].value;
    const group = e.target[3].value;
    try {
      const res = await fetch(`${BASE_URL}/student/add-takes/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ courseId, group }),
      });

      if (!res.ok) {
        throw await res.json();
      }
      notify("success", "Course Added to student successfully");
    } catch (error) {
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  const onRemoveStudentCourseSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    const courseId = e.target[2].value;
    const group = e.target[3].value;
    try {
      const res = await fetch(`${BASE_URL}/student/remove-takes/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ courseId, group }),
      });

      if (!res.ok) {
        throw await res.json();
      }
      notify("success", "Course Removed from student successfully");
    } catch (error) {
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  let formBackgroundColour = "#0d0e17";

  return (
    <div className="content">
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      {/* view student timetable  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              `${URL}/student/${e.target[1].value}`,
              "_blank",
              "noreferrer"
            );
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Student Timetable</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an student</option>
                {/* where the map is */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student._id} ${student.name.first} ${student.name.last}`}
                  </option>
                ))}
              </select>
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //view student  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onViewStudentSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Student</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an student</option>
                {/* where the map is */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student._id} ${student.name.first} ${student.name.last}`}
                  </option>
                ))}
              </select>
            </div>
            {student && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                <div
                  style={{
                    margin: "20px",
                  }}
                >
                  {`${student._id} ${student.name.first} ${student.name.last}`}
                  <br />
                  {`${student.department.name}`}
                  <br />
                  Courses taken
                  <ul>
                    {student.takes.map((take) => (
                      <li>
                        {`${take.course._id} ${take.course.name} -- G${take.group}`}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for adding a new student  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onAddSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>ADD</legend>

            {/* //for the id */}
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="id">
                  ID
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="number"
                id="id"
                name="id"
                required
              />
            </div>
            {/* {//for the name} */}
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="firstname">
                  First Name
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="text"
                id="firstname"
                name="firstname"
                required
              />
            </div>
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="lastname">
                  Last Name
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="text"
                id="lastname"
                name="lastname"
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
                value="Add Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for the delete  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onDeleteSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>DELETE</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Student</option>
                {/* where the map is */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student._id} ${student.name.first} ${student.name.last}`}
                  </option>
                ))}
              </select>
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for the adding to student courses */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onAddStudentCourseSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Add Course To Student</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an student</option>
                {/* where the map is */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student._id} ${student.name.first} ${student.name.last}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id} ${course.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Group
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="number"
                id="group"
                name="group"
                required
              />
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for the removing of course from student  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onRemoveStudentCourseSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Remove Course From Student</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an student</option>
                {/* where the map is */}
                {students.map((student) => (
                  <option key={student._id} value={student._id}>
                    {`${student._id} ${student.name.first} ${student.name.last}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id} ${course.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Group
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="number"
                id="group"
                name="group"
                required
              />
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Student"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default Student;
