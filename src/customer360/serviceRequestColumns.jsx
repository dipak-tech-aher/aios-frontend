export const ServiceRequestColumns = [
    {
        Header : "Interaction ID",
        accessor : "intxnId",
        disableFilters : true
    },
    {
        Header : "Account Number",
        accessor : "Account.accountNo",
        disableFilters : true
    },
    {
        Header : "Access Number",
        accessor : "Connection.identificationNo",
        disableFilters : true
    },
    {
        Header : "Service Type",
        accessor : "Plan.prodType",
        disableFilters : true
    },
    {
        Header : "Work Order Type",
        accessor : "workOrderType.description",
        disableFilters : true
    },
    {
        Header : "Created Date",
        accessor : "createdAt",
        disableFilters : true
    },
    {
        Header : "Created By",
        accessor : "userId.userId",
        disableFilters : true
    },
    {
        Header : "Status",
        accessor : "currStatus",
        disableFilters : true
    },
    {
        Header : "Current Status",
        accessor : "currStatusDesc.description",
        disableFilters : true
    },
    // {
    //     Header : "Description",
    //     accessor : "description",
    //     disableFilters : false
    // },
    {
        Header : "Action",
        accessor : "action",
        disableFilters : true
    },
]


export const InquiryListColumns = [
    {
        Header : "Inquiry ID",
        accessor : "intxnId",
        disableFilters : true
    },
    {
        Header : "Account Number",
        accessor : "Account.accountNo",
        disableFilters : true
    },
    {
        Header : "Access Number",
        accessor : "Connection.identificationNo",
        disableFilters : true
    },
    {
        Header : "Problem Cause",
        accessor : "inqCauseDesp.description",
        disableFilters : true
    },
    {
        Header : "Created Date",
        accessor : "createdAt",
        disableFilters : true
    },
    {
        Header : "Created By",
        accessor : "userId.userId",
        disableFilters : true
    },
    {
        Header : "Status",
        accessor : "currStatus",
        disableFilters : true
    },
    {
        Header : "Current Status",
        accessor : "currStatusDesc.description",
        disableFilters : true
    }
    // {
    //     Header : "Description",
    //     accessor : "description",
    //     disableFilters : false
    // },
    // {
    //     Header : "Action",
    //     accessor : "action",
    //     disableFilters : true
    // },
];


export const ComplaintListColumns = [
    {
        Header : "Complaint ID",
        accessor : "intxnId",
        disableFilters : true
    },
    {
        Header : "Account Number",
        accessor : "Account.accountNo",
        disableFilters : true
    },
    {
        Header : "Access Number",
        accessor : "Connection.identificationNo",
        disableFilters : true
    },
    {
        Header : "Problem Cause",
        accessor : "cmpProblemDesp.description",
        disableFilters : true
    },
    {
        Header : "Created Date",
        accessor : "createdAt",
        disableFilters : true
    },
    {
        Header : "Created By",
        accessor : "userId.userId",
        disableFilters : true
    },
    {
        Header : "Status",
        accessor : "currStatus",
        disableFilters : true
    },
    {
        Header : "Current Status",
        accessor : "currStatusDesc.description",
        disableFilters : true
    },
    // {
    //     Header : "Description",
    //     accessor : "description",
    //     disableFilters : false
    // },
    {
        Header : "Action",
        accessor : "action",
        disableFilters : true
    },
];

export const SRHiddenColumns = [
    'currStatus'
]

export const ComplaintHiddenColumns = [
    'currStatus'
]

export const InquiryHiddenColumns = [
    'currStatus'
]