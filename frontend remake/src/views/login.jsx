import React from "react";

const Login = (props) => {
  return (
    //is the login form
    <form
      onSubmit={(e) => {
        props.onSubmit(e);
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
      <div className="text-center m-form">
        <input type="submit" value="LOGIN" className="btn btn-dark btn-lg" />
      </div>
    </form>
  );
};

export default Login;
