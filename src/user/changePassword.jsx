import React, { useState, useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { post, get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";


const validationSchema = object().shape({
    oldPassword: string().required("Please enter old password"),
    password: string().required("Please enter password"),
    confirmPassword: string().required("Please confirm password"),
});

const ChangePassword = (props) => {
    const { t } = useTranslation();
    const history = useHistory();

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
        oldPassword: ""
    })



    useEffect(() => {

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
            email: "",
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

            if (test) {
                post(properties.USER_API + "/change-password", newPassword)
                    .then((resp) => {

                        if (resp.status === 200) {
                            toast.success("You have successfully changed password, Redirecting you to login page", { autoclose: 5000 })
                            setTimeout(() => {
                                setAuth({});
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
            <fieldset className="scheduler-border" id="change-pass">
                <div style={{ display: "block" }}>
                    <h4>Change Password</h4>
                    <div className="row">

                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">Current Password </label>
                                <div className="input-group input-group-merge">
                                    <input type="password" className={`form-control ${(error.oldPassword ? "input-error" : "")}`}
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

                                    {error.oldPassword ? <span className="errormsg">{error.oldPassword}</span> : ""}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                        </div>
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">New Password </label>
                                <div className="input-group input-group-merge">
                                    <input
                                        className={`form-control ${(error.password ? "input-error" : "")}`}
                                        type="password"
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


                                    {error.password ? <span className="errormsg">{error.password}</span> : ""}
                                </div>

                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">Confirm Password </label>
                                <div className="input-group input-group-merge">
                                    <input
                                        className={`form-control ${(error.confirmPassword ? "input-error" : "")}`}
                                        type="password"
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

                                    {error.confirmPassword ? <span className="errormsg">{error.confirmPassword}</span> : ""}
                                </div>



                            </div>
                        </div>

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="prof-btn">
                            <div className="text-center">
                                <button type="button" className="btn waves-effect waves-light btn-primary" onClick={changePassword}>Submit</button>&nbsp;
                                <button type="button" className="btn waves-effect waves-light btn-secondary"  onClick={handelcancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </>

    )
};

export default ChangePassword;
