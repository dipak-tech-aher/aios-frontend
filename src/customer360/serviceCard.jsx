import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { formatISODateDDMMMYY } from '../util/dateUtil'
import { history } from '../util/history';
import { get } from "../util/restUtil";
import { properties } from "../properties";
import { hideSpinner, showSpinner } from '../common/spinner'
import { unstable_batchedUpdates } from 'react-dom';
function ServiceCard(props) {

    const { t } = useTranslation();

    //const serviceDetails = props.data.serviceDetails
    //let serviceDetails = serviceDetail
    const [serviceDetails,setServiceDetails] = useState(props.data.serviceDetails)
    const selectedAccount = props.data.selectedAccount
    const handleServicePopupOpen = props.handler.handleServicePopupOpen
    const handleLoadBalances = props.handler.handleLoadBalances
    const activeService = props.data.activeService
    const setActiveService = props.handler.setActiveService
    const idx = props.data.idx
    const searchInput = props.data.searchInput
    const connectionStatusLookup = props.data.connectionStatusLookup
    const refVoid = useRef(null)
    const setServiceStatus = props.handler.setServiceStatus
    const createSRData = props.data.createSRData
    const refreshPage = props.data.refreshPage
    useEffect(() => {
        showSpinner()
        get(properties.SERVICE_BADGE_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
        .then((resp) => {
            if(resp.data.badge === "TERMINATE")
            {
                unstable_batchedUpdates(() => {
                    setServiceDetails({...serviceDetails,badge:resp.data.badge})
                })
            }
        })
        .finally(hideSpinner)
    },[refreshPage])


    const handleServiceCardClick = (e, id, status) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
            e.nativeEvent.stopImmediatePropagation();
        }
        if (id !== undefined) {
            setActiveService(id)
        }
        if (status !== undefined) {
            setServiceStatus(status)
        }
    }

    const handleOnCreateServiceRequest = () => {
        const { selectedAccount, kioskRefId, accountName, accountContactNo, accountEmail } = createSRData;
        const { accountId, accountNo, customerId } = selectedAccount;
        const { serviceId } = searchInput;
        let data = {
            accountId,
            customerId,
            serviceId,
            accountNo,
            accountName: accountName.trim() ? accountName : '-',
            accountContactNo,
            accountEmail,
            kioskRefId,
            serviceType : serviceDetails.prodType,
            type: 'Service Request'
        }
        history.push(`${process.env.REACT_APP_BASE}/create-service-request`, { data })
    }

    return (
        <div ref={(Number(searchInput.serviceId) == Number(serviceDetails.serviceId)) ? props.refProp : refVoid} className="item" key={"service" + serviceDetails.serviceId}>
            <div className={"card border " + ((activeService && activeService !== null && activeService !== 0 && activeService === serviceDetails.serviceId) ? "bg-secondary rainbow" : "")}>
                <div className="card-header bg-primary bold text-white">
                    Service Number -&nbsp;
                    {
                        ((serviceDetails.accessNbr === 0 || serviceDetails.accessNbr === undefined)) ?
                            (serviceDetails.status === 'PENDING') ?
                                'Pending'
                                :
                                serviceDetails.accessNbr
                            :
                            serviceDetails.accessNbr
                    }
                </div>
                <div className="card-body" onClick={(e) => {
                    handleServiceCardClick(e, serviceDetails.serviceId, serviceDetails.status)
                }}>
                    <div className="row ml-0">
                        <div className="col-12">
                            {
                                serviceDetails.prodType === 'Prepaid' ?
                                    <>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Service Type</label>
                                            </div>
                                            <div className="col-7 pt-1">{serviceDetails.prodType}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Plan</label>
                                            </div>
                                            <div className="col-7 pt-1"><p>{serviceDetails.planName}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Status</label>
                                            </div>
                                            <div className="col-7">
                                                <p className="pt-1">
                                                    {
                                                        (serviceDetails.realtime && serviceDetails.realtime.serviceStatus) ?
                                                            serviceDetails.realtime.serviceStatus
                                                            :
                                                            serviceDetails.status
                                                    }
                                                </p>
                                                    {
                                                        (serviceDetails.status === 'PENDING') ?
                                                            (serviceDetails.badge === 'BAR') ?
                                                                <p className="service-card badge badge-danger badge-pill m-0">BAR Initiated</p>
                                                                :
                                                                (serviceDetails.badge === 'UNBAR') ?
                                                                    <p className="service-card badge badge-danger badge-pill m-0">UNBAR Initiated</p>
                                                                    :
                                                                    (serviceDetails.badge === 'WONC' || serviceDetails.badge === 'WONC-ACCSER' || serviceDetails.badge === 'WONC-SER') ?
                                                                        <p className="service-card badge badge-info badge-pill m-0">New Connection</p>
                                                                        :
                                                                        ''
                                                            :
                                                            (serviceDetails.status === 'TOS') ?
                                                                <p className="ml-1 service-card badge badge-danger badge-pill m-0">Service Barred</p>
                                                                :
                                                                (serviceDetails.badge === 'UPGRADE') ?
                                                                    <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Upgrade in Progress</p>
                                                                    :
                                                                    (serviceDetails.badge === 'DOWNGRADE') ?
                                                                        <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Downgrade in Progress</p>
                                                                        :
                                                                        <></>
                                                    }
                                                    {
                                                       ['TERMINATE'].includes(serviceDetails.badge) &&
                                                        <p className="service-card badge badge-danger badge-pill m-0">Termination Requested</p>
                                                    }
                                            </div>
                                        </div>
                                        {
                                            /*(serviceDetails.realtime.activationDate) ?*/
                                            <div className="row">
                                                <div className="col-5">
                                                    <label className="col-form-label">Activation Date</label>
                                                </div>
                                                <div className="col-7">
                                                    <p className="pt-1">
                                                        {(serviceDetails.realtime && serviceDetails.realtime.activationDate) ? formatISODateDDMMMYY(serviceDetails.realtime.activationDate) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            /*    :   
                                                <></>*/
                                        }
                                        {
                                            /*(serviceDetails.realtime.activationDate) ?*/
                                            <div className="row">
                                                <div className="col-5">
                                                    <label className="col-form-label">Expiry Date</label>
                                                </div>
                                                <div className="col-7">
                                                    <p className="pt-1">
                                                        {(serviceDetails.realtime && serviceDetails.realtime.expiryDate) ? formatISODateDDMMMYY(serviceDetails.realtime.expiryDate) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            /*    :   
                                                <></>*/
                                        }
                                        {
                                            (serviceDetails && serviceDetails.realtimeLoaded) ?
                                                <div className="card-body p-0">
                                                    <table className="table table-responsive table-hover table-centered table-nowrap mb-2">
                                                        <tbody>
                                                            {
                                                                /*(serviceDetails.realtime.mainBalance !== undefined) ?*/
                                                                <tr>
                                                                    <td>Main Balance</td>
                                                                    <td className="align-center"><i
                                                                        className="fas fas fa-dollar-sign fa-2x text-primary"></i>
                                                                    </td>
                                                                    <td>
                                                                        <div><a>{(serviceDetails.realtime && serviceDetails.realtime.mainBalance !== undefined) ? Number(serviceDetails.realtime.mainBalance).toFixed(2) : ''}</a></div>
                                                                    </td>
                                                                </tr>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                            {
                                                                /*(serviceDetails.realtime.data !== undefined) ?*/
                                                                <tr>
                                                                    <td>Data Balance</td>
                                                                    <td className="align-center"><i
                                                                        className="fas fa-wifi fa-2x text-primary"></i>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            (serviceDetails.realtime && serviceDetails.realtime.data !== undefined && !isNaN(serviceDetails.realtime.data)) ?
                                                                                <div><a>{Number(serviceDetails.realtime.data / (1024 * 1024 * 1024)).toFixed(1)}</a>&nbsp;GB</div>
                                                                                :
                                                                                <div></div>
                                                                        }
                                                                    </td>
                                                                </tr>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                            {
                                                                /*(serviceDetails.realtime.sms !== undefined) ?*/
                                                                <tr>
                                                                    <td>SMS Balance</td>
                                                                    <td className="align-center"><i
                                                                        className="fas fa-sms fa-2x text-primary"></i>
                                                                    </td>
                                                                    <td>
                                                                        <h4 className="font-size-16 m-0">{(serviceDetails.realtime && serviceDetails.realtime.sms !== undefined) ? serviceDetails.realtime.sms : ''}</h4>
                                                                    </td>
                                                                </tr>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                            {
                                                                /*(serviceDetails.realtime.voice) !== undefined ?*/
                                                                <tr>
                                                                    <td>Voice Balance</td>
                                                                    <td className="align-center"><i
                                                                        className="fas fa-phone-volume fa-2x text-primary"></i>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            (serviceDetails.realtime && serviceDetails.realtime.voice !== undefined) ?
                                                                                <div id="top5"><a>{serviceDetails.realtime.voice}</a>&nbsp;Min</div>
                                                                                :
                                                                                <div id="top5"></div>

                                                                        }
                                                                    </td>
                                                                </tr>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :
                                                <></>


                                        }
                                    </>
                                    :
                                    <></>
                            }
                            {
                                serviceDetails.prodType === 'Postpaid' ?
                                    <>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Service Type</label>
                                            </div>
                                            <div className="col-7 pt-1">{serviceDetails.prodType}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Plan</label>
                                            </div>
                                            <div className="col-7 pt-1"><p>{serviceDetails.planName}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Status</label>
                                            </div>
                                            <div className="col-7">
                                                <p className="pt-1">
                                                    {
                                                        (serviceDetails.realtime && serviceDetails.realtime.serviceStatus) ?
                                                            serviceDetails.realtime.serviceStatus
                                                            :
                                                            serviceDetails.status
                                                    }
                                                </p>
                                                    {
                                                        (serviceDetails.status === 'PENDING') ?
                                                            (serviceDetails.badge === 'BAR') ?
                                                                <p className="service-card badge badge-danger badge-pill m-0">BAR Initiated</p>
                                                                :
                                                                (serviceDetails.badge === 'UNBAR') ?
                                                                    <p className="service-card badge badge-danger badge-pill m-0">UNBAR Initiated</p>
                                                                    :
                                                                    (serviceDetails.badge === 'WONC' || serviceDetails.badge === 'WONC-ACCSER' || serviceDetails.badge === 'WONC-SER') ?
                                                                        <p className="service-card badge badge-info badge-pill m-0">New Connection</p>
                                                                        :
                                                                        ''
                                                            :
                                                            (serviceDetails.status === 'TOS') ?
                                                                <p className="ml-1 service-card badge badge-danger badge-pill m-0">Service Barred</p>
                                                                :
                                                                (serviceDetails.badge === 'UPGRADE') ?
                                                                    <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Upgrade in Progress</p>
                                                                    :
                                                                    (serviceDetails.badge === 'DOWNGRADE') ?
                                                                        <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Downgrade in Progress</p>
                                                                        :
                                                                        <></>
                                                    }
                                                    {
                                                       ['TERMINATE'].includes(serviceDetails.badge) &&
                                                        <p className="service-card badge badge-danger badge-pill m-0">Termination Requested</p>
                                                    }
                                                
                                            </div>
                                        </div>
                                        {
                                            /*(serviceDetails.realtime.activationDate) ?*/
                                            <div className="row">
                                                <div className="col-5">
                                                    <label className="col-form-label">Activation Date</label>
                                                </div>
                                                <div className="col-7">
                                                    <p className="pt-1">
                                                        {(serviceDetails.realtime && serviceDetails.realtime.activationDate) ? formatISODateDDMMMYY(serviceDetails.realtime.activationDate) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            /*    :
                                                <></>*/
                                        }
                                        {
                                            /*(serviceDetails.realtime.activationDate) ?*/
                                            <div className="row">
                                                <div className="col-5">
                                                    <label className="col-form-label">Expiry Date</label>
                                                </div>
                                                <div className="col-7">
                                                    <p className="pt-1">
                                                        {(serviceDetails.realtime && serviceDetails.realtime.expiryDate) ? formatISODateDDMMMYY(serviceDetails.realtime.expiryDate) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            /*    :
                                                <></>*/
                                        }
                                        {
                                            (serviceDetails && serviceDetails.realtimeLoaded) ?
                                                <></>
                                                :
                                                <></>
                                        }
                                    </>
                                    :
                                    <></>
                            }
                            {
                                serviceDetails.prodType === 'Fixed' ?
                                    <>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Service Type</label>
                                            </div>
                                            <div className="col-7 pt-1">{serviceDetails.prodType}</div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Plan</label>
                                            </div>
                                            <div className="col-7 pt-1"><p>{serviceDetails.planName}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Status</label>
                                            </div>
                                            <div className="col-7">
                                                <p className="pt-1">
                                                    {
                                                        (serviceDetails.realtime && serviceDetails.realtime.serviceStatus) ?
                                                            serviceDetails.realtime.serviceStatus
                                                            :
                                                            serviceDetails.status
                                                    }
                                                </p>
                                                    {
                                                        (serviceDetails.status === 'PENDING') ?
                                                            (serviceDetails.badge === 'BAR') ?
                                                                <p className="service-card badge badge-danger badge-pill m-0">BAR Initiated</p>
                                                                :
                                                                (serviceDetails.badge === 'UNBAR') ?
                                                                    <p className="service-card badge badge-danger badge-pill m-0">UNBAR Initiated</p>
                                                                    :
                                                                    (serviceDetails.badge === 'WONC' || serviceDetails.badge === 'WONC-ACCSER' || serviceDetails.badge === 'WONC-SER') ?
                                                                        <p className="service-card badge badge-info badge-pill m-0">New Connection</p>
                                                                        :
                                                                        ''
                                                            :
                                                            (serviceDetails.status === 'TOS') ?
                                                                <p className="ml-1 service-card badge badge-danger badge-pill m-0">Service Barred</p>
                                                                :
                                                                (serviceDetails.badge === 'UPGRADE') ?
                                                                    <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Upgrade in Progress</p>
                                                                    :
                                                                    (serviceDetails.badge === 'DOWNGRADE') ?
                                                                        <p className="ml-1 service-card badge badge-danger badge-pill m-0">Plan Downgrade in Progress</p>
                                                                        :
                                                                        <></>
                                                    }
                                                    {
                                                       ['TERMINATE'].includes(serviceDetails.badge) &&
                                                        <p className="service-card badge badge-danger badge-pill m-0">Termination Requested</p>
                                                    }
                                                
                                            </div>
                                        </div>
                                        {
                                            /*(serviceDetails.realtime.installationDate) ?*/
                                            <div className="row">
                                                <div className="col-5">
                                                    <label className="col-form-label">Installation Date</label>
                                                </div>
                                                <div className="col-7">
                                                    <p className="pt-1">
                                                        {(serviceDetails.realtime && serviceDetails.realtime.installationDate) ? formatISODateDDMMMYY(serviceDetails.realtime.installationDate) : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            /*    :
                                                <></>*/
                                        }
                                        {
                                            (serviceDetails && serviceDetails.realtimeLoaded) ?
                                                <div className="card-body p-0">
                                                    <table className="table table-hover table-centered table-nowrap mb-2">
                                                        <tbody>
                                                            {
                                                                /*(serviceDetails.realtime.outstandingAmount !== undefined) ?
                                                                    <tr>
                                                                        <td>Outstanding Amount</td>
                                                                        <td className="align-center"><i
                                                                            className="fas fas fa-dollar-sign fa-2x text-primary"></i>
                                                                        </td>
                                                                        <td>
                                                                            <div><a>{(serviceDetails.realtime.outstandingAmount) ? Number(serviceDetails.realtime.outstandingAmount).toFixed(2) : ''}</a></div>
                                                                        </td>
                                                                    </tr>
                                                                    :
                                                                    <></>*/
                                                            }
                                                            {
                                                                /*(serviceDetails.realtime.accumulatedUsage !== undefined && serviceDetails.realtime.usageLimit !== undefined) ?*/
                                                                <tr>
                                                                    <td>Data Balance</td>
                                                                    <td className="align-center"><i
                                                                        className="fas fa-wifi fa-2x text-primary"></i>
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            (serviceDetails?.realtime && serviceDetails?.realtime?.accumulatedUsage !== undefined && serviceDetails?.realtime?.usageLimit !== undefined) ?
                                                                                <div><a>{Number(serviceDetails?.realtime?.accumulatedUsage / (1024 * 1024 * 1024)).toFixed(1)} GB / {Number(serviceDetails?.realtime?.usageLimit / (1024 * 1024 * 1024)).toFixed(1)}</a>&nbsp;GB</div>
                                                                                :
                                                                                <div></div>
                                                                        }

                                                                    </td>
                                                                </tr>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </>
                                    :
                                    <></>
                            }

                        </div>
                    </div >
                    <div className="col-12 row justify-content-center popup-btn">
                        {
                            serviceDetails.status !== 'PENDING' &&
                            <button type="button" class="btn btn-sm btn-outline-primary text-primary" onClick={handleOnCreateServiceRequest}>
                                Create Service Request
                            </button>
                        }
                        {
                            ((serviceDetails && serviceDetails.realtimeLoaded) || idx === 0) ?
                                <div className="col-12 text-center p-1 ">
                                    <button type="button" className="btn btn btn-primary p-1"
                                        onClick={(e) => { handleServicePopupOpen(e, idx); setActiveService(serviceDetails.serviceId); setServiceStatus(serviceDetails.status); }}>Manage Services / VAS / Booster
                                    </button>
                                </div>
                                :
                                <div className="col-12  text-center p-1 ">
                                    <button type="button" className="btn btn btn-primary p-1"
                                        onClick={(e) => { handleLoadBalances(serviceDetails.serviceId); setActiveService(serviceDetails.serviceId); setServiceStatus(serviceDetails.status); }}>Load Balances
                                    </button>
                                </div>
                        }
                    </div>
                </div >
            </div >
        </div >

    )

}
export default ServiceCard;



