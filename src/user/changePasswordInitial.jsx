/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */

import React, { useState, useEffect, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { get, post } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import logoLight from '../assets/images/logo-light.png';
// import ChangePasswordImg from '../assets/images/changepass.jpg';
import { toast } from "react-toastify";
// import NumberFormat from "react-number-format";
import { AppContext } from "../AppContext";
import ReactTooltip from "react-tooltip";

const validationSchema = object().shape({
    oldPassword: string().required("Please enter temporary password"),
    password: string().required("Please enter new password"),
    confirmPassword: string().required("Please confirm new password"),
});


const ChangePasswordInitial = (props) => {

    // const { t } = useTranslation();
    const history = useHistory();
    const [data, setData] = useState()
    const [error, setError] = useState({});
    const [apiMessage, setApiMessage] = useState();
    const [showPassword1, setShowPassword1] = useState(false)
    const [showPassword2, setShowPassword2] = useState(false)
    const [showPassword3, setShowPassword3] = useState(false)
    let { auth, setAuth } = useContext(AppContext);

    const [newPassword, setNewPassword] = useState({

        password: "",
        confirmPassword: "",
        email: "",
        oldPassword: "",
        forceChangePwd: true
    })



    useEffect(() => {
        showSpinner()
        get(properties.USER_API + "/token/" + props.match.params.forgotpasswordtoken).then(resp => {
            if (resp.data) {
                console.log(resp.data)
                setData(resp.data)

                // setForm({ ...form, email: resp.data.email })
                // setUser(resp.data)
            }
        }).catch((error) => {
            setTimeout(() => {
                history.push(`${process.env.REACT_APP_BASE}/user/login`)
            }, 3000);
        }).finally(hideSpinner)

    }, []);

    const validate = () => {
        try {
            validationSchema.validateSync(newPassword, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };
    const handelcancel = () => {
        setNewPassword({
            ...newPassword,
            password: "",
            confirmPassword: "",
            // email: "",
            oldPassword: ""
        });
    }

    const changePassword = () => {
        setApiMessage("");
        const error = validate(validationSchema, newPassword);
        if (error) return;


        if (newPassword.password === newPassword.confirmPassword) {
            showSpinner();
            var pass = newPassword.password;
            var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"); //Minimum eight characters, at least one letter, one number and one special character:
            var test = reg.test(pass);

            setNewPassword({ ...newPassword, email: data.email })
            let obj = {
                password: newPassword.password,
                confirmPassword: newPassword.confirmPassword,
                email: data.email,
                oldPassword: newPassword.oldPassword,
                forceChangePwd: true
            }

            if (test) {

                post(properties.USER_API + "/reset-password", obj)
                    .then((resp) => {

                        if (resp.status === 200) {
                            toast.success("You have successfully changed password, Redirecting you to login page", { autoclose: 5000 })
                            setTimeout(() => {
                                setAuth({});
                                history.push(`${process.env.REACT_APP_BASE}/user/login`)
                            }, 5000);

                        }
                        else {
                            toast.error("Error while creating password")
                        }
                    }).finally(hideSpinner)
            }
            else {
                toast.error("Password must be at least 8 characters long and contains at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character");
                hideSpinner();
            }
        }

        else {
            toast.error("Passwords are not matching");
        }



    }



    return (
        <div className="authentication-bg authentication-bg-pattern">
            <div className="account-pages mt-2 pt-2 col-md-10 offset-md-1">
                <div className="container loginboxshadow bg-white ">
                    <div className="row">
                        <div class="col-md-6">
                            {/* <img src={ChangePasswordImg} width="500px" height="700px"></img> */}
                        </div>

                        <div className="col-md-6 login-form p-0">
                            <div className="card">
                                <div className="card-body p-3">
                                    <div className="text-center m-auto">
                                        <div className="auth-logo">
                                            <Link to="#" className="logo text-center">
                                                <span className="logo-lg">
                                                    <img src={logoLight} alt="" height="50" />
                                                </span>
                                            </Link>
                                        </div>
                                        <hr className="mt-2" />
                                    </div>
                                    <div className="col-12 mt-2 p-0 border ">
                                        <h4 className="text-center p-0">Change Password</h4>
                                    </div>
                                    <fieldset className="scheduler-border">


                                        <p className="bold p-2">You need to update your password because this is the first time you are sigining in with temporary password.
                                        </p>
                                        {data && <div className="form-group col-12 row">
                                            <div className="col-6">
                                                <span className="col-form-label">First Name : </span><span>{data.firstName}</span>
                                            </div>
                                            <div className="col-6">
                                                <span className="col-form-label">Last Name : </span><span>{data.lastName}</span>
                                            </div>
                                        </div>}
                                        <div className="form-group pt-2">
                                            <label for="field-2" className="control-label">Temporary Password </label>
                                            <div className="input-group input-group-merge">
                                                <input  className={`form-control ${(error.oldPassword ? "input-error" : "")}`}
                                                    placeholder="********"
                                                    type={showPassword1 === false ? "password" : "text"}
                                                    value={newPassword.oldPassword}
                                                    onChange={(e) => {
                                                        setNewPassword({
                                                            ...newPassword,
                                                            oldPassword: e.target.value,
                                                        });
                                                        setError({ ...error, oldPassword: '' })
                                                    }} />
                                                <div className={`input-group-append ${showPassword1 === false ? "" : "show-password"}`} data-password="false" onClick={() => setShowPassword1(!showPassword1)}>
                                                    <div className="input-group-text" style={showPassword1 === false ? { cursor: "pointer" } : { backgroundColor: "", cursor: "pointer" }}>
                                                        <span className="password-eye font-12"></span>
                                                    </div>
                                                </div>

                                                {error.oldPassword ? <span className="errormsg">{error.oldPassword}</span> : ""}

                                            </div>
                                        </div>



                                        <div className="form-group pt-2">
                                            <span className="float-right "><svg data-tip data-for="registerTip" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="feather feather-alert-octagon icon-dual"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>

                                            <label for="field-2" className="control-label">New Password </label>
                                            <ReactTooltip id="registerTip" place="top" effect="float" textColor="white">
                                                Hint for Strong Password<hr /><br></br>
                                                Must be atleast 8 characters long<br></br>
                                                Contain both lower and upper case<br></br>
                                                Contain Number<br></br>
                                                Contain Special Characters Such as !@#&$
                                            </ReactTooltip>
                                            <div className="input-group input-group-merge">
                                                <input
                                                    className={`form-control ${(error.password ? "input-error" : "")}`}
                                                  //  type="password"
                                                    placeholder="**********"
                                                    type={showPassword2 === false ? "password" : "text"}
                                                    value={newPassword.password}
                                                    onChange={(e) => {
                                                        setNewPassword({
                                                            ...newPassword,
                                                            password: e.target.value,
                                                        });
                                                        setError({ ...error, password: '' })
                                                    }} />
                                                <div className={`input-group-append ${showPassword2 === false ? "" : "show-password"}`} data-password="false" onClick={() => setShowPassword2(!showPassword2)}>
                                                    <div className="input-group-text" style={showPassword2 === false ? { cursor: "pointer" } : { backgroundColor: "", cursor: "pointer" }}>
                                                        <span className="password-eye font-12"></span>
                                                    </div>
                                                </div>

                                                {error.password ? <span className="errormsg">{error.password}</span> : ""}


                                            </div>
                                        </div>

                                        <div className="form-group pt-2">
                                            <label for="field-2" className="control-label">Confirm New Password </label>
                                            <div className="input-group input-group-merge">
                                                <input
                                                    className={`form-control ${(error.confirmPassword ? "input-error" : "")}`}
                                                  //  type="password"
                                                    type={showPassword3 === false ? "password" : "text"}
                                                    placeholder="**********"
                                                    value={newPassword.confirmPassword}
                                                    onChange={(e) => {
                                                        setNewPassword({
                                                            ...newPassword,
                                                            confirmPassword: e.target.value,
                                                        });
                                                        setError({ ...error, confirmPassword: '' })
                                                    }}

                                                />
                                                <div className={`input-group-append ${showPassword3 === false ? "" : "show-password"}`} data-password="false" onClick={() => setShowPassword3(!showPassword3)}>
                                                    <div className="input-group-text" style={showPassword3 === false ? { cursor: "pointer" } : { backgroundColor: "", cursor: "pointer" }}>
                                                        <span className="password-eye font-12"></span>
                                                    </div>
                                                </div>
                                                {error.confirmPassword ? <span className="errormsg">{error.confirmPassword}</span> : ""}
                                            </div>




                                        </div>


                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="prof-btn">
                                                    <div className="text-center">
                                                        <button type="button" className="btn waves-effect waves-light btn-primary" onClick={changePassword}>Submit</button>&nbsp;
                                                        <button type="button" className="btn waves-effect waves-light btn-secondary" onClick={handelcancel}>Clear</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="form-group mb-0 text-center ">
                                        <h5 className="nav-item text-center ">
                                            <Link className="col-md-12" to={`{${process.env.REACT_APP_BASE}/user/login}`}>Back to Login</Link>
                                        </h5>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}
export default ChangePasswordInitial;
