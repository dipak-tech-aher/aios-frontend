import React, { useState, useRef, useEffect } from 'react'
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import InlineSpinner from '../common/inline-spinner'
import { showSpinner, hideSpinner } from "../common/spinner";

const PlanUpgrade = (props) => {

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails

    const [pendingPlanList, setPendingPlanList] = useState({})
    const [refreshPendingPlans, setRefreshPendingPlans] = useState(false)
    const [upgradePlanList, setUpgradePlanList] = useState({})
    const [actionState, setActionState] = useState({ dataFetch: false, submitSuccess: false, intxnId: undefined })
    const [selectedPlan, setSelectedPlan] = useState({})
    const [inlineSpinnerData, setInlineSpinnerData] = useState({ state: false, message: '' })

    useEffect(() => {
        //setInlineSpinnerData({state: true, message: 'Loading plans...please wait...'})
        showSpinner();
        if (serviceDetails) {
            get(properties.PENDING_PLANS_API + '/' + selectedAccount.customerId
                + '?' + 'account-id=' + selectedAccount.accountId
                + '&' + 'service-id=' + serviceDetails.serviceId)
                .then((resp) => {
                    if (resp && resp.data && resp.status === 200) {
                        setPendingPlanList(resp.data)
                        setRefreshPendingPlans(false)
                    } else {
                        toast.error("Failed to fetch pending plans - " + resp.statusCode);
                    }
                }).finally(hideSpinner);
        }
    }, [refreshPendingPlans]);

    useEffect(() => {
        //setInlineSpinnerData({state: true, message: 'Loading plans...please wait...'})
        showSpinner();
        if (serviceDetails) {
            get(properties.PLAN_UPGRADE_API + '?customer-id=' + selectedAccount.customerId
                + '&' + 'account-id=' + selectedAccount.accountId
                + '&' + 'service-id=' + serviceDetails.serviceId)
                .then((resp) => {
                    if (resp && resp.data) {
                        setUpgradePlanList(resp.data)
                        setActionState({ ...actionState, dataFetch: true })
                    } else {
                        toast.error("Failed to fetch Plans available for upgrade - " + resp.status);
                    }
                    //setInlineSpinnerData({ state: false, message: '' })
                }).finally(hideSpinner);
        }
    }, []);

    const handleSubmit = () => {
        if (!selectedPlan.planId || selectedPlan.planId === '') {
            toast.error("Please select a plan to proceed");
        } else {
            //setInlineSpinnerData({state: true, message: 'Submitting request...please wait...'})
            showSpinner();
            post(properties.PLAN_UPGRADE_API, {
                customerId: selectedAccount.customerId,
                accountId: selectedAccount.accountId,
                serviceId: serviceDetails.serviceId,
                upgrade: [{
                    planId: selectedPlan.planId
                }]
            })
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            toast.success('Service Request ' + resp.data[0].service.intxnId + ' submitted for processing plan upgrade')
                            setActionState({ ...actionState, submitSuccess: true, intxnId: resp.data[0].service.intxnId })
                            setRefreshPendingPlans(true)
                        } else {
                            toast.error("Failed to initiate plan upgrade request - " + resp.status + ' - ' + resp.message);
                        }
                    } else {
                        toast.error("Uexpected error ocurred " + resp.statusCode);
                    }
                    setInlineSpinnerData({ state: false, message: '' })
                }).finally(hideSpinner);
        }
    }

    return (
        <div className="card border p-0">
            {
                (pendingPlanList && pendingPlanList.length > 0) ?
                    <>
                        <div>
                            <section className="triangle col-12 p-0">
                                <div className="row col-12">
                                    <h5 id="list-item-2" className="pl-1">Upgrade Pending</h5>
                                </div>
                            </section>
                        </div>

                        <div className="row mt-2 pt-2 pb-2 pl-2" style={{ "overflow-y": "auto" }}>
                            {
                                pendingPlanList.map((e) => {
                                    return (
                                        <div className="col-lg-4 mb-2">
                                            <div className="card border-grey pt-2">
                                                <h5 className="text-center">{e.status}</h5>
                                                <hr className="darkline pt-1" />
                                                <div className="card-body">
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <p></p>
                                                            <h5 className="text-center">{e.planName}</h5>
                                                            <p></p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            {
                                                                (e.offers && e.offers.length > 0) ?
                                                                    e.offers.map((o) => {
                                                                        return (
                                                                            <p className="text-center">{o.quota} {o.units} {o.offerType}</p>
                                                                        )
                                                                    })
                                                                    :
                                                                    <p className="text-center">No offers listed</p>
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-12">
                                                            <p className="text-center" style={{ color: "red" }}>* (12 or 24 months contract)</p>
                                                        </div>
                                                    </div>

                                                    <div className="row">
                                                        <div className="col-12 mt-2">
                                                            <div className="text-center">
                                                                Service Rental <span className="bold font-20 pl-1 text-primary">${(!isNaN(e.charge) ? Number(e.charge).toFixed(2) : e.charge)}*</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                })
                            }
                        </div>
                    </>
                    :
                    <></>
            }
            <div>
                <section className="triangle col-12 p-0">
                    <div className="row col-12">
                        <h5 id="list-item-2" className="pl-1">Plan Upgrade</h5>
                    </div>
                </section>
            </div>

            <div className="row mt-2 pt-2 pb-2 pl-2" style={{ "height": "75vh", "overflow-y": "auto" }}>

                {/*
                (actionState.submitSuccess) ?
                    <span>Service Request <b>{actionState.intxnId}</b> has been submitted and processing will be initiated. Please check the request status for further updates.</span>
                    :
                    <></>
            */}
                {
                    (actionState.dataFetch && (1 === 1 || !actionState.submitSuccess)) ?
                        <>
                            {
                                (upgradePlanList && upgradePlanList.length > 0) ?
                                    upgradePlanList.map((e) => {
                                        return (
                                            <div className="col-lg-4 mb-2">
                                                <div className="card border-grey pt-2">
                                                    <div className="custom-control custom-radio align-self-center pb-1">
                                                        <input disabled={(pendingPlanList && (pendingPlanList.length > 0)) ? "disabled" : ""} type="radio" id={e.planId + ""} name="plan" className="custom-control-input"
                                                            value={e.planId}
                                                            onChange={(e) => {
                                                                setSelectedPlan({ planId: e.target.value })
                                                            }
                                                            }
                                                        />
                                                        <label className="custom-control-label" htmlFor={e.planId}>Select</label>
                                                    </div>
                                                    <hr className="darkline pt-1" />
                                                    <div className="card-body">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <p></p>
                                                                <h5 className="text-center">{e.planName}</h5>
                                                                <p></p>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                {
                                                                    (e.offers && e.offers.length > 0) ?
                                                                        e.offers.map((o) => {
                                                                            return (
                                                                                <p className="text-center">{o.quota} {o.units} {o.offerType}</p>
                                                                            )
                                                                        })
                                                                        :
                                                                        <p className="text-center">No offers listed</p>
                                                                }
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <p className="text-center" style={{ color: "red" }}>* (12 or 24 months contract)</p>
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-12 mt-2">
                                                                <div className="text-center">
                                                                    Service Rental <span className="bold font-20 pl-1 text-primary">${(!isNaN(e.charge) ? Number(e.charge).toFixed(2) : e.charge)}*</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        )
                                    })
                                    :
                                    <p>No Plans available for Upgrade </p>
                            }
                        </>
                        :
                        <></>
                }
                {
                    (inlineSpinnerData.state) ?
                        <>
                            <InlineSpinner data={inlineSpinnerData.message} />
                        </>
                        :
                        <></>
                }
            </div>
            {
                (actionState.dataFetch && !actionState.submitSuccess && upgradePlanList && upgradePlanList.length > 0) ?
                    <div className="border-top">
                        <div className="mt-3 d-flex justify-content-center">
                            <button type="button" className="btn btn-primary"
                                onClick={handleSubmit}>Upgrade to selected Plan
                            </button>
                        </div>
                    </div>
                    :
                    <></>

            }
        </div>
    )
}
export default PlanUpgrade;