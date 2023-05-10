import React from "react";
import classNames from "classnames";

// reactstrap components
import { NavbarBrand, Navbar, Container, NavbarToggler } from "reactstrap";
import { URL } from "variables/general";

function AdminNavbar(props) {
  return (
    <>
      <Navbar className={classNames("navbar-absolute")} expand="lg">
        <Container fluid>
          <div className="navbar-wrapper">
            <div
              className={classNames("navbar-toggle d-inline", {
                toggled: props.sidebarOpened,
              })}
            >
              <NavbarToggler onClick={props.toggleSidebar}>
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </NavbarToggler>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              {props.brandText}
            </NavbarBrand>
          </div>
          <div>
            {props.instructor && (
              <button
                className="btn btn-dark btn-sm"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `${URL}/instructor/${localStorage.getItem("id")}`,
                    "_blank",
                    "noreferrer"
                  );
                }}
              >
                View
              </button>
            )}
            <button
              className="btn btn-dark btn-sm"
              onClick={(e) => {
                props.logout(e);
              }}
            >
              Log out
            </button>
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
