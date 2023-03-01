import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "variables/general";

const InstructorTable = (props) => {
  const [timetable, setTimetable] = useState([]);
  const [time] = useState([9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  const [day] = useState([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);
  let { id } = useParams();

  var timetableitems = [[], [], [], [], []];

  //component did mount
  useEffect(() => {
    //created the function because it is async and useEffect but be a normal function not promise
    const getTimetable = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/timetable/instructor-timetable/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }

        setTimetable(resData.timetable);
      } catch (error) {
        console.log("yess", error);
      }
    };
    getTimetable();
  });

  //setting the timetable to the respectful days and times.
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 11; j++) {
      const index = timetable.findIndex(
        (e) => e.time.includes(time[j]) && e.day === day[i]
      );
      if (index < 0) {
        timetableitems[i].push(
          <td
            style={{
              height: "70px",
            }}
          ></td>
        );
      } else {
        timetableitems[i].push(
          <td>
            {timetable[index].course.name}
            <br />
            {`${timetable[index].classroom.building} ${timetable[index].classroom.classNum}`}
          </td>
        );
      }
    }
  }

  return (
    <div
      style={{
        height: "1000px",
        width: "1000px",
        marginLeft: "100px",
        marginTop: "20px",
      }}
    >
      <table className="table table-bordered">
        <thead>
          <tr>
            <td></td>
            <td>Monday</td>
            <td>Tuesday</td>
            <td>Wednessday</td>
            <td>Thursday</td>
            <td>Friday</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">9:00</th>
            {timetableitems[0][0]}
            {timetableitems[1][0]}
            {timetableitems[2][0]}
            {timetableitems[3][0]}
            {timetableitems[4][0]}
          </tr>
          <tr>
            <th scope="row">10:00</th>
            {timetableitems[0][1]}
            {timetableitems[1][1]}
            {timetableitems[2][1]}
            {timetableitems[3][1]}
            {timetableitems[4][1]}
          </tr>
          <tr>
            <th scope="row">11:00</th>
            {timetableitems[0][2]}
            {timetableitems[1][2]}
            {timetableitems[2][2]}
            {timetableitems[3][2]}
            {timetableitems[4][2]}
          </tr>
          <tr>
            <th scope="row">12:00</th>
            {timetableitems[0][3]}
            {timetableitems[1][3]}
            {timetableitems[2][3]}
            {timetableitems[3][3]}
            {timetableitems[4][3]}
          </tr>
          <tr>
            <th scope="row">13:00</th>
            {timetableitems[0][4]}
            {timetableitems[1][4]}
            {timetableitems[2][4]}
            {timetableitems[3][4]}
            {timetableitems[4][4]}
          </tr>
          <tr>
            <th scope="row">14:00</th>
            {timetableitems[0][5]}
            {timetableitems[1][5]}
            {timetableitems[2][5]}
            {timetableitems[3][5]}
            {timetableitems[4][5]}
          </tr>
          <tr>
            <th scope="row">15:00</th>
            {timetableitems[0][6]}
            {timetableitems[1][6]}
            {timetableitems[2][6]}
            {timetableitems[3][6]}
            {timetableitems[4][6]}
          </tr>
          <tr>
            <th scope="row">16:00</th>
            {timetableitems[0][7]}
            {timetableitems[1][7]}
            {timetableitems[2][7]}
            {timetableitems[3][7]}
            {timetableitems[4][7]}
          </tr>
          <tr>
            <th scope="row">17:00</th>
            {timetableitems[0][8]}
            {timetableitems[1][8]}
            {timetableitems[2][8]}
            {timetableitems[3][8]}
            {timetableitems[4][8]}
          </tr>
          <tr>
            <th scope="row">18:00</th>
            {timetableitems[0][9]}
            {timetableitems[1][9]}
            {timetableitems[2][9]}
            {timetableitems[3][9]}
            {timetableitems[4][9]}
          </tr>
          <tr>
            <th scope="row">19:00</th>
            {timetableitems[0][10]}
            {timetableitems[1][10]}
            {timetableitems[2][10]}
            {timetableitems[3][10]}
            {timetableitems[4][10]}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default InstructorTable;
