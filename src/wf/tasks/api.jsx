import React, { useRef, useState, useEffect } from "react";
import InlineInput from "../../common/components/inlineInput"
import JSONTextArea from "../../common/components/jsonTextArea"
import RequestSchemaViewer from "../../common/components/jsonSchemaViewer"
import ParameterModal from 'react-modal'
import ExpressionBuilderModal from 'react-modal'
import ExpressionBuilder from "../../common/components/expressionBuilder"
import { toast } from "react-toastify";
import { getNextId } from '../wf-utils'
import RuleBuilder from "../../common/components/rule-builder"
import Loop from "../../common/components/loop"
import TaskContextPrefix from '../../common/components/inlineInput'

let clone = require('clone');

const APITask = (props) => {

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
    const handleDeleteTransaction = props.handler.handleDeleteTransaction

    const [taskContextPrefix, setTaskContextPrefix] = useState('');

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

    const [protocolOptions, setProtocolOptions] = useState([])
    const [methodOptions, setMethodOptions] = useState([])
    const [endpointOptions, setEndpointOptions] = useState([])

    const [apiConfig, setAPIConfig] = useState({})

    const [queryParams, setQueryParams] = useState([])

    const [isParameterModalOpen, setIsParameterModalOpen] = useState(false)

    const [addEditQueryParam, setAddEditQueryParam] = useState()

    const [IsExpressionBuilderOpen, setIsExpressionBuilderOpen] = useState(false)

    const [baseRequestSchema, setBaseRequestSchema] = useState({})

    const [requestSchema, setRequestSchema] = useState({})

    const [requestActiveTab, setRequestActiveTab] = useState('schema')

    const [responseSchema, setResponseSchema] = useState('')

    const [displayMode, setDisplayMode] = useState('hide')

    const [waitUntil, setWaitUntil] = useState([])

    const [waitSupported, setWaitSupported] = useState()

    const [skipExecute, setSkipExecute] = useState()

    const [skipExecuteRule, setSkipExecuteRule] = useState()

    const [loopData, setLoopData] = useState({
        loopType: 'NONE',
        times: '',
        indexVariableName: '',
        dataVariableName: ''

    })

    useEffect(() => {

        // console.log('use effect 1')
        let prcOptions = []
        let mthdOptions = []
        let epOptions = []
        if (protocolOptions && protocolOptions.length === 0) {
            for (let o of wfConfig.api.protocols) {
                prcOptions.push({
                    label: o.label,
                    value: o.value
                })
            }
        }

        if (methodOptions && methodOptions.length === 0) {
            for (let o of wfConfig.api.methods) {
                mthdOptions.push({
                    label: o.label,
                    value: o.value
                })
            }
        }

        if (endpointOptions && endpointOptions.length === 0) {
            for (let o of wfConfig.api.endpoints) {
                epOptions.push({
                    label: o.label,
                    value: o.value
                })
            }
        }

        if (protocolOptions && protocolOptions.length === 0) {
            setProtocolOptions(prcOptions)
        }

        if (methodOptions && methodOptions.length === 0) {
            setMethodOptions(mthdOptions)
        }

        if (endpointOptions && endpointOptions.length === 0) {
            setEndpointOptions(epOptions)
        }

    }, [])

    useEffect(() => {

        if (apiConfig && apiConfig.method && apiConfig.method !== '') {
            for (let q of wfConfig.api.methods) {
                if (q.value === apiConfig.method) {
                    setWaitSupported(q.waitSupported)
                }
            }
        }

    }, [apiConfig.method])

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

    const handleOpen = () => {

        // console.log('handleOpen')

        if (taskStepConfig && taskStepConfig.length > 0) {
            for (let a of taskStepConfig) {
                if (a.activityId === activityId) {
                    let localTaskContextPrefix = ''
                    let waitUntilCondition
                    let vSkipExecute
                    let vSkipExecuteRule
                    let vLoopData
                    let apiFields
                    let params
                    let rspSchema
                    let reqSchema
                    let bReqSchema
                    for (let t of a.tasks) {
                        if (t.taskId === taskId) {

                            // console.log('handleOpen', t.where)

                            if (t.taskContextPrefix && t.taskContextPrefix !== '') {
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

                            waitUntilCondition = t.waitUntil

                            if (t.api) {
                                apiFields = {
                                    protocol: t.api.protocol,
                                    method: t.api.method,
                                    endpoint: t.api.endpoint,
                                    path: t.api.path,
                                }
                            } else {
                                apiFields = {
                                    protocol: '',
                                    method: '',
                                    endpoint: '',
                                    path: '',
                                }
                            }

                            if (t.api) {
                                params = t.api.queryParams
                                rspSchema = t.api.responseSchema
                                reqSchema = t.api.requestSchema
                                if(['PUT', 'POST'].includes(t.api.path)) {
                                    bReqSchema = prepareBaseRequestSchema(reqSchema)
                                }
                            }
                            break
                        }
                    }

                    setTaskContextPrefix(localTaskContextPrefix)
                    setAPIConfig(apiFields)
                    if (params) {
                        setQueryParams(params)
                    }
                    if (rspSchema) {
                        setResponseSchema(rspSchema)
                    }
                    // console.log('reqSchema', reqSchema)
                    if (reqSchema) {
                        setRequestSchema(reqSchema)
                        setBaseRequestSchema(bReqSchema)
                    }
                    setSkipExecute(vSkipExecute)
                    // console.log('vSkipExecuteRule', vSkipExecuteRule)
                    setSkipExecuteRule(vSkipExecuteRule)
                    if (vLoopData) {
                        setLoopData(vLoopData)
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

    const handleDone = () => {

        // console.log('taskId', activityId, taskId)

        if (!apiConfig.protocol || apiConfig.protocol.trim() === '') {
            toast.error('Protocol is required')
            return false
        }

        if (!apiConfig.method || apiConfig.method.trim() === '') {
            toast.error('Method is required')
            return false
        }

        if (!apiConfig.endpoint || apiConfig.endpoint.trim() === '') {
            toast.error('Endpoint is required')
            return false
        }

        if (!apiConfig.path || apiConfig.path.trim() === '') {
            toast.error('Path is required')
            return false
        }

        setTaskStepConfig((prevState) => {

            // console.log('prevState', prevState)

            const newState = clone(prevState)

            if (newState && newState.length > 0) {
                for (let a of newState) {
                    if (a.activityId === activityId) {

                        if (a.tasks && a.tasks.length > 0) {
                            for (let s of a.tasks) {
                                // (typeof s.taskId)
                                // console.log(typeof taskId)
                                if (s.taskId === taskId) {

                                    s.skipExecute = skipExecute
                                    s.skipExecuteRule = skipExecuteRule

                                    if (waitSupported) {
                                        s.waitUntil = waitUntil
                                    }

                                    s.loop = loopData

                                    if (apiConfig.method === 'GET') {
                                        s.api = {
                                            ...apiConfig,
                                            queryParams: queryParams,
                                            responseSchema: responseSchema
                                        }
                                    } else {
                                        s.api = {
                                            ...apiConfig,
                                            queryParams: queryParams,
                                            responseSchema: responseSchema,
                                            requestSchema: requestSchema
                                        }
                                    }
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

    const handleAddUpdateParam = () => {

        if (!addEditQueryParam.parameterName || addEditQueryParam.parameterName.trim() === '') {
            toast.error('Parameter name is required')
            return false
        }

        if (!addEditQueryParam.value || addEditQueryParam.value.trim() === '') {
            toast.error('Parameter value is required')
            return false
        }

        let params = clone(queryParams)

        if (addEditQueryParam.id === '') {
            let nextId = getNextId(queryParams, 'id')
            params.push({
                id: nextId,
                parameterName: addEditQueryParam.parameterName,
                valueType: addEditQueryParam.valueType,
                value: addEditQueryParam.value
            })
        } else {
            for (let r of params) {
                if (r.id === addEditQueryParam.id) {
                    r.parameterName = addEditQueryParam.parameterName
                    r.valueType = addEditQueryParam.valueType
                    r.value = addEditQueryParam.value
                    break
                }
            }
        }
        setQueryParams(params)
        setIsParameterModalOpen(false)
    }

    const handleParamEdit = (rowId) => {
        for (let r of queryParams) {
            if (r.id === rowId) {
                setAddEditQueryParam({
                    id: r.id,
                    parameterName: addEditQueryParam.parameterName,
                    valueType: addEditQueryParam.valueType,
                    value: addEditQueryParam.value
                })
                break
            }
        }
        setIsParameterModalOpen(true)
    }

    const handleParamDelete = (rowId) => {
        let reqIdx = -1
        let params = clone(queryParams)
        for (let r of params) {
            reqIdx++
            if (r.id === rowId) {
                break
            }
        }
        params.splice(reqIdx, 1)
        setAddEditQueryParam(params)
    }

    const handleExpressionBuilderDone = (key, value) => {
        setAddEditQueryParam({ ...addEditQueryParam, value: value })
        setIsExpressionBuilderOpen(false)
    }

    const handleExpressionBuilderCancel = () => {
        setIsExpressionBuilderOpen(false)
    }

    const prepareBaseRequestSchema = (inputSchema) => {
        let schema = clone(inputSchema)

        let stack = [];

        stack.push(schema);

        while (stack.length) {
            if (stack[0].type === 'object') {
                delete stack[0].show
                delete stack[0].mapping
                for (let p in stack[0].properties) {
                    stack.push(stack[0].properties[p]);
                }
            } else {
                delete stack[0].mapping
            }
            stack.shift();
        }
        return schema
    }

    const handleRequestSchemaData = (key, schema) => {
        // console.log('handleRequestSchemaData', schema)
        if (requestSchema.mapping) {

            let tgtSchema = clone(requestSchema)
            let replace = false

            let srcStack = []

            schema.show = 'true'
            schema.mapping = tgtSchema.mapping

            let nextId = findMaxId(requestSchema, requestSchema.mapping.id) + 1

            // console.log('nextId', nextId)

            srcStack.push(schema.properties)
            while (srcStack.length) {
                for (let p in srcStack[0]) {
                    let mapping = findMapping(tgtSchema, p, 0)
                    // console.log('mapping', p, JSON.stringify(mapping))
                    if (mapping) {
                        srcStack[0][p].mapping = mapping
                    } else {
                        srcStack[0][p].mapping = {
                            id: nextId,
                            valueType: 'TEXT',
                            value: ''
                        }
                        nextId++
                    }
                    if (srcStack[0][p].type === 'object') {
                        srcStack[0][p].show = 'true'
                        srcStack.push(srcStack[0][p].properties)
                    }
                }
                srcStack.shift();
            }
            // console.log('schema', schema)
        } else {
            // console.log('Setting defaults')
            setDefaults(schema, 0)
        }

        // console.log('Req Schema', schema)
        setRequestSchema(schema)
        setBaseRequestSchema(prepareBaseRequestSchema(schema))
    }

    const setDefaults = (obj, idx) => {

        if (!obj.show) {
            obj.show = "true"
        }
        if (!obj.mapping) {
            obj.mapping = {
                id: idx,
                valueType: 'TEXT',
                value: ''
            }
        }
        idx++
        for (let p in obj.properties) {
            if (['string', 'number', 'integer'].includes(obj.properties[p].type)) {
                if (!obj.properties[p].mapping) {
                    obj.properties[p].mapping = {
                        id: idx,
                        valueType: 'TEXT',
                        value: ''
                    }
                }
                idx++
            }

            if (obj.properties[p].type === 'object') {
                setDefaults(obj.properties[p], idx)
            }
        }
    }

    const handleRequestSchemaMapperDone = (schema) => {
        // console.log('Mapper', schema)
        setRequestSchema(schema)
    }

    const findMapping = (schema, key, depth) => {

        let output = {}

        for (let p in schema.properties) {
            // console.log(p, key)
            if (p === key) {
                output = {
                    mapping: schema.properties[p].mapping,
                    breakLoop: true
                }
                break
            } else {
                if (schema.properties[p].type === 'object') {
                    output = findMapping(schema.properties[p], key, depth + 1)
                    if (output.breakLoop) {
                        break
                    }
                }
            }
        }
        if (depth === 0) {
            return output.mapping
        } else {
            return output
        }
    }

    const findMaxId = (schema, maxId) => {
        let idx = maxId
        for (let p in schema.properties) {
            if (schema.properties[p].mapping.id > idx) {
                // console.log('maxId', maxId)
                idx = schema.properties[p].mapping.id
            }
            if (schema.properties[p].type === 'object') {
                idx = findMaxId(schema.properties[p], idx)
            }
        }
        return idx
    }

    const handleResponseSchemaData = (key, value) => {
        setResponseSchema(value)
        let schema = clone(wfSchema)
        schema.properties[activityId].properties['task_' + taskId].properties['response'] = {
            type: "object",
            show: "true",
            properties: {
                value
            }
        }
        setWFSchema(schema)
        // console.log('handleResponseSchemaData', schema)
    }

    const handleRequestSchemaNodeLeafSelect = () => {
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
            <div id="addAPIDiv">
                <div className="listbg icolor1 mt-1">
                    <div className="col-12 row">
                        <div className="d-flex col-10 col pt-2 pl-3 pb-2">
                            <i className="mb-auto mt-auto fas fa-globe font-24 pr-3 icolor1"></i>
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

                    <div id="apiDiv" class="mt-1 p-1 primary-border">

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
                                        availableColumnOptions: [],
                                        columnOptions: [],
                                        fieldColumnOptions: [],
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
                            <label className="col-form-label"><u>API Definition</u></label>
                        </div>
                        <div className="form-row col-12 workflow-step-bg-color">
                            <div className="form-row col-12">
                                <div className="col-5 form-group">
                                    <label htmlFor="protocol" className="col-form-label">Protocol<span>*</span></label>
                                    <select
                                        id="protocol"
                                        value={apiConfig.protocol}
                                        className='form-control'
                                        onChange={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            setAPIConfig({ ...apiConfig, protocol: event.target.value })
                                        }}
                                    >
                                        <option value=''>Select Protocol</option>
                                        {
                                            (protocolOptions && protocolOptions.length) ?
                                                protocolOptions.map((w) => (
                                                    <option key={w.value} value={w.value}>{w.label}</option>
                                                ))
                                                :
                                                <></>
                                        }
                                    </select>
                                </div>
                                <div className="col-5 form-group">
                                    <label htmlFor="method" className="col-form-label">Method<span>*</span></label>
                                    <select
                                        id="method"
                                        value={apiConfig.method}
                                        className='form-control'
                                        onChange={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            setAPIConfig({ ...apiConfig, method: event.target.value })
                                        }}
                                    >
                                        <option value=''>Select Method</option>
                                        {
                                            (methodOptions && methodOptions.length) ?
                                                methodOptions.map((w) => (
                                                    <option key={w.value} value={w.value}>{w.label}</option>
                                                ))
                                                :
                                                <></>
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-row col-12">
                                <div className="col-5 form-group">
                                    <label htmlFor="endpoint" className="col-form-label">Endpoint<span>*</span></label>
                                    <select
                                        id="endpoint"
                                        value={apiConfig.endpoint}
                                        className='form-control'
                                        onChange={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            setAPIConfig({ ...apiConfig, endpoint: event.target.value })
                                        }}
                                    >
                                        <option value=''>Select Endpoint</option>
                                        {
                                            (endpointOptions && endpointOptions.length) ?
                                                endpointOptions.map((w) => (
                                                    <option key={w.value} value={w.value}>{w.label}</option>
                                                ))
                                                :
                                                <></>
                                        }
                                    </select>
                                </div>
                                <div className="col-5 form-group">
                                    <label htmlFor="Path" className="col-form-label">Path<span>*</span></label>
                                    <input
                                        key={'path'}
                                        id={'path'}
                                        type="text"
                                        className='form-control'
                                        value={apiConfig.path}
                                        onChange={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            setAPIConfig({ ...apiConfig, path: event.target.value })
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="col-12 form-group pr-0">
                                {
                                    (['GET', 'PUT', 'POST'].includes(apiConfig.method)) ?
                                        <>
                                            <label className="col-form-label">Query Parameters<span>*</span></label>
                                            {
                                                // console.log('Rendering queryParams', queryParams)
                                            }
                                            {
                                                <table className="workflow table border mb-1">
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: "10%" }}>S. No.</th>
                                                            <th>Parameter</th>
                                                            <th>Value Type</th>
                                                            <th>Value</th>
                                                            <th style={{ width: "9%" }}>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {
                                                            (queryParams && queryParams.length > 0) ?
                                                                queryParams.map((ri) => (
                                                                    <tr>
                                                                        <td>{ri.id}</td>
                                                                        <td>{ri.parameterName}</td>
                                                                        <td>{ri.valueType}</td>
                                                                        <td>{ri.value}</td>
                                                                        <td>
                                                                            <i className="fas fa-edit font-16 mr-1 icolor1"
                                                                                onClick={() => handleParamEdit(ri.id)}>
                                                                            </i>
                                                                            <i className="fas fa-trash font-16 icolor1"
                                                                                onClick={() => handleParamDelete(ri.id)}>
                                                                            </i>
                                                                        </td>

                                                                    </tr>
                                                                ))
                                                                :
                                                                <tr><td colSpan="5"><div className="row"><span>No parameters added yet, please click on + to add</span></div></td></tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            }
                                            {
                                                (['GET', 'PUT', 'POST'].includes(apiConfig.method)) ?
                                                    <div className="row d-flex justify-content-end">
                                                        <i className="fas fa-plus font-16 pr-3 icolor1"
                                                            onClick={() => {

                                                                setAddEditQueryParam({
                                                                    id: '',
                                                                    parameterName: '',
                                                                    valueType: 'TEXT',
                                                                    value: ''
                                                                })
                                                                setIsParameterModalOpen(true)
                                                            }}>
                                                        </i>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (isParameterModalOpen) ?
                                                    <ParameterModal isOpen={isParameterModalOpen}
                                                        onRequestClose={() => setIsParameterModalOpen(false)}
                                                        contentLabel="Row Data"
                                                        shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                                                        style={customStyles}>

                                                        <div className="form p-2">
                                                            <div className="row d-flex justify-content-between pl-2 pr-2">
                                                                <div><span><strong>HTTP Parameter</strong></span></div>
                                                                <div>
                                                                    <i style={{ cursor: "pointer" }}
                                                                        className="fas fa-check font-18 icolor1"
                                                                        onClick={() => handleAddUpdateParam()}>
                                                                    </i>

                                                                    <i onClick={() => setIsParameterModalOpen(false)}
                                                                        style={{ cursor: "pointer" }}
                                                                        className="ml-2 fas fa-times font-18 icolor1">
                                                                    </i>
                                                                </div>
                                                            </div>
                                                            <hr className="mt-2 mb-2" />

                                                            <div className="form-row col-12">
                                                                <div className="col-10 form-group">
                                                                    <label className="form-label">Parameter Name</label>
                                                                    <input
                                                                        key="fld-parameterName"
                                                                        id="fld-parameterName"
                                                                        type="text"
                                                                        className='form-control'
                                                                        value={addEditQueryParam.parameterName}
                                                                        onChange={(event) => {
                                                                            event.preventDefault()
                                                                            event.stopPropagation()
                                                                            if (event.nativeEvent) {
                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                            }
                                                                            setAddEditQueryParam({ ...addEditQueryParam, parameterName: event.target.value })
                                                                        }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-row col-12">
                                                                <div className="col-10 form-group">
                                                                    <label className="form-label">Parameter Value</label>
                                                                    <input
                                                                        key="fld-parameterValue"
                                                                        id="fld-parameterValue"
                                                                        type="text"
                                                                        className='form-control'
                                                                        value={addEditQueryParam.value}
                                                                        onChange={(event) => {
                                                                            event.preventDefault()
                                                                            event.stopPropagation()
                                                                            if (event.nativeEvent) {
                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                            }
                                                                            setAddEditQueryParam({ ...addEditQueryParam, value: event.target.value })
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="col-2 form-group">
                                                                    <label className="form-label">&nbsp;</label>
                                                                    <div className="d-flex mt-2">
                                                                        <div className="text-toggle">
                                                                            <div className={"justify-content-center " + ((addEditQueryParam.valueType === 'TEXT') ? ' selected' : ' other')}>
                                                                                <i className={"fas fa-font" + ((addEditQueryParam.valueType === 'TEXT') ? ' selected' : ' other')}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault()
                                                                                        event.stopPropagation()
                                                                                        if (event.nativeEvent) {
                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                        }
                                                                                        setAddEditQueryParam({ ...addEditQueryParam, valueType: 'TEXT' })
                                                                                    }}
                                                                                    style={{ cursor: "pointer" }}
                                                                                ></i>
                                                                            </div>
                                                                            <div className={((addEditQueryParam.valueType === 'EXPR') ? ' selected' : ' other')}>
                                                                                <i className={"fas fa-code" + ((addEditQueryParam.valueType === 'EXPR') ? ' selected' : ' other')}
                                                                                    onClick={(event) => {
                                                                                        event.preventDefault()
                                                                                        event.stopPropagation()
                                                                                        if (event.nativeEvent) {
                                                                                            event.nativeEvent.stopImmediatePropagation();
                                                                                        }
                                                                                        setAddEditQueryParam({ ...addEditQueryParam, valueType: 'EXPR' })
                                                                                    }}
                                                                                    style={{ cursor: "pointer" }}
                                                                                ></i>
                                                                            </div>
                                                                        </div>
                                                                        <button
                                                                            key="fld-exprbtn"
                                                                            id="fld-exprbtn"
                                                                            type="button"
                                                                            disabled={((addEditQueryParam.valueType === 'EXPR') ? '' : 'true')}
                                                                            className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                                                            onClick={(event) => {
                                                                                event.preventDefault()
                                                                                event.stopPropagation()
                                                                                if (event.nativeEvent) {
                                                                                    event.nativeEvent.stopImmediatePropagation();
                                                                                }
                                                                                setIsExpressionBuilderOpen(true)
                                                                            }}
                                                                        ><i
                                                                            className="mt-auto mb-auto fas fa-project-diagram font-12"
                                                                        ></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ParameterModal>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (apiConfig && ['PUT', 'POST'].includes(apiConfig.method)) ?
                                                    <>
                                                        <div className="form-row col-12 mb-2">
                                                            <label className="col-form-label"><u>Request Schema</u></label>
                                                        </div>
                                                        <ul className="nav nav-tabs mb-1">
                                                            <li key="schema" className="nav-item pl-0">
                                                                <button
                                                                    className={"nav-link " + ((requestActiveTab === 'schema') ? "active" : "")}
                                                                    onClick={() => {
                                                                        setBaseRequestSchema(prepareBaseRequestSchema(requestSchema))
                                                                        setRequestActiveTab('schema')
                                                                    }}
                                                                >
                                                                    Schema
                                                                </button>
                                                            </li>
                                                            <li key="mapper" className="nav-item">
                                                                <button
                                                                    className={"nav-link " + ((requestActiveTab === 'mapper') ? "active" : "")}
                                                                    onClick={() => setRequestActiveTab('mapper')}
                                                                >
                                                                    Mapping
                                                                </button>
                                                            </li>
                                                        </ul>
                                                        {
                                                            (requestActiveTab === 'schema') ?
                                                                <div className="form-row col-12 mt-2 mr-0 pr-0">
                                                                    <JSONTextArea
                                                                        data={{
                                                                            id: 'requestSchema',
                                                                            placeHolder: 'Enter Request Schema',
                                                                            valueJSON: baseRequestSchema,
                                                                            key: 'request'
                                                                        }}
                                                                        handler={{
                                                                            handleDone: handleRequestSchemaData
                                                                        }}
                                                                    />
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                        {/* console.log('RequestSchemaViewer', wfSchema) */}
                                                        {
                                                            (requestActiveTab === 'mapper') ?
                                                                (requestSchema && requestSchema.type) ?

                                                                    <RequestSchemaViewer
                                                                        data={{
                                                                            renderSchema: requestSchema,
                                                                            expressionBuilderSchema: wfSchema,
                                                                            key: 'root',
                                                                            useMode: 'mapper'
                                                                        }}
                                                                        handler={{
                                                                            handleNodeLeafSelect: handleRequestSchemaNodeLeafSelect,
                                                                            handleMapperDone: handleRequestSchemaMapperDone
                                                                        }}
                                                                    />
                                                                    :
                                                                    <span>No request schema provided, please click on the Schema tab to continue</span>
                                                                :
                                                                <></>
                                                        }
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            <div className="mt-2 form-row col-12 workflow-step-label-bg-color">
                                                <label className="col-form-label"><u>Response Schema</u></label>
                                            </div>
                                            <div className="form-row col-12">
                                                <JSONTextArea
                                                    data={{
                                                        id: 'responseSchema',
                                                        placeHolder: 'Enter Response Schema',
                                                        valueJSON: responseSchema,
                                                        key: 'response'
                                                    }}
                                                    handler={{
                                                        handleDone: handleResponseSchemaData
                                                    }}
                                                />
                                            </div>
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
                                                availableColumnOptions: [],
                                                columnOptions: [],
                                                fieldColumnOptions: [],
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
                    </div>
                    :
                    <></>
            }
            {
                (IsExpressionBuilderOpen) ?
                    <ExpressionBuilderModal isOpen={IsExpressionBuilderOpen}
                        onRequestClose={() => setIsExpressionBuilderOpen(false)}
                        contentLabel="Tree View"
                        shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                        style={customStyles}>

                        <div className="form p-2">
                            <ExpressionBuilder
                                data={{
                                    wfSchema: wfSchema,
                                    key: addEditQueryParam.id
                                }}
                                handler={{
                                    handleDone: handleExpressionBuilderDone,
                                    handleCancel: handleExpressionBuilderCancel
                                }}
                            />
                        </div>
                    </ExpressionBuilderModal>
                    :
                    <></>
            }
        </div>
    );
};
export default APITask;