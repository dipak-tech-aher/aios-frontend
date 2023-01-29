import React, { useContext, useState } from "react";
import { AppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import { hideSpinner, showSpinner } from "../spinner";
import { remove } from "../../util/restUtil";
import { properties } from "../../properties";
import useDropDownArea from "./useDropDownArea";

const ProfileNav = () => {
    const [display, setDisplay] = useDropDownArea('profile');
    //const [display, setDisplay] = useState(false)
    // const handleClick = () => {
    //     let element = document.getElementById("profilePop");
    //     if (element.classList.contains("show")) {
    //         element.classList.remove("show");
    //     } else {
    //         element.classList.add("show");
    //     }
    // }

    const { auth, setAuth } = useContext(AppContext);

    let userDetail = auth.user;

    const handleOnLogout = () => {
        showSpinner();
        remove(properties.USER_API + "/logout/" + userDetail.userId)
            .then((resp) => {
                if (resp.status === 200) {
                    setAuth({});
                }
                sessionStorage.removeItem("auth");
                localStorage.clear();
            })
            .finally(hideSpinner);
        setDisplay(!display)
    }

    return (
        <>
            {auth && auth.user ? (
                <li className={`dropdown notification-list topbar-dropdown  ${display && "show"}`} id="profile" style={{ maxHeight: "130px" }}>
                    <span className="nav-link dropdown-toggle nav-user mr-0 waves-effect waves-light" onClick={() => { setDisplay(!display) }}>
                        <p style={{ lineHeight: '14px', textAlign: 'left', paddingTop: '12px' }}>Welcome<br />
                            <strong>
                                {(userDetail.firstName !== undefined) ? userDetail.firstName : ""} {(userDetail.lastName !== "undefined") ? userDetail.lastName : ""}</strong>
                            <i className="mdi mdi-chevron-down"></i><br />
                            {auth.currRoleDesc !== "" && auth.currRoleDesc !== undefined && auth.currDeptDesc !== "" && auth.currDeptDesc !== undefined ? auth.currRoleDesc + "-" + auth.currDeptDesc : "Admin - IT"}
                        </p>
                    </span>
                    {/* {
                        display ? */}
                    <div className={`profile-nav dropdown-menu dropdown-menu-right dropdown ${display && "show"}`}>
                        <div className="dropdown-header noti-title">
                            <h6 className="text-overflow m-0">Welcome !</h6>
                        </div>
                        <Link to={`${process.env.REACT_APP_BASE}/user/myprofile`} onClick={() => { setDisplay(!display) }} className="dropdown-item notify-item">
                            <i className="fe-user"></i>
                            <span>My Profile</span>
                        </Link>

                        <Link to="/" className="dropdown-item notify-item" onClick={() => { setDisplay(!display) }}>
                            <i className="fe-lock"></i>
                            <span>Lock Screen</span>
                        </Link>

                        <div className="dropdown-divider"></div>

                        <span onClick={handleOnLogout} className="notify-item" >
                            <i className="fe-log-out"></i>
                            <span>Logout</span>
                        </span>
                    </div>
                    {/* :
                            <></>
                    } */}
                </li >
            ) : (
                    ""
                )}
        </>
    );
};

export default ProfileNav;
