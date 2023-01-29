
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { number, string } from "yup";

import { properties } from "../properties";
import { get } from "../util/restUtil";
import UnitOverview from "./unitOverview";

import DepartmentMapping from "./DepartmentMapping"
import { showSpinner, hideSpinner } from "../common/spinner";

const OrgHierarchy = () => {
    const [mode, setMode] = useState(false)
    const [newChild, setNewChild] = useState(false)
    const [refreshTree, setRefreshTree] = useState(false)
    const [orgTreeData, setOrgTreeData] = useState([])
    const [selectedUnit, setSelectedUnit] = useState({})
    const [selectedUnitAddress, setSelectedUnitAddress] = useState({})
    const [unitsData, setUnitsData] = useState([])
    const [organization, setOrganization] = useState([])
    const addressLookup = useRef({})

    const [districtLookup, setDistrictLookup] = useState([{}])
    const [kampongLookup, setKampongLookup] = useState([{}])
    const [postCodeLookup, setPostCodeLookup] = useState([{}])

    const [renderState, setRenderState] = useState({
        showtab: '',
        addOrgButton: 'show',
        addOUButton: 'show',
        addDeptButton: 'show'
    })

    const [currentNode, setCurrentNode] = useState({ currentNodeId: '', currentNodeName: '', OrgType: '', parentUnitID: '', nodePosition: "", openNode: "" })
    const [createBtn, setCreateBtn] = useState({ isOrgLink: false, isAuLink: true, isDeptLink: true });
    let treeViewData = [];
    let parentNode = [];
    const [data, setData] = useState([]);
    let roleDetails = []
    let roles = [];
    const [parentUnitName, setParentUnitName] = useState()

    const getParentUnitName = (parentUnit) => {
        if (parentUnit === null || parentUnit === undefined || parentUnit === "") {
            setParentUnitName("-")
            return;
        }
        organization.map((unit) => {
            if (unit.unitId === parentUnit) {
                setParentUnitName(unit.unitName)
            }
        })
    }
    useEffect(() => {
        showSpinner();
        get(properties.ORGANIZATION)
            .then(resp => {
                if (resp && resp.data && resp.data.length > 0) {
                    setOrganization(resp.data)
                    formatTree(resp.data);
                    setRefreshTree(false)
                }
            }).finally(hideSpinner);
        showSpinner()
        get(`${properties.ROLE_API}`).then(resp => {
            if (resp.data) {
                roleDetails = resp.data;
                roleDetails.map((role) => {
                    roles.push({ "id": role.roleId, "label": role.roleName, "value": role.roleDesc })
                })
                roleDetails = roles;
                setData([...roleDetails])
            }
        })
            .finally(hideSpinner)
    }, [refreshTree]);

    useEffect(() => {
        let district = []
        let kampong = []
        let postCode = []

        get(properties.ADDRESS_LOOKUP_API)
            .then((resp) => {
                if (resp && resp.data) {
                    addressLookup.current = resp.data
                    for (let e of addressLookup.current) {
                        if (!district.includes(e.district)) {
                            district.push(e.district)
                        }
                        if (!kampong.includes(e.kampong)) {
                            kampong.push(e.kampong)
                        }
                        if (!postCode.includes(e.postCode)) {
                            postCode.push(e.postCode)
                        }
                    }
                    setDistrictLookup(district)
                    setKampongLookup(kampong)
                    setPostCodeLookup(postCode)
                }
            });
    }, []);

    const handlePostSubmit = (unitId) => {
        setRefreshTree(true)
        setSelectedUnit({})
        setSelectedUnitAddress({})
    }

    const handleAddressChange = (field, value) => {
        let district = []
        let kampong = []
        let postCode = []

        if (field === 'DISTRICT') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.district === value) || value === '')
                    && ((selectedUnitAddress.village != '' && e.kampong === selectedUnitAddress.village) || selectedUnitAddress.village === '')
                    && ((selectedUnitAddress.postCode != '' && e.postCode === selectedUnitAddress.postCode) || selectedUnitAddress.postCode === '')) {
                    if (!kampong.includes(e.kampong)) {
                        kampong.push(e.kampong)
                    }
                    if (!postCode.includes(e.postCode)) {
                        postCode.push(e.postCode)
                    }
                }
            }
            setKampongLookup(kampong)
            setPostCodeLookup(postCode)
        }

        if (field === 'KAMPONG') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.kampong === value) || value === '')
                    && ((selectedUnitAddress.postCode != '' && e.postCode === selectedUnitAddress.postCode) || selectedUnitAddress.postCode === '')
                    && ((selectedUnitAddress.district != '' && e.district === selectedUnitAddress.district) || selectedUnitAddress.district === '')) {
                    if (!district.includes(e.district)) {
                        district.push(e.district)
                    }
                    if (!postCode.includes(e.postCode)) {
                        postCode.push(e.postCode)
                    }
                }
            }
            setDistrictLookup(district)
            setPostCodeLookup(postCode)
        }

        if (field === 'POSTCODE') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.postCode === value) || value === '')
                    && ((selectedUnitAddress.village != '' && e.kampong === selectedUnitAddress.village) || selectedUnitAddress.village === '')
                    && ((selectedUnitAddress.district != '' && e.district === selectedUnitAddress.district) || selectedUnitAddress.district === '')) {
                    if (!district.includes(e.district)) {
                        district.push(e.district)
                    }
                    if (!kampong.includes(e.kampong)) {
                        kampong.push(e.kampong)
                    }
                }
            }
            setDistrictLookup(district)
            setKampongLookup(kampong)
        }
    }

    const handleAddOrg = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        setRenderState((prevState) => {
            return ({
                ...prevState,
                showtab: 'overview'
            })
        })
        let unit = {}
        let address = {}
        unit = {
            mode: 'new',
            unitId: '',
            unitName: '',
            unitDesc: '',
            unitType: 'ORG',
            parentUnit: null,
            parentUnitName: null,
            status: '',
            contactId: '',
            title: '',
            firstName: '',
            lastName: '',
            contactType: '',
            contactNo: ''
        }
        address = {
            addressId: '',
            flatHouseUnitNo: '',
            block: '',
            building: '',
            street: '',
            road: '',
            state: '',
            village: '',
            cityTown: '',
            district: '',
            country: '',
            postCode: '',
        }
        setMode(!mode)
        setSelectedUnit(unit)
        setSelectedUnitAddress(address)
    }

    const handleAddChild = (e, unitId, unitType, unitName) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        setRenderState((prevState) => {
            return ({
                ...prevState,
                showtab: 'overview'
            })
        })
        let unit = {}
        let address = {}
        setNewChild(true)
        unit = {
            mode: 'new',
            unitId: '',
            unitName: '',
            unitDesc: '',
            unitType: (unitType === 'ORG') ? 'OU' : (unitType === 'OU') ? 'DEPT' : '',
            parentUnit: unitId,
            parentUnitName: unitName,
            status: '',
            contactId: '',
            title: '',
            firstName: '',
            lastName: '',
            contactType: '',
            contactNo: ''
        }
        address = {
            addressId: '',
            flatHouseUnitNo: '',
            block: '',
            building: '',
            street: '',
            road: '',
            state: '',
            village: '',
            cityTown: '',
            district: '',
            country: '',
            postCode: '',
        }
        setMode(!mode)
        setSelectedUnit(unit)
        setSelectedUnitAddress(address)
    }

    const handleUnitClick = (e, nodeId) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        if (renderState.showtab === '') {
            setRenderState((prevState) => {
                return ({
                    ...prevState,
                    showtab: 'overview'
                })
            })
        }
        selectUnit(nodeId)
        setMode(!mode)
    }

    const selectUnit = (nodeId) => {
        let unit = {}
        let address = {}
        if (nodeId || nodeId !== '') {
            for (let u of unitsData) {
                if (u.unitId === nodeId) {
                    unit = {
                        mode: 'edit',
                        unitId: u.unitId,
                        unitName: u.unitName,
                        unitDesc: u.unitDesc,
                        unitType: u.unitType,
                        parentUnit: u.parentUnit,
                        status: u.status,
                    }
                    if (u.contact) {
                        unit = {
                            ...unit,
                            contactId: u.contact.contactId,
                            title: u.contact.title,
                            firstName: u.contact.firstName,
                            lastName: u.contact.lastName,
                            contactType: u.contact.contactType,
                            contactNo: u.contact.contactNo
                        }
                    }
                    if (u.address) {
                        address = {
                            addressId: u.address.addressId,
                            flatHouseUnitNo: u.address.flatHouseUnitNo,
                            block: u.address.block,
                            building: u.address.building,
                            street: u.address.street,
                            road: u.address.road,
                            state: u.address.state,
                            village: u.address.village,
                            cityTown: u.address.cityTown,
                            district: u.address.district,
                            country: u.address.country,
                            postCode: u.address.postCode,
                        }
                    }
                    for (let p of unitsData) {
                        if (p.unitId === unit.parentUnit) {
                            unit.parentUnitName = p.unitName
                        }
                    }
                    break;
                }
            }
            setMode(!mode)
            setSelectedUnit(unit)
            getParentUnitName(unit.parentUnit)
            setSelectedUnitAddress(address)
        } else {
            setMode(!mode)
            setSelectedUnit(unit)
            setSelectedUnitAddress(address)
        }
    }

    const handleExpandCollapse = (e, nodeId) => {
        setOrgTreeData((prevState) => {
            const data = prevState.map((n1) => {
                if (n1.unitId === nodeId) {
                    return {
                        unitId: n1.unitId,
                        unitName: n1.unitName,
                        unitType: n1.unitType,
                        unitDesc: n1.unitDesc,
                        showHideToggle: !n1.showHideToggle,
                        ou: n1.ou.map((n2) => {
                            return {
                                unitId: n2.unitId,
                                unitName: n2.unitName,
                                unitType: n2.unitType,
                                unitDesc: n2.unitDesc,
                                showHideToggle: !n2.showHideToggle,
                                dept: n2.dept.map((n3) => n3)
                            }
                        })
                    }
                } else {
                    n1.ou = n1.ou.map((n2) => {
                        if (n2.unitId === nodeId) {
                            return {
                                unitId: n2.unitId,
                                unitName: n2.unitName,
                                unitType: n2.unitType,
                                unitDesc: n2.unitDesc,
                                showHideToggle: !n2.showHideToggle,
                                dept: n2.dept.map((n3) => n3)
                            }
                        } else {
                            n2.dept = n2.dept.map((n3) => {
                                return n3
                            })
                            return n2
                        }
                    })
                    return n1
                }
            })
            return data
        })
    }

    const formatTree = (treeData) => {
        const orgTreeData = []
        if (treeData.length > 0) {
            for (let n of treeData) {
                if (n.unitType === 'ORG') {
                    orgTreeData.push({
                        showHideToggle: true,
                        unitId: n.unitId,
                        unitName: n.unitName,
                        unitdesc: n.unitDesc,
                        unitType: n.unitType,
                        ou: []
                    })
                }
            }
            for (let n of treeData) {
                if (n.unitType === 'OU') {
                    for (let o of orgTreeData) {
                        if (n.parentUnit === o.unitId) {
                            o.ou.push({
                                showHideToggle: true,
                                unitId: n.unitId,
                                unitName: n.unitName,
                                unitdesc: n.unitDesc,
                                unitType: n.unitType,
                                dept: []
                            })
                            break;
                        }
                    }
                }
            }
            for (let n of treeData) {
                if (n.unitType === 'DEPT') {
                    for (let o of orgTreeData) {
                        let found = false
                        for (let p of o.ou) {
                            if (n.parentUnit === p.unitId) {
                                p.dept.push({
                                    unitId: n.unitId,
                                    unitName: n.unitName,
                                    unitdesc: n.unitDesc,
                                    unitType: n.unitType
                                })
                                found = true
                                break;
                            }
                        }
                        if (found) {
                            break
                        }
                    }
                }
            }
            setOrgTreeData(orgTreeData)
            setUnitsData(treeData)
        }
    }

    return (
        <div className="row mt-1">
            <div className="col-lg-3 mt-2">
                <div className="org-btn">
                    <button className="btn btn-primary btn-sm waves-effect waves-light" type="button" onClick={(e) => handleAddOrg(e)}>
                        Add Org
                    </button>
                </div>
                <div className="org-tree mt-2">
                    {
                        (orgTreeData && orgTreeData.length > 0) ?
                            <ul>
                                {
                                    orgTreeData.map((n1) => {
                                        return (
                                            <>
                                                <li className={"first-level pl-1 pr-2 node-label d-flex " + ((n1.unitId === selectedUnit.unitId) ? "active" : "")} key={n1.unitId}>
                                                    <span className={((n1.showHideToggle) ? "caret caret-down" : "caret")} onClick={(e) => handleExpandCollapse(e, n1.unitId)}></span>
                                                    <span className="flex-fill" onClick={(e) => handleUnitClick(e, n1.unitId)}>{n1.unitName}</span>
                                                    <button type="button" className="btn btn-outline-primary waves-effect btn-xs waves-light" onClick={(e) => handleAddChild(e, n1.unitId, n1.unitType, n1.unitName)}>Add OU</button>
                                                </li>
                                                {
                                                    (n1.showHideToggle) ?
                                                        (n1.ou.length > 0) ?
                                                            <ul className="nested">
                                                                {
                                                                    n1.ou.map((n2) => {
                                                                        return (
                                                                            <>
                                                                                <li className={"pl-1 pr-2 node-label d-flex " + ((n2.unitId === selectedUnit.unitId) ? "active" : "")} key={n2.unitId}>
                                                                                    <span className={((n2.showHideToggle) ? "arrow-down1" : "arrow-down2")} onClick={(e) => handleExpandCollapse(e, n2.unitId)}></span>
                                                                                    <span className="flex-fill" onClick={(e) => handleUnitClick(e, n2.unitId)}>{n2.unitName}</span>
                                                                                    <button type="button" className="btn btn-outline-primary waves-effect btn-xs waves-light" onClick={(e) => handleAddChild(e, n2.unitId, n2.unitType, n2.unitName)}>Add Dept</button>
                                                                                </li>
                                                                                {
                                                                                    (n2.showHideToggle) ?
                                                                                        (n2.dept.length > 0) ?
                                                                                            <ul className="nested">
                                                                                                {
                                                                                                    n2.dept.map((n3) => {
                                                                                                        return (
                                                                                                            <li className={"second-level pl-1 pr-2 node-label d-flex " + ((n3.unitId === selectedUnit.unitId) ? "active" : "")} key={n3.unitId}>
                                                                                                                <span className="flex-fill" onClick={(e) => handleUnitClick(e, n3.unitId)}>{n3.unitName}</span>
                                                                                                            </li>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                                {
                                                                                                    (selectedUnit && selectedUnit.unitType === 'DEPT' && selectedUnit.mode === 'new' && selectedUnit.parentUnit === n2.unitId) ?
                                                                                                        <li className="pl-1 pr-2 node-label d-flex active" key={selectedUnit.parentUnit + "-child"}>
                                                                                                            {
                                                                                                                (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                                                                                    <span className="flex-fill"><em>{selectedUnit.unitName}</em></span>
                                                                                                                    :
                                                                                                                    <span className="flex-fill"><em>Enter Dept Name</em></span>
                                                                                                            }
                                                                                                        </li>
                                                                                                        :
                                                                                                        <></>
                                                                                                }
                                                                                            </ul>
                                                                                            :
                                                                                            (selectedUnit && selectedUnit.mode === 'new' && selectedUnit.unitType === 'DEPT' && selectedUnit.parentUnit === n2.unitId) ?
                                                                                                <ul className="nested">
                                                                                                    <li className="pl-1 pr-2 node-label d-flex active" key={selectedUnit.parentUnit + "-child"}>
                                                                                                        {
                                                                                                            (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                                                                                <span className="flex-fill"><em>{selectedUnit.unitName}</em></span>
                                                                                                                :
                                                                                                                <span className="flex-fill"><em>Enter Dept Name</em></span>
                                                                                                        }
                                                                                                    </li>
                                                                                                </ul>
                                                                                                :
                                                                                                <></>
                                                                                        :
                                                                                        <></>
                                                                                }
                                                                            </>
                                                                        )
                                                                    })
                                                                }
                                                                {
                                                                    (selectedUnit && selectedUnit.mode === 'new' && selectedUnit.unitType === 'OU' && selectedUnit.parentUnit === n1.unitId) ?
                                                                        <li className="pl-1 pr-2 node-label d-flex active" key={selectedUnit.parentUnit + '-child'}>
                                                                            <span className="new-node"></span>
                                                                            {
                                                                                (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                                                    <span className="flex-fill" > <em>{selectedUnit.unitName}</em></span >
                                                                                    :
                                                                                    <span className="flex-fill" > <em>Enter OU Name</em></span >
                                                                            }
                                                                        </li >
                                                                        :
                                                                        <></>
                                                                }

                                                            </ul >
                                                            :
                                                            (selectedUnit && selectedUnit.mode === 'new' && selectedUnit.unitType === 'OU' && selectedUnit.parentUnit === n1.unitId) ?
                                                                <ul className="nested">
                                                                    <li className="pl-1 pr-2 node-label d-flex active" key={selectedUnit.parentUnit + '-child'}>
                                                                        <span className="new-node"></span>
                                                                        {
                                                                            (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                                                <span className="flex-fill"><em>{selectedUnit.unitName}</em></span>
                                                                                :
                                                                                <span className="flex-fill" > <em>Enter OU Name</em></span >
                                                                        }
                                                                    </li >
                                                                </ul >
                                                                :
                                                                <></>
                                                        :
                                                        <></>
                                                }
                                            </>
                                        )
                                    })
                                }
                                {
                                    (selectedUnit && selectedUnit.mode === 'new' && selectedUnit.unitType === 'ORG') ?
                                        <li className="pl-1 pr-2 node-label d-flex active" key={'ORG-1'}>
                                            <span className="new-node"></span>
                                            {
                                                (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                    <span className="flex-fill" > <em>{selectedUnit.unitName}</em></span >
                                                    :
                                                    <span className="flex-fill" > <em>Enter Org Name</em></span >
                                            }
                                        </li >
                                        :
                                        <></>
                                }
                            </ul >
                            :
                            (selectedUnit && selectedUnit.mode === 'new' && selectedUnit.unitType === 'ORG') ?
                                <ul className="nested">
                                    <li className="pl-1 pr-2 node-label d-flex active" key={'ORG-1'}>
                                        <span className="new-node"></span>
                                        {
                                            (selectedUnit.unitName && selectedUnit.unitName !== '') ?
                                                <span className="flex-fill"><em>{selectedUnit.unitName}</em></span>
                                                :
                                                <span className="flex-fill" > <em>Enter Org Name</em></span >
                                        }
                                    </li >
                                </ul >
                                :
                                <></>
                    }
                </div >
            </div >

            <div className="col-lg-9">
                <div className="m-t-30">
                    <div className="col-xl-12">
                        <ul className="nav nav-pills navtab-bg">
                            <li className="nav-item">
                                <span id="overviewSection"
                                    onClick={() => {
                                        setRenderState((prevState) => {
                                            return ({
                                                ...prevState,
                                                showtab: 'overview'
                                            })
                                        })
                                    }}
                                    className={(renderState.showtab === 'overview') ? 'nav-link active' : 'nav-link'}>Overview</span>
                            </li>

                            <li className="nav-item">
                                <span id="departmentMappingSection"
                                    onClick={() => {
                                        setRenderState((prevState) => {
                                            return ({
                                                ...prevState,
                                                showtab: 'unitRole'
                                            })
                                        })
                                    }}
                                    className={(renderState.showtab === 'unitRole') ? 'nav-link active' : 'nav-link'}>Map Role to Department</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-3">
                    {
                        (renderState.showtab === 'unitRole') ?
                            (selectedUnit && ((selectedUnit.unitId && selectedUnit.unitId !== '')
                                || (selectedUnit.parentUnit && selectedUnit.parentUnit !== '')
                                || (selectedUnit.unitType === 'ORG'))) ?
                                <DepartmentMapping parentUnitName={parentUnitName} currentNode={selectedUnit} mode={mode} selectUnit={selectUnit} data={data} />
                                :
                                <p>Select a Unit or Add a Unit to continue...</p> :

                            (selectedUnit && ((selectedUnit.unitId && selectedUnit.unitId !== '')
                                || (selectedUnit.parentUnit && selectedUnit.parentUnit !== '')
                                || (selectedUnit.unitType === 'ORG'))) ?
                                <UnitOverview
                                    data={{
                                        unit: selectedUnit,
                                        unitAddress: selectedUnitAddress,
                                        districtLookup: districtLookup,
                                        kampongLookup: kampongLookup,
                                        postCodeLookup: postCodeLookup,
                                        addressElements: addressLookup.current
                                    }}
                                    edit={selectedUnit.mode && selectedUnit.mode === 'new' ? true : false}
                                    mode={mode}
                                    handler={{
                                        setUnit: setSelectedUnit,
                                        setUnitAddress: setSelectedUnitAddress,
                                        handleAddressChange: handleAddressChange,
                                        selectUnit: selectUnit,
                                        handlePostSubmit: handlePostSubmit
                                    }}
                                />
                                :
                                <p>Select a Unit or Add a Unit to continue...</p>
                    }
                </div>
            </div>
        </div >
    );
};

export default OrgHierarchy;
