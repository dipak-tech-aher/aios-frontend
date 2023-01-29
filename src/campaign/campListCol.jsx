const CampListCol = [
    {
        Header: "Campaign Name",
        accessor: "campName",
        disableFilters: false,
        click: true,
        id: "campaignName"   
    },
    {
        Header: "Campaign Description",
        accessor: "campDescription",
        disableFilters: false,
        id: "campaignDescription"
   
    },
    {
        Header: "Access Number",
        accessor: "serviceNo",
        disableFilters: false,
        id: "accessNumber"
    },
    {
        Header: "Valid From",
        accessor: "validFrom",
        disableFilters: true,
        id: "validFrom"
    },
    {
        Header: "Valid To",
        accessor: "validTo",
        disableFilters: true,
        id: "validTo"
    },
    {
        Header: "Created By",
        accessor: "concat",
        disableFilters: true,
        id: "createdBy"
    },
    {
        Header: "Created On",
        accessor: "createdAt",
        disableFilters: true,
        id: "createdAt"
    }
]
export default CampListCol;
