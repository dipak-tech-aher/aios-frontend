import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import ReactSwitch from "react-switch";
import AssignSimLater from "react-switch";
import InstallationAddressForm from "./addressForm";
import { properties } from '../properties';
import { get } from "../util/restUtil";
import AccessNumberList from "./accessNumberList";
import { showSpinner, hideSpinner } from "../common/spinner";
import { validateNumber, handlePaste } from "../util/validateUtil";

const ServiceDetailsForm = (props) => {

    const [validate, setValidate] = useState({
        excludeReason: true
    })
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
    const creditProfileLookup = props.lookups.creditProfileLookup
    const depositChargeLookup = props.lookups.depositChargeLookup
    const paymentMethodLookup = props.lookups.paymentMethodLookup

    const districtLookup = props.lookups.districtLookup
    const kampongLookup = props.lookups.kampongLookup
    const postCodeLookup = props.lookups.postCodeLookup

    const addressElements = props.lookups.addressElements

    const plansList = props.lookups.plansList

    const addressChangeHandler = props.lookupsHandler.addressChangeHandler
    const setProductLookup = props.lookupsHandler.setProductLookup
    const error = props.error
    const setError = props.setError

    const detailsValidate = props.data.detailsValidate
    const setDetailsValidate = props.handler.setDetailsValidate
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

    const resetData = () => {
        setServiceData({
            ...serviceData,
            catalog: '',
            catalogDesc: '',
            product: '',
            productDesc: '',
            prodType: ''
        })
        setInstallationAddress({
            ...installationAddress,
            sameAsCustomerAddress: true,
            flatHouseUnitNo: '',
            block: '',
            building: '',
            street: '',
            road: '',
            district: '',
            state: '',
            village: '',
            cityTown: '',
            country: '',
            postCode: ''
        })
        setFixedService({
            ...fixedService,
            serviceNumberSelection: '',
            serviceNumberSelectionDesc: '',
            serviceNumberGroup: '',
            serviceNumberGroupDesc: '',
            exchangeCode: '',
            exchangeCodeDesc: '',
            accessNbr: ''
        })

        setMobileService({
            ...mobileService,
            serviceNumberSelection: '',
            serviceNumberSelectionDesc: '',
            dealership: '',
            dealershipDesc: '',
            nbrGroup: '',
            nbrGroupDesc: '',
            accessNbr: ''
        })
        setCreditProfile({
            ...creditProfile,
            creditProfile: '',
            creditProfileDesc: ''
        })
        setGSM({
            ...gsm,
            assignSIMLater: false,
            iccid: '',
            confirmiccid: '',
            imsi: ''
        })
        setDeposit({
            ...deposit,
            includeExclude: '',
            charge: '',
            chargeDesc: '',
            excludeReason: ''
        })
        setPayment({
            ...payment,
            paymentMethod: '',
            paymentMethodDesc: ''
        })
        setPortIn({
            ...portIn,
            portInChecked: false,
            donor: '',
            donorDesc: '',
        })
    }

    const getIMSI = (iccid) => {
        if (iccid && iccid != '') {
            setImsiSpinner(true)
            get(properties.ICCID_API + "/" + iccid)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.data.statusCode === "SUCCESS-001") {
                            if (resp.data.iccidDetails.imsi && resp.data.iccidDetails.imsi !== '') {
                                setGSM({ ...gsm, imsi: resp.data.iccidDetails.imsi })
                                setError({ ...error, imsi: '' })
                            } else {
                                setGSM({ ...gsm, imsi: '' })
                                setError({ ...error, imsi: '' })
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


        if (!id || isNaN(id) || String(id).length < 3) {
            toast.error('Enter atleast first 3 digits to search for Access Numbers')
            return false
        }

        if (!category || category.trim() === '') {
            toast.error('Number Group is mandatory to search for Access Numbers')
            return false
        }

        let m = 0, n = 10
        let data = []
        setAccessNumbers([])
        showSpinner()
        get(properties.ACCESS_NUMBER + "?id=" + id + "&category=" + category)
            .then((resp) => {

                if (resp.data) {
                    data = resp.data
                    let length = data.length
                    if (length === 0) {
                        toast.error('No numbers available for given search criteria')
                    }
                    while (length > 0) {
                        data.slice(m, n).map((child) => {
                            length = length - 1;
                            array3.push({ value: child.label, category: child.category })
                        })
                        array2.push(array3)
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

                <div className="col-12 pl-2  bg-light border">
                    <h5 className="text-primary">Service Selection</h5>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="form-group">
                            <label htmlFor="catalog" className="col-form-label">Catalog<span>*</span></label>
                            <select id="catalog" className={`form-control ${(error.catalog ? "input-error" : "")}`} value={serviceData.catalog}
                                onChange={(e) => {
                                    resetData()
                                    setError({})
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
                                }
                                }>
                                <option key="catalog" value="">Select Catalog</option>
                                {
                                    catalogLookup.map((e) => (
                                        <option key={e.code} value={e.code}>{e.description}</option>
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
                                    resetData()
                                    setError({})
                                    let selPrd = productLookup.find((p) => p.planId == e.target.value)
                                    setServiceData({
                                        ...serviceData,
                                        product: e.target.value,
                                        prodType: selPrd.prodType,
                                        productDesc: selPrd.planName
                                    })
                                }
                                }>
                                <option key="plan" value="">Select Product</option>
                                {
                                    productLookup.map((e) => (
                                        <option key={e.planId} value={e.planId}>{e.planName}</option>
                                    ))
                                }
                            </select>
                            <span className="errormsg">{error.product ? error.product : ""}</span>
                        </div>
                    </div>
                </div>
                {
                    (serviceData.product !== '') ?
                        <>
                            <div className="form-row col-12 p-0 ml-0 mr-0 mt-2">
                                <div className="col-12 pl-2 bg-light border">
                                    <h5 className="text-primary">Selected Plan Details</h5>
                                </div>
                            </div>
                            {
                                plansList.current.map((p) => {
                                    return (
                                        (Number(p.planId) === Number(serviceData.product)) ?
                                            <div className="row mt-2">
                                                <div className="col-lg-6">
                                                    <div className="card card-body border p-0">
                                                        <div className="d-flex justify-content-center card-header p-0">
                                                            <h5>{p.planName}</h5>
                                                        </div>
                                                        <div className="text-center pt-1 pb-2 pl-2">
                                                            <div className="col-12">
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <label className="col-form-label">ServiceType</label>
                                                                    </div>
                                                                    <div className="col-7 pt-2">
                                                                        {p.prodType}
                                                                    </div>
                                                                </div>
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <label className="col-form-label">Plan</label>
                                                                    </div>
                                                                    <div className="col-7 pt-2">
                                                                        {p.planName}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {
                                                                /*(p.charge) ?*/
                                                                <div className="row">
                                                                    <div className="col-5">
                                                                        <label className="col-form-label">Rental</label>
                                                                    </div>
                                                                    <div className="col-7">
                                                                        {
                                                                            (p.charge) ?
                                                                                <h4 className="text-dark text-center">${p.charge}</h4>
                                                                                :
                                                                                <></>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                /*    :
                                                                    <></>*/
                                                            }
                                                        </div>
                                                        <div className="mt-1 table-responsive pl-2 pr-2">
                                                            <table className="table border">

                                                                <thead>
                                                                    <tr className="bg-light">
                                                                        <th className="text-center">Type</th>
                                                                        <th className="text-center">Quota</th>
                                                                        <th className="text-center">Units</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        p.planoffer.map((o) => {
                                                                            return (
                                                                                <tr>
                                                                                    <td className="text-center bold">{o.offerType}</td>
                                                                                    <td className="text-center">{o.quota}</td>
                                                                                    <td className="text-center">{o.units}</td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            :
                                            <></>
                                    )
                                })
                            }
                        </>
                        :
                        <></>
                }
                {
                    (serviceData.product !== '') ?
                        <div>
                            {
                                (fixedCatalog.includes(serviceData.prodType)) ?
                                    <div>

                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Installation Address</h5>
                                        </div>
                                        <div className="row ml-0 mt-2">
                                            <div className="ml-0 row col-12 label-align">
                                                <ReactSwitch
                                                    onColor="#f58521"
                                                    offColor="#6c757d"
                                                    activeBoxShadow="0px 0px 1px 5px rgba(245, 133, 33, 0.7)"
                                                    height={20}
                                                    width={48}
                                                    className={`${(error.sameAsCustomerAddress ? "input-error" : "")}`} id="sameAsCustomerAddressSwitch" checked={installationAddress.sameAsCustomerAddress}
                                                    onChange={e => {
                                                        if (e === true) {
                                                            setInstallationAddress({
                                                                ...installationAddress, sameAsCustomerAddress: e,
                                                                flatHouseUnitNo: '',
                                                                block: '',
                                                                building: '',
                                                                street: '',
                                                                road: '',
                                                                district: '',
                                                                state: '',
                                                                village: '',
                                                                cityTown: '',
                                                                country: '',
                                                                postCode: ''
                                                            })
                                                        }
                                                        else {
                                                            setInstallationAddress({ ...installationAddress, sameAsCustomerAddress: e })
                                                        }
                                                    }} />
                                                <label htmlFor="sameAsCustomerAddressSwitch" className="mt-0 pt-0 ml-2 col-form-label">Use Customer Address</label>
                                            </div>
                                            <span className="errormsg">{error.sameAsCustomerAddress ? error.sameAsCustomerAddress : ""}</span>
                                        </div>
                                        {
                                            (installationAddress.sameAsCustomerAddress) ?
                                                <></>
                                                :
                                                <InstallationAddressForm
                                                    data={installationAddress}
                                                    lookups={{
                                                        districtLookup: districtLookup,
                                                        kampongLookup: kampongLookup,
                                                        postCodeLookup: postCodeLookup,
                                                        addressElements: addressElements
                                                    }}
                                                    title={"installation_address"}
                                                    error={error}
                                                    setError={setError}
                                                    setDetailsValidate={setDetailsValidate}
                                                    detailsValidate={detailsValidate}
                                                    lookupsHandler={{
                                                        addressChangeHandler: addressChangeHandler
                                                    }}
                                                    handler={setInstallationAddress} />
                                        }
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Service Details</h5>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="svcNbrGroup" className="col-form-label">Service Number Group<span>*</span></label>
                                                    <select id="svcNbrGroup" className={`form-control ${(error.serviceNumberGroup ? "input-error" : "")}`} value={fixedService.serviceNumberGroup}
                                                        onChange={e => {
                                                            setError({ ...error, serviceNumberGroup: "" })
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
                                                            setFixedService({ ...fixedService, exchangeCode: e.target.value, exchangeCodeDesc: e.target.options[e.target.selectedIndex].label });
                                                            setError({ ...error, exchangeCode: "" })
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
                                                                setError({ ...error, serviceNumberSelection: "" })
                                                                // setAccessNumbers([])
                                                                setFixedService({ ...fixedService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Auto from Pool', accessNbr: '' })
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="fixedAccessNbrRadio1">Auto Selection from Pool</label>
                                                    </div>
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="fixedAccessNbrRadio2" className="form-check-input" name="fixedOptAccessNbrSelection" value="manual"
                                                            checked={(fixedService.serviceNumberSelection === 'manual') ? "checked" : ""}
                                                            onChange={(e) => {
                                                                setError({ ...error, serviceNumberSelection: "" })
                                                                setFixedService({ ...fixedService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Manual Selection', accessNbr: '' })
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
                                                                placeholder="Enter min 3 digits to search"
                                                                value={fixedService.accessNbr}
                                                                onChange={e => {
                                                                    setError({ ...error, accessNbr: "" })
                                                                    setFixedService({ ...fixedService, accessNbr: e.target.value })
                                                                }}
                                                            />
                                                            <span className="errormsg">{error.accessNbr ? error.accessNbr : ""}</span>
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
                                                                :
                                                                <h5 className="errormsg ml-2">No unallocated access numbers available, please change search criteria</h5>
                                                            :
                                                            <></>
                                                    }
                                                </>
                                                :
                                                <></>
                                        }
                                        <div className="row mt-2">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="creditProfileFixed" className="col-form-label">Credit Profile<span>*</span></label>
                                                    <select id="creditProfileFixed" className={`form-control ${(error.creditProfile ? "input-error" : "")}`} value={creditProfile.creditProfile}
                                                        onChange={e => {
                                                            setCreditProfile({ ...creditProfile, creditProfile: e.target.value, creditProfileDesc: e.target.options[e.target.selectedIndex].label });
                                                            setError({ ...error, creditProfile: "" })
                                                        }}>
                                                        <option key="cprffixed" value="">Select Credit Profile</option>
                                                        {
                                                            creditProfileLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{error.creditProfile ? error.creditProfile : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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
                                                            setError({ ...error, dealership: "" })
                                                            setMobileService({ ...mobileService, dealership: e.target.value, dealershipDesc: e.target.options[e.target.selectedIndex].label })
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
                                                            setError({ ...error, nbrGroup: "" })
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
                                                        }}>
                                                        <option key="msng" value="">Select Number Group</option>
                                                        {
                                                            mobileServiceNumberLookup.map((e) => {
                                                                if (e.mapping && e.mapping['prod_type'].includes(serviceData.prodType)) {
                                                                    return <option key={e.code} value={e.code}>{e.description}</option>
                                                                }
                                                            })
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
                                                            onChange={e => {
                                                                setError({ ...error, serviceNumberSelection: "" })
                                                                setMobileService({ ...mobileService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Auto from Pool', accessNbr: '' })
                                                            }
                                                            }
                                                        />
                                                        <label htmlFor="mobileAccessNbrRadio1">Auto Selection from Pool</label>
                                                    </div>
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="mobileAccessNbrRadio2" className="form-check-input" name="mobileOptAccessNbrSelection" value='manual'
                                                            checked={(mobileService.serviceNumberSelection === 'manual')}
                                                            onChange={e => {
                                                                setError({ ...error, serviceNumberSelection: "" })
                                                                setMobileService({ ...mobileService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Manual Selection', accessNbr: '' })
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
                                                                    setError({ ...error, accessNbr: "" })
                                                                    setMobileService({ ...mobileService, accessNbr: e.target.value })
                                                                }}
                                                            />
                                                            <span className="errormsg">{error.accessNbr ? error.accessNbr : ""}</span>
                                                        </div>
                                                        <div className="col-6 pl-0 ml-0 col-4 mt-4">
                                                            <button type="button" className="btn btn-primary btn-sm waves-effect waves-light ml-2" onClick={() => handleSubmit(mobileService.accessNbr, mobileService.nbrGroup)}>Search</button>
                                                            <button type="button" className="btn btn-secondary btn-sm waves-effect waves-light ml-2" onClick={handleClearMobile}>Clear</button>
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
                                                                :
                                                                <h5 className="errormsg ml-2">No unallocated access numbers available, please change search criteria</h5>
                                                            :
                                                            <></>
                                                    }
                                                </>
                                                :
                                                <></>
                                        }
                                        <div className="row mt-2">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="creditProfileMobile" className="col-form-label">Credit Profile<span>*</span></label>
                                                    <select id="creditProfileMobile" className={`form-control ${(error.creditProfile ? "input-error" : "")}`} value={creditProfile.creditProfile}
                                                        onChange={e => {
                                                            setCreditProfile({ ...creditProfile, creditProfile: e.target.value, creditProfileDesc: e.target.options[e.target.selectedIndex].label });
                                                            setError({ ...error, creditProfile: "" })
                                                        }}>
                                                        <option key="cprfmobile" value="">Select Credit Profile</option>
                                                        {
                                                            creditProfileLookup.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{error.creditProfile ? error.creditProfile : ""}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">GSM Details</h5>
                                        </div>
                                        <div className="row ml-0 mt-2">
                                            <div className="ml-0 row col-12 label-align">
                                                <ReactSwitch
                                                    onColor="#f58521"
                                                    offColor="#6c757d"
                                                    activeBoxShadow="0px 0px 1px 5px rgba(245, 133, 33, 0.7)"
                                                    height={20}
                                                    width={48}
                                                    className={`${(error.assignSIMLater ? "input-error" : "")}`} id="sameAsCustomerAddressSwitch" checked={gsm.assignSIMLater}
                                                    onChange={e => {
                                                        if (e === true) {
                                                            setGSM({ ...gsm, assignSIMLater: e, iccid: "", confirmiccid: "", imsi: "" });
                                                        }
                                                        else {
                                                            setGSM({ ...gsm, assignSIMLater: e });
                                                        }
                                                   
                                                        if (e === true) {
                                                            setError({ ...error, iccid: "", confirmiccid: "", imsi: "" })
                                                        }
                                                    }} />
                                                <label htmlFor="sameAsCustomerAddressSwitch" className="mt-0 pt-0 ml-2 col-form-label">Assign SIM Later</label>
                                            </div>
                                            <span className="errormsg">{error.assignSIMLater ? error.assignSIMLater : ""}</span>
                                        </div>
                                        <div className="row mt-1">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="iccid" className="col-form-label">ICCID<span>*</span></label>
                                                    <input disabled={gsm.assignSIMLater} type={iccidFocus ? "text" : "password"} className={`form-control ${(error.iccid ? "input-error" : "")}`} id="iccid" placeholder="ICCID" value={gsm.iccid}
                                                        onKeyPress={(e) => { validateNumber(e) }}
                                                        onPaste={(e) => handlePaste(e)}
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
                                                        onKeyPress={(e) => { validateNumber(e) }}
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
                                    </>
                                    :
                                    <></>
                            }
                            {
                                (serviceData.prodType !== 'Prepaid') ?
                                    <>
                                        <div className="col-12 pl-2 bg-light border mt-2">
                                            <h5 className="text-primary">Deposit</h5>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-md-2 mt-1">
                                                <div className="form-group">
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="radio5" className="form-check-input" name="optDeposit" value="include"
                                                            checked={(deposit.includeExclude === 'include')}
                                                            onChange={e => {
                                                                setError({ ...error, includeExclude: "" })
                                                                setDeposit({ ...deposit, includeExclude: e.target.value })
                                                            }} />
                                                        <label htmlFor="radio5">Include</label>
                                                    </div>
                                                    <span className="errormsg">{error.includeExclude ? error.includeExclude : ""}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-2 mt-1">
                                                <div className="form-group">
                                                    <div className="radio radio-primary mb-2">
                                                        <input type="radio" id="radio6" className="form-check-input" name="optDeposit" value="exclude"
                                                            checked={(deposit.includeExclude === 'exclude')}
                                                            onChange={e => {
                                                                setError({ ...error, includeExclude: "" })
                                                                setDeposit({ ...deposit, includeExclude: e.target.value })
                                                            }} />
                                                        <label htmlFor="radio6">Exclude</label>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                (deposit.includeExclude === 'include') ?
                                                    <>
                                                        <div className="col-md-3 mt-0 pt-0">
                                                            <div className="form-group">
                                                                <label htmlFor="charge"
                                                                    className="col-form-label">Charge<span>*</span></label>
                                                                <select id="charge" className={`form-control ${(error.charge ? "input-error" : "")}`} value={deposit.charge}
                                                                    onChange={e => {
                                                                        setDeposit({ ...deposit, charge: e.target.value, chargeDesc: e.target.options[e.target.selectedIndex].label });
                                                                        setError({ ...error, charge: "" })
                                                                    }}>
                                                                    <option key="depchg" value="">Select Charge</option>
                                                                    {
                                                                        depositChargeLookup.map((e) => (
                                                                            <option key={e.code} value={e.code}>{e.description}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                                <span className="errormsg">{error.charge ? error.charge : ""}</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (deposit.includeExclude === 'exclude') ?
                                                    <>
                                                        <div className="col-md-3 mt-0 pt-0">
                                                            <div className="form-group">
                                                                <label htmlFor="excludeReason" className="col-form-label">Exclude Reason<span>*</span></label>
                                                                <input type="text" className={`form-control ${(error.excludeReason ? "input-error" : "")}`} id="excludeReason" placeholder="Exclude Reason" value={deposit.excludeReason}
                                                                    onChange={e => {
                                                                        setDeposit({ ...deposit, excludeReason: e.target.value });
                                                                        setError({ ...error, excludeReason: '' })

                                                                    }} />
                                                                <span className="errormsg">{error.excludeReason || !validate.excludeReason ? validate.excludeReason && !error.excludeReason ? "" : error.excludeReason ? error.excludeReason : "Please enter characters only" : ""}</span>
                                                            </div>
                                                        </div>

                                                    </>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                    </>
                                    :
                                    <></>
                            }

                            <div className="col-12 pl-2 bg-light border mt-2">
                                <h5 className="text-primary">Payment Method</h5>
                            </div>

                            <div className="row mt-2">
                                <div className="col-md-3 mt-0 pt-0">
                                    <div className="form-group">
                                        <label htmlFor="paymentMethod" className="col-form-label">Payment Method<span>*</span></label>
                                        <select id="paymentMethod" className={`form-control ${(error.paymentMethod ? "input-error" : "")}`} value={payment.paymentMethod}
                                            onChange={e => {
                                                setPayment({ ...payment, paymentMethod: e.target.value, paymentMethodDesc: e.target.options[e.target.selectedIndex].label });
                                                setError({ ...error, paymentMethod: "" })
                                            }}>
                                            <option key="pmthd" value="">Select Payment Method</option>
                                            {
                                                paymentMethodLookup.map((e) => (
                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                ))
                                            }
                                        </select>
                                        <span className="errormsg">{error.paymentMethod ? error.paymentMethod : ""}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 pl-2 bg-light border mt-2">
                                <h5 className="text-primary">Portin<span></span></h5>
                            </div>
                            <div className="row ml-0 mt-2">
                                <div className="col-md-4">
                                    <ReactSwitch
                                        onColor="#f58521"
                                        offColor="#6c757d"
                                        activeBoxShadow="0px 0px 1px 5px rgba(245, 133, 33, 0.7)"
                                        height={20}
                                        width={48}
                                        id="portInSwitch" checked={portIn.portInChecked}
                                        onChange={() => setPortIn({ ...portIn, portInChecked: !portIn.portInChecked })}
                                    />
                                    <label htmlFor="portInSwitch" className="mt-0 pt-0 ml-2 col-form-label d-inline" style={{ verticalAlign: "super" }}>Port In</label>
                                </div>
                                {
                                    portIn.portInChecked &&
                                    <div className="col-2">
                                        <label className="col-form-label">Donor</label>
                                        <select id="portinDonor" className="form-control" onChange={(e) => setPortIn({ ...portIn, donor: e.target.value, donorDesc: e.target.options[e.target.selectedIndex].label })} value={portIn.donor}>
                                            <option key="donor" value="">Select Donor</option>
                                            <option key="dst" value="1">DST</option>
                                            <option key="progresif" value="2">Progresif</option>
                                        </select>
                                    </div>
                                }
                            </div>

                        </div>
                        :
                        <></>
                }
            </form>
        </>
    )
}
export default ServiceDetailsForm;