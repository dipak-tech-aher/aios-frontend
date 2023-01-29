import { useEffect, useState } from 'react';
import Switch from "react-switch";
import UserManagementForm from './userManagementForm';
import { get } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";

const OrgUserManagement = (props) => {
    const [userList, serUserList] = useState({})
    const [isOpenModal, setIsOpen] = useState(false);
    const [isNewForm, setIsNewForm] = useState(true);
    const [userData, setUserData] = useState({});
    const [roleList, setroleList] = useState({})

    useEffect(() => {
        serUserList([
            {
                "userId": 2132,
                "userName": "BASHA",
                "phoneNo": "123 456 789",
                "emailId": "abc@gmail.com",
                "effectiveFrom": "21-02-2021",
                "effectiveTO": "21-02-2021",
                "dob": "21-02-1990",
                "gender": 0,
                "userType": "Employee",
                "status": false,
                "role": 1
            },
            {
                "userId": 2133,
                "userName": "BASHA",
                "phoneNo": "123 456 789",
                "emailId": "abc@gmail.com",
                "effectiveFrom": "21-02-2021",
                "effectiveTO": "21-02-2021",
                "gender": 1,
                "dob": "21-02-1990",
                "userType": "Employee",
                "status": true,
                "role": 2
            },
            {
                "userId": 2134,
                "userName": "John",
                "phoneNo": "123 456 789",
                "dob": "21-02-1990",
                "emailId": "abc@gmail.com",
                "effectiveFrom": "21-02-2021",
                "effectiveTO": "21-02-2021",
                "userType": "Employee",
                "gender": 2,
                "status": false,
                "role": [1, 2]
            },
            {
                "userId": 2135,
                "userName": "Praveen",
                "phoneNo": "123 456 789",
                "dob": "21-02-1990",
                "gender": 1,
                "emailId": "abc@gmail.com",
                "effectiveFrom": "21-02-2021",
                "effectiveTO": "21-02-2021",
                "userType": "Employee",
                "status": true,
                "role": [1, 2]
            }
        ]);
    }, []);

    const openModal = (userId, formFlag) => {
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
            get(properties.USER_API + "/" + userId).then(resp => {
                if (resp.data) {
                    setUserData(resp.data);
                    setIsOpen(true);
                }
            }).finally(hideSpinner);
        }
    }


    const getRoleList = () => {
        get(properties.ROLE_API).then(resp => {
            if (resp.data && resp.data.length > 0) {
                let roleArray = [];
                resp.data.rows.map(role => {
                    roleArray.push({ value: role.roleId, label: role.roleName });
                });
                setroleList(roleArray);
            }
        });
    }

    const switchChange = (key) => {
        serUserList((previousState) => {
            previousState[key]['status'] = (previousState[key]['status'] === true) ? false : true;
            return [...previousState];
        });
    };
    return (

        <div className="row" id="datatable">
            <div className="col-lg-12">
                <div className="card-body">
                    <div className="text-right">
                        <button onClick={() => openModal(false, true)} type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light mb-2" data-toggle="modal" data-target="#">Create</button>
                        {/* <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light mb-2" data-toggle="modal" data-target="#">Download Template</button> */}
                    </div>
                </div>
                {/* 
                <DynamicTable
                    row={tableRowData} header={tableHeaderColumns}
                    itemsPerPage={10}
                    // handler={{
                    //     handleCellRender: handleCellRender,
                    //     handleLinkClick: handleCellLinkClick
                    // }}
                /> */}

                {userList.length > 0 && (
                    <table className="table table-striped dt-responsive nowrap w-100">
                        <thead>
                            <tr>
                                <th>User Name</th>
                                <th>Phone No    </th>
                                <th>Email Id</th>
                                <th>Effective From - To</th>
                                <th>User Type</th>
                                <th colSpan="2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((user, i = 22) => (
                                <tr key={i}>
                                    <td>{user.userName}</td>
                                    <td>{user.phoneNo} </td>
                                    <td>{user.emailId} </td>
                                    <td>{user.effectiveFrom} to {user.effectiveTO}</td>
                                    <td>{user.userType}</td>
                                    {/* <td>{user.status} </td> */}
                                    <td>
                                        <Switch onChange={(e) => switchChange(i)} checked={user.status} />
                                    </td>
                                    <td><button type="button" onClick={() => openModal(i + 22, false)} className="btn btn-sm btn-outline-primary waves-effect waves-light" data-toggle="modal" data-target="#search-modal-editservice"><i className="mdi mdi-file-document-edit-outline font20"></i></button></td>
                                </tr>
                            ))};
                        </tbody>
                    </table>
                )}
            </div>
            {/* {isOpenModal && ( */}
            <UserManagementForm currentNode={props.currentNode} userData={userData} roleList={roleList} isNewForm={isNewForm} isModal={openModal} isOpenModal={isOpenModal}></UserManagementForm>
            {/* )} */}
        </div>

    );
};

export default OrgUserManagement;
