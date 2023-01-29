import React, { useRef, useState, useEffect } from "react";
import InlineInput from "../../common/components/inlineInput"
import ReactSelect from 'react-select'
import RowDataModal from 'react-modal'
import FieldTypeButtonGroup from 'react-bootstrap/ButtonGroup'
import FieldTypeButton from 'react-bootstrap/Button'
import { getNextId, formatValue, updateSchemaForQuerySQL } from '../wf-utils'
import RuleBuilder from "../../common/components/rule-builder"
import Loop from "../../common/components/loop"
import TaskContextPrefix from '../../common/components/inlineInput'
import SchemaTreeModal from 'react-modal'
import ExpressionBuilder from '../../common/components/expressionBuilder'

let clone = require('clone');

const DatabaseTask = (props) => {

    const activityId = props.data.activityId
    const activityContextPrefix = props.data.activityContextPrefix
    const taskId = props.data.taskId
    const taskStepConfig = props.data.taskStepConfig
    const wfConfig = props.data.wfConfig
    const wfSchema = props.data.wfSchema

    const setTaskStepConfig = props.handler.setTaskStepConfig
    const getTitle = props.handler.getTitle
    const setTitle = props.handler.setTitle
    const setWFSchema = props.handler.setWFSchema
    const handleTaskContextPrefixChange = props.handler.handleTaskContextPrefixChange    
    const handleDeleteTransaction = props.handler.handleDeleteTransaction
    
    // console.log('activityContextPrefix', 'x' + activityContextPrefix + 'x')

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

    const tableOptions = useRef([])
    const columnOptions = useRef([])

    const [taskContextPrefix, setTaskContextPrefix] = useState('');

    const [isRowDataModalOpen, setIsRowDataModalOpen] = useState(false)

    const [displayMode, setDisplayMode] = useState('hide')

    const [tableSelectMulti, setTableSelectMulti] = useState(true)

    const [queryType, setQueryType] = useState('')

    const [availableTableOptions, setAvailableTableOptions] = useState([])

    const [availableColumnOptions, setAvailableColumnOptions] = useState([])

    const [selectedTables, setSelectedTables] = useState([])

    const [selectedColumns, setSelectedColumns] = useState([])

    const [fieldColumnOptions, setFieldColumnOptions] = useState([])

    const [where, setWhere] = useState([])

    const [waitUntil, setWaitUntil] = useState([])

    // const [whereUI, setWhereUI] = useState([])

    const [insertUpdateValues, setInsertUpdateValues] = useState([])

    const [rowData, setRowData] = useState([])

    const [rowsToInsertUpdate, setRowsToInsertUpdate] = useState()

    const [waitSupported, setWaitSupported] = useState()

    const [skipExecute, setSkipExecute] = useState()

    const [skipExecuteRule, setSkipExecuteRule] = useState()

    const [loopData, setLoopData] = useState({
        loopType: 'NONE',
        times: '',
        indexVariableName: '',
        dataVariableName: ''

    })
    const [expressionBuilderKey, setExpressionBuilderKey] = useState(false)
    const [isTreeViewOpen, setIsTreeViewOpen] = useState(false)

    useEffect(() => {

        // console.log('use effect 1')

        if (tableOptions.current === null || (tableOptions.current !== null && tableOptions.current.length === 0)) {
            for (let o of wfConfig.database.tables) {
                tableOptions.current.push({
                    label: o.displayName,
                    value: o.tableName
                })
            }
        }

        if (columnOptions.current === null || (columnOptions.current !== null && columnOptions.current.length === 0)) {
            for (let o of wfConfig.database.tables) {
                let options = []
                for (let c of o.columns) {
                    options.push({
                        label: c.displayName,
                        value: c.columnName,
                        tableName: o.tableName,
                        allowedOps: c.allowedOps,
                        dataType: c.dataType
                    })
                }
                columnOptions.current.push({
                    label: o.displayName,
                    tableName: o.tableName,
                    options: options
                })
            }
        }

        const tOptions = []
        for (let t of tableOptions.current) {
            tOptions.push(t)
        }
        setAvailableTableOptions(tOptions)

    }, [])

    useEffect(() => {

        if (queryType && queryType === 'SELECT') {
            for (let q of wfConfig.database.queryTypes) {
                // console.log(q.code, queryType)
                if (q.code === queryType) {
                    setWaitSupported(q.waitSupported)
                }
            }
        }

    }, [queryType])

    useEffect(() => {
        // console.log('Use Effect waitSupported', waitSupported, waitUntil)
        if (waitSupported) {
            if (!waitUntil || waitUntil === null || waitUntil.length === 0) {
                // console.log('setting wait')
                setWaitUntil([{
                    level: 1,
                    id: 1,
                    rules: [],
                    combinator: 'AND'
                }])
            }
        }

    }, [waitSupported])

    useEffect(() => {

        const newState = []
        const newAvailableColumnOptions = []
        const newSelectedcolumnOptions = []
        const fieldColOpts = []
        const tnames = []

        // console.log('Use Effect 2', selectedTables)

        let schema

        if (selectedTables && selectedTables.length > 0) {

            for (let t of selectedTables) {

                tnames.push(t.value)

                // console.log('selectedTables', t.tableName)

                newState.push(t)

                for (let o of wfConfig.database.tables) {
                    if (t.value === o.tableName) {
                        let options = []
                        for (let c of o.columns) {
                            options.push({
                                label: c.displayName,
                                value: c.columnName,
                                tableName: o.tableName
                            })
                        }
                        fieldColOpts.push({
                            label: o.displayName,
                            tableName: o.tableName,
                            options: options
                        })
                    }
                }


                for (let o of wfConfig.database.tables) {
                    if (t.value === o.tableName) {
                        let options = []
                        for (let c of o.columns) {
                            if (c.allowedOps.includes(queryType)) {
                                options.push({
                                    label: c.displayName,
                                    value: c.columnName,
                                    tableName: o.tableName,
                                    allowedOps: c.allowedOps,
                                    dataType: c.dataType
                                })
                            }
                        }
                        newAvailableColumnOptions.push({
                            label: o.displayName,
                            tableName: o.tableName,
                            options: options
                        })
                    }
                }

                for (let sc of selectedColumns) {
                    if (t.value === sc.tableName) {
                        newSelectedcolumnOptions.push(sc)
                    }
                }

            }
            schema = clone(wfSchema)
            // console.log('schema', JSON.stringify(schema))
            // console.log('updateSchemaForQuerySQL', schema, 'x' + activityContextPrefix + 'x', 'x' + taskContextPrefix + 'x', schema.properties['Activity_0a7gs1t'].properties['task_1'])
            // console.log('Part1', JSON.stringify(schema.properties['Activity_0a7gs1t'].properties['task_1']))
            // console.log('Part2', JSON.stringify(schema.properties['Activity_0a7gs1t'].properties['task_1'].properties))
            // console.log('Part3A', JSON.stringify(schema.properties[activityContextPrefix]))
            // console.log('Part3B', JSON.stringify(schema.properties[activityContextPrefix].properties[taskContextPrefix]))
            // console.log('Part3C', JSON.stringify(schema.properties[activityContextPrefix].properties[taskContextPrefix].properties))
            updateSchemaForQuerySQL(wfConfig, schema.properties[activityContextPrefix].properties[taskContextPrefix].properties, tnames)
        }

        const newWhere = clone(where)
        findAndRemoveFieldsOfTable(newWhere, selectedTables)

        // console.log('newAvailableColumnOptions', newAvailableColumnOptions)
        // console.log('Database',  activityContextPrefix, taskContextPrefix, wfSchema)

        setAvailableColumnOptions(newAvailableColumnOptions)
        setSelectedColumns(newSelectedcolumnOptions)
        setFieldColumnOptions(fieldColOpts)
        // console.log('selectedTables', newWhere)
        setWhere(newWhere)
        if(schema) {
            setWFSchema(schema)
        }

    }, [selectedTables])

    useEffect(() => {

        // console.log('use effect selectedColumns', selectedColumns)

        if (queryType && ['INSERT', 'UPDATE'].includes(queryType)
            && selectedColumns && selectedColumns.length > 0) {

            const columsToDelete = []

            let newRowsToInsertUpdate = clone(rowsToInsertUpdate)

            for (let r of newRowsToInsertUpdate) {
                for (let c1 of selectedColumns) {
                    let found = false
                    for (let c2 of r.fields) {
                        if (c1.tableName === c2.tableName && c1.value === c2.columnName) {
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        const nextId = getNextId(r.fields, 'id')
                        r.fields.push({
                            tableName: c1.tableName,
                            columnName: c1.value,
                            columnDisplayName: c1.label,
                            value: formatValue(columnOptions, c1.tableName, c1.value, 'TEXT', null),
                            valueType: 'TEXT'
                        })
                    }
                }
            }

            for (let r of newRowsToInsertUpdate) {
                for (let c1 of r.fields) {
                    let found = false
                    for (let c2 of selectedColumns) {
                        if (c1.tableName === c2.tableName && c1.columnName === c2.value) {
                            found = true
                        }
                    }
                    if (!found) {
                        columsToDelete.push({
                            id: r.id,
                            tableName: c1.tableName,
                            columnName: c1.columnName
                        })
                    }
                }
            }

            for (let cd of columsToDelete) {
                for (let r of newRowsToInsertUpdate) {
                    if (cd.id === r.id) {
                        let reqIdx = -1
                        for (let c1 of r.fields) {
                            reqIdx++
                            if (cd.tableName === c1.tableName && cd.columnName === c1.value) {
                                break
                            }
                        }
                        if (reqIdx !== -1) {
                            r.fields.splice(reqIdx, 1)
                            break
                        }
                    }
                }
            }
            setRowsToInsertUpdate(newRowsToInsertUpdate)
        } else {
            setRowsToInsertUpdate([])
        }

    }, [queryType, selectedColumns])

    const findAndRemoveFieldsOfTable = (obj, tables) => {

        // console.log('findAndRemoveFieldsOfTable', tables)

        const elementsToBeDeleted = []

        for (let v of obj) {
            if (v.hasOwnProperty('rules')) {
                findAndRemoveFieldsOfTable(v['rules'], tables)
            } else {
                // console.log('Current v', v)
                if (v.field && v.field.tableName) {
                    let found = false
                    for (let t of tables) {
                        // console.log('t.tableName-v.field.tableName', t.value, v.field.tableName)
                        if (t.value === v.field.tableName) {
                            found = true
                            break
                        }
                    }
                    if (!found) {
                        // console.log('elementsToBeDeleted', v.id)
                        elementsToBeDeleted.push(v.id)
                    }
                }
            }
        }
        if (elementsToBeDeleted.length > 0) {
            for (let d of elementsToBeDeleted) {
                let reqIdx = -1
                for (let o of obj) {
                    reqIdx++
                    if (o.id === d) {
                        break
                    }
                }
                if (reqIdx !== -1) {
                    obj.splice(reqIdx, 1)
                }
            }
        }
    }

    const handleOpen = () => {

        // console.log('handleOpen')

        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let a of taskStepConfig) {
                if (a.activityId === activityId) {
                    const configuredTables = []
                    const configuredColumns = []
                    let localTaskContextPrefix = ''
                    let whereCondition
                    let waitUntilCondition
                    let queryTypeFromJSON = ''
                    let vSkipExecute
                    let vSkipExecuteRule
                    let vLoopData
                    for (let t of a.tasks) {
                        if (t.taskId === taskId) {

                            // console.log('handleOpen', t.where)

                            if(t.taskContextPrefix && t.taskContextPrefix !== '') {
                                localTaskContextPrefix = t.taskContextPrefix
                            } else {
                                localTaskContextPrefix = 'task_' + t.taskId
                            }

                            if (t.skipExecute) {
                                vSkipExecute = t.skipExecute
                            } else {
                                vSkipExecute = 'SKIP'
                            }
                            if (t.skipExecuteRule && t.skipExecuteRule.length > 0) {
                                vSkipExecuteRule = t.skipExecuteRule
                            } else {
                                vSkipExecuteRule = [{
                                    level: 1,
                                    id: 1,
                                    rules: [],
                                    combinator: 'AND'
                                }]
                            }

                            vLoopData = t.loop

                            queryTypeFromJSON = t.queryType

                            if (t.tables && t.tables.length > 0) {
                                for (let tab of t.tables) {
                                    for (let to of tableOptions.current) {
                                        if (tab === to.value) {
                                            configuredTables.push({
                                                label: to.label,
                                                value: to.value
                                            })
                                        }
                                    }
                                }
                            }
                            if (t.columns && t.columns.length > 0) {
                                for (let col of t.columns) {
                                    for (let co of columnOptions.current) {
                                        for (let o of co.options) {
                                            if (col.columnName === o.value && col.tableName === o.tableName) {
                                                configuredColumns.push({
                                                    label: o.label,
                                                    value: o.value,
                                                    tableName: o.tableName
                                                })
                                            }
                                        }
                                    }
                                }
                            }
                            whereCondition = t.where
                            waitUntilCondition = t.waitUntil
                            break
                        }
                    }

                    let insUpdRows

                    if (taskStepConfig && taskStepConfig.length > 0) {
                        for (let stc of taskStepConfig) {
                            if (stc.activityId === activityId) {
                                if (stc.tasks && stc.tasks.length > 0) {
                                    for (let t of stc.tasks) {
                                        if (t.taskId === taskId) {
                                            if (t.queryType === 'INSERT') {
                                                insUpdRows = t.rowsToInsert
                                            } else if (t.queryType === 'UPDATE') {
                                                insUpdRows = t.rowToUpdate
                                            }
                                        }
                                    }
                                }
                                break
                            }
                        }
                    }
                    if (insUpdRows) {
                        setRowsToInsertUpdate(insUpdRows)
                    }

                    setTaskContextPrefix(localTaskContextPrefix)
                    setSkipExecute(vSkipExecute)
                    // console.log('vSkipExecuteRule', vSkipExecuteRule)
                    setSkipExecuteRule(vSkipExecuteRule)
                    if (vLoopData) {
                        setLoopData(vLoopData)
                    }
                    setQueryType(queryTypeFromJSON)
                    setSelectedTables(configuredTables)
                    setSelectedColumns(configuredColumns)
                    if (whereCondition) {
                        // console.log('setWhere', whereCondition)
                        setWhere(whereCondition)
                    } else {
                        // console.log('Default setWhere')
                        setWhere([{
                            level: 1,
                            id: 1,
                            rules: [],
                            combinator: 'AND'
                        }])
                    }
                    if (waitUntilCondition) {
                        // console.log('Wait found')
                        setWaitUntil(waitUntilCondition)
                    } else {
                        if (waitSupported) {
                            // console.log('Wait initialized')
                            setWaitUntil([{
                                level: 1,
                                id: 1,
                                rules: [],
                                combinator: 'AND'
                            }])
                        }
                    }
                }
            }
        }
        setDisplayMode('show')
    }

    const handleChange = () => {

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

                                    let tables = []
                                    let columns = []

                                    for (let t of selectedTables) {
                                        tables.push(t.value)
                                    }

                                    for (let t of selectedColumns) {
                                        columns.push({
                                            tableName: t.tableName,
                                            columnName: t.value
                                        })
                                    }

                                    s.skipExecute = skipExecute
                                    s.skipExecuteRule = skipExecuteRule
                                    s.queryType = queryType
                                    s.tables = tables
                                    s.columns = columns

                                    // console.log('Where Condition for 2nd Task', where)

                                    if (queryType === 'INSERT') {
                                        s.rowsToInsert = rowsToInsertUpdate
                                    } else if (queryType === 'UPDATE') {
                                        s.rowToUpdate = rowsToInsertUpdate
                                        s.where = where
                                    } else if (queryType === 'SELECT') {
                                        s.where = where
                                    }

                                    if (waitSupported) {
                                        s.waitUntil = waitUntil
                                    }

                                    s.loop = loopData
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
        setQueryType('')
        setSelectedTables([])
        setSelectedColumns([])
        setDisplayMode('hide')
    }

    const handleInsertUpdateValue = (id, value) => {
        const newInsertUpdateValues = clone(insertUpdateValues)
        for (let iv of newInsertUpdateValues) {
            if (iv.id === id) {
                iv.value = value
                break
            }
        }
        setInsertUpdateValues(newInsertUpdateValues)
    }

    const handleRowDataChange = (changeType, tableName, columnName, value) => {

        // console.log('handleRowDataChange', changeType, value)
        const newFields = []

        for (let r of rowData.fields) {
            if (r.tableName === tableName && r.columnName === columnName) {
                if (changeType === 'VALUE') {
                    newFields.push({
                        ...r,
                        value: formatValue(columnOptions, r.tableName, r.columnName, r.valueType, value)
                    })
                } else if (changeType === 'VALUETYPE') {
                    newFields.push({
                        ...r,
                        valueType: value
                    })
                }
            } else {
                newFields.push(r)
            }
        }
        setRowData({
            id: rowData.id,
            fields: newFields
        })
    }

    const handleAddUpdateRow = () => {
        let newRowsToInsertUpdate

        if (rowsToInsertUpdate && rowsToInsertUpdate.length > 0) {
            newRowsToInsertUpdate = clone(rowsToInsertUpdate)
        } else {
            newRowsToInsertUpdate = []
        }

        if (rowData.id === null) {
            const nextId = getNextId(newRowsToInsertUpdate, 'id')
            newRowsToInsertUpdate.push({
                id: nextId,
                fields: clone(rowData.fields)
            })
        } else {
            for (let r of newRowsToInsertUpdate) {
                // console.log(rowData.id, r.id, rowData.fields)
                if (rowData.id === r.id) {
                    r.fields = clone(rowData.fields)
                }
            }
        }
        // console.log('newRowsToInsertUpdate', newRowsToInsertUpdate)
        setRowsToInsertUpdate(newRowsToInsertUpdate)
        setIsRowDataModalOpen(false)
    }

    const handleRowEdit = (rowId) => {
        for (let r of rowsToInsertUpdate) {
            if (r.id === rowId) {
                setRowData({
                    id: r.id,
                    fields: clone(r.fields)
                })
                break
            }
        }
        setIsRowDataModalOpen(true)
    }

    const handleRowDelete = (rowId) => {
        let reqIdx = -1
        const newRowsToInsertUpdate = clone(rowsToInsertUpdate)
        for (let r of newRowsToInsertUpdate) {
            reqIdx++
            if (r.id === rowId) {
                break
            }
        }
        newRowsToInsertUpdate.splice(reqIdx, 1)
        setRowsToInsertUpdate(newRowsToInsertUpdate)
    }

    const handlePfxChange = (id, value) => {
        handleTaskContextPrefixChange(activityId, id, value)
        setTaskContextPrefix(value)
    }

    const handleExpressionBuilderDone = (key, value) => {
    handleRowDataChange('VALUE',key.p2, key.p3, value)
     setIsTreeViewOpen(false)
    }

    const handleExpressionBuilderCancel = () => {
        setIsTreeViewOpen(false)
    }

    return (
        <div key={props.id} id={props.id}>
            {
                // console.log('rendering')
            }
            <div id="adddbDiv">
                <div className="listbg icolor1 mt-1">
                    <div className="col-12 row">
                        <div className="d-flex col-10 col pt-2 pl-3 pb-2">
                            <i className="mb-auto mt-auto fas fa-database font-24 pr-3 icolor1"></i>
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
                    <div id="dbDiv" class="mt-1 p-1 primary-border">

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


                        <div className="form-row col-12 workflow-step-label-bg-color">
                            <label className="col-form-label"><u>Skip/Execute Condition</u></label>
                        </div>
                        <div className="form-row col-12 workflow-step-bg-color">
                            <div className="ml-3 mt-1 radio radio-primary">
                                <input type="radio" id="skipCondition1" className="form-check-input" name="skipExecuteCondition" value="SKIP"
                                    checked={(skipExecute === 'SKIP')}
                                    onChange={(e) => {
                                        // console.log(e.target.value)
                                        setSkipExecute(e.target.value)
                                    }}
                                />
                                <label htmlFor="skipCondition">Skip when True</label>
                            </div>
                            <div className="ml-3 mt-1 radio radio-primary">
                                <input type="radio" id="skipCondition2" className="form-check-input" name="skipExecuteCondition" value="EXECUTE"
                                    checked={(skipExecute === 'EXECUTE')}
                                    onChange={(e) => {
                                        setSkipExecute(e.target.value)
                                    }}
                                />
                                <label htmlFor="fixedAccessNbrRadio2">Execute when True</label>
                            </div>
                            <div className="col-12 pr-0">
                                <RuleBuilder
                                    data={{
                                        ruleType: 'LOGIC',
                                        rules: skipExecuteRule,
                                        availableColumnOptions: availableColumnOptions,
                                        columnOptions: columnOptions,
                                        fieldColumnOptions: fieldColumnOptions,
                                        wfConfig: wfConfig,
                                        taskId: taskId,
                                        wfSchema: wfSchema

                                    }}
                                    handler={{
                                        setRules: setSkipExecuteRule
                                    }}
                                />
                            </div>
                        </div>

                        <Loop data={{
                            taskId: taskId,
                            wfConfig: wfConfig,
                            loopData: loopData
                        }}
                            handler={{
                                setLoopData: setLoopData
                            }}
                        />

                        <div className="mt-2 form-row col-12 workflow-step-label-bg-color">
                            <label className="col-form-label"><u>Query Definition</u></label>
                        </div>
                        <div className="form-row col-12 workflow-step-bg-color">

                            <div className="col-4 form-group">
                                <label htmlFor="queryType" className="col-form-label">Query Type<span>*</span></label>
                                <select
                                    id="queryType"
                                    value={queryType}
                                    className='form-control'
                                    onChange={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        if (event.nativeEvent) {
                                            event.nativeEvent.stopImmediatePropagation();
                                        }
                                        const tOptions = []
                                        if (event.target.value !== '') {
                                            for (let t of tableOptions.current) {
                                                tOptions.push(t)
                                            }
                                        }
                                        setQueryType(event.target.value)
                                        setSelectedTables([])
                                        setAvailableTableOptions(tOptions)
                                        setAvailableColumnOptions([])
                                        setSelectedColumns([])
                                        // console.log('Default setWhere 3')
                                        setWhere([{
                                            level: 1,
                                            id: 1,
                                            rules: [],
                                            combinator: 'AND'
                                        }])
                                        if (['INSERT', 'UPDATE'].includes(event.target.value)) {
                                            setTableSelectMulti(false)
                                        }
                                    }
                                    }>
                                    <option value=''>Select Query Type</option>
                                    {
                                        (wfConfig && wfConfig.database.queryTypes) ?
                                            wfConfig.database.queryTypes.map((w) => (
                                                <option key={w.code} value={w.code}>{w.display}</option>
                                            ))
                                            :
                                            <></>
                                    }
                                </select>
                            </div>
                            {
                                (queryType && queryType !== '') ?
                                    <div className="col-8 form-group pr-0">
                                        <label htmlFor="ReactSelect" className="col-form-label">Table Selection<span>*</span></label>
                                        <ReactSelect
                                            id="ReactSelect"
                                            options={availableTableOptions}
                                            isMulti={tableSelectMulti}
                                            onChange={(tables) => {
                                                // console.log('ReactSelect', tables)
                                                if (Array.isArray(tables)) {
                                                    setSelectedTables(tables)
                                                } else {
                                                    setSelectedTables([tables])
                                                }
                                            }}
                                            value={selectedTables}
                                        />
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                (queryType && queryType !== '') ?
                                    <div className="col-12 form-group pr-0">
                                        <label htmlFor="ReactSelect" className="col-form-label">Column Selection<span>*</span></label>
                                        <ReactSelect
                                            id="ReactSelect"
                                            options={availableColumnOptions}
                                            isMulti={true}
                                            onChange={(columns) => {
                                                const newState = []
                                                for (let c of columns) {
                                                    newState.push(c)
                                                }
                                                setSelectedColumns(newState)
                                            }}
                                            value={selectedColumns}
                                        />
                                    </div>
                                    :
                                    <></>
                            }
                            <div className="col-12 form-group pr-0">
                                {
                                    (['INSERT', 'UPDATE'].includes(queryType)) ?
                                        <>
                                            <label className="col-form-label">{(queryType === 'INSERT') ? 'Rows to Insert' : 'Row to Update'}<span>*</span></label>
                                            {
                                                // console.log('Rendering insertUpdateValues', insertUpdateValues)
                                            }
                                            {
                                                (selectedColumns && selectedColumns.length > 0) ?
                                                    <table className="workflow table border mb-1">
                                                        <thead>
                                                            <tr>
                                                                <th style={{ width: "9%" }}>S. No.</th>
                                                                {
                                                                    selectedColumns.map((sc) => (
                                                                        <th>{sc.label}</th>
                                                                    ))
                                                                }
                                                                <th style={{ width: "9%" }}>Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {
                                                                (rowsToInsertUpdate && rowsToInsertUpdate.length > 0) ?
                                                                    rowsToInsertUpdate.map((ri) => (
                                                                        <tr>
                                                                            <td>{ri.id}</td>
                                                                            {
                                                                                selectedColumns.map((sc) => (
                                                                                    ri.fields.map((ric) => (
                                                                                        (ric.tableName === sc.tableName && ric.columnName === sc.value) ?
                                                                                            <td>{ric.value}</td>
                                                                                            :
                                                                                            <></>
                                                                                    ))
                                                                                ))
                                                                            }
                                                                            <td>
                                                                                <i className="fas fa-edit font-16 mr-1 icolor1"
                                                                                    onClick={() => handleRowEdit(ri.id)}>
                                                                                </i>
                                                                                <i className="fas fa-trash font-16 icolor1"
                                                                                    onClick={() => handleRowDelete(ri.id)}>
                                                                                </i>
                                                                            </td>

                                                                        </tr>
                                                                    ))
                                                                    :
                                                                    <></>
                                                            }
                                                        </tbody>
                                                    </table>
                                                    :
                                                    <><div className="row"><span>No columns selected yet, please select columns to update</span></div></>
                                            }
                                            {
                                                ((selectedColumns && selectedColumns.length > 0) && ((queryType === 'UPDATE' && rowsToInsertUpdate.length === 0) || (queryType === 'INSERT'))) ?
                                                    <div className="row d-flex justify-content-end">
                                                        <i className="fas fa-plus font-16 pr-3 icolor1"
                                                            onClick={() => {

                                                                const fields = []

                                                                for (let sc of selectedColumns) {
                                                                    fields.push({
                                                                        tableName: sc.tableName,
                                                                        columnName: sc.value,
                                                                        columnDisplayName: sc.label,
                                                                        value: formatValue(columnOptions, sc.tableName, sc.value, 'TEXT', null),
                                                                        valueType: 'TEXT'
                                                                    })
                                                                }
                                                                setRowData({
                                                                    id: null,
                                                                    fields: fields
                                                                })
                                                                setIsRowDataModalOpen(true)
                                                            }}>
                                                        </i>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (isRowDataModalOpen) ?
                                                    <RowDataModal isOpen={isRowDataModalOpen}
                                                        onRequestClose={() => setIsRowDataModalOpen(false)}
                                                        contentLabel="Row Data"
                                                        shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                                                        style={customStyles}>

                                                        <div className="form p-2">
                                                            <div className="row d-flex justify-content-between pl-2 pr-2">
                                                                <div><span><strong>Set Attribute Values</strong></span></div>
                                                                <div>
                                                                    <i style={{ cursor: "pointer" }}
                                                                        className="fas fa-check font-18 icolor1"
                                                                        onClick={() => handleAddUpdateRow(null)}>
                                                                    </i>

                                                                    <i onClick={() => setIsRowDataModalOpen(false)}
                                                                        style={{ cursor: "pointer" }}
                                                                        className="ml-2 fas fa-times font-18 icolor1">
                                                                    </i>
                                                                </div>
                                                            </div>
                                                            <hr className="mt-2 mb-2" />
                                                            {
                                                                (selectedColumns && selectedColumns.length > 0) ?

                                                                    <table className="table border">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{ textAlign: "center" }}>Attribute</th>
                                                                                <th style={{ textAlign: "center" }}>Value</th>
                                                                                <th style={{ textAlign: "center" }}>Type</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                selectedColumns.map((sc) => (
                                                                                    <tr>
                                                                                        <td>
                                                                                            <label className="form-label">{sc.label}</label>
                                                                                        </td>
                                                                                        {
                                                                                            (rowData && rowData.fields && rowData.fields.length > 0) ?
                                                                                                rowData.fields.map((r) => (
                                                                                                    (r.tableName === sc.tableName && r.columnName === sc.value) ?
                                                                                                        <>
                                                                                                            <td key={'rda-' + r.tableName + '-' + r.columnName}>
                                                                                                                <input
                                                                                                                    key={'rdv-' + r.tableName + '-' + r.columnName}
                                                                                                                    id={'rdv-' + r.tableName + '-' + r.columnName}
                                                                                                                    type="text"
                                                                                                                    className='form-control'
                                                                                                                    value={r.value}
                                                                                                                    onChange={(event) => {
                                                                                                                        event.preventDefault()
                                                                                                                        event.stopPropagation()
                                                                                                                        if (event.nativeEvent) {
                                                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                                                        }
                                                                                                                        handleRowDataChange('VALUE', r.tableName, r.columnName, event.target.value)
                                                                                                                    }}
                                                                                                                    style={{ height: "30px", fontSize: "0.7rem" }}
                                                                                                                />
                                                                                                            </td>
                                                                                                            <td style={{ width: "150px", verticalAlign: "middle", textAlign: "center" }}>
                                                                                                                <i className={"fas fa-font font-16 mr-1 " + ((r.valueType === 'TEXT') ? ' icolor1' : ' icolorInactive')}
                                                                                                                    onClick={(event) => {
                                                                                                                        event.preventDefault()
                                                                                                                        event.stopPropagation()
                                                                                                                        if (event.nativeEvent) {
                                                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                                                        }
                                                                                                                        handleRowDataChange('VALUETYPE', r.tableName, r.columnName, 'TEXT')
                                                                                                                    }}
                                                                                                                    style={{ cursor: "pointer" }}
                                                                                                                ></i>
                                                                                                                <i className={"fas fa-code font-16 mr-1 " + ((r.valueType === 'EXPR') ? ' icolor1' : ' icolorInactive')}
                                                                                                                    onClick={(event) => {
                                                                                                                        event.preventDefault()
                                                                                                                        event.stopPropagation()
                                                                                                                        if (event.nativeEvent) {
                                                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                                                        }
                                                                                                                        handleRowDataChange('VALUETYPE', r.tableName, r.columnName, 'EXPR')
                                                                                                                    }}
                                                                                                                    style={{ cursor: "pointer" }}
                                                                                                                ></i>
                                                                                                                {
                                                                                                                    <button
                                                                                                                   disabled={(r.valueType === 'EXPR') ? false : true}
                                                                                                                    key={'fld-exprb-' + r.tableName + '-' + r.columnName}
                                                                                                                    id={'fld-exprb-' + r.tableName + '-' + r.columnName}
                                                                                                                    type="button"
                                                                                                                    className={"btn btn-xs waves-effect waves-light ml-1 mr-1"+ ((r.valueType === 'EXPR') ? ' icolor1' : ' icolorInactive')}
                                                                                                                    onClick={(event) => {
                                                                                                                        event.preventDefault()
                                                                                                                        event.stopPropagation()
                                                                                                                        if (event.nativeEvent) {
                                                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                                                        }
                                                                                                                        setExpressionBuilderKey({
                                                                                                                            p1: 'SET-RULE-FIELD',
                                                                                                                            p2: r.tableName,
                                                                                                                            p3: r.columnName
                                                                                                                        })
                                                                                                                        setIsTreeViewOpen(true)
                                                                                                                    }}
                                                                                                                ><i
                                                                                                                    className="mt-auto mb-auto fas fa-project-diagram font-12"
                                                                                                                ></i></button>
                                                                                                                }
                                                                                                            </td>
                                                                                                        </>
                                                                                                        :
                                                                                                        <></>

                                                                                                ))
                                                                                                :
                                                                                                <></>
                                                                                        }
                                                                                    </tr>
                                                                                ))
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                    :
                                                                    <p>No columns have been selected yet. Please select columns for insert and they will appear here</p>
                                                            }
                                                        </div>
                                                    </RowDataModal>
                                                    :
                                                    <></>
                                            }
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    (['UPDATE', 'SELECT'].includes(queryType)) ?
                                        <>
                                            <label className="col-form-label">Where Condition<span>*</span></label>
                                            {/* console.log('Where Rule Builder', where) */}
                                            <RuleBuilder
                                                data={{
                                                    ruleType: 'SQL',
                                                    rules: where,
                                                    availableColumnOptions: availableColumnOptions,
                                                    columnOptions: columnOptions,
                                                    fieldColumnOptions: fieldColumnOptions,
                                                    wfConfig: wfConfig,
                                                    taskId: taskId,
                                                    wfSchema: wfSchema

                                                }}
                                                handler={{
                                                    setRules: setWhere
                                                }}
                                            />
                                        </>
                                        :
                                        <></>
                                }
                            </div>
                        </div>
                        {
                            (waitSupported !== undefined && waitSupported) ?
                                <>
                                    <div className="form-row col-12 mt-1 workflow-step-label-bg-color">
                                        <label className="col-form-label">Wait Until Condition<span>*</span></label>
                                    </div>
                                    <div className="col-12 form-group p-1 pr-0 workflow-step-bg-color">
                                        {/* console.log('waitUntil Rule Builder', waitUntil) */}
                                        <RuleBuilder
                                            data={{
                                                ruleType: 'LOGIC',
                                                rules: waitUntil,
                                                availableColumnOptions: availableColumnOptions,
                                                columnOptions: columnOptions,
                                                fieldColumnOptions: fieldColumnOptions,
                                                wfConfig: wfConfig,
                                                taskId: taskId,
                                                wfSchema: wfSchema

                                            }}
                                            handler={{
                                                setRules: setWaitUntil
                                            }}
                                        />
                                    </div>
                                </>
                                :
                                <></>
                        }
                        {
                (isTreeViewOpen) ?
                    <SchemaTreeModal isOpen={isTreeViewOpen}
                        onRequestClose={() => setIsTreeViewOpen(false)}
                        contentLabel="Tree View"
                        shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                        style={customStyles}>

                        <div className="form p-2">
                            <ExpressionBuilder
                                data={{
                                    wfSchema: wfSchema,
                                    key: expressionBuilderKey
                                }}
                                handler={{
                                    handleDone: handleExpressionBuilderDone,
                                    handleCancel: handleExpressionBuilderCancel
                                }}
                            />
                        </div>
                    </SchemaTreeModal>
                    :
                    <></>
            }
                    </div>
                    :
                    <></>
            }
        </div>
    );
};
export default DatabaseTask;