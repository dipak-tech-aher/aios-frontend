import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InlineInput from "../../common/components/inlineInput"
import TaskContextPrefix from '../../common/components/inlineInput'
import { toast } from 'react-toastify';

const FileUploadTask = (props) => {
    const getTitle = props.handler.getTitle
    const taskId = props.data.taskId
    const setTitle = props.handler.setTitle
    const [displayMode, setDisplayMode] = useState('hide')
    const [taskContextPrefix, setTaskContextPrefix] = useState('');
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange
    const activityId = props.data.activityId
    const selectedTemplateType = "pdf"
    const fileName = ""
    const handleDeleteTransaction = props.handler.handleDeleteTransaction
    
    const handleOpen = () => {
        console.log('In handle Open')
        setDisplayMode('show')
    }
    const handleDone = () => {
        console.log('In handle Done')
    }
    const handleCancel = () => {
        setDisplayMode('hide')
    }
    const handlePfxChange = (id, value) => {
        handleTaskContextPrefixChange(activityId, id, value)
        setTaskContextPrefix(value)
    }
    const [methodOptions, setMethodOptions] = useState([])
    const validateFileInput = (e) => {
        const { target } = e;
        if (target.closest('.excel')) {
            if (selectedTemplateType === '') {
                toast.error('Please Select Template Type');
            }
        }
    }

    return (
        <div>
            <Accordion defaultActiveKey="10000">
                <Accordion.Toggle as={Button} variant="link" eventKey="0" className="col-12 p-0">
                    <div id="addtimeDiv" style={{ display: "block" }}>
                        <div className="listbg icolor6 mt-1">
                            <div className="col-12 row">
                                <div className="d-flex col-10 col pt-2 pl-3 pb-2">
                                    <i className="mb-auto mt-auto fas fa-user font-24 pr-3 icolor1"></i>
                                    <span className="mb-auto mt-auto bold text-dark">
                                    <label className="mt-1">Handover Interaction to Live Chat Agent</label><br></br>
                                        <InlineInput
                                            data={{
                                                id: 'taskTitle',
                                                placeHolder: 'Enter a title',
                                                value: getTitle(taskId),
                                                setterKey: taskId,
                                                width: '500px'
                                            }}
                                            handler={{
                                                setValue: setTitle
                                            }}
                                        />
                                    </span>
                                </div>
                                <div className="d-flex col-2 mt-auto mb-auto justify-content-end pr-0 mr-0">
                                    {
                                        (displayMode === 'hide') ?
                                            <>
                                                <i onClick={handleOpen} style={{ cursor: "pointer" }} className="fas fa-edit font-18 icolor1"></i>
                                                <i style={{ cursor: "pointer" }} onClick={() => handleDeleteTransaction(taskId)} className="mt-auto mb-auto fas fa-trash pl-2 font-16 icolor1"></i>
                                            </>
                                            :
                                            <>
                                                <i onClick={handleDone} style={{ cursor: "pointer" }} className="fas fa-check font-18 icolor1"></i>
                                                <i onClick={handleCancel} style={{ cursor: "pointer" }} className="ml-2 fas fa-times font-18 icolor1"></i>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Accordion.Toggle>
                {
                (displayMode === 'show') ?
                    <div>
                        <div className="col-12 pt-2">
                        <div className=" pl-2 bg-light border">
                            <h5 className="text-primary">File Upload</h5> 
                        </div>
                    </div>
                    <div className="col-12">
                        <br/>
                        <div className="form-group col-12">
                            <label for="email_address" className=" col-form-label text-md-left">Choose the file to Upload</label>
                        </div>
                        <div className="grid-x grid-padding-x">
                            <div className="small-10 small-offset-1 medium-8 medium-offset-2 cell">
                                <fieldset className="scheduler-border">
                                    <div className="ml-6 file-upload d-flex justify-content-center mt-3 cursor-pointer excel" >
                                        <div className="file-select" onClick={validateFileInput}>
                                            <div className="file-select-button" id="fileName" >Choose File</div>
                                            {
                                                selectedTemplateType !== '' &&
                                                <input
                                                    type="file"
                                                    accept=".xlsx, .xls"
                                                    id="file"
                                                    
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="ml-3 d-flex justify-content-center">
                                        <div className="file-select">
                                            <div className="file-select-name" id="noFile">{fileName}</div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        <br/><br/><br/>
                    </div>
                </div>
                : <></>}
            </Accordion>
        </div>
    );
};
export default FileUploadTask;