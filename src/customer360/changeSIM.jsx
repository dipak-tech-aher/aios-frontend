import React, { useState, useRef, useEffect } from 'react'
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";
import { formatISODateDDMMMYY } from '../util/dateUtil'
import PurchaseHistoryTable from './purchaseHistoryTable'

const ChangeSIM = (props) => {

    //const CachedPurchaseHistoryTable = React.memo(PurchaseHistoryTable)

    const [imsiSpinner, setImsiSpinner] = useState(false)

    const [gsm, setGSM] = useState({
        assignSIMLater: false,
        iccid: '',
        confirmiccid: '',
        imsi: ''
    });

    const [iccidFocus, setIccidFocus] = useState(false)
    const [confirmIccidFocus, setConfirmIccidFocus] = useState(false)
    const [readOnly, setReadOnly] = useState(true)
    const setRefreshPage = props.handler.setRefreshPage
    const [error, setError] = useState({});

    const [renderState, setRenderState] = useState({ activeBoosters: 'show', purchaseHistory: 'hide', newBoosters: 'hide' })

    const [paymentMethodLookup, setPaymentMethodLookup] = useState([])

    const [currentTopUps, setCurrentTopUps] = useState([])

    const [refreshPurchaseHistory, setRefreshPurchaseHistory] = useState(true)

    const newBoosters = useRef([])

    const [selectedBooster, setSelectedBooster] = useState({})
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState({})

    const [purchaseHistoryData, setPurchaseHistoryData] = useState({})

    const [pageSelect, setPageSelect] = useState()

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails

    const setRefreshServiceList = props.handler.setRefreshServiceList
    const handleServicePopupClose = props.handler.handleServicePopupClose
    useEffect(() => {
        if (serviceDetails && serviceDetails.serviceId !== undefined) {
            showSpinner();
            get(properties.ACTIVE_BOOSTERS_API + '/' + selectedAccount.customerId + '?account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
                .then((resp) => {
                    if (resp && resp.data) {
                        let cTopUps = []
                        for (let t of resp.data) {
                            if (serviceDetails.realtime.offers && serviceDetails.realtime.offers.length > 0) {
                                let found = false
                                if (t.prodType === 'Prepaid' || t.prodType === 'Postpaid') {
                                    for (let o of t.offers) {
                                        for (let r of serviceDetails.realtime.offers) {
                                            if (o.offerId === r.offerId && t.txnReference === String(r.productId)) {
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
                                if (t.prodType === 'Fixed') {
                                    for (let r of serviceDetails.realtime.offers) {
                                        if (t.txnReference === r.UsageType) {
                                            if (r.startDate) {
                                                t.startDate = r.startDate
                                            }
                                            if (r.ExpiryDate) {
                                                t.expiryDate = r.ExpiryDate
                                            }
                                            found = true
                                            break
                                        }
                                    }
                                }
                            }
                            cTopUps.push(t)
                        }
                        setCurrentTopUps(cTopUps)
                    } else {
                        toast.error("Failed to fetch current topup Details - " + resp.status);
                    }
                }).finally(hideSpinner);

            showSpinner();
            post(properties.BUSINESS_ENTITY_API, ['BOOSTER_TOPUP_PAYMNT'])
                .then((resp) => {
                    if (resp.data) {
                        setPaymentMethodLookup(resp.data['BOOSTER_TOPUP_PAYMNT'])
                    }
                }).finally(hideSpinner);

        }
    }, [serviceDetails]);


    const getIMSI = (iccid) => {
        if (iccid && iccid != '') {
            setImsiSpinner(true)
            get(properties.ICCID_API + "/" + iccid)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.data.statusCode === "SUCCESS-001") {
                            if (resp.data.iccidDetails.imsi && resp.data.iccidDetails.imsi !== '') {
                                setGSM({ ...gsm, imsi: resp.data.iccidDetails.imsi })
                            } else {
                                setGSM({ ...gsm, imsi: '' })
                                toast.error('Unable to find IMSI for given ICCID')
                            }
                        }
                        else {
                            setGSM({ ...gsm, imsi: '' })
                            toast.error(resp.data.statusMsg)
                        }
                    }
                })
                .catch((err) => {
                    toast.error("Error while validating ICCID")
                }).finally(() => setImsiSpinner(false))
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        //toast.error("Do not Paste Please Enter Value")
        return false;
    }

    const fetchIccid = (value) => {
        if (iccidFocus === false && confirmIccidFocus === false) {
            if (gsm.iccid === gsm.confirmiccid && gsm.iccid !== "" && gsm.confirmiccid !== "") {
                getIMSI(value)
            }
            else if (gsm.iccid !== gsm.confirmiccid) {
                toast.error("ICCID must be same")
            }
        }
    }

    const handleTopupClick = () => {
        showSpinner();
        get(properties.PLANS_API + '?plantype=BALANCE&prodtype=' + serviceDetails.prodType)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    if (resp.data.length > 0) {
                        newBoosters.current = resp.data
                        setRenderState({ ...renderState, newBoosters: 'show' })
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
        setRenderState({ ...renderState, newBoosters: 'hide' })
    }

    const handleSubmit = () => {
        if (!selectedBooster || !selectedBooster.planId || selectedBooster.planId === '') {
            toast.error("Please select a topup to proceed");
        } else if (serviceDetails.prodType === 'Prepaid' && (!selectedPaymentMethod.paymentMethod || selectedPaymentMethod.paymentMethod === '')) {
            toast.error("Please select a payment method to proceed");
        } else {
            showSpinner();
            post(properties.CREATE_TOPUP_API, {
                customerId: selectedAccount.customerId,
                accountId: selectedAccount.accountId,
                serviceId: serviceDetails.serviceId,
                topUpPaymentType: selectedPaymentMethod.paymentMethod,
                booster: [{
                    planId: selectedBooster.planId
                }]
            })
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            toast.success(resp.message)
                            setSelectedBooster({})
                            setRefreshServiceList(serviceDetails.serviceId)
                            handleServicePopupClose()
                            setRefreshPage((prevState) => (!prevState))
                            //window.location.reload(false)
                        } else {
                            toast.error("Failed to process topup request - " + resp.status + ' - ' + resp.message);
                        }
                    } else {
                        toast.error("Uexpected error ocurred " + resp.statusCode);
                    }
                }).finally(() => {
                    setRefreshPurchaseHistory(true)
                    hideSpinner();
                });
        }
    }

    return (
        <div className="row pb-2">
            <div className="col-md-12">
                <section className="triangle col-12">
                    <div className="row col-12">
                        <h5>Change SIM</h5>
                    </div>
                </section>
                <div className="card border p-2 col-lg-12">
                    <div className="row mt-1">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="inputName" className="col-form-label">Current ICCID</label>
                                <p>{gsm.iccid}</p>
                            </div>
                        </div>
                    </div>

                    <div className="row mt-1">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="iccid" className="col-form-label">ICCID<span>*</span></label>
                                <input disabled={gsm.assignSIMLater} type={iccidFocus ? "text" : "password"} className={`form-control ${(error.iccid ? "input-error" : "")}`} id="iccid" placeholder="ICCID" value={gsm.iccid}
                                    onChange={(e) => {
                                        setError({ ...error, iccid: "" })
                                        if (e.target.value && (e.target.value.length > 0)) {
                                            setReadOnly(false)
                                        }
                                        else {
                                            setReadOnly(true)
                                        }
                                        setGSM({ ...gsm, iccid: e.target.value, confirmiccid: '', imsi: '' })
                                    }
                                    }
                                    onBlur={(e) => setIccidFocus(false)}
                                    onFocus={(e) => setIccidFocus(true)}
                                />
                                <span className="errormsg">{error.iccid ? error.iccid : ""}</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="confirmiccid" className="col-form-label">Confirm ICCID<span>*</span></label>
                                <input disabled={gsm.assignSIMLater} readOnly={readOnly} type="text" onPaste={(e) => handlePaste(e)}
                                    className={`form-control ${(error.iccid ? "input-error" : "")}`} id="confirmiccid"
                                    placeholder="Confirm ICCID" value={gsm.confirmiccid}
                                    onChange={(e) => {
                                        setGSM({ ...gsm, confirmiccid: e.target.value, imsi: '' })
                                    }
                                    }
                                    onBlur={(e) => { setConfirmIccidFocus(false); fetchIccid(e.target.value) }}
                                //onFocus={() => setConfirmIccidFocus(true)}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="imsi" className="col-form-label">IMSI<span>*</span></label>
                                <input readOnly="true" type="text" className={`form-control ${(error.imsi ? "input-error" : "")}`} id="imsi" placeholder="IMSI" value={gsm.imsi}
                                    onChange={e => {
                                        setGSM({ ...gsm, imsi: e.target.value });
                                        setError({ ...error, imsi: "" })
                                    }} />
                                <span className="errormsg">{error.imsi ? error.imsi : ""}</span>
                            </div>
                        </div>
                        <div className="ml-0 pl-0 col-md-3 d-inline-flex mt-3 align-items-center">
                            {
                                (imsiSpinner) ?
                                    <>
                                        <div className="loader"></div>
                                        <span>Fetching IMSI...</span>
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                    {
                        (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge))?
                            <div className="d-flex justify-content-center mt-2 p-0">
                                <button className="btn btn-primary text-center float-right ml-2 mr-2" onClick={handleSubmit}>Submit</button>
                            </div>
                            :
                            <div className="d-flex justify-content-center mt-2 p-0">
                                <button disabled="disabled" className="btn btn-primary text-center float-right ml-2 mr-2">Submit</button>

                            </div>
    

                    }
                </div>
            </div>
        </div>

    )
}
export default ChangeSIM;