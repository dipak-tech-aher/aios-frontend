import React, { useEffect, useState } from 'react'
import { properties } from "../properties";
import { get } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import DynamicTable from '../common/table/DynamicTable';
import { formatISODateTime } from '../util/dateUtil';
import NotificationModal from "./notificationModal";
import { toast } from 'react-toastify';
import { history } from '../util/history';

const NotificationTable = () => {

    const [notifications, setNotifications] = useState([]);
    const [exportBtn, setExportBtn] = useState(true);
    const [openModal, setOpenModal] = useState(false)
    const [notificationData, setNotificationData] = useState({})

    const getNotifications = () => {
        showSpinner();
        get(`${properties.NOTIFICATION_API}`)
            .then(resp => {
                if (resp.data.length === 0) {
                    toast.error("Records Not Found")
                }
                if (resp.data) {
                    setNotifications(resp.data.row)
                }
            }).finally(hideSpinner)
    }
    useEffect(() => {
        getNotifications();
    }, [])

    const handleCellRender = (cell, row) => {
        const { source, referenceId } = row.original;
        if (cell.column.Header === "Notification Date - Time") {
            return (<span>{formatISODateTime(cell.value)}</span>)
        }
        else if (cell.column.Header === "Notification Title") {
            return (<span className="text-primary cursor-pointer" onClick={() => handleOnTitleClick(referenceId, source)}>{source} {referenceId}</span>)
        }
        else if (cell.column.Header === "Broadcast Message") {
            return (<span className="cursor-pointer" onClick={() => { setOpenModal(true); setNotificationData(row.original) }}>{cell.value}</span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleOnTitleClick = (intxnId, type) => {
        showSpinner();
        get(`${properties.SERVICE_REQUEST_DETAILS}/${intxnId}`)
            .then((response) => {

                if (response.data) {
                    const { accountId, connectionId, customerId, woType, currStatus, workOrderType, intxnType } = response.data;
                    const isAdjustmentOrRefund = ['Adjustment', 'Refund'].includes(workOrderType.description) ? true : ['Fault'].includes(workOrderType.description) && intxnType === 'REQSR' ? true : false;
                    history.push(`${process.env.REACT_APP_BASE}/edit-${type.toLowerCase().trim().replace(' ', '-')}`, {
                        data: {
                            interactionId: intxnId,
                            accountId,
                            serviceId: connectionId,
                            customerId,
                            woType,
                            type: isAdjustmentOrRefund ? 'complaint' : type.toLowerCase(),
                            isAdjustmentOrRefund,
                            row: {
                                currStatus,
                                workOrderType
                            }
                        }
                    })
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(hideSpinner)
    }

    const NotificationTableColumns = [
        {
            Header: "Notification Title",
            accessor: "notificationId",
            disableFilters: true
        },
        {
            Header: "Broadcast Message",
            accessor: "subject",
            disableFilters: true
        },
        {
            Header: "Notification Date - Time",
            accessor: "createdAt",
            disableFilters: true
        },
    ];

    return (
        <>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="page-title-box">
                        <h4 className="page-title">View All Notifications</h4>
                    </div>
                    <div className="search-result-box m-t-30 card-box">
                        <div className="row mt-2 pr-2">
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        {
                                            !!notifications.length ?
                                                <DynamicTable
                                                    listKey={"View All Notifications"}
                                                    row={notifications}
                                                    header={NotificationTableColumns}
                                                    itemsPerPage={10}
                                                    exportBtn={exportBtn}
                                                    handler={{
                                                        handleCellRender: handleCellRender,
                                                        handleExportButton: setExportBtn
                                                    }}
                                                />
                                                :
                                                <p className="text-center m-0">No notifications found.</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    openModal &&
                    <NotificationModal isOpen={openModal} setIsOpen={setOpenModal} data={notificationData} getNotifications={getNotifications} />
                }
            </div>
        </>
    )
}

export default NotificationTable
