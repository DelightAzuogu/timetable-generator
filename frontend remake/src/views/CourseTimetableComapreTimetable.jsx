import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "variables/general";
import TimetableView from "components/TimetableView/timetableView";

const CourseTimetableCompareTimetable = (props) => {
  const [timetableCount, setTimetableCount] = useState([]);

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

  return <TimetableView timetableCount={timetableCount} />;
};

export default CourseTimetableCompareTimetable;
