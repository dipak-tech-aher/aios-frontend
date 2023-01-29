import React, { useState, useEffect } from 'react';
import { properties } from "../properties";
import { get } from "../util/restUtil";
import { useTranslation } from "react-i18next";
import Modal from 'react-modal';
import { hideSpinner, showSpinner } from '../common/spinner';
import TreeMenu, { ItemComponent } from 'react-simple-tree-menu';
import { doTreeFormat } from '../util/treeView';

const RoleMapping = (props) => {
    const { t } = useTranslation();
    const [treeViewDatas, setTreeViewDatas] = useState({})
    const [currentNode, setCurrentNode] = useState({ currentNodeId: '', currentNodeName: '', OrgType: '', parentUnitID: '', nodePosition: "", openNode: "" })
    useEffect(() => {
        showSpinner();
        get(properties.ORGANIZATION)
            .then((resp) => {
                if (resp.data && resp.data.length > 0) {
                    setTreeViewDatas(doTreeFormat(resp.data));
                }
            }).finally(hideSpinner());
    }, [props])

    const nodeClick = (currentNode) => {
        setCurrentNode({ currentNodeId: currentNode.nodeId, openNode: currentNode.openNodes, currentNodeName: currentNode.nodeName, parentUnitID: getParentNode(currentNode), nodePosition: currentNode.nodePosition });
    }

    const roleMappedData = [
        { roleID: 1, RoleName: "Admin", isChecked: true },
        { roleID: 2, RoleName: "COE", isChecked: false },
        { roleID: 3, RoleName: "AAA", isChecked: true },
        { roleID: 4, RoleName: "BBB", isChecked: false }
    ]
    const getParentNode = (currentNode) => {
        let ParentUnit = "";
        let parentNode = currentNode.parent
        const checkArray = parentNode.split("/");
        if (checkArray.length === 2) {
            ParentUnit = checkArray[1];
        } else if (checkArray.length === 1 && checkArray[0] !== "") {
            ParentUnit = checkArray[0];
        } else {
            ParentUnit = "";
        }
        return ParentUnit;
    }
    return (

        <Modal
            appElement={document.getElementById('app')}
            isOpen={props.isOpenModal}
            contentLabel="Example Modal">
            <div style={{ padding: '20px' }} className="row">
                <div className="col-md-12">
                    <div className="modal-header"><h5 className="modal-title">User Details</h5></div>
                    <button onClick={props.roleMappingModelPopup} type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div >
                <div id="searchBlock" className="modal-body p-2">
                    <div className="row field-set">
                        <div style={{ display: "flex" }} className="col-md-3">
                            <label>First Name :</label>
                            <p><b>{props.roleData.firstName}</b></p>
                        </div>
                        <div style={{ display: "flex" }} className="col-md-3" >
                            <label>Last Name :</label>
                            <p><b>{props.roleData.lastName}</b></p>
                        </div >
                        <div style={{ display: "flex" }} className="col-md-3" >
                            <label>Email :</label>
                            <p><b>{props.roleData.email}</b></p>
                        </div >
                        <div style={{ display: "flex" }} className="col-md-3" >
                            <label>User Type :</label>
                            <p><b>{props.roleData.userType}</b></p>
                        </div >
                    </div >
                    <div className="row col-md-12">
                        <div className="col-md-3">
                            {treeViewDatas.length > 0 &&
                                <TreeMenu
                                    // focusKey={treeFocusKey}
                                    // activeKey={treeActiveKey}
                                    // openNodes={treeOpenNode}
                                    // initialActiveKey="IMAGINE/IMAGINE.IMAGINE-OU/IMAGINE.IMAGINE-OU.CEM"
                                    // initialFocusKey="IMAGINE/IMAGINE.IMAGINE-OU/IMAGINE.IMAGINE-OU.CEM"
                                    // initialOpenNodes="IMAGINE/IMAGINE.IMAGINE-OU"
                                    data={treeViewDatas}
                                    onClickItem={({ key, label, ...props }) => {
                                        nodeClick(props)
                                    }}>
                                    {({ search, items }) => (
                                        <ul className="tree">
                                            {items.map(({ key, ...props }) => (
                                                <ItemComponent className="rams" key={key} {...props} />
                                            ))}
                                        </ul>
                                    )}
                                </TreeMenu>
                            }
                        </div>
                        <div style={{ marginTop: "30px" }} className="col-md-9">
                            {roleMappedData.map(role => (
                                <div style={{ display: "flex" }} className="row">
                                    <div><input type="checkbox" name="" /></div>
                                    <div>{role.RoleName}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div >
            </div >
        </Modal >
    )
}
export default RoleMapping;