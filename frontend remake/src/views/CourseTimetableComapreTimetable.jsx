import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "variables/general";
import TimetableCompareView from "components/TimetableView/timetableCompareView";

const CourseTimetableCompareTimetable = (props) => {
  const [timetableCount, setTimetableCount] = useState([]);
  const [studentCourse, setStudentCourse] = useState();
  const [time, setTime] = useState();
  const [day, setDay] = useState();

  let { course } = useParams();
  const groups = props.location.search.split("=")[1];

  useEffect(() => {
    let url = `${BASE_URL}/course/compare-timetable?id=${course}`;
    if (groups[0] !== "0") {
      url += `&group=${groups}`;
    }
    const getTimetableCourse = async () => {
      try {
        const res = await fetch(url, { method: "GET" });
        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }
        setTimetableCount(resData.timetableCount);
      } catch (error) {
        console.error(error);
      }
    };
    getTimetableCourse();
  }, [course, groups]);

  const onClickTime = (time, day, number) => {
    setTime(time);
    time = parseInt(time.split(":")[0]);
    if (day === 1) day = "monday";
    if (day === 2) day = "tuesday";
    if (day === 3) day = "wednesday";
    if (day === 4) day = "thursday";
    if (day === 5) day = "friday";
    setDay(day);

    // console.log(course);
    let url = `${BASE_URL}/course/time/details?day=${day}&time=${time}&studentCount=${number}&id=${course}`;
    if (groups[0] !== "0") {
      url += `&group=${groups}`;
    }
    fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw await res.json();
        }
        return res.json();
      })
      .then((resData) => {
        setStudentCourse(resData.studentCourseArray);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="col-sm">
        <TimetableCompareView
          onClickTime={onClickTime}
          timetableCount={timetableCount}
        />
      </div>
      {studentCourse && (
        <div
          className="col-sm"
          style={{
            color: "white",
            marginTop: "20px",
          }}
        >
          Students having class on {day} at {time}
          <ul>
            {studentCourse.map((s, i) => (
              <li key={i}>
                {s.id} {s.name} -- {s.courseId} {s.courseName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseTimetableCompareTimetable;
