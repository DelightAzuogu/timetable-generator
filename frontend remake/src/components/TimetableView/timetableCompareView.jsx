import React from "react";

const TimetableCompareView = (props) => {
  const timetableCount = props.timetableCount;
  console.log(timetableCount);
  let i = 1;
  return (
    <>
      <div
        style={{
          // height: "1000px",
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
            {timetableCount.map((time) => {
              return (
                <tr key={i++}>
                  {time.map((t, index) => {
                    if (typeof t === "string") {
                      return (
                        <th key={i++} style={{ fontFamily: "sans-serif" }}>
                          {t}
                        </th>
                      );
                    } else {
                      if (t === 0) {
                        return <td key={i++}></td>;
                      }
                      return (
                        <td
                          key={i++}
                          style={{ fontFamily: "sans-serif" }}
                          onClick={() => {
                            props.onClickTime(time[0], index, t);
                          }}
                        >
                          {t} student(s) have a class
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TimetableCompareView;
