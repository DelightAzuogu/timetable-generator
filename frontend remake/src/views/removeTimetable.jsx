import React, { useEffect, useState, useRef } from "react";
import NotificationAlert from "react-notification-alert";
import { BASE_URL } from "variables/general";

const RemoveTimetable = (props) => {
  const [timetables, setTimetable] = useState([]);
  const notificationAlertRef = useRef(null);

  useEffect(() => {
    //a function because it is async
    //to get the timetable
    const getTimetable = async () => {
      try {
        const res = await fetch(`${BASE_URL}/timetable/`, {
          method: "GET",
        });

        const resData = await res.json();
        if (!res.ok) {
          throw resData;
        }

        setTimetable(resData.timetable);
      } catch (error) {
        console.error(error);
      }
    };
    getTimetable();
  }, []);

  //for the  pop up
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

  //the submiting
  const removeHandler = async (e) => {
    e.preventDefault();
    const id = e.target[0].value;
    if (id === "0") {
      notify("danger", "choose a timetable to be deleted");
    } else {
      fetch(`${BASE_URL}/timetable/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `bearer ${localStorage.getItem("token")}`,
        },
      })
        .then(async (res) => {
          if (res.ok) {
            notify("success", "timetable deleted");

            //delete the timetable from the list of timetables
            let ttable = timetables.filter((timetable) => timetable._id !== id);
            setTimetable(ttable);
          } else throw await res.json();
        })
        .catch((err) => {
          if (err.msg) {
            notify("danger", err.msg);
          } else {
            notify("danger", "choose a timetable to be deleted");
          }
        });
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
          onSubmit={(e) => {
            removeHandler(e);
          }}
        >
          <div className="form-group m-form">
            <select className="form-select form-control custom-select">
              {/* where the map is */}
              <option value={"0"}>Choose a timetable to remove</option>
              {timetables.map((timetable) => (
                <option key={timetable._id} value={timetable._id}>
                  {`${timetable.course.name} ${timetable.course._id} G${timetable.group}`}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center m-form">
            <input
              type="submit"
              value="REMOVE"
              className="btn btn-dark btn-lg"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default RemoveTimetable;
