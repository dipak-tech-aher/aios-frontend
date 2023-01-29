import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { post, get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Footer from "../common/footer";


const validationSchema = object().shape({

    password: string().required("Please enter password"),
    confirmPassword: string().required("Please confirm password"),
});

const Signup = (props) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [userCred, setUserCred] = useState({ email: "", password: "" });
    const [error, setError] = useState({});
    const [apiMessage, setApiMessage] = useState();
    const [showPassword, setShowPassword] = useState(false)
    let { auth, setAuth } = useContext(AppContext);
    const [data, setData] = useState({
        userId: "",
        firstName: "",
        lastName: "",
        email: "",

    });
    const [newPassword, setNewPassword] = useState({
        userId: "",
        password: "",
        confirmPassword: ""
    })



    useEffect(() => {
        showSpinner()
        get(properties.USER_API + "/token/" + props.match.params.inviteToken).then(resp => {
            if (resp.status === 200) {
                setData(resp.data)
                setNewPassword({ ...newPassword, userId: resp.data.userId })
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
        history.push(`${process.env.REACT_APP_BASE}/user/login`, {})
    }

    const signup = () => {

        setApiMessage("");
        const error = validate(validationSchema, newPassword);
        if (error) return;

        if (newPassword.password === newPassword.confirmPassword) {
            showSpinner();
            var pass = newPassword.password;
            var reg = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})"); //Minimum eight characters, at least one letter, one number and one special character:

            var test = reg.test(pass);

            if (test) {
                post(properties.USER_API + "/reset-password", newPassword)
                    .then((resp) => {

                        if (resp.status === 200) {
                            toast.success("You have successfully Signup, Redirecting you to login page", { autoclose: 5000 })
                            setTimeout(() => {
                                history.push(`${process.env.REACT_APP_BASE}/user/login`)
                            }, 5000);

                        }
                        else {
                            toast.error("Error while creating Password")
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
        <>
            <div style={{ position: "relative", bottom: "83px" }} >
                <span className="logo-lg"><img src="/aios/static/media/logo-light.d64dd61d.png" alt="" height="46" />
                </span>
            </div>

            <div className="authentication-bg authentication-bg-pattern">


                <div className="account-pages mt-2 mt-3 p-0">

                    <div className="row" style={{ justifyContent: "center" }} >

                        <div className="col-md-4 login-form p-0">
                            <div className="card">

                                <div className="card-body p-3">

                                    <div className="text-center m-auto">

                                        <h3 className="text-muted mb-4 mt-2">{t("Signup")}</h3>
                                    </div>
                                    <form action="#">

                                        <div className="form-group mb-3">
                                            <label htmlFor="emailaddress">{t("emailId_userId")}</label>
                                            <input
                                                className={`form-control ${(error.email ? "input-error" : "")}`}
                                                type="email"
                                                disabled={true}
                                                value={data.email}
                                                onKeyPress={(e) => {
                                                    if (e.key === "Enter");
                                                }}
                                            />

                                        </div>

                                        <div className="form-group mb-3">
                                            <label htmlFor="password">{t("Password")}</label>
                                            <div className="input-group input-group-merge">
                                                {/* <input type="password" id="password" className="form-control" placeholder="Enter your password" /> */}
                                                <input
                                                    className={`form-control ${(error.password ? "input-error" : "")}`}
                                                    type="password"
                                                    placeholder="**********"
                                                    type={showPassword === false ? "password" : "text"}
                                                    value={newPassword.password}
                                                    onChange={(e) => {
                                                        setNewPassword({
                                                            ...newPassword,
                                                            password: e.target.value,
                                                        });
                                                    }}

                                                />
                                                <div className="input-group-append" data-password="false">
                                                    <div className="input-group-text" style={showPassword === false ? { cursor: "pointer" } : { backgroundColor: "lightgrey", cursor: "pointer" }}>
                                                        <span className="password-eye font-12" onClick={() => setShowPassword(!showPassword)}></span>
                                                    </div>
                                                </div>

                                                {error.password ? <span className="errormsg">{error.password}</span> : ""}
                                            </div>
                                        </div>
                                        <div className="form-group mb-3">
                                            <label htmlFor="password">{t("Confirm Password")}</label>
                                            <div className="input-group input-group-merge">
                                                <input
                                                    className={`form-control ${(error.confirmPassword ? "input-error" : "")}`}
                                                    type="password"
                                                    type={showPassword === false ? "password" : "text"}
                                                    placeholder="**********"
                                                    value={newPassword.confirmPassword}
                                                    onChange={(e) => {
                                                        setNewPassword({
                                                            ...newPassword,
                                                            confirmPassword: e.target.value,
                                                        });
                                                    }}

                                                />
                                                <div className="input-group-append" data-password="false">
                                                    <div className="input-group-text" style={showPassword === false ? { cursor: "pointer" } : { backgroundColor: "lightgrey", cursor: "pointer" }}>
                                                        <span className="password-eye font-12" onClick={() => setShowPassword(!showPassword)}></span>
                                                    </div>
                                                </div>

                                                {error.confirmPassword ? <span className="errormsg">{error.confirmPassword}</span> : ""}
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">

                                        </div>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <button className="btn btn-primary" type="button" onClick={signup}>
                                                {t("Sign Up")}
                                            </button>&nbsp;
                                            <button className="btn btn-secondary" type="button" onClick={handelcancel} >Cancel</button>

                                        </div>
                                        {apiMessage !== "" ? <p className="error-msg">{apiMessage}</p> : ""}


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Signup;
