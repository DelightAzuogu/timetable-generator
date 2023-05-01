import React, { useEffect, useRef, useState } from "react";
import NotificationAlert from "react-notification-alert";

import { BASE_URL } from "variables/general";

const CourseSchedule = () => {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [semesters] = useState([1, 2]);
  const [years] = useState([1, 2, 3, 4]);
  const [DeptCourses, setDeptCourses] = useState();
  const [year, setYear] = useState();
  const [semester, setSemester] = useState();
  const [deptName, setDeptName] = useState();

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
  }, []);

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

  const onAddSubmit = (e) => {
    e.preventDefault();

    const deptName = e.target[1].value;
    const course = e.target[2].value;
    const year = e.target[3].value;
    const semester = e.target[4].value;

    fetch(`${BASE_URL}/course-schedule/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ deptName, course, year, semester }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        notify("success", "Added");
      })
      .catch((error) => {
        console.error(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  const onRemoveSubmit = (e) => {
    e.preventDefault();

    const deptName = e.target[1].value;
    const course = e.target[2].value;
    const year = e.target[3].value;
    const semester = e.target[4].value;

    fetch(`${BASE_URL}/course-schedule/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ deptName, course, year, semester }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        notify("success", "Removed");
      })
      .catch((error) => {
        console.error(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  const onViewSubmit = (e) => {
    e.preventDefault();

    const deptName = e.target[1].value;
    const year = e.target[2].value;
    const semester = e.target[3].value;
    setDeptName(deptName);
    setYear(year);
    setSemester(semester);

    fetch(
      `${BASE_URL}/course-schedule/?deptName=${deptName}&year=${year}&semester=${semester}`,
      {
        method: "GET",
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        setDeptCourses(resData.courses);
      })
      .catch((error) => {
        console.error(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  const onAddSpecialSubmit = (e) => {
    e.preventDefault();

    const deptName = e.target[1].value;
    const courseSpecial = e.target[2].value;
    const year = e.target[3].value;
    const semester = e.target[4].value;
    const courseAdd = e.target[5].value;

    fetch(`${BASE_URL}/course-schedule/add-special`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        deptName,
        course: courseSpecial,
        courseAddId: courseAdd,
        year,
        semester,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        notify("success", resData.msg);
      })
      .catch((error) => {
        console.error(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  const onRemoveSpecialSubmit = (e) => {
    e.preventDefault();

    const deptName = e.target[1].value;
    const courseSpecial = e.target[2].value;
    const year = e.target[3].value;
    const semester = e.target[4].value;
    const courseRemove = e.target[5].value;

    fetch(`${BASE_URL}/course-schedule/remove-special`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        deptName,
        courseId: courseSpecial,
        courseRemoveId: courseRemove,
        year,
        semester,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        notify("success", resData.msg);
      })
      .catch((error) => {
        console.error(error);
        let msg = error.msg || error.error.msg || "error";
        notify("danger", msg);
      });
  };

  let formBackgroundColour = "#0d0e17";

  return (
    <div className="content">
      {/* for the pop up  */}
      <div className="react-notification-alert-container">
        <NotificationAlert ref={notificationAlertRef} />
      </div>

      {/* add department to a course  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onAddSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Add Course To Department Course Schedule </legend>
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
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a year</option>
                {/* where the map is */}
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {`${y} year `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Semester</option>
                {/* where the map is */}
                {semesters.map((s, i) => (
                  <option key={i} value={s}>
                    {`${s} semester `}
                  </option>
                ))}
              </select>
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="ADD"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for removeing course from departmetn */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onRemoveSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Remove Course From Department Course Schedule </legend>
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
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a year</option>
                {/* where the map is */}
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {`${y} year `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Semester</option>
                {/* where the map is */}
                {semesters.map((s, i) => (
                  <option key={i} value={s}>
                    {`${s} semester `}
                  </option>
                ))}
              </select>
            </div>
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Remove"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for view the courses  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onViewSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>View Course Schedule </legend>
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
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a year</option>
                {/* where the map is */}
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {`${y} year `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Semester</option>
                {/* where the map is */}
                {semesters.map((s, i) => (
                  <option key={i} value={s}>
                    {`${s} semester `}
                  </option>
                ))}
              </select>
            </div>
            {DeptCourses && (
              <div
                className=" border border-3 rounded"
                style={{
                  color: "white",
                }}
              >
                <div style={{ margin: "20px" }}>
                  year: {year} --- semester: {semester} --- {deptName}
                  <br />
                  <ul>
                    {DeptCourses.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {/* //submit button */}
            <div className="text-center m-form">
              <input
                type="submit"
                value="Remove"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //this is for the special cases  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onAddSpecialSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Add Course as Special Case in Schedule </legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Department</option>
                {/* where the map is */}
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {`${dept.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Special Case Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id}  ${course.name} `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a year</option>
                {/* where the map is */}
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {`${y} year `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Semester</option>
                {/* where the map is */}
                {semesters.map((s, i) => (
                  <option key={i} value={s}>
                    {`${s} semester `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>
                  Choose a Course to add to special case course
                </option>
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
                value="Add"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>

      {/* //for removing special cases  */}
      <div style={{ paddingBottom: "20px" }}>
        <form
          className=" d-block justify-content-center border border-3 rounded"
          style={{ backgroundColor: formBackgroundColour }}
          onSubmit={(e) => {
            onRemoveSpecialSubmit(e);
          }}
        >
          <fieldset className="" style={{ margin: "20px" }}>
            <legend>Add Course as Special Case in Schedule </legend>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Department</option>
                {/* where the map is */}
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.name}>
                    {`${dept.name}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Special Case Course</option>
                {/* where the map is */}
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {`${course._id}  ${course.name} `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a year</option>
                {/* where the map is */}
                {years.map((y, i) => (
                  <option key={i} value={y}>
                    {`${y} year `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>Choose a Semester</option>
                {/* where the map is */}
                {semesters.map((s, i) => (
                  <option key={i} value={s}>
                    {`${s} semester `}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group m-form">
              <select
                role="menu"
                className="custom-select form-control from-select"
              >
                <option value={0}>
                  Choose a Course to add to special case course
                </option>
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
                value="Remove"
                className="btn btn-dark btn-lg"
              />
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default CourseSchedule;
