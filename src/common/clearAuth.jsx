import React, { useContext, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";

const ClearAuth = () => {

  const { setAuth } = useContext(AppContext);

  useEffect(() => {
    setAuth({})
  }, []);

  return <Redirect to={`${process.env.REACT_APP_BASE}/user/login`}></Redirect>;

};

export default ClearAuth;
