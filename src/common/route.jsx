import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AppContext } from "../AppContext";
import AppLayout from "./Layout/AppLayout";

export const PrivateRoute = ({ component: Component, ...rest }) => {

  const { auth } = useContext(AppContext);
  let isAuthenticated = false;
  if (auth && auth.accessToken) {
    isAuthenticated = true;
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <AppLayout isAuthenticated={isAuthenticated}>
            <Component key={new Date().getTime()} {...props} />
          </AppLayout>
        ) : (
          <Redirect to={`${process.env.REACT_APP_BASE}/user/login`} />
        )
      }
    />
  )
};

export const PublicRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        <AppLayout>
          <Component {...props} />
        </AppLayout>
      } />
  )
};
