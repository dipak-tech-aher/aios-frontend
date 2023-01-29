import React, { useState, useRef, useEffect } from 'react'
import NewCustomerPreviewModal from 'react-modal'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";
//import * as yup from "yup";
import { useReactToPrint } from 'react-to-print';
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import ServiceDetailsPreview from '../customer/serviceDetailsPreview';
import ServiceRequestList from './serviceRquestList'

import { es } from 'date-fns/esm/locale';
import ServiceDetailsChangeForm from './serviceDetailsChangeForm';
import NewCustomerPreview from '../customer/newCustomerPreview';
import ChangeServicePreviewDetails from './changeServiceDetailsPreview';

const idNbrRegexPattern = /[0-9]{2}-[0-9]{6}/
const icIdTypes = ['ICGREEN', 'ICRED', 'ICYELLOW']

const addressValidationSchema = object().shape({
    flatHouseUnitNo: string().required("Flat/House/Unit No is required"),
    street: string().required("Street is required"),
    road: string().required("Road is required"),
    district: string().required("District is required"),
    village: string().required("Kampong is required"),
    cityTown: string().required("City/Town is required"),
    postCode: string().required("Postcode is required")
});

const validateDateFormat = (value) => {
    try {
        Date.parse(value)
        return true
    } catch (e) {
        return false
    }
}

const fixedServiceValidationSchema = object().shape({
    serviceNumberSelection: string().required("Service Number Selection is required"),
    serviceNumberGroup: string().required("Service Number Group is required"),
    exchangeCode: string().required("Exchange Code is required")
});

const mobileServiceValidationSchema = object().shape({
    serviceNumberSelection: string().required("Service Number Selection is required"),
    nbrGroup: string().required("Number Group is required"),
    dealership: string().required("Dealership is required")
});



function ServiceNumberChange(props) {
    let serviceDetails = props.data.serviceDetails
    let planId = serviceDetails.plans[0].planId
    let prodType = serviceDetails.plans[0].prodType
    const handleServicePopupClose = props.handleServicePopupClose
    const setRefreshPage = props.setRefreshPage
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // let found = false;
    const [found, setFound] = useState(false)
    const { t } = useTranslation();

    const [leftNavCounts, setLeftNavCounts] = useState({})
    const [serviceDetailsError, setServiceDetailsError] = useState({});

    const [newCustomerPreviewModalState, setNewCustomerPreviewModalState] = useState({ state: false })

    const [renderMode, setRenderMode] = useState({

        serviceDetails: 'form',
        previewAndSubmitButton: 'show',
        previewButton: 'hide',
        previewCloseButton: 'hide',
        submitButton: 'hide',
        previewCancelButton: 'hide',
        customerDetailsEditButton: 'show',
        accountDetailsEditButton: 'show',
        serviceDetailsEditButton: 'show',
        submitted: 'no'
    })

    const [doneStatus, setDoneStatus] = useState({
        customer: false,
        account: false,
        service: false
    })

    const newCustomerData = useRef({})

    const [newCustomerDetails, setNewCustomerDetails] = useState({})

    const [selectedCustomerType, setSelectedCustomerType] = useState('RESIDENTIAL')



    const [serviceData, setServiceData] = useState({
        catalog: '',
        catalogDesc: '',
        product: '26',
        productDesc: '',
        prodType: 'Fixed'
    });

    const [installationAddress, setInstallationAddress] = useState({
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
    });

    const [fixedService, setFixedService] = useState({
        serviceNumberSelection: '',
        serviceNumberSelectionDesc: '',
        serviceNumberGroup: '',
        serviceNumberGroupDesc: '',
        exchangeCode: '',
        exchangeCodeDesc: '',
        accessNbr: ''
    });

    const [mobileService, setMobileService] = useState({
        serviceNumberSelection: '',
        serviceNumberSelectionDesc: '',
        dealership: '',
        dealershipDesc: '',
        nbrGroup: '',
        nbrGroupDesc: '',
        accessNbr: ''
    });

    const [creditProfile, setCreditProfile] = useState({
        creditProfile: '',
        creditProfileDesc: ''
    });

    const [gsm, setGSM] = useState({
        assignSIMLater: false,
        iccid: '',
        confirmiccid: '',
        imsi: ''
    });

    const [deposit, setDeposit] = useState({
        includeExclude: '',
        charge: '',
        chargeDesc: '',
        excludeReason: ''
    });

    const [payment, setPayment] = useState({
        paymentMethod: '',
        paymentMethodDesc: ''
    });

    const [portIn, setPortIn] = useState({
        portInChecked: false,
        donor: '',
        donorDesc: '',
    });

    const lookupData = useRef({})
    const addressLookup = useRef({})
    const plansList = useRef({})
    const catalogList = useRef({})

    const [districtLookup, setDistrictLookup] = useState([{}])
    const [kampongLookup, setKampongLookup] = useState([{}])
    const [postCodeLookup, setPostCodeLookup] = useState([{}])
    const [catalogLookup, setCatalogLookup] = useState([{}])
    const [productLookup, setProductLookup] = useState([{}])
    const [fixedBBServiceNumberLookup, setFixedBBServiceNumberLookup] = useState([{}])
    const [mobileServiceNumberLookup, setMobileServiceNumberLookup] = useState([{}])
    const [exchangeCodeLookup, setExchangeCodeLookup] = useState([{}])
    const [dealershipLookup, setDealershipLookup] = useState([{}])
    const [creditProfileLookup, setCreditProfileLookup] = useState([{}])
    const [depositChargeLookup, setDepositChargeLookup] = useState([{}])
    const [paymentMethodLookup, setPaymentMethodLookup] = useState([{}])
    const [donorLookup, setDonorLookup] = useState([{}])

    useEffect(() => {
        let district = []
        let kampong = []
        let postCode = []
        let plans = []

        showSpinner();
        post(properties.BUSINESS_ENTITY_API, [
            'CATALOGUE',
            'FXD_BB_SERVICE_NUMBER_GROUP',
            'MOBILE_SERVICE_NUMBER_GROUP',
            'EXCHANGE_CODE',
            'DEALERSHIP',
            'CREDIT_PROFILE',
            'DEPOSIT_CHARGE',
            'PAYMENT_METHOD'])
            .then((resp) => {
                if (resp.data) {
                    lookupData.current = resp.data
                    get(properties.ADDRESS_LOOKUP_API)
                        .then((resp) => {
                            if (resp && resp.data) {
                                addressLookup.current = resp.data
                                for (let e of addressLookup.current) {
                                    if (!district.includes(e.district)) {
                                        district.push(e.district)
                                    }
                                    if (!kampong.includes(e.kampong)) {
                                        kampong.push(e.kampong)
                                    }
                                    if (!postCode.includes(e.postCode)) {
                                        postCode.push(e.postCode)
                                    }
                                }

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
                            }
                        });

                    catalogList.current = lookupData.current['CATALOGUE']
                    setFixedBBServiceNumberLookup(lookupData.current['FXD_BB_SERVICE_NUMBER_GROUP'])
                    setMobileServiceNumberLookup(lookupData.current['MOBILE_SERVICE_NUMBER_GROUP'])
                    setExchangeCodeLookup(lookupData.current['EXCHANGE_CODE'])
                    setDealershipLookup(lookupData.current['DEALERSHIP'])
                    setCreditProfileLookup(lookupData.current['CREDIT_PROFILE'])
                    setDepositChargeLookup(lookupData.current['DEPOSIT_CHARGE'])
                    setPaymentMethodLookup(lookupData.current['PAYMENT_METHOD'])
                    setDistrictLookup(district)
                    setKampongLookup(kampong)
                    setPostCodeLookup(postCode)
                    handleCustomerTypeChange(selectedCustomerType)

                    //resp.data['PRIORITY'].forEach((e) => priority.push(e))

                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    hideSpinner();

                }
            }).finally();

    }, []);


    const validate = (section, schema, data) => {
        try {

            if (section === 'SERVICE') {
                setServiceDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'SERVICE') {
                    setServiceDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };



    const handleCustomerTypeChange = (value) => {
        const catalog = []
        for (let c of catalogList.current) {
            if (c.mapping.customerType === value) {
                catalog.push({
                    code: c.code,
                    description: c.description
                })
            }
        }
        setCatalogLookup(catalog)
        setProductLookup([{}])
        setServiceData({
            catalog: '',
            catalogDesc: '',
            product: planId,
            productDesc: '',
            prodType: prodType
        })
        setSelectedCustomerType(value)
        setRenderMode({
            ...renderMode,
            customerDetails: 'form',
            accountDetails: 'form',
            serviceDetails: 'form',
            previewAndSubmitButton: 'show'
        })
    }


    const handleServiceDetailsCancel = () => {
        setRenderMode({
            ...renderMode,
            serviceDetails: 'view'
        })
    }

    const handleServiceDetailsDone = () => {
        if (setServiceDetails()) {
            setRenderMode({
                ...renderMode,
                serviceDetails: 'view'
            })
        }
    }

    const setServiceDetails = () => {
        //let error;
        // let error = validate('SERVICE', serviceDataValidationSchema, serviceData);
        // if (error) {
        //     toast.error("Validation errors found. Please check highlighted fields");
        //     return false;
        // }
        if (serviceData.prodType === 'Fixed') {

            if (!installationAddress.sameAsCustomerAddress) {
                let error = validate('SERVICE', addressValidationSchema, installationAddress);
                if (error) {
                    toast.error("Validation errors found. Please check highlighted fields");
                    return false;
                }
            }
            let error = validate('SERVICE', fixedServiceValidationSchema, fixedService);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') {
            let error = validate('SERVICE', mobileServiceValidationSchema, mobileService);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }

        }

        // if ((serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') && !gsm.assignSIMLater) {
        //     get(properties.ICCID_API + "/" + gsm.iccid)
        //         .then((resp) => {
        //             if (resp.data) {
        //                 if (resp.data.statusCode === "SUCCESS-001") {
        //                     if (resp.data.iccidDetails.imsi && resp.data.iccidDetails.imsi !== '') {
        //                         setGSM({ ...gsm, imsi: resp.data.iccidDetails.imsi })
        //                     } else {
        //                         setGSM({ ...gsm, imsi: '' })
        //                         toast.error('Unable to find IMSI for given ICCID')
        //                         return false
        //                     }
        //                 }
        //                 else {
        //                     toast.error(resp.data.statusMsg)
        //                     return false
        //                 }
        //             }
        //         })
        //         .catch((err) => {
        //             toast.error("Error while validating ICCID")
        //             return false
        //         })
        // }

        if (fixedService.serviceNumberSelection === 'manual' || mobileService.serviceNumberSelection === 'manual') {
            let accessNbr
            let category
            if (serviceData.prodType === 'Fixed') {
                if (fixedService.accessNbr === undefined || isNaN(fixedService.accessNbr) || fixedService.accessNbr === '') {
                    toast.error('Access Number is mandatory when Number Selection is Manual')
                    return false
                }
                accessNbr = fixedService.accessNbr
                category = fixedService.serviceNumberGroup
            } else if (serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') {
                if (mobileService.accessNbr === undefined || isNaN(mobileService.accessNbr) || mobileService.accessNbr === '') {
                    toast.error('Access Number is mandatory when Number Selection is Manual')
                    return false
                }
                accessNbr = mobileService.accessNbr
                category = mobileService.nbrGroup
            } else {
                toast.error('Unknown error validating Access Number and Group relationship')
                return false
            }
            showSpinner()
            get(properties.ACCESS_NUMBER + "?id=" + accessNbr + "&category=" + category)
                .then((resp) => {
                    if (resp.data) {
                        if (serviceData.prodType === 'Fixed') {
                            if (resp.data.length !== 1 || resp.data[0].category !== fixedService.serviceNumberGroup) {
                                toast.error('Selected Access Number does not belong to selected Number Group')
                                return false
                            }
                        } else if (serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') {
                            if (resp.data.length !== 1 || resp.data[0].category !== mobileService.nbrGroup) {
                                toast.error('Selected Access Number does not belong to selected Number Group')
                                return false
                            }
                        } else {
                            toast.error('Error validating Access Number and Group relationship')
                            return false
                        }
                    } else {
                        toast.error('Error validating Access Number and Group relationship ' + resp.statusCode)
                        return false
                    }
                }).finally(hideSpinner)
        }


        if (!newCustomerData.current.customer) {
            newCustomerData.current.customer = {}
        }
        if (!newCustomerData.current.customer.account) {
            newCustomerData.current.customer.account = []
            newCustomerData.current.customer.account.push({})
        }

        if (!newCustomerData.current.customer.account[0].service) {
            newCustomerData.current.customer.account[0].service = []
            newCustomerData.current.customer.account[0].service.push({})
        }
        newCustomerData.current.customer.account[0].service[0].catalog = serviceData.catalog
        newCustomerData.current.customer.account[0].service[0].catalogDesc = serviceData.catalogDesc
        newCustomerData.current.customer.account[0].service[0].product = serviceData.product
        newCustomerData.current.customer.account[0].service[0].prodType = serviceData.prodType
        newCustomerData.current.customer.account[0].service[0].productDesc = serviceData.productDesc

        if (!newCustomerData.current.customer.account[0].service[0].installationAddress) {
            newCustomerData.current.customer.account[0].service[0].installationAddress = []
            newCustomerData.current.customer.account[0].service[0].installationAddress.push({})
        }
        if (installationAddress.sameAsCustomerAddress) {
            newCustomerData.current.customer.account[0].service[0].installationAddress[0] = {
                sameAsCustomerAddress: true
            }
        } else {
            newCustomerData.current.customer.account[0].service[0].installationAddress[0] = {
                flatHouseUnitNo: installationAddress.flatHouseUnitNo,
                block: installationAddress.block,
                building: installationAddress.building,
                street: installationAddress.street,
                road: installationAddress.road,
                district: installationAddress.district,
                state: installationAddress.state,
                village: installationAddress.village,
                cityTown: installationAddress.cityTown,
                country: installationAddress.country,
                postCode: installationAddress.postCode
            }
        }

        if (serviceData.prodType === 'Fixed') {
            if (!newCustomerData.current.customer.account[0].service[0].fixed) {
                newCustomerData.current.customer.account[0].service[0].fixed = {}
            }
            newCustomerData.current.customer.account[0].service[0].prodType = serviceData.prodType
            newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection = fixedService.serviceNumberSelection
            newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberGroup = fixedService.serviceNumberGroup
            newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberGroupDesc = fixedService.serviceNumberGroupDesc
            newCustomerData.current.customer.account[0].service[0].fixed.exchangeCode = fixedService.exchangeCode
            newCustomerData.current.customer.account[0].service[0].fixed.exchangeCodeDesc = fixedService.exchangeCodeDesc
            if (fixedService.serviceNumberSelection === 'manual') {
                newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection = 'manual'
                newCustomerData.current.customer.account[0].service[0].fixed.accessNbr = fixedService.accessNbr
            } else {
                newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection = 'auto'
            }
        }

        if (['Prepaid', 'Postpaid'].includes(serviceData.prodType)) {
            if (!newCustomerData.current.customer.account[0].service[0].mobile) {
                newCustomerData.current.customer.account[0].service[0].mobile = {}
            }

            newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection = mobileService.serviceNumberSelection
            newCustomerData.current.customer.account[0].service[0].mobile.nbrGroup = mobileService.nbrGroup
            newCustomerData.current.customer.account[0].service[0].mobile.nbrGroupDesc = mobileService.nbrGroupDesc
            newCustomerData.current.customer.account[0].service[0].mobile.dealership = mobileService.dealership
            newCustomerData.current.customer.account[0].service[0].mobile.dealershipDesc = mobileService.dealershipDesc
            if (mobileService.serviceNumberSelection === 'manual') {
                newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection = 'manual'
                newCustomerData.current.customer.account[0].service[0].mobile.accessNbr = mobileService.accessNbr
            } else {
                newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection = 'auto'
            }
            if (!newCustomerData.current.customer.account[0].service[0].mobile.gsm) {
                newCustomerData.current.customer.account[0].service[0].mobile.gsm = {}
            }
            if (gsm.assignSIMLater) {
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.assignSIMLater = 'Y'
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid = gsm.iccid
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi = gsm.imsi
            } else {
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.assignSIMLater = 'N'
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid = ''
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi = ''
            }
        }

        newCustomerData.current.customer.account[0].service[0].creditProfile = creditProfile.creditProfile
        newCustomerData.current.customer.account[0].service[0].creditProfileDesc = creditProfile.creditProfileDesc

        if (!newCustomerData.current.customer.account[0].service[0].deposit) {
            newCustomerData.current.customer.account[0].service[0].deposit = {}
        }

        if (deposit.includeExclude === 'include') {
            newCustomerData.current.customer.account[0].service[0].deposit.includeExclude = deposit.includeExclude
            newCustomerData.current.customer.account[0].service[0].deposit.charge = deposit.charge
            newCustomerData.current.customer.account[0].service[0].deposit.chargeDesc = deposit.chargeDesc
        }
        if (deposit.includeExclude === 'exclude') {
            newCustomerData.current.customer.account[0].service[0].deposit.includeExclude = deposit.includeExclude
            newCustomerData.current.customer.account[0].service[0].deposit.excludeReason = deposit.excludeReason
        }

        newCustomerData.current.customer.account[0].service[0].paymentMethod = payment.paymentMethod
        newCustomerData.current.customer.account[0].service[0].paymentMethodDesc = payment.paymentMethodDesc

        newCustomerData.current.customer.account[0].service[0].portIn = {};
        newCustomerData.current.customer.account[0].service[0].portIn.portInChecked = portIn.portInChecked ? "Yes" : "No";
        newCustomerData.current.customer.account[0].service[0].portIn.donor = portIn.donor

        setDoneStatus({ ...doneStatus, service: true })
        return true;
    }

    const handleServiceDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            serviceDetails: 'form'
        })
        setDoneStatus({ ...doneStatus, service: false })
    }

    const handlePreviewAndSubmit = () => {
        if (setServiceDetails()) {
            toast.success("Field validations completed successfully");
            setRenderMode({
                ...renderMode,
                customerTypeSelection: 'hide',
                customerDetails: 'view',
                accountDetails: 'view',
                serviceDetails: 'view',
                previewAndSubmitButton: 'hide',
                printButton: 'show',
                submitButton: 'show',
                previewCancelButton: 'show',
                previewCloseButton: 'hide'
            })
            NewCustomerPreviewModal.setAppElement('#newcustomerpreview');
            setNewCustomerPreviewModalState({ ...newCustomerPreviewModalState, state: true });
        }
    }

    const handlePreview = () => {
        setRenderMode({
            ...renderMode,
            customerTypeSelection: 'hide',
            customerDetails: 'view',
            accountDetails: 'view',
            serviceDetails: 'view',
            previewAndSubmitButton: 'hide',
            printButton: 'show',
            submitButton: 'hide',
            previewCancelButton: 'hide',
            previewCloseButton: 'show'
        })
        NewCustomerPreviewModal.setAppElement('#newcustomerpreview');
        setNewCustomerPreviewModalState({ ...newCustomerPreviewModalState, state: true });
    }
    const handleNewCustomerPreviewModalClose = () => {
        setRenderMode({
            ...renderMode,
            customerTypeSelection: 'hide',
            customerDetails: 'view',
            accountDetails: 'view',
            serviceDetails: 'view',
            previewAndSubmitButton: 'hide',
            previewButton: 'show'
        })
        setNewCustomerPreviewModalState({ ...newCustomerPreviewModalState, state: false });
    }

    const handlePreviewCancel = () => {
        setNewCustomerPreviewModalState({
            ...newCustomerPreviewModalState,
            state: false
        })
        setRenderMode({
            ...renderMode,
            customerTypeSelection: 'show',
            customerDetails: 'form',
            accountDetails: 'form',
            serviceDetails: 'form',
            previewAndSubmitButton: 'show',
            previewCancelButton: 'hide',
            previewSubmitButton: 'hide',
            printButton: 'hide'
        })
        setDoneStatus({
            customer: false,
            account: false,
            service: false
        })
    }

    const handleSubmit = () => {
        if (setServiceDetails()) {
            toast.success('Submitted...')
            handleServicePopupClose()
            setRefreshPage((prevState) => (!prevState))
            //window.location.reload(false)
        }

        // showSpinner();
        // post(properties.CUSTOMER_API, newCustomerData.current.customer)
        //     .then((resp) => {
        //         if (resp.data) {
        //             if (resp.status === 200) {
        //                 toast.success("Customer, Account & Service created successfully " + resp.data.serviceRequest.intxnId);
        //                 setRenderMode({
        //                     ...renderMode,
        //                     submitted: 'yes',
        //                     printButton: 'show',
        //                     submitAndPreviewButton: 'hide',
        //                     submitButton: 'hide',
        //                     previewCancelButton: 'hide',
        //                     previewButton: 'show',
        //                     previewCloseButton: 'show',
        //                     customerDetailsEditButton: 'hide',
        //                     accountDetailsEditButton: 'hide',
        //                     serviceDetailsEditButton: 'hide'
        //                 })
        //                 setNewCustomerDetails({
        //                     customerId: resp.data.customerId
        //                 })
        //             } else {
        //                 toast.error("Failed to create - " + resp.status);
        //             }
        //         } else {
        //             toast.error("Uexpected error ocurred " + resp.statusCode);
        //         }
        //     }).finally(hideSpinner);

    }

    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [categoryOrClassData, setCategoryOrClassData] = useState({
        category: '',
        categoryDesc: '',
        class: '',
        classDesc: '',
    })

    return (
        <>

            <form id="service-form" className="card p-0 border d-block">

                <section className="triangle col-12 p-0">
                    <div className="row col-12">
                        <h5 id="list-item-2" className="pl-1">Change Service Number</h5>
                    </div>
                </section>
                <div id="services-section" className="d-block">
                    {/* <div className="col-12 p-2">
                    <fieldset className="scheduler-border">
                        <legend className="scheduler-border">Change Service</legend>
                        <div className="row col-md-12 p-0">
                            <div className="col-4">
                                
                            </div>
                        </div>
                    </fieldset>
                </div> */}
                </div>
                <div><br></br></div>
                <Element name="serviceSection" className="element">

                    {

                        (selectedCustomerType && selectedCustomerType !== '') ?
                            <div className="pr-2">
                                <fieldset className="scheduler-border mr-0 pr-0">
                                    {
                                        (renderMode.serviceDetails === 'form') ?
                                            <ServiceDetailsChangeForm data={{
                                                serviceData: serviceData,
                                                installationAddress: installationAddress,
                                                fixedService: fixedService,
                                                mobileService: mobileService,
                                                gsm: gsm,
                                                creditProfile: creditProfile,
                                                deposit: deposit,
                                                payment: payment,
                                                portIn: portIn
                                            }}
                                                lookups={{
                                                    catalogLookup: catalogLookup,
                                                    productLookup: productLookup,
                                                    fixedBBServiceNumberLookup: fixedBBServiceNumberLookup,
                                                    mobileServiceNumberLookup: mobileServiceNumberLookup,
                                                    dealershipLookup: dealershipLookup,
                                                    exchangeCodeLookup: exchangeCodeLookup,
                                                }}
                                                lookupsHandler={{
                                                    ///addressChangeHandler: addressChangeHandler,
                                                    setProductLookup: setProductLookup
                                                }}
                                                error={serviceDetailsError}
                                                setError={setServiceDetailsError}
                                                handler={{
                                                    setServiceData: setServiceData,
                                                    setInstallationAddress: setInstallationAddress,
                                                    setFixedService: setFixedService,
                                                    setMobileService: setMobileService,

                                                }}
                                                setFound={setFound}
                                                found={found}
                                            />
                                            :
                                            <></>
                                    }
                                    {
                                        (renderMode.serviceDetails === 'view') ?
                                            <ChangeServicePreviewDetails data={{
                                                serviceData: serviceData,
                                                installationAddress: installationAddress,
                                                fixedService: fixedService,
                                                mobileService: mobileService,
                                            }}
                                            />
                                            :
                                            <></>
                                    }
                                </fieldset>
                            </div>
                            :
                            <></>
                    }
                    {/* {
                        (renderMode.serviceDetails === 'form') ?
                            <div className="d-flex justify-content-end mr-0 pr-2">
                                <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleServiceDetailsCancel}>Cancel</button>
                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleServiceDetailsDone}>Done</button>
                            </div>
                            :
                            <></>
                    }
                    {
                        (renderMode.serviceDetails === 'view' && renderMode.accountDetailsEditButton === 'show') ?
                            <div className="d-flex justify-content-end edit-btn mr-0">
                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light mr-2" onClick={handleServiceDetailsEdit}>Edit</button>
                            </div>
                            :
                            <></>
                    } */}
                </Element>
                <div className="d-flex justify-content-center">
                    <div className="row justify-content-center mt-3">
                        {
                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge))?
                                <button type="button" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                                :
                                <button disabled="disabled" type="button" className="btn btn-primary mr-2">Submit</button>
                        }
                        
                    </div>
                    {/* {
                        (renderMode.previewAndSubmitButton === 'show') ?
                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handlePreviewAndSubmit}>Preview and Submit</button>
                            
                            :
                            <></>
                    } */}
                    {
                        (renderMode.previewButton === 'show') ?
                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handlePreview}>View Again</button>
                            :
                            <></>
                    }
                </div>
                {
                    (newCustomerDetails && newCustomerDetails.customerId) ?
                        <Element name="serviceRequestSection">
                            <section className="triangle col-12">
                                <div className="row col-12">
                                    <div className="col-8">
                                        <h4 className="pl-1">Service Requests</h4>
                                    </div>
                                </div>
                            </section>
                            <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                <div className="form-row bg-light pt-2 ml-0 mr-0">
                                    <div className="form-row border col-12 p-0 ml-0 mr-0">
                                        <div className="col-md-12 card-box m-0 p-0">
                                            <ServiceRequestList
                                                data={{
                                                    customerDetails: newCustomerDetails,
                                                    leftNavCounts: leftNavCounts
                                                }}
                                                handler={{
                                                    setLeftNavCounts: setLeftNavCounts
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Element>
                        :
                        <></>
                }

                <div id="newcustomerpreview">
                    {
                        (newCustomerPreviewModalState.state) ?
                            <NewCustomerPreviewModal isOpen={newCustomerPreviewModalState.state}>
                                <NewCustomerPreview
                                    previewData={{
                                        renderMode: renderMode
                                    }}
                                    data={{
                                        newCustomerData: newCustomerData,
                                        plansList: plansList
                                    }}
                                    modalStateHandlers={{
                                        handlePreviewCancel: handlePreviewCancel,
                                        handleSubmit: handleSubmit,
                                        handleNewCustomerPreviewModalClose: handleNewCustomerPreviewModalClose,
                                        handlePrint: handlePrint

                                    }}
                                    ref={componentRef}
                                />
                                {/* <button type="button" onClick={handlePrint} className="btn btn-primary btn-md  waves-effect waves-light">Print</button> */}
                            </NewCustomerPreviewModal>
                            :
                            <></>
                    }
                </div>
            </form >
        </>
    )

}
export default ServiceNumberChange;
