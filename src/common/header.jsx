import React, { useContext,useState } from "react";
import { AppContext } from "../AppContext";
import GlobalSearch from "../common/header/globalSearch";
import Language from "./header/language";
import Notification from "./header/notification";
import ProfileNav from "./header/profileNav";
import ToDo from "./header/toDo";
import UserRole from "./header/userRole";
import logoSM from '../assets/images/logo-sm.png';
import logoDark from '../assets/images/logo-dark.png';
import logoLight from '../assets/images/logo-light.png';
import { Link } from "react-router-dom";
// import FullScreen from "./header/fullscreen";

const Header = () => {
  const { auth, setAuth } = useContext(AppContext);
  const [display, setDisplay] = useState(false);
  return (
    <div>
      {auth && auth.user ? (
        <div className="navbar-custom">
          <div className="container-fluid">
            <ul className="list-unstyled topnav-menu float-right mb-0">
              <UserRole></UserRole>
              {/* <FullScreen></FullScreen> */}
              <Language></Language>
              <Notification></Notification>
              <ProfileNav></ProfileNav>
              <ToDo ></ToDo>
            </ul>
            <div className="logo-box">
              <Link to="/" className="logo logo-dark text-center">
                <span className="logo-sm">
                  <img src={logoSM} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoDark} alt="" height="46" />
                </span>
              </Link>
              <Link to="/" className="logo logo-light text-center">
                <span className="logo-sm">
                  <img src={logoSM} alt="" height="22" />
                </span>
                <span className="logo-lg">
                  <img src={logoLight} alt="" height="46" />
                </span>
              </Link>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Header;
