import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import { properties } from "../properties";
import { AppContext } from "../AppContext";
import { remove } from "../util/restUtil";
import { showSpinner, hideSpinner } from "./spinner";

const Logout = () => {
  const { setAuth } = useContext(AppContext);
  let userId =
    JSON.parse(sessionStorage.getItem("auth")) && JSON.parse(sessionStorage.getItem("auth")) !== null
      ? JSON.parse(sessionStorage.getItem("auth")).user.userId
      : "";
  // showSpinner();
  remove(properties.USER_API + "/logout/" + userId)
    .then((resp) => {
      if (resp.status === 200) {
        setAuth({});
      } else {
      }
      sessionStorage.removeItem("auth");
    }

    )
    .finally(hideSpinner);
  return <Redirect to={`${process.env.REACT_APP_BASE}/user/login`}></Redirect>;

};

export default Logout;
