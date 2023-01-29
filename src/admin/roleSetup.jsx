import Switch from "react-switch";

const RoleSetup = (treeData) => {

    const roleList = [{
        id: 1,
        roleId: "AD",
        roleName: "Admin",
        isActive: true
    },
    {
        id: 2,
        roleId: "AD1",
        roleName: "Admin-1",
        isActive: true
    },
    {
        id: 3,
        roleId: "AD2",
        roleName: "Admin-2",
        isActive: false
    }
    ];

    const switchChange = (key) => {
        serUserList((previousState) => {
            previousState[key]['status'] = (previousState[key]['status'] === true) ? false : true;
            return [...previousState];
        });
    };

    return (
        <div className="col-lg-12">
            <div>
                <div className="card-body">
                    <div className="text-right">
                        <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light mb-2" data-toggle="modal" data-target="#search-modal-addservice">Add New Services</button>
                    </div>
                    <table className="table table-striped dt-responsive nowrap w-100">
                        <thead>
                            <tr>
                                <th>Role ID</th>
                                <th>Role Name</th>
                                <th>Enable/Disable</th>
                                <th>Edit</th>
                                <th>Mapping</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                roleList.map((role, i) => (
                                    <tr key={i}>
                                        <td>{role.roleId}</td>
                                        <td>{role.roleId} </td>
                                        <td>
                                            <Switch onChange={(e) => switchChange(i)} checked={role.isActive} />
                                        </td>
                                        <td>
                                            <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light"><i className="mdi mdi-file-document-edit-outline font20"></i></button>
                                        </td>
                                        <td>
                                            <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light"><i className="ti-arrow-circle-right font20"></i></button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <div className="add-field"><a href="#"><i className="mdi mdi-plus"></i></a></div>
                </div>
            </div >
        </div >

    );
};

export default RoleSetup;
