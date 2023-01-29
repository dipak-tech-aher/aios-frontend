import React, { useState, useRef, useEffect } from 'react'
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";
import { formatISODateDDMMMYY } from '../util/dateUtil'
import PurchaseHistoryTable from './purchaseHistoryTable'
import { render, unstable_batchedUpdates } from 'react-dom';

const ManageBooster = (props) => {

    //const CachedPurchaseHistoryTable = React.memo(PurchaseHistoryTable)
    const handleServicePopupClose = props.handler.handleServicePopupClose
    //const [renderState, setRenderState] = useState({ activeBoosters: 'show', purchaseHistory: 'hide', newBoosters: 'hide' })
    const renderState = props.data.renderState
    const setRenderState = props.handler.setRenderState
    const setRefreshPage = props.handler.setRefreshPage
    const [paymentMethodLookup, setPaymentMethodLookup] = useState([])
    const [paymentTypeLookup, setPaymentTypeLookup] = useState([])

    const [currentTopUps, setCurrentTopUps] = useState([])

    const [refreshPurchaseHistory, setRefreshPurchaseHistory] = useState(true)

    const newBoosters = useRef([])

    const [selectedBooster, setSelectedBooster] = useState({})
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({})
    const [selectedPaymentType, setSelectedPaymentType] = useState({})
    const [showPaymentType, setShowPaymentType] = useState(false)

    const [purchaseHistoryData, setPurchaseHistoryData] = useState({})

    const [pageSelect, setPageSelect] = useState()
    const [perPage, setPerPage] = useState(10);

    const purchaseRef = useRef(null)
    const lookupData = useRef();

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails
    const setRefreshServiceList = props.handler.setRefreshServiceList
    const setRenderChange = props.setRenderChange
    useEffect(() => {
        if (serviceDetails && serviceDetails.serviceId !== undefined) {
            showSpinner();
            get(properties.ACTIVE_BOOSTERS_API + '/' + selectedAccount.customerId + '?account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
                .then((resp) => {
                    if (resp && resp.data) {
                        let cTopUps = [] 
                            for (let t of resp.data) {
                                if(t!==null){                                                 
                                    if(t.prodType === serviceDetails.prodType){
                                        cTopUps[t.txnReference]=t
                                    }
                                }
                            }                        
                        setCurrentTopUps(cTopUps)
                    } else {
                        toast.error("Failed to fetch current topup Details - " + resp.status);
                    }
                }).finally(hideSpinner);
        }
    }, [serviceDetails]);

    useEffect(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['BOOSTER_TOPUP_PAYMNT', 'PAYMENT_TYPE'])
            .then((resp) => {
                if (resp.data) {
                    lookupData.current = resp.data;
                    setPaymentMethodLookup(lookupData.current['BOOSTER_TOPUP_PAYMNT']);
                }
            }).finally(hideSpinner);
    }, [])

    const handleTopupClick = () => {
        showSpinner();
        get(properties.PLANS_API + '?plantype=BALANCE&prodtype=' + serviceDetails.prodType)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    if (resp.data.length > 0) {
                        newBoosters.current = resp.data
                        setRenderState({ ...renderState, newBoosters: 'show' })
                        purchaseRef.current.scrollIntoView({ top: purchaseRef.current.offsetTop, behavior: 'smooth', block: "start" })
                    } else {
                        toast.error("No topups available at this moment");
                    }
                } else {
                    if (resp && resp.status) {
                        toast.error("Error fetching topups - " + resp.status + ', ' + resp.message);
                    } else {
                        toast.error("Unexpected error fetching topups");
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

    const handleCancelTopup = () => {
        setSelectedBooster({ planId: null, planType: "" })
        setSelectedPaymentMethod({ paymentMethod: "", paymentMethodDesc: null })
        setRenderState({ ...renderState, newBoosters: 'hide' })
    }

    const handleOnPaymentMethodORTypeChange = (e) => {
        const { target } = e;
        if (target.id === 'paymentMethod') {
            setSelectedPaymentMethod({
                paymentMethod: target.value,
                paymentMethodDesc: target.options[e.target.selectedIndex].label
            })
            if (target.value === 'TOPUP_OTHERS') {
                const { mapping } = JSON.parse(target.options[target.selectedIndex].dataset.selected);
                setPaymentTypeLookup(lookupData.current['PAYMENT_TYPE'].filter((payType) => mapping?.payment_type?.includes(payType.code)));
                setShowPaymentType(true);
            }
            else {
                setShowPaymentType(false);
            }
        }
        else {
            setSelectedPaymentType({
                paymentType: target.value,
                paymentTypeDesc: target.options[e.target.selectedIndex].label
            })
        }
    }

    const handleSubmitTopup = () => {
        if (!selectedBooster || !selectedBooster.planId || selectedBooster.planId === '') {
            toast.error("Please select a booster/topup to proceed");
        } else if (serviceDetails.prodType === 'Prepaid' && (!selectedPaymentMethod.paymentMethod || selectedPaymentMethod.paymentMethod === '')) {
            toast.error("Please select a payment method to proceed");
        }
        else if (selectedPaymentMethod.paymentMethod === 'TOPUP_OTHERS' && (!selectedPaymentType.paymentType || selectedPaymentType.paymentType === '')) {
            toast.error("Please select a payment type to proceed");
        }
        else {
            showSpinner();
            post(properties.CREATE_TOPUP_API, {
                customerId: selectedAccount.customerId,
                accountId: selectedAccount.accountId,
                serviceId: serviceDetails.serviceId,
                topUpPaymentMethod: selectedPaymentMethod.paymentMethod,
                topUpPaymentType: selectedPaymentType.paymentType,
                booster: [{
                    planId: selectedBooster.planId
                }]
            })
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            toast.success(resp.message)
                            unstable_batchedUpdates(() => {
                                setSelectedBooster({})
                                setRefreshServiceList(serviceDetails.serviceId)
                                setRenderChange({ ...renderState, booster: 'hide', service: 'show', vas: 'hide', serviceDetails: 'show', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'hide' })
                                handleServicePopupClose()
                                setRefreshPage((prevState) => (!prevState))
                                //window.location.reload(false)
                            })
                        } else {
                            toast.error("Failed to process topup request - " + resp.status + ' - ' + resp.message);
                        }
                    } else {
                        toast.error("Uexpected error ocurred " + resp.statusCode);
                    }
                }).finally(() => {
                    unstable_batchedUpdates(() => {
                        setRefreshPurchaseHistory(true)
                    })
                    hideSpinner();
                });
        }
    }

    return (
        <div>

            <ul className="nav nav-tabs">
                <li key="activeBooster" className="nav-item pl-0">
                    <button
                        className={"nav-link " + ((renderState.activeBoosters === 'show') ? "active" : "")}
                        onClick={() => setRenderState({ ...renderState, activeBoosters: 'show', purchaseHistory: 'hide' })}
                    >
                        Active Boosters
                    </button>
                </li>
                <li key="purchaseHistory" className="nav-item">
                    <button
                        className={"nav-link " + ((renderState.purchaseHistory === 'show') ? "active" : "")}
                        onClick={() => {
                            if (renderState.purchaseHistory !== "show") {
                                setRenderState({ ...renderState, activeBoosters: 'hide', purchaseHistory: 'show' })
                            }
                        }
                        }
                    >
                        Purchase History
                    </button>
                </li>
            </ul>

            <div className="tab-content p-2 panelbg border">
                <div className="tab-pane show active">
                    {
                        (renderState.activeBoosters === 'show') ?
                            <>
                                <div className="card border p-2 col-lg-12 mt-2">
                                    <div className="row mb-2">
                                        <div className="col-md-9">
                                            <h5>Active Boosters</h5>
                                        </div>
                                        <div className="col-md-3 text-right mt-auto">
                                            {
                                                (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE', 'TERMINATE'].includes(serviceDetails.badge) && serviceDetails.prodType === 'Prepaid') ?
                                                    <button className="btn btn-sm btn-primary" type="button" onClick={handleTopupClick}>
                                                        <i className="mr-1 fas fa-shopping-cart "></i>Purchase Boosters/Topups
                                                    </button>
                                                    :
                                                    <button disabled="disabled" className="btn btn-sm btn-primary" type="button">
                                                        <i className="mr-1 fas fa-shopping-cart "></i>Purchase Boosters/Topups
                                                    </button>
                                            }
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-12 row">

                                            {
                                                (currentTopUps && currentTopUps.length > 0) ?
                                                    currentTopUps.map((t) => {
                                                        return (
                                                            <div className="col-md-4 mt-2">
                                                                <div className="card-header">
                                                                    <div className="text-center">
                                                                        <h5 className="p-0 m-0">{t.planName}</h5>
                                                                    </div>
                                                                </div>
                                                                <div className="card-body border bg-white data-box" style={{ minHeight: "255px" }}>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <p>Status</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <p>{t.status}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <p>Start Date</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <p>{(t.startDate) ? formatISODateDDMMMYY(t.startDate) : '-'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <p>Expiry Date</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <p>{(t.expiryDate) ? formatISODateDDMMMYY(t.expiryDate) : '-'}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-6 mt-auto">
                                                                            <p>Charges</p>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <h4 className="text-dark">${(t.charge) ? Number(t.charge).toFixed(2) : ''}</h4>
                                                                        </div>
                                                                        <div className="mt-2 table-responsive booster-box">
                                                                            <table className="table border mb-0">

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
                                                                                        ((t.prodType === 'Prepaid')||(t.prodType === 'Prepaid'))?
                                                                                       <>
                                                                                            <tr>
                                                                                            <td className="text-center bold">{t.offerType}</td>
                                                                                            <td className="text-center">{t.quota} {t.units}</td>
                                                                                            {
                                                                                                (t.value !== undefined && !isNaN(t.value) && t.quota !== undefined && !isNaN(t.quota)) ?
                                                                                                    (t.offerType === 'Data') ?
                                                                                                        <td className="text-center">{Number(t.quota - t.value / (1024 * 1024 * 1024)).toFixed(1)} {t.units}</td>
                                                                                                        :
                                                                                                        <td className="text-center">{t.quota - t.value} {t.units}</td>
                                                                                                    :
                                                                                                    <td>&nbsp;</td>
                                                                                            }
                                                                                            {
                                                                                                (t.value !== undefined && !isNaN(t.value)) ?
                                                                                                    (t.offerType === 'Data') ?
                                                                                                        <td className="text-center">{Number(t.value / (1024 * 1024 * 1024)).toFixed(1)} {t.units}</td>
                                                                                                        :
                                                                                                        <td className="text-center">{t.value} {t.units}</td>
                                                                                                    :
                                                                                                    <td>&nbsp;</td>
                                                                                            }
                                                                                        </tr>
                                                                                       </>:
                                                                                        <>
                                                                                        <tr>
                                                                                            <td className="text-center bold">Data</td>
                                                                                                 {
                                                                                                    (t.Limit !== undefined && !isNaN(t.Limit)) ?
                                                                                                        <td className="text-center">{Number(t.Limit / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                            :
                                                                                                        <td>&nbsp;</td>
                                                                                                  }
                                                                                                 {
                                                                                                    (t.AccumulatedUsage !== undefined && !isNaN(t.AccumulatedUsage)) ?
                                                                                                        <td className="text-center">{Number(t.AccumulatedUsage / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                            :
                                                                                                        <td>&nbsp;</td>
                                                                                                }
                                                                                                {
                                                                                                     (t.Limit !== undefined && !isNaN(t.Limit) && t.AccumulatedUsage !== undefined && !isNaN(t.AccumulatedUsage)) ?
                                                                                                        <td className="text-center">{Number((t.Limit - t.AccumulatedUsage) / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                            :
                                                                                                        <td>&nbsp;</td>
                                                                                                }
                                                                                            </tr>
                                                                                        </>
                                                                                                                      
                                                                                    }               
                                                                                    {/*
                                                                                        (t.prodType === 'Fixed') ?
                                                                                            (serviceDetails.realtime.offers && serviceDetails.realtime.offers.length > 0) ?
                                                                                                serviceDetails.realtime.offers.map((ro) => {
                                                                                                    return (

                                                                                                        (t.txnReference && ro.UsageType && t.txnReference === ro.UsageType) ?
                                                                                                            <tr>
                                                                                                                <td className="text-center bold">Data</td>
                                                                                                                {
                                                                                                                    (ro.Limit !== undefined && !isNaN(ro.Limit)) ?
                                                                                                                        <td className="text-center">{Number(ro.Limit / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                                        :
                                                                                                                        <td>&nbsp;</td>
                                                                                                                }
                                                                                                                {
                                                                                                                    (ro.AccumulatedUsage !== undefined && !isNaN(ro.AccumulatedUsage)) ?
                                                                                                                        <td className="text-center">{Number(ro.AccumulatedUsage / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                                        :
                                                                                                                        <td>&nbsp;</td>
                                                                                                                }
                                                                                                                {
                                                                                                                    (ro.Limit !== undefined && !isNaN(ro.Limit) && ro.AccumulatedUsage !== undefined && !isNaN(ro.AccumulatedUsage)) ?
                                                                                                                        <td className="text-center">{Number((ro.Limit - ro.AccumulatedUsage) / (1024 * 1024 * 1024)).toFixed(1)} GB</td>
                                                                                                                        :
                                                                                                                        <td>&nbsp;</td>
                                                                                                                }
                                                                                                            </tr>
                                                                                                            :
                                                                                                            <></>
                                                                                                    )
                                                                                                })
                                                                                                :
                                                                                                <></>
                                                                                            :
                                                                                            <></>*/
                                                                                    }
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    :
                                                    <p className="ml-auto mr-auto"><strong>No Boosters added yet.</strong></p>
                                            }

                                        </div>
                                    </div>
                                </div>
                                {
                                    (renderState.newBoosters === 'show') ?
                                        <>
                                            <div className="row pr-1 pb-2" ref={purchaseRef}>
                                                <div className="col-md-12">
                                                    <div className="card border p-2 col-lg-12 mt-2">
                                                        <div className="row align-items-center">
                                                            <div className="col-md-7">
                                                                <div className="text-left">
                                                                    <h5>Add New Boosters/Topups</h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row mt-2">
                                                            {
                                                                (newBoosters && newBoosters.current && newBoosters.current.length > 0) ?
                                                                    newBoosters.current.map((e) => {
                                                                        return (
                                                                            <div className="col-lg-3 mt-2">
                                                                                <div className="card-body border p-0 box-card" style={{ minHeight: "178px" }}>
                                                                                    <div className=" row col-md-12 card-header">
                                                                                        <div className="col-md-8">
                                                                                            <h5>{e.planName}</h5>
                                                                                        </div>
                                                                                        <div className="col-md-4 pt-1">
                                                                                            <div className="radio radio-primary">
                                                                                                <input key={e.planId} type="radio" id={e.planId + ""}
                                                                                                    className="form-check-input" name="optBooster" value={e.planId}
                                                                                                    checked={(Number(e.planId) === Number(selectedBooster.planId))}
                                                                                                    onChange={(p) => setSelectedBooster({ planId: p.target.value, planType: e.planType })} />
                                                                                                <label htmlFor={e.planId + ""}></label>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="text-center pt-1">
                                                                                        {
                                                                                            (e.planType === 'BOOSTER') ?
                                                                                                <div className="row">
                                                                                                    <div className="col-md-6">
                                                                                                        <p>Quota</p>
                                                                                                    </div>
                                                                                                    <div className="col-md-6">
                                                                                                        {
                                                                                                            (e.planoffer && e.planoffer.length > 0) ?
                                                                                                                <p>{e.planoffer[0].quota} {e.planoffer[0].units}</p>
                                                                                                                :
                                                                                                                <></>
                                                                                                        }
                                                                                                    </div>
                                                                                                </div>
                                                                                                :
                                                                                                <></>
                                                                                        }
                                                                                        <div className="row">
                                                                                            <div className="col-md-6">
                                                                                                <p>Validity</p>
                                                                                            </div>
                                                                                            <div className="col-md-6">
                                                                                                <p>{e.validity}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="row">
                                                                                            <div className="col-md-6 mt-auto">
                                                                                                <p>Charges</p>
                                                                                            </div>
                                                                                            <div className="col-md-6">
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
                                                        {
                                                            (serviceDetails.prodType === 'Prepaid') ?
                                                                <>
                                                                    <div className="row align-items-center mt-2">
                                                                        <div className="col-md-7">
                                                                            <div className="text-left">
                                                                                <h5>Payment</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-3 mt-0 pt-2">
                                                                            <div className="form-group">
                                                                                <label htmlFor="paymentMethod" className="col-form-label">Payment Method<span>*</span></label>
                                                                                <select id="paymentMethod" className="form-control" value={selectedPaymentMethod.paymentMethod}
                                                                                    onChange={handleOnPaymentMethodORTypeChange}>
                                                                                    <option key="pmthd" value="" data-selected={JSON.stringify({})}>Select Payment Method</option>
                                                                                    {
                                                                                        paymentMethodLookup.map((e) => (
                                                                                            e.mapping.plan_type.includes(selectedBooster.planType) ?
                                                                                                <option key={e.code} value={e.code} data-selected={JSON.stringify(e)}>{e.description} </option>
                                                                                                :
                                                                                                <></>
                                                                                        ))
                                                                                    }
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        {
                                                                            showPaymentType &&
                                                                            <div className="col-md-3 mt-0 pt-2">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="paymentType" className="col-form-label">Payment Type<span>*</span></label>
                                                                                    <select id="paymentType" className="form-control" value={selectedPaymentType.paymentType}
                                                                                        onChange={handleOnPaymentMethodORTypeChange}>
                                                                                        <option key="pmtype" value="">Select Payment Type</option>
                                                                                        {
                                                                                            paymentTypeLookup.map((e) => (
                                                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                                                            ))
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </>
                                                                :
                                                                <></>
                                                        }
                                                        <div className="d-flex justify-content-center mt-2 p-0">
                                                            <button className="btn btn-primary text-center float-right ml-2 mr-2" onClick={handleSubmitTopup}>Purchase Selected</button>
                                                            <button className="btn btn-secondary text-center float-right" onClick={handleCancelTopup}>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                            </>
                            :
                            <></>
                    }
                    {
                        (renderState.purchaseHistory === 'show') ?
                            <div className="row mt-2">
                                <div className="col-lg-12">
                                    {
                                        <PurchaseHistoryTable
                                            data={{
                                                refreshPurchaseHistory: refreshPurchaseHistory,
                                                purchaseHistoryState: renderState.purchaseHistory,
                                                selectedAccount: selectedAccount,
                                                serviceDetails: serviceDetails,
                                                purchaseHistoryData: purchaseHistoryData,
                                                pageSelect: pageSelect,
                                                perPage
                                            }}
                                            handler={{
                                                setRefreshPurchaseHistory: setRefreshPurchaseHistory,
                                                setPurchaseHistoryData: setPurchaseHistoryData,
                                                setPageSelect: setPageSelect,
                                                setPerPage
                                            }}
                                        />
                                    }
                                </div>
                            </div>
                            :
                            <></>
                    }
                </div>
            </div >
        </div >
    )
}
export default ManageBooster;