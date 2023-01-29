import React, { useRef, useState, useEffect } from "react";
import ReactSelect from 'react-select'
import { getNextId, formatValue } from '../../wf/wf-utils'
import SchemaTreeModal from 'react-modal'
import ExpressionBuilder from "./expressionBuilder"

let clone = require('clone');

const RuleBuilder = (props) => {

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

    const keyRef = props.data.keyRef
    const taskId = props.data.taskId
    const ruleType = props.data.ruleType
    const rules = props.data.rules
    const availableColumnOptions = props.data.availableColumnOptions
    const columnOptions = props.data.columnOptions
    const fieldColumnOptions = props.data.fieldColumnOptions
    const wfConfig = props.data.wfConfig
    const wfSchema = props.data.wfSchema

    const setRules = props.handler.setRules

    const [rulesUI, setRulesUI] = useState([])

    const [viewMode, setViewMode] = useState('edit')

    const [expressionBuilderKey, setExpressionBuilderKey] = useState(false)

    const [isTreeViewOpen, setIsTreeViewOpen] = useState(false)

    useEffect(() => {
        // console.log('Rule Builder Use Effect ', viewMode)
        if (props.data.viewMode && props.data.viewMode !== '') {
            setViewMode(props.data.viewMode)
        } else {
            setViewMode('edit')
        }
    }, [props.data.viewMode])

    useEffect(() => {
        // console.log('Rule Builder Use Effect ', viewMode)
        if (rules && rules !== null) {
            setRulesUI(renderRules(rules, null, null))
        }
    }, [rules, availableColumnOptions, viewMode])

    const handleRuleOrGroup = (type, groupLevel, groupId, elementId, elementValue) => {
        let newRules = clone(rules)
        findAndApplyAction(newRules, type, groupLevel, groupId, elementId, elementValue)
        // console.log('handleRuleOrGroup', newRules)
        setRules(newRules, keyRef)
    }

    const findAndApplyAction = (obj, type, groupLevel, groupId, elementId, elementValue) => {
        // console.log('findAndApplyAction', obj, type, groupLevel, groupId)
        for (let [i, e] of obj.entries()) {
            if (e.hasOwnProperty('rules')) {
                const nextId = getNextId(e['rules'], 'id')
                if (e.level === groupLevel && e.id === groupId) {
                    if (type === 'ADD-GROUP') {
                        e['rules'].push({
                            id: nextId,
                            level: groupLevel + 1,
                            rules: [],
                            combinator: 'AND'
                        })
                    } else if (type === 'REMOVE-GROUP') {
                        // console.log('Deleting...', e, i, groupLevel, groupId)
                        obj.splice(i, 1)

                    } else if (type === 'SET-COMBINATOR') {
                        e['combinator'] = elementValue

                    } else if (type === 'ADD-RULE') {
                        e['rules'].push({
                            id: nextId,
                            field: "",
                            fieldType: (ruleType === 'SQL') ? 'COLUMN' : 'EXPR',
                            value: "",
                            valueType: 'TEXT',
                            operator: "="
                        })
                    } else if (type === 'REMOVE-ELEMENT') {
                        // console.log("e-rules", e['rules'])
                        let reqIdx = 0
                        for (let s of e['rules']) {
                            if (s.id === elementId) {
                                break
                            }
                            reqIdx++
                        }
                        e['rules'].splice(reqIdx, 1)
                    } else if (type === 'SET-RULE-FIELD') {
                        // console.log(e['rules'], type, groupLevel, groupId, elementId, elementValue)
                        for (let s of e['rules']) {
                            if (s.id === elementId) {
                                s.field = elementValue
                                break
                            }
                        }
                    } else if (type === 'SET-RULE-OPERATOR') {
                        // console.log(obj, type, groupLevel, groupId, elementId, elementValue)
                        for (let s of e['rules']) {
                            if (s.id === elementId) {
                                s.operator = elementValue
                                break
                            }
                        }
                    } else if (type === 'SET-RULE-VALUE') {
                        // console.log("e-rules", e['rules'])
                        for (let s of e['rules']) {
                            // console.log(s)
                            if (s.id === elementId) {
                                // console.log(s.tableName, s.columnName, s.valueType, elementValue)
                                if (s.fieldType === 'COLUMN') {
                                    s.value = formatValue(columnOptions, s.field.tableName, s.field.value, s.valueType, elementValue)
                                } else if (s.fieldType === 'EXPR') {
                                    s.value = elementValue
                                }
                                break
                            }
                        }
                    } else if (type === 'SET-RULE-VALUETYPE') {
                        // console.log("e-rules", e['rules'])
                        for (let s of e['rules']) {
                            if (s.id === elementId) {
                                s.valueType = elementValue
                                break
                            }
                        }
                    }
                } else {
                    findAndApplyAction(e['rules'], type, groupLevel, groupId, elementId, elementValue)
                }
            }
        }
    }

    const renderRules = (obj, groupLevel, groupId) => {

        // console.log(taskId, obj, groupLevel, groupId)

        const htmlElementCollector = []
        for (let e of obj) {
            if (e.hasOwnProperty('rules')) {
                htmlElementCollector.push(
                    <>
                        <div key={'g-' + e.id} id={'g-' + e.id}
                            style={{
                                border: "1px solid black",
                                backgroundColor: "rgb(" + (240 - (e.level - 1) * 5) + ", " + (240 - (e.level - 1) * 5) + ", " + (240 - (e.level - 1) * 5) + ")",
                                marginLeft: (e.level === 1) ? "0px" : "10px",
                                marginTop: "5px",
                                paddingBottom: "5px"
                            }}>
                            <div className="form-row" style={{ marginLeft: "5px", marginTop: "5px" }}>
                                <div className="col-10 d-flex">
                                    <select
                                        disabled={(viewMode === 'view') ? true : ''}
                                        key={'c-' + e.id}
                                        id={'c-' + e.id}
                                        value={e['combinator']}
                                        className='form-control'
                                        onChange={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            handleRuleOrGroup('SET-COMBINATOR', e.level, e.id, null, event.target.value)
                                        }}
                                        style={{ width: "75px", height: "30px", fontSize: "0.7rem" }}
                                    >
                                        <option key='AND' value='AND'>And</option>
                                        <option key='OR' value='OR'>Or</option>
                                    </select>
                                    <button
                                        disabled={(viewMode === 'view') ? true : ''}
                                        key={'b-r-' + e.id}
                                        id={'b-r-' + e.id}
                                        type="button"
                                        className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                        onClick={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            // console.log('onClick', e.level, e.id)
                                            handleRuleOrGroup('ADD-RULE', e.level, e.id, null, null)
                                        }}
                                    >Add Rule</button>
                                    <button
                                        disabled={(viewMode === 'view') ? true : ''}
                                        key={'ab-g-' + e.id}
                                        id={'ab-g-' + e.id}
                                        type="button"
                                        className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                        onClick={(event) => {
                                            event.preventDefault()
                                            event.stopPropagation()
                                            if (event.nativeEvent) {
                                                event.nativeEvent.stopImmediatePropagation();
                                            }
                                            // console.log('onClick', e.level, e.id)
                                            handleRuleOrGroup('ADD-GROUP', e.level, e.id, null, null)
                                        }}
                                    >Add Group</button>
                                    {
                                        (e.level > 1) ?
                                            <button
                                                disabled={(viewMode === 'view') ? true : ''}
                                                key={'rb-g-' + e.id}
                                                id={'rb-g-' + e.id}
                                                type="button"
                                                className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    event.stopPropagation()
                                                    if (event.nativeEvent) {
                                                        event.nativeEvent.stopImmediatePropagation();
                                                    }
                                                    // console.log('onClick', e.level, e.id)
                                                    handleRuleOrGroup('REMOVE-GROUP', e.level, e.id, null, null)
                                                }}
                                            >X</button>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                            {
                                renderRules(e['rules'], e.level, e.id)
                            }
                        </div>
                    </>
                )
            } else {

                htmlElementCollector.push(
                    <div key={'col-' + e.id} className="row" style={{ marginLeft: "10px", marginTop: "5px" }}>
                        <div key={'col-' + e.id} className="col-12 d-flex">
                            {
                                (e.fieldType === 'COLUMN') ?
                                    <ReactSelect
                                        disabled={(viewMode === 'view') ? true : ''}
                                        key={'col-' + e.id}
                                        id={'col-' + e.id}
                                        options={fieldColumnOptions}
                                        isMulti={false}
                                        onChange={(columns) => {
                                            handleRuleOrGroup('SET-RULE-FIELD', groupLevel, groupId, e.id, columns)
                                        }}
                                        value={e.field}
                                        className='react-select-size mr-1'
                                        classNamePrefix='colSelect'
                                    />
                                    :
                                    <></>
                            }
                            {
                                (e.fieldType === 'EXPR') ?
                                    <>
                                        <input
                                            readOnly={(viewMode === 'view') ? true : ''}
                                            key={'fld-' + e.id}
                                            id={'fld-' + e.id}
                                            type="text"
                                            className='form-control'
                                            value={e.field}
                                            onChange={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                if (event.nativeEvent) {
                                                    event.nativeEvent.stopImmediatePropagation();
                                                }
                                                handleRuleOrGroup('SET-RULE-FIELD', groupLevel, groupId, e.id, event.target.value)
                                            }}
                                            style={{ width: "150px", height: "30px", fontSize: "0.7rem" }}
                                        />
                                        <button
                                            disabled={(viewMode === 'view') ? true : ''}
                                            key={'fld-exprb-' + e.id}
                                            id={'fld-exprb-' + e.id}
                                            type="button"
                                            className="btn btn-primary btn-xs waves-effect waves-light ml-1 mr-1"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                if (event.nativeEvent) {
                                                    event.nativeEvent.stopImmediatePropagation();
                                                }
                                                setExpressionBuilderKey({
                                                    p1: 'SET-RULE-FIELD',
                                                    p2: groupLevel,
                                                    p3: groupId,
                                                    p4: e.id
                                                })
                                                setIsTreeViewOpen(true)
                                            }}
                                        ><i
                                            className="mt-auto mb-auto fas fa-project-diagram font-12"
                                        ></i></button>
                                    </>
                                    :
                                    <></>
                            }
                            <select
                                disabled={(viewMode === 'view') ? true : ''}
                                key={'op-' + e.id}
                                id={'op-' + e.id}
                                value={e.operator}
                                className='form-control mr-1'
                                onChange={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                    handleRuleOrGroup('SET-RULE-OPERATOR', groupLevel, groupId, e.id, event.target.value)
                                }}
                                style={{ width: "50px", height: "30px", fontSize: "0.7rem" }}
                            >
                                {
                                    wfConfig.database.operators.map((e) => {
                                        return (
                                            <option key={e.value} value={e.value}>{e.label}</option>
                                        )
                                    })
                                }
                            </select>
                            <input
                                readOnly={(viewMode === 'view') ? true : ''}
                                key={'fld-' + e.id}
                                id={'fld-' + e.id}
                                type="text"
                                className='form-control'
                                value={e.value}
                                onChange={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                    handleRuleOrGroup('SET-RULE-VALUE', groupLevel, groupId, e.id, event.target.value)
                                }}
                                style={{ width: "150px", height: "30px", fontSize: "0.7rem" }}
                            />
                            <div className="text-toggle">
                                <div className={"justify-content-center " + ((e.valueType === 'TEXT') ? ' selected' : ' other') + ((viewMode === 'view') ? ' disabled' : '')}>
                                    {
                                        (viewMode === 'view') ?
                                            <i className={"fas fa-font" + ((e.valueType === 'TEXT') ? ' selected' : ' other')}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                            :
                                            <i className={"fas fa-font" + ((e.valueType === 'TEXT') ? ' selected' : ' other')}
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    event.stopPropagation()
                                                    if (event.nativeEvent) {
                                                        event.nativeEvent.stopImmediatePropagation();
                                                    }
                                                    handleRuleOrGroup('SET-RULE-VALUETYPE', groupLevel, groupId, e.id, 'TEXT')
                                                }}
                                                style={{ cursor: "pointer" }}
                                            ></i>

                                    }
                                </div>
                                <div className={"justify-content-center " + ((e.valueType === 'EXPR') ? ' selected' : ' other') + ((viewMode === 'view') ? ' disabled' : '')}>
                                    {
                                        (viewMode === 'view') ?
                                            <i className={"fas fa-code" + ((e.valueType === 'EXPR') ? ' selected' : ' other')}
                                                style={{ cursor: "pointer" }}
                                            ></i>
                                            :
                                            <i className={"fas fa-code" + ((e.valueType === 'EXPR') ? ' selected' : ' other')}
                                                onClick={(event) => {
                                                    event.preventDefault()
                                                    event.stopPropagation()
                                                    if (event.nativeEvent) {
                                                        event.nativeEvent.stopImmediatePropagation();
                                                    }
                                                    handleRuleOrGroup('SET-RULE-VALUETYPE', groupLevel, groupId, e.id, 'EXPR')
                                                }}
                                                style={{ cursor: "pointer" }}
                                            ></i>

                                    }
                                </div>
                            </div>
                            <button
                                disabled={(viewMode === 'view') ? true : ''}
                                key={'fld-exprb-' + e.id}
                                id={'fld-exprb-' + e.id}
                                type="button"
                                disabled={((e.valueType === 'EXPR') ? '' : 'true')}
                                className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                    setExpressionBuilderKey({
                                        p1: 'SET-RULE-VALUE',
                                        p2: groupLevel,
                                        p3: groupId,
                                        p4: e.id
                                    })
                                    setIsTreeViewOpen(true)
                                }}
                            ><i
                                className="mt-auto mb-auto fas fa-project-diagram font-12"
                            ></i></button>
                            <button
                                disabled={(viewMode === 'view') ? true : ''}
                                key={'fld-rb-' + e.id}
                                id={'fld-rb-' + e.id}
                                type="button"
                                className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                onClick={(event) => {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    if (event.nativeEvent) {
                                        event.nativeEvent.stopImmediatePropagation();
                                    }
                                    // console.log('onClick', e.level, e.id)
                                    handleRuleOrGroup('REMOVE-ELEMENT', groupLevel, groupId, e.id, null)
                                }}
                            >X</button>
                        </div>
                    </div>
                )
            }
        }
        return htmlElementCollector
    }

    const handleExpressionBuilderDone = (key, value) => {
        handleRuleOrGroup(key.p1, key.p2, key.p3, key.p4, value)
        setIsTreeViewOpen(false)
    }

    const handleExpressionBuilderCancel = () => {
        setIsTreeViewOpen(false)
    }

    return (
        <div className="rule-builder">
            {
                (rulesUI && rulesUI !== null) ?
                    rulesUI
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
    );
};
export default RuleBuilder;