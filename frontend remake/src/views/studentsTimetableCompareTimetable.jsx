import React, { useEffect, useState } from "react";
import { BASE_URL } from "variables/general";
import TimetableCompareView from "components/TimetableView/timetableCompareView";

const StudentsTimetableCompareTimetable = (props) => {
  const [timetableCount, setTimetableCount] = useState([]);
  const [studentCourse, setStudentCourse] = useState();
  const [time, setTime] = useState();
  const [day, setDay] = useState();

  const studentsId = props.location.search.split("=")[1];

  useEffect(() => {
    let url = `${BASE_URL}/student/compare-timetable?studentsId=${studentsId}`;
    const getTimetable = async () => {
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
    getTimetable();
  }, [studentsId]);

  const onClickTime = (time, day, number) => {
    setTime(time);
    time = parseInt(time.split(":")[0]);
    if (day === 1) day = "monday";
    if (day === 2) day = "tuesday";
    if (day === 3) day = "wednesday";
    if (day === 4) day = "thursday";
    if (day === 5) day = "friday";
    setDay(day);
    fetch(
      `${BASE_URL}/student/time/details?day=${day}&time=${time}&studentCount=${number}&studentsId=${studentsId}`,
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

export default StudentsTimetableCompareTimetable;
