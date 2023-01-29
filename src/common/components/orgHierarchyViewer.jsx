import React, { useRef, useState, useEffect } from "react";
import ExpressionBuilderModal from 'react-modal'
import ExpressionBuilder from "./expressionBuilder";
import StatusSelector from 'react-select'

let clone = require('clone');

const SchemaViewer = (props) => {

    // console.log('Loading Schema Viewer for ', 
    //     props.data.key, props.data.category, 
    //     props.data.renderSchema, props.data.statusLookups,
    //     props.data.parentViewEditMode)

    let key = props.data.key
    let category = props.data.category

    let handleRoleSelectDone = props.handler.handleRoleSelectDone

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

    const [schemaTree, setSchemaTree] = useState([])
    const [rolesMaster, setRolesMaster] = useState([])

    const [statusLookups, setStatusLookups] = useState([])

    const [selectedRoles, setSelectedRoles] = useState([])

    const [schemaTreeUI, setSchemaTreeUI] = useState([])

    const [viewEditMode, setViewEditMode] = useState('view')

    const [parentViewEditMode, setParentViewEditMode] = useState('edit')

    useEffect(() => {
        // console.log('UseEffect - props.data.statusLookups', props.data.statusLookups)
        if (props.data.statusLookups && props.data.statusLookups.length > 0) {
            // console.log('Setting status lookup', props.data.statusLookups)
            setStatusLookups(props.data.statusLookups)
        }
    }, [props.data.statusLookups])

    useEffect(() => {
        // console.log('props.data.renderSchema Use Effect', props.data.renderSchema, key, category)
        if (props.data.renderSchema && props.data.renderSchema.length > 0) {
            // console.log('setSchemaTree-1', clone(props.data.renderSchema))
            setSchemaTree(clone(props.data.renderSchema))
            setRolesMaster(clone(props.data.rolesMaster))
        }
    }, [props.data.renderSchema])

    useEffect(() => {
        // console.log('props.data.selectedRoles Use Effect', props.data.selectedRoles, category)
        if (props.data.selectedRoles && props.data.selectedRoles.length > 0) {
            // console.log('Setting props.data.selectedRoles', category)
            setSelectedRoles(clone(props.data.selectedRoles))
        }
    }, [props.data.selectedRoles])

    useEffect(() => {
        // console.log('props.data.parentViewEditMode Use Effect', props.data.parentViewEditMode, category)
        if (parentViewEditMode && parentViewEditMode.trim() !== '') {
            setParentViewEditMode(props.data.parentViewEditMode)
        } else {
            setParentViewEditMode('edit')
        }
    }, [props.data.parentViewEditMode])

    useEffect(() => {
        // console.log('schemaTree for Roles, Status Use Effect', selectedRoles, statusLookups, category)
        if (selectedRoles && selectedRoles.length > 0 && statusLookups && statusLookups.length > 0) {
            // console.log('Rendering tree for roles, status', renderSchemeTreeUI(schemaTree, 0))
            setSchemaTreeUI(renderSchemeTreeUI(schemaTree, 0))
        }
    }, [selectedRoles, statusLookups, schemaTree])

    useEffect(() => {
        // console.log('parentViewEditMode use effect', parentViewEditMode, category, schemaTree)
        if (parentViewEditMode && parentViewEditMode.trim() !== '') {
            // console.log('parentViewEditMode schema tree UI', renderSchemeTreeUI(schemaTree, 0))
            setSchemaTreeUI(renderSchemeTreeUI(schemaTree, 0))
        }
    }, [parentViewEditMode, schemaTree])

    const handleExpandCollapse = (e, key, schema) => {

        for (let p of schema) {
            // console.log(p, key)
            if (p.unitId === key) {
                p.show = (p.show === 'true') ? 'false' : 'true'
                break
            } else {
                handleExpandCollapse(e, key, p.children)
            }
        }
    }

    const buildExpression = (key, schema, expr) => {

        let out
        let found = false
        let val = ''

        if (key !== 'root') {
            for (let p in schema.properties) {
                // console.log('buildExpression2', p)
                if (schema.properties[p].type === 'object') {
                    out = buildExpression(key, schema.properties[p], expr + '.' + p)
                    if (out.found) {
                        val = out.expr
                        found = true
                        break;
                    }
                } else {
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

    const handleRoleSelectChange = (state, unitId, roleId) => {
        // console.log(state, unitId, roleId)
        const rolesCopy = clone(selectedRoles)
        let found = false
        let idx = -1
        for (let i = 0; i < rolesCopy.length; i++) {
            if (rolesCopy[i].unitId === unitId && rolesCopy[i].roleId === roleId) {
                found = true
                idx = i
                break
            }
        }
        if (!state) {
            rolesCopy.splice(idx, 1)
        }
        if (state && !found) {
            rolesCopy.push({
                unitId: unitId,
                roleId: roleId
            })
        }
        setSelectedRoles(rolesCopy)
    }

    const handleStatusSelect = (selectedData, unitId, roleId) => {

        // console.log('handleStatusSelect', category, selectedData, unitId, roleId, selectedRoles)

        let selectedStatuses = []
        if(category === 'ASSIGN') {
            selectedStatuses.push(selectedData.value)
        } else {
            if(selectedData && selectedData.length > 0) {
                for(let s of selectedData) {
                    selectedStatuses.push(s.value)
                }
            }
        }

        // console.log('selectedStatuses', selectedStatuses)
        const rolesCopy = clone(selectedRoles)
        for (let i = 0; i < rolesCopy.length; i++) {
            // console.log(rolesCopy[i].unitId, unitId, rolesCopy[i].unitId === unitId)
            // console.log(rolesCopy[i].roleId, roleId, rolesCopy[i].roleId === roleId)
            if (rolesCopy[i].unitId === unitId && rolesCopy[i].roleId === roleId) {
                rolesCopy[i].status = selectedStatuses
                break
            }
        }

        // console.log('rolesCopy', category, rolesCopy)
        setSelectedRoles(rolesCopy)
    }


    const checkMatch = (unitId, roleId) => {
        // console.log('checkMatch', unitId, roleId)
        let found = false
        for (let i = 0; i < selectedRoles.length; i++) {
            if (selectedRoles[i].unitId === unitId && selectedRoles[i].roleId === roleId) {
                found = true
                break
            }
        }
        if (found) {
            return 'true'
        } else {
            return ''
        }
    }

    const getSelectedStatuses = (unitId, roleId) => {
        let selectedStatuses = []

        for (let i = 0; i < selectedRoles.length; i++) {
            if (selectedRoles[i].unitId === unitId && selectedRoles[i].roleId === roleId) {
                for(let s1 of statusLookups) {
                    if(selectedRoles[i].status && selectedRoles[i].status.length > 0) {
                        for(let s2 of selectedRoles[i].status) {
                            if(s1.value === s2) {
                                selectedStatuses.push({
                                    label: s1.label,
                                    value: s1.value
                                })
                            }
                        }
                    }
                }
            }
        }

        return selectedStatuses
    }

    const renderSchemeTreeUI = (obj, idx) => {

        // console.log('renderSchemeTreeUI', obj, idx)
        const htmlElementCollector = []

        let pidx = 0
        for (let p of obj) {
            // console.log('Processing...', p.unitId)
            htmlElementCollector.push(
                <>
                    <li key={'li-node-' + idx} id={'li-node-' + idx} className='node'>
                        <div className="d-flex align-items-center">
                            <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                    <div className="line-v"></div>
                                    <div className="line-h"></div>
                                    <i className={'far ' + ((p.show === 'true') ? 'fa-minus-square' : 'fa-plus-square')}
                                        onClick={(e) => {
                                            let schema = clone(schemaTree)
                                            handleExpandCollapse(e, p.unitId, schema)
                                            // console.log('setSchemaTree-2', schema)
                                            setSchemaTree(schema)
                                        }}
                                    >
                                    </i>
                                    <i className="fas fa-users node-type"></i>
                                    <span>{p.unitDesc} - {p.unitDesc} - ({p.unitType})</span>
                                </div>
                            </div>
                        </div>
                        {
                            (p.show === 'true') ?
                                <ul key={"ul-node-" + idx} className="node">
                                    {
                                        (p.roles && p.roles.length > 0) ?
                                            p.roles.map((r) => (
                                                <li key={'li-leaf-role-' + idx + '-' + pidx + '-' + r.roleId} id={'li-leaf-role-' + idx + '-' + pidx + '-' + r.roleId} className='leaf'>
                                                    <div className="d-flex align-items-center">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center">
                                                                <div className="line-v"></div>
                                                                <div className="line-h"></div>
                                                                <div className="custom-control custom-checkbox">
                                                                    <input
                                                                        key={'li-leaf-chk-' + idx + '-' + pidx + '-' + r.roleId}
                                                                        id={'li-leaf-chk-' + idx + '-' + pidx + '-' + r.roleId}
                                                                        type="checkbox"
                                                                        className="custom-control-input"
                                                                        checked={checkMatch(p.unitId, r.roleId)}
                                                                        onChange={(e) => {
                                                                            handleRoleSelectChange(e.target.checked, p.unitId, r.roleId)
                                                                        }} />
                                                                    <label className="bold custom-control-label" htmlFor={'li-leaf-chk-' + idx + '-' + pidx + '-' + r.roleId}>{r.roleId} - {r.roleName}</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <StatusSelector
                                                            defaultValue={getSelectedStatuses(p.unitId, r.roleId)}
                                                            isDisabled={(checkMatch(p.unitId, r.roleId) === 'true') ? false : true}
                                                            isMulti={(category === 'ASSIGN')? false : true}
                                                            className="org-hierarchy"
                                                            classNamePrefix="org-hierarchy"
                                                            id={'li-leaf-status-' + idx + '-' + pidx + '-' + r.roleId}
                                                            placeholder="Select Status"
                                                            options={statusLookups}
                                                            onChange={(selected) => {
                                                                handleStatusSelect(selected, p.unitId, r.roleId)
                                                            }}
                                                        />
                                                    </div>
                                                </li>
                                            ))
                                            :
                                            <></>
                                    }
                                    {/* console.log('Stacking...', p.unitId, p.children.length) */}
                                    {
                                        (p.children && p.children.length > 0) ?
                                            renderSchemeTreeUI(p.children, ++idx)
                                            :
                                            <>{/* console.log('Not stacking') */}</>
                                    }
                                </ul>
                                :
                                <></>
                        }
                    </li>
                </>
            )
            pidx = pidx + 1
        }
        return htmlElementCollector
    }

    const displayDeptRole = (obj) => {
        // console.log('displayDeptRole')
        let out = ''
        let stack = []
        for (let r of rolesMaster) {
            if (r.roleId === obj.roleId) {
                out = r.roleName
            }
        }

        let status = ''
        if(obj.status && obj.status.length > 0) {
            for(let s1 of statusLookups) {
                for(let s2 of obj.status) {
                    if(s1.value === s2) {
                        if(status === '') {
                            status = s1.label
                        } else {
                            status += ', ' + s1.label
                        }
                    }
                }
            }
        }

        stack.push(schemaTree)
        while (stack.length) {
            for (let v of stack[0]) {
                if (v.unitId === obj.unitId) {
                    out = v.unitDesc + '->' + out + ' - [' + status + ']'
                    stack.length = 0
                    break
                } else {
                    if (v.children && v.children.length > 0) {
                        stack.push(v.children)
                    }
                }
            }
            stack.shift()
        }
        return out
    }

    return (
        <>
            {/* console.log('Rendering Schema', schemaTree, key) */}
            <div className="d-flex col-12 workflow-step-bg-color mt-2">
                {
                    (viewEditMode === 'view') ?
                        <>
                            <div className="flex-grow-1 pr-0 border-grey">
                                {/* console.log('Displaying Roles', selectedRoles, category) */}
                                <span className="p-2" style={{ display: "block" }}>
                                    {
                                        (selectedRoles && rolesMaster && rolesMaster.length > 0 && selectedRoles.length > 0) ?
                                            selectedRoles.map((r1, idx) => (
                                                (selectedRoles.length - 1 !== idx) ? displayDeptRole(r1) + ', ' : displayDeptRole(r1)
                                            ))
                                            :
                                            <>Please click on edit icon to add roles</>
                                    }
                                </span>
                            </div>
                            {
                                (parentViewEditMode === 'view') ?
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
                                            setViewEditMode('edit')
                                        }}
                                    ></i>

                            }
                        </>
                        :
                        <>
                            <div className="wf-json-viewer flex-grow-1 border-grey">
                                <ul key="ul-node-0" id="ul-node-0">
                                    {
                                        (schemaTreeUI && schemaTreeUI !== null) ?
                                            schemaTreeUI
                                            :
                                            <></>
                                    }
                                </ul>
                            </div>
                            <div className="d-flex flex-column ml-1">
                                <i
                                    style={{ cursor: "pointer" }}
                                    className="fas fa-check font-16 icolor1"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        e.nativeEvent.stopImmediatePropagation();
                                        setViewEditMode('view')
                                        handleRoleSelectDone(key, selectedRoles)
                                        // try {
                                        //     let json = JSON.parse(value)
                                        //     handleDone(key, json)
                                        //     setTitleBoxState('view')
                                        // } catch (err) {
                                        //     console.log(err)
                                        //     toast.error('JSON is not valid')
                                        // }
                                    }}
                                ></i>
                                <i
                                    style={{ cursor: "pointer" }}
                                    className="fas fa-times font-16 icolor1"
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        e.nativeEvent.stopImmediatePropagation();
                                        setViewEditMode('view')
                                        // try {
                                        //     let json = JSON.parse(value)
                                        //     handleDone(key, json)
                                        //     setTitleBoxState('view')
                                        // } catch (err) {
                                        //     console.log(err)
                                        //     toast.error('JSON is not valid')
                                        // }
                                    }}
                                ></i>
                            </div>
                        </>
                }
            </div>
        </>
    );
};
export default SchemaViewer;