import React, { useEffect, useRef, useState } from 'react';
import BarUnBarPopUpView from './barUnBarPopUpView'
import { formatISODateDDMMMYY } from '../util/dateUtil'
import InstallationAddressView from '../customer/addressPreview'

const ServiceDetails = (props) => {

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails
    const realtimeDetails = serviceDetails.realtime
    const installationAddress = serviceDetails.installationAddress[0]
    const handleServicePopupClose = props.handler.handleServicePopupClose
    const setServicesList = props.handler.setServicesList
    const setRefreshPage = props.handler.setRefreshPage
    const barUnbarRef = useRef(null);

    const containerRef = useRef(null);

    const setRefreshServiceList = props.handler.setRefreshServiceList

    const connectionStatusLookup = props.data.connectionStatusLookup

    const [show, setShow] = useState(false);

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
        return false;
        event.nativeEvent.stopImmediatePropagation();
        if(['TERMINATE'].includes(serviceDetails.badge))
        {
            return false;
        }
        setShow(!show);
    };

    const closePopUp = (event) => {
        setShow(!show);
    };

    return (
        <div className="row p-0 card border service-pop">
            <div className="p-0">
                <section className="triangle col-12 pb-2">
                    <div className="row col-12">
                        <h5 id="list-item-2" className="pl-1">Service Details</h5>
                    </div>
                </section>
                <div className="col-12">
                    <div className="container-fluid p-0">
                        <div className="pt-2">
                            <div className="row col-12">
                                <div className="col-md-3">
                                    <div className="form-group  p-0 m-0">
                                        <label htmlFor="inputName" className="col-form-label">Service Number</label>
                                        <p>
                                            {
                                                ((serviceDetails.accessNbr === 0 || serviceDetails.accessNbr === undefined)) ?
                                                    (serviceDetails.status === 'PENDING') ?
                                                        'Pending'
                                                        :
                                                        serviceDetails.accessNbr
                                                    :
                                                    serviceDetails.accessNbr
                                            }
                                        </p>
                                    </div>

                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Service Type</label>
                                        <p>{serviceDetails.prodType}</p>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Network Type</label>
                                        <p>{serviceDetails.networkType}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <span htmlFor="inputState" className="col-form-label">CRM Status &nbsp;</span>
                                    {
                                        (serviceDetails.status === 'ACTIVE' || serviceDetails.status === 'TOS') ?
                                            <>
                                                {
                                                    (realtimeDetails.connectionStatus) ?
                                                        <span id="active-status">
                                                            <span ref={containerRef} className="badge badge-outline-success font-17" onClick={handleClick}>
                                                                {
                                                                    connectionStatusLookup.map((cs) => {
                                                                        if (cs.code === realtimeDetails.connectionStatus) {
                                                                            return cs.description
                                                                        }
                                                                    })
                                                                }
                                                                &nbsp;<i className="ml-0  font-18 text-primary mdi mdi-arrow-down-drop-circle-outline"></i>
                                                            </span>
                                                            <span ref={barUnbarRef}></span>
                                                        </span>
                                                        :
                                                        <></>
                                                }

                                                <BarUnBarPopUpView data={{
                                                    selectedAccount: selectedAccount,
                                                    serviceDetails: serviceDetails,
                                                    show: show,
                                                    target: barUnbarRef,
                                                    containerRef: containerRef
                                                }}
                                                    handler={{
                                                        closePopUp: closePopUp,
                                                        setServicesList: setServicesList,
                                                        setRefreshServiceList: setRefreshServiceList,
                                                        handleServicePopupClose:handleServicePopupClose,
                                                        setRefreshPage: setRefreshPage
                                                    }}
                                                />
                                            </>
                                            :
                                            (realtimeDetails.connectionStatus) ?
                                                <span id="active-status">
                                                    <span className="badge badge-outline-success font-17">
                                                        {
                                                            connectionStatusLookup.map((cs) => {
                                                                if (cs.code === realtimeDetails.connectionStatus) {
                                                                    return cs.description
                                                                }
                                                            })
                                                        }
                                                    </span>
                                                </span>
                                                :
                                                <></>
                                    }
                                    {
                                        (serviceDetails.status === 'PENDING') ?
                                            (serviceDetails.badge === 'BAR') ?
                                                <span className="ml-1 service-card badge badge-danger badge-pill">BAR Initiated</span>
                                                :
                                                (serviceDetails.badge === 'UNBAR') ?
                                                    <span className="ml-1 service-card badge badge-danger badge-pill">UNBAR Initiated</span>
                                                    :
                                                    (serviceDetails.badge === 'WONC' || serviceDetails.badge === 'WONC-ACCSER' || serviceDetails.badge === 'WONC-SER') ?
                                                        <span className="ml-1 service-card badge badge-info badge-pill">New Connection</span>
                                                        :
                                                        ''
                                            :
                                            (serviceDetails.status === 'TOS') ?
                                                <span className="ml-1 service-card badge badge-danger badge-pill">Service Barred</span>
                                                :
                                                <></>
                                    }
                                    <p>
                                        <span htmlFor="inputState" className="col-form-label">UNN Status&nbsp;&nbsp;</span>
                                        {
                                            (realtimeDetails.serviceStatus) ?
                                                <span className="mt-1 badge badge-outline-success font-17">&nbsp;&nbsp;{realtimeDetails.serviceStatus}&nbsp;&nbsp;</span>
                                                :
                                                <></>
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row col-12 p-0">
                                <div className="col-12 pl-2 bg-light border">
                                    <h5 className="text-primary">Plan Details</h5>
                                </div>
                            </div>
                            <div className="row col-12">
                                <div className="col-md-6">
                                    <div className="form-group  p-0 m-0">
                                        <label htmlFor="inputName" className="col-form-label">Plan Name</label>
                                        <p>{serviceDetails.planName}</p>
                                    </div>
                                </div>
                                {
                                    /*(realtimeDetails.activationDate && realtimeDetails.activationDate !== '')?*/
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Start Date</label>
                                            <p>{(realtimeDetails.activationDate) ? formatISODateDDMMMYY(realtimeDetails.aZctivationDate) : ''}</p>
                                        </div>
                                    </div>
                                    /*    :
                                        <></>*/

                                }
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Service Rental</label>
                                        <p>{serviceDetails.charge} /month</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row col-12 p-0">
                            <div className="col-12 pl-2">
                                <h5>Main Balance</h5>
                            </div>
                        </div>
                        <div className="row col-12">
                            <div className="col-md-8">
                                <div className="mt-1 table-responsive">
                                    <table className="table border">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="text-center">Type</th>
                                                <th className="text-center">Quota</th>
                                                <th className="text-center">Usage</th>
                                                <th className="text-center">Balance</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                serviceDetails.plans.map((p) => {
                                                    return (
                                                        p.offers.map((o) => {
                                                            return (
                                                                <tr>
                                                                    <td className="text-center bold">{o.offerType}</td>
                                                                    <td className="text-center">{o.quota} {o.units}</td>
                                                                    {
                                                                        (realtimeDetails.accumulatedUsage) ?
                                                                            <td className="text-center">{realtimeDetails.accumulatedUsage} {o.units}</td>
                                                                            :
                                                                            <td className="text-center">NA</td>
                                                                    }
                                                                    {
                                                                        (o.quota && realtimeDetails.accumulatedUsage) ?
                                                                            <td className="text-center">{o.quota - realtimeDetails.accumulatedUsage} {o.units}</td>
                                                                            :
                                                                            <td className="text-center">NA</td>
                                                                    }
                                                                </tr>
                                                            )
                                                        })
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="col-3 align-self-center d-none">
                                <button type="button" className="btn btn-sm btn-primary" data-toggle="modal" data-target="#summary-modal">Summary Usage</button>
                            </div>
                        </div>

                        <div className="row col-12 p-1">
                            <div className="col-12">
                                {
                                    (installationAddress) ?
                                        <div className="col-12 pt-1">
                                            <InstallationAddressView
                                                data={{
                                                    title: "installation_address",
                                                    addressData: installationAddress
                                                }}
                                            />
                                        </div>
                                        :
                                        <></>
                                }
                            </div>
                        </div>

                        <div className="row col-12 p-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Service Property</h5>
                            </div>
                        </div>
                        <div className="row col-12">
                            {
                                (realtimeDetails.installationDate) ?
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Installation Date</label>
                                            <p>{formatISODateDDMMMYY(realtimeDetails.installationDate)}</p>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Credit Limit</label>
                                    <p>{"TBD"}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Portin</label>
                                    <p>{(serviceDetails.isPorted === 'Y') ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Donor</label>
                                    <p>{(serviceDetails.donor) ? serviceDetails.donor : ''}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Number Group</label>
                                    <p>{serviceDetails.fixed.serviceNbrGroupDesc}</p>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >
        </div >
    )
}
export default ServiceDetails;