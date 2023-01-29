import React, { useEffect, useState } from "react";
import { properties } from "../properties";
import { put, get } from "../util/restUtil";
import { toast } from "react-toastify";
import Modal from 'react-modal';
import { hideSpinner, showSpinner } from '../common/spinner';


let navData = []
let roles = []
let temp = []
let roleList = []
const UserRoleMapping = (props) => {

    const [unitDetails, setUnitDetails] = useState()
    const [currentNode, setCurrentNode] = useState()
    const [check, setCheck] = useState(false)
    const [organizationList, setOrganizationList] = useState()
    const nest = (items, unitId = null, link = 'parentUnit') => {
        return items
            .filter(item => item[link] === unitId)
            .map(item => ({ ...item, children: nest(items, item.unitId) }));
    }

    useEffect(() => {
        // if(navData.length === 0)
        // {
        get(properties.ORGANIZATION)
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    temp = resp.data
                    setOrganizationList(resp.data)
                    navData = nest(resp.data)
                }
            })
        // }
    }, [props.roleData, props.isOpenModal/*,currentNode,check*/])

    useEffect(() => {
        showSpinner()
        get(properties.ROLE_API)
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    roleList = resp.data
                }
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(hideSpinner)
        let oldRoles
        if (props.roleData.mappingPayload && props.roleData.mappingPayload.userDeptRoleMapping && props.roleData.mappingPayload.userDeptRoleMapping !== undefined && props.roleData.mappingPayload.userDeptRoleMapping.length > 0) {
            oldRoles = props.roleData.mappingPayload.userDeptRoleMapping
        }

        roles = []
        temp.map((role) => {
            let tempArray = [];
            if (role.mappingPayload && role.mappingPayload !== null && role.mappingPayload.unitroleMapping && role.mappingPayload.unitroleMapping !== null && role.mappingPayload.unitroleMapping.length > 0) {
                role.mappingPayload.unitroleMapping.map((node) => {
                    roleList.map((roleNode) => {
                        if (roleNode.roleId === node) {
                            tempArray.push({ "roleId": node, "role": roleNode.roleDesc })
                        }
                    })
                })
            }
            roles.push({ "unitId": role.unitId, "unitName": role.unitName, "unitType": role.unitType, "roles": tempArray })
        })

        roles.map((role) => {
            if (role.roles !== undefined) {
                role.roles.map((node) => {
                    node["checked"] = false
                })
            }
        })

        if (oldRoles !== undefined && oldRoles.length > 0) {
            roles.map((role) => {
                oldRoles.map((node) => {
                    if (node.unitId === role.unitId) {
                        role.roles.map((nodeChild) => {
                            node.roleId.map((value) => {
                                if (value === nodeChild.roleId) {
                                    nodeChild["checked"] = true
                                }
                            })
                        })
                    }
                })
            })
        }
        setCheck(!check)
    }, [props.roleData])


    const handleDelete = (unitId, roleName) => {
        roles.map((role) => {
            if (role.unitId === unitId) {
                role.roles.map((node) => {
                    if (node.role === roleName) {
                        setCheck(!check)
                        node.checked = false
                    }
                })
            }
        })
    }

    const handleSubmit = () => {

        let data = [];
        roles.map((role) => {
            if (role.roles !== undefined) {
                role.roles.map((node) => {
                    if (node.checked === true) {
                        data.push({ "unitId": role.unitId, "unitName": role.unitName, "unitType": role.unitType, "role": node.role, "roleId": node.roleId })
                    }
                })
            }
        })


        let final = []
        data.map((role) => {
            let list = []
            let found = false
            if (final.length > 0) {
                final.map((unit) => {
                    if (unit.unitId === role.unitId) {
                        found = true
                    }
                })
            }
            if (found === false) {
                data.map((node) => {
                    if (role.unitId === node.unitId) {
                        list.push(node.roleId)
                    }
                })
                final.push({ "unitId": role.unitId, "roleId": list })
            }
        })

        let reqBody = {}
        reqBody["mappingPayload"] = { userDeptRoleMapping: final }
        reqBody["contactNo"] = Number(props.roleData.contactNo)

        showSpinner()
        put(properties.USER_API + "/" + props.roleData.userId, reqBody)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Roles Mapped Successfully")
                    setCheck(!check)
                    setCurrentNode("")
                    navData = []
                    props.roleMappingModelPopup();
                }
                else {
                    toast.error("Error in role mapping")
                }
            })
            .catch((error) => {
                toast.error("Error in role mapping")
            })
            .finally(hideSpinner)

    }

    const getUnitDetails = (unit) => {
        if (organizationList && organizationList.length > 0 && organizationList !== null && organizationList !== undefined) {
            if (unit.parentUnit !== null && unit.parentUnit !== undefined && unit.parentUnit !== "") {
                organizationList.map((child) => {
                    if (child.unitId === unit.parentUnit) {
                        setUnitDetails({ unitName: unit.unitName, parentUnitName: child.unitName })
                    }
                })
            }
            else {
                setUnitDetails({ unitName: unit.unitName, parentUnitName: "" })
            }
        }
    }
    return (
        <Modal
            appElement={document.getElementById('app')}
            isOpen={props.isOpenModal}
            contentLabel="Example Modal">
            <div style={{ padding: '0px 20px 20px 20px' }} className="row rolmap">
                <div className="col-md-12 user-det">
                    <div className="modal-header"><h4 className="modal-title">User Details</h4></div>
                    <button onClick={props.roleMappingModelPopup} type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div >
                <div className="border-line clearfix" > <hr></hr></div >
                <fieldset className="scheduler-border" >
                    <div id="searchBlock" className="modal-body new-customer p-2">

                        <div className="row field-set mb-3">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">First Name :</label>
                                    <p><b>{props.roleData.firstName}</b></p>
                                </div>
                            </div>
                            <div className="col-md-3" >
                                <div className="form-group">
                                    <label className="control-label">Last Name :</label>
                                    <p><b>{props.roleData.lastName}</b></p>
                                </div>
                            </div >
                            <div className="col-md-3" >
                                <div className="form-group">
                                    <label className="control-label">Email :</label>
                                    <p><b>{props.roleData.email}</b></p>
                                </div>
                            </div >
                            <div className="col-md-3" >
                                <div className="form-group">
                                    <label className="control-label">User Type :</label>
                                    <p><b>{props.roleData.userType}</b></p>
                                </div>
                            </div >
                            <div className="col-md-3" >
                                <div className="form-group">
                                    <label className="control-label">Unit Name :</label>
                                    <p><b>{unitDetails && unitDetails !== null && unitDetails.unitName}</b></p>
                                </div>
                            </div >
                            <div className="col-md-3" >
                                <div className="form-group">
                                    <label className="control-label">Parent Unit Name :</label>
                                    <p><b>{unitDetails && unitDetails !== null && unitDetails.parentUnitName}</b></p>
                                </div>
                            </div >
                        </div >


                        <div className="row col-md-12">
                            <div className="col-md-3">
                                <div className="org-tree mt-2 box treenav-block" style={{ width: "250px" }}>
                                    <Tree data={navData} setCurrentNode={setCurrentNode} getUnitDetails={getUnitDetails} />
                                </div>
                            </div>
                            <div className="col-md-9">
                                <div className="d-flex flex-direction-row  pt-1">
                                    {
                                        roles.map((role) => (
                                            role.roles !== undefined ?
                                                role.roles.map((node) => (
                                                    node.checked === true ?
                                                        <div className="attach-btn mr-2">
                                                            <div className="d-flex flex-direction-row">
                                                                <div>{role.unitName}-{node.role}</div>
                                                                <button type="button" className="close ml-2" onClick={() => handleDelete(role.unitId, node.role)}>
                                                                    <span aria-hidden="true">&times;</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        :
                                                        <></>
                                                ))
                                                :
                                                <></>
                                        ))
                                    }
                                </div>
                                <div className="row">
                                    <div style={{ marginTop: "15px" }} className="col-md-9 ">
                                        {
                                            roles.map((role) => (
                                                role.unitId === currentNode && role.roles !== undefined ?
                                                    role.roles.map((node) => {
                                                        //setCheck(node.checked)
                                                        return (
                                                            <div style={{ display: "flex" }} className="row checkblock">
                                                                <div className=""><label className="check-box"><input type="checkbox" name="" checked={node.checked} onChange={(e) => {
                                                                    node["checked"] = e.target.checked

                                                                    setCheck(!check)
                                                                }} />
                                                                    <span className="checkmark"></span>
                                                                </label>
                                                                </div>

                                                                <div>{node.role}</div>
                                                            </div>
                                                        )
                                                    }
                                                    )
                                                    :
                                                    <></>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div >
                    </div >
                </fieldset >
            </div >

            <div className="row" style={{ paddingLeft: "520px" }}>
                <button className="btn waves-effect waves-light btn-primary mr-2" onClick={handleSubmit}>Save</button>
                <button className="btn waves-effect waves-light btn-secondary" onClick={() => { props.roleMappingModelPopup(); navData = [] }}>Cancel</button>
            </div>
        </Modal >
    );
}

const Tree = (props) => {
    return (
        <ul className="list">
            {props.data.map((tree) => (
                <TreeNode node={tree} setCurrentNode={props.setCurrentNode} getUnitDetails={props.getUnitDetails} />
            ))}
        </ul>
    );
};

const TreeNode = ({ node, setCurrentNode, getUnitDetails }) => {

    const [childVisible, setChildVisiblity] = useState(false);
    const hasChild = node.children.length > 0 ? true : false;

    return (
        <li className="item clearfix">
            <div className="first-level tree-list" style={{ display: "flex", flexDirection: "row" }} onClick={(e) => setChildVisiblity((v) => !v)}>
                {hasChild && (
                    <div className={`d-tree-toggler ${childVisible ? "active" : ""}`}>
                        <span className="caret"></span>
                    </div>
                )}

            </div>
            <div className='tree-list d-tree-node cursor-pointer' onClick={() => {
                if (node.mappingPayload && node.mappingPayload.unitroleMapping && node.mappingPayload.unitroleMapping.length > 0) {
                    setCurrentNode(node.unitId)
                    getUnitDetails(node)
                }
                else {
                    setCurrentNode(node.unitId)
                    getUnitDetails(node)
                    toast.error("No Roles available for this department")
                }
            }}>
                {node.unitName}
            </div>
            <div className="select-btn">
                {/* <Switch onChange={handleChange} checked={check} className="but"/> */}
            </div>
            {hasChild && childVisible && (
                <Tree data={node.children} setCurrentNode={setCurrentNode} getUnitDetails={getUnitDetails} />
            )}
        </li>

    );
};


export default UserRoleMapping;