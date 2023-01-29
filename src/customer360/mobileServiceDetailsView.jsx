import React, { useEffect, useRef, useState } from 'react';
import BarUnBarPopUpView from './barUnBarPopUpView'
import { formatISODateDDMMMYY } from '../util/dateUtil'

const ServiceDetails = (props) => {

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails
    const realtimeDetails = serviceDetails.realtime
    const setServicesList = props.handler.setServicesList

    const setRefreshServiceList = props.handler.setRefreshServiceList
    const setRefreshPage = props.handler.setRefreshPage
    const connectionStatusLookup = props.data.connectionStatusLookup

    const barUnbarRef = useRef(null);

    const containerRef = useRef(null);

    const [show, setShow] = useState(false);

    const handleServicePopupClose = props.handler.handleServicePopupClose

    const handleClick = (event) => {
        event.preventDefault()
        event.stopPropagation()
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
        <div className="row p-0 card border">
            <section className="triangle col-12">
                <div className="row col-12">
                    <h4 id="list-item-2" className="pl-1">Service Details</h4>
                </div>
            </section>
            <div className="col-12">
                <div className="container-fluid p-0">
                    <div className="row pt-2">
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
                            <div className="col-md-2">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Service Type</label>
                                    <p>{serviceDetails.prodType}</p>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    {
                                        /*(realtimeDetails.mainBalance)?*/
                                        <>
                                            <label htmlFor="inputState" className="col-form-label">Balance Credit</label>
                                            {
                                                (realtimeDetails && realtimeDetails.mainBalance !== undefined && !isNaN(realtimeDetails.mainBalance)) ?
                                                    (Number(realtimeDetails.mainBalance) >= 0) ?
                                                        <p className="text-success">${Number(realtimeDetails.mainBalance).toFixed(2)}</p>
                                                        :
                                                        <p className="text-danger">${Number(realtimeDetails.mainBalance).toFixed(2)}</p>
                                                    :
                                                    <></>

                                            }
                                        </>
                                        /*    :
                                            <></>*/
                                    }
                                </div>
                            </div>

                            <div className="col-md-5">
                                <span htmlFor="inputState" className="col-form-label">CRM Status &nbsp;</span>
                                {
                                    ((serviceDetails.status === 'ACTIVE' || serviceDetails.status === 'TOS') && serviceDetails.prodType==='Prepaid') ?
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
                                            {
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

                                            }
                                        </>
                                        :
                                        (realtimeDetails.connectionStatus) ?
                                            <span id="active-status">
                                                <span data-toggle="dropdown" className="badge badge-outline-success font-17">
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
                                {
                                    /*(realtimeDetails.serviceStatus)?*/
                                    <>
                                        <p>
                                            <span htmlFor="inputState" className="mt-1 col-form-label">UNN Status&nbsp;&nbsp;</span>
                                            {
                                                (realtimeDetails.serviceStatus) ?
                                                    <span className="mt-1 badge badge-outline-success font-17">&nbsp;&nbsp;{realtimeDetails.serviceStatus}&nbsp;&nbsp;</span>
                                                    :
                                                    <></>
                                            }
                                        </p>
                                    </>
                                    /*    :
                                        <></>*/
                                }
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    {
                                        /*(realtimeDetails.mainBalance)?*/
                                        <>
                                            <label htmlFor="inputState" className="col-form-label">Activation Date</label>
                                            <p>{(realtimeDetails.activationDate) ? formatISODateDDMMMYY(realtimeDetails.activationDate) : ''}</p>
                                        </>
                                        /*    :
                                            <></>*/
                                    }
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    {
                                        /*(realtimeDetails.mainBalance)?*/
                                        <>
                                            <label htmlFor="inputState" className="col-form-label">Expiry Date</label>
                                            <p>{(realtimeDetails.expiryDate) ? formatISODateDDMMMYY(realtimeDetails.expiryDate) : ''}</p>
                                        </>
                                        /*    :
                                            <></>*/
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 padd-space">
                            <div className="row col-12 p-0">
                                <div className="col-12 pl-2 bg-light border">
                                    <h5 className="text-primary">SIM Details</h5>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label">ICCID</label>
                                <p>{serviceDetails.mobile.gsm.iccid}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label">IMSI</label>
                                <p>{serviceDetails.mobile.gsm.imsi}</p>
                            </div>
                        </div>
                        {
                            /*(realtimeDetails.pin && realtimeDetails.pin != '')?*/
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">PIN</label>
                                    <p>{(realtimeDetails.pin) ? realtimeDetails.pin : ''}</p>
                                </div>
                            </div>
                            /*    :
                                <></>*/
                        }
                        {
                            /*(realtimeDetails.puk && realtimeDetails.puk != '')?*/
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">PUK</label>
                                    <p>{(realtimeDetails.puk) ? realtimeDetails.puk : ''}</p>
                                </div>
                            </div>
                            /*    :
                                <></>*/
                        }
                        {
                            /*(realtimeDetails.pin2 && realtimeDetails.pin2 != '')?*/
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">PIN2</label>
                                    <p>{(realtimeDetails.pin2) ? realtimeDetails.pin2 : ''}</p>
                                </div>
                            </div>
                            /*    :
                                <></>*/
                        }
                        {
                            /*(realtimeDetails.puk2 && realtimeDetails.puk2 != '')?*/
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">PUK2</label>
                                    <p>{(realtimeDetails.puk2) ? realtimeDetails.puk2 : ''}</p>
                                </div>
                            </div>
                            /*    :
                                <></>*/
                        }
                        {
                            /*(realtimeDetails.adm1 && realtimeDetails.adm1 != '')?*/
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">ADM1</label>
                                    <p>{(realtimeDetails.adm1) ? realtimeDetails.adm1 : ''}</p>
                                </div>
                            </div>
                            /*    :
                                <></>*/
                        }
                        <div className="col-md-12 padd-space">
                            <div className="row col-12 p-0">
                                <div className="col-12 pl-2 bg-light border">
                                    <h5 className="text-primary">Plan Details</h5>
                                </div>
                            </div>
                        </div>
                        <div className="row col-12">
                            <div className="col-md-3">
                                <div className="form-group  p-0 m-0">
                                    <label htmlFor="inputName" className="col-form-label">Plan Name</label>
                                    <p>{serviceDetails.planName}</p>
                                </div>
                            </div>
                            {
                                /*(realtimeDetails.activationDate && realtimeDetails.activationDate != '')?*/
                                <div className="col-md-3">
                                    <div className="form-group  p-0 m-0">
                                        <label htmlFor="inputName" className="col-form-label">Start Date</label>
                                        <p>{(realtimeDetails.activationDate) ? formatISODateDDMMMYY(realtimeDetails.activationDate) : ''}</p>
                                    </div>
                                </div>
                                /*    :
                                    <></>*/
                            }
                            {
                                (serviceDetails.prodType === 'Postpaid') ?
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Service Rental</label>
                                            <p>{serviceDetails.charge} /month</p>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                    </div >
                    {
                        (serviceDetails && serviceDetails.prodType && serviceDetails.prodType === 'Prepaid') ?
                            <>
                                <div className="row col-12 p-0">
                                    <div className="col-12 pl-2">
                                        <h5>Main Balance</h5>
                                    </div>
                                </div>
                                <div className="row col-12 pb-1">
                                    <div className="col-md-6">
                                        <div className="mt-1 table-responsive">
                                            <table className="table border">

                                                <thead>
                                                    <tr className="bg-light">
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
                                                                        (realtimeDetails && realtimeDetails.offers && realtimeDetails.offers.length > 0) ?
                                                                            realtimeDetails.offers.map((ro, idx) => {
                                                                                return (
                                                                                    (Number(o.offerId) === Number(ro.offerId)) ?
                                                                                        <tr key={idx}>
                                                                                            <td className="text-center bold">{o.offerType}</td>
                                                                                            <td className="text-center">{o.quota} {o.units}</td>
                                                                                            {
                                                                                                (ro.value !== undefined && !isNaN(ro.value) && o.quota !== undefined && !isNaN(o.quota)) ?
                                                                                                    (o.offerType === 'Data') ?
                                                                                                        <td className="text-center">{Number(o.quota - ro.value / (1024 * 1024 * 1024)).toFixed(1)} {o.units}</td>
                                                                                                        :
                                                                                                        <td className="text-center">{o.quota - ro.value} {o.units}</td>
                                                                                                    :
                                                                                                    <td>&nbsp;</td>
                                                                                            }
                                                                                            {
                                                                                                (ro.value !== undefined && !isNaN(ro.value)) ?
                                                                                                    (o.offerType === 'Data') ?
                                                                                                        <td className="text-center">{Number(ro.value / (1024 * 1024 * 1024)).toFixed(1)} {o.units}</td>
                                                                                                        :
                                                                                                        <td className="text-center">{ro.value} {o.units}</td>
                                                                                                    :
                                                                                                    <td>&nbsp;</td>
                                                                                            }
                                                                                        </tr>
                                                                                        :
                                                                                        <></>
                                                                                )
                                                                            })
                                                                            :
                                                                            <tr>
                                                                                <td className="text-center bold">{o.offerType}</td>
                                                                                <td className="text-center">{o.quota} {o.units}</td>
                                                                                <td className="text-center">-</td>
                                                                                <td className="text-center">-</td>
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
                                </div>
                            </>
                            :
                            <></>
                    }

                    <div className="row col-12 p-0">
                        <div className="col-12 pl-2 bg-light border">
                            <h5 className="text-primary">Service Property</h5>
                        </div>
                    </div>
                    <div className="row col-12">
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
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label">Contract</label>
                                <p>TBD</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="inputState" className="col-form-label">Number Group</label>
                                <p>{serviceDetails.mobile.nbrGroupDesc}</p>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    )
}
export default ServiceDetails;