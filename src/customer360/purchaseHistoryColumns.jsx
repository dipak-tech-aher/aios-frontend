export const PurchaseHistoryColumns = [
    {
        Header: "Booster/Topup Name",
        accessor: "planName",
        disableFilters: false,
        click: true,
        id: "Interaction Id"
    },
    {
        Header: "Booster/Topup Type",
        accessor: "planType",
        disableFilters: false,
    },
    {
        Header: "Purchased Date",
        accessor: "purchaseDate",
        disableFilters: false,
    },
    {
        Header: "Purchased By",
        accessor: "userName",
        disableFilters: false
    },
    {
        Header: "Purchase Status",
        accessor: "status",
        disableFilters: false
    }
]

// accessor names
export const PurchaseHistoryHiddenColumns = []
