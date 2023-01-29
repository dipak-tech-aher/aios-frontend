import React, { useRef, useState, useEffect } from "react";
import ExpressionBuilderModal from 'react-modal'
import ExpressionBuilder from "./expressionBuilder";

let clone = require('clone');

const SchemaViewer = (props) => {

    let key = props.data.key
    let useMode = props.data.useMode

    let handleNodeLeafSelect = props.handler.handleNodeLeafSelect

    let handleMapperDone = props.handler.handleMapperDone

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

    const [schemaTree, setSchemaTree] = useState({})

    const [expressionBuilderSchema, setExpressionBuilderSchema] = useState({})

    const [expressionBuilderKey, setExpressionBuilderKey] = useState('')

    const [IsExpressionBuilderOpen, setIsExpressionBuilderOpen] = useState(false)

    const [schemaTreeUI, setSchemaTreeUI] = useState([])

    const [viewEditMode, setViewEditMode] = useState('view')

    useEffect(() => {
        // console.log('Schema Tree use Effect', props.data.renderSchema)
        if (props.data.renderSchema && props.data.renderSchema !== null) {
            setSchemaTree(clone(props.data.renderSchema))
            // console.log('setSchemaTree-1')
            setSchemaTreeUI(renderSchemeTreeUI(props.data.renderSchema, 0))
        }
    }, [props.data.renderSchema])

    useEffect(() => {
        // console.log('Use Effect for Rendering UI', schemaTree)
        if (schemaTree && schemaTree !== null) {
            setSchemaTreeUI(renderSchemeTreeUI(schemaTree, 0))
        }
    }, [schemaTree, viewEditMode])

    useEffect(() => {
        // console.log('expressionBuilderSchema use Effect', props.data.expressionBuilderSchema)
        if (props.data.expressionBuilderSchema && props.data.expressionBuilderSchema !== null) {
            setExpressionBuilderSchema(props.data.expressionBuilderSchema)
        }
    }, [props.data.expressionBuilderSchema])

    const handleExpandCollapse = (e, key, schema) => {

        if (key === 'root') {
            schema.show = (schema.show === 'true') ? 'false' : 'true'
        } else {
            for (let p in schema.properties) {
                // console.log(p, key)
                if (p === key) {
                    schema.properties[p].show = (schema.properties[p].show === 'true') ? 'false' : 'true'
                    break
                } else {
                    handleExpandCollapse(e, key, schema.properties[p])
                }
            }
        }
    }

    const buildExpression = (key, schema, expr) => {
        console.log('key...', key)
        console.log('schema...', schema)
        console.log('expr...', expr)
        let out
        let found = false
        let val = ''

        if (key !== 'root') {
            for (let p in schema.properties) {
                console.log('buildExpression2', p)
                if (schema.properties[p].type === 'object') {
                    out = buildExpression(key, schema.properties[p], expr + '.' + p);
                    console.log('out....',out)
                    if (out.found) {
                        val = out.expr
                        found = true
                        break;
                    }
                } else {
                    console.log('exprexprexprexprexpr....', expr)
                    if (p === key) {
                        val = expr + '.' + p
                        found = true
                        break
                    }
                }
            }
            return { expr: val, found: found }
        } else {
            return { expr: '$', found: found }
        }
    }

    const handleRuleOrGroup = () => {

    }

    const handleExpressionBuilderDone = (key, value) => {
        // console.log('handleSetValue', key, value)
        handleSetValue(key, value)
        setIsExpressionBuilderOpen(false)
    }

    const handleExpressionBuilderCancel = () => {
        setIsExpressionBuilderOpen(false)
    }

    const handleNodeElementClick = (p) => {
        console.log('handleNodeElementClick........', schemaTree)
        let out = buildExpression(p, schemaTree, '$.context')
        handleNodeLeafSelect(out.expr)
        console.log('handleNodeLeafSelect......', p, schemaTree, out.expr)
    }

    const handleSetValueType = (key, value) => {
        let schema = clone(schemaTree)
        findAndApply('VALUE-TYPE', key, value, schema)
        setSchemaTree(schema)
        // console.log('schema', schema)
    }

    const handleSetValue = (key, value) => {
        let schema = clone(schemaTree)
        findAndApply('VALUE', key, value, schema)
        setSchemaTree(schema)
        // console.log('schema', schema)
    }

    const findAndApply = (attrType, key, value, schema) => {
        // console.log('findAndApply1', JSON.stringify(schema))
        if (schema.mapping.id === key) {
            if (attrType === 'VALUE-TYPE') {
                schema.mapping.valueType = value
            } else if (attrType === 'VALUE') {
                schema.mapping.value = value
            }
        } else {
            for (let p in schema.properties) {
                // console.log('schema.properties', p, schema.properties[p])
                findAndApply(attrType, key, value, schema.properties[p])
            }
        }
    }

    const renderSchemeTreeUI = (obj, idx) => {

        // console.log('renderSchemeTreeUI', obj)
        const htmlElementCollector = []

        if (obj.show === "true") {
            let pidx = 0
            for (let p in obj.properties) {
                htmlElementCollector.push(
                    (obj.properties[p].type === 'object') ?
                        <>
                            <li key={'li-node-' + idx} id={'li-node-' + idx} className='node'>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center">
                                            <div className="line-v"></div>
                                            <div className="line-h"></div>
                                            <i className={'far ' + ((obj.properties[p].show === 'true') ? 'fa-minus-square' : 'fa-plus-square')}
                                                onClick={(e) => {
                                                    let schema = clone(schemaTree)
                                                    handleExpandCollapse(e, p, schema)
                                                    // console.log('setSchemaTree-2')
                                                    setSchemaTree(schema)
                                                }}
                                            >
                                            </i>
                                            <i className="mdi mdi-code-braces node-type"></i>
                                            <span>{p} ({obj.properties[p].name})</span>
                                        </div>
                                    </div>
                                    {
                                        (useMode === 'mapper') ?
                                            <div className="d-flex mapper-container">
                                                {
                                                    (viewEditMode === 'view') ?
                                                        <span>{(obj.properties[p].mapping) ? obj.properties[p].mapping.value : ''}</span>
                                                        :
                                                        <>
                                                            <input
                                                                key={'fld-' + obj.properties[p].mapping.id}
                                                                id={'fld-' + obj.properties[p].mapping.id}
                                                                type="text"
                                                                className='form-control ml-auto'
                                                                value={obj.properties[p].mapping.value}
                                                                onChange={(event) => {
                                                                    event.preventDefault()
                                                                    event.stopPropagation()
                                                                    if (event.nativeEvent) {
                                                                        event.nativeEvent.stopImmediatePropagation();
                                                                    }
                                                                    handleSetValue(obj.properties[p].mapping.id, event.target.value)
                                                                }}
                                                            />
                                                            <div className="text-toggle">
                                                                <div className={"justify-content-center " + ((obj.properties[p].mapping.valueType === 'TEXT') ? ' selected' : ' other')}>
                                                                    <i className={"fas fa-font" + ((obj.properties[p].mapping.valueType === 'TEXT') ? ' selected' : ' other')}
                                                                        onClick={(event) => {
                                                                            event.preventDefault()
                                                                            event.stopPropagation()
                                                                            if (event.nativeEvent) {
                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                            }
                                                                            handleSetValueType(obj.properties[p].mapping.id, 'TEXT')
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    ></i>
                                                                </div>
                                                                <div className={((obj.properties[p].mapping.valueType === 'EXPR') ? ' selected' : ' other')}>
                                                                    <i className={"fas fa-code" + ((obj.properties[p].mapping.valueType === 'EXPR') ? ' selected' : ' other')}
                                                                        onClick={(event) => {
                                                                            event.preventDefault()
                                                                            event.stopPropagation()
                                                                            if (event.nativeEvent) {
                                                                                event.nativeEvent.stopImmediatePropagation();
                                                                            }
                                                                            handleSetValueType(obj.properties[p].mapping.id, 'EXPR')
                                                                        }}
                                                                        style={{ cursor: "pointer" }}
                                                                    ></i>
                                                                </div>
                                                            </div>
                                                            <button
                                                                key={'fld-exprb-' + obj.properties[p].mapping.id}
                                                                id={'fld-exprb-' + obj.properties[p].mapping.id}
                                                                type="button"
                                                                disabled={((obj.properties[p].mapping.valueType === 'EXPR') ? '' : true)}
                                                                className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    event.stopPropagation()
                                                                    if (event.nativeEvent) {
                                                                        event.nativeEvent.stopImmediatePropagation();
                                                                    }
                                                                    setExpressionBuilderKey(obj.properties[p].mapping.id)
                                                                    setIsExpressionBuilderOpen(true)
                                                                }}
                                                            ><i
                                                                className="mt-auto mb-auto fas fa-project-diagram font-12"
                                                            ></i></button>
                                                        </>
                                                }
                                            </div>
                                            :
                                            <></>
                                    }
                                </div>
                                {
                                    <ul key={"ul-node-" + idx} className="node">
                                        {
                                            renderSchemeTreeUI(obj.properties[p], ++idx)
                                        }
                                    </ul>
                                }

                            </li>
                        </>
                        :
                        (useMode === 'mapper') ?
                            <li key={'li-leaf-' + obj.properties[p].mapping.id} className='leaf'>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center">
                                            <div className="line-v"></div>
                                            <div className="line-h"></div>
                                            {
                                                (obj.properties[p].type === 'string') ?
                                                    <i className='mdi mdi-code-string'></i>
                                                    :
                                                    <i className='mdi mdi-numeric-9-box'></i>
                                            }
                                            <span>{p}</span>
                                        </div>
                                    </div>
                                    <div className="d-flex mapper-container">
                                        {
                                            (viewEditMode === 'view') ?
                                                <span>{(obj.properties[p].mapping) ? obj.properties[p].mapping.value : ''}</span>
                                                :
                                                <>
                                                    <input
                                                        key={'fld-' + obj.properties[p].id}
                                                        id={'fld-' + obj.properties[p].id}
                                                        type="text"
                                                        className='form-control ml-auto'
                                                        value={obj.properties[p].mapping.value}
                                                        onChange={(event) => {
                                                            event.preventDefault()
                                                            event.stopPropagation()
                                                            if (event.nativeEvent) {
                                                                event.nativeEvent.stopImmediatePropagation();
                                                            }
                                                            handleSetValue(obj.properties[p].mapping.id, event.target.value)
                                                        }}
                                                    />
                                                    <div className="text-toggle">
                                                        <div className={"justify-content-center " + ((obj.properties[p].mapping.valueType === 'TEXT') ? ' selected' : ' other')}>
                                                            <i className={"fas fa-font" + ((obj.properties[p].mapping.valueType === 'TEXT') ? ' selected' : ' other')}
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    event.stopPropagation()
                                                                    if (event.nativeEvent) {
                                                                        event.nativeEvent.stopImmediatePropagation();
                                                                    }
                                                                    handleSetValueType(obj.properties[p].mapping.id, 'TEXT')
                                                                }}
                                                                style={{ cursor: "pointer" }}
                                                            ></i>
                                                        </div>
                                                        <div className={((obj.properties[p].mapping.valueType === 'EXPR') ? ' selected' : ' other')}>
                                                            <i className={"fas fa-code" + ((obj.properties[p].mapping.valueType === 'EXPR') ? ' selected' : ' other')}
                                                                onClick={(event) => {
                                                                    event.preventDefault()
                                                                    event.stopPropagation()
                                                                    if (event.nativeEvent) {
                                                                        event.nativeEvent.stopImmediatePropagation();
                                                                    }
                                                                    handleSetValueType(obj.properties[p].mapping.id, 'EXPR')
                                                                }}
                                                                style={{ cursor: "pointer" }}
                                                            ></i>
                                                        </div>
                                                    </div>
                                                    <button
                                                        key={'fld-exprb-' + obj.properties[p].id}
                                                        id={'fld-exprb-' + obj.properties[p].id}
                                                        type="button"
                                                        disabled={((obj.properties[p].mapping.valueType === 'EXPR') ? '' : true)}
                                                        className="btn btn-primary btn-xs waves-effect waves-light ml-1"
                                                        onClick={(event) => {
                                                            event.preventDefault()
                                                            event.stopPropagation()
                                                            if (event.nativeEvent) {
                                                                event.nativeEvent.stopImmediatePropagation();
                                                            }
                                                            setExpressionBuilderKey(obj.properties[p].mapping.id)
                                                            setIsExpressionBuilderOpen(true)
                                                        }}
                                                    ><i
                                                        className="mt-auto mb-auto fas fa-project-diagram font-12"
                                                    ></i></button>
                                                </>
                                        }
                                    </div>
                                </div>
                            </li>
                            :
                            <li key={'li-leaf-' + idx + '-' + pidx} id={'li-leaf-' + idx} className='leaf'
                                onClick={(e) => {
                                    handleNodeElementClick(p)
                                }}
                            >
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center">
                                            <div className="line-v"></div>
                                            <div className="line-h"></div>
                                            {
                                                (obj.properties[p].type === 'string') ?
                                                    <i className='mdi mdi-code-string'></i>
                                                    :
                                                    <i className='mdi mdi-numeric-9-box'></i>
                                            }
                                            <span>{p}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                )
                pidx = pidx + 1
            }
        }
        return htmlElementCollector
    }

    return (
        <>
            {/* console.log('Rendering Schema', schemaTree, key) */}
            <div className="d-flex">
                <div className="wf-json-viewer flex-grow-1">
                    <ul key="ul-root" id="ul-root" className="root">
                        <li key="li-root" id="li-root">
                            <div className="d-flex align-items-center">
                                <i className={'far ' + ((schemaTree.show === 'true') ? 'fa-minus-square' : 'fa-plus-square')}
                                    onClick={(e) => {
                                        let schema = clone(schemaTree)
                                        handleExpandCollapse(e, 'root', schema)
                                        // console.log('handleExpandCollapse', key, schema)
                                        setSchemaTree(schema)
                                        // console.log('setSchemaTree-3')
                                    }}>
                                </i>
                                <i className="mdi mdi-code-braces node-type"></i>
                                <span>root</span>
                            </div>
                            <ul key="ul-node-0" id="ul-node-0">
                                {
                                    (schemaTreeUI && schemaTreeUI !== null) ?
                                        schemaTreeUI
                                        :
                                        <></>
                                }
                            </ul>
                        </li>
                    </ul>
                </div>
                {
                    (useMode === 'mapper') ?
                        (viewEditMode === 'view') ?
                            <i
                                style={{ cursor: "pointer" }}
                                className="fas fa-pen ml-1 font-16 icolor1 align-self-start"
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    e.nativeEvent.stopImmediatePropagation();
                                    // console.log('Text area clicked')
                                    setViewEditMode('edit')
                                }}
                            >
                            </i>
                            :
                            <div className="d-flex flex-column ml-1">
                                <i
                                    style={{ cursor: "pointer" }}
                                    className="fas fa-check font-16 icolor1"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        e.nativeEvent.stopImmediatePropagation();
                                        handleMapperDone(schemaTree)
                                        setViewEditMode('view')
                                    }}
                                >
                                </i>
                                <i
                                    style={{ cursor: "pointer" }}
                                    className="fas fa-times mt-1 font-16 icolor1"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        e.nativeEvent.stopImmediatePropagation();
                                        setSchemaTree(clone(props.data.renderSchema))
                                        setViewEditMode('view')
                                    }}
                                >
                                </i>
                            </div>
                        :
                        <></>
                }
            </div>
            {
                (IsExpressionBuilderOpen) ?
                    <ExpressionBuilderModal isOpen={IsExpressionBuilderOpen}
                        onRequestClose={() => setIsExpressionBuilderOpen(false)}
                        contentLabel="Tree View"
                        shouldCloseOnOverlayClick={false} shouldCloseOnEsc={false}
                        style={customStyles}>
                        <div className="form p-2">
                            <hr className="mt-2 mb-2" />
                            {/*console.log('Opening EB', expressionBuilderSchema, expressionBuilderKey)*/}
                            <ExpressionBuilder
                                data={{
                                    wfSchema: expressionBuilderSchema,
                                    key: expressionBuilderKey
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
        </>
    );
};
export default SchemaViewer;