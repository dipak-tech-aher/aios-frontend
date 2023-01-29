import React, { useState, useEffect } from 'react';
import Switch from "react-switch";
import { properties } from "../properties";
import { put ,get} from "../util/restUtil";
import { toast } from "react-toastify";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import { showSpinner, hideSpinner } from "../common/spinner";
import Modal from 'react-modal';
import UserLevelPermission from './userLevelPermission';
const validationSchema = object().shape({
    roleName: string().required("Please enter role name"),
    roleDesc: string().required("Please enter role description"),
});
const UpdateRole = ({ Data,isOpen, setUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState({});
    const [state, setState] = useState(false)
    const [permissionMasterData, setPermissionMasterData] = useState({});
    const [data, setData] = useState({

        roleName: "",
        roleDesc: "",
        isAdmin: false,

    })
    const handleClear = () => {
        setData({...data,roleName:"",roleDesc:"",isAdmin:false})
    }
    let permission = []
    
    const customStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxHeight: '100%'
        }
    };
    const handleChange = (checked) => {
        setState(checked)
        setData({ ...data, isAdmin: checked })
    }

    
    const validate = () => {
        try {
            validationSchema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    useEffect(() => {
        setData({ ...data, roleId: Data.roleId, roleName: Data.roleName, roleDesc: Data.roleDesc, isAdmin: Data.isAdmin })
       
        if(Data.mappingPayload && Data.mappingPayload !== null && Data.mappingPayload.permissions && Data.mappingPayload.permissions.length > 0)
        {
            permission = Data.mappingPayload.permissions
        }
    }, [Data])
    let array = []
    let temp = [];
    let array2 = []
    useEffect(() => {
        showSpinner()
        get(properties.THEME_API + "/modules")
        .then((resp) => {
            if(resp.data && resp.data.length > 0)
            {
                array = resp.data
                array.map((node) => {
                    node["accessType"] = "write";
                })
                let id = 1;
                temp = []
                array.map((node) =>{
                    let found = false;
                    if(temp.length > 0)
                    {
                        temp.map((child) => {
                            if(child === node.moduleName)
                            {
                                found = true
                            }
                        })
                    }
                    if(found === false)
                    {
                        temp.push(node.moduleName)
                    }
                })
                let i =0;
                temp.map((module) => {
                    let j = 2
                    let item = [];
                        array.map((node) => {
                            if(temp[i] === node.moduleName)
                            {
                                item.push({label : node.screenName,id : j, accessType : "write","api":node.api,"method":node.method})
                                j=j + 1;
                            }
                        })
                        array2.push({label : module , id : i + 1,item : item})
                        i = i+ 1;
                })
                if(Data.mappingPayload && Data.mappingPayload !== null && Data.mappingPayload.permissions && Data.mappingPayload.permissions.length >0)
                {
                array2.map((module) => {
                    if(permission && permission.length > 0)
                    {
                        permission.map((node) => {
                            let property = Object.keys(node)
                            let value = Object.values(node)
                            if(property[0] === module.label)
                            {
                                module.item.map((child) => {
                                    value[0].map((childNode) => {
                                        if(child.label === childNode["screenName"])
                                        {
                                            child["accessType"] = childNode["accessType"]
                                        }
                                    })
                                })
                            }
                        })
                    }
                })
                }
                setPermissionMasterData(array2)  
            }
           
        })
        .finally(hideSpinner);
    }, [Data])


    const onHandleSubmit = () => {
        const error = validate(validationSchema, data);
        if (error) return;
        let mappingScreen = [];
        permissionMasterData.map((value) => {
            let list = []
            value.item.map((o) => {
                list.push({ screenName : o.label , accessType: o.accessType,api:o.api,method:o.method})
            })
            let temp = value.label
            let obj = {}
            obj[temp] = list
            mappingScreen.push(obj)
        })

        data["mappingPayload"] = { "permissions": mappingScreen }

        showSpinner()
        put(properties.ROLE_API + "/" + data.roleId, data)
            .then((resp) => {
                if (resp.data) {
                    toast.success("Role updated successfully");
                } else {
                    toast.error("Error while updating role.");
                }
            })
            .finally(() => { hideSpinner(); setUpdate(false) })

    }


  
    const choosePermission = (parentKey, childKey, permission) => {
        if (parentKey !== null && parentKey !== undefined && parentKey !== "") {
            setPermissionMasterData((prevState) => {
                prevState[parentKey]['item'][childKey]['accessType'] = permission;
                return [...prevState];
            })
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={() =>setUpdate(false)} contentLabel="Worflow History Modal" style={customStyles}>
        <div className="">
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Update Role</h4>
                    <button type="button" className="close" onClick={() => setUpdate(false)}>
                            <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div><hr></hr></div>
                <div className="modal-body">
                    <fieldset className="scheduler-border">
                        <form className="d-flex justify-content-center">
                            <div className="row col-12">

                                <div style={{ paddingLeft: "12px", paddingRight: "12px" }} className="col-md-4">
                                    <label >Role Name</label>
                                    <input onChange={(e) => setData({ ...data, roleName: e.target.value })}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") onHandleSubmit();
                                        }}
                                        id="roleName" value={data.roleName} className="form-control" type="text" required="" placeholder="Role Name" />
                                    {error.roleName ? <p className="error-msg">{error.roleName}</p> : ""}
                                </div>
                                <div style={{ paddingLeft: "12px", paddingRight: "12px" }} className="col-md-4">
                                    <label >Role Description</label>
                                    <input onChange={(e) => setData({ ...data, roleDesc: e.target.value })}
                                        onKeyPress={(e) => {
                                            if (e.key === "Enter") onHandleSubmit();
                                        }}
                                        id="roleDesc" value={data.roleDesc} className="form-control" type="text" required="" placeholder="Role Name" />
                                    {error.roleDesc ? <p className="error-msg">{error.roleDesc}</p> : ""}
                                </div>
                                <div style={{ paddingLeft: "12px", paddingRight: "12px" }} className="col-md-4">
                                    <label >Is Admin</label>
                                    <Switch onChange={handleChange} checked={data.isAdmin} />
                                </div>
                            </div>

                        </form>


                        <div className="pt-2"><div className="col-12 pl-2 bg-light border"><h5 className="text-primary">Set Role Level Permission</h5> </div></div>
                        <UserLevelPermission setPermissionMasterData ={setPermissionMasterData} cPermission={choosePermission} permissionMasterData={permissionMasterData}></UserLevelPermission>

                    </fieldset>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <button className="btn btn-primary mr-2" type="button" onClick={onHandleSubmit}>Update</button>
                        <button className="btn btn-secondary" type="button" onClick={handleClear}>Clear</button>
                    </div>


                </div>
            </div>
        </div>
    </Modal>

    )
}
export default UpdateRole;