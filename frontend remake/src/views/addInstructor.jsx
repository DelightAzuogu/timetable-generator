import React, { useState, useEffect, useRef } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL, inputStyle } from "variables/general";

const AddInstructor = (props) => {
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

  //when it submits
  const onSubmit = async (e) => {
    e.preventDefault();
    const id = e.target[0].value;
    const name = e.target[1].value;
    const password = e.target[2].value;

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
      notify("success", resData.msg);
    } catch (error) {
      // notify("success", error.msg);
      console.error(error);
    }
  };

  return (
    <div className="content">
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>
      <form
        className=" d-block justify-content-center"
        onSubmit={(e) => {
          onSubmit(e);
        }}
      >
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
      </form>
    </div>
  );
};

export default AddInstructor;
