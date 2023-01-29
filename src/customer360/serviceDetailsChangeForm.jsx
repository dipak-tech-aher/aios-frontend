import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import ReactSwitch from "react-switch";
import { properties } from '../properties';
import { get } from "../util/restUtil";
import { tupleNum } from "antd/lib/_util/type";
import { es } from "date-fns/esm/locale";
import { showSpinner, hideSpinner } from "../common/spinner";
import { set } from "date-fns";
import { tr } from "date-fns/locale";
import AccessNumberList from "../customer/accessNumberList";

const ServiceDetailsChangeForm = (props) => {

    const { found, setFound } = props

    const [imsiSpinner, setImsiSpinner] = useState(false)

    const fixedCatalog = ["Fixed"]
    const mobileCatalog = ["Postpaid", "Prepaid"]

    let serviceData = props.data.serviceData
    let installationAddress = props.data.installationAddress
    let fixedService = props.data.fixedService
    let mobileService = props.data.mobileService
    let gsm = props.data.gsm
    let deposit = props.data.deposit
    let creditProfile = props.data.creditProfile
    let payment = props.data.payment
    let portIn = props.data.portIn

    let setServiceData = props.handler.setServiceData
    let setInstallationAddress = props.handler.setInstallationAddress
    let setFixedService = props.handler.setFixedService
    let setMobileService = props.handler.setMobileService
    let setGSM = props.handler.setGSM
    let setDeposit = props.handler.setDeposit
    let setCreditProfile = props.handler.setCreditProfile
    let setPayment = props.handler.setPayment
    let setPortIn = props.handler.setPortIn

    const catalogLookup = props.lookups.catalogLookup
    const productLookup = props.lookups.productLookup
    const fixedBBServiceNumberLookup = props.lookups.fixedBBServiceNumberLookup
    const mobileServiceNumberLookup = props.lookups.mobileServiceNumberLookup
    const dealershipLookup = props.lookups.dealershipLookup
    const exchangeCodeLookup = props.lookups.exchangeCodeLookup
    const plansList = props.lookups.plansList
    const setProductLookup = props.lookupsHandler.setProductLookup

    const error = props.error
    const setError = props.setError
    const [display, setDisplay] = useState(false)
    const [suggestion, setSuggestion] = useState(true)
    const [accessNumbers, setAccessNumbers] = useState([])
    let array = []
    let array2 = []
    let array3 = []
    let temp = []

    const [iccidFocus, setIccidFocus] = useState(false)
    const [confirmIccidFocus, setConfirmIccidFocus] = useState(false)
    const [readOnly, setReadOnly] = useState(true)

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

    const handleSubmit = (id, category) => {
        let m = 0, n = 10
        let data = []
        setAccessNumbers([])
        showSpinner()
        get(properties.ACCESS_NUMBER + "?id=" + id + "&category=" + category)
            .then((resp) => {

                if (resp.data) {
                    data = resp.data
                    //onSuggestionsFetchRequested({})
                    let length = data.length

                    while (length > 0) {
                        data.slice(m, n).map((child) => {
                            length = length - 1;
                            array3.push({ value: child.label, category: child.category })
                        })
                        array2.push(array3)
                        //array3 = []
                        if (array2.length === 5 && array2[4].length === 10) {
                            array3 = []
                            array.push(array2)
                            array2 = []
                        }
                        else {
                            array3 = []
                            temp = array2;
                        }
                        m = n;
                        n = m + 10;
                    }
                    array.push(temp)
                    setAccessNumbers([...array])
                    array = []
                    array2 = []
                    array3 = []
                    temp = []
                    setDisplay(true)
                    setSuggestion(true)
                }
                else {
                    setSuggestion(false)
                    setDisplay(true)
                }
            }).finally(hideSpinner)
    }

    const handleClearFixed = () => {
        setDisplay(false)
        setFixedService({ ...fixedService, accessNbr: "" })
        setAccessNumbers([])
    }
    const handleClearMobile = () => {
        setDisplay(false)
        setMobileService({ ...mobileService, accessNbr: "" })
        setAccessNumbers([])
    }

    const handleVerify = (type, accessNbr) => {
        showSpinner()
        get(properties.ACCESS_NUMBER + "?id=" + accessNbr)
            .then((resp) => {
                if (resp.data) {
                    if (resp.data.length === 1) {
                        if (type === 'Fixed') {
                            fixedBBServiceNumberLookup.map((e) => {
                                if (e.code === resp.data[0].category) {
                                    setFixedService((prevState) => {
                                        return ({
                                            ...prevState,
                                            serviceNumberGroup: e.code,
                                            serviceNumberGroupDesc: e.description
                                        })
                                    })
                                }
                            })
                        } else if (type === 'Prepaid' || type === 'Postpaid') {
                            mobileServiceNumberLookup.map((e) => {
                                if (e.code === resp.data[0].category) {
                                    setMobileService((prevState) => {
                                        return ({
                                            ...prevState,
                                            nbrGroup: e.code,
                                            nbrGroupDesc: e.description
                                        })
                                    })
                                }
                            })
                        }
                    } else {
                        toast.error('Error validating Access Number and Group relationship')
                    }
                } else {
                    toast.error('Error validating Access Number and Group relationship ' + resp.statusCode)
                }
            }).finally(hideSpinner)
    }

    const setAccessNumberAndGroup = (type, accessNbr, category) => {
        if (type === 'Fixed') {
            fixedBBServiceNumberLookup.map((e) => {
                if (e.code === category) {
                    setFixedService((prevState) => {
                        return ({
                            ...prevState,
                            accessNbr: accessNbr,
                            serviceNumberGroup: e.code,
                            serviceNumberGroupDesc: e.description
                        })
                    })
                }
            })
        } else if (type === 'Prepaid' || type === 'Postpaid') {
            mobileServiceNumberLookup.map((e) => {
                if (e.code === category) {
                    setMobileService((prevState) => {
                        return ({
                            ...prevState,
                            accessNbr: accessNbr,
                            nbrGroup: e.code,
                            nbrGroupDesc: e.description
                        })
                    })
                }
            })
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
    return (

        <>
            <form>

                <div style={{ display: 'none' }} className="col-12 pl-2  bg-light border">
                    <h5 className="text-primary">Service Selection</h5>
                </div>
                <div className="row" style={{ display: 'none' }}>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="catalog" className="col-form-label">Catalog<span>*</span></label>
                            <select id="catalog" className={`form-control ${(error.catalog ? "input-error" : "")}`} value={serviceData.catalog}
                                onChange={(e) => {
                                    let products = []
                                    if (plansList.current && plansList.current.length > 0) {
                                        for (let p of plansList.current) {
                                            if (p.planCategory === e.target.value) {
                                                products.push(p)
                                            }
                                        }
                                    }
                                    setProductLookup(products)
                                    setServiceData({
                                        ...serviceData,
                                        catalog: e.target.value,
                                        catalogDesc: e.target.options[e.target.selectedIndex].label,
                                        product: '',
                                        prodType: '',
                                        productDesc: ''
                                    })
                                    setError({...error,catalog:""})
                                    // setAccessNumbers([])
                                }
                                }>
                                <option key="catalog" value="">Select Catalog</option>
                                {
                                    catalogLookup.map((e) => (
                                        <option key={e.code} value={e.code}>{e.code}</option>
                                    ))

                                }

                            </select>
                            <span className="errormsg">{error.catalog ? error.catalog : ""}</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="product" className="col-form-label">Product<span>*</span></label>
                            <select id="product" className={`form-control ${(error.product ? "input-error" : "")}`} value={serviceData.product}
                                onChange={(e) => {
                                    let selPrd = productLookup.find((p) => p.planId == e.target.value)
                                    setServiceData({
                                        ...serviceData,
                                        product: e.target.value,
                                        prodType: selPrd.prodType,
                                        productDesc: selPrd.planName
                                    })
                                    setError({...error,product:""})
                                }
                                }>
                                <option key="plan" value="">Select Product</option>
                                {
                                    productLookup.map((e) => (
                                        <option key={e.planId} value={e.planId}>{e.planId}</option>
                                    ))
                                }
                            </select>
                            <span className="errormsg">{error.product ? error.product : ""}</span>
                        </div>
                    </div>
                </div>
                {
                    (serviceData.product !== '') ?
                        <div>
                            {
                                (fixedCatalog.includes(serviceData.prodType)) ?
                                    <div>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Service Details</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="svcNbrGroup" className="col-form-label">Service Number Group<span>*</span></label>
                                                    <select id="svcNbrGroup" className={`form-control ${(error.serviceNumberGroup ? "input-error" : "")}`} value={fixedService.serviceNumberGroup}
                                                        onChange={e => {
                                                            //setDeposit({ ...deposit, includeExclude: "" })
                                                            setFixedService((prevState) => {
                                                                if (prevState.serviceNumberSelection === 'manual') {
                                                                    return ({
                                                                        ...prevState,
                                                                        serviceNumberGroup: e.target.value,
                                                                        serviceNumberGroupDesc: e.target.options[e.target.selectedIndex].label,
                                                                        accessNbr: ''
                                                                    })
                                                                } else {
                                                                    return ({
                                                                        ...prevState,
                                                                        serviceNumberGroup: e.target.value,
                                                                        serviceNumberGroupDesc: e.target.options[e.target.selectedIndex].label
                                                                    })
                                                                }
                                                            })
                                                            setError({...error,serviceNumberGroup:""})
                                                        }}>
                                                        <option key="fbbsng" value="">Select Service Number Group</option>
                                                        {
                                                            fixedBBServiceNumberLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{error.serviceNumberGroup ? error.serviceNumberGroup : ""}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="exchangeCode" className="col-form-label">Exchange Code<span>*</span></label>
                                                    <select id="exchangeCode" className={`form-control ${(error.exchangeCode ? "input-error" : "")}`} value={fixedService.exchangeCode}
                                                        onChange={e => {
                                                        setFixedService({ ...fixedService, exchangeCode: e.target.value, exchangeCodeDesc: e.target.options[e.target.selectedIndex].label })
                                                        setError({...error,exchangeCode:""})
                                                        }}>
                                                        <option key="exchg" value="">Select Exchange Code</option>
                                                        {
                                                            exchangeCodeLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{error.exchangeCode ? error.exchangeCode : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Access Number Selection</h5>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-8">
                                                <div className="d-flex">
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="fixedAccessNbrRadio1" className="form-check-input" name="fixedOptAccessNbrSelection" value="auto"
                                                            checked={(fixedService.serviceNumberSelection === 'auto')}
                                                            onChange={(e) => {
                                                                // setAccessNumbers([])
                                                                setFixedService({ ...fixedService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Auto from Pool', accessNbr: '' })
                                                                setError({...error,serviceNumberSelection:""})
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="fixedAccessNbrRadio1">Auto Selection from Pool</label>
                                                    </div>
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="fixedAccessNbrRadio2" className="form-check-input" name="fixedOptAccessNbrSelection" value="manual"
                                                            checked={(fixedService.serviceNumberSelection === 'manual') ? "checked" : ""}
                                                            onChange={(e) => {
                                                                // setAccessNumbers([])
                                                                setFixedService({ ...fixedService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Manual Selection', accessNbr: '' })
                                                                setError({...error,serviceNumberSelection:""})
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="fixedAccessNbrRadio2">Manual Selection from Pool</label>
                                                    </div>
                                                </div>
                                                <span className="errormsg">{error.serviceNumberSelection ? error.serviceNumberSelection : ""}</span>
                                            </div>
                                        </div>
                                        {
                                            (fixedService.serviceNumberSelection === 'manual') ?
                                                <>
                                                    <div className="col-12 row pl-2" >
                                                        <div className="col-md-3">
                                                            <label htmlFor="fixedAccessNbr" className="col-form-label">Access Number<span className="required">*</span></label>
                                                            <input
                                                                maxLength={15}
                                                                type="text"
                                                                className="form-control"
                                                                id="fixedAccessNbr"
                                                                placeholder="" value={fixedService.accessNbr}
                                                                onChange={e => {
                                                                    setFixedService({ ...fixedService, accessNbr: e.target.value })
                                                                }}
                                                            // onBlur={(e) => {
                                                            //         if(e.target.value && e.target.value.length === 7) {
                                                            //             handleVerify(serviceData.prodType, e.target.value)                                                                            
                                                            //         }
                                                            //     }
                                                            // }
                                                            />
                                                        </div>
                                                        <div className="col-md-6 pl-0 ml-0 col-md-4 mt-4">
                                                            <button type="button" className="btn btn-primary btn-sm waves-effect waves-light ml-2" onClick={() => handleSubmit(fixedService.accessNbr, fixedService.serviceNumberGroup)}>Search</button>
                                                            <button type="button" className="btn btn-secondary btn-sm waves-effect waves-light ml-2" onClick={handleClearFixed}>Clear</button>
                                                        </div>
                                                    </div>
                                                    {
                                                        display ?
                                                            suggestion ?
                                                                accessNumbers && accessNumbers.length > 0 ?
                                                                    <AccessNumberList
                                                                        accessNumbers={accessNumbers}
                                                                        setAccessNumberAndGroup={setAccessNumberAndGroup}
                                                                        prodType={serviceData.prodType}
                                                                    />
                                                                    :
                                                                    <></>
                                                                // <h5 className="errormsg ml-2">No unallocated access numbers available, please change search criteria</h5>
                                                                :
                                                                <h5 className="errormsg ml-2">No unallocated access numbers available, please change search criteria</h5>
                                                            :
                                                            <></>
                                                    }
                                                </>
                                                :
                                                <></>
                                        }

                                    </div >
                                    :
                                    <></>
                            }
                            {
                                (mobileCatalog.includes(serviceData.prodType)) ?
                                    <>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Dealership</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="dealership" className="col-form-label">Dealership<span>*</span></label>
                                                    <select id="dealership" className={`form-control ${(error.dealership ? "input-error" : "")}`} value={mobileService.dealership}
                                                        onChange={(e) => {
                                                            setMobileService({ ...mobileService, dealership: e.target.value, dealershipDesc: e.target.options[e.target.selectedIndex].label })
                                                            setError({...error,dealership:""})
                                                        }
                                                        }
                                                    >
                                                        <option key="dealer" value="">Select Dealership</option>
                                                        {
                                                            dealershipLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{error.dealership ? error.dealership : ""}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="nbrGroup" className="col-form-label">Number Group<span>*</span></label>
                                                    <select id="nbrGroup"
                                                        className={`form-control ${(error.nbrGroup ? "input-error" : "")}`}
                                                        value={mobileService.nbrGroup}
                                                        onChange={(e) => {
                                                            setMobileService((prevState) => {
                                                                if (prevState.serviceNumberSelection === 'manual') {
                                                                    return ({
                                                                        ...prevState,
                                                                        nbrGroup: e.target.value,
                                                                        nbrGroupDesc: e.target.options[e.target.selectedIndex].label,
                                                                        accessNbr: ''
                                                                    })
                                                                } else {
                                                                    return ({
                                                                        ...prevState,
                                                                        nbrGroup: e.target.value,
                                                                        nbrGroupDesc: e.target.options[e.target.selectedIndex].label
                                                                    })
                                                                }
                                                            })
                                                            setError({...error,nbrGroup:""})
                                                        }}>
                                                        <option key="msng" value="">Select Number Group</option>
                                                        {
                                                            mobileServiceNumberLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                                <span className="errormsg">{error.nbrGroup ? error.nbrGroup : ""}</span>
                                            </div>
                                        </div>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Access Number Selection</h5>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-8">
                                                <div className="d-flex">
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="mobileAccessNbrRadio1" className="form-check-input" name="mobileOptAccessNbrSelection" value='auto'
                                                            checked={(mobileService.serviceNumberSelection === 'auto')}
                                                            //value={mobileConnection.nbrGroup}
                                                            onChange={e => {
                                                                // setAccessNumbers([])
                                                                setMobileService({ ...mobileService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Auto from Pool', accessNbr: '' })
                                                                setError({...error,serviceNumberSelection:""})
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="mobileAccessNbrRadio1">Auto Selection from Pool</label>
                                                    </div>
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="mobileAccessNbrRadio2" className="form-check-input" name="mobileOptAccessNbrSelection" value='manual'
                                                            checked={(mobileService.serviceNumberSelection === 'manual')}
                                                            onChange={e => {
                                                                // setAccessNumbers([])
                                                                setMobileService({ ...mobileService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Manual Selection', accessNbr: '' })
                                                                setError({...error,serviceNumberSelection:""})
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="mobileAccessNbrRadio2">Manual Selection from Pool</label>
                                                    </div>
                                                </div>
                                                <span className="errormsg">{error.serviceNumberSelection ? error.serviceNumberSelection : ""}</span>
                                            </div>
                                        </div>
                                        {
                                            (mobileService.serviceNumberSelection === 'manual') ?
                                                <>
                                                    <div className="col-12 row pl-2" >
                                                        <div className="col-3">
                                                            <label htmlFor="mobileAccessNbr" className="col-form-label">Access Number<span className="required">*</span></label>
                                                            <input
                                                                maxLength={15}
                                                                type="text"
                                                                className="form-control"
                                                                id="mobileAccessNbr"
                                                                placeholder="Enter min 3 digits to search"
                                                                value={mobileService.accessNbr}
                                                                onChange={e => {
                                                                    setMobileService({ ...mobileService, accessNbr: e.target.value })
                                                                }}
                                                            // onBlur={(e) => {
                                                            //         if(e.target.value && e.target.value.length === 7) {
                                                            //             handleVerify(serviceData.prodType, e.target.value)
                                                            //         }
                                                            //     }
                                                            // }
                                                            />
                                                        </div>
                                                        <div className="col-6 pl-0 ml-0 col-4 mt-4">
                                                            <button type="button" className="btn btn-primary btn-sm waves-effect waves-light ml-2" onClick={() => handleSubmit(mobileService.accessNbr, mobileService.nbrGroup)}>Search</button>
                                                            <button type="button" className="btn btn-secondary btn-sm waves-effect waves-light ml-2" onClick={handleClearMobile}>Clear</button>
                                                        </div>
                                                    </div >
                                                    {
                                                        display ?
                                                            suggestion ?
                                                                accessNumbers && accessNumbers.length > 0 ?
                                                                    <AccessNumberList
                                                                        accessNumbers={accessNumbers}
                                                                        setAccessNumberAndGroup={setAccessNumberAndGroup}
                                                                        prodType={serviceData.prodType}
                                                                    />
                                                                    :
                                                                    <></>
                                                                // <h5 className="errormsg ml-2">No unallocated access numbers available, please change search criteria</h5>
                                                                :
                                                                <h5 className="errormsg ml-2" > No unallocated access numbers available, please change search criteria</h5 >
                                                            :
                                                            <></>
                                                    }
                                                </>
                                                :
                                                <></>
                                        }

                                    </>
                                    :
                                    <></>
                            }

                        </div >
                        :
                        <></>
                }
            </form >
        </>
    )
}
export default ServiceDetailsChangeForm;