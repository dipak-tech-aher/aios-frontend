import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { get, post } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import logoLight from '../assets/images/logo-light.png';
import loginimg from '../assets/images/loginimg.jpg';
import Captcha from "demos-react-captcha";
import { toast } from "react-toastify";
import { email } from "../util/validateUtil";

const validationSchema = object().shape({
    email: string().required("Please enter Email ID").email("Please enter a valid email"),

});

const LoginToForgot = (props) => {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false)
    const history = useHistory();
    const [userCred, setUserCred] = useState({ email: "" });
    const [error, setError] = useState({});
    const [apiMessage, setApiMessage] = useState();
    const [validCaptcha, setValidCaptcha] = useState(false);
    let { auth, setAuth } = useContext(AppContext);
    const [valid, setValid] = useState({ email: true })

    useEffect(() => {



    }, []);

    const validate = () => {
        try {
            validationSchema.validateSync(userCred, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

   

    const handleSubmit = () => {
        setApiMessage("");
        const error = validate(validationSchema, userCred);
        if (error) return;
        if (validCaptcha === false) {
            toast.error("Please Enter Correct Captcha");
            return ;
        }
        showSpinner();
        post(properties.USER_API + "/send-forgot-password-link", userCred)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Reset password link sent to your mail, Redirecting you to login page", { autoclose: 3000 })
                    setTimeout(() => {
                        history.push(`${process.env.REACT_APP_BASE}/user/login`)
                    }, 3000);


                } else {
                    toast.error("Error while changing password")
                    setTimeout(() => {
                        history.push(`${process.env.REACT_APP_BASE}/user/login`)
                    }, 5000);
                }
            }

            )
            .finally(hideSpinner);

    };
    const handleCancel = () => {
        setUserCred({ ...userCred, email: "" })
        history.push(`${process.env.REACT_APP_BASE}/user/login`)
    }

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
                                        <h3 className="text-muted mb-2 mt-2"></h3>
                                        <hr />
                                        <div className="col-12 mt-3 p-0 border ">
                                            <h4 className="text-muted mb-2 mt-2">{t("Forgot Password")}</h4>
                                        </div>
                                    </div>

                                    <>
                                        <fieldset className="scheduler-border">
                                            <div className="form-group mb-3">
                                                <label htmlFor="emailaddress">{t("Email ID")}</label>
                                                <input
                                                    //className="form-control"
                                                    className={`form-control ${(error.email ? "input-error" : "")}`}
                                                    type="email"
                                                    placeholder={t("Enter your Email ID")}
                                                    data-test="email"
                                                    value={userCred.email}
                                                    onChange={(e) => {
                                                        setUserCred({ ...userCred, email: e.target.value });
                                                        setError({ ...error, email: '' })
                                                        let result1 = email(e.target.value)
                                                        setValid({ email: result1 });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") handleSubmit();
                                                    }}
                                                />
                                                <span className="errormsg">{error.email || !valid.email ? !valid.email && !error.email ? "" : error.email ? error.email : "Email is not in correct format" : ""}</span>
                                            </div>

                                            <div className="form-group mb-3"
                                             onKeyPress={(e) => {
                                                if (e.key === "Enter") handleSubmit();
                                            }}
                                            tabIndex="0">

                                                <Captcha  onChange={(e) => setValidCaptcha(e)} placeholder="Enter captcha" length={6} />

                                            </div>

                                            <div className="form-group mb-3 text-center">

                                            </div>

                                            <div className="col-12 row pt-2 pr-0">
                                                <div className="col-6 text-center">
                                                    <button className="ml-2 btn btn-primary waves-effect waves-light btn-block" onClick={handleSubmit}>Submit</button>
                                                </div>
                                                <div className="col-6 text-center"><button className="btn btn-secondary waves-effect waves-light btn-block" onClick={handleCancel}>Cancel</button>

                                                </div>


                                            </div>
                                            {apiMessage !== "" ? <p className="error-msg">{apiMessage}</p> : ""}

                                        </fieldset>
                                    </>
                                    <div className=" text-center pl-10"><h5 className="nav-item"><Link to="`{${process.env.REACT_APP_BASE}/user/login}`">Back to Login</Link></h5></div>


                                </div>
                            </div>
                        </div>


                    </div>

                </div >

            </div >
        </div >
    );
};

export default LoginToForgot;
