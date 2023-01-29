import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const WaitTask = (props) => {

    return (
        <div>
            <Accordion defaultActiveKey="10000">
                <Accordion.Toggle as={Button} variant="link" eventKey="0" className="col-12 p-0">
                    <div id="addwaitDiv">
                        <div className="listbg icolor5 mt-1">
                            <div className="col-12 row">
                                <div className="col pt-2 pl-3 pb-2">
                                    <a href="javascript:void(null)">
                                        <i className="fas fa-clock font-24 pr-3 icolor5"></i><span className="bold text-dark">Wait htmlFor Create Customer And Account Task Status</span>
                                    </a>
                                </div>
                                <div className="d-flex col-1 mt-auto mb-auto justify-content-end pr-0 mr-0">
                                    <span data-toggle="collapse" data-target="#waitDiv"><i className="fas fa-edit font-16 icolor5 cursor-pointer"></i></span>
                                    <i className="fas fa-trash pl-2 font-16 icolor5 cursor-pointer"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <div id="waitDiv" style={{ borderLeft: "2px solid #ff9800", borderBottom: "2px solid #ff9800", borderRight: "2px solid #ff9800", padding: "5px" }}>
                        <h5>Title</h5>
                        <table className="table border mt-1">
                            <tbody>
                                <tr>
                                    <td>
                                        <input type="text" defaultValue="Wait htmlFor Create Customer And Account Task Status" style={{ width: "657px", height: "35px" }} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h5>Select Task</h5>
                        <table className="table border">
                            <thead>
                                <tr>
                                    <th>Task</th>
                                    <th colspan="2">Poll Frequency</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <select className="form-control">
                                            <option value="">Select</option>
                                            <option value="one" data-child-options="1|#2|#3">New Connection Task Steps</option>
                                            <option value="two" data-child-options="4|#CSS|#6">Invoke OCS Customer Status API</option>
                                            <option value="two" data-child-options="4|#CSS|#6" selected>Select Create Account And Service Status</option>
                                        </select>
                                    </td>
                                    <td>
                                        <select className="form-control">
                                            <option value="2" selected>15</option>
                                            <option value="2">30</option>
                                            <option value="2">45</option>
                                        </select>
                                    </td>
                                    <td className="pt-2" style={{ width: "50px" }}>
                                        Mins
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h5>Condition</h5>
                        <table className="table border rowfy">
                            <thead>
                                <tr>
                                    <th>Row No</th>
                                    <th>Parameter Name</th>
                                    <th>Operator</th>
                                    <th>Value Source</th>
                                    <th>Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>$createCustomerAccountStepStatus.status</td>
                                    <td>=</td>
                                    <td>Lookup</td>
                                    <td>DONE</td>
                                </tr>
                            </tbody>
                        </table>
                        <h5>Add Condition</h5>
                        <table className="table border rowfy">
                            <tbody>
                                <tr>
                                    <td style={{ verticalAlign: "middle" }}>Parameter Name</td>
                                    <td>
                                        <input type="text" defaultValue="$createCustomerAccountStepStatus.status" style={{ width: "489px", height: "35px" }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: "middle" }}>Operator</td>
                                    <td>
                                        <select className="form-control">
                                            <option value="1" selected>=</option>
                                            <option value="2">&lt;</option>
                                            <option value="3">&gt;</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: "middle" }}>Value Source</td>
                                    <td>
                                        <select className="form-control">
                                            <option value="1" selected>Lookup</option>
                                            <option value="2">Expression</option>
                                            <option value="3">Free Text</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ verticalAlign: "middle" }}>Value</td>
                                    <td>
                                        <select className="form-control">
                                            <option value="">NEW</option>
                                            <option value="1">WIP</option>
                                            <option value="1" selected>DONE</option>
                                            <option value="1">FAILED</option>
                                            <option value="1">ERROR</option>
                                            <option value="1">CLOSED</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <h5>Output</h5>
                        <table className="table mb-0">
                            <tr>
                                <td className="pt-2">
                                    <div className="custom-control custom-checkbox">
                                        <input type="checkbox" className="custom-control-input" checked="checked" id="customCheck1" />
                                        <label className="bold custom-control-label" htmlFor="customCheck1">Include in Output</label>
                                    </div>
                                </td>
                                <td>
                                    <input type="text" defaultValue="ocsCustomerSummaryOutput" style={{ width: "500px", height: "35px" }} />
                                </td>
                            </tr>
                        </table>
                    </div>
                </Accordion.Collapse>
            </Accordion>
        </div>

    );
};
export default WaitTask;