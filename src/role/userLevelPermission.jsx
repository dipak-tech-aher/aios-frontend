import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from 'react';
import { showSpinner, hideSpinner } from "../common/spinner";
import { properties } from "../properties";
import { post, get } from "../util/restUtil";
import { toast } from "react-toastify";
const UserLevelPermission = (props) => {
    const { t } = useTranslation();
    const [userLevelPermissionData, setuserLevelPermissionData] = useState({});
    const setPermissionMasterData = props.setPermissionMasterData;
    const permissionMasterData = props.permissionMasterData

    useEffect(() => {

    }, [permissionMasterData])


    const isActiveParent = (id, element) => {
        if (element.target.className === "active") {
            element.target.className = "";
            element.target.nextSibling.classList.remove("active");

        } else {
            element.target.className = "active";
            element.target.nextSibling.classList.add("active");
        }
    }
    const choosePermission = (parentKey, childKey, permission) => {
        props.cPermission(parentKey, childKey, permission);
    }
    return (
        <>

            <div className="user-block popup-box">

                <div className="row">
                    <div className="userLevelPermission">
                        <ul className="">
                            {permissionMasterData.length > 0 && permissionMasterData.map((masterData, i) => (
                                <li key={i} className="parent_li">
                                    <span onClick={(e) => isActiveParent(masterData.id, e)} title="Collapse this branch"><i className="feather icon-chevron-right"></i><i className=""></i>{masterData.label}</span>
                                    {masterData.item.length > 0 && (
                                        <ul className="userLevelChild" id={"mas" + masterData.id}>
                                            {masterData.item.map((permissionPage, j) => (
                                                <li key={j} className="parent_li">
                                                    <span title="Collapse this branch">{permissionPage.label}</span>
                                                    <ul className="ui-choose">
                                                        <li onClick={() => choosePermission(i, j, 'read')} title="Read" data-value="a" className={(permissionPage.accessType === "read") ? "selected" : "rrr"}>Read</li>
                                                        <li onClick={() => choosePermission(i, j, 'write')} title="Read/Write" data-value="b" className={(permissionPage.accessType === "write") ? "selected" : "www"}>Read/Write</li>
                                                        <li onClick={() => choosePermission(i, j, 'deny')} title="Deny" data-value="c" className={(permissionPage.accessType === "deny") ? "selected" : "ddd"}>Deny</li>
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UserLevelPermission;