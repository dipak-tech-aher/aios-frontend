import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InlineInput from "../../common/components/inlineInput"
import TaskContextPrefix from '../../common/components/inlineInput'

const HumanHandoverTask = (props) => {
    const getTitle = props.handler.getTitle
    const taskId = props.data.taskId
    const setTitle = props.handler.setTitle
    const [displayMode, setDisplayMode] = useState('hide')
    const [taskContextPrefix, setTaskContextPrefix] = useState('');
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange
    const activityId = props.data.activityId
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
                    <div className="form-row col-12 ml-0 pl-1 border mt-2 mb-1">
                        <div classNamee="form-group">
                        <label htmlFor="method" className="col-form-label">Transfer Conversation to<span>*</span></label>
                            <select
                                id="method"
                                
                                className='form-control'
                                onChange={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                }}
                            >
                                <option value=''>Select</option>
                                <option value=''>None</option>
                                <option value=''>Name1</option>
                                <option value=''>Name2</option>
                                <option value=''>Name3</option>
                                <option value=''>Name4</option>
                                
                            </select>

                            <label className="mt-1">When human handover is successfully invoked</label>
                            <div className="d-flex">
                                <span className="mb-auto mt-auto bold text-dark">
                                    <TaskContextPrefix
                                        data={{
                                            id: 'taskContextAttribute' + taskId,
                                            placeHolder: 'Please wait while we connect you to our agent...',
                                            value: taskContextPrefix,
                                            setterKey: taskId,
                                            width: '500px'
                                        }}
                                        handler={{
                                            setValue: handlePfxChange
                                        }}
                                    />
                                </span>
                            </div>
                            
                            <label className="mt-1">When human handover is disabled</label>
                            <div className="d-flex">
                                <span className="mb-auto mt-auto bold text-dark">
                                    <TaskContextPrefix
                                        data={{
                                            id: 'taskContextAttribute' + taskId,
                                            placeHolder: 'Sorry! All our agents are unavailable at this time',
                                            value: taskContextPrefix,
                                            setterKey: taskId,
                                            width: '500px'
                                        }}
                                        handler={{
                                            setValue: handlePfxChange
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
export default HumanHandoverTask;