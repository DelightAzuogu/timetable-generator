import React, { useRef } from "react";
import NotificationAlert from "react-notification-alert";
import { BASE_URL } from "variables/general";

const Login = (props) => {
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

  // for the login
  const loginHandler = async (e) => {
    try {
      e.preventDefault();

      const id = e.target[0].value;
      const password = e.target[1].value;
      let status;
      if (e.target[2].checked) {
        localStorage.setItem("status", "admin");
        status = "admin";
        props.setStatus("admin");
      } else if (e.target[3].checked) {
        localStorage.setItem("status", "instructor");
        status = "instructor";
        props.setStatus("instructor");
      }

      // requesting to login from the database
      const url = `${BASE_URL}/auth/login?status=${status}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      // converting the response to usable object
      const resData = await res.json();
      if (!res.ok) {
        throw resData;
      }

      // store the token in local storage
      localStorage.setItem("token", resData.token);
      props.setIsAuth(true);

      //to set the id
      localStorage.setItem("id", id);
      props.setId(id);
    } catch (err) {
      notify("danger", err.error.msg);
      props.setIsAuth(false);
      console.error(err);
    }
  };

  return (
    //is the login form
    <div
      className="h-100 d-flex align-items-center justify-content-center"
      style={{ marginTop: "10%" }}
    >
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <form
        onSubmit={(e) => {
          loginHandler(e);
        }}
      >
        {/* for the id/ */}
        <div className="input-group mb-3" style={{ marginTop: "30px" }}>
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="group">
              ID
            </label>
          </div>

          <input
            className="form-control"
            style={{
              width: "100px",
              height: "42px",
            }}
            type="id"
            id="id"
            name="id"
            required
          />
        </div>
        {/* (//for the password) */}
        <div className="input-group m-form">
          <div className="input-group-prepend">
            <label className="input-group-text" htmlFor="group">
              Password
            </label>
          </div>

          <input
            className="form-control"
            style={{
              width: "100px",
              height: "42px",
            }}
            type="password"
            id="password"
            name="password"
            required
          />
        </div>
        {/* this should be for the check list for either the admin or an instructor */}
        <div className="input-group m-form">
          <div
            className="form-control custom-control custom-radio custom-control-inline"
            style={{ height: "42px" }}
          >
            <div className="custom-control custom-radio custom-control-inline">
              <input
                defaultChecked
                type="radio"
                id="customRadioInline1"
                name="customRadioInline1"
                className="custom-control-input"
                value={"admin"}
                onChange={(e) => {
                  localStorage.setItem("status", "admin");
                  props.setStatus("admin");
                }}
              />
              <label
                className="custom-control-label"
                htmlFor="customRadioInline1"
              >
                Admin
              </label>
            </div>
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="customRadioInline2"
                name="customRadioInline1"
                className="custom-control-input"
                value={"instructor"}
                onChange={(e) => {
                  localStorage.setItem("status", "instructor");
                  props.setStatus("instructor");
                }}
              />
              <label
                className="custom-control-label"
                htmlFor="customRadioInline2"
              >
                Instructor
              </label>
            </div>
          </div>
        </div>
        <div className="text-center m-form">
          <input type="submit" value="LOGIN" className="btn btn-dark btn-lg" />
        </div>
      </form>
    </div>
  );
};

export default Login;
