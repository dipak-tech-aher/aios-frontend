import React, { useContext, useEffect, useState } from "react";
import switchuserIcon from '../../assets/images/switchuser.svg';
import switchuserIcon2 from '../../assets/images/switchuser2.svg';
import { AppContext } from "../../AppContext";
import { showSpinner, hideSpinner } from "../../common/spinner";
import { toast } from 'react-toastify';
import { properties } from '../../properties'
import { get, put } from '../../util/restUtil'
import useDropDownArea from "./useDropDownArea";
import { useHistory } from "react-router-dom";

const UserRole = () => {

    const history = useHistory();
    const [display, setDisplay] = useDropDownArea('switchUser')
    let { auth, setAuth } = useContext(AppContext)
    const [role, setRole] = useState({ currRole: auth.currRole, currDept: auth.currDept, currRoleId: auth.currRoleId,currDeptId:auth.currDeptId,currDeptDesc:auth.currDeptDesc,currRoleDesc:auth.currRoleDesc })
    let hierarchy = ['ORG', 'OU', 'DEPT']
    let counter = 0
    const [roles, setRoles] = useState([])

    useEffect(() => {
        showSpinner()
        get(properties.USER_API + "/switch-user")
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    setRoles(resp.data)
                }
            })
            .finally(hideSpinner)
    }, [])

    const updateRole = (id) => {
        let array = id.split(" ")
        let dept = ""
        let name = ""
        let deptId = ""
        let deptDesc = ""
        let roleDesc = ""
        if (auth.user.mappingPayload.userDeptRoleMapping && auth.user.mappingPayload.userDeptRoleMapping && roles && roles.length) {
            roles.map((node) => {
                if(node.unitId === array[1])
                {
                    node.roles.map((role) => {
                        if (role.roleId === Number(array[0])) {
                            dept = node.unitName;
                            deptDesc = node.unitDesc
                            roleDesc = role.roleDesc
                            name = role.roleName;
                            deptId = node.unitId;
                        }
                    })
                }
                
            })
        }
        setRole({ ...role, currRole: name, currDept: dept, currRoleId: Number(array[0]),currDeptId : deptId,currRoleDesc:roleDesc,currDeptDesc:deptDesc})
    }

    const handleChange = () => {
        showSpinner()
        put(properties.USER_API + "/session/" + auth.user.userId, role)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Role Switch Successfully")
                    setAuth({ ...auth, currRole: role.currRole, currDept: role.currDept, currRoleId: role.currRoleId, currDeptId : role.currDeptId,currRoleDesc:role.currRoleDesc,currDeptDesc:role.currDeptDesc, permissions: resp.data.permissions })
                    setDisplay(!display)
                    history.push(`${process.env.REACT_APP_BASE}/`);
                }
                else {
                    toast.error("Error while switching role")
                }
            })
            .finally(hideSpinner)
        //window.location.reload(false);
    }

    return (
        <li className={`dropdown  d-lg-inline-block topbar-dropdown ${display && "show"}`} id="switchUser">
            <span className="nav-link dropdown-toggle arrow-none waves-effect waves-light" onClick={() => { setDisplay(!display) }} >
                <img className="gray-icon" src={switchuserIcon} alt="switch" height="35px" width="35px" />
                <img className="orange-icon" src={switchuserIcon2} alt="switch" height="35px" width="35px" />
            </span>
            <div className={`dropdown-menu dropdown-lg dropdown-menu-right ${display && "show"}`} style={{width:"300px"}}>
                {
                    display ?
                        <div className="p-lg-1">
                            <div className="row no-gutters">
                                <div className="col text-center">
                                    <p>Switch User - Select your role</p>
                                    {
                                        auth && auth.user && auth.user.mappingPayload.userDeptRoleMapping && auth.user.mappingPayload.userDeptRoleMapping.length > 0 && roles.length > 0 ?
                                            <select className="form-control" value={role.currRoleId +" "+role.currDeptId } data-toggle="select2"
                                                onChange={(e) => { updateRole(e.target.value) }}
                                            >
                                                {
                                                    hierarchy.map((value) => {
                                                        if (value !== "ORG") {
                                                            counter = counter + 1;
                                                        }
                                                        return (
                                                            roles.map((node, index) => (
                                                                node.unitType === hierarchy[counter] ?
                                                                    <optgroup key={index} label={node.unitDesc}>
                                                                        {
                                                                            node.roles.map((role, roleIndex) => (
                                                                                <option key={role.roleId + node.unitId} value={role.roleId +" "+node.unitId}>{role.roleDesc}</option>
                                                                            ))
                                                                        }
                                                                    </optgroup>
                                                                    :
                                                                    <></>
                                                            ))
                                                        )
                                                    })

                                                }
                                            </select>
                                            :
                                            <select className="form-control" data-toggle="select2">
                                                <option value="">No Roles Allocated</option>
                                                {/* <optgroup label="CEM">
                                                    <option value="AK">Agent</option>
                                                    <option value="HI">Manager</option>
                                                </optgroup>
                                                <optgroup label="Call Center">
                                                    <option value="CA">Agent</option>
                                                    <option value="NV">Manager</option>
                                                </optgroup>
                                                <optgroup label="Sales">
                                                    <option value="CA">Executive</option>
                                                    <option value="NV">Manager</option>
                                                </optgroup> */}
                                            </select>
                                    }
                                    <button type="button" className="btn btn-outline-primary waves-effect waves-light mt-3 text-center" onClick={handleChange}>Switch</button>
                                </div>
                            </div>


                        </div>
                        :
                        <></>
                }
            </div>
        </li>
    );
};

export default UserRole;
