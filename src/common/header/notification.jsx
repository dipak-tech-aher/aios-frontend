import React, { useEffect, useState, useContext } from "react";
import moment from 'moment';
import { properties } from "../../properties";
import useDropDownArea from "./useDropDownArea";
import { put, get } from "../../util/restUtil";
import { showSpinner, hideSpinner } from "../../common/spinner";
import { useHistory } from "react-router-dom";
import NotificationModal from "../notificationModal";
import { AppContext } from "../../AppContext";

const Notification = (props) => {

    const initialState = {
        count: 0,
        data: []
    }
    const history = useHistory();
    const [display, setDisplay] = useDropDownArea('switchNotification');
    const [notifications, setNotifications] = useState(initialState);
    const [openModal, setOpenModal] = useState(false)
    const [notificationData, setNotificationData] = useState({})
    const { auth } = useContext(AppContext)

    useEffect(() => {
        getNotifications();
    }, [auth]);

    const getNotifications = () => {
        showSpinner();
        get(`${properties.NOTIFICATION_API}`)
            .then(resp => {
                if (resp.data) {
                    const { responseCount, row } = resp.data;
                    const { userId } = auth?.user;
                    let unMarkedNotificationOfUser = row.filter((noti) => !noti.markedusers?.users?.includes(userId))
                    setNotifications({
                        count: unMarkedNotificationOfUser.length,
                        data: unMarkedNotificationOfUser
                    })
                }
            }).finally(hideSpinner)
    }

    const updateNotications = (id = undefined) => {
        showSpinner();
        const requestBody = id ? [id] : notifications.data.map((notification) => notification.notificationId);
        put(`${properties.NOTIFICATION_API}`, requestBody)
            .then(({ status }) => {
                if (status === 200) {
                    //setDisplay(true)
                    getNotifications();
                }
            }).finally(hideSpinner)
    }

    const handleOnClearAll = () => {
        setNotifications(initialState)
        updateNotications();
    }

    const handleOnClear = (e) => {
        const id = Number(e.target.dataset.selected);
        updateNotications(id)
    }

    const handleOnNotificationDetails = (intxnId, type) => {
        setDisplay(!display);
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

    const handleOnShowPopUp = (notification) => {
        setOpenModal(true);
        setNotificationData(notification)
    }

    const handleOnViewAll = () => {
        setDisplay(!display)
        history.push(`${process.env.REACT_APP_BASE}/notification`);
    }

    return (
        <>
            <li className={`dropdown notification-list topbar-dropdown  ${display && "show"}`} id="switchNotification" style={{ maxHeight: "130px" }}>
                <span className="nav-link dropdown-toggle waves-effect waves-light" onClick={() => { setDisplay(!display) }}>
                    <i className="fe-bell noti-icon"></i>
                    {notifications.count > 0 ?
                        <span
                            style={{
                                position: 'absolute',
                                top: '7px',
                                right: '-1px',
                                width: '20px',
                                height: '20px',
                                background: 'red',
                                color: '#ffffff',
                                display: 'flex',
                                justifyContent: "center",
                                alignItems: "center",
                                borderRadius: "50%"
                            }} className="icon-button__badge">{notifications.count}</span> : <></>}
                </span>
                <div className={`dropdown-menu dropdown-menu-right dropdown-lg ${display && "show"}`}>
                    <div className="dropdown-item noti-title">
                        <h5 className="m-0">
                            <span className="float-right">
                                <small className="cursor-pointer" onClick={handleOnClearAll}>Clear All</small>
                            </span>Notification
                        </h5>
                    </div>
                    <div className="noti-scroll overflow-auto" data-simplebar="init">
                        <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                            <div className="simplebar-height-auto-observer-wrapper">
                                <div className="simplebar-height-auto-observer"></div>
                            </div>
                            <div className="simplebar-mask">
                                <div className="simplebar-offset" >
                                    <div className="simplebar-content-wrapper" >
                                        <div className="simplebar- mx-1" >
                                            {
                                                notifications.count > 0 && notifications.data.map((notification) => (
                                                    <div key={notification.notificationId} className="toast fade show" role="alert" aria-live="assertive" aria-atomic="true" data-toggle="toast">
                                                        <div className="toast-header" style={{ padding: "3px 20px 3px 2px" }}>
                                                            <strong className="mr-auto pl-1">
                                                                {notification.source}
                                                                <br />
                                                                <span className={"text-primary cursor-pointer"}
                                                                    onClick={() => handleOnNotificationDetails(notification.referenceId, notification.source)}
                                                                >
                                                                    {notification.referenceId}
                                                                </span>
                                                            </strong>
                                                            <small className="mr-1">{moment(notification.createdAt).startOf('hour').fromNow()}</small>
                                                            <button type="button" className="ml-2 mb-1 mr-1 close" onClick={handleOnClear}>
                                                                <span aria-hidden="true" data-selected={notification.notificationId}>×</span>
                                                            </button>
                                                        </div>
                                                        <div className="toast-body">
                                                            <div title="Notification Details"
                                                                className="cursor-pointer"
                                                                onClick={() => handleOnShowPopUp(notification)}
                                                                style={{ whiteSpace: "nowrap", width: "250px", overflow: "hidden", textOverflow: "ellipsis" }}
                                                            >
                                                                {notification.subject}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            <div className="dropdown-item text-center text-primary notify-item notify-all"
                                                onClick={handleOnViewAll}
                                            >
                                                View all
                                                <i className="fe-arrow-right" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
            {
                openModal &&
                <NotificationModal isOpen={openModal} setIsOpen={setOpenModal} data={notificationData} getNotifications={getNotifications} />
            }
        </>
    );
};

export default Notification;
