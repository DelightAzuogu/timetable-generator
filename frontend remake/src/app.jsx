import React, { useState, useEffect } from "react";
import Login from "views/login";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin/Admin.js";
import InstructorTable from "views/instructorTable";

const App = (props) => {
  const [isAuth, setIsAuth] = useState(true);
  const [status, setStatus] = useState("admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
    } else setIsAuth(false);
  }, []);

  // for the login
  const loginHandler = async (e) => {
    try {
      e.preventDefault();

      const id = e.target[0].value;
      const password = e.target[1].value;

      // requesting to login from the database
      const res = await fetch("http://localhost:4000/auth/login?status=admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      // converting the response to usable object
      if (res.ok) {
        var resData = await res.json();
      } else {
        throw await res.json();
      }

      //store the token in local storage
      localStorage.setItem("token", resData.token);

      setIsAuth(true);
    } catch (err) {
      setIsAuth(false);
      console.log(err);
    }
  };

  //logOut hangler
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  //the routes if there is login
  if (isAuth) {
    return (
      <Switch>
        <Route
          path="/admin"
          render={(props) => <AdminLayout {...props} logout={logoutHandler} />}
        />
        <Route
          path="/instructor/:id"
          render={(props) => <InstructorTable {...props} />}
        />
        <Redirect from="/" to="/admin/automatically-add-to-timetable" />
      </Switch>
    );
  } else {
    return (
      <Switch>
        <Route
          path="/login"
          render={(props) => <Login onSubmit={loginHandler} />}
        />
        <Redirect from="/" to="/login" />{" "}
      </Switch>
    );
  }
};

export default App;
