export const UserManagementColumns = [
    {
        Header: "First Name",
        accessor: "firstName",
        disableFilters: false
    },
    {
        Header: "Last Name",
        accessor: "lastName",
        disableFilters: false
    },
    {
        Header: "Email Id",
        accessor: "email",
        disableFilters: false
    },
    {
        Header: "Contact No",
        accessor: "contactNo",
        disableFilters: false
    },
    {
        Header: "User Type",
        accessor: "userTypeDet.description",
        disableFilters: true
    },
    {
        Header: "Status",
        accessor: "status",
        disableFilters: true
    },
    {
        Header: "Edit User",
        accessor: "action",
        disableFilters: true
    },
    {
        Header: "Map Roles",
        accessor: "action1",
        disableFilters: true
    }
];

export const RoleTableHiddenColumns = [
];