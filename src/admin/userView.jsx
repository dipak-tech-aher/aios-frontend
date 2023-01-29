import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import OrgHierarchy from "./orgHierarchy";
import { Link } from "react-router-dom";
import RoleTable from "../role/RoleTable";
import UserManagement from "./userManagement";
import { showSpinner } from "../common/spinner";
const UserView = () => {
    const [adminMenu, setAdminMenu] = useState([{ id: "adminRoleList", title: "Roles Setup" }, { id: "adminOrgHierarchy", title: "Org Hierarchy" }, { id: "userManagement", title: "User Management" }]);
    const [isActive, setIsActive] = useState(adminMenu[0].id)
    const { t } = useTranslation();
    const showtab = (selectedMenuId) => { setIsActive(selectedMenuId) }
   
    return (
        <div style={{ marginTop: "100px" }}>
            <div className="page-title-box">
                <h1 className="title">{t('admin_view_user')}</h1>
            </div>
            <div className="container-fluid">
                <div className="card-box">
                    <ul className="nav nav-tabs">
                        {adminMenu.map((menu, i) => (
                            <li key={i} className="nav-item">
                                <a id="adminRoleList" onClick={() => showtab(menu.id)} to="#" data-toggle="tab" aria-expanded="true" className={"nav-link" + (isActive === menu.id ? ' active' : '')}>{menu.title}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="col-12 admin-user">
                        {(() => {
                            switch (isActive) {
                                case adminMenu[0].id:
                                    return <RoleTable></RoleTable>;
                                case adminMenu[1].id:
                                    return <OrgHierarchy></OrgHierarchy>;
                                case adminMenu[2].id:
                                    return (
                                        <UserManagement />
                                    );
                                default:
                                    return (<RoleTable></RoleTable>);
                            }
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserView;
