
import React, { useState, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { properties } from "../properties";
import { get, post } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import logoLight from '../assets/images/logo-light.png';
import registerimg from '../assets/images/register.png';
import Select from 'react-select';
import { string, object } from "yup";
import { toast } from 'react-toastify';
const validationSchema = object().shape({

    mobileNo: string().required("Please enter mobile number")

});

const RegisterVerify = (props) => {
    let mob

    const history = useHistory();
    const [apiMessage, setApiMessage] = useState();
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState(false);
    const [error, setError] = useState({});

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        country: "",
        email: "",
        inviteToken: "",
        mobileNo: "",
        userType: ""
    })
    const location = [
        { value: 'location 1', label: 'location 1' },
        { value: 'location 2', label: 'location 2' },
        { value: 'location 3', label: 'location 3' }
    ]

    const userType = [
        { value: 'employee', label: 'Employee' },
        { value: 'vendor', label: 'Vendor' },
        { value: 'portal', label: 'Portal' }
    ]
    const validate = () => {
        try {
            validationSchema.validateSync(form, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    useEffect(() => {
        showSpinner()
        get(properties.USER_API + "/token/" + props.match.params.inviteToken).then(resp => {
            if (resp.status === 200) {
                setForm(resp.data)
            }
        }).catch((error) => {
            setTimeout(() => {
                history.push(`${process.env.REACT_APP_BASE}/user/register`)
            }, 3000);
        }).finally(hideSpinner)

    }, []);


    const handleSubmit = () => {
        console.log("we are in handle submit")
        if (form.inviteToken === props.match.params.inviteToken) {
            setVerified(true);
        }

    }
    const updateMobile = (e) => {

        const error = validate(validationSchema, form);
        if (error) return;
        var pattern = new RegExp(/^[0-9\b]+$/);
        if (pattern.test(e)) {
            setForm({ ...form, mobileNo: e })

            setOtp(true);

        }
        else {
            toast.error("Please enter valid mobile number")
            setOtp(false);
        }




        // showSpinner()
        // post(properties.USER_API + "/" + form)
        //     .then((resp) => {
        //         if (resp.data) {
        //             toast.success("user updated successfully");
        //         } else {
        //             toast.error("Error while updating user.");
        //         }
        //     })
        //     .finally(() => { hideSpinner() }

        //     )
    }
    const setUserType = (e) => {
        console.log(e)
        setForm({ ...form, userType: e.value })
    }
    const setLocation = (e) => {
        console.log(e)
        setForm({ ...form, country: e.value })
    }
    const createUser = () => {

        showSpinner()
        post(properties.USER_API, form)
            .then((resp) => {
                if (resp.data) {
                    toast.success("User created successfully.");
                } else {
                    toast.error("Error while creating user.");
                }
            })
            .finally(() => { hideSpinner() }

            )

    }
    const selectStyles = {
        option: (provided, state) => ({
            ...provided,
            borderBottom: "1px dotted pink",
            color: state.isSelected ? "blue" : "",
            fontSize: 16,
            backgroundColor: state.isSelected ? "#eee" : "",
            textAlign: "left",
            paddingBottom: "10",
        }),
        container: base => ({
            ...base,
            width: "100%"
        }),
        control: base => ({
            ...base,
            height: 35,
            marginBottom: 7,
            paddingBottom: 4,
            minHeight: 30,
            fontSize: 14,
            borderRadius: 0,
            width: "100%",
            textAlign: "left",
            cursor: "pointer"
        }),
        dropdownIndicator: base => ({
            ...base,
            display: "none"
        }),
        indicatorSeparator: base => ({
            ...base,
            display: "none"
        }),
        valueContainer: base => ({
            ...base,
            padding: 0,
            paddingLeft: 2,

        })
    };



    return (
        <div style={{ paddingTop: "30px" }}>
            <div className="authentication-bg authentication-bg-pattern " >
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
                                                <Link to="#" className="logo text-left">
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

                                        <>
                                            <fieldset className="scheduler-border">

                                                <div className="form-group pt-2">
                                                    <span className="col-form-label">Name : </span><span>{form.firstName + " " + form.lastName}</span>
                                                </div>

                                                <div className="form-group pt-2">
                                                    <span className="col-form-label">Gender : </span><span>{form.gender}</span>
                                                </div>

                                                <div className="form-group pt-2">
                                                    <span className="col-form-label">Country : </span><span>{form.country}</span>
                                                </div>
                                                <div className="form-group pt-2">
                                                    <span className="col-form-label">Email : </span><span>{form.email} &nbsp;{verified ? <Link to="#" className="badge badge-outline-success text-success">Verified</Link> : <></>}</span>
                                                </div>
                                                {verified ? !(otp) ? <>
                                                    <div className="form-group pt-2">
                                                        <label>Mobile Number</label>
                                                        <input className="form-control" type="text" id="code" placeholder="Enter Mobile Number" required
                                                            onChange={(e) => {
                                                                mob = e.target.value
                                                                setForm({
                                                                    ...form,
                                                                    mobileNo: e.target.value,
                                                                });
                                                                setError({ ...error, mobileNo: "" })
                                                            }} />
                                                        {error.mobileNo ? <span className="errormsg">{error.mobileNo}</span> : ""}
                                                    </div>
                                                    <div className="col-12 row pt-2 pr-0">
                                                        <div className="col-12 text-center">
                                                            <button className="ml-2 btn btn-primary waves-effect waves-light btn-block" onClick={updateMobile} >Get OTP</button>
                                                        </div>

                                                    </div></> : null : null
                                                }
                                                {
                                                    otp ?
                                                        <>
                                                            <div className="form-group pt-2">
                                                                <span className="col-form-label">Mobile No : </span><span>{mob}</span>
                                                            </div>
                                                            <div className="form-group pt-2" >
                                                                <label >OTP</label>
                                                                <input className="form-control" type="text" id="code" placeholder="Enter Mobile Number" required></input>
                                                            </div >
                                                            <div className="form-group pt-2" >
                                                                <label for="fullname">User Type</label>
                                                                <Select options={userType}
                                                                    styles={selectStyles}
                                                                    onChange={setUserType} />
                                                            </div >
                                                            <div className="form-group pt-2" >
                                                                <label for="fullname">Location</label>
                                                                <Select options={location}
                                                                    styles={selectStyles}
                                                                    onChange={setLocation}
                                                                />
                                                            </div >
                                                            <div className="col-12 row pt-2 pr-0">
                                                                <div className="col-6 text-center">
                                                                    <button className="ml-2 btn btn-primary waves-effect waves-light btn-block" type="button" onClick={(e) => createUser()}>Submit</button>
                                                                </div>
                                                                <div className="col-6 text-center"><button className="btn btn-secondary waves-effect waves-light btn-block" type="button" >Reset</button>
                                                                </div>
                                                            </div> </> : null
                                                }

                                                {
                                                    verified ? null :
                                                        <div className="col-12 row pt-2 pr-0">
                                                            <div className="col-12 text-center">
                                                                <button className="ml-2 btn btn-primary waves-effect waves-light btn-block" onClick={handleSubmit}>Validate</button>
                                                            </div>

                                                        </div>
                                                }

                                                {apiMessage !== "" ? <p className="error-msg">{apiMessage}</p> : ""}
                                            </fieldset >
                                        </>
                                        <div className="col-6 text-center " > <h5><Link to="`{${process.env.REACT_APP_BASE}/user/login}`">Back to Login</Link></h5></div >
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    );

}
export default RegisterVerify;
