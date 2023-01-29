
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { get, post } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import logoLight from '../assets/images/logo-light.png';
import registerimg from '../assets/images/register.png'
import { toast } from "react-toastify";
import NumberFormat from "react-number-format";

const validationSchema = object().shape({
    firstName: string().required("Please enter firstname"),
    lastName: string().required("Please enter lastname"),
    gender: string().required("Please select gender"),
    userType: string().required("Please select user type"),
    location: string().required("Please select location")
});

const countryValidationSchema = object().shape({
    country: string().required("Please select country")
})

const mobileVerificationValidationSchema = object().shape({
    contactNo: string().required("Please enter mobile number")
});
const mobileOTPValidationSchema = object().shape({
    mobileOTP: string().required("Please enter mobile verification code")
});

const emailVerificationValidationSchema = object().shape({
    email: string().required("Please enter Email ID/User ID").email("Email is not in correct format")
});
const emailOTPValidationSchema = object().shape({
    emailOTP: string().required("Please enter email verification code")
});

const Register = (props) => {
    const { t } = useTranslation();
    const history = useHistory();

    const [error, setError] = useState({});
    const [mobileEnter, setMobileEnter] = useState(false);
    const [mobileVerified, setMobileVerified] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    const [VerifyEmail, setVerifyEmail] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [locations, setLocations] = useState([])
    const [countries, setCountries] = useState()
    const [userTypes, setUserTypes] = useState([])
    const [selectedCountryCode, setSelectedCountryCode] = useState("00");
    const [disable1, setDisable1] = useState(false)
    const [disable2, setDisable2] = useState(false)
    const gender = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
    ]
    const codeTypes = ["LOCATION", "COUNTRY", "USER_TYPE"]

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        userType: "",
        location: "",
        country: "",
        contactNo: "",
        mobileOTP: "",
        email: "",
        emailOTP: "",
        extn: ""
    })

    useEffect(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, codeTypes).then((resp) => {
            if (resp.data) {
                let countryVals = resp.data.COUNTRY.map((e) => {
                    return { code: e.code, description: e.description, countryCode: e.mapping.countryCode }
                })
                setLocations(resp.data.LOCATION)
                setCountries(countryVals)
                setUserTypes(resp.data.USER_TYPE)
            }
            else {
                toast.error("Error while fetching address details")
            }
        })
            .finally(hideSpinner)
    }, []);

    const validate = (schema, form) => {
        try {

            schema.validateSync(form, { abortEarly: false });
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
        if (emailVerified === false && mobileVerified === false) {
            toast.error("please enter required fields & verify mobile number & email");
        }
        let error = validate(validationSchema, form);
        let mobileError = validate(mobileVerificationValidationSchema, form);
        let mobileOTPError = validate(mobileOTPValidationSchema, form);
        let emailError = validate(emailVerificationValidationSchema, form)
        let emailOTPError = validate(emailOTPValidationSchema, form)
        if (error || mobileError || mobileOTPError || emailError || emailOTPError) {
            return;
        }
        showSpinner();
        post(properties.USER_API, form).then((resp) => {
            if (resp.status === 200) {
                toast.success("user created successfully")
                setUserCreated(true)
            }
            else {
                toast.error("error while creating user")
            }
        }).finally(hideSpinner)
    }

    const handleCancel = () => {
        setForm({
            ...form,
            firstName: "",
            lastName: "",
            gender: "",
            userType: "",
            country: "",
            location: "",
            contactNo: "",
            mobileOTP: "",
            email: "",
            emailOTP: "",
            extn: ""
        })
        setVerifyEmail(false)
        setEmailVerified(false)
        setMobileVerified(false)
        setMobileEnter(false)
        history.push(`${process.env.REACT_APP_BASE}}`)
    }

    const MobileVerification = () => {
        let countryError = validate(countryValidationSchema, form);
        let mobileError = validate(mobileVerificationValidationSchema, form);
        if (countryError || mobileError) {
            return;
        }
        showSpinner()
        post(properties.USER_API + "/send-otp/" + form.contactNo + "?type=mobile").then((resp) => {
            if (resp.status === 200) {
                setDisable1(true);
                setMobileEnter(true)
                toast.success("OTP sent successfully.")
            }
            else {
                toast.error("Error while sending OTP")
                history.push(`${process.env.REACT_APP_BASE}/user/login`)
            }
        }).finally(hideSpinner)
    }

    const verifyMobileOTP = () => {
        if (validate(mobileOTPValidationSchema, form)) {
            return;
        }
        get(properties.USER_API + "/verify-otp/" + form.contactNo).then((resp) => {
            if (resp.data) {
                if (resp.data.otp === form.mobileOTP) {
                    toast.success("Mobile number verified.")
                    setMobileVerified(true)
                    setMobileEnter(false)
                }
                else {
                    toast.error("Please enter correct OTP")
                }

            } else {
                toast.error("Error while fetching OTP")
            }
        }).finally(hideSpinner)
    }

    const EmailVerification = async () => {
        let emailError = validate(emailVerificationValidationSchema, form)
        if (emailError) {
            return;
        }
        showSpinner();
        post(properties.USER_API + "/send-otp/" + form.email + "?type=email").then((resp) => {
            if (resp.status === 200) {
                setDisable2(true);
                setVerifyEmail(true)
                toast.success("OTP sent successfully.")
            } else {
                toast.error("Error while sending OTP")
            }
        }).finally(hideSpinner)
    }

    const verifyEmailOTP = () => {
        if (validate(emailOTPValidationSchema, form)) {
            return;
        }
        showSpinner();
        get(properties.USER_API + "/verify-otp/" + form.email).then((resp) => {
            if (resp.data) {
                if (resp.data.otp === form.emailOTP) {
                    toast.success("Email verified.")
                    setEmailVerified(true)
                    setVerifyEmail(false)
                }
                else {
                    toast.error("Please enter correct OTP")
                }

            } else {
                toast.error("Error while fetching OTP")
            }
        }).finally(hideSpinner)
    }

    return (
        <div className="authentication-bg authentication-bg-pattern">
            <div className="account-pages mt-2 pt-2 col-md-10 offset-md-1">
                <div className="container loginboxshadow bg-white ">
                    <div className="row">
                        <div className="col-md-6">
                            <img style={{ height: "100%", width: "90%" }} alt="" src={registerimg} />
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
                                        <h4 className="text-center p-0">Register</h4>
                                    </div>
                                    <>{userCreated === false ?
                                        <fieldset className="scheduler-border">
                                            <div className="form-group">
                                                <label className="col-form-label">First Name <span>*</span></label>
                                                <div className="input-group input-group-merge">
                                                    <input className={`form-control ${(error.firstName ? "input-error" : "")}`} placeholder="Enter First Name"
                                                        type="text"
                                                        maxLength={40}
                                                        onChange={(e) => {
                                                            setForm({
                                                                ...form,
                                                                firstName: e.target.value,
                                                            });
                                                            setError({ ...error, firstName: "" })
                                                        }} />
                                                    {error.firstName ? <span className="errormsg">{error.firstName}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group ">
                                                <label className="col-form-label" >Last Name <span>*</span></label>
                                                <div className="input-group input-group-merge">
                                                    <input className={`form-control ${(error.lastName ? "input-error" : "")}`} placeholder="Enter Last Name"
                                                        type="text"
                                                        maxLength={80}
                                                        onChange={(e) => {
                                                            setForm({
                                                                ...form,
                                                                lastName: e.target.value,
                                                            });
                                                            setError({ ...error, lastName: "" })
                                                        }} />
                                                    {error.lastName ? <span className="errormsg">{error.lastName}</span> : ""}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="col-form-label">Gender <span>*</span></label><br />
                                                <select id="example-select"
                                                    className={`form-control ${(error.gender ? "input-error" : "")}`} onChange={(e) => {
                                                        setForm({ ...form, gender: e.target.value });
                                                        setError({ ...error, gender: "" })
                                                    }} >
                                                    <option selected="true" disabled="disabled">Select gender...</option>
                                                    {gender.map((e) => (
                                                        <option key={e.value} value={e.value}>{e.label}</option>
                                                    ))}
                                                </select>
                                                {error.gender ? <span className="errormsg">{error.gender}</span> : ""}
                                            </div>
                                            <div className="form-group pt-2">
                                                <label className="col-form-label" >User Type <span>*</span></label><br />
                                                <select className={`form-control ${(error.userType ? "input-error" : "")}`}
                                                    onChange={(e) => {
                                                        setForm({ ...form, userType: e.target.value });
                                                        setError({ ...error, userType: "" })
                                                    }}>
                                                    <option selected="true" disabled="disabled">Select user type...</option>
                                                    {userTypes.map((e) => (
                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                    ))}
                                                </select>
                                                {error.userType ? <span className="errormsg">{error.userType}</span> : ""}
                                            </div>
                                            <div className="form-group pt-2">
                                                <label className="col-form-label" >Country <span>*</span></label><br />
                                                <select className={`form-control ${(error.country ? "input-error" : "")}`}
                                                    onChange={(e) => {
                                                        let a
                                                        countries.filter((s) => {
                                                            if (s.code === e.target.value) {

                                                                a = s.countryCode
                                                            }
                                                        })
                                                        setForm({ ...form, country: e.target.value, extn: a });
                                                        setSelectedCountryCode(a)
                                                        setError({ ...error, country: "" })
                                                    }}>
                                                    <option selected="true" disabled="disabled">Select country...</option>
                                                    {countries && countries.map((e) => (
                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                    ))}
                                                </select>
                                                {error.country ? <span className="errormsg">{error.country}</span> : ""}
                                            </div>
                                            <div className="form-group pt-2">
                                                <label className="col-form-label" >Location <span>*</span></label><br />
                                                <select className={`form-control ${(error.location ? "input-error" : "")}`}
                                                    onChange={(e) => {
                                                        setForm({ ...form, location: e.target.value });
                                                        setError({ ...error, location: "" })
                                                    }}>
                                                    <option selected="true" disabled="disabled">Select location...</option>
                                                    {locations.map((e) => (
                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                    ))}
                                                </select>
                                                {error.location ? <span className="errormsg">{error.location}</span> : ""}
                                            </div>
                                            {mobileVerified === true ? "" :
                                                <div className="form-group ">
                                                    <label className="col-form-label" >Mobile <span>*</span></label>
                                                    <div className="input-group input-group-merge ">
                                                        <input className="form-control form-inline mr-1 col-md-2" type="text" value={"+" + selectedCountryCode} disabled="true" />
                                                        <NumberFormat className={`form-control ${(error.contactNo ? "input-error" : "")} col-md-9`}
                                                            placeholder="Enter Mobile Number"
                                                            type="text"
                                                            maxLength={15}
                                                            onChange={(e) => {
                                                                setForm({
                                                                    ...form,
                                                                    contactNo: e.target.value,
                                                                });
                                                                setError({ ...error, contactNo: "" })
                                                            }} />&nbsp;&nbsp;
                                                        <button className="btn btn-secondary"
                                                            onClick={(e) => {

                                                                MobileVerification();
                                                            }}
                                                            disabled={disable1}>Verify Mobile</button>
                                                        {error.contactNo ? <span className="errormsg">{error.contactNo}</span> : ""}
                                                    </div>
                                                </div>}
                                            {mobileEnter === true ?
                                                <div className="form-group ">
                                                    <label className="col-form-label" >Please Enter Mobile Verification OTP <span>*</span></label>
                                                    <span className="float-right pt-2" ><small className="text-danger cursor-pointer" onClick={MobileVerification} >Resend OTP</small></span>

                                                    <div className="input-group input-group-merge ">
                                                        <input className={`form-control ${(error.mobileOTP ? "input-error" : "")} col-md-9`} placeholder="Enter Mobile OTP"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setForm({ ...form, mobileOTP: e.target.value })
                                                                setError({ ...error, mobileOTP: "" })
                                                            }} />&nbsp;&nbsp;
                                                        <button className="btn btn-secondary" onClick={verifyMobileOTP}>Submit OTP</button>
                                                        {error.mobileOTP ? <span className="errormsg">{error.mobileOTP}</span> : ""}
                                                    </div>
                                                </div> : ""}
                                            {mobileVerified === true ?
                                                <div className="form-group pt-2">
                                                    <span className="col-form-label">Mobile : </span><span>{"+" + form.extn + form.contactNo} &nbsp;<span className="badge badge-outline-green" > Verified</span></span>
                                                </div>
                                                : ""}
                                            {emailVerified === true ? "" :
                                                <div className="form-group ">
                                                    <label className="col-form-label" >Email <span>*</span></label>
                                                    <div className="input-group input-group-merge">
                                                        <input className={`form-control ${(error.email ? "input-error" : "")} col-md-9`} placeholder="Enter email"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setForm({
                                                                    ...form,
                                                                    email: e.target.value,
                                                                });
                                                                setError({ ...error, email: "" })
                                                            }} />&nbsp;&nbsp;
                                                        <button className="btn btn-secondary" disabled={disable2}
                                                            onClick={(e) => { EmailVerification() }}>
                                                            Verify Email
                                                        </button>
                                                        {error.email ? <span className="errormsg">{error.email}</span> : ""}
                                                    </div>
                                                </div>}
                                            {VerifyEmail === true ?
                                                <div className="form-group ">
                                                    <label className="col-form-label">Please Enter Email Verification OTP <span>*</span></label>
                                                    <span className="float-right pt-2" ><small className="text-danger cursor-pointer" onClick={EmailVerification}>Resend OTP</small></span>
                                                    <div className="input-group input-group-merge ">
                                                        <input className={`form-control ${(error.emailOTP ? "input-error" : "")} col-md-9`} placeholder="Enter Email OTP"
                                                            type="text"
                                                            onChange={(e) => {
                                                                setForm({ ...form, emailOTP: e.target.value })
                                                                setError({ ...error, emailOTP: "" })
                                                            }} />&nbsp;&nbsp;
                                                        <button className="btn btn-secondary" onClick={verifyEmailOTP}>Submit OTP</button>
                                                        {error.emailOTP ? <span className="errormsg">{error.emailOTP}</span> : ""}
                                                    </div>
                                                </div> : ""}
                                            {emailVerified === true ? <div className="form-group">
                                                <span className="col-form-label">Email : </span><span>{form.email} &nbsp;<span className="badge badge-outline-green"> Verified</span></span>
                                            </div> : ""}
                                            <div class="form-group mb-0 text-center pt-1">
                                                <div class="text-center">
                                                    <button class="btn waves-effect waves-light btn-primary" onClick={(e) => handleSubmit(e)} >Submit</button>&nbsp;
                                                    <button class="btn waves-effect waves-light btn-secondary" onClick={handleCancel} >Cancel</button>
                                                </div>
                                            </div>
                                        </fieldset> :
                                        <fieldset className="scheduler-border">
                                            <div className="form-group pt-2">
                                                <p> Thank you. Your registeration is completed successfully. Admin will send you login credentials to your registered email id soon.</p>
                                            </div>
                                        </fieldset>}
                                        <div className="form-group mb-0 text-center ">
                                            <h5 className="nav-item text-center ">
                                                <Link className="col-md-12" to={`{${process.env.REACT_APP_BASE}/user/login}`}>Back to Login</Link>
                                            </h5>
                                        </div>
                                    </>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    );
}
export default Register;
