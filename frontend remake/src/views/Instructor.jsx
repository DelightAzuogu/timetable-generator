import React, { useState, useEffect, useRef } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL, inputStyle, URL } from "variables/general";

const AddInstructor = (props) => {
  const [instructors, setInstructors] = useState([]);
  const [addCheck, setAddCheck] = useState(false);
  const [deleteTimetables, setDeleteTimetables] = useState();
  const [instructor, setInstructor] = useState();
  const [instructorTimetable, setInstructorTimetable] = useState();

  useEffect(() => {
    fetch(`${BASE_URL}/instructor/`, { method: "GET" })
      .then(async (res) => {
        if (!res.ok) throw await res.json();
        return res.json();
      })
      .then((resData) => {
        setInstructors(resData.instructors);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [addCheck]);

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

  const onViewInstructorSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/instructor/${id}`, {
        method: "GET",
      });
      const resData = await res.json();
      if (!res.ok) {
        throw await resData;
      }
      setInstructorTimetable(resData.timetable);
      setInstructor(resData.instructor);
    } catch (error) {
      console.error(error);
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
    }
  };

  //when it submits
  const onAddSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    const name = e.target[2].value;
    const password = e.target[3].value;

    try {
      const res = await fetch(`${BASE_URL}/instructor/add`, {
        method: "POST",
        body: JSON.stringify({ id, name, password }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setAddCheck(true);
      notify("success", "Added Successfully");
    } catch (error) {
      let msg = error.msg || error.error.msg || "error";
      notify("danger", msg);
      console.error(error);
    }
  };

  //for deleteing
  const onDeleteSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;

    try {
      const res = await fetch(`${BASE_URL}/instructor/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setAddCheck(true);
      notify("success", "DELETED Successfully");
      setDeleteTimetables(resData.timetables);
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

      {/* //for viewing instructor timetable  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              `${URL}/instructor/${e.target[1].value}`,
              "_blank",
              "noreferrer"
            );
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Instructor Timetable</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Instructor</option>
                {/* where the map is */}
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {`${instructor._id} ${instructor.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-center m-form">
              <input
                type="submit"
                value="View Instructor Timetable"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* for view the instructor */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center  border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onViewInstructorSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Instructor</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Instructor</option>
                {/* where the map is */}
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {`${instructor._id} ${instructor.name}`}
                  </option>
                ))}
              </select>
            </div>

            {instructor && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                {`${instructor._id} ${instructor.name}`}
                <br />
                Courses Taken
                <ul>
                  {instructorTimetable.map((time) => (
                    <li key={time._id}>
                      {`${time.day} -- ${time.time[0]}:00 - ${
                        time.time[time.time.length - 1]
                      }:00 -- ${time.classroom.building}${
                        time.classroom.classNum
                      }`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="text-center m-form">
              <input
                type="submit"
                value="View Instructor"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* for the add of new instructor */}
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
                <label className="input-group-text" htmlFor="name">
                  Name
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="text"
                id="name"
                name="name"
                required
              />
            </div>
            {/* for the password */}
            <div className="input-group m-form">
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="password">
                  Password
                </label>
              </div>

              <input
                style={inputStyle}
                className="form-control"
                type="text"
                id="password"
                name="password"
                required
              />
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Add Instructor"
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
                <option value={0}>Choose an Instructor</option>
                {/* where the map is */}
                {instructors.map((instructor) => (
                  <option key={instructor._id} value={instructor._id}>
                    {`${instructor._id} ${instructor.name}`}
                  </option>
                ))}
              </select>
            </div>

            {deleteTimetables && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                Timetable Of Deleted Instructor
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
            )}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Delete Instructor"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default AddInstructor;
