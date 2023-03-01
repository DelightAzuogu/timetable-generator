import React from "react";

const View = (props) => {
  //to get the page that the admin is finding
  const page = props.location.pathname.split("/")[2];

  if (page === "instructor") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `http://localhost:3000/instructor/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            {/* for the id/ */}
            <div className="input-group mb-3" style={{ marginTop: "30px" }}>
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Instructor Id
                </label>
              </div>

              <input
                className="form-control"
                style={{
                  width: "100px",
                  height: "42px",
                }}
                type="number"
                id="number"
                name="number"
                required
              />
            </div>
            <div className="text-center m-form">
              <input
                type="submit"
                value="LOGIN"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  } else if (page === "classroom") {
    return (
      <>
        <div className="content">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.open(
                `http://localhost:3000/classroom/${e.target[0].value}`,
                "_blank",
                "noreferrer"
              );
            }}
          >
            {/* for the id/ */}
            <div className="input-group mb-3" style={{ marginTop: "30px" }}>
              <div className="input-group-prepend">
                <label className="input-group-text" htmlFor="group">
                  Instructor Id
                </label>
              </div>

              <input
                className="form-control"
                style={{
                  width: "100px",
                  height: "42px",
                }}
                type="number"
                id="number"
                name="number"
                required
              />
            </div>
            <div className="text-center m-form">
              <input
                type="submit"
                value="LOGIN"
                className="btn btn-dark btn-lg"
              />
            </div>
          </form>
        </div>
      </>
    );
  }
};

export default View;
