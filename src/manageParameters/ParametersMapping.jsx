
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { number, string } from "yup";
import { properties } from "../properties";
import { get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";


const ParametersMapping = () => {

    return (
        <>
            <div id="search-modal-mapping" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Map Problem Code to Dept/Service Type/Ticket Type</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                    <hr />
                </div>
            </div>

        </>

    )
}
export default ParametersMapping;
