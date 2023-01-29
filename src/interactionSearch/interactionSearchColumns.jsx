export const InteractionSearchColumns = [
    {
        Header: "Interaction ID",
        accessor: "intxnId",
        disableFilters: false,
        click: true,
        id: "interactionId",
  
    },
    {
        Header: "Ticket ID",
        accessor: "ticketId",
        disableFilters: true,
        click: false,
        id: "ticketId",
  
    },
    {
        Header: "Interaction Type",
        accessor: "intxnTypeDesc",
        disableFilters: false,
        id: 'interactionCatType'
    },
    {
        Header: "Interaction Category Type",
        accessor: "ticketTypeDesc",
        disableFilters: false,
    },
    {
        Header: "Work Order Type",
        accessor: "woTypeDescription",
        disableFilters: false,
        id: "woType"
    },
    {
        Header: "Access Number",
        accessor: "accessNbr",
        disableFilters: false,
        id: "serviceNumber"
    },
    {
        Header: "Service Type",
        accessor: "prodType",
        disableFilters: false,
        id: "serviceType"
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true,
    },
    {
        Header: "Customer Number",
        accessor: "customerNbr",
        disableFilters: true,
    },
    {
        Header: "Account Name",
        accessor: "accountName",
        disableFilters: true,
    },
    {
        Header: "Account Number",
        accessor: "accountNo",
        disableFilters: true,
    },
    {
        Header: "Contact Number",
        accessor: "contactNo",
        disableFilters: true,
    },
    {
        Header: "Assigned",
        accessor: "assigned",
        disableFilters: false,
        id: "assigned"
    },
    {
        Header: "Created Date",
        accessor: "createdAt",
        disableFilters: true
    },
    {
        Header: "Created By",
        accessor: "createdBy",
        disableFilters: true
    },
    {
        Header: "Status",
        accessor: "currStatusDesc",
        disableFilters: false,
        id: "status"
    },
    // {
    //     Header: "Product/Services",
    //     accessor: "",
    //     disableFilters: true
    // },
    {
        Header: "Action",
        accessor: "action",
        disableFilters: true
    },
    {
        Header: "Customer Id",
        accessor: "customerId",
        disableFilters: false,
    },
    {
        Header: "Service Id",
        accessor: "serviceId",
        disableFilters: false,
    },
    {
        Header: "Interaction Type",
        accessor: "intxnType",
        disableFilters: false
    },
    {
        Header: "Account Id",
        accessor: "accountId",
        disableFilters: false
    },
    {
        Header: "External System",
        accessor: "externalRefSys1",
        disableFilters: true
    },
    {
        Header: "External Reference",
        accessor: "externalRefNo1",
        disableFilters: true
    }
]

// accessor names
export const InteractionSearchHiddenColumns = [
    'customerId',
    'serviceId',
    'intxnType',
    'accountId',
    'externalRefSys1',
    'externalRefNo1',
    'ticketTypeDesc'
]
