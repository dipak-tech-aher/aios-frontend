import React from "react";
import { Link } from "react-router-dom";

const GlobalSearch = () => {

    return (
        <li className="d-none d-lg-block">
            <form className="app-search">
                <div className="app-search-box dropdown">
                    <div className="input-group">
                        <input type="search" className="form-control" placeholder="Search forms.." id="top-search" />
                        <div className="input-group-append">
                            <button className="btn" type="submit">
                                <i className="fe-search"></i>
                            </button>
                        </div>
                    </div> 
                    <div style={{ display: "none+!important" }} className="dropdown-menu dropdown-lg d-block hidden" id="search-dropdown">
                        <div className="dropdown-header noti-title">
                            <h5 className="text-overflow mb-2">Auto Suggest</h5>
                        </div>

                        <Link className="dropdown-item notify-item" to="#">
                            <i className="fe-home mr-1"></i>
                            <span>123 in forms </span>
                        </Link>
                    </div>
                </div>
            </form>
        </li >
    );
};

export default GlobalSearch;
