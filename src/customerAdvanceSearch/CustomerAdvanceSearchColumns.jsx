export const CustomerAdvanceSearchColumns = [
    {
        Header: "Customer Id",
        accessor: "customerId",
        disableFilters: false,
        id: 'customerId'
    },
    {
        Header: "Customer Number",
        accessor: "customerNo",
        disableFilters: false,
        id: 'customerNo'
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: false,
        id: 'customerName'
    },
    {
        Header: "Account Number",
        accessor: "accountNo",
        disableFilters: false,
        id: 'accountNo'
    },
    {
        Header: "Account Name",
        accessor: "accountName",
        disableFilters: false,
        id: "accountName"
    },
    {
        Header: "Access Number",
        accessor: "accessNbr",
        disableFilters: false,
        id: "serviceNo"
    },
    {
        Header: "Service Type",
        accessor: "prodType",
        disableFilters: false,
        id: 'serviceType'
    },
    {
        Header: "Primary Contact Number",
        accessor: "contactNo",
        disableFilters: false,
        id: 'contactNo'
    },
    {
        Header: "ID Number",
        accessor: "idValue",
        disableFilters: false,
        id: 'idNo'
    },
    {
        Header: "Customer Status",
        accessor: "customerStatus",
        disableFilters: false
    },
    {
        Header: "Service Id",
        accessor: "serviceId",
        disableFilters: false,
    },
    {
        Header: "Account Id",
        accessor: "accountId",
        disableFilters: false
    },
    {
        Header: "Service Status",
        accessor: "serviceStatusDesc",
        disableFilters: false,
        id: 'status'
    },
    {
        Header: "Action",
        accessor: "action",
        disableFilters: true
    }
]

// accessor names
export const CustomerAdvanceSearchHiddenColumns = [
    'customerId',
    'serviceId',
    'accountId',
    'customerStatus'
]
