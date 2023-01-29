import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const SLATask = (props) => {
    const taskId = props.data.taskId
    const handleDeleteTransaction = props.handler.handleDeleteTransaction

    return (
        <div>
            <Accordion defaultActiveKey="10000">
                <Accordion.Toggle as={Button} variant="link" eventKey="0" className="col-12 p-0">
                    <div id="addtimeDiv" style={{ display: "block" }}>
                        <div className="listbg icolor6 mt-1">
                            <div className="col-12 row">
                                <div className="col pt-2 pl-3 pb-2">
                                    <a href="javascript:void(null)">
                                        <i className="fas fa-user font-24 pr-3 icolor6"></i><span className="bold text-dark">Define Task SLA</span>
                                    </a>
                                </div>
                                <div className="d-flex col-6 mt-auto mb-auto justify-content-end pr-0 mr-0">
                                    <i className="fas fa-edit font-16 icolor6 cursor-pointer"></i>
                                    <i onClick={() => handleDeleteTransaction(taskId)} className="fas fa-trash pl-2 font-16 icolor6 cursor-pointer"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div id="dbDiv" style={{ bordeLeft: "2px solid #ff9800", borderBottom: "2px solid #ff9800", borderRight: "2px solid #ff9800", padding: "5px" }}>
                        <div className="up-arw"><span><i className="mdi mdi-arrow-down-bold-circle-outline font-20"></i></span></div>
                        <h5>Title</h5>
                        <table className="table border mt-1">
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" value="New Connection Task Steps" style={{ width: "657px", height: "35px" }} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Accordion.Collapse>
            </Accordion>
        </div>
    );
};
export default SLATask;