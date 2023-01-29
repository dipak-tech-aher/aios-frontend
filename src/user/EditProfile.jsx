import React, { useState, useContext, useEffect } from "react";
import { showSpinner, hideSpinner } from "../common/spinner";
import { AppContext } from "../AppContext";
import { get, put, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import NumberFormat from "react-number-format";
import { string, object } from "yup";

const validationSchema = object().shape({
    firstName: string().required("First Name is required"),
    lastName: string().required("Last Name is required"),
    country: string().required("Country is required"),
    location: string().required("Location is required"),
    gender: string().required("Gender is required"),
    userType: string().required("User Type is required")
});

const emailValidationSchema = object().shape({
    email: string().required("Please enter Email ID/User ID").email("Email is not in correct format")
});
const emailOTPValidationSchema = object().shape({
    emailOTP: string().required("Please enter Email OTP")
});

const mobileValidationSchema = object().shape({
    contactNo: string().required("Contact No is required")
});

const mobileOTPValidationSchema = object().shape({
    mobileOTP: string().required("Please enter mobile verification code")
});

const EditProfile = (props) => {
    let { auth, setAuth } = useContext(AppContext);
    const history = useHistory();
    const setState = props.setState
    const state = props.state
    const data = props.data
    const [userData, setUserData] = useState(props.data);
    const [showOTP, setShowOTP] = React.useState(false)
    const [verficationCode, setVerficationCode] = React.useState(false)
    const [error, setError] = useState({});
    const [mobileVerified, setMobileVerified] = useState(true);
    const [editMobile, setEditMobile] = useState(false);
    const [editEmail, setEditEmail] = useState(false);
    const [emailVerified, setEmailVerified] = useState(true);
    const [showCountry, setShowCountry] = useState(false);
    const locations = props.locations
    const countries = props.countries
    const userTypes = props.userTypes
    const [disable1, setDisable1] = useState(false)

    const [disable2, setDisable2] = useState(false)
    const gender = [
        { value: 'M', label: 'Male' },
        { value: 'F', label: 'Female' },
    ]

    useEffect(() => {
        setUserData(props.data)
    }, [props.data])

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

    const handleOTP = () => {
        if (validate(mobileValidationSchema, userData)) {
            return;
        }
        showSpinner();
        post(properties.USER_API + "/send-otp/" + userData.contactNo + "?type=mobile").then((resp) => {
            if (resp.status === 200) {
                setEditMobile(true);
                setDisable1(true);
                setShowOTP(true)
                toast.success("OTP sent successfully.");
            } else {
                toast.error("error while sending otp");
            }
        }).finally(hideSpinner)
    }

    const handleVerficationCode = () => {
        if (validate(emailValidationSchema, userData)) {
            return;
        }
        showSpinner();
        post(properties.USER_API + "/send-otp/" + userData.email + "?type=email").then((resp) => {
            if (resp.status === 200) {
                setEditEmail(true);
                setDisable2(true);
                setVerficationCode(true)
                toast.success("OTP sent successfully.");
            } else {
                toast.error("error while sending otp");
            }
        }).finally(hideSpinner)
    }

    const handleSubmit = () => {
        let updatedData = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            country: userData.country,
            location: userData.location,
            contactNo: userData.contactNo,
            gender: userData.gender,
            userType: userData.userType,
            extn: userData.extn
        }
        let error = validate(validationSchema, updatedData)
        let mobileError = validate(mobileValidationSchema, updatedData)
        let emailError = validate(emailValidationSchema, updatedData)
        if (error || mobileError || emailError) {
            return;
        }
        if (editMobile === true) {
            toast.error("Please verify mobile number.");
            return;
        }
        if (editEmail === true) {
            setError({ ...error, mobileOTP: "Please enter Email OTP" });
            toast.error("Please verify email.");
            return;
        }
        setMobileVerified(true);
        setEmailVerified(true);
        showSpinner()
        put(properties.USER_API + "/" + auth.user.userId, updatedData)
            .then((resp) => {
                if (resp.status === 200) {
                    setAuth(prevState => ({
                        ...prevState, user: {
                            ...prevState.user, country: userData.country, firstName: userData.firstName, lastName: userData.lastName,
                            location: userData.location, contactNo: userData.contactNo, gender: userData.gender, email: userData.email,
                            userType: userData.userType, extn: userData.extn
                        },
                        locationDesc: locations.find((x) => x.code === userData.location)?.description || '',
                    }))
                    setState(!state)
                    toast.success("User updated successfully.");
                } else {
                    toast.error("Error while updating user.");
                }
            })
            .finally(hideSpinner)
    }

    const verifyMobileOTP = () => {
        if (validate(mobileOTPValidationSchema, data)) {
            return;
        }
        get(properties.USER_API + "/verify-otp/" + userData.contactNo).then((resp) => {
            if (resp.data) {
                if (resp.data.otp === userData.mobileOTP) {
                    setMobileVerified(true);
                    setShowOTP(false);
                    setEditMobile(false);
                    toast.success("Mobile number verified.");
                }
                else {
                    toast.error("Please enter correct otp");
                }
            } else {
                toast.error("error while fetching otp");
            }
        }).finally(hideSpinner)
    }

    const verifyEmailOTP = () => {
        if (validate(emailOTPValidationSchema, data)) {
            return;
        }
        get(properties.USER_API + "/verify-otp/" + userData.email).then((resp) => {
            if (resp.data) {
                if (resp.data.otp === userData.emailOTP) {
                    toast.success("Email verified.");
                    setEmailVerified(true);
                    setEditEmail(false);
                    setVerficationCode(false);
                }
                else {
                    toast.error("Please enter correct otp");
                }

            } else {
                toast.error("error while fetching otp");
            }
        }).finally(hideSpinner)

    }
    const handleEditMobile = () => {
        setShowCountry(true);
        setMobileVerified(false);

    }
    const handleEditEmail = () => {
        setEmailVerified(false);
    }
    const handleCancel = () => {
        history.push(`${process.env.REACT_APP_BASE}}`);
    }

    return (
        <>
            <fieldset className="scheduler-border">
                <div id="searchBlock12" style={{ display: "block" }}>
                    <h4>Update Profile Details</h4>
                    <div className="row pb-1">
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">First Name <span>*</span></label>
                                <input type="text"
                                    className={`form-control pb-2 ${(error.firstName ? "input-error" : "")}`}
                                    placeholder="Enter First Name"
                                    maxLength={40}
                                    onChange={(e) => {
                                        data.firstName = e.target.value;
                                        setUserData({ ...userData, firstName: e.target.value })
                                        setError({ ...error, firstName: "" })
                                    }}
                                    value={userData.firstName} />
                                {error.firstName ? <span className="errormsg">{error.firstName}</span> : ""}
                                <br />
                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">Last Name <span>*</span></label>
                                <input type="text"
                                    className={`form-control pb-2 ${(error.lastName ? "input-error" : "")}`}
                                    placeholder="Enter Last Name"
                                    maxLength={80}
                                    onChange={(e) => {
                                        data.lastName = e.target.value;
                                        setUserData({ ...userData, lastName: e.target.value })
                                        setError({ ...error, lastName: "" })
                                    }}
                                    value={userData.lastName} />
                                {error.lastName ? <span className="errormsg">{error.lastName}</span> : ""}
                                <br />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 pt-2">
                            <div className="form-group pt-2">
                                <label for="field-2" className="control-label">Country <span>*</span></label>
                                <select
                                    className={`form-control ${(error.country ? "input-error" : "")}`}
                                    disabled={showCountry === false ? true : false}
                                    value={userData.country}
                                    required
                                    onChange={(e) => {
                                        let a
                                        a = countries.find((s) => s.code === e.target.value)
                                        data.country = e.target.value;
                                        data.extn = a.countryCode
                                        setUserData({ ...userData, country: e.target.value, extn: a.countryCode })
                                        setError({ ...error, country: "" })
                                    }}>
                                    {countries && countries.map((e) => (
                                        <option key={e.code} value={e.code}>{e.description}</option>
                                    ))}
                                </select>
                                {error.country ? <span className="errormsg">{error.country}</span> : ""}
                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                            {
                                mobileVerified === false ?
                                    <div className="form-group pt-2">
                                        <label className="control-label">Mobile (update require OTP) <span>*</span></label>
                                        {disable1 === true ? <span className="float-right cursor-pointer" ><small className="text-danger" onClick={handleOTP}>Resend OTP</small></span> : ""}

                                        <div className="input-group input-group-merge">
                                            <input className="form-control form-inline mr-1 col-md-2" type="text"
                                                value={"+" + data.extn} disabled="true" />
                                            <NumberFormat
                                                type="text"
                                                maxLength={15}
                                                placeholder="Enter Mobile Number"
                                                className={`form-control pb-2 col-md-9  ${(error.contactNo ? "input-error" : "")}`}
                                                value={userData.contactNo}
                                                onChange={(e) => {
                                                    data.contactNo = e.target.value;
                                                    setUserData({ ...userData, contactNo: e.target.value })
                                                    setError({ ...error, contactNo: "" })
                                                }}
                                            />
                                            &nbsp;&nbsp;
                                            <button className="btn btn-secondary" disabled={disable1} onClick={handleOTP}>Verify Mobile</button><br />
                                            {error.contactNo ? <span className="errormsg">{error.contactNo}</span> : ""}
                                        </div><br />

                                        {showOTP ?

                                            <div className="input-group input-group-merge ">
                                                <input className={`form-control ${(error.mobileOTP ? "input-error" : "")} col-md-9`} placeholder="Enter Mobile OTP"
                                                    type="text"
                                                    onChange={(e) => {
                                                        data.mobileOTP = e.target.value;
                                                        setUserData({ ...userData, mobileOTP: e.target.value })
                                                        setError({ ...error, mobileOTP: "" })
                                                    }} />&nbsp;&nbsp;
                                                <button className="btn btn-secondary" onClick={verifyMobileOTP}>Submit OTP</button>
                                                {error.mobileOTP ? <span className="errormsg">{error.mobileOTP}</span> : ""}
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div> :
                                    <></>
                            }

                            {
                                mobileVerified === true ?
                                    <div className="form-group pt-2">
                                        <span className="col-form-label">Mobile :</span>
                                        <span>&nbsp;<span class="badge badge-outline-green cursor-pointer">Verified</span></span>
                                        <span><span className="float-right pt-0 cursor-pointer" ><small className="text-danger" onClick={handleEditMobile}>Edit</small></span></span>
                                        <div className="input-group input-group-merge pt-1">
                                            <input className="form-control form-inline mr-1 col-md-3" type="text" value={"+" + userData.extn} disabled="true" />
                                            <input
                                                type="text"
                                                maxLength={15}
                                                readOnly="true"
                                                className="form-control pb-2 col-md-9"
                                                value={userData.contactNo} /><br />
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 pt-2">
                            <div className="form-group pt-2">
                                <label className="control-label">Location <span>*</span></label>
                                <select
                                    className={`form-control ${(error.location ? "input-error" : "")}`}
                                    id="example-select"
                                    value={userData.location}
                                    required
                                    onChange={(e) => {
                                        data.location = e.target.value;
                                        setUserData({ ...userData, location: e.target.value })
                                        setError({ ...error, location: "" })
                                    }}>
                                    <option key={1} value="">Select Location</option>
                                    {locations && locations.map((e) => (
                                        <option key={e.code} value={e.code}>{e.description}</option>
                                    ))}
                                </select>
                                {error.location ? <span className="errormsg">{error.location}</span> : ""}
                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                            {
                                emailVerified === false ?
                                    <div className="form-group pt-2">
                                        <label for="field-2" className="control-label">Email (update require Email Verification) <span>*</span> </label>
                                        {disable2 === true ? <span className="float-right " ><small className="text-danger" onClick={handleVerficationCode}>Resend OTP</small></span> : ""}
                                        <div className="input-group input-group-merge">
                                            <input type="text"
                                                className={`form-control pb-1 ${(error.email ? "input-error" : "")}`}
                                                placeholder="Enter Email"
                                                value={userData.email}
                                                onChange={(e) => {
                                                    data.email = e.target.value;
                                                    setError({ ...error, email: "" })
                                                    setUserData({ ...userData, email: e.target.value })
                                                    setError({ ...error, email: "" })
                                                }}
                                            />&nbsp;&nbsp;
                                            <button disabled={disable2} className="btn btn-secondary" onClick={handleVerficationCode}>Verify Email</button>
                                            {error.email ? <span className="errormsg">{error.email}</span> : ""}
                                        </div>
                                        <br />
                                        {verficationCode === true ?
                                            <div className="input-group input-group-merge ">
                                                <input className={`form-control ${(error.emailOTP ? "input-error" : "")} col-md-9`}
                                                    placeholder="Enter Email OTP"
                                                    type="text"
                                                    onChange={(e) => {
                                                        data.emailOTP = e.target.value;
                                                        setUserData({ ...userData, emailOTP: e.target.value })
                                                        setError({ ...error, emailOTP: "" })
                                                    }}
                                                />&nbsp;&nbsp;
                                                <button className="btn btn-secondary" onClick={verifyEmailOTP}>Submit OTP</button>
                                                {error.emailOTP ? <span className="errormsg">{error.emailOTP}</span> : ""}
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                emailVerified === true ?
                                    <div className="form-group pt-2">
                                        <span className="col-form-label">Email :</span>
                                        <span>&nbsp;<span class="badge badge-outline-green cursor-pointer">Verified</span></span>
                                        <span><span className="float-right cursor-pointer" ><small className="text-danger" onClick={handleEditEmail}>Edit</small></span></span>
                                        <input type="text"
                                            className="form-control mt-1"
                                            readOnly="true"
                                            value={userData.email}
                                        />
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label className="control-label">Gender <span>*</span></label>
                                <select id="example-select"
                                    value={userData.gender}
                                    className={`form-control ${(error.gender ? "input-error" : "")}`}
                                    onChange={(e) => {
                                        data.gender = e.target.value;
                                        setUserData({ ...userData, gender: e.target.value });
                                        setError({ ...error, gender: "" })
                                    }} >
                                    <option key={1} value="">Select Gender</option>
                                    {gender && gender.map((e) => (
                                        <option key={e.value} value={e.value}>{e.label}</option>
                                    ))}
                                </select>
                                {error.gender ? <span className="errormsg">{error.gender}</span> : ""}
                            </div>
                        </div>
                        <div className="col-md-6 pt-2">
                            <div className="form-group">
                                <label for="field-2" className="control-label">User Type <span>*</span></label>
                                <select className={`form-control ${(error.userType ? "input-error" : "")}`} required
                                    value={userData.userType}
                                    onChange={(e) => {
                                        data.userType = e.target.value;
                                        setUserData({ ...userData, userType: e.target.value })
                                        setError({ ...error, userType: "" })
                                    }}>
                                    <option key={1} value="">Select User Type</option>
                                    {userTypes && userTypes.map((e) => (
                                        <option key={e.code} value={e.code}>{e.description}</option>
                                    ))}
                                </select>
                                {error.userType ? <span className="errormsg">{error.userType}</span> : ""}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="prof-btn">
                            <div className="text-center">
                                <button type="button" className="btn waves-effect waves-light btn-primary" onClick={handleSubmit}>Submit</button>&nbsp;
                                <button type="button" className="btn waves-effect waves-light btn-secondary" onClick={handleCancel}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset >
        </>
    )
}
export default EditProfile;
