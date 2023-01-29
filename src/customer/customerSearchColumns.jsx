export const CustomerSearchColumns = [
        {
                Header: "Customer Id",
                accessor: "customerId",
                disableFilters: false,
        },
        {
                Header: "Access Number",
                accessor: "accessNbr",
                disableFilters: false,
                id: "serviceNo"
        },
        {
                Header: "Customer Number",
                accessor: "crmCustomerNo",
                id: 'customerNo'
        },
        {
                Header: "Customer Name",
                accessor: "customerName",
                disableFilters: false,
                id: 'customerName'
        },
        {
                Header: "Account Id",
                accessor: "accountId",
                disableFilters: false
        },
        {
                Header: "Account Number",
                accessor: "accountNo",
                disableFilters: false,
                id: "accountNo"
        },
        {
                Header: "Account Name",
                accessor: "accountName",
                click: true,
                disableFilters: false,
                id: "accountName"
        },
        {
                Header: "Service Id",
                accessor: "serviceId",
                disableFilters: false,
        },
        {
                Header: "Service Type",
                accessor: "prodType",
                disableFilters: false,
                id: 'serviceType'
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

export const CustomerSearchHiddenColumns = [
        'customerId',
        'accountId',
        'serviceId'
]

export const ComplaintCustomerSearchHiddenColumns = [
        'customerId',
        'accountId',
        'serviceId',
        'action'
]
