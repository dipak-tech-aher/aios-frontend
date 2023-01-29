import React from "react";
import { Link } from "react-router-dom";

const Language = () => {

    return (
        <li className="dropdown d-lg-inline-block topbar-dropdown" id="switchLang">
            <span className="nav-link dropdown-toggle arrow-none waves-effect waves-light" data-toggle="dropdown" role="button" aria-haspopup="false" aria-expanded="false">
                EN - Eng<i className="mdi mdi-chevron-down"></i>
            </span>
            <div className="dropdown-menu dropdown-menu-right">
                <div className="dropdown-item">
                    <span className="align-middle">MS - Malay</span>
                </div>
            </div>
        </li>
    );
};

export default Language;
