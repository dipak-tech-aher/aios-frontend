import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { post, get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import logoLight from '../assets/images/logo-light.png';
import loginimg from '../assets/images/loginimg.jpg';
import moment from 'moment';

const ExternalLogin = (props) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false)
  const history = useHistory();
  const [userCred, setUserCred] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState({});
  const [apiMessage, setApiMessage] = useState();
  let { auth, setAuth } = useContext(AppContext);

  useEffect(() => {
   
    const { location }=props
    
    const email = new URLSearchParams(location.search).get("userId");
    const pass=new URLSearchParams(location.search).get("key");   

    setUserCred({email: email, password:pass})

    if (auth && auth.accessToken && auth.user && auth.accessToken !== '') {
      history.push(`${process.env.REACT_APP_BASE}/}`);
    }
  },[auth]);

 useEffect(()=>{
 // console.log(userCred)
  if(userCred && userCred.email!=='' && userCred.password!==''){
    login();
  }
 },[userCred])

  const login = () => {
    let dashboardData = {
      refresh: false,
      autoRefresh: false,
      timer: 5,
      selfDept: 'self',
      startDate: moment().startOf('year').format('DD-MM-YYYY'),
      endDate: moment().format('DD-MM-YYYY'),
    }

    setApiMessage("");
   // const error = validate(validationSchema, userCred);
   // if (error) return;
   showSpinner();
  
    post(properties.USER_API + "/login", userCred)
    .then((resp) => {
      if (resp.data) { 
          let loginData = resp.data;           
          loginData["dashboardData"] = dashboardData
          setAuth(loginData);
          sessionStorage.setItem("auth", JSON.stringify(loginData));
          localStorage.setItem("accessToken", resp.data.accessToken);
          localStorage.setItem('rememberMe', rememberMe);
          localStorage.setItem('user', rememberMe ? userCred.email : '');
          localStorage.setItem('password', rememberMe ? userCred.password : '')
      } else {
        setApiMessage(resp.message);
      }
    })
    .finally(hideSpinner);
   
  };

  return (
    <div className="authentication-bg authentication-bg-pattern">

      <div className="account-pages mt-2 mt-3 p-0">
        <div className="container loginboxshadow">
          <div className="row">
            <div className="col-md-7 p-0 text-right">
              <img alt="" src={loginimg} />
            </div>
            <div className="col-md-5 login-form p-0">
              <div className="card">
                <div className="card-body p-3">
                  <div className="text-center m-auto">
                    <div className="auth-logo">
                      <Link to="#" className="logo text-left">
                        <span className="logo-lg">
                          <img src={logoLight} alt="" height="50" />
                        </span>
                      </Link>
                    </div>
                    <h3 className="text-muted mb-4 mt-2">{t("Login")}</h3>
                  </div>
                  <div class="col-12 mt-3 p-2 border ">
                    <div action="#">
                      <div className="form-group mb-3">
                        <label htmlFor="emailaddress">{t("emailId_userId")}</label>
                        <input
                          //className="form-control"
                          className={`form-control ${(error.email ? "input-error" : "")}`}
                          type="email"
                          placeholder={t("Enter your Email or User ID")}
                          data-test="email"
                          value={userCred.email}
                          onChange={(e) => {
                            setUserCred({ ...userCred, email: e.target.value });
                            setError({ ...error, email: '' })
                          }}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") login();
                          }}
                        />
                        {error.email ? <span className="errormsg">{error.email}</span> : ""}
                      </div>

                      <div className="form-group mb-3">
                        <label htmlFor="password">{t("Password")}</label>
                        <div className="input-group input-group-merge">
                          {/* <input type="password" id="password" className="form-control" placeholder="Enter your password" /> */}
                          <input
                            className="form-control"
                            className={`form-control ${(error.password ? "input-error" : "")}`}
                            type={showPassword === false ? "password" : "text"}
                            placeholder="Enter your password"
                            data-test="password"
                            value={userCred.password}
                            onChange={(e) => {
                              setUserCred({
                                ...userCred,
                                password: e.target.value,
                              });
                              setError({ ...error, password: '' })
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") login();
                            }}
                          />

                          <div className={`input-group-append ${showPassword === false ? "" : "show-password"}`} data-password="false" onClick={() => setShowPassword(!showPassword)}>
                            <div className="input-group-text" style={showPassword === false ? { cursor: "pointer" } : { backgroundColor: "", cursor: "pointer" }}>
                              <span className="password-eye font-12"></span>
                            </div>
                          </div>
                          {error.password ? <span className="errormsg">{error.password}</span> : ""}
                        </div>
                      </div>

                      <div className="form-group mb-3"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") login();
                        }}>                      

                      </div>
                      <div className="form-group mb-0 text-center">
                        <button className="col-md-12 btn btn-primary" type="button" data-test="login" onClick={login}>
                          {t("Login")}
                        </button>
                        {/* <button className="btn btn-primary btn-block" type="button">Log In </button> */}
                      </div>
                      {apiMessage !== "" ? <p className="error-msg">{apiMessage}</p> : ""}

                    </div>
                  </div> 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalLogin;
