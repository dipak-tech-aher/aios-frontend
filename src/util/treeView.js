export const doTreeFormat = (treeData) => {
    let treeViewData = [];
    let parentNode = [];
    if (treeData.length > 0) {
        // Level 1
        const getParentNode = treeData.forEach(function (item) {
            if (item.unitType === "ORG" & item.parentUnit === null) {
                parentNode.push({ key: item.unitId, label: item.unitName });
            }
        });
        // Level 2
        let ouNodes = [];
        const getOuNode = parentNode.forEach(function (orgdata, j) {
            let tempSubNodes = [];
            treeData.forEach(function (item, i) {
                if (item.unitType === "OU" & item.parentUnit === orgdata.key) {
                    tempSubNodes.push({ key: item.unitId, label: item.unitName });
                }

            });
            ouNodes.push({ key: orgdata.key, label: orgdata.label, nodes: tempSubNodes });
        });

        // Level 3
        const dataWithDept = ouNodes.forEach(function (parentData, i) {

            let tempOuNodes = [];

            if (parentData.nodes.length > 0) {

                parentData.nodes.forEach(function (ouItem, j) {
                    let deptNodes = [];
                    treeData.forEach(function (item, kk = 0) {
                        if (item.unitType === "DEPT" & item.parentUnit === ouItem.key) {
                            deptNodes.push({ key: item.unitId, refkey: parentData.key + "/" + ouItem.key + "/" + item.unitId, label: item.unitName, nodePosition: i + '-' + j + '-' + kk, nodeId: item.unitId, nodeName: item.unitName });
                        }

                    });

                    tempOuNodes.push({ key: ouItem.key, refkey: parentData.key + "/" + ouItem.key, label: ouItem.label, nodePosition: i + '-' + j, nodeId: ouItem.key, nodeName: ouItem.label, nodes: deptNodes });
                });
            }


            // treeViewData.push({ key: "org-" + j, label: "org-" + j, nodes: [{ key: parentData.key, label: parentData.label, nodeId: parentData.key, nodeName: parentData.label, nodes: tempOuNodes }] });
            treeViewData.push({ key: parentData.key, refkey: parentData.key, label: parentData.label, nodePosition: i, nodeId: parentData.key, nodeName: parentData.label, nodes: tempOuNodes });

        });
        // setTreeViewDatas(treeViewData);
    }
    // Default load data
    // if (treeViewData[0]['key'] !== "") {
    //     setCurrentNode({ currentNodeId: treeViewData[0]['key'], currentNodeName: treeViewData[0]['label'], OrgType: 'ORG', parentUnitID: '', nodePosition: "", openNode: treeViewData[0]['key'] })
    //     // getOrgDetailById(treeViewData[0]['key']);
    // }
    return treeViewData;
}
