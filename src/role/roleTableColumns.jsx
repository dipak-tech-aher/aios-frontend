export const RoleTableColumns = [
    {
        Header: "Role ID",
        accessor: "roleId",
        disableFilters: true
    },
    {
        Header: "Role Name",
        accessor: "roleName",
        disableFilters: true
    },
    {
        Header: "Role Description",
        accessor: "roleDesc",
        disableFilters: true
    },
    {
        Header: "Is Admin",
        accessor: "isAdmin",
        disableFilters: true
    },
    {
        Header: "Edit Role",
        accessor: "action",
        disableFilters: true
    }
];

export const RoleTableHiddenColumns = [
    'roleID'
];