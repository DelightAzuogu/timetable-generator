import React, { useState, useEffect } from "react";
import { BASE_URL, URL } from "variables/general";

const View = (props) => {
  const [classrooms, setClassrooms] = useState([]);
  const [courses, setCourses] = useState([]);

  //to get the page that the admin is finding
  const page = props.location.pathname.split("/")[2];

  useEffect(() => {
    //function to get the classrooms
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

    //function to get the courses
    const getCourses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/course`, {
          method: "GET",
        });

        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }
        setCourses(resData.courses);
      } catch (error) {
        console.error(error);
      }
    };

    //to call the right function
    if (page === "classroom") {
      getClassrooms();
    } else if (page === "course") {
      getCourses();
    }
  }, [page]);

  //for when we are in the instructor side
  if (page === "instructor") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `${URL}/instructor/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            {/* for the id/ */}
            <div className="input-group mb-3" style={{ marginTop: "30px" }}>
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Instructor Id
                </label>
              </div>

              <input
                className="form-control"
                style={{
                  width: "100px",
                  height: "42px",
                }}
                type="number"
                id="number"
                name="number"
                required
              />
            </div>
            <div className="text-center m-form">
              <input
                type="submit"
                value="VIEW"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  }
  //for when we are in the classroom side
  else if (page === "classroom") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `${URL}/classroom/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            <div className="form-group m-form">
              <select
                id="classroom"
                className="form-select form-control custom-select"
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
            <div className="text-center m-form">
              <input
                type="submit"
                value="VIEW"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  }
  //for the courses
  else if (page === "course") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `${URL}/course/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            <div className="form-group m-form">
              <select
                id="courses"
                className="form-select form-control custom-select"
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
            <div className="text-center m-form">
              <input
                type="submit"
                value="VIEW"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  } else if (page === "student") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `${URL}/student/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            {/* for the id/ */}
            <div className="input-group mb-3" style={{ marginTop: "30px" }}>
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Student Id
                </label>
              </div>

              <input
                className="form-control"
                style={{
                  width: "100px",
                  height: "42px",
                }}
                type="number"
                id="number"
                name="number"
                required
              />
            </div>
            <div className="text-center m-form">
              <input
                type="submit"
                value="VIEW"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  }
};

export default View;
