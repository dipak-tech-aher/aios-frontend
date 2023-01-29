import React, { useEffect, useState } from 'react';
import { get } from "../util/restUtil";
import { properties } from "../properties";
import DynamicTable from '../common/table/DynamicTable';
import { formatISODateTime } from '../util/dateUtil'
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { unstable_batchedUpdates } from 'react-dom';

const PurchaseHistoryTable = (props) => {

    const refreshPurchaseHistory = props.data.refreshPurchaseHistory

    const setRefreshPurchaseHistory = props.handler.setRefreshPurchaseHistory

    const purchaseHistoryState = props.data.purchaseHistoryState

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails

    const purchaseHistoryData = props.data.purchaseHistoryData
    const setPurchaseHistoryData = props.handler.setPurchaseHistoryData

    const pageSelect = props.data.pageSelect
    const setPageSelect = props.handler.setPageSelect
    const perPage = props.data.perPage
    const setPerPage = props.handler.setPerPage

    useEffect(() => {
        if (purchaseHistoryState === 'show' && refreshPurchaseHistory) {
            showSpinner();
            let limit = perPage
            let offset = 0
            if (pageSelect && !isNaN(pageSelect)) {
                offset = pageSelect * limit
            }

            get(properties.PURCHASE_HISTORY_API + '/' + selectedAccount.customerId +
                '?account-id=' + selectedAccount.accountId +
                '&service-id=' + serviceDetails.serviceId +
                '&limit=' + limit + '&offset=' + offset)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {
                        unstable_batchedUpdates(() => {
                            setPurchaseHistoryData({ rows: resp.data.rows, count: resp.data.count })
                            setRefreshPurchaseHistory(false)
                        })
                    } else {
                        if (resp && resp.status) {
                            toast.error("Error fetching purchase history - " + resp.status + ', ' + resp.message);
                        } else {
                            toast.error("Unexpected error fetching topups");
                        }
                    }
                }).finally(hideSpinner);
        }

    }, [purchaseHistoryState, pageSelect, perPage]);

    const handlePageSelect = (pageNo) => {
        setPageSelect(pageNo)
        setRefreshPurchaseHistory(true)
    }

    const handleOnPerPageChange = (perPage) => {
        setPerPage(perPage)
        setRefreshPurchaseHistory(true)
    }

    const handleCellRender = (cell, row) => {
        
        if (cell.column.id === 'charge') {
            return (<span>$ {(cell.value && !isNaN(cell.value)) ? Number(cell.value).toFixed(2) : ''}</span>)
        }
        else if (cell.column.id === 'purchasedDate') {
            return (<span>{(cell.value) ? formatISODateTime(cell.value) : ''}</span>)
        }
        else if (cell.column.id === 'boosterTopupStatusDesc') {
            return (<span>{['COMPLETE', 'ACTIVE'].includes(row.original.boosterTopupStatus) ? 'Success' : (row.original.boosterTopupStatus === 'FAILED' ? 'Failed' : (row.original.boosterTopupStatus === 'PENDING' ? 'Pending' : cell.value))}</span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }


    return (
        <>
            {
                <div className="row mt-2">
                    <div className="col-lg-12">
                        {
                            (purchaseHistoryData && purchaseHistoryData.rows && purchaseHistoryData.rows.length > 0) ?
                                <div className="card">
                                    <div className="card-body" id="datatable">
                                        <DynamicTable
                                            row={purchaseHistoryData.rows}
                                            rowCount={purchaseHistoryData.count}
                                            header={PurchaseHistoryColumns}
                                            //handleRow={setData}
                                            itemsPerPage={perPage}
                                            hiddenColumns={PurchaseHistoryHiddenColumns}
                                            backendPaging={true}
                                            backendCurrentPage={pageSelect}
                                            handler={{
                                                handleCellRender: handleCellRender,
                                                handlePageSelect: handlePageSelect,
                                                handleItemPerPage: handleOnPerPageChange,
                                                handleCurrentPage: setPageSelect,
                                            }}
                                        />
                                    </div>
                                </div >
                                :
                                <p><strong>No Purchases done yet</strong></p>
                        }
                    </div >
                </div >
            }
        </>
    )
}

const PurchaseHistoryColumns = [
    {
        Header: "Booster/Topup Name",
        accessor: "planName",
        disableFilters: true
    },
    {
        Header: "Booster/Topup Type",
        accessor: "planType",
        disableFilters: true
    },
    {
        Header: "Charge",
        accessor: "charge",
        disableFilters: true
    },
    {
        Header: "Purchased Date",
        accessor: "purchasedDate",
        disableFilters: true
    },
    {
        Header: "Requested By",
        accessor: "purchasedBy",
        disableFilters: true
    },
    {
        Header: "Purchase Status",
        accessor: "boosterTopupStatusDesc",
        disableFilters: true
    },
    {
        Header: "Purchase Status Code",
        accessor: "boosterTopupStatus",
        disableFilters: true
    }
]

const PurchaseHistoryHiddenColumns = ['boosterTopupStatus']

export default PurchaseHistoryTable;