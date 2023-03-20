import React from "react";

const TimetableView = (props) => {
  const timetableCount = props.timetableCount;
  let i = 1;
  return (
    <>
      <div
        style={{
          height: "1000px",
          width: "1000px",
          marginLeft: "100px",
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
                  {time.map((t) => {
                    if (typeof t === "string") {
                      return (
                        <th
                          key={i++}
                          // scope="row"
                          // style={{ width: "1%", whiteSpace: "nowrap" }}
                        >
                          {t}
                        </th>
                      );
                    } else {
                      return <td key={i++}>{t}</td>;
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

export default TimetableView;
