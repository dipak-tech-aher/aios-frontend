export const RecordExtractorColumns = [
    {
        Header: "Upload Process ID",
        accessor: "uploadProcessId",
        disableFilters: false,
    },
    {
        Header: "Upload Type",
        accessor: "bulkUploadType",
        disableFilters: true,
    },
    {
        Header: "No of Records Attempted",
        accessor: "noOfRecordsAttempted",
        disableFilters: true,
    },
    {
        Header: "Successfully Uploaded",
        accessor: "successfullyUploaded",
        disableFilters: true,
    },
    {
        Header: "Failed",
        accessor: "failed",
        disableFilters: true,
    },
    {
        Header: "Uploaded By",
        accessor: "createdByDetails.firstName",
        disableFilters: false,
    },
    {
        Header: "Uploaded Date and Time",
        accessor: "updatedAt",
        disableFilters: true,
    },
    {
        Header: "Action",
        accessor: "action",
        disableFilters: true,
    }
]

export const OMSModalViewDataColumns = [
    {
        Header: "Ticket ID",
        accessor: "ticketId",
        disableFilters: false,
    },
    {
        Header: "Ticket Type",
        accessor: "ticketType",
        disableFilters: true,
    },
    {
        Header: "Service Number",
        accessor: "serviceNo",
        disableFilters: false,
    },
    {
        Header: "Service Type",
        accessor: "serviceType",
        disableFilters: true,
    },
    {
        Header: "Priority",
        accessor: "priority",
        disableFilters: false,
    }
]