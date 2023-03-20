import React, { useState, useEffect } from "react";
import Login from "views/login";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin/Admin.js";
import Timetable from "views/timetable";
import CourseTimetableCompareTimetable from "views/CourseTimetableComapreTimetable";
import Instructor from "layouts/instructor/Instructor";
import StudentsTimetableCompareTimetable from "views/studentsTimetableCompareTimetable";

const App = (props) => {
  const [isAuth, setIsAuth] = useState("false");
  const [status, setStatus] = useState("");
  const [id, setId] = useState("0");

  // document.body.classList.remove("white-content");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuth(true);
      const status = localStorage.getItem("status");
      const id = localStorage.getItem("id");
      if (id && status) {
        setId(id);
        setStatus(status);
      }
    } else setIsAuth(false);
  }, []);

  //logOut hangler
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setIsAuth(false);
  };

  //the routes if there is login
  if (isAuth) {
    if (status === "admin") {
      return (
        <Switch>
          <Route
            path="/admin"
            render={(props) => (
              <AdminLayout {...props} logout={logoutHandler} />
            )}
          />
          <Route
            path="/instructor/:id"
            render={(props) => <Timetable {...props} />}
          />
          <Route
            path="/classroom/:id"
            render={(props) => <Timetable {...props} />}
          />
          <Route
            path="/course/:id"
            render={(props) => <Timetable {...props} />}
          />
          <Route
            path="/student/:id"
            render={(props) => <Timetable {...props} />}
          />
          <Route
            path="/compare-timetable/:course/"
            render={(props) => <CourseTimetableCompareTimetable {...props} />}
          />
          <Route
            path="/compare-student-timetable"
            render={(props) => <StudentsTimetableCompareTimetable {...props} />}
          />
          <Redirect from="/" to="/admin/automatically-add-to-timetable" />
        </Switch>
      );
    } else if (status === "instructor") {
      return (
        <Switch>
          <Route
            path={`/instructor/${id}`}
            render={(props) => <Timetable {...props} logout={logoutHandler} />}
          />
          <Route
            path="/instructor"
            render={(props) => <Instructor {...props} logout={logoutHandler} />}
          />
          <Route
            path="/classroom/:id"
            render={(props) => <Timetable {...props} logout={logoutHandler} />}
          />
          <Route
            path="/course/:id"
            render={(props) => <Timetable {...props} logout={logoutHandler} />}
          />
          <Route
            path="/student/:id"
            render={(props) => <Timetable {...props} logout={logoutHandler} />}
          />
          <Route
            path="/compare-timetable/:course/"
            render={(props) => <CourseTimetableCompareTimetable {...props} />}
          />
          <Route
            path="/compare-student-timetable"
            render={(props) => <StudentsTimetableCompareTimetable {...props} />}
          />
          <Redirect
            from="/"
            to="/instructor/course-student-timetable-compare"
          />
        </Switch>
      );
    }
  } else {
    return (
      <Switch>
        <Route
          path="/login"
          render={(props) => (
            <Login
              // onSubmit={loginHandler}
              setStatus={setStatus}
              setIsAuth={setIsAuth}
              setId={setId}
            />
          )}
        />
        <Redirect from="/" to="/login" />{" "}
      </Switch>
    );
  }
};

export default App;
