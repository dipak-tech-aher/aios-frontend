import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { properties } from "../properties";
import { get } from "../util/restUtil";
import Switch from "react-switch";
import NewRole from './NewRole';
import UpdateRole from './UpdateRole';
import { hideSpinner, showSpinner } from '../common/spinner';
import { RoleTableColumns, RoleTableHiddenColumns } from './roleTableColumns';
import DynamicTable from '../common/table/DynamicTable';
import { AppContext } from "../AppContext";

const RoleTable = () => {
    const [userPermission, setUserPermission] = useState({ createRole: true, editRole: true, viewRole: true, viewRoleList: true })
    const [display, setDisplay] = useState(false);
    const [update, setUpdate] = useState(false);
    const [data, setData] = useState({});
    const [roleDetails, setroleDetails] = useState([]);
    const [exportBtn, setExportBtn] = useState(true);

    useEffect(() => {
        let permisssion = []
        if (display === false && update === false) {
            showSpinner();
            get(properties.ROLE_API).then(resp => {
                if (resp && resp.data && resp.data.length > 0) {
                
                    let arrayCopy = resp.data
                    arrayCopy.sort(compareBy("roleId"));
                    setroleDetails(arrayCopy);
                }
            }).finally(hideSpinner)
        }
    }, [display, update]);

    const compareBy = (key) => {
        return function (a, b) {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        };
    }

    const sortBy = (key) => {
        let arrayCopy = roleDetails
        arrayCopy.sort(compareBy(key));
        setroleDetails(arrayCopy);
    }

    const switchChange = (key) => {
        let array = roleDetails;
        array.map((role) => {
            if (role.roleId === key) {
                if (role["isAdmin"] === true) {
                    role["isAdmin"] = false
                }
                else {
                    role["isAdmin"] = true
                }
            }
        })
        setroleDetails([...array])

    };

    const handleSubmit = (role, id) => {
        setData(role);
        setUpdate(true)

    }
    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Is Admin") {
            return (<Switch onChange={(e) => switchChange(row.original.roleId)} checked={cell.value === "true"} />)
        }
        else if (cell.column.Header === "Edit Role") {
            return (
                <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light color-white" onClick={(e) => handleSubmit(row.original, row.original.roleId)}><span className="btn-label"><i className="mdi mdi-file-document-edit-outline font20"></i></span> Edit</button>
            )
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }


    return (
        <>
            {(display) ?

                <Modal
                    style={{
                        overlay: {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.75)'
                        },
                        content: {
                            position: 'absolute',
                            top: '100px',
                            left: '50px',
                            right: '50px',
                            bottom: '200px',
                            border: '1px solid #ccc',
                            background: '#fff',
                            overflow: 'auto',
                            WebkitOverflowScrolling: 'touch',
                            borderRadius: '4px',
                            outline: 'none',
                            padding: '0',

                        }
                    }}
                    isOpen={display}>

                    <NewRole setDisplay={setDisplay} />
                    <button className="close-btn" onClick={() => setDisplay(false)} >&times;</button>

                </Modal>
                : <></>}

            <div className="col-lg-12">
                <div>
                    <div className="card-body">
                        <div className="text-right">

                            <button type="button" className="btn btn-outline-primary waves-effect waves-light mb-2"
                                onClick={() => setDisplay(true)}>
                                Create Role</button>
                        </div>
                        <div className="card">
                            <div className="card-body" id="datatable">
                                {
                                    !!roleDetails.length &&
                                    <DynamicTable
                                        listKey={"Admin View User-Roles Setup"}
                                        row={roleDetails}
                                        header={RoleTableColumns}
                                        itemsPerPage={10}
                                        hiddenColumns={RoleTableHiddenColumns}
                                        exportBtn={exportBtn}
                                        handler={{
                                            handleCellRender: handleCellRender,
                                            handleExportButton: setExportBtn
                                        }}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            {(update === true) ?
                <UpdateRole Data={data} setUpdate={setUpdate} isOpen={update} />
                :
                <></>
            }
        </>

    )
}


export default RoleTable;