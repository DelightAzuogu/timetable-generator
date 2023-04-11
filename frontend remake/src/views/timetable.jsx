import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "variables/general";

const Timetable = (props) => {
  const [course, setCourse] = useState();
  const [classroom, setClassroom] = useState();
  const [instructor, setInstructor] = useState();
  const [student, setStudent] = useState();
  const [timetable, setTimetable] = useState([]);
  const [time] = useState([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  const [day] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const [clickCourses, setClickCourses] = useState();
  const [clickTimeDay, setClickTimeDay] = useState();

  const page = props.location.pathname.split("/")[1];
  let { id } = useParams();
  if (!id) {
    id = props.location.pathname.split("/")[2];
  }

  var timetableitems = [];

  //component did mount
  useEffect(() => {
    //created the function because it is async and useEffect but be a normal function not promise
    const getTimetable = async () => {
      try {
        const url = `${BASE_URL}/${page}/timetable/${id}`;
        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }
        //set the timetable
        setTimetable(resData.timetable);
        //se the others
        if (page === "classroom") {
          setClassroom(resData.classroom);
        } else if (page === "instructor") {
          setInstructor(resData.instructor);
        } else if (page === "student") {
          setStudent(resData.student);
        } else if (page === "course") {
          setCourse(resData.course);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getTimetable();
  }, [id, page]);

  for (let i = 0; i < day.length; i++) {
    timetableitems[i] = [];
    for (let j = 0; j < time.length; j++) {
      //
      const times = timetable.filter((e) => {
        if (e.day === day[i] && e.time.includes(time[j])) {
          return e;
        }
      });
      if (times.length) {
        let details = "";
        if (page === "course") {
          for (let time of times) {
            details += `G${time.group}______${time.classroom.building}  ${time.classroom.classNum} \n\n`;
          }
          timetableitems[i].push(
            <td
              onClick={() => {
                onTimetableClick(times, j);
              }}
              style={{ width: "1%", whiteSpace: "nowrap" }}
            >
              {details}
            </td>
          );
        } else if (page === "classroom") {
          for (let time of times) {
            details += `${time.course._id} ${time.course.name}`;
          }
          timetableitems[i].push(
            <td
              onClick={() => {
                onTimetableClick(times, j);
              }}
              style={{ width: "1%", whiteSpace: "nowrap" }}
            >
              {details}
            </td>
          );
        } else {
          for (let time of times) {
            details += `${time.course._id} ${time.course.name} -- ${time.classroom.building}${time.classroom.classNum}\n\n`;
          }
          timetableitems[i].push(
            <td
              style={{ width: "1%", whiteSpace: "nowrap" }}
              onClick={() => {
                onTimetableClick(times, j);
              }}
            >
              {details}
            </td>
          );
        }
      } else {
        timetableitems[i].push(<td></td>);
      }
    }
  }

  const onTimetableClick = async (times, t) => {
    try {
      const timess = [];
      for (let time of times) {
        const res = await fetch(`${BASE_URL}/instructor/${time.instructorId}`, {
          method: "GET",
        });
        if (!res.ok) {
          throw await res.json();
        }
        const resData = await res.json();
        timess.push({ ...time, ...resData.instructor });
      }
      setClickCourses(timess);
      setClickTimeDay({ day: times[0].day, time: time[t] });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div
        style={{
          fontSize: "20px",
          marginLeft: "20%",
          color: "white",
        }}
      >
        {page === "instructor" &&
          instructor &&
          instructor._id + " " + instructor.name}
        {page === "classroom" &&
          classroom &&
          classroom.building + classroom.classNum}
        {page === "student" &&
          student &&
          student._id + " " + student.name.first + " " + student.name.last}
        {page === "course" && course && course._id + " " + course.name}
        {props.logout && (
          <button
            className="btn btn-dark btn-sm"
            onClick={(e) => {
              props.logout(e);
            }}
          >
            Log out
          </button>
        )}
      </div>
      <div
        style={{
          width: "1000px",
          marginLeft: "10px",
          marginTop: "20px",
        }}
      >
        <table>
          <thead>
            <tr>
              <td width={"50px"}></td>
              <td width={"100px"}>Monday</td>
              <td width={"100px"}>Tuesday</td>
              <td width={"100px"}>Wednessday</td>
              <td width={"100px"}>Thursday</td>
              <td width={"100px"}>Friday</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>9:00</th>
              {timetableitems[0][0]}
              {timetableitems[1][0]}
              {timetableitems[2][0]}
              {timetableitems[3][0]}
              {timetableitems[4][0]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>10:00</th>
              {timetableitems[0][1]}
              {timetableitems[1][1]}
              {timetableitems[2][1]}
              {timetableitems[3][1]}
              {timetableitems[4][1]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>11:00</th>
              {timetableitems[0][2]}
              {timetableitems[1][2]}
              {timetableitems[2][2]}
              {timetableitems[3][2]}
              {timetableitems[4][2]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>12:00</th>
              {timetableitems[0][3]}
              {timetableitems[1][3]}
              {timetableitems[2][3]}
              {timetableitems[3][3]}
              {timetableitems[4][3]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>13:00</th>
              {timetableitems[0][4]}
              {timetableitems[1][4]}
              {timetableitems[2][4]}
              {timetableitems[3][4]}
              {timetableitems[4][4]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>14:00</th>
              {timetableitems[0][5]}
              {timetableitems[1][5]}
              {timetableitems[2][5]}
              {timetableitems[3][5]}
              {timetableitems[4][5]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>15:00</th>
              {timetableitems[0][6]}
              {timetableitems[1][6]}
              {timetableitems[2][6]}
              {timetableitems[3][6]}
              {timetableitems[4][6]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>16:00</th>
              {timetableitems[0][7]}
              {timetableitems[1][7]}
              {timetableitems[2][7]}
              {timetableitems[3][7]}
              {timetableitems[4][7]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>17:00</th>
              {timetableitems[0][8]}
              {timetableitems[1][8]}
              {timetableitems[2][8]}
              {timetableitems[3][8]}
              {timetableitems[4][8]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>18:00</th>
              {timetableitems[0][9]}
              {timetableitems[1][9]}
              {timetableitems[2][9]}
              {timetableitems[3][9]}
              {timetableitems[4][9]}
            </tr>
            <tr>
              <th style={{ width: "1%", whiteSpace: "nowrap" }}>19:00</th>
              {timetableitems[0][10]}
              {timetableitems[1][10]}
              {timetableitems[2][10]}
              {timetableitems[3][10]}
              {timetableitems[4][10]}
            </tr>
          </tbody>
        </table>
        {clickCourses && (
          <div style={{ color: "white", marginTop: "10px" }}>
            <span>
              {clickTimeDay.day} {clickTimeDay.time}:00
            </span>
            <ul>
              {clickCourses.map((course, i) => (
                <li key={i}>
                  {course.course._id} {course.course.name}
                  <br />
                  {course.classroom.building}
                  {course.classroom.classNum} -- {course.time[0]}:00 -
                  {course.time[course.time.length - 1]}:00
                  <br />
                  {course.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Timetable;
