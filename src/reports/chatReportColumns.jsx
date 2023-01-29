export const chatReportColumns = [
    {
        Header: "Chat Id",
        accessor: "chatId",
        disableFilters: true,
        id: "chatId"
    },
    {
        Header: "Contact No",
        accessor: "contactNo",
        disableFilters: true,
        id: "contactNo"
    },
    {
        Header: "Email Id",
        accessor: "emailId",
        disableFilters: true,
        id: "emailId"
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true,
        id: "customerName"
    },
    {
        Header: "Response Time",
        disableFilters: true,
        id: "responseTime"
    },
    {
        Header: "Start At",
        accessor: "createdAt",
        disableFilters: true,
        id: "createdAt"
    },
    {
        Header: "End At",
        accessor: "endAt",
        disableFilters: true,
        id: "endAt"
    },
    {
        Header: "Status",
        accessor: "statusDesc",
        disableFilters: true,
        id: "statusDesc"
    },
    {
        Header: "Chat Msg",
        accessor: "chatMsg",
        disableFilters: true,
        id: "message"
    },
    {
        Header: "Service Type",
        accessor: "type",
        disableFilters: true,
        id: "type"
    },
    {
        Header: "Access No",
        accessor: "accessNo",
        disableFilters: true,
        id: "accessNo"
    },
    {
        Header: "Category",
        accessor: "category",
        disableFilters: true,
        id: "category"
    },
    {
        Header: "Id Value",
        accessor: "idValue",
        disableFilters: true,
        id: "idValue"
    },
    {
        Header: "Agent Attended",
        accessor: "agentName",
        disableFilters: true,
        id: "agentName"
    },
    {
        Header: "Queue Wait (min)",
        disableFilters: true,
        id: "queueWait"
    },
    {
        Header: "Duration of Chat (min)",
        disableFilters: true,
        id: "chatDuration"
    },
    {
        Header: "Agent Id",
        accessor: "agentId",
        disableFilters: true,
        id: "agentId"
    },
    {
        Header: "Status",
        accessor: "statusCode",
        disableFilters: true,
        id: "statusCode"
    },
]

export const chatReporHiddenColumns = [
    'agentId',
    'categoryCode',
    'serviceTypeCode',
    'statusCode'

]

export const dailyNewCustomerRequestsChatReportColumns = [
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true,
        id: "customerName"
    },
    {
        Header: "Customer Mobile Number",
        accessor: "customerMobileNumber",
        disableFilters: true,
        id: "customerMobileNumber"
    },
    {
        Header: "Customer Email ID",
        accessor: "customerEmailId",
        disableFilters: true,
        id: "customerEmailId"
    },
    {
        Header: "ID Number",
        accessor: "idNumber",
        disableFilters: true,
        id: "idNumber"
    },
    {
        Header: "Access Number",
        accessor: "accessNumber",
        disableFilters: true,
        id: "accessNumber"
    },
    {
        Header: "Service Type",
        accessor: "serviceType",
        disableFilters: true,
        id: "serviceType"
    },
    {
        Header: "Created Date",
        accessor: "createdDate",
        disableFilters: true,
        id: "createdDate"
    }
];

export const boosterPurchaseChatReportColumns = [
    {
        Header: "Access Number",
        accessor: "accessNumber",
        disableFilters: true,
        id: "accessNumber"
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true,
        id: "customerName"
    },
    {
        Header: "Contact No",
        accessor: "contactNo",
        disableFilters: true,
        id: "contactNo"
    },
    {
        Header: "Email ID",
        accessor: "emailId",
        disableFilters: true,
        id: "emailId"
    },
    // {
    //     Header: "ID Value",
    //     accessor: "idValue",
    //     disableFilters: true,
    //     id: "idValue"
    // },
    {
        Header: "Booster Name",
        accessor: "boosterName",
        disableFilters: true,
        id: "boosterName"
    },
    {
        Header: "Purchase Date",
        accessor: "purchaseDate",
        disableFilters: true,
        id: "purchaseDate"
    },
    {
        Header: "Status",
        accessor: "status",
        disableFilters: true,
        id: "status"
    },

];

export const customerCountsReportColumns = [
    {
        Header: "Customers Visited Chat2US Count",
        accessor: "visitedCustomerCount",
        disableFilters: true,
        id: "visitedCustomerCount"
    },
    {
        Header: "Customers Connected with Live Chat Agent Count",
        accessor: "connectedWithLiveAgentCount",
        disableFilters: true,
        id: "connectedWithLiveAgentCount"
    },
];
