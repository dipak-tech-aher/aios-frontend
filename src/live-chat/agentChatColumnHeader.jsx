export const AgentChatListColumn = [
    {
        Header: "Chat ID",
        accessor: "chatId",
        disableFilters: true,
        id: "chatId"
    },
    {
        Header: "Chat Category",
        accessor: "identifier",
        disableFilters: false,
        id: "category"
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true,
        id: "customerName"
    },
    {
        Header: "Access Number",
        accessor: "contactNo",
        disableFilters: true,
        id: 'accessNo'
    },
    {
        Header: "Contact Number",
        accessor: "contactNo",
        disableFilters: false,
        id: 'contactNo'
    },
    {
        Header: "Email ID",
        accessor: "emailId",
        disableFilters: false,
        id: "email"
    },
    {
        Header: "ID Type",
        accessor: "customerInfo.customerSummary.return.accountSummary.identificationFields.id1Value",
        disableFilters: false,
        id: "IDType"
    },
    {
        Header: "ID Value",
        accessor: "customerInfo.customerSummary.return.accountSummary.identificationFields.id3Value",
        disableFilters: false,
        id: "idValue"
    },
    {
        Header: "Start Date Time",
        accessor: "startAt",
        disableFilters: true,
        id: 'startAt'
    },
    {
        Header: "End Date Time",
        accessor: "endAt",
        disableFilters: true,
        id: 'endAt'
    },
    {
        Header: "Status",
        accessor: "status",
        disableFilters: false,
        id: 'status'
    },
    {
        Header: "Agent Name",
        accessor: "agentName",
        disableFilters: false,
        id: "agentName"
    },
    {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
        id: 'action'
    }
]