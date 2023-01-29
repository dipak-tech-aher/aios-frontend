export const CallCollectionReportTemplateColumns = [
    {
        Header: "Customer Number",
        accessor: "customerNo",
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
        Header: "Validation",
        accessor: "validationStatus",
        disableFilters: true,
    },
    {
        Header: "Validation Remarks",
        accessor: "validationRemark",
        disableFilters: true,
    },
]

export const CallCollectionReportTemplateHiddenColumns = [
    "validationStatus",
    "validationRemark"
]

export const UploadedTableHiddenColumns = [
    "contactNo",
    "validationStatus",
    "validationRemark"
]

export const CallCollectionReportTemplateFailedHiddenColumns = [

]

export const CallCollectionReportTemplateNoOsColumns = [
    {
        Header: "Customer Number",
        accessor: "customerNo",
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
        Header: "Customer Status",
        accessor: "customerStatus",
        disableFilters: true,
    },
    {
        Header: "Account Status",
        accessor: "accountStatus",
        disableFilters: true,
    },
    {
        Header: "Creation Date",
        accessor: "accountCreationDate",
        disableFilters: true,
    },
    {
        Header: "Plan Code",
        accessor: "basicCollectionPlanCode",
        disableFilters: true,
    },
    {
        Header: "Bill UID",
        accessor: "billUid",
        disableFilters: true,
    },
    {
        Header: "Bill Status",
        accessor: "billStatus",
        disableFilters: true,
    },
    {
        Header: "Bill Month",
        accessor: "billMonth",
        disableFilters: true,
    },
    {
        Header: "Bill Amount",
        accessor: "billAmount",
        disableFilters: true,
    },
    {
        Header: "Bill Date",
        accessor: "billDate",
        disableFilters: true,
    },
    {
        Header: "Paid Date",
        accessor: "paidDate",
        disableFilters: true,
    },
    {
        Header: "Due Date",
        accessor: "dueDate",
        disableFilters: true,
    },
    {
        Header: "Paid Amount",
        accessor: "paidAmount",
        disableFilters: true,
    },
    {
        Header: "Unpaid Amount",
        accessor: "unpaidAmount",
        disableFilters: true,
    },
    {
        Header: "Dispute Amount",
        accessor: "disputeAmount",
        disableFilters: true,
    },
    {
        Header: "Refund Amount",
        accessor: "refundAmount",
        disableFilters: true,
    }
]


export const CallCollectionReportMandatoryColumns = [
    ['Customer Number', 'Account Number']
]
