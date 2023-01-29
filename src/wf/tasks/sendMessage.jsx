import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InlineInput from "../../common/components/inlineInput"
import TaskContextPrefix from '../../common/components/inlineInput'
let clone = require('clone');

const SendMessageTask = (props) => {
    const getTitle = props.handler.getTitle
    const taskId = props.data.taskId
    const setTitle = props.handler.setTitle
    const [displayMode, setDisplayMode] = useState('hide')
    const [taskContextPrefix, setTaskContextPrefix] = useState('');
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange
    const taskStepConfig = props.data.taskStepConfig
    const setTaskStepConfig = props.handler.setTaskStepConfig
    const handleDeleteTransaction = props.handler.handleDeleteTransaction

    const activityId = props.data.activityId
        const handleOpen = () => {
        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let a of taskStepConfig) {
                if (a.activityId === activityId) {
                    let localTaskContextPrefix = ''
                    for (let t of a.tasks) {
                        // console.log(a.activityId, t.taskId)
                        if (t.taskId === taskId) {
                            if(t.taskContextPrefix && t.taskContextPrefix !== '') {
                                localTaskContextPrefix = t.taskContextPrefix
                            } else {
                                localTaskContextPrefix = 'task_' + t.taskId
                            }
                            break
                        }
                    }
                    setTaskContextPrefix(localTaskContextPrefix)
                }
            }
        }
        setDisplayMode('show')
    }
    const handleDone = () => {
        console.log('In handle Done')
        setTaskStepConfig((prevState) => {

            // console.log('prevState', prevState)

            const newState = clone(prevState)
            //console.log(newState)
            if (newState && newState.length > 0) {

                for (let a of newState) {
                    console.log(a)
                    if (a.activityId === activityId) {
                        if (a.tasks && a.tasks.length > 0) {
                            for (let s of a.tasks) {
                                if (s.taskId === taskId) {
                                    // s.assignments = assignments
                                }
                            }
                        }
                    }
                }
            }
            // console.log('newState', newState)
            return newState
        })
        setDisplayMode('hide')
    }
    const handleCancel = () => {
        setDisplayMode('hide')
    }
    const handlePfxChange = (id, value) => {
        handleTaskContextPrefixChange(activityId, id, value)
        setTaskContextPrefix(value)
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
                                        <label className="mt-1">Send message will only send message to the user and not require a response back</label><br></br>
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
                        <div className="form-row col-12 ml-0 pl-1 border mt-2 mb-1">
                            <div classNamee="form-group">
                                <label className="mt-1">Send this message</label>
                                <div className="d-flex">
                                    <span className="mb-auto mt-auto bold text-dark">
                                        <TaskContextPrefix
                                            data={{
                                                id: 'taskContextAttribute' + taskId,
                                                placeHolder: 'Enter Message',
                                                value: taskContextPrefix,
                                                setterKey: taskId,
                                                width: '500px',
                                                height: '100px',
                                                inputType: "textArea"
                                            }}
                                            handler={{
                                                setValue: handlePfxChange
                                            }}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div> : <></>}
            </Accordion>
        </div>
    );
};
export default SendMessageTask;