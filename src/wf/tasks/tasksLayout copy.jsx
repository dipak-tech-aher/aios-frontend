import { Dropdown } from "bootstrap";
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DataBaseTask from "./dataBase";
import ApiTask from "./api";
import WaitTask from "./wait";
import ManualTask from "./manual";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";

const TasksLayout = (props) => {

    const [showTaskList, setShowTaskList] = useState("hide");
    const [taskList, setTaskList] = useState({ DB:[], API:[], WAIT:[], MANUAL:[] } );


    const adddbFunction = () => {
    }
    const addapiFunction = () => {
    }
    const addnotificationFunction = () => {
    }
    const addslaFunction = () => {
    }
    const addtimeFunction = () => {
    }
    const addManualFunction = () => {
    }

    return(
        
        <div className="form-popup" id="myForm-2" >
            <div className="form-container p-0">
                <div className="p-0" role="document">
                    <div className="modal-content">
                        <div className="modal-header p-0 m-0">
                            <h5 className="modal-title p-2" id="scrollableModalTitle">Step - Configuration</h5>
                            <button type="button" className="close p-0 mr-1 mt-2" data-dismiss="modal" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body pt-0">
                            <div className="pt-0">
                                <section className="d-flex justify-content-between">
                                    <div>
                                        <h5>Tasks</h5>
                                    </div>
                                    <div className="wrapper-demo">                                
                                        <div className="dropdown">
                                            <Accordion.Toggle as={Button} variant="link" eventKey="0" className="col-12 p-0">
                                                <Link to="#0" className="btn btn-primary dropdown-toggle" id="dropdownMenuLink"                                                
                                                onClick={(e) => {
                                                    setShowTaskList({
                                                    showTaskList: "show",
                                                    });
                                                }}                                           
                                                >
                                                    Add Tasks <i className="mdi mdi-menu-down font-16"></i>
                                                </Link>
                                            </Accordion.Toggle>
                                            {/* console.log('showTaskList:::',showTaskList) */}
                                            <Accordion.Collapse eventKey="0">
                                                <div className={(showTaskList === "show" ? " dropdown-menu dropdown-menu-right show" : " dropdown-menu dropdown-menu-right hide")} aria-labelledby="dropdownMenuLink">
                                                    <Link to="#1"  onClick={adddbFunction}><i className="fas fa-database font-16 pr-1 icolor1"></i>DB Action</Link><br></br>
                                                    <Link to="#2"  onClick={addapiFunction}><i className="fas fa-globe font-16 pr-1 icolor2"></i>API Call</Link><br></br>
                                                    <Link to="#3"  onClick={addnotificationFunction}><i className="fas fa-envelope font-16 pr-1 icolor3"></i>Notification</Link><br></br>
                                                    <Link to="#4"  onClick={addslaFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor4"></i>SLA</Link><br></br>
                                                    <Link to="#5"  onClick={addtimeFunction}><i className="fas fa-clock font-16 pr-1 icolor5"></i>Wait</Link><br></br>
                                                    <Link to="#6"  onClick={addManualFunction}><i className="fas fa-user font-16 pr-1 icolor6"></i>Manual Task</Link>
                                                </div>   
                                            </Accordion.Collapse>                                        
                                        </div>                                                                  
                                    </div>
                                </section>

                                <select >
                                    <option className="fas fa-database font-16 pr-1 icolor1">DB Action</option>
                                    <option className="fas fa-database font-16 pr-1 icolor1">API Call</option>

                                </select>                              

                                <div id="content" className="pt-1">
                                   <DataBaseTask></DataBaseTask>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TasksLayout;