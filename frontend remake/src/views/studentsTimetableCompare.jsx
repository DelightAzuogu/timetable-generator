import React, { useState, useEffect, useRef } from "react";
import { BASE_URL, URL } from "variables/general";
import NotificationAlert from "react-notification-alert";

const StudentsTimetimeCompareView = () => {
  const [students, setStudents] = useState([]);
  const [chosenStudents, setChosenStudents] = useState([]);

  //for the notification thing
  const notificationAlertRef = useRef(null);
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

  useEffect(() => {
    const getStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/student`, {
          method: "GET",
        });

        const resData = await res.json();

        if (!res.ok) {
          throw resData;
        }
        setStudents(resData.students);
      } catch (error) {
        console.error(error);
      }
    };
    getStudents();
  }, []);

  //when the student Select is changed
  const onChangeStudents = async (e) => {
    const student = e.target.value;
    //get the index of the student
    const index = students.findIndex((v) => v._id === parseInt(student));
    if (index < 0) {
      notify("danger", "choose a valid student");
    } else {
      //update the choosen students
      const newChoosenStudent = [...chosenStudents, students[index]];
      setChosenStudents(newChoosenStudent);

      //remove that student from the students
      const newStudents = students.filter((v) => v._id !== parseInt(student));
      setStudents(newStudents);
    }
  };

  //when the choose student selects is changedd
  const onchangeChoosenStudent = async (e) => {
    const student = e.target.value;

    //get the student from choosen Student
    const index = chosenStudents.findIndex((v) => v._id === parseInt(student));
    if (index < 0) {
      notify("danger", "choose a valid student");
    } else {
      //update the students
      const newStudents = [...students, chosenStudents[index]];
      setStudents(newStudents);

      //remove the student from chosenStudent
      const newChosenStudent = chosenStudents.filter(
        (v) => v._id !== parseInt(student)
      );
      setChosenStudents(newChosenStudent);
    }
  };

  //when teh form is submitted
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!chosenStudents.length) {
      notify("danger", "choose students");
    } else {
      const studentsId = chosenStudents.map((v) => {
        return v._id;
      });
      let url = `${URL}/compare-student-timetable?studentsId=${studentsId}`;
      window.open(url, "_blank", "noreferrer");
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
          className=" d-block justify-content-center"
          onSubmit={(e) => {
            onSubmit(e);
          }}
        >
          <div className="form-group m-form">
            {/* for the student */}
            <select
              className="custom-select form-control from-select"
              onChange={async (e) => {
                await onChangeStudents(e);
              }}
            >
              {/* where the map is */}
              <option value={0} key={0}>
                Choose a Student
              </option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {`${student._id} ${student.name.first} ${student.name.last}`}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group m-form">
            {/* //for the chosenStudent */}
            <select
              className="form-select form-control custom-select"
              onChange={(e) => {
                onchangeChoosenStudent(e);
              }}
            >
              {/* where the map is */}
              <option value={0}>Choose a student to remove them</option>
              {chosenStudents.map((student) => (
                <option key={student._id} value={student._id}>
                  {`${student._id} ${student.name.first} ${student.name.last}`}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center m-form">
            <input type="submit" value="VIEW" className="btn btn-dark btn-lg" />
          </div>
        </form>
      </div>
    </>
  );
};

export default StudentsTimetimeCompareView;
