import React, { useEffect, useRef, useState } from 'react';

import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';

import { put, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";


function BarUnBarPopUpView(props) {

    const customerId = props.data.selectedAccount.customerId
    const accountId = props.data.selectedAccount.accountId
    const serviceId = props.data.serviceDetails.serviceId
    const serviceStatus = props.data.serviceDetails.status
    const show = props.data.show
    const handleServicePopupClose = props.handler.handleServicePopupClose
    const target = props.data.target
    const setRefreshPage = props.handler.setRefreshPage
    const containerRef = props.data.containerRef

    const closePopUp = props.handler.closePopUp
    const setServicesList = props.handler.setServicesList
    const setRefreshServiceList = props.handler.setRefreshServiceList

    const barUnBarlookupData = useRef([])

    const [reason, setReason] = useState();

    useEffect(() => {
        showSpinner();
        let reasonType
        if (serviceStatus === 'ACTIVE') {
            reasonType = 'BAR_REASON'
        } else {
            reasonType = 'UNBAR_REASON'
        }
        post(properties.BUSINESS_ENTITY_API, [reasonType]).then((resp) => {
            if (resp.data) {
                if (resp.status === 200) {
                    barUnBarlookupData.current = resp.data[reasonType]
                } else {
                    toast.error("Failed to get Reason Codes - " + resp.status + ', ' + resp.message);
                }
            } else {
                toast.error("Uexpected error ocurred " + resp.statusCode);

            }
        }).finally(hideSpinner);
    }, [])

    //bar service called
    const handleBarUnBarService = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation();
        if (!reason || reason === '') {
            toast.error("Please select a reason");
        } else {
            let reqBody = {
                customerId: customerId,
                accountId: accountId,
                serviceId: serviceId,
                reason: reason
            }
            showSpinner();
            let endPoint
            if (serviceStatus === 'ACTIVE') {
                endPoint = properties.BAR_SERVICE
            } else {
                endPoint = properties.UNBAR_SERVICE
            }
            put(endPoint, reqBody)
                .then((resp) => {
                    if (resp && resp.status) {
                        if (resp.status === 200) {
                            toast.success(resp.message);
                            handleServicePopupClose()
                            //window.location.reload(false)
                            setRefreshPage((prevState) => (!prevState))
                        } else {
                            if (resp.message) {
                                toast.error(resp.message)
                            } else {
                                toast.error("Failed to initiate Service Request for barring Service - " + resp.status + ', ' + resp.message);
                            }
                        }
                        setRefreshServiceList(serviceId)
                    } else {
                        toast.error("Uexpected error ocurred ");
                    }
                }).catch((resp) => {
                    setRefreshServiceList(serviceId)
                }).finally(() => {
                    hideSpinner();
                    closePopUp();
                    setReason(null);
                });
        }
    }

    return (
        <Overlay show={show} target={target.current} placement="bottom" container={containerRef.current} containerPadding={0}>
            <Popover className="mt-2" id="popover-basic" style={{ minWidth: "200px", zIndex: 9999 }}>
                <Popover.Title as="h3">
                    <strong>{(serviceStatus === 'ACTIVE') ? "Bar" : "Un Bar"}</strong>
                    <button type="button" className="close" style={{ width: '20', height: '20' }} onClick={closePopUp}>
                        <span>&times;</span>
                    </button>
                </Popover.Title>
                <Popover.Content>
                    <div className="card">
                        <div className="card-body border">
                            <form id="bar-unbar-form">
                                <div className="d-flex flex-column justify-content-center mt-0">
                                    <select value={reason} className="form-control input-error"
                                        onChange={e => setReason(e.target.value)}>
                                        <option value="">Choose Reason</option>
                                        {
                                            (barUnBarlookupData && barUnBarlookupData.current && barUnBarlookupData.current.length > 0) ?
                                                barUnBarlookupData.current.map((e) => (
                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                ))
                                                :
                                                <></>
                                        }

                                    </select>
                                </div>
                                <div className="mt-2 d-flex flex-row justify-content-center">
                                    <button onClick={() => { closePopUp(); setReason(null) }} type="button" className="btn btn-secondary btn-sm  waves-effect waves-light ml-2">Cancel</button>
                                    <button onClick={handleBarUnBarService} type=" button" className="btn btn-primary btn-sm  waves-effect waves-light ml-2">
                                        {
                                            (serviceStatus === 'ACTIVE') ? "Bar" : "Un Bar"
                                        }
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </Popover.Content>
            </Popover>
        </Overlay>
    );
}
export default BarUnBarPopUpView;