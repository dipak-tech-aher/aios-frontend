import React, { useState, useRef, useEffect } from 'react'
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";
import { formatISODateDDMMMYY } from '../util/dateUtil'

const ManageVAS = (props) => {

    const [renderState, setRenderState] = useState({ newVAS: 'hide' })

    const [currentVAS, setCurrentVAS] = useState([])

    const [refreshCurrentVAS, setRefreshCurrentVAS] = useState(false)

    const newVAS = useRef([])

    const [selectedVAS, setSelectedVAS] = useState([])

    const [selectedActiveVAS, setSelectedActiveVAS] = useState([])
    const setRefreshPage = props.setRefreshPage
    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails
    const handleServicePopupClose = props.handleServicePopupClose
    useEffect(() => {
        if (serviceDetails && serviceDetails.serviceId !== undefined) {
            showSpinner();
            get(properties.VAS_API + '/' + selectedAccount.customerId + '?account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
                .then((resp) => {
                    if (resp && resp.data) {
                        let cVAS = []
                        for (let t of resp.data) {
                            if (serviceDetails.realtime.offers && serviceDetails.realtime.offers.length > 0) {
                                let found = false
                                for (let o of t.offers) {
                                    for (let r of serviceDetails.realtime.offers) {
                                        if (o.offerId === r.offerId) {
                                            t.startDate = r.startDate
                                            t.expiryDate = r.expiryDate
                                            found = true
                                            break
                                        }
                                    }
                                    if (found) {
                                        break
                                    }
                                }
                            }
                            cVAS.push(t)
                        }
                        setCurrentVAS(cVAS)
                        setRefreshCurrentVAS(false)
                    } else {
                        toast.error("Failed to fetch current VAS Details - " + resp.status);
                    }
                }).finally(hideSpinner);
        }
    }, [refreshCurrentVAS]);

    // const [upgradePlanList, setUpgradePlanList] = useState({})
    // const [actionState, setActionState] = useState({ dataFetch: false, submitSuccess: false, intxnId: undefined })
    // const [selectedPlan, setSelectedPlan] = useState({})
    // const [inlineSpinnerData, setInlineSpinnerData] = useState({ state: false, message: '' })


    const handleVASDeactivateClick = () => {

    }

    const handleVASActivateClick = () => {
        fetchAvailableVAS()
    }

    const fetchAvailableVAS = () => {
        showSpinner();
        get(properties.PLANS_API + '?plantype=VAS&prodtype=' + serviceDetails.prodType)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    if (resp.data.length > 0) {
                        const lst = []
                        for (let p1 of resp.data) {
                            let found = false
                            for (let p2 of currentVAS) {
                                if (p1.planId === p2.planId) {
                                    found = true
                                    break
                                }
                            }
                            if (!found) {
                                lst.push(p1)
                            }
                        }
                        newVAS.current = lst
                        setRenderState({ ...renderState, newVAS: 'show' })
                    } else {
                        toast.error("No VAS available at this moment");
                    }
                } else {
                    if (resp && resp.status) {
                        toast.error("Error fetching VAS - " + resp.status + ', ' + resp.message);
                    } else {
                        toast.error("Unexpected error fetching VAS");
                    }
                }
            }).finally(hideSpinner);
    }

    // useEffect(() => {
    //     setInlineSpinnerData({ state: true, message: 'Loading plans...please wait...' })
    //     if (serviceDetails) {
    //         get(properties.PLAN_UPGRADE_API + '?customer-id=' + selectedAccount.customerId
    //             + '&' + 'account-id=' + selectedAccount.accountId
    //             + '&' + 'service-id=' + serviceDetails.serviceId)
    //             .then((resp) => {
    //                 if (resp && resp.data) {
    //                     setUpgradePlanList(resp.data)
    //                     setActionState({ ...actionState, dataFetch: true })
    //                 } else {
    //                     toast.error("Failed to fetch Plans available for upgrade - " + resp.status);
    //                 }
    //                 setInlineSpinnerData({ state: false, message: '' })
    //             }).finally();
    //     }
    // }, []);

    const handleCancelVAS = () => {
        setRenderState({ ...renderState, newVAS: 'hide' })
    }

    const handleSubmitVAS = () => {
        if (!selectedVAS || !selectedVAS.length > 0) {
            toast.error("Please select one or more VAS to proceed");
        } else {
            showSpinner();
            post(properties.CREATE_VAS_API, {
                customerId: selectedAccount.customerId,
                accountId: selectedAccount.accountId,
                serviceId: serviceDetails.serviceId,
                vas: selectedVAS
            })
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            toast.success('Initiated Service Request - ' + resp.data.intxnId + ' for VAS Activation')
                            newVAS.current = null
                            setRenderState({ ...renderState, newVAS: 'hide' })
                            setRefreshCurrentVAS(true)
                            handleServicePopupClose()
                            //window.location.reload(false)
                            setRefreshPage((prevState) => (!prevState))
                        } else {
                            toast.error("Failed to process VAS Activation Request - " + resp.status + ' - ' + resp.message);
                        }
                    } else {
                        toast.error("Uexpected error ocurred " + resp.statusCode);
                    }
                }).finally(hideSpinner);
        }
    }

    return (
        <div>
            <div className="row">
                <div className="col-6">
                    <h5>Active/Pending to be activated Value Added Services</h5>
                </div>
                <div className="col-6 text-right">
                    {
                        (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge))?
                            <>
                                <button className="btn btn-sm btn-primary" type="button" onClick={handleVASActivateClick}>
                                    <i className="mr-1 fas fa-shopping-cart"></i>Activate VAS
                                </button>
                                <button className="ml-2 btn btn-sm btn-primary" type="button" onClick={handleVASDeactivateClick}>
                                    <i className="mr-1 fas fa-shopping-cart"></i>De-Activate Selected VAS
                                </button>
                            </>
                            :
                            <>
                                <button disabled="disabled" className="btn btn-sm btn-primary" type="button">
                                    <i className="mr-1 fas fa-shopping-cart"></i>Activate VAS
                                </button>
                                <button disabled="disabled" className="btn btn-sm btn-primary" type="button">
                                    <i className="mr-1 fas fa-shopping-cart"></i>De-Activate Selected VAS
                                </button>
                            </>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-12  row">
                    {
                        (currentVAS && currentVAS.length > 0) ?
                            currentVAS.map((t) => {
                                return (
                                    <div className="col-4">
                                        <div className="card-header">
                                            <div className="row">
                                                <div className="col-10">
                                                    <div className="text-center">
                                                        <h5 className="p-0 m-0">{t.planName}</h5>
                                                    </div>
                                                </div>
                                                <div className="col-2">
                                                    <label className="vas checkbox" htmlFor={t.planId + ""}>
                                                        <input type="checkbox" id={t.planId + ""} className="form-check-input" name="optActiveVAS" value={t.planId}
                                                            onChange={(p) => {
                                                                setSelectedActiveVAS((prevState) => {
                                                                    let lst
                                                                    if (p.target.checked) {
                                                                        let found = false
                                                                        if (prevState.length > 0) {
                                                                            lst = prevState.map((l) => {
                                                                                if (l.planId === p.target.value) {
                                                                                    found = true
                                                                                }
                                                                                return l
                                                                            })
                                                                        }
                                                                        if (!found) {
                                                                            if (!lst) {
                                                                                lst = []
                                                                            }
                                                                            lst.push({ planId: p.target.value })
                                                                        }
                                                                    } else {
                                                                        if (!lst) {
                                                                            lst = []
                                                                        }
                                                                        for (let l of prevState) {
                                                                            if (l.planId != p.target.value) {
                                                                                lst.push(l)
                                                                            }
                                                                        }
                                                                    }
                                                                    return lst
                                                                })
                                                            }
                                                            }
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body border bg-white" style={{ minHeight: "255px" }}>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p>Status</p>
                                                </div>
                                                <div className="col-6">
                                                    <p>{t.status}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p>Start Date</p>
                                                </div>
                                                <div className="col-6">
                                                    <p>{(t.startDate) ? formatISODateDDMMMYY(t.startDate) : '-'}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p>Expiry Date</p>
                                                </div>
                                                <div className="col-6">
                                                    <p>{(t.expiryDate) ? formatISODateDDMMMYY(t.expiryDate) : '-'}</p>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-6 mt-auto">
                                                    <p>Charges</p>
                                                </div>
                                                <div className="col-6">
                                                    <h4 className="text-dark">${(t.charge) ? Number(t.charge).toFixed(2) : ''}</h4>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            :
                            <p className="ml-2">No active Value Added Services yet.</p>
                    }
                </div>
            </div>
            {
                (renderState.newVAS === 'show') ?
                    <>
                        <div className="row">
                            <div className="col-12">
                                <div className="card border p-2 col-lg-12 mt-2">
                                    <div className="row align-items-center">
                                        <div className="col-7">
                                            <div className="text-left">
                                                <h5>Add New Value Added Services</h5>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="row mt-2">
                                        {
                                            (newVAS && newVAS.current && newVAS.current.length > 0) ?
                                                newVAS.current.map((e) => {
                                                    return (
                                                        <div key={e.planId} className="col-lg-3 mb-2">
                                                            <div className="card-body border p-0 box-card">
                                                                <div className=" row col-12 card-header">
                                                                    <div className="col-10">
                                                                        <h5>{e.planName}</h5>
                                                                    </div>
                                                                    <div className="col-2 mt-1">
                                                                        <label className="vas checkbox" htmlFor={e.planId + ""}>
                                                                            <input type="checkbox" id={e.planId + ""} className="form-check-input" name="optVAS" value={e.planId}
                                                                                onChange={(p) => {
                                                                                    setSelectedVAS((prevState) => {
                                                                                        let lst
                                                                                        if (p.target.checked) {
                                                                                            let found = false
                                                                                            if (prevState.length > 0) {
                                                                                                lst = prevState.map((l) => {
                                                                                                    if (l.planId === p.target.value) {
                                                                                                        found = true
                                                                                                    }
                                                                                                    return l
                                                                                                })
                                                                                            }
                                                                                            if (!found) {
                                                                                                if (!lst) {
                                                                                                    lst = []
                                                                                                }
                                                                                                lst.push({ planId: p.target.value })
                                                                                            }
                                                                                        } else {
                                                                                            if (!lst) {
                                                                                                lst = []
                                                                                            }
                                                                                            for (let l of prevState) {
                                                                                                if (l.planId != p.target.value) {
                                                                                                    lst.push(l)
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        return lst
                                                                                    })
                                                                                }
                                                                                }
                                                                            />
                                                                            <span className="checkmark"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="text-center pt-1">
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p>Quota</p>
                                                                        </div>
                                                                        {
                                                                            (e.planoffer && e.planoffer.length > 0) ?
                                                                                <div className="col-6">
                                                                                    <p>{e.planoffer[0].quota} {e.planoffer[0].units}</p>
                                                                                </div>
                                                                                :
                                                                                <></>

                                                                        }
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6">
                                                                            <p>Validity</p>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <p>{e.validity}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-6 mt-auto">
                                                                            <p>Charges</p>
                                                                        </div>
                                                                        <div className="col-6">
                                                                            <h3 className="text-dark">${e.charge}</h3>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                                :
                                                <></>
                                        }
                                    </div>

                                </div>
                                <div className="clearfix col-7 mr-0 pr-0 mt-2">
                                    <button className="btn btn-primary text-center float-right ml-2 mr-2" onClick={handleSubmitVAS}>Submit Selected</button>
                                    <button className="btn btn-secondary text-center float-right" onClick={handleCancelVAS}>Cancel</button>
                                </div>
                                <br></br>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </div>
    )
}
export default ManageVAS;