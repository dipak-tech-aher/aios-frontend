import React, { createContext, useState, useEffect } from "react";
import { setAccessToken } from "./util/restUtil";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState(sessionStorage.getItem("auth") ? JSON.parse(sessionStorage.getItem("auth")) : {});
  useEffect(() => {
    sessionStorage.setItem("auth", JSON.stringify(auth));
    setAccessToken(auth ? auth.accessToken : "");
  }, [auth]);

  const [selectedTab, setSelectedTab] = useState(
    sessionStorage.getItem("selectedTab") ? JSON.parse(sessionStorage.getItem("selectedTab")) : "Overview"
  );

  useEffect(() => {
    sessionStorage.setItem("selectedTab", JSON.stringify(selectedTab));
    setSelectedTab(selectedTab ? selectedTab : "Overview");
  }, [selectedTab]);

  //Clear context here
  useEffect(() => {
    if (!auth) {
      setSelectedTab("Overview");
    }
  }, [auth]);

  return (
    <AppContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
