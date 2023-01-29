import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InlineInput from "../../common/components/inlineInput"
import TaskContextPrefix from '../../common/components/inlineInput'
let clone = require('clone');

const CollectInputTask = (props) => {
    const getTitle = props.handler.getTitle
    const taskId = props.data.taskId
    const setTitle = props.handler.setTitle
    const [displayMode, setDisplayMode] = useState('hide')
    const [sendMessagePrefix, setSendMessagePrefix] = useState('');
    const [saveResponsePrefix, setSaveResponsePrefix] = useState('');
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange
    const activityId = props.data.activityId
    const setTaskStepConfig = props.handler.setTaskStepConfig
    const handleDeleteTransaction = props.handler.handleDeleteTransaction

    const handleOpen = () => {
        console.log('In handle Open')
        setDisplayMode('show')
    }
    const handleCancel = () => {
        setDisplayMode('hide')
    }
    const handlePfxChange = (id, value) => {
        console.log("handlePfxChange",id,value)
        handleTaskContextPrefixChange(activityId, id, value)
        setSendMessagePrefix(value)
    }
    const handleSaveResponse = (id, value) => {
        console.log("handleSaveResponse",id,value)
        handleTaskContextPrefixChange(activityId, id, value)
        setSaveResponsePrefix(value)
    }
    const [methodOptions, setMethodOptions] = useState([])
    const handleDone = () => {
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
        console.log('In handle Done')
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
                                    <label className="mt-1">Collect input ask a question to a user which requires a answer</label><br></br>
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
                                                <i style={{ cursor: "pointer" }} onClick={() => handleDeleteTransaction(taskId)}  className="mt-auto mb-auto fas fa-trash pl-2 font-16 icolor1"></i>
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
                    <div className="form-row col-12 ml-0 pl-1 border mt-2 mb-1">
                        <div classNamee="form-group">
                            <label className="mt-1">Send this message</label>
                            <div className="d-flex">
                                <span className="mb-auto mt-auto bold text-dark">
                                    <TaskContextPrefix
                                        data={{
                                            id: 'taskContextAttribute' + taskId,
                                            placeHolder: 'Enter Message',
                                            value: sendMessagePrefix,
                                            setterKey: taskId,
                                            width: '500px'
                                        }}
                                        handler={{
                                            setValue: handlePfxChange
                                        }}
                                    />
                                </span>
                            </div>
                            <label htmlFor="method" className="col-form-label">Input validation<span>*</span></label>
                            <select
                                id="method"
                                value="Text"
                                className='form-control'
                                onChange={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                }}
                            >
                                <option value='Select'>Select</option>
                                <option value='Text'>Text</option>
                                <option value='Name'>Name</option>
                                <option value='Email'>Email</option>
                                <option value='Phone'>Phone</option>
                                <option value='Regex'>Regex</option>
                                
                            </select>
                            <label className="mt-1">Save the response in this variable</label>
                            <div className="d-flex">
                                <span className="mb-auto mt-auto bold text-dark">
                                    <TaskContextPrefix
                                        data={{
                                            id: 'taskContextAttribute' + taskId,
                                            placeHolder: 'Enter Message',
                                            value: saveResponsePrefix,
                                            setterKey: taskId,
                                            width: '500px'
                                        }}
                                        handler={{
                                            setValue: handleSaveResponse
                                        }}
                                    />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                : <></>}
            </Accordion>
        </div>
    );
};
export default CollectInputTask;
/*
{
    (methodOptions && methodOptions.length) ?
        methodOptions.map((w) => (
            <option key={w.value} value={w.value}>{w.label}</option>
        ))
        :
        <></>
}
*/