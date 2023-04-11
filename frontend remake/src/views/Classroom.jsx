import React, { useRef, useState } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL, inputStyle, URL } from "variables/general";

const Classroom = (props) => {
  const [classrooms, setClassrooms] = useState([]);
  const [classroom, setClassroom] = useState();
  const [status] = useState(localStorage.getItem("status"));

  const getClassrooms = async () => {
    try {
      const res = await fetch(`${BASE_URL}/classroom/`, {
        method: "GET",
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setClassrooms(resData.classrooms);
    } catch (error) {
      console.error(error);
    }
  };
  getClassrooms();

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

  const onViewClassroom = async (e) => {
    e.preventDefault();
    const id = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/classroom/${id}`, {
        method: "GET",
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      setClassroom(resData.classroom);
    } catch (error) {
      let msg = error.msg || error.error.msg;
      notify("danger", msg);
      console.error(error);
    }
  };

  //when it submits
  const onAddSubmit = async (e) => {
    e.preventDefault();
    const building = e.target[1].value;
    const classNumber = e.target[2].value;
    const capacity = e.target[3].value;

    try {
      const res = await fetch(`${BASE_URL}/classroom/add`, {
        method: "POST",
        body: JSON.stringify({ building, classNumber, capacity }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }
      notify("success", resData.msg);
      await getClassrooms();
    } catch (error) {
      let msg = error.msg || error.error.msg;
      notify("danger", msg);
      console.error(error);
    }
  };

  const onDeleteSubmit = async (e) => {
    e.preventDefault();
    const classroomId = e.target[1].value;
    try {
      const res = await fetch(`${BASE_URL}/classroom/${classroomId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.ok) {
        notify("success", "Deleted");
      } else {
        throw res.json();
      }
      await getClassrooms();
    } catch (error) {
      console.error(error);
      let msg = error.msg || error.error.msg;
      notify("danger", msg);
    }
  };
  let formBackgroundColour = "#0d0e17";

  return (
    <div className="content">
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      {/* viewing timetable  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(
              `${URL}/classroom/${e.target[1].value}`,
              "_blank",
              "noreferrer"
            );
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Classroom Timetable</legend>
            <div className="form-group m-form">
              <select
                role="menu"
                id="instructor"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Classroom</option>
                {/* where the map is */}
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {`${classroom.building} ${classroom.classNum}`}
                  </option>
                ))}
              </select>
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="View Classrrom Timetable"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for viewing the classrom  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onViewClassroom(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Classroom </legend>
            <div className="form-group m-form">
              <select
                role="menu"
                id="instructor"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose an Classroom</option>
                {/* where the map is */}
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {`${classroom.building} ${classroom.classNum}`}
                  </option>
                ))}
              </select>
            </div>
            {classroom && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                <div style={{ margin: "20px" }}>
                  {`${classroom.building}${classroom.classNum} `}
                  <br />
                  {`Capacity: ${classroom.capacity}`}
                </div>
              </div>
            )}
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="View Classrrom"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {status === "admin" && (
        <div>
          {/* //for the add */}
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
                {/* //for the id */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="building">
                      Building
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="text"
                    id="building"
                    name="building"
                    required
                  />
                </div>
                {/* {//for the name} */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="classNum">
                      Class Number
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="number"
                    id="classNum"
                    name="classNum"
                    required
                  />
                </div>
                {/* for the password */}
                <div className="input-group m-form">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="capacity">
                      Capacity
                    </label>
                  </div>

                  <input
                    style={inputStyle}
                    className="form-control"
                    type="number"
                    id="capacity"
                    name="capacity"
                    required
                  />
                </div>
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Add Classroom"
                    className="btn btn-dark btn-lg"
                  />
                </div>
              </fieldset>
            </form>
          </div>

          {/* for the delete */}
          <div style={{ paddingBottom: "20px" }}>
            <form
              className=" d-block justify-content-center border border-3 rounded"
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
                    id="instructor"
                    className="custom-select form-control from-select"
                  >
                    <option value={0}>Choose an Classroom</option>
                    {/* where the map is */}
                    {classrooms.map((classroom) => (
                      <option key={classroom._id} value={classroom._id}>
                        {`${classroom.building} ${classroom.classNum}`}
                      </option>
                    ))}
                  </select>
                </div>
                {/* //submit button */}
                <div className="text-center m-form">
                  <input
                    type="submit"
                    value="Delete Classrrom"
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

export default Classroom;
