import React, { useEffect, useState } from "react";
import { BASE_URL } from "variables/general";
import TimetableView from "components/TimetableView/timetableView";

const StudentsTimetableCompareTimetable = (props) => {
  const [timetableCount, setTimetableCount] = useState([]);

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

  return <TimetableView timetableCount={timetableCount} />;
};

export default StudentsTimetableCompareTimetable;
