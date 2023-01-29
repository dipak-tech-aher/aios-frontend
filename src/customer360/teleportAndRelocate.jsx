import React, { useEffect, useState, useRef, useCallback } from 'react';
import { hideSpinner, showSpinner } from '../common/spinner';
import { properties } from '../properties';
import { get, post, put } from '../util/restUtil';
import TeleportAddressForm from '../customer/addressForm';
import { useTranslation } from "react-i18next";
import AccessNumberList from "../customer/accessNumberList";

import { string, object } from "yup";
import { toast } from 'react-toastify';

import { validateNumber, handlePaste } from "../util/validateUtil";
import AddressPreview from '../customer/addressPreview';

const addressValidationSchema = object().shape({
    flatHouseUnitNo: string().required("Flat/House/Unit No is required"),
    street: string().required("Street is required"),
    road: string().required("Road is required"),
    district: string().required("District is required"),
    village: string().required("Kampong is required"),
    cityTown: string().required("City/Town is required"),
    postCode: string().required("Postcode is required"),
    country: string().required("Country is required")
});

const fixedServiceValidationSchema = object().shape({
    serviceNumberSelection: string().required("Service Number Selection is required"),
    serviceNumberGroup: string().required("Service Number Group is required"),
    exchangeCode: string().required("Exchange Code is required"),
    accessNbr: string().when("serviceNumberSelection", {
        is: "manual",
        then: string().required("Access Number is required")
    }
    )
});

const TeleportAndRelocate = (props) => {

    const selectedAccount = props.data.selectedAccount
    const serviceDetails = props.data.serviceDetails
    const interactionData = props.data.interactionData
    const handleServicePopupClose = props.handler.handleServicePopupClose
    const setRefreshServiceRequest = props.handler.setRefreshServiceRequest
    const setRefreshPage = props.handler.setRefreshPage
    const { t } = useTranslation();

    const [error, setError] = useState({});

    const [serviceValidate, setServiceValidate] = useState({
        flatNo: true,
        block: true,
        building: true,
        simpang: true,
        jalan: true,
        mukim: true,
        city: true
    })
    const initialValues = {
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
    }
    const [teleportAddress, setTeleportAddress] = useState(initialValues)

    const [fixedBBServiceNumberLookup, setFixedBBServiceNumberLookup] = useState([{}])
    const [exchangeCodeLookup, setExchangeCodeLookup] = useState([{}])
    const [districtLookup, setDistrictLookup] = useState({})
    const [kampongLookup, setKampongLookup] = useState({})
    const [postCodeLookup, setPostCodeLookup] = useState({})
    const [show, setShow] = useState(null)

    const [refreshAfterSubmit, setRefreshAfterSubmit] = useState(false)

    const [teleportRelocate, setTeleportRelocate] = useState('TELEPORT')

    const [teleportAddressError, setTeleportAddressError] = useState({})

    const lookupData = useRef({})
    const addressLookup = useRef({})
    const plansList = useRef({})

    const [fixedService, setFixedService] = useState({
        serviceNumberSelection: '',
        serviceNumberSelectionDesc: '',
        serviceNumberGroup: '',
        serviceNumberGroupDesc: '',
        exchangeCode: '',
        exchangeCodeDesc: '',
        accessNbr: ''
    });

    const [display, setDisplay] = useState(false)
    const [suggestion, setSuggestion] = useState(true)
    const [accessNumbers, setAccessNumbers] = useState([])


    useEffect(() => {

        let plans = []
        showSpinner();
        get(properties.SERVICE_BADGE_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
            .then((resp) => {
                if (resp.data && resp.data.badge !== undefined) {
                    if ((['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'TELEPORT', 'RELOCATE', 'TERMINATE'].includes(resp.data.badge))) {
                        if (interactionData && interactionData.length > 0 && (interactionData[0].woType === 'TELEPORT' || interactionData[0].woType === 'RELOCATE') && interactionData[0].currStatus === 'CLOSED') {
                            setShow(true)
                        }
                        else {
                            get(`${properties.CONNECTION_TELEPORTANDRELOCATE_API}/${selectedAccount.accountId}?type=${resp.data.badge}`)
                                .then((response) => {
                                    if (response.data) {
                                        addressLookup.current = response.data[0];
                                        setShow(false);
                                    }
                                })
                        }
                    } else {
                        post(properties.BUSINESS_ENTITY_API, [
                            'FXD_BB_SERVICE_NUMBER_GROUP',
                            'EXCHANGE_CODE',
                        ])
                            .then((resp) => {
                                if (resp.data) {
                                    lookupData.current = resp.data
                                    get(properties.ADDRESS_LOOKUP_API)
                                        .then(async (resp) => {
                                            if (resp && resp.data) {
                                                addressLookup.current = resp.data
                                                get(properties.PLANS_API)
                                                    .then((resp) => {
                                                        if (resp && resp.data) {
                                                            plansList.current = resp.data
                                                            for (let p of plansList.current) {
                                                                if (p.planType === 'BASE') {
                                                                    plans.push(p)
                                                                }
                                                            }
                                                        }
                                                    });
                                                setShow(true)
                                            }
                                        });
                                    setFixedBBServiceNumberLookup(lookupData.current['FXD_BB_SERVICE_NUMBER_GROUP'])
                                    setExchangeCodeLookup(lookupData.current['EXCHANGE_CODE'])
                                }
                            })
                    }
                }
            }).finally(() => {
                hideSpinner();
            });
    }, [refreshAfterSubmit]);

    const validate = (section, schema, data) => {
        try {
            if (section === 'ADDRESS') {
                setTeleportAddressError({})
            }
            if (section === 'FIXEDSERVICE') {
                setError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'ADDRESS') {
                    setTeleportAddressError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
                if (section === 'FIXEDSERVICE') {
                    setError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };

    const validateAddressDetails = () => {
        let error = validate('ADDRESS', addressValidationSchema, teleportAddress);
        if (error) {
            toast.error("Validation errors found for Address Details. Please check highlighted fields");
            return false;
        }
        return true;
    }

    const validateFixedServiceDetails = () => {
        let error = validate('FIXEDSERVICE', fixedServiceValidationSchema, fixedService);
        if (error) {
            toast.error("Validation errors found for Service Details. Please check highlighted fields");
            return false;
        }
        return true;
    }

    const addressChangeHandler = (field, value) => {
    }

    const serviceDetailsHandler = (e) => {
        const { id, value } = e.target
        setFixedService({
            ...fixedService,
            [id]: value
        })
    }

    let array = []
    let array2 = []
    let array3 = []
    let temp = []

    const handleAccessNumberSearch = (id, category) => {

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
                    //onSuggestionsFetchRequested({})
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
        }
    }

    const handleClearFixed = () => {
        setDisplay(false)
        setFixedService({ ...fixedService, accessNbr: "" })
        setAccessNumbers([])
    }

    const handleTeleportRelocateChange = (value) => {
        if (value === 'TELEPORT') {
            setFixedService({
                serviceNumberSelection: '',
                serviceNumberSelectionDesc: '',
                serviceNumberGroup: '',
                serviceNumberGroupDesc: '',
                exchangeCode: '',
                exchangeCodeDesc: '',
                accessNbr: ''
            })
        }
        setTeleportRelocate(value)
    }

    const handleSubmit = () => {

        if (teleportRelocate === 'RELOCATE') {
            if (!validateAddressDetails()) {
                return false
            }

            if (!validateFixedServiceDetails()) {
                return false
            }
        } else if (teleportRelocate === 'TELEPORT') {
            if (!validateAddressDetails()) {
                return false
            }
        } else {
            return false
        }
        showSpinner();
        put(properties.TELEPORT_RELOCATE_API, {
            customerId: selectedAccount.customerId,
            accountId: selectedAccount.accountId,
            serviceId: serviceDetails.serviceId,
            teleportRelocate: teleportRelocate,
            ...teleportAddress,
            ...fixedService
        })
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Teleport/Relocate Service Request " + resp.data.serviceRequest.intxnId + ' created successfully');
                        setRefreshAfterSubmit(true)
                        setRefreshServiceRequest((prevState) => (!prevState))
                        handleServicePopupClose()
                        //window.location.reload(false)
                        setRefreshPage((prevState) => (!prevState))
                    } else {
                        toast.error("Failed to create - " + resp.status);
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            }).finally(hideSpinner);
        /********TEST SECTION********
        hideSpinner();
        setRenderMode({
            ...renderMode,
            submitted: 'yes',
            printButton: 'show',
            submitAndPreviewButton: 'hide',
            submitButton: 'hide',
            previewCancelButton: 'hide',
            previewButton: 'show',
            previewCloseButton: 'show',
            customerDetailsEditButton: 'hide',
            accountDetailsEditButton: 'hide',
            serviceDetailsEditButton: 'hide'
        })        
        setNewCustomerDetails({
            customerId: 135
        })
        ********TEST SECTION********/
        /********TEST SECTION********/
        // hideSpinner();
        // toast.error('Test Error')
        // setRenderMode({
        //     ...renderMode,
        //     printButton: 'hide',
        //     submitButton: 'hide',
        //     previewCancelButton: 'hide',
        //     previewAndSubmitButton: 'show'
        // })
        // setNewCustomerDetails({
        //     customerId: 135
        // })
        /********TEST SECTION********/

    }

    return (
        <div className="row p-0 card border">
            <section className="triangle">
                <div className="row col-12">
                    <h5 id="list-item-2" className="pl-1">Teleport / Relocation</h5>
                </div>
            </section>
            {
                (show !== null && show === true) ?
                    <>

                        <div className="d-flex flex-row pt-2 pl-2">
                            <div className="col-md-2 pl-0">
                                <div className="form-group">
                                    <div className="radio radio-primary mb-2">
                                        <input type="radio" id="radio1" className="form-check-input" name="optTeleportRelocate" value='TELEPORT'
                                            checked={'TELEPORT' === teleportRelocate} onChange={e => {
                                                setError({})
                                                setTeleportAddressError({})
                                                setTeleportAddress(initialValues)
                                                handleTeleportRelocateChange(e.target.value);
                                            }} />
                                        <label htmlFor="radio1">{t("teleport")}</label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="form-group">
                                    <div className="radio radio-primary mb-2">
                                        <input type="radio" id="radio2" className="form-check-input" name="optTeleportRelocate" value='RELOCATE'
                                            checked={'RELOCATE' === teleportRelocate} onChange={e => {
                                                setError({})
                                                setTeleportAddressError({})
                                                setTeleportAddress(initialValues)
                                                handleTeleportRelocateChange(e.target.value);
                                            }} />
                                        <label htmlFor="radio2">{t("relocate")}</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <TeleportAddressForm
                            data={teleportAddress}
                            lookups={{
                                districtLookup: districtLookup,
                                kampongLookup: kampongLookup,
                                postCodeLookup: postCodeLookup,
                                addressElements: addressLookup.current
                            }}
                            error={teleportAddressError}
                            setError={setTeleportAddressError}
                            setDetailsValidate={setServiceValidate}
                            detailsValidate={serviceValidate}
                            lookupsHandler={{
                                addressChangeHandler: addressChangeHandler
                            }}
                            handler={setTeleportAddress}
                        />

                        {
                            (teleportRelocate === 'RELOCATE') ?
                                <>
                                    <div className="row col-12">
                                        <div className="col-12 pl-2 bg-light border">
                                            <h5 className="text-primary">New Service Details</h5>
                                        </div>
                                    </div>
                                    <div className="row pl-2">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label for="serviceNumberGroup" className="col-form-label">Service Number Group</label>
                                                <select id="serviceNumberGroup" className={`form-control ${(error.serviceNumberGroup ? "input-error" : "")}`}
                                                    value={fixedService.serviceNumberGroup}
                                                    onChange={(e) => { serviceDetailsHandler(e); setError({ ...error, serviceNumberGroup: "" }) }}>
                                                    <option value="">Select Service Number Group</option>
                                                    {
                                                        fixedBBServiceNumberLookup && fixedBBServiceNumberLookup.map((e) => (
                                                            <option key={e.code} value={e.code}>{e.description}</option>
                                                        ))
                                                    }
                                                </select>
                                                <span className="errormsg">{error.serviceNumberGroup ? error.serviceNumberGroup : ""}</span>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label for="exchangeCode" className="col-form-label">Exchange Code</label>
                                                <select id="exchangeCode" className={`form-control ${(error.exchangeCode ? "input-error" : "")}`}
                                                    value={fixedService.exchangeCode}
                                                    onChange={(e) => { serviceDetailsHandler(e); setError({ ...error, exchangeCode: "" }) }}>
                                                    <option value="">Select Exchange Code</option>
                                                    {
                                                        exchangeCodeLookup && exchangeCodeLookup.map((e) => (
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
                                            <div className="d-flex ml-2">
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
                                                            // setAccessNumbers([])
                                                            setFixedService({ ...fixedService, serviceNumberSelection: e.target.value, serviceNumberSelectionDesc: 'Manual Selection', accessNbr: '' })
                                                        }
                                                        }
                                                    />
                                                    <label htmlFor="fixedAccessNbrRadio2">Manual Selection from Pool</label>
                                                </div>
                                            </div>
                                            <span className="errormsg ml-2">{error.serviceNumberSelection ? error.serviceNumberSelection : ""}</span>
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
                                                        // onBlur={(e) => {
                                                        //         if(e.target.value && e.target.value.length === 7) {
                                                        //             handleVerify(serviceData.prodType, e.target.value)                                                                            
                                                        //         }
                                                        //     }
                                                        // }
                                                        />
                                                        <span className="errormsg">{error.accessNbr ? error.accessNbr : ""}</span>
                                                    </div>
                                                    <div className="col-md-6 pl-0 ml-0 col-md-4 mt-4">
                                                        <button type="button" className="btn btn-primary btn-sm waves-effect waves-light ml-2" onClick={() => handleAccessNumberSearch(fixedService.accessNbr, fixedService.serviceNumberGroup)}>Search</button>
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
                                                                    prodType={serviceDetails.prodType}
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
                                </>
                                :
                                <></>
                        }

                        <div className="row justify-content-center mt-3">
                            {
                                (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE', 'TERMINATE'].includes(serviceDetails.badge)) ?
                                    <button type="button" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                                    :
                                    (interactionData && interactionData.length > 0 && (interactionData[0].woType === 'TELEPORT' || interactionData[0].woType === 'RELOCATE') && interactionData[0].currStatus === 'CLOSED') ?
                                        <button type="button" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                                        :
                                        <button disabled="disabled" type="button" className="btn btn-primary mr-2">Submit</button>
                            }

                        </div>
                    </>
                    :
                    <></>
            }
            {
                (show !== null && show === false) ?
                    <>
                        <h5 className="errormsg ml-2">Teleport/Relocate not available, another Service Request is in process</h5>
                        <AddressPreview
                            data={{
                                addressData: {
                                    ...addressLookup.current,
                                    flatHouseUnitNo: addressLookup.current.hno,
                                    building: addressLookup.current.buildingName,
                                    village: addressLookup.current.town,
                                    cityTown: addressLookup.current.city
                                },
                                title: 'Customer Address'
                            }}
                        />
                        {
                            addressLookup.current.status === 'PENDING-RELOCATE' &&
                            <>
                                <div className="form-row col-12">
                                    <div className="col-12 pl-2 bg-light border">
                                        <h5 className="text-primary">Service Number Details</h5>
                                    </div>
                                </div>
                                <div className="row mx-1">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Service Number Group</label>
                                            <p>{addressLookup.current.connectionGrp}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Exchange Code</label>
                                            <p>{addressLookup.current.exchngCode ? addressLookup.current.exchngCode : "-"}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row col-12">
                                    <div className="col-12 pl-2 bg-light border">
                                        <h5 className="text-primary">Access Number Selection</h5>
                                    </div>
                                </div>
                                <div className="row mx-1">
                                    {
                                        (addressLookup.current.identificationNo === null) ?
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="inputState" className="col-form-label">Auto Selection from Pool</label>
                                                    <p><strong>Yes</strong></p>
                                                </div>
                                            </div>
                                            :
                                            <>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="inputState" className="col-form-label">Manual Selection from Pool</label>
                                                        <p><strong>Yes</strong></p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="inputState" className="col-form-label">Access Number</label>
                                                        <p><strong>{serviceDetails.accessNbr}</strong></p>
                                                    </div>
                                                </div>
                                            </>
                                    }
                                </div>
                            </>
                        }
                    </>
                    :
                    <></>
            }
        </div>
    )
}

export default TeleportAndRelocate;