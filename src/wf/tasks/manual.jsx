import React, { useRef, useState, useEffect } from "react";
import ActivityTaskSelect from 'react-select'
import RowDataModal from 'react-modal'
import { toast } from "react-toastify";
import { properties } from "../../properties";
import { showSpinner, hideSpinner } from "../../common/spinner";
import { get, post } from "../../util/restUtil";
import InlineInput from "../../common/components/inlineInput"
import OrgHierarchyViewer from "../../common/components/orgHierarchyViewer"
import { getNextId, formatValue, updateSchemaForQuerySQL } from '../wf-utils'
import RuleBuilder from "../../common/components/rule-builder"
import TaskContextPrefix from '../../common/components/inlineInput'

let clone = require('clone');

const ManualTask = (props) => {

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

    const activityId = props.data.activityId
    const taskId = props.data.taskId
    const taskStepConfig = props.data.taskStepConfig
    const wfConfig = props.data.wfConfig
    const wfSchema = props.data.wfSchema

    const setTaskStepConfig = props.handler.setTaskStepConfig
    const getTitle = props.handler.getTitle
    const setTitle = props.handler.setTitle
    const setWFSchema = props.handler.setWFSchema
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange    

    const [taskContextPrefix, setTaskContextPrefix] = useState('');

    const [isRowDataModalOpen, setIsRowDataModalOpen] = useState(false)

    const [displayMode, setDisplayMode] = useState('hide')

    const [assignmentTypes, setAssignmentTypes] = useState([])

    const [assignToViewEditMode, setAssignToViewEditMode] = useState({})

    const [selectedActivityTasks, setSelectedActivityTasks] = useState({})

    const [assignToSelectedRoles, setAssignToSelectedRoles] = useState([])

    const activityTaskListMst = useRef(null);

    const [actionLabelValue, setActionLabelValue] = useState({
        assignmentIdx: null,
        actionIdx: null,
        actionLabel: '',
        actionValue: ''
    })

    const heirarchyRoles = useRef()
    const rolesMaster = useRef()
    const statusLookups = useRef()

    const [assignments, setAssignments] = useState()
    const handleDeleteTransaction = props.handler.handleDeleteTransaction


    useEffect(() => {

        if (heirarchyRoles.current !== null) {
            showSpinner();
            get(properties.WORKFLOW_HIERARCHY_API)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {
                        heirarchyRoles.current = resp.data.orgHierarchy
                        rolesMaster.current = resp.data.rolesMaster
                    } else {
                        if (resp && resp.status) {
                            toast.error("Error fetching hierarchy for Workflow - " + resp.status + ', ' + resp.message);
                        } else {
                            toast.error("Unexpected error fetching hierarchy");
                        }
                    }
                }).finally(() => {
                    hideSpinner()
                });
        }

        const lookupTypes = ['INTERACTION_STATUS']

        showSpinner();
        post(properties.BUSINESS_ENTITY_API, lookupTypes)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    statusLookups.current = resp.data['INTERACTION_STATUS'].map((e) => ({ label: e.description, value: e.code }))
                } else {
                    if (resp && resp.status) {
                        toast.error("Error fetching status lookups for Workflow - " + resp.status + ', ' + resp.message);
                    } else {
                        toast.error("Unexpected error fetching status lookups");
                    }
                }
                if (resp.data) {
                }
            }).finally(hideSpinner);

        let manualActivityTaskList = []
        for (let a of taskStepConfig) {
            let tasksList = []
            if (a.tasks && a.tasks.length > 0) {
                for (let t of a.tasks) {
                    if (t.type === 'MANUAL') {
                        tasksList.push({
                            label: (t.taskName && t.taskName !== '') ? t.taskName + '(' + 'Task ' + t.taskId + ')' : 'Task ' + t.taskId,
                            value: t.taskId,
                            activityId: a.activityId
                        })
                    }
                }
                if (tasksList.length > 0) {
                    manualActivityTaskList.push({
                        label: (a.name && a.name !== '') ? a.name + '(' + a.activityId + ')': a.activityId,
                        options: tasksList
                    })
                }
            }
        }

        activityTaskListMst.current = manualActivityTaskList

    }, []);

    const handleOpen = () => {

        // console.log('handleOpen', taskStepConfig)

        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let a of taskStepConfig) {
                if (a.activityId === activityId) {
                    let asgmts
                    let localTaskContextPrefix = ''
                    let newAssignToViewEditMode = {}
                    let localAssignmentTypes = {}
                    let localSelectedActivityTasks = {}
                    for (let t of a.tasks) {
                        // console.log(a.activityId, t.taskId)
                        if (t.taskId === taskId) {

                            // console.log('t.assignments', t.assignments.length)

                            if(t.taskContextPrefix && t.taskContextPrefix !== '') {
                                localTaskContextPrefix = t.taskContextPrefix
                            } else {
                                localTaskContextPrefix = 'task_' + t.taskId
                            }
        
                            asgmts = t.assignments
                            if (asgmts && asgmts.length === 0) {
                                asgmts.push({
                                    assignmentId: 0,
                                    rules: [{
                                        level: 1,
                                        id: 1,
                                        rules: [],
                                        combinator: 'AND'
                                    }],
                                    assignByTask: {},
                                    assignmentType: "",
                                    assignedToDeptRoles: [],
                                    targetDeptRoles: [],
                                    actions: [],
                                    viewMode: 'view',
                                })
                            }
                            if (asgmts && asgmts.length > 0) {
                                let i = 0
                                for (let a of asgmts) {
                                    a.viewMode = 'view'
                                    newAssignToViewEditMode[a.assignmentId] = 'view'
                                    localAssignmentTypes[a.assignmentId] = a.assignmentType

                                    if (a.assignByTask && a.assignByTask.activityId && a.assignByTask.taskId) {
                                        for (let t of activityTaskListMst.current) {
                                            for (let o of t.options) {
                                                if (o.activityId === a.assignByTask.activityId && o.value === a.assignByTask.taskId) {
                                                    localSelectedActivityTasks[a.assignmentId] = {
                                                        label: o.label,
                                                        value: o.value,
                                                        activityId: o.activityId
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    i++
                                }
                            }
                            // console.log('handleOpen', t.where)

                            break
                        }
                    }
                    // console.log('localAssignmentTypes', localAssignmentTypes)
                    setTaskContextPrefix(localTaskContextPrefix)
                    setAssignmentTypes(localAssignmentTypes)
                    setSelectedActivityTasks(localSelectedActivityTasks)
                    setAssignments(asgmts)
                    setAssignToViewEditMode(newAssignToViewEditMode)
                }
            }
        }
        setDisplayMode('show')
    }

    const handleAssignmentRule = (rulesObj, key) => {
        let asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === key) {
                a.rules = rulesObj
                break
            }
        }
        setAssignments(asgmts)
    }

    const handleDone = () => {

        setTaskStepConfig((prevState) => {

            // console.log('prevState', prevState)

            const newState = clone(prevState)

            if (newState && newState.length > 0) {
                for (let a of newState) {
                    if (a.activityId === activityId) {

                        if (a.tasks && a.tasks.length > 0) {
                            for (let s of a.tasks) {
                                if (s.taskId === taskId) {
                                    s.assignments = assignments
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

    const handleAssignmentAdd = () => {
        let asgmts = clone(assignments)

        const nextId = getNextId(asgmts, 'assignmentId')

        asgmts.push({
            assignmentId: nextId,
            rules: [{
                level: 1,
                id: 1,
                rules: [],
                combinator: 'AND'
            }],
            assignedToDeptRoles: [],
            targetDeptRoles: [],
            actions: [],
            viewMode: 'view'
        })
        setAssignments(asgmts)
    }

    const handleAssignmentEdit = (idx) => {
        let asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === idx) {
                a.viewMode = 'edit'
            }
        }
        setAssignments(asgmts)
    }

    const handleAssignmentEditDone = (idx) => {
        let asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === idx) {
                a.viewMode = 'view'
                break
            }
        }
        setAssignments(asgmts)
    }

    const handleAssignmentEditCancel = (idx) => {
        let asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === idx) {
                a.viewMode = 'view'
                break
            }
        }
        setAssignments(asgmts)
    }

    const handleAssignmentDelete = (idx) => {
        let asgmts = clone(assignments)
        let pos = -1
        for (let a of asgmts) {
            pos++
            if (a.assignmentId === idx) {
                break
            }
        }
        asgmts.splice(pos, 1)
        setAssignments(asgmts)
    }

    const handleCancel = () => {
        setDisplayMode('hide')
    }

    const handleAddUpdateRow = () => {
        // console.log('handleAddUpdateRow', actionLabelValue)
        const asgmts = clone(assignments)
        if (actionLabelValue.actionIdx === null) {
            asgmts[actionLabelValue.assignmentIdx].actions.push({
                actionLabel: actionLabelValue.actionLabel,
                actionValue: actionLabelValue.actionValue
            })
        } else {
            asgmts[actionLabelValue.assignmentIdx].actions[actionLabelValue.actionIdx].actionLabel = actionLabelValue.actionLabel
            asgmts[actionLabelValue.assignmentIdx].actions[actionLabelValue.actionIdx].actionValue = actionLabelValue.actionValue
        }
        setAssignments(asgmts)
        setIsRowDataModalOpen(false)
    }

    const handleRowEdit = (idx1, idx2) => {
        setActionLabelValue({
            assignmentIdx: idx1,
            actionIdx: idx2,
            actionLabel: assignments[idx1].actions[idx2].actionLabel,
            actionValue: assignments[idx1].actions[idx2].actionValue
        })
        setIsRowDataModalOpen(true)
    }

    const handleRowDelete = (idx1, idx2) => {
        const asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === idx1) {
                delete asgmts[idx1].actions[idx2]
                break
            }
        }
        setAssignments(asgmts)

    }

    const handleAssignToDone = (idx) => {
        let asgmts = clone(assignments)
        console.log('selectedActivityTasks', selectedActivityTasks)
        for (let a of asgmts) {
            if (a.assignmentId === idx) {
                a.assignmentType = assignmentTypes[idx]
                if (assignmentTypes[idx] === 'BYTASK') {
                    asgmts[idx].assignByTask = {
                        activityId: selectedActivityTasks[idx].activityId,
                        taskId: selectedActivityTasks[idx].value
                    }
                    a.assignedToDeptRoles = []
                } else {
                    a.assignedToDeptRoles = assignToSelectedRoles[idx]
                    a.assignByTask = {}
                }
                break
            }
        }
        setAssignments(asgmts)
        handleAssignToViewEditMode(idx, 'view')
    }


    const handleAssignToRoleSelectDone = (idx, selectedRoles) => {
        let newAssignToSelectedRoles = clone(assignToSelectedRoles)
        newAssignToSelectedRoles[idx] = selectedRoles
        setAssignToSelectedRoles(newAssignToSelectedRoles)
    }

    const handleTargetRoleSelectDone = (idx, selectedRoles) => {
        // console.log('handleTargetRoleSelectDone', idx, selectedRoles)
        let asgmts = clone(assignments)
        for (let a of asgmts) {
            if (a.assignmentId === idx) {
                a.targetDeptRoles = selectedRoles
                break
            }
        }
        setAssignments(asgmts)
    }

    const handleAssignmentTypeChange = (idx, value) => {
        // console.log('handleAssignmentTypeChange', idx, value)
        let newAssignmentTypes = clone(assignmentTypes)
        newAssignmentTypes[idx] = value
        setAssignmentTypes(newAssignmentTypes)
    }

    const handleActivityTaskSelect = (selectedValue) => {
        // console.log('handleActivityTaskSelect', selectedValue)
        let newSelectedActivityTasks = clone(selectedActivityTasks)
        newSelectedActivityTasks[selectedValue.idx] = selectedValue
        console.log('newSelectedActivityTasks', newSelectedActivityTasks)
        setSelectedActivityTasks(newSelectedActivityTasks)
    }

    const handleAssignToViewEditMode = (idx, mode) => {
        let newAssignToViewEditMode = clone(assignToViewEditMode)
        newAssignToViewEditMode[idx] = mode
        setAssignToViewEditMode(newAssignToViewEditMode)
    }

    const getActivityListMst = (idx) => {
        let activityListOptions = clone(activityTaskListMst.current)
        console.log('activityListOptions', activityListOptions)
        let currentTaskPos = -1
        for (let a of activityListOptions) {
            let pos = -1
            for (let b of a.options) {
                pos++
                if(b.value === taskId && b.activityId === activityId) {
                    currentTaskPos = pos
                }
                b.idx = idx
            }
            if(currentTaskPos >= 0) {
                a.options.splice(currentTaskPos, 1)
            }
        }

        // console.log('activityListOptions', activityListOptions)
        return activityListOptions
    }

    const handlePfxChange = (id, value) => {
        handleTaskContextPrefixChange(activityId, id, value)
        setTaskContextPrefix(value)
    }

    return (
        <div key={props.id} id={props.id}>
            {
                // console.log('rendering')
            }
            <div id="manualTaskDiv">
                <div className="listbg icolor1 mt-1">
                    <div className="col-12 row">
                        <div className="d-flex col-10 col pt-2 pl-3 pb-2">
                            <i className="mb-auto mt-auto fas fa-user font-24 pr-3 icolor1"></i>
                            <span className="mb-auto mt-auto bold text-dark">
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
            {
                (displayMode === 'show') ?
                    <>
                        <div className="form-row col-12 ml-0 pl-1 border mt-2 mb-1">
                            <div classNamee="form-group">
                                <label className="mt-1">Task Context Prefix</label>
                                <div className="d-flex">
                                    <span className="mb-auto mt-auto bold text-dark">
                                        <TaskContextPrefix
                                            data={{
                                                id: 'taskContextAttribute' + taskId,
                                                placeHolder: 'Enter Activity Context Prefix',
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

                        {
                            (assignments && assignments.length > 0) ?
                                assignments.map((a) => (
                                    <div className="d-flex mt-2">
                                        <div id={"manualDiv-" + a.assignmentId} className="flex-grow-1 mt-1 p-1 border">
                                            <div className="form-row col-12 workflow-step-label-bg-color">
                                                <label className="col-form-label"><u>Dept Role Assignment Condition</u></label>
                                            </div>
                                            <div className="form-row col-12 workflow-step-bg-color">
                                                <div className="col-12 pr-0">
                                                    <RuleBuilder
                                                        data={{
                                                            ruleType: 'LOGIC',
                                                            rules: a.rules,
                                                            availableColumnOptions: [],
                                                            columnOptions: [],
                                                            fieldColumnOptions: [],
                                                            wfConfig: wfConfig,
                                                            taskId: taskId,
                                                            wfSchema: wfSchema,
                                                            keyRef: a.assignmentI,
                                                            viewMode: a.viewMode
                                                        }}
                                                        handler={{
                                                            setRules: handleAssignmentRule
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-row col-12 workflow-step-label-bg-color mb-1">
                                                <label className="col-form-label"><u>Assign To</u></label>
                                            </div>
                                            <div className="d-flex col-12">
                                                <div className="flex-grow-1 border-grey">
                                                    <div className="form-row col-12 workflow-step-bg-color mb-2 ml-1">
                                                        <div className="ml-3 mt-1 radio radio-primary">
                                                            <input disabled={(assignToViewEditMode[a.assignmentId] === 'view') ? 'true' : ''} type="radio" id={"assignmentTypeFromTask-" + a.assignmentId} className="form-check-input" name={"assignmentType-" + a.assignmentId} value="BYTASK"
                                                                checked={(assignmentTypes && assignmentTypes[a.assignmentId]) ? (assignmentTypes[a.assignmentId] === 'BYTASK') : ''}
                                                                onChange={(e) => {
                                                                    handleAssignmentTypeChange(a.assignmentId, 'BYTASK')
                                                                }}
                                                            />
                                                            <label htmlFor={"assignmentTypeFromTask-" + a.assignmentId}>Auto Assign from Task</label>
                                                        </div>
                                                        <div className="ml-3 mt-1 radio radio-primary">
                                                            <input disabled={(assignToViewEditMode[a.assignmentId] === 'view') ? 'true' : ''} type="radio" id={"assignmentTypeFromHierarchy-" + a.assignmentId} className="form-check-input" name={"assignmentType-" + a.assignmentId} value="BYHIERARCHY"
                                                                checked={(assignmentTypes && assignmentTypes[a.assignmentId]) ? (assignmentTypes[a.assignmentId] === 'BYHIERARCHY') : ''}
                                                                onChange={(e) => {
                                                                    handleAssignmentTypeChange(a.assignmentId, 'BYHIERARCHY')
                                                                }}
                                                            />
                                                            <label htmlFor={"assignmentTypeFromHierarchy-" + a.assignmentId}>Assign from Hierarchy</label>
                                                        </div>
                                                    </div>
                                                    {
                                                        (assignmentTypes && assignmentTypes[a.assignmentId] !== '') ?
                                                            <>
                                                                {
                                                                    (assignmentTypes[a.assignmentId] === 'BYTASK' && activityTaskListMst.current && activityTaskListMst.current.length > 0) ?
                                                                        <div className="form-row col-6 mb-2" style={{ display: "block" }}>
                                                                            <ActivityTaskSelect
                                                                                closeMenuOnSelect={true}
                                                                                options={getActivityListMst(a.assignmentId)}
                                                                                onChange={handleActivityTaskSelect}
                                                                                isMulti={false}
                                                                                name={"activityTask-" + a.assignmentId}
                                                                                isDisabled={(assignToViewEditMode[a.assignmentId] === 'view') ? true : false}
                                                                                defaultValue={(selectedActivityTasks && selectedActivityTasks[a.assignmentId]) ? selectedActivityTasks[a.assignmentId] : ''}
                                                                            />
                                                                        </div>
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    (assignmentTypes[a.assignmentId] === 'BYHIERARCHY') ?
                                                                        <div className="d-flex col-12 workflow-step-bg-color mb-1">
                                                                            {/* console.log('Sending Assign to roles', a.assignedToDeptRoles) */}
                                                                            <OrgHierarchyViewer
                                                                                data={{
                                                                                    renderSchema: heirarchyRoles.current,
                                                                                    selectedRoles: a.assignedToDeptRoles,
                                                                                    rolesMaster: rolesMaster.current,
                                                                                    expressionBuilderSchema: wfSchema,
                                                                                    key: a.assignmentId,
                                                                                    category: 'ASSIGN',
                                                                                    parentViewEditMode: a.viewMode,
                                                                                    statusLookups: statusLookups.current
                                                                                }}
                                                                                handler={{
                                                                                    handleRoleSelectDone: handleAssignToRoleSelectDone
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        :
                                                                        <></>
                                                                }
                                                            </>
                                                            :
                                                            <h6 className="ml-2">Please select an option above to proceed</h6>
                                                    }
                                                </div>
                                                <div className="workflow-step-bg-color">
                                                    {
                                                        (assignToViewEditMode[a.assignmentId] === 'view') ?
                                                            <>
                                                                {
                                                                    (a.viewMode === 'view') ?
                                                                        <i
                                                                            style={{ cursor: "pointer" }}
                                                                            className="fas fa-edit font-16 icolorDisabled ml-1"
                                                                        ></i>
                                                                        :
                                                                        <i
                                                                            style={{ cursor: "pointer" }}
                                                                            className="fas fa-edit font-16 icolor1 ml-1"
                                                                            onClick={(e) => {
                                                                                e.preventDefault()
                                                                                e.stopPropagation()
                                                                                e.nativeEvent.stopImmediatePropagation();
                                                                                handleAssignToViewEditMode(a.assignmentId, 'edit')
                                                                            }}
                                                                        ></i>

                                                                }
                                                            </>
                                                            :
                                                            <>
                                                                <div className="d-flex flex-column ml-1">
                                                                    <i
                                                                        style={{ cursor: "pointer" }}
                                                                        className="fas fa-check font-16 icolor1"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            e.stopPropagation()
                                                                            e.nativeEvent.stopImmediatePropagation();
                                                                            handleAssignToDone(a.assignmentId)
                                                                        }}
                                                                    ></i>
                                                                    <i
                                                                        style={{ cursor: "pointer" }}
                                                                        className="fas fa-times font-16 icolor1"
                                                                        onClick={(e) => {
                                                                            e.preventDefault()
                                                                            e.stopPropagation()
                                                                            e.nativeEvent.stopImmediatePropagation();
                                                                            handleAssignToViewEditMode(a.assignmentId, 'view')
                                                                        }}
                                                                    ></i>
                                                                </div>
                                                            </>
                                                    }
                                                </div>
                                            </div>

                                            <div className="form-row col-12 workflow-step-label-bg-color">
                                                <label className="col-form-label"><u>Target Roles</u></label>
                                            </div>
                                            <div className="d-flex col-12 workflow-step-bg-color mb-1 pr-0">
                                                <OrgHierarchyViewer
                                                    data={{
                                                        renderSchema: heirarchyRoles.current,
                                                        selectedRoles: a.targetDeptRoles,
                                                        rolesMaster: rolesMaster.current,
                                                        key: a.assignmentId,
                                                        category: 'TARGET',
                                                        parentViewEditMode: a.viewMode,
                                                        statusLookups: statusLookups.current
                                                    }}
                                                    handler={{
                                                        handleRoleSelectDone: handleTargetRoleSelectDone
                                                    }}
                                                />
                                            </div>
                                            {
                                                (1 === 2) ?
                                                    <>
                                                        <div className="mt-2 form-row col-12 workflow-step-label-bg-color">
                                                            <label className="col-form-label"><u>Actions</u></label>
                                                        </div>
                                                        <div className="form-row col-12 workflow-step-bg-color">
                                                            <div className="col-12 form-group pr-0">
                                                                <>
                                                                    <table className="workflow table border mb-1">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ width: "9%" }}>S. No.</th>
                                                                                <th>Action Label</th>
                                                                                <th>Action Value</th>
                                                                                <th style={{ width: "9%" }}>Edit/Remove</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                (a.actions && a.actions.length > 0) ?
                                                                                    a.actions.map((ri, ridx) => (
                                                                                        <tr>
                                                                                            <td>{ridx}</td>
                                                                                            <td>{ri.actionLabel}</td>
                                                                                            <td>{ri.actionValue}</td>
                                                                                            <td className="center-align">
                                                                                                {
                                                                                                    (a.viewMode === 'view') ?
                                                                                                        <>
                                                                                                            <i className="fas fa-edit font-16 mr-1 icolorDisabled">
                                                                                                            </i>
                                                                                                            <i className="fas fa-trash font-16 icolorDisabled">
                                                                                                            </i>
                                                                                                        </>
                                                                                                        :
                                                                                                        <>
                                                                                                            <i className="fas fa-edit font-16 mr-1 icolor1"
                                                                                                                onClick={() => handleRowEdit(a.assignmentId, ridx)}>
                                                                                                            </i>
                                                                                                            <i className="fas fa-trash font-16 icolor1"
                                                                                                                onClick={() => handleRowDelete(a.assignmentId, ridx)}>
                                                                                                            </i>
                                                                                                        </>

                                                                                                }

                                                                                            </td>

                                                                                        </tr>
                                                                                    ))
                                                                                    :
                                                                                    <></>
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                    <div className="row d-flex justify-content-end">
                                                                        {
                                                                            (a.viewMode === 'view') ?
                                                                                <i className="fas fa-plus font-16 icolorDisabled">
                                                                                </i>
                                                                                :
                                                                                <i className="fas fa-plus font-16 icolor1"
                                                                                    onClick={() => {
                                                                                        setActionLabelValue({
                                                                                            assignmentIdx: a.assignmentId,
                                                                                            actionIdx: null,
                                                                                            actionLabel: '',
                                                                                            actionValue: ''
                                                                                        })
                                                                                        setIsRowDataModalOpen(true)
                                                                                    }}>
                                                                                </i>


                                                                        }
                                                                    </div>
                                                                    {
                                                                        (isRowDataModalOpen) ?
                                                                            <RowDataModal isOpen={isRowDataModalOpen}
                                                                                onRequestClose={() => setIsRowDataModalOpen(false)}
                                                                                contentLabel="Row Data"
                                                                                shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                                                                                style={customStyles}>

                                                                                <div className="form p-2">
                                                                                    <div className="row d-flex justify-content-between pl-2 pr-2">
                                                                                        <div><span><strong>Set Actions</strong></span></div>
                                                                                        <div>
                                                                                            <i style={{ cursor: "pointer" }}
                                                                                                className="fas fa-check font-18 icolor1"
                                                                                                onClick={() => handleAddUpdateRow()}>
                                                                                            </i>

                                                                                            <i onClick={() => setIsRowDataModalOpen(false)}
                                                                                                style={{ cursor: "pointer" }}
                                                                                                className="ml-2 fas fa-times font-18 icolor1">
                                                                                            </i>
                                                                                        </div>
                                                                                    </div>
                                                                                    <hr className="mt-2 mb-2" />
                                                                                    <label htmlFor="actionLabel" className="col-form-label">Action Label<span>*</span></label>
                                                                                    <input
                                                                                        key="actionLabel"
                                                                                        id="actionLabel"
                                                                                        type="text"
                                                                                        className='form-control'
                                                                                        value={actionLabelValue.actionLabel}
                                                                                        onChange={(event) => {
                                                                                            event.preventDefault()
                                                                                            event.stopPropagation()
                                                                                            if (event.nativeEvent) {
                                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                                            }
                                                                                            setActionLabelValue({ ...actionLabelValue, actionLabel: event.target.value })
                                                                                        }}
                                                                                        style={{ height: "30px", fontSize: "0.7rem" }}
                                                                                    />
                                                                                    <label htmlFor="actionValue" className="col-form-label">Action Value<span>*</span></label>
                                                                                    <input
                                                                                        key="actionValue"
                                                                                        id="actionValue"
                                                                                        type="text"
                                                                                        className='form-control'
                                                                                        value={actionLabelValue.actionValue}
                                                                                        onChange={(event) => {
                                                                                            event.preventDefault()
                                                                                            event.stopPropagation()
                                                                                            if (event.nativeEvent) {
                                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                                            }
                                                                                            setActionLabelValue({ ...actionLabelValue, actionValue: event.target.value })
                                                                                        }}
                                                                                        style={{ height: "30px", fontSize: "0.7rem" }}
                                                                                    />
                                                                                </div>
                                                                            </RowDataModal>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                            }

                                        </div>
                                        {
                                            (a.viewMode === 'edit') ?
                                                <div className="d-flex flex-column ml-1 mt-1">
                                                    <i
                                                        style={{ cursor: "pointer" }}
                                                        className="fas fa-check font-16 icolor1"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            e.nativeEvent.stopImmediatePropagation();
                                                            handleAssignmentEditDone(a.assignmentId)
                                                        }}
                                                    >
                                                    </i>
                                                    <i
                                                        style={{ cursor: "pointer" }}
                                                        className="fas fa-times mt-1 font-16 icolor1 mt-1"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            e.stopPropagation()
                                                            e.nativeEvent.stopImmediatePropagation();
                                                            handleAssignmentEditCancel(a.assignmentId)
                                                        }}
                                                    >
                                                    </i>

                                                </div>
                                                :
                                                <>
                                                    <div className="d-flex flex-column ml-1 mt-1">
                                                        <i
                                                            style={{ cursor: "pointer" }}
                                                            className="fas fa-edit ml-1 font-16 icolor1 align-self-start mb-2"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                e.nativeEvent.stopImmediatePropagation();
                                                                handleAssignmentEdit(a.assignmentId)
                                                            }}
                                                        >
                                                        </i>
                                                        <i
                                                            style={{ cursor: "pointer" }}
                                                            className="fas fa-trash ml-1 font-16 icolor1 align-self-start"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                e.stopPropagation()
                                                                e.nativeEvent.stopImmediatePropagation();
                                                                handleAssignmentDelete(a.assignmentId)
                                                            }}
                                                        >
                                                        </i>
                                                    </div>
                                                </>
                                        }

                                    </div>
                                ))
                                :
                                <></>
                        }
                        <div className="row d-flex justify-content-end mt-2 mr-3">
                            <i className="fas fa-plus font-16 icolor1"
                                onClick={handleAssignmentAdd}>
                            </i>
                        </div>
                    </>
                    :
                    <></>
            }

        </div>
    );
};
export default ManualTask;