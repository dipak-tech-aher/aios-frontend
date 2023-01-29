import { Dropdown, Toast } from "bootstrap";
import React, { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatabaseTask from "./database";
import ApiTask from "./api";
import WaitTask from "./wait";
import ManualTask from "./manual";
import NotificationTask from "./notification";
import SLATask from "./sla";
import SendMessageTask from "./sendMessage";
import CollectInputTask from "./collectInput";
import HumanHandoverTask from "./humanHandover";
import FileUploadTask from "./fileUpload";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import { getNextId } from '../wf-utils'
import TransactionMgmtModal from 'react-modal'
import { toast } from "react-toastify";
import ActivityContextPrefix from '../../common/components/inlineInput'
import { unstable_batchedUpdates } from 'react-dom';

let clone = require('clone');

const TasksLayout = (props) => {

    const customStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            maxHeight: '100%'
        }
    };


    const setIsStepConfigOpen = props.handler.setIsStepConfigOpen
    const activityId = props.data.activityId
    const activityName = props.data.activityName
    const taskStepConfig = props.data.taskStepConfig
    const wfConfig = props.data.wfConfig
    const wfSchema = props.data.wfSchema

    const setTaskStepConfig = props.handler.setTaskStepConfig
    const setWFSchema = props.handler.setWFSchema
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange

    const [showTaskList, setShowTaskList] = useState(false);

    const [transactionMgmtPopupOpen, setTransactionMgmtPopupOpen] = useState(false);

    const [transactionName, setTransactionName] = useState('');

    const [transactionId, setTransactionId] = useState(-1);

    const [transactionMarkers, setTransactionMarkers] = useState([]);

    const [taskIds, setTaskIds] = useState([]);

    const [otherTransactionTaskIds, setOtherTransactionTaskIds] = useState([]);

    const [activityContextPrefix, setActivityContextPrefix] = useState('');

    useEffect(() => {

        // console.log('useEffect 1', transactionId)

        let markers = []
        let localACtivityContextPrefix = ''

        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let t of taskStepConfig) {
                if (t.activityId === activityId) {
                    if (t.activityContextPrefix && t.activityContextPrefix !== '') {
                        localACtivityContextPrefix = t.activityContextPrefix
                    } else {
                        localACtivityContextPrefix = activityId
                    }
                    if (t.transactions && t.transactions.length > 0) {
                        // console.log('transactions', JSON.stringify(t.transactions))
                        for (let tsk of t.tasks) {
                            for (let txn of t.transactions) {
                                if (txn.taskIds && txn.taskIds.includes(tsk.taskId)) {
                                    let found = false
                                    for (let m of markers) {
                                        // console.log('checkIds', m.id, txn.id)
                                        if (m.id === txn.id) {
                                            found = true
                                            if (!m.startTaskId) {
                                                m.startTaskId = tsk.taskId
                                            } else {
                                                m.endTaskId = tsk.taskId

                                            }
                                            m.transactionName = txn.transactionName
                                            // console.log('setTransactionMarkers1', JSON.stringify(markers))
                                            break
                                        }
                                    }
                                    if (!found) {
                                        markers.push({
                                            transactionName: txn.transactionName,
                                            id: txn.id,
                                            startTaskId: tsk.taskId
                                        })
                                        // console.log('setTransactionMarkers2', JSON.stringify(markers))
                                    }
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        // console.log('setTransactionMarkers', JSON.stringify(markers))
        setTransactionMarkers(markers)
        setActivityContextPrefix(localACtivityContextPrefix)
    }, [taskStepConfig])

    useEffect(() => {

        // console.log('useEffect 2', transactionId)

        let tIds = []
        let tName = ''
        let otherTIds = []

        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let t of taskStepConfig) {
                if (t.activityId === activityId) {
                    if (t.transactions && t.transactions.length > 0) {
                        // console.log('transactions', JSON.stringify(t.transactions))
                        for (let txn of t.transactions) {
                            if (txn.id === transactionId) {
                                tIds.push(...txn.taskIds)
                                tName = txn.transactionName
                            } else {
                                otherTIds.push(...txn.taskIds)
                            }
                        }
                    }
                }
            }
        }
        // console.log('setTaskIds', JSON.stringify(tIds), tName, otherTIds)
        setTaskIds(tIds)
        setOtherTransactionTaskIds(otherTIds)
        setTransactionName(tName)

        if (transactionId !== -1) {

        }

    }, [transactionId])

    const setTitle = (taskId, title) => {

        // console.log('setTitle', taskId, title, taskStepConfig)

        setTaskStepConfig((prevState) => {
            const newState = clone(prevState)

            if (title && newState && newState.length > 0) {
                for (let t of newState) {
                    let breakLoop = false
                    // console.log(t.activityId, activityId)
                    if (t.activityId === activityId) {
                        // console.log('t.tasks.length', t.tasks.length)
                        if (t.tasks && t.tasks.length > 0) {
                            for (let s of t.tasks) {
                                // console.log(s.taskId, taskId)
                                if (s.taskId === taskId) {
                                    s.taskName = title
                                    breakLoop = true
                                    break
                                }
                            }
                        }
                        // console.log('t.taskId', t.taskId, taskId)
                    }
                    if (breakLoop) {
                        break
                    }
                }
            }
            return newState
        })
    }

    const getTitle = (taskId) => {
        let title = ''
        // console.log('getTitle', taskId)
        if (taskStepConfig && taskStepConfig.length > 0) {
            // console.log('taskStepConfig', taskStepConfig)
            for (let t of taskStepConfig) {
                if (t.activityId === activityId) {
                    if (t.tasks && t.tasks.length > 0) {
                        for (let s of t.tasks) {
                            if (s.taskId === taskId) {
                                title = s.taskName
                            }
                        }
                    }
                }
            }
        }
        return title
    }

    const adddbFunction = () => {
        setShowTaskList(false);

        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'DB'
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addTransactionFunction = () => {
        setShowTaskList(false);
        setTransactionId(-1)
        setTransactionMgmtPopupOpen(true)
    }

    const addapiFunction = (id) => {
        setShowTaskList(false);
        //taskList.addTasks.push(<ApiTask data={{id : taskList.addTasks.length+1}}/>);

        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'API'
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })

    }
    const addWaitFunction = (id) => {
        setShowTaskList(false);
        //taskList.addTasks.push(<WaitTask data={{id : taskList.addTasks.length+1}}/>);
    }
    const addManualFunction = (id) => {
        setShowTaskList(false);
        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'MANUAL',
                        assignments: []
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addNotificationFunction = (id) => {
        setShowTaskList(false);
        //taskList.addTasks.push(<NotificationTask data={{id : taskList.addTasks.length+1}}/>);

        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        type: 'NOTIFICATION'
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addSLAFunction = (id) => {
        setShowTaskList(false);
        //taskList.addTasks.push(<SLATask data={{id : taskList.addTasks.length+1}}/>);

        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        type: 'SLA'
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addSendMessageFunction = (id) => {
        setShowTaskList(false);
        //taskList.addTasks.push(<NotificationTask data={{id : taskList.addTasks.length+1}}/>);

        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        type: 'SENDMESSAGE'
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addCollectInputFunction = (id) => {
        setShowTaskList(false);
        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'COLLECTINPUT',
                        assignments: []
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addHumanHandoverFunction = () => {
        setShowTaskList(false);
        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'HUMANHANDOVER',
                        assignments: []
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const addFileUploadFunction = () => {
        setShowTaskList(false);
        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.tasks) {
                        a.tasks = []
                    }
                    const nextId = getNextId(a.tasks, 'taskId')
                    a.tasks.push({
                        taskId: nextId,
                        taskContextPrefix: 'task_' + nextId,
                        type: 'FILEUPLOAD',
                        assignments: []
                    })
                }
            }
            // console.log('adddbFunction', newState)
            return newState
        })
    }

    const handleTransactionManagementDone = () => {

        if (!transactionName || transactionName.trim() === '') {
            toast.error('Please assign a name for the transaction to differentiate multiple transactions')
            return false
        }
        setTaskStepConfig((prevState) => {

            // console.log('adddbFunction', activityId, prevState)

            const newState = clone(prevState)

            for (let a of newState) {
                if (a.activityId === activityId) {
                    if (!a.transactions) {
                        a.transactions = []
                    }
                    let found = false
                    for (let t of a.transactions) {
                        if (t.id === transactionId) {
                            t.transactionName = transactionName
                            t.taskIds = taskIds
                        }
                    }
                    if (!found) {
                        const nextId = getNextId(a.transactions, 'id')
                        a.transactions.push({
                            id: nextId,
                            transactionName: transactionName,
                            taskIds: taskIds
                        })
                    }
                }
            }
            // console.log('handleTransactionManagementDone', newState)
            return newState
        })
        setTransactionMgmtPopupOpen(false)
    }

    const handleTransactionChange = (e, id) => {
        // console.log(e.target.checked, id)
        setTaskIds((prevState) => {
            // console.log('prevState', prevState)
            let tIds = []
            let found = false
            for (let t of prevState) {
                if (t === id) {
                    if (e.target.checked) {
                        tIds.push(t)
                        found = true
                    }
                } else {
                    tIds.push(t)
                }
            }
            if (!found && e.target.checked) {
                tIds.push(id)
            }
            return tIds
        })
    }

    const handleEditTransaction = (id) => {
        setTransactionId(id)
        setTransactionMgmtPopupOpen(true)
    }

    const handlePfxChange = (id, value) => {
        //console.log('value of activity name is ', value)
        handleTaskContextPrefixChange(id,'activityContextPrefix' ,value)
        setActivityContextPrefix(value)
    }

    const handleDeleteTransaction = (id) =>{
        let taskName=null
        const WorkFlowSchema = clone(wfSchema)
        let taskStepConfigClone = clone(taskStepConfig)

        for(let a in WorkFlowSchema.properties){
            if (WorkFlowSchema.properties[a].objType && WorkFlowSchema.properties[a].objType === 'bpmn') {
                if (WorkFlowSchema.properties[a].activityId === activityId) {
                    for(let n in WorkFlowSchema.properties[a].properties){
                        if(WorkFlowSchema.properties[a].properties[n].taskId && WorkFlowSchema.properties[a].properties[n].taskId === id){
                            taskName=n
                        }
                    }
                    delete WorkFlowSchema.properties[activityId].properties[taskName];
                }
            }
        }
        let count=-1
        for (let t of taskStepConfigClone){
            if(t.activityId === activityId){
                for (let s of t.tasks){
                    count++
                    if(s.taskId === id){
                        break;
                    }
                }
             t.tasks.splice(count, 1);
            }
        }

        unstable_batchedUpdates(()=>{
            setTaskStepConfig(taskStepConfigClone)
            setWFSchema(WorkFlowSchema)
        })
    }

    return (
        <div className="form-popup" id="myForm-2" >
            <div className="form-container p-0">
                <div className="p-0" role="document">
                    <div className="modal-content">
                        <div className="modal-header p-0 m-0">
                            <h5 className="modal-title p-2" id="scrollableModalTitle">Activity Configuration - {(activityName && activityName !== '') ? activityName : activityId}</h5>
                            <button type="button" className="close p-0 mr-1" onClick={() => setIsStepConfigOpen(false)} data-dismiss="modal" aria-label="Close" >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body pt-0">
                            <div className="pt-0">
                                <div className="form-row col-12 pl-1 border mt-1 mb-2 ml-0 pb-1">
                                    <div classNamee="form-group">
                                        <label className="mt-1">Activity Context Prefix</label>
                                        <div className="d-flex">
                                            <span className="mb-auto mt-auto bold text-dark">
                                                <ActivityContextPrefix
                                                    data={{
                                                        id: 'activityContextAttribute',
                                                        placeHolder: 'Enter Activity Context Prefix',
                                                        value: activityContextPrefix,
                                                        setterKey: activityId,
                                                        width: '500px'
                                                    }}
                                                    handler={{
                                                        setValue: handlePfxChange
                                                    }}
                                                />
                                            </span>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                                <section className="d-flex justify-content-between">
                                    <div>
                                        <h5>Tasks Definition</h5>
                                    </div>
                                    <div className="wrapper-demo">
                                        <div className="dropdown">
                                            <button className="btn btn-primary dropdown-toggle" id="dropdownMenuLink" value={showTaskList}
                                                onClick={(e) => {
                                                    if (e) {
                                                        // e.preventDefault()
                                                        // e.stopPropagation()
                                                        // if (e.nativeEvent) {
                                                        //     e.nativeEvent.stopImmediatePropagation();
                                                        // }
                                                    }
                                                    // console.log('showTaskList', showTaskList)
                                                    setShowTaskList(!showTaskList);
                                                }}
                                            >
                                                Add Tasks <i className="mdi mdi-menu-down font-16"></i>
                                            </button>
                                            <div className={(showTaskList ? "dropdown-menu dropdown-menu-right show" : "dropdown-menu dropdown-menu-right hide")}>
                                                <ul style={{ marginBottom: "0px" }}>
                                                    <li key="db" className="dropdown-item cursor-pointer" onClick={adddbFunction}><i className="fas fa-database font-16 pr-1 icolor1"></i>DB Action</li>
                                                    <li key="trans" className="dropdown-item cursor-pointer" onClick={addTransactionFunction}><i className="fas fa-database font-16 pr-1 icolor1"></i>Add Transaction</li>
                                                    <li key="api" className="dropdown-item cursor-pointer" onClick={addapiFunction}><i className="fas fa-globe font-16 pr-1 icolor2"></i>API Call</li>
                                                    <li key="manual" className="dropdown-item cursor-pointer" onClick={addManualFunction}><i className="fas fa-user font-16 pr-1 icolor6"></i>Manual Task</li>
                                                    <li key="notitifcation" className="dropdown-item cursor-pointer" onClick={addNotificationFunction}><i className="fas fa-envelope font-16 pr-1 icolor6"></i>Notification</li>
                                                    <li key="sla" className="dropdown-item cursor-pointer" onClick={addSLAFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor3"></i>SLA</li>
                                                    <li key="sendMsg" className="dropdown-item cursor-pointer" onClick={addSendMessageFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor3"></i>Send message</li>
                                                    <li key="collectInput" className="dropdown-item cursor-pointer" onClick={addCollectInputFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor3"></i>Collect input</li>
                                                    <li key="humanHandOver" className="dropdown-item cursor-pointer" onClick={addHumanHandoverFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor3"></i>Human handover</li>
                                                    <li key="fileUpload" className="dropdown-item cursor-pointer" onClick={addFileUploadFunction}><i className="mdi mdi-calendar-clock font-16 pr-1 icolor3"></i>File upload</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <div id="content" className="pt-1 mt-1">
                                    {
                                        (taskStepConfig && taskStepConfig.length > 0) ?
                                            taskStepConfig.map((m) => (
                                                (m.activityId === activityId) ?
                                                    (m.tasks && m.tasks.length > 0) ?
                                                        m.tasks.map((t) => {
                                                            return (
                                                                <>
                                                                    {
                                                                        (transactionMarkers && transactionMarkers.length > 0) ?
                                                                            transactionMarkers.map((tm) => (
                                                                                (tm.startTaskId === t.taskId) ?
                                                                                    <div className="mt-2 m-0 p-0 form-row col-12 d-flex justify-content-between  align-items-center">
                                                                                        <div className="flex-fill">
                                                                                            <hr />
                                                                                        </div>
                                                                                        <div>
                                                                                            <i className="ml-1 fas fa-caret-square-down font-16 mr-2"></i>
                                                                                            <strong>
                                                                                                <span>Begin Transaction - {tm.transactionName}</span>
                                                                                            </strong>
                                                                                        </div>
                                                                                        <i onClick={
                                                                                            () => {
                                                                                                handleEditTransaction(tm.id)
                                                                                            }
                                                                                        }
                                                                                            style={{ cursor: "pointer" }} className="ml-2 mb-1 fas fa-edit font-18 icolor1"></i>
                                                                                        <i style={{ cursor: "pointer" }} className="ml-2 mr-2 mb-1 fas fa-trash font-16 icolor1"></i>
                                                                                        <div className="flex-fill">
                                                                                            <hr />
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    <></>
                                                                            ))
                                                                            : <></>
                                                                    }
                                                                    {
                                                                        (t.type === 'DB') ?
                                                                            <DatabaseTask
                                                                                key={'DBTask-' + t.taskId}
                                                                                data={{
                                                                                    activityId: activityId,
                                                                                    taskId: t.taskId,
                                                                                    activityContextPrefix: activityContextPrefix,
                                                                                    taskStepConfig: taskStepConfig,
                                                                                    wfConfig: wfConfig,
                                                                                    wfSchema: wfSchema
                                                                                }}
                                                                                handler={{
                                                                                    setTaskStepConfig: setTaskStepConfig,
                                                                                    getTitle: getTitle,
                                                                                    setTitle: setTitle,
                                                                                    setWFSchema: setWFSchema,
                                                                                    handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                    handleDeleteTransaction
                                                                                }}
                                                                            />
                                                                            :
                                                                            (t.type === 'API') ?
                                                                                <ApiTask
                                                                                    key={'APITask-' + t.taskId}
                                                                                    data={{
                                                                                        activityId: activityId,
                                                                                        activityContextPrefix: activityContextPrefix,
                                                                                        taskId: t.taskId,
                                                                                        taskStepConfig: taskStepConfig,
                                                                                        wfConfig: wfConfig,
                                                                                        wfSchema: wfSchema
                                                                                    }}
                                                                                    handler={{
                                                                                        setTaskStepConfig: setTaskStepConfig,
                                                                                        getTitle: getTitle,
                                                                                        setTitle: setTitle,
                                                                                        setWFSchema: setWFSchema,
                                                                                        handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                        handleDeleteTransaction
                                                                                    }}
                                                                                />
                                                                                :
                                                                                (t.type === 'MANUAL') ?
                                                                                    <ManualTask
                                                                                        key={'ManualTask-' + t.taskId}
                                                                                        data={{
                                                                                            activityId: activityId,
                                                                                            activityContextPrefix: activityContextPrefix,
                                                                                            id: t.taskId,
                                                                                            taskId: t.taskId,
                                                                                            taskStepConfig: taskStepConfig,
                                                                                            wfConfig: wfConfig,
                                                                                            wfSchema: wfSchema
                                                                                        }}
                                                                                        handler={{
                                                                                            setTaskStepConfig: setTaskStepConfig,
                                                                                            getTitle: getTitle,
                                                                                            setTitle: setTitle,
                                                                                            setWFSchema: setWFSchema,
                                                                                            handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                            handleDeleteTransaction
                                                                                        }}
                                                                                    />
                                                                                    :
                                                                                    (t.type === 'NOTIFICATION') ?
                                                                                        <NotificationTask
                                                                                            key={'NotificationTask-' + t.taskId}
                                                                                            data={{
                                                                                                id: t.taskId,
                                                                                                taskId: t.taskId,
                                                                                                taskStepConfig: taskStepConfig,
                                                                                                wfConfig: wfConfig
                                                                                            }}
                                                                                            handler={{
                                                                                                setTaskStepConfig: setTaskStepConfig,
                                                                                                getTitle: getTitle,
                                                                                                setTitle: setTitle,
                                                                                                handleDeleteTransaction
                                                                                            }}
                                                                                        />
                                                                                        :
                                                                                        (t.type === 'SLA') ?
                                                                                            <SLATask
                                                                                                key={'SLATask-' + t.taskId}
                                                                                                data={{
                                                                                                    id: t.taskId,
                                                                                                    taskId: t.taskId,
                                                                                                    taskStepConfig: taskStepConfig,
                                                                                                    wfConfig: wfConfig
                                                                                                }}
                                                                                                handler={{
                                                                                                    setTaskStepConfig: setTaskStepConfig,
                                                                                                    getTitle: getTitle,
                                                                                                    setTitle: setTitle,
                                                                                                    handleDeleteTransaction
                                                                                                }}
                                                                                            />
                                                                                            :
                                                                                            (t.type === 'SENDMESSAGE') ?
                                                                                                <SendMessageTask
                                                                                                    key={'SendMessageTask-' + t.taskId}
                                                                                                    data={{
                                                                                                        activityId: activityId,
                                                                                                        activityContextPrefix: activityContextPrefix,
                                                                                                        id: t.taskId,
                                                                                                        taskId: t.taskId,
                                                                                                        taskStepConfig: taskStepConfig,
                                                                                                        wfConfig: wfConfig,
                                                                                                        wfSchema: wfSchema
                                                                                                    }}
                                                                                                    handler={{
                                                                                                        setTaskStepConfig: setTaskStepConfig,
                                                                                                        getTitle: getTitle,
                                                                                                        setTitle: setTitle,
                                                                                                        setWFSchema: setWFSchema,
                                                                                                        handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                                        handleDeleteTransaction
                                                                                                    }}
                                                                                                />
                                                                                                :
                                                                                                (t.type === 'COLLECTINPUT') ?
                                                                                                    <CollectInputTask
                                                                                                        key={'CollectInputTask-' + t.taskId}
                                                                                                        data={{
                                                                                                            activityId: activityId,
                                                                                                            activityContextPrefix: activityContextPrefix,
                                                                                                            id: t.taskId,
                                                                                                            taskId: t.taskId,
                                                                                                            taskStepConfig: taskStepConfig,
                                                                                                            wfConfig: wfConfig,
                                                                                                            wfSchema: wfSchema
                                                                                                        }}
                                                                                                        handler={{
                                                                                                            setTaskStepConfig: setTaskStepConfig,
                                                                                                            getTitle: getTitle,
                                                                                                            setTitle: setTitle,
                                                                                                            setWFSchema: setWFSchema,
                                                                                                            handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                                            handleDeleteTransaction
                                                                                                        }}
                                                                                                    />
                                                                                                    :
                                                                                                    (t.type === 'HUMANHANDOVER') ?
                                                                                                        <HumanHandoverTask
                                                                                                            key={'HumanHandoverTask-' + t.taskId}
                                                                                                            data={{
                                                                                                                activityId: activityId,
                                                                                                                activityContextPrefix: activityContextPrefix,
                                                                                                                id: t.taskId,
                                                                                                                taskId: t.taskId,
                                                                                                                taskStepConfig: taskStepConfig,
                                                                                                                wfConfig: wfConfig,
                                                                                                                wfSchema: wfSchema
                                                                                                            }}
                                                                                                            handler={{
                                                                                                                setTaskStepConfig: setTaskStepConfig,
                                                                                                                getTitle: getTitle,
                                                                                                                setTitle: setTitle,
                                                                                                                setWFSchema: setWFSchema,
                                                                                                                handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                                                handleDeleteTransaction
                                                                                                            }}
                                                                                                        />
                                                                                                        :
                                                                                                        (t.type === 'FILEUPLOAD') ?
                                                                                                            <FileUploadTask
                                                                                                                key={'FileUploadTask-' + t.taskId}
                                                                                                                data={{
                                                                                                                    activityId: activityId,
                                                                                                                    activityContextPrefix: activityContextPrefix,
                                                                                                                    id: t.taskId,
                                                                                                                    taskId: t.taskId,
                                                                                                                    taskStepConfig: taskStepConfig,
                                                                                                                    wfConfig: wfConfig,
                                                                                                                    wfSchema: wfSchema
                                                                                                                }}
                                                                                                                handler={{
                                                                                                                    setTaskStepConfig: setTaskStepConfig,
                                                                                                                    getTitle: getTitle,
                                                                                                                    setTitle: setTitle,
                                                                                                                    setWFSchema: setWFSchema,
                                                                                                                    handleTaskContextPrefixChange: handleTaskContextPrefixChange,
                                                                                                                    handleDeleteTransaction
                                                                                                                }}
                                                                                                            />
                                                                                                            :
                                                                                                            <></>
                                                                    }
                                                                    {
                                                                        (transactionMarkers && transactionMarkers.length > 0) ?
                                                                            transactionMarkers.map((tm) => (
                                                                                (tm.endTaskId === t.taskId) ?
                                                                                    <div className="mt-2 m-0 p-0 form-row col-12 d-flex justify-content-between align-items-center">
                                                                                        <div className="flex-fill">
                                                                                            <hr />
                                                                                        </div>
                                                                                        <div>
                                                                                            <i className="fas fa-caret-square-up font-16 mr-2"></i>
                                                                                            <strong>
                                                                                                <span>End Transaction - {tm.transactionName}</span>
                                                                                            </strong>
                                                                                        </div>
                                                                                        <div className="flex-fill">
                                                                                            <hr />
                                                                                        </div>
                                                                                    </div>
                                                                                    :
                                                                                    <></>
                                                                            ))
                                                                            : <></>
                                                                    }
                                                                </>
                                                            )
                                                        })
                                                        :
                                                        <span>No tasks added yet</span>
                                                    :
                                                    <></>
                                            ))
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    (transactionMgmtPopupOpen) ?
                        <TransactionMgmtModal isOpen={transactionMgmtPopupOpen} onRequestClose={() => setTransactionMgmtPopupOpen(false)} contentLabel="Decision Modal" style={customStyles}>
                            <div className="form-popup" id="myForm-2" >
                                <div className="form-container p-0">
                                    <div className="p-0" role="document">
                                        <div className="modal-content">
                                            <div className="modal-header p-0 m-0">
                                                <h5 className="modal-title p-2" id="scrollableModalTitle">Transaction Management Configuration</h5>
                                                <button type="button" className="close p-0 mr-1" onClick={() => setTransactionMgmtPopupOpen(false)} data-dismiss="modal" aria-label="Close" >
                                                    <span aria-hidden="true">&times;</span>
                                                </button>
                                            </div>
                                            <div className="modal-body pt-0">
                                                <div className="pt-0">
                                                    <div id="content" className="pt-1">
                                                        {
                                                            (taskStepConfig && taskStepConfig.length > 0) ?
                                                                <ul>
                                                                    <li key="note-1" className="mt-2">
                                                                        <i className="fas fa-dot-circle font-12 pr-1 icolor1"></i>Only database tasks will be listed below for including in transaction
                                                                    </li>
                                                                    <li key="note-2" className="mt-2">
                                                                        <i className="fas fa-dot-circle font-12 pr-1 icolor1"></i>There must be atleast 1 Insert or Update Task in the transaction
                                                                    </li>
                                                                </ul>
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (taskStepConfig && taskStepConfig.length > 0) ?
                                                                <div className="form-row col-12">
                                                                    <div className="col-6 form-group">
                                                                        <label htmlFor="fld-transaction" className="col-form-label">Transaction Name<span>*</span></label>
                                                                        <input
                                                                            key={'transaction'}
                                                                            id={'fld-transaction'}
                                                                            type="text"
                                                                            className='form-control'
                                                                            value={transactionName}
                                                                            onChange={(event) => {
                                                                                // event.preventDefault()
                                                                                // event.stopPropagation()
                                                                                // if (event.nativeEvent) {
                                                                                //     event.nativeEvent.stopImmediatePropagation();
                                                                                // }
                                                                                setTransactionName(event.target.value)
                                                                            }}
                                                                            style={{ fontSize: "0.7rem" }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                :
                                                                <></>
                                                        }
                                                        {/* console.log('taskIds', taskIds) */}
                                                        {
                                                            (taskStepConfig && taskStepConfig.length > 0) ?
                                                                taskStepConfig.map((m) => (
                                                                    (m.activityId === activityId) ?
                                                                        (m.tasks && m.tasks.length > 0) ?
                                                                            m.tasks.map((t) => (
                                                                                (t.type === 'DB') ?
                                                                                    (otherTransactionTaskIds && !otherTransactionTaskIds.includes(t.taskId)) ?
                                                                                        <div className="row col-12 mt-2">
                                                                                            <div className="col-1">
                                                                                                <div className="custom-control custom-checkbox">
                                                                                                    <input key={'chk-' + t.taskId}
                                                                                                        type="checkbox"
                                                                                                        id={'chk-' + t.taskId}
                                                                                                        className="custom-control-input"
                                                                                                        checked={(taskIds && taskIds.includes(t.taskId)) ? "true" : ""}
                                                                                                        onChange={(e) => {
                                                                                                            handleTransactionChange(e, t.taskId)
                                                                                                        }} />
                                                                                                    <label className="custom-control-label cursor-pointer" htmlFor={'chk-' + t.taskId}></label>
                                                                                                </div>
                                                                                            </div>

                                                                                            <div className="col-6">
                                                                                                <span>{t.taskName}</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <></>

                                                                                    :
                                                                                    <></>

                                                                            ))
                                                                            :
                                                                            <span>No tasks added yet</span>
                                                                        :
                                                                        <></>
                                                                ))
                                                                :
                                                                <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer d-flex mt-2 justify-content-center">
                                                <button className="btn btn-primary" onClick={handleTransactionManagementDone} type="button">Done</button>
                                                <button className="btn btn-secondary" onClick={() => setTransactionMgmtPopupOpen(false)} type="button">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TransactionMgmtModal>
                        :
                        <></>
                }
            </div>
        </div>
    );
};
export default TasksLayout;