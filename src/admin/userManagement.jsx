import { useEffect, useState, useRef } from 'react';
import Switch from "react-switch";
import UserManagementForm from './userManagementForm';
import { post, get, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import UserRoleMapping from './userRoleMapping';
import { UserManagementColumns } from './userManagementColumns';
import DynamicTable from '../common/table/DynamicTable';
import { unstable_batchedUpdates } from 'react-dom';
import { formFilterObject } from '../util/util';
import { toast } from 'react-toastify';
const UserManagement = (props) => {
    const [userList, serUserList] = useState({})
    const [isOpenModal, setIsOpen] = useState(false);
    const [isNewForm, setIsNewForm] = useState(true);
    const [userData, setUserData] = useState({});
    const [roleList, setroleList] = useState({})
    const initialValues = {
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        userType: '',

    }
    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);
    const [listSearch, setListSearch] = useState([]);
    const [conactTypes, setContactTypes] = useState({})
    const [isOpenRoleMappingModal, setIsOpenRoleMappingModal] = useState(false);
    const [selectedRoleData, setSelectedRoleData] = useState({});

    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [exportBtn, setExportBtn] = useState(true);
    const [filters, setFilters] = useState([]);
    const [userSearchParams, setUserSearchParams] = useState(initialValues)


    // const [currentDataKey, setCurrentDataKey] = useState(0);
    useEffect(() => {
        if (isOpenModal === false && isOpenRoleMappingModal === false) {
            showSpinner();
            const requestBody = {
                ...userSearchParams,
                filters: formFilterObject(filters)
            }
            setListSearch(requestBody);
            post(`${properties.USER_API}/search?limit=${perPage}&page=${currentPage}`, requestBody).then(resp => {
                if (resp && resp.data && resp.data.rows.length > 0) {
                    const { count, rows } = resp.data;
                   
                    unstable_batchedUpdates(() => {
                        setTotalCount(count)
                        serUserList(rows);
                    })
                }
            }).finally(hideSpinner);
        }

        // get(properties.ORGANIZATION_CREATE).then(resp => {
        //     if (resp && resp.data && resp.data.length > 0) {
        //         setOrgData(resp.data);
        //         doTreeFormat(resp.data);
        //     }
        // });
    }, [selectedRoleData, isOpenModal, isOpenRoleMappingModal, currentPage, perPage]);

    useEffect(() => {
        if (isOpenModal === false && isOpenRoleMappingModal === false) {
            showSpinner();
            post(properties.BUSINESS_ENTITY_API, ['CONTACT_TYPE'])
                .then((resp) => {
                    if (resp.data.CONTACT_TYPE && resp.data.CONTACT_TYPE.length > 0) {
                        let tempData = [];
                        resp.data.CONTACT_TYPE.map(conactType => {
                            tempData.push({ value: conactType.code, label: conactType.description })
                        })
                        setContactTypes(tempData);
                    }
                })
                .finally(hideSpinner)
        }
    }, [])

    const openModal = (userId, formFlag, user) => {
        if (isOpenModal) {
            setIsOpen(false);
        } else {
            getRoleList();
            if (formFlag)
                setIsOpen(true);
        }
        setIsNewForm(formFlag);
        if (formFlag === false) {
            showSpinner();
            setUserData(user);
            setIsOpen(true);
            hideSpinner()
        }
    }


    const getRoleList = () => {
        // get(properties.ROLE_API).then(resp => {
        //     if (resp.data && resp.data.length > 0) {
        //         let roleArray = [];
        //         resp.data.map(role => {
        //             roleArray.push({ roleId: role.roleId, roleName: role.roleName });
        //         });
        //         setroleList(roleArray);
        //     }
        // });

    }
    const roleMappingModelPopup = (selectedRole) => {
        //setSelectedRoleData({})
        let isOpen = (isOpenRoleMappingModal) ? false : true;
        // if(isOpen === false)
        // {
        //     window.location.reload(false);
        // }
        setIsOpenRoleMappingModal(isOpen);
        if (selectedRole) setSelectedRoleData(selectedRole);
    }
    const switchChange = (key) => {

        let index = 0
        let obj
        userList.map((user, i) => {
            if (user.userId === key) {
                obj = user
                index = i
            }
        })

        serUserList((previousState) => {
            previousState[index]['status'] = (previousState[index]['status'] === 'ACTIVE') ? 'IN' : 'ACTIVE';
            showSpinner();
            put(properties.USER_API + "/" + obj?.userId, obj)
                .then((resp) => {
                    if (resp.status = 200) {
                        toast.success(resp.message);

                    } else {
                        toast.error("Failed, Please try again");
                    }
                }

                )
                .finally(hideSpinner);
            return [...previousState];

        });
    };
    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Status") {
            return (<Switch onChange={(e) => switchChange(row.original.userId)} checked={cell.value === 'ACTIVE' ? true : false} />)
        }
        else if (cell.column.Header === "Edit User") {
            return (
                <button type="button" onClick={() => openModal(row.original.userId, false, row.original)} className="btn btn-sm btn-outline-primary waves-effect waves-light color-white" data-toggle="modal" data-target="#search-modal-editservice"><span className="btn-label"><i className="mdi mdi-file-document-edit-outline font20"></i></span>Edit</button >
            )
        }
        else if (cell.column.Header === "Map Roles") {
            return (
                <button onClick={() => roleMappingModelPopup(row.original)} type="button" className="map-btn btn btn-sm btn-outline-primary waves-effect waves-light color-white"><span className="btn-label"><i className="ti-arrow-circle-right font20"></i></span>Map</button >
            )
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    return (

        <div className="row" id="datatable">
            <div className="col-lg-12">
                <div className="card-body">
                    <div className="text-right">
                        <button onClick={() => openModal(false, true)} type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light mb-2" data-toggle="modal" data-target="#">Create</button>
                        {/* <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light mb-2" data-toggle="modal" data-target="#">Download Template</button> */}
                    </div>

                    <div className="card">
                        <div className="card-body" id="datatable">
                            {
                                !!userList.length &&
                                <DynamicTable
                                    listSearch={listSearch} listKey={"Admin View User-User Management"}
                                    row={userList}
                                    rowCount={totalCount}
                                    header={UserManagementColumns}
                                    itemsPerPage={perPage}
                                    backendPaging={true}
                                    isTableFirstRender={isTableFirstRender}
                                    hasExternalSearch={hasExternalSearch}
                                    backendCurrentPage={currentPage}
                                    exportBtn={exportBtn}
                                    handler={{
                                        handleCellRender: handleCellRender,
                                        handlePageSelect: handlePageSelect,
                                        handleItemPerPage: setPerPage,
                                        handleCurrentPage: setCurrentPage,
                                        handleExportButton: setExportBtn,
                                        handleFilters: setFilters,
                                    }}
                                />
                            }
                        </div>
                    </div>
                </div>
            </div >
            {/* {isOpenModal && ( */}

            < UserRoleMapping isOpenModal={isOpenRoleMappingModal} roleData={selectedRoleData} roleMappingModelPopup={roleMappingModelPopup} />
            {/* <RoleMapping isOpenModal={isOpenRoleMappingModal} roleData={selectedRoleData} roleMappingModelPopup={roleMappingModelPopup}></RoleMapping> */}
            {
                isOpenModal &&
                <UserManagementForm
                    userData={userData}
                    conactTypes={conactTypes}
                    roleList={roleList}
                    isNewForm={isNewForm}
                    isModal={openModal}
                    isOpenModal={isOpenModal}
                ></UserManagementForm>

            }
            {/* )} */}
        </div >

    );
};

export default UserManagement;
