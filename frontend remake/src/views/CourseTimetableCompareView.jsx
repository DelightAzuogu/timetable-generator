import React, { useState, useEffect, useRef } from "react";
import { BASE_URL, URL } from "variables/general";
import NotificationAlert from "react-notification-alert";

const CourseTimetableCompareView = () => {
  const [courses, setCourses] = useState([]);
  const [groups, setGroups] = useState(["select a course"]);
  const [chosenGroupNumbers, setChosenGroupNumbers] = useState([]);

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

  useEffect(() => {
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
    getCourses();
  }, []);

  //when the course Select is changed
  const onchangeCourse = async (e) => {
    const courseId = e.target.value;
    try {
      const res = await fetch(`${BASE_URL}/course/group/${courseId}`, {
        method: "GET",
      });
      const resData = await res.json();
      if (!res.ok) throw resData;

      if (resData.group.length > 0) {
        setGroups(resData.group);
      } else {
        setGroups(["course not in timetable"]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //when the Groups selects is changedd
  const onchangeGroups = async (e) => {
    const group = e.target.value;
    if (!chosenGroupNumbers.includes(group)) {
      const g = [...chosenGroupNumbers];
      g.push(group);
      await setChosenGroupNumbers(g);
    }
    const newGroup = groups.filter((v) => v !== group);
    setGroups(newGroup);
  };

  //when the ChoosenGroupNUmber select is changed
  const onChangeChoosenGroupNumber = async (e) => {
    const group = e.target.value;
    if (!groups.includes(group)) {
      const g = [...groups];
      g.push(group);
      setGroups(g);
    }
    const newChoosenGroup = chosenGroupNumbers.filter((v) => v !== group);
    setChosenGroupNumbers(newChoosenGroup);
  };

  //when teh form is submitted
  const onSubmit = async (e) => {
    e.preventDefault();
    const course = e.target[0].value;

    if (course === 0) {
      notify("danger", "choose a course");
    } else {
      let url = `${URL}/compare-timetable/${course}?group=`;
      if (chosenGroupNumbers.length) {
        url += `${chosenGroupNumbers}`;
      } else {
        url += `0`;
      }
      window.open(url, "_blank", "noreferrer");
    }
  };

  return (
    <>
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
          <div className="form-group m-form">
            {/* for the course */}
            <select
              className="custom-select form-control from-select"
              onChange={async (e) => {
                await onchangeCourse(e);
              }}
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
          <div className="form-group m-form">
            {/* //for the group */}
            <select
              className="form-select form-control custom-select"
              onChange={(e) => {
                onchangeGroups(e);
              }}
            >
              {/* where the map is */}
              <option value={0}>Choose a Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {`${group}`}
                </option>
              ))}
            </select>
          </div>
          {/* //for showinf the user the selected groups */}
          <div className="form-group m-form">
            <select
              className="form-select form-control custom-select"
              onChange={(e) => {
                onChangeChoosenGroupNumber(e);
              }}
            >
              <option value={0}>Choose a group to unselect it</option>
              {/* where the map is */}
              {chosenGroupNumbers.map((group) => (
                <option key={group} value={group}>
                  {`${group}`}
                </option>
              ))}
            </select>
          </div>

          <div className="text-center m-form">
            <input type="submit" value="VIEW" className="btn btn-dark btn-lg" />
          </div>
        </form>
      </div>
    </>
  );
};

export default CourseTimetableCompareView;
