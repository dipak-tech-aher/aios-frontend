import React, { useState, useRef, useEffect } from 'react'
import NewCustomerPreviewModal from 'react-modal'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";
import { useReactToPrint } from 'react-to-print';
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import PersonalCustomerDetailsForm from './personalCustomerDetailsForm'
import PersonalCustomerDetailsPreview from './personalCustomerDetailsPreview'
import BusinessCustomerDetailsForm from './businessCustomerDetailsForm'
import BusinessCustomerDetailsPreview from './businessCustomerDetailsPreview'
import PersonalCustomerAccountForm from './personalCustomerAccountForm';
import PersonalCustomerAccountPreview from './personalCustomerAccountPreview';
import BusinessCustomerAccountForm from './businessCustomerAccountForm';
import BusinessCustomerAccountPreview from './businessCustomerAccountPreview';
import ServiceDetailsForm from './serviceDetailsForm';
import ServiceDetailsPreview from './serviceDetailsPreview';
import ServiceRequestList from '../customer360/serviceRquestList'
import NewCustomerPreview from './newCustomerPreview';


const idNbrRegexPattern = /[0-9]{2}-[0-9]{6}/
const icIdTypes = ['ICGREEN', 'ICRED', 'ICYELLOW']

const personalCustomerValidationSchema = object().shape({
    title: string().required("Title is required"),
    foreName: string().required("ForeName is required"),
    surName: string().required("SurName is required"),
    category: string().required("Category is required"),
    class: string().required("Class is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactType: string().required("Contact type is required"),
    contactNbr: string().required("Contact Number is required")
});

const businessCustomerValidationSchema = object().shape({
    companyName: string().required("Company Name is required"),
    category: string().required("Category is required"),
    class: string().required("Class is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactType: string().required("Contact type is required"),
    contactNbr: string().required("Contact Number is required")
});

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

const validateDateFormat = (value) => {
    try {
        Date.parse(value)
        return true
    } catch (e) {
        return false
    }
}

const personalAccountValidationSchema = object().shape({
    title: string().required("Title is required"),
    foreName: string().required("ForeName is required"),
    surName: string().required("SurName is required"),
    gender: string().required("Gender is required"),
    dob: string().test(
        "Date",
        "Date of birth is required",
        (dob) => (dob !== "")
    ).test(
        "Date",
        "Date of birth is required",
        (dob) => validateDateFormat(dob)
    ),
    idType: string().required("ID Type is required"),
    idNbr: string().required("ID Number is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactType: string().required("Contact type is required"),
    contactNbr: string().required("Contact Number is required"),
    priority: string().required("Priority is required"),
    class: string().required("Account Class is required"),
    category: string().required("Account Category is required"),
    baseCollPlan: string().required("Base collection plan is required"),
    contactTitle: string().required("Contact title is required"),
    contactSurName: string().required("Contact Surname is required"),
    contactForeName: string().required("Contact Surname is required"),
});

const businessAccountValidationSchema = object().shape({
    companyName: string().required("Company Name is required"),
    registeredDate: string().test(
        "Date",
        "Registered Date is required",
        (registeredDate) => (registeredDate !== "")
    ).test(
        "Date",
        "Registered Date is required",
        (registeredDate) => validateDateFormat(registeredDate)
    ),
    registeredNbr: string().required("Registered Number are required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactType: string().required("Contact type is required"),
    contactNbr: string().required("Contact Number is required"),
    idType: string().required("ID Type is required"),
    idNbr: string().required("ID Number is required"),
    priority: string().required("Priority is required"),
    class: string().required("Account Class is required"),
    category: string().required("Account Category is required"),
    baseCollPlan: string().required("Base collection plan is required"),
    contactTitle: string().required("Contact title is required"),
    contactSurName: string().required("Contact Surname is required"),
    contactForeName: string().required("Contact Surname is required"),
});

const billOptionsValidationSchema = object().shape({
    billLanguage: string().required("Bill Language is required"),
    billDeliveryMethod: string().required("Bill delivery methoed  is required"),
    noOfCopies: string().required("No of copies required")
});

const securityQuestionValidationSchema = object().shape({
    securityQuestion: string().required("Security Question is required"),
    securityAnswer: string().required("Security Answer  is required")
});

const serviceDataValidationSchema = object().shape({
    catalog: string().required("Catalog is required"),
    product: string().required("Product is required")
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

const mobileServiceValidationSchema = object().shape({
    serviceNumberSelection: string().required("Service Number Selection is required"),
    nbrGroup: string().required("Number Group is required"),
    dealership: string().required("Dealership is required"),
    accessNbr: string().when("serviceNumberSelection", {
        is: "manual",
        then: string().required("Access Number is required")
    }
    )
});

const gsmValidationSchema = object().shape({
    iccid: string().required("ICCID is required"),
    imsi: string().required("IMSI is required")
});

const creditProfileValidationSchema = object().shape({
    creditProfile: string().required("Credit Profile is required")
});

const depositValidationSchema = object().shape({
    includeExclude: string().required("Deposit inclusion or exclusion is required"),
    charge: string().when("includeExclude", {
        is: "include",
        then: string().required("Deposit Charge is required")
    }
    ),
    excludeReason: string().when("includeExclude", {
        is: includeExclude => includeExclude === "exclude",
        then: string().required("Exclude Reason is required")
    }
    )
});

const paymentValidationSchema = object().shape({
    paymentMethod: string().required("Payment Method is required")
});

function NewCustomer(props) {
    const [refreshServiceRequest, setRefreshServiceRequest] = useState(true)
    let custType = ''
    let viewStatus = 'hide'
    if (props.location.state !== undefined) {
        if (props.location.state.data !== undefined) {
            if (props.location.state.data.sourceName === 'Inquiry') {
                custType = (props.location.state.data !== undefined)
                    ? props.location.state.data.custType : ''
                viewStatus = 'show'
            }
        }
    }


    const [detailsValidate, setDetailsValidate] = useState({
        title: true,
        surName: true,
        foreName: true,
        email: true,
        companyName: true,
        contactNbr: true,
        flatNo: true,
        block: true,
        building: true,
        simpang: true,
        jalan: true,
        mukim: true,
        city: true,
        profileValue: true
    })
    const [accountValidate, setAccountValidate] = useState({
        title: true,
        surName: true,
        foreName: true,
        email: true,
        companyName: true,
        contactNbr: true,
        dateOfBirth: true,
        idNumber: true,
        registeredNbr: true,
        contactTitle: true,
        contactSurName: true,
        contactForeName: true,
        flatNo: true,
        block: true,
        building: true,
        simpang: true,
        jalan: true,
        mukim: true,
        city: true,
        copiesCount: true,
        profileValue: true
    })

    const [serviceValidate, setServiceValidate] = useState({
        flatNo: true,
        block: true,
        building: true,
        simpang: true,
        jalan: true,
        mukim: true,
        city: true,
        accessNbr: true
    })
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // let found = false;
    const [found, setFound] = useState(false)
    const { t } = useTranslation();

    const [leftNavCounts, setLeftNavCounts] = useState({})

    const [customerDetailsError, setCustomerDetailsError] = useState({});
    const [accountDetailsError, setAccountDetailsError] = useState({});
    const [serviceDetailsError, setServiceDetailsError] = useState({});

    const [newCustomerPreviewModalState, setNewCustomerPreviewModalState] = useState({ state: false })

    const [renderMode, setRenderMode] = useState({
        customerTypeSelection: viewStatus,
        customerDetails: 'hide',
        customerDetailsPreview: 'hide',
        accountDetails: 'hide',
        accountDetailsPreview: 'hide',
        serviceDetails: 'hide',
        previewAndSubmitButton: 'hide',
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

    const [kioskReferenceId, setKioskReferenceId] = useState()

    const [newCustomerDetails, setNewCustomerDetails] = useState({})
    const [selectedAccount,setSelectedAccount] = useState({})
    const [activeService,setActiveService] = useState({})

    const [selectedCustomerType, setSelectedCustomerType] = useState(custType)

    const [personalDetailsData, setPersonalDetailsData] = useState({
        title: '',
        foreName: '',
        surName: '',
        category: '',
        categoryDesc: '',
        class: '',
        classDesc: '',
        email: '',
        contactType: '',
        contactTypeDesc: '',
        contactNbr: ''
    });

    const [businessDetailsData, setBusinessDetailsData] = useState({
        companyName: '',
        category: '',
        categoryDesc: '',
        class: '',
        classDesc: '',
        email: '',
        contactType: '',
        contactTypeDesc: '',
        contactNbr: ''
    });

    const [customerAddress, setCustomerAddress] = useState({
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

    const [personalAccountData, setPersonalAccountData] = useState({
        sameAsCustomerDetails: false,
        contactSameAsCustomerDetails: false,
        title: '',
        surName: '',
        foreName: '',
        gender: '',
        dob: '',
        idType: '',
        idTypeDesc: '',
        idNbr: '',
        email: '',
        contactType: '',
        contactTypeDesc: '',
        contactNbr: '',
        priority: '',
        priorityDesc: '',
        class: '',
        classDesc: '',
        category: '',
        categoryDesc: '',
        baseCollPlan: '',
        baseCollPlanDesc: '',
        contactTitle: '',
        contactSurName: '',
        contactForeName: '',

    });

    const [businessAccountData, setBusinessAccountData] = useState({
        sameAsCustomerDetails: false,
        companyName: '',
        registeredDate: '',
        registeredNbr: '',
        email: '',
        contactType: '',
        contactTypeDesc: '',
        contactNbr: '',
        idType: '',
        idTypeDesc: '',
        idNbr: '',
        priority: '',
        priorityDesc: '',
        class: '',
        classDesc: '',
        category: '',
        categoryDesc: '',
        baseCollPlan: '',
        baseCollPlanDesc: '',
        contactTitle: '',
        contactSurName: '',
        contactForeName: '',
    });

    const [accountAddress, setAccountAddress] = useState({
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

    const [billOptions, setBillOptions] = useState({
        billLanguage: '',
        billLanguageDesc: '',
        billDeliveryMethod: '',
        billDeliveryMethodDesc: '',
        noOfCopies: '1'
    });

    const [securityData, setSecurityData] = useState({
        securityQuestion: '',
        securityQuestionDesc: '',
        securityAnswer: ''
    });

    const [serviceData, setServiceData] = useState({
        catalog: '',
        catalogDesc: '',
        product: '',
        productDesc: '',
        prodType: ''
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
    const accountCategoryForClass = useRef([])
    const [addressLookUpRef, setAddressLookUpRef] = useState(null)
    const [categoryLookup, setCategoryLookup] = useState([{}])
    const [classLookup, setClassLookup] = useState([{}])
    const [contactTypeLookup, setContactTypeLookup] = useState([{}])
    const [districtLookup, setDistrictLookup] = useState([{}])
    const [kampongLookup, setKampongLookup] = useState([{}])
    const [postCodeLookup, setPostCodeLookup] = useState([{}])
    const [idTypeLookup, setIdTypeLookup] = useState([{}])
    const [priorityLookup, setPriorityLookup] = useState([{}])
    const [accountClassLookup, setAccountClassLookup] = useState([{}])
    const [accountCategoryLookup, setAccountCategoryLookup] = useState([{}])
    const [baseCollectionPlanLookup, setbaseCollectionPlanLookup] = useState([{}])
    const [billLanguageLookup, setBillLanguageLookup] = useState([{}])
    const [billDeliveryMethodLookup, setBillDeliveryMethodLookup] = useState([{}])
    const [securityQuestionLookup, setSecurityQuestionLookup] = useState([{}])
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

    const [customerTypeLookup, setCustomerTypeLookup] = useState([{}])

    const resetDataValues = () => {
        setCustomerDetailsError({})
        setAccountDetailsError({})
        setServiceDetailsError({})
        setPersonalDetailsData({
            ...personalDetailsData,
            title: '',
            foreName: '',
            surName: '',
            category: '',
            categoryDesc: '',
            class: '',
            classDesc: '',
            email: '',
            contactType: '',
            contactTypeDesc: '',
            contactNbr: ''
        })
        setBusinessDetailsData({
            ...businessDetailsData,
            companyName: '',
            category: '',
            categoryDesc: '',
            class: '',
            classDesc: '',
            email: '',
            contactType: '',
            contactTypeDesc: '',
            contactNbr: ''
        })
        setCustomerAddress({
            ...customerAddress,
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
        setAccountAddress({
            ...accountAddress,
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
        setBillOptions({
            ...billOptions,
            billLanguage: '',
            billLanguageDesc: '',
            billDeliveryMethod: '',
            billDeliveryMethodDesc: '',
            noOfCopies: '1'
        })
        setSecurityData({
            ...securityData,
            securityQuestion: '',
            securityQuestionDesc: '',
            securityAnswer: ''
        })
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
    useEffect(() => {
        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        if (props.location.state.data !== undefined) {
            setKioskReferenceId(props.location.state.data.customerDetails.referenceNo)
        }
        //setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
    }, [props.location.state]);
    // useEffect(() => {
    //     showSpinner();
    // }, []);


    useEffect(() => {


        let district = []
        let kampong = []
        let postCode = []

        let plans = []

        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['CATEGORY',
            'CLASS',
            'CONTACT_TYPE',
            'ID_TYPE',
            'PRIORITY',
            'ACCOUNT_CATEGORY',
            'ACCOUNT_CLASS',
            'BASE_COLL_PLAN',
            'BILL_LANGUAGE',
            'BILL_DELIVERY_METHOD',
            'SECURITY_QUESTION',
            'CATALOGUE',
            'FXD_BB_SERVICE_NUMBER_GROUP',
            'MOBILE_SERVICE_NUMBER_GROUP',
            'EXCHANGE_CODE',
            'DEALERSHIP',
            'CREDIT_PROFILE',
            'DEPOSIT_CHARGE',
            'PAYMENT_METHOD',
            'CUSTOMER_TYPE'])
            .then((resp) => {
                if (resp.data) {
                    lookupData.current = resp.data
                    get(properties.ADDRESS_LOOKUP_API)
                        .then((resp) => {
                            if (resp && resp.data) {
                                addressLookup.current = resp.data
                                setAddressLookUpRef(resp.data)
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

                    setCategoryLookup(lookupData.current['CATEGORY'])
                    setClassLookup(lookupData.current['CLASS'])
                    setContactTypeLookup(lookupData.current['CONTACT_TYPE'])
                    setIdTypeLookup(lookupData.current['ID_TYPE'])
                    setPriorityLookup(lookupData.current['PRIORITY'])
                    setAccountCategoryLookup(lookupData.current['ACCOUNT_CATEGORY'])
                    setAccountClassLookup(lookupData.current['ACCOUNT_CLASS'])
                    setbaseCollectionPlanLookup(lookupData.current['BASE_COLL_PLAN'])
                    setBillLanguageLookup(lookupData.current['BILL_LANGUAGE'])
                    setBillDeliveryMethodLookup(lookupData.current['BILL_DELIVERY_METHOD'])
                    setSecurityQuestionLookup(lookupData.current['SECURITY_QUESTION'])
                    catalogList.current = lookupData.current['CATALOGUE']
                    setFixedBBServiceNumberLookup(lookupData.current['FXD_BB_SERVICE_NUMBER_GROUP'])
                    setMobileServiceNumberLookup(lookupData.current['MOBILE_SERVICE_NUMBER_GROUP'])
                    setExchangeCodeLookup(lookupData.current['EXCHANGE_CODE'])
                    setDealershipLookup(lookupData.current['DEALERSHIP'])
                    setCreditProfileLookup(lookupData.current['CREDIT_PROFILE'])
                    setDepositChargeLookup(lookupData.current['DEPOSIT_CHARGE'])
                    setPaymentMethodLookup(lookupData.current['PAYMENT_METHOD'])
                    setCustomerTypeLookup(lookupData.current['CUSTOMER_TYPE'])
                    setDistrictLookup(district)
                    setKampongLookup(kampong)
                    setPostCodeLookup(postCode)


                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    if (props.location.state !== undefined) {

                        const { data } = props.location.state
                        if (props.location.state.data !== undefined) {
                            if (data.sourceName === 'Inquiry') {
                                handleCustomerTypeChange(data.custType)
                                setRenderMode(
                                    {
                                        ...renderMode,
                                        customerDetails: 'form',
                                        //customerDetailsPreview: 'hide',
                                        accountDetails: 'form',
                                        //accountDetailsPreview: 'hide',
                                        serviceDetails: 'form',
                                        previewAndSubmitButton: 'show',
                                        //previewButton: 'show',
                                    }
                                )
                                //setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                            }
                        }
                    }

                    hideSpinner();

                }
            }).finally();

    }, []);


    const validate = (section, schema, data, holdPrevErrors = false) => {
        try {
            if (section === 'CUSTOMER') {
                holdPrevErrors === false && setCustomerDetailsError({})
            }
            if (section === 'ACCOUNT') {
                holdPrevErrors === false && setAccountDetailsError({})
            }
            if (section === 'SERVICE') {
                holdPrevErrors === false && setServiceDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'CUSTOMER') {
                    setCustomerDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
                if (section === 'ACCOUNT') {
                    setAccountDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
                if (section === 'SERVICE') {
                    setServiceDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };

    const addressChangeHandler = (field, value) => {

    }

    const handleCustomerTypeChange = (value) => {
        const catalog = []
        for (let c of catalogList?.current) {
            if (c?.mapping?.customerType === value) {
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
            product: '',
            productDesc: '',
            prodType: ''
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

    const handleCustomerDetailsCancel = () => {

        if (newCustomerData.current.customer.customerType === 'RESIDENTIAL') {
            setPersonalDetailsData(
                {
                    title: newCustomerData.current.customer.title,
                    foreName: newCustomerData.current.customer.foreName,
                    surName: newCustomerData.current.customer.surName,
                    category: newCustomerData.current.customer.category,
                    class: newCustomerData.current.customer.class,
                    email: newCustomerData.current.customer.email,
                    contactType: newCustomerData.current.customer.contactType,
                    contactNbr: newCustomerData.current.customer.contactNbr
                }
            )
        }
        if (selectedCustomerType === 'BUSINESS') {
            setBusinessDetailsData(
                {
                    companyName: newCustomerData.current.customer.companyName,
                    category: newCustomerData.current.customer.category,
                    class: newCustomerData.current.customer.class,
                    email: newCustomerData.current.customer.email,
                    contactType: newCustomerData.current.customer.contactType,
                    contactNbr: newCustomerData.current.customer.contactNbr
                }
            )
        }
        setSelectedCustomerType(newCustomerData.current.customer.customerType)
        setRenderMode({
            ...renderMode,
            customerDetails: 'view',
            customerTypeSelection: 'hide'
        })
    }

    const handleCustomerDetailsDone = () => {
        if (setCustomerDetails()) {
            setRenderMode({
                ...renderMode,
                customerDetails: 'view',
                customerTypeSelection: 'hide'
            })
        }
    }

    const setCustomerDetails = () => {

        if (selectedCustomerType === 'RESIDENTIAL') {
            const personalError = validate('CUSTOMER', personalCustomerValidationSchema, personalDetailsData);
            const addressError = validate('CUSTOMER', addressValidationSchema, customerAddress, true);
            if (personalError || addressError) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (selectedCustomerType === 'BUSINESS') {
            const businessError = validate('CUSTOMER', businessCustomerValidationSchema, businessDetailsData);
            const addressError = validate('CUSTOMER', addressValidationSchema, customerAddress, true);
            if (businessError || addressError) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            if (personalDetailsData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }
        else if (selectedCustomerType === 'BUSINESS') {
            if (businessDetailsData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }

        if (!newCustomerData.current.customer) {
            newCustomerData.current.customer = {}
        }
        newCustomerData.current.customer.customerType = selectedCustomerType
        if (selectedCustomerType === 'RESIDENTIAL') {
            newCustomerData.current.customer.title = personalDetailsData.title
            newCustomerData.current.customer.foreName = personalDetailsData.foreName
            newCustomerData.current.customer.surName = personalDetailsData.surName
            newCustomerData.current.customer.category = personalDetailsData.category
            newCustomerData.current.customer.categoryDesc = personalDetailsData.categoryDesc
            newCustomerData.current.customer.class = personalDetailsData.class
            newCustomerData.current.customer.classDesc = personalDetailsData.classDesc
            newCustomerData.current.customer.email = personalDetailsData.email
            newCustomerData.current.customer.contactType = personalDetailsData.contactType
            newCustomerData.current.customer.contactTypeDesc = personalDetailsData.contactTypeDesc
            newCustomerData.current.customer.contactNbr = personalDetailsData.contactNbr
            newCustomerData.current.customer.kioskRefId = (kioskReferenceId !== null) ? kioskReferenceId : null
        }
        if (selectedCustomerType === 'BUSINESS') {
            newCustomerData.current.customer.companyName = businessDetailsData.companyName
            newCustomerData.current.customer.category = businessDetailsData.category
            newCustomerData.current.customer.categoryDesc = businessDetailsData.categoryDesc
            newCustomerData.current.customer.class = businessDetailsData.class
            newCustomerData.current.customer.classDesc = businessDetailsData.classDesc
            newCustomerData.current.customer.email = businessDetailsData.email
            newCustomerData.current.customer.contactType = businessDetailsData.contactType
            newCustomerData.current.customer.contactTypeDesc = businessDetailsData.contactTypeDesc
            newCustomerData.current.customer.contactNbr = businessDetailsData.contactNbr
        }
        if (!newCustomerData.current.customer.address) {
            newCustomerData.current.customer.address = []
        }
        newCustomerData.current.customer.address[0] = {
            flatHouseUnitNo: customerAddress.flatHouseUnitNo,
            block: customerAddress.block,
            building: customerAddress.building,
            street: customerAddress.street,
            road: customerAddress.road,
            district: customerAddress.district,
            state: customerAddress.state,
            village: customerAddress.village,
            cityTown: customerAddress.cityTown,
            country: customerAddress.country,
            postCode: customerAddress.postCode
        }
        setDoneStatus({ ...doneStatus, customer: true })
        return true
    }

    const handleCustomerDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            customerDetails: 'form',
            customerTypeSelection: 'show'
        })
        setDoneStatus({ ...doneStatus, customer: false })
    }

    const handleAccountDetailsCancel = () => {
        setRenderMode({
            ...renderMode,
            accountDetails: 'view'
        })
    }

    const handleAccountDetailsDone = () => {
        if (setAccountDetails()) {
            setRenderMode({
                ...renderMode,
                accountDetails: 'view'
            })
        }
    }

    const setAccountDetails = () => {

        if (selectedCustomerType === 'RESIDENTIAL') {
            let error = validate('ACCOUNT', personalAccountValidationSchema, personalAccountData);
            let errorAddress
            if (!accountAddress.sameAsCustomerAddress) {
                errorAddress = validate('ACCOUNT', addressValidationSchema, accountAddress, true);
            }
            let error1 = validate('ACCOUNT', billOptionsValidationSchema, billOptions, true);


            let error2 = validate('ACCOUNT', securityQuestionValidationSchema, securityData, true);

            if (error || errorAddress || error1 || error2) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
            if (icIdTypes.includes(personalAccountData.idType) && !idNbrRegexPattern.test(personalAccountData.idNbr)) {
                toast.error("ID Type must be in the format 00-000000");
                return false;
            }
        }
        if (selectedCustomerType === 'BUSINESS') {
            let error = validate('ACCOUNT', businessAccountValidationSchema, businessAccountData);
            let errorAddress
            if (!accountAddress.sameAsCustomerAddress) {
                errorAddress = validate('ACCOUNT', addressValidationSchema, accountAddress, true);
            }
            let error1 = validate('ACCOUNT', billOptionsValidationSchema, billOptions, true);

            let error2 = validate('ACCOUNT', securityQuestionValidationSchema, securityData, true);

            if (error || errorAddress || error1 || error2) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }

            if (icIdTypes.includes(businessAccountData.idType) && !idNbrRegexPattern.test(businessAccountData.idNbr)) {
                toast.error("ID Number must be in the format 00-000000");
                return false;
            }
        }

        if (selectedCustomerType === 'RESIDENTIAL') {
            if (personalAccountData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }
        else if (selectedCustomerType === 'BUSINESS') {
            if (businessAccountData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }
        if (!newCustomerData.current.customer) {
            newCustomerData.current.customer = {}
        }
        if (!newCustomerData.current.customer.account) {
            newCustomerData.current.customer.account = []
            newCustomerData.current.customer.account.push({})
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            newCustomerData.current.customer.account[0].title = personalAccountData.title
            newCustomerData.current.customer.account[0].foreName = personalAccountData.foreName
            newCustomerData.current.customer.account[0].surName = personalAccountData.surName
            newCustomerData.current.customer.account[0].gender = personalAccountData.gender
            newCustomerData.current.customer.account[0].dob = personalAccountData.dob
            newCustomerData.current.customer.account[0].idType = personalAccountData.idType
            newCustomerData.current.customer.account[0].idTypeDesc = personalAccountData.idTypeDesc
            newCustomerData.current.customer.account[0].idNbr = personalAccountData.idNbr

            newCustomerData.current.customer.account[0].email = personalAccountData.email
            newCustomerData.current.customer.account[0].contactType = personalAccountData.contactType
            newCustomerData.current.customer.account[0].contactTypeDesc = personalAccountData.contactTypeDesc
            newCustomerData.current.customer.account[0].contactNbr = personalAccountData.contactNbr
            newCustomerData.current.customer.account[0].priority = personalAccountData.priority
            newCustomerData.current.customer.account[0].priorityDesc = personalAccountData.priorityDesc
            newCustomerData.current.customer.account[0].class = personalAccountData.class
            newCustomerData.current.customer.account[0].classDesc = personalAccountData.classDesc
            newCustomerData.current.customer.account[0].category = personalAccountData.category
            newCustomerData.current.customer.account[0].categoryDesc = personalAccountData.categoryDesc
            newCustomerData.current.customer.account[0].baseCollPlan = personalAccountData.baseCollPlan
            newCustomerData.current.customer.account[0].baseCollPlanDesc = personalAccountData.baseCollPlanDesc
            newCustomerData.current.customer.account[0].contactTitle = personalAccountData.contactTitle
            newCustomerData.current.customer.account[0].contactForeName = personalAccountData.contactForeName
            newCustomerData.current.customer.account[0].contactSurName = personalAccountData.contactSurName

        }
        if (selectedCustomerType === 'BUSINESS') {
            newCustomerData.current.customer.account[0].companyName = businessAccountData.companyName
            newCustomerData.current.customer.account[0].registeredDate = businessAccountData.registeredDate
            newCustomerData.current.customer.account[0].registeredNbr = businessAccountData.registeredNbr

            newCustomerData.current.customer.account[0].email = businessAccountData.email
            newCustomerData.current.customer.account[0].contactType = businessAccountData.contactType
            newCustomerData.current.customer.account[0].contactTypeDesc = businessAccountData.contactTypeDesc
            newCustomerData.current.customer.account[0].contactNbr = businessAccountData.contactNbr
            newCustomerData.current.customer.account[0].idType = businessAccountData.idType
            newCustomerData.current.customer.account[0].idTypeDesc = businessAccountData.idTypeDesc
            newCustomerData.current.customer.account[0].idNbr = businessAccountData.idNbr
            newCustomerData.current.customer.account[0].priority = businessAccountData.priority
            newCustomerData.current.customer.account[0].priorityDesc = businessAccountData.priorityDesc
            newCustomerData.current.customer.account[0].class = businessAccountData.class
            newCustomerData.current.customer.account[0].classDesc = businessAccountData.classDesc
            newCustomerData.current.customer.account[0].category = businessAccountData.category
            newCustomerData.current.customer.account[0].categoryDesc = businessAccountData.categoryDesc
            newCustomerData.current.customer.account[0].baseCollPlan = businessAccountData.baseCollPlan
            newCustomerData.current.customer.account[0].baseCollPlanDesc = businessAccountData.baseCollPlanDesc
            newCustomerData.current.customer.account[0].contactTitle = businessAccountData.contactTitle
            newCustomerData.current.customer.account[0].contactForeName = businessAccountData.contactForeName
            newCustomerData.current.customer.account[0].contactSurName = businessAccountData.contactSurName

        }

        if (!newCustomerData.current.customer.account[0].billingAddress) {
            newCustomerData.current.customer.account[0].billingAddress = []
            newCustomerData.current.customer.account[0].billingAddress.push({})
        }
        if (accountAddress.sameAsCustomerAddress) {
            newCustomerData.current.customer.account[0].billingAddress[0] = {
                sameAsCustomerAddress: true
            }
        } else {
            newCustomerData.current.customer.account[0].billingAddress[0] = {
                flatHouseUnitNo: accountAddress.flatHouseUnitNo,
                block: accountAddress.block,
                building: accountAddress.building,
                street: accountAddress.street,
                road: accountAddress.road,
                district: accountAddress.district,
                state: accountAddress.state,
                village: accountAddress.village,
                cityTown: accountAddress.cityTown,
                country: accountAddress.country,
                postCode: accountAddress.postCode
            }
        }
        if (!newCustomerData.current.customer.account[0].billOptions) {
            newCustomerData.current.customer.account[0].billOptions = {}
        }
        newCustomerData.current.customer.account[0].billOptions.billLanguage = billOptions.billLanguage
        newCustomerData.current.customer.account[0].billOptions.billLanguageDesc = billOptions.billLanguageDesc
        newCustomerData.current.customer.account[0].billOptions.billDeliveryMethod = billOptions.billDeliveryMethod
        newCustomerData.current.customer.account[0].billOptions.billDeliveryMethodDesc = billOptions.billDeliveryMethodDesc
        newCustomerData.current.customer.account[0].billOptions.noOfCopies = billOptions.noOfCopies

        if (!newCustomerData.current.customer.account[0].securityData) {
            newCustomerData.current.customer.account[0].securityData = {}
        }
        newCustomerData.current.customer.account[0].securityData.securityQuestion = securityData.securityQuestion
        newCustomerData.current.customer.account[0].securityData.securityQuestionDesc = securityData.securityQuestionDesc
        newCustomerData.current.customer.account[0].securityData.securityAnswer = securityData.securityAnswer
        setDoneStatus({ ...doneStatus, account: true })
        return true;
    }

    const handleAccountDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            accountDetails: 'form'
        })
        setDoneStatus({ ...doneStatus, account: false })
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

    const handleSameAsCustomerDetailsChange = (value) => {
        let accountPartDetails = {}
        if (value) {
            if (selectedCustomerType === 'RESIDENTIAL') {
                accountPartDetails.title = personalDetailsData.title
                accountPartDetails.foreName = personalDetailsData.foreName
                accountPartDetails.surName = personalDetailsData.surName
                accountPartDetails.email = personalDetailsData.email
                accountPartDetails.contactType = personalDetailsData.contactType
                accountPartDetails.contactTypeDesc = personalDetailsData.contactTypeDesc
                accountPartDetails.contactNbr = personalDetailsData.contactNbr
                setPersonalAccountData({ ...personalAccountData, ...accountPartDetails, sameAsCustomerDetails: value })
            }
            if (selectedCustomerType === 'BUSINESS') {
                accountPartDetails.companyName = businessDetailsData.companyName
                accountPartDetails.email = businessDetailsData.email
                accountPartDetails.contactType = businessDetailsData.contactType
                accountPartDetails.contactTypeDesc = businessDetailsData.contactTypeDesc
                accountPartDetails.contactNbr = businessDetailsData.contactNbr
                setBusinessAccountData({ ...businessAccountData, ...accountPartDetails, sameAsCustomerDetails: value })
            }
        } else {
            if (selectedCustomerType === 'RESIDENTIAL') {
                setPersonalAccountData({ ...personalAccountData, title: "", foreName: "", surName: "", email: "", contactType: "", contactTypeDesc: "", contactNbr: "", sameAsCustomerDetails: value })
            }
            if (selectedCustomerType === 'BUSINESS') {
                setBusinessAccountData({ ...businessAccountData, companyName: "", email: "", contactType: "", contactTypeDesc: "", contactNbr: "", sameAsCustomerDetails: value })
            }
        }
    }

    const handleContactSameAsCustomerDetailsChange = (value) => {
        let accountContactPartDetails = {}

        if (value) {
            if (selectedCustomerType === 'RESIDENTIAL') {
                accountContactPartDetails.contactTitle = personalDetailsData.title
                accountContactPartDetails.contactSurName = personalDetailsData.surName
                accountContactPartDetails.contactForeName = personalDetailsData && personalDetailsData.foreName.slice(0,40)
                setPersonalAccountData({ ...personalAccountData, ...accountContactPartDetails, contactSameAsCustomerDetails: value })
            }

        } else {
            if (selectedCustomerType === 'RESIDENTIAL') {
                setPersonalAccountData({ ...personalAccountData, contactTitle: "", contactSurName: "", contactForeName: "", contactSameAsCustomerDetails: value })
            }

        }
    }

    const setServiceDetails = () => {

        let error = validate('SERVICE', serviceDataValidationSchema, serviceData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }

        if (serviceData.prodType === 'Fixed') {
            let error = validate('SERVICE', serviceDataValidationSchema, serviceData);
            let error1
            if (!installationAddress.sameAsCustomerAddress) {
                error1 = validate('SERVICE', addressValidationSchema, installationAddress, true);
            }
            let error2 = validate('SERVICE', fixedServiceValidationSchema, fixedService, true);
            let error3 = validate('SERVICE', creditProfileValidationSchema, creditProfile, true);

            let error4
            if (serviceData.prodType !== 'Prepaid') {
                error4 = validate('SERVICE', depositValidationSchema, deposit, true);
            }
            let error5 = validate('SERVICE', paymentValidationSchema, payment, true);

            if (error || error1 || error2 || error3 || error4 || error5) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }


        if (serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') {
            let error = validate('SERVICE', serviceDataValidationSchema, serviceData);

            let error1 = validate('SERVICE', mobileServiceValidationSchema, mobileService, true);
            let error2
            if (!gsm.assignSIMLater) {
                error2 = validate('SERVICE', gsmValidationSchema, gsm, true);
            }
            let error3 = validate('SERVICE', creditProfileValidationSchema, creditProfile, true);

            let error4
            if (serviceData.prodType !== 'Prepaid') {
                error4 = validate('SERVICE', depositValidationSchema, deposit, true);
            }
            let error5 = validate('SERVICE', paymentValidationSchema, payment, true);
            if (error || error1 || error2 || error3 || error4 || error5) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }

            if (!gsm.assignSIMLater) {
                if (!gsm.iccid || !gsm.confirmiccid || gsm.iccid === '' || gsm.confirmiccid === '') {
                    toast.error("ICCID and Confirm ICCID are mandatory");
                    return false;
                }

                if (gsm.iccid !== gsm.confirmiccid) {
                    toast.error("ICCID and Confirm ICCID must match");
                    return false;
                }
            }
        }



        if ((serviceData.prodType === 'Prepaid' || serviceData.prodType === 'Postpaid') && !gsm.assignSIMLater) {
            get(properties.ICCID_API + "/" + gsm.iccid)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.data.statusCode === "SUCCESS-001") {
                            if (resp.data.iccidDetails.imsi && resp.data.iccidDetails.imsi !== '') {
                                setGSM({ ...gsm, imsi: resp.data.iccidDetails.imsi })
                            } else {
                                setGSM({ ...gsm, imsi: '' })
                                toast.error('Unable to find IMSI for given ICCID')
                                return false
                            }
                        }
                        else {
                            toast.error(resp.data.statusMsg)
                            return false
                        }
                    }
                })
                .catch((err) => {
                    toast.error("Error while validating ICCID")
                    return false
                })
        }

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

        if (serviceData.prodType === 'Fixed') {
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
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid = ''
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi = ''
            } else {
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.assignSIMLater = 'N'
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid = gsm.iccid
                newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi = gsm.imsi
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
        newCustomerData.current.customer.account[0].service[0].portIn.donorDesc = portIn.donorDesc

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
        if (setCustomerDetails() && setAccountDetails() && setServiceDetails()) {
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
        showSpinner();
        post(properties.CUSTOMER_API, newCustomerData.current.customer)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Customer, Account & Service created successfully " + resp.data.serviceRequest.intxnId);
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
                            customerId: resp.data.customerId
                        })
                        setSelectedAccount({
                            accountId: resp.data.accountId
                        })
                        setActiveService(resp.data.serviceId)
                    } else {
                        toast.error("Failed to create - " + resp.status);
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            }).finally(hideSpinner);


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
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Add New Customer</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">
                    <div className="card-box">
                        <div className="d-flex">
                            <div className="col-2 p-0 sticky">
                                <ul className="list-group">
                                    <li>
                                        <Link activeclassName="active" className="list-group-item list-group-item-action" to="customersection" spy={true} offset={-190} smooth={true} duration={100}>
                                            Customer
                                            {
                                                (doneStatus && doneStatus.customer) ?
                                                    <i className="fe-check float-right"></i>
                                                    :
                                                    <></>
                                            }
                                        </Link>
                                    </li>
                                    <li>
                                        <Link activeclassName="active" className="list-group-item list-group-item-action" to="accountSection" spy={true} offset={-190} smooth={true} duration={100}>
                                            Accounts
                                            {
                                                (doneStatus && doneStatus.account) ?
                                                    <i className="fe-check float-right"></i>
                                                    :
                                                    <></>
                                            }
                                        </Link>
                                    </li>
                                    <li>
                                        <Link activeclassName="active" className="list-group-item list-group-item-action" to="serviceSection" spy={true} offset={-190} smooth={true} duration={100}>
                                            Services
                                            {
                                                (doneStatus && doneStatus.service) ?
                                                    <i className="fe-check float-right"></i>
                                                    :
                                                    <></>
                                            }
                                        </Link>
                                    </li>
                                    {
                                        (newCustomerDetails && newCustomerDetails.customerId) ?
                                            <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="serviceRequestSection" spy={true} offset={-350} smooth={true} duration={100}>Service Request</Link></li>
                                            :
                                            <></>
                                    }
                                </ul>
                            </div>
                            <div className="new-customer col-md-10">
                                <div className="scrollspy-div">
                                    <Element name="customersection" className="element" >
                                        <div className="row">
                                            <div className="title-box col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("new_customer")}</h4>
                                                </section>
                                            </div>
                                        </div>
                                        {
                                            (renderMode.customerTypeSelection === 'show' && renderMode.customerDetails !== 'view') ?

                                                <div className="pt-2 pr-2">
                                                    <fieldset className="scheduler-border">
                                                        <div className="form-row">
                                                            <div className="col-12 pl-2 bg-light border">
                                                                <h5 className="text-primary">Customer Type</h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row pt-2">
                                                            <div className="col-md-2 pl-0">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio1" className="form-check-input" name="optCustomerType" value='RESIDENTIAL'
                                                                            checked={'RESIDENTIAL' === selectedCustomerType} onChange={e => {
                                                                                handleCustomerTypeChange(e.target.value);
                                                                                resetDataValues();
                                                                            }} />
                                                                        <label htmlFor="radio1">{t("residential")}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio2" className="form-check-input" name="optCustomerType" value='BUSINESS'
                                                                            checked={'BUSINESS' === selectedCustomerType} onChange={e => {
                                                                                handleCustomerTypeChange(e.target.value);
                                                                                resetDataValues();
                                                                            }} />
                                                                        <label htmlFor="radio2">{t("business")}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {
                                            (renderMode.customerDetails === 'view') ?

                                                <div className="pt-2 pr-2">
                                                    <fieldset className="scheduler-border">
                                                        <div className="form-row">
                                                            <div className="col-12 pl-2 bg-light border">
                                                                <h5 className="text-primary">Customer Type</h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row pt-2">
                                                            <div className="col-md-2 pl-0">
                                                                <div className="form-group">
                                                                    {
                                                                        ('RESIDENTIAL' === selectedCustomerType) ?
                                                                            <h5>{t("residential")}</h5>
                                                                            :
                                                                            <></>
                                                                    }
                                                                    {
                                                                        ('BUSINESS' === selectedCustomerType) ?
                                                                            <h5>{t("business")}</h5>
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {
                                            (selectedCustomerType && selectedCustomerType !== ''
                                                && addressLookUpRef && addressLookUpRef !== null) ?
                                                <div className="pt-0 pr-2">
                                                    <fieldset className="scheduler-border">
                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                                <PersonalCustomerDetailsForm data={{
                                                                    personalDetailsData: personalDetailsData,
                                                                    personalAccountData: personalAccountData,
                                                                    customerAddress: customerAddress,
                                                                    detailsValidate: detailsValidate
                                                                }}
                                                                    customerType={selectedCustomerType}
                                                                    lookups={{
                                                                        categoryLookup: categoryLookup,
                                                                        classLookup: classLookup,
                                                                        contactTypeLookup: contactTypeLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup,
                                                                        addressElements: addressLookUpRef //addressLookup.current
                                                                    }}
                                                                    lookupsHandler={{
                                                                        addressChangeHandler: addressChangeHandler
                                                                    }}
                                                                    stateHandler={{
                                                                        setPersonalDetailsData: setPersonalDetailsData,
                                                                        setPersonalAccountData: setPersonalAccountData,
                                                                        setCustomerAddress: setCustomerAddress,
                                                                        setDetailsValidate: setDetailsValidate
                                                                    }}
                                                                    error={customerDetailsError}
                                                                    setError={setCustomerDetailsError}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'view') ?
                                                                <PersonalCustomerDetailsPreview custType={selectedCustomerType}
                                                                    data={{
                                                                        personalDetailsData: personalDetailsData,
                                                                        customerAddress: customerAddress
                                                                    }}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'form'
                                                                && addressLookUpRef && addressLookUpRef !== null) ?
                                                                <BusinessCustomerDetailsForm
                                                                    data={{
                                                                        businessDetailsData: businessDetailsData,
                                                                        businessAccountData: businessAccountData,
                                                                        customerAddress: customerAddress,
                                                                        detailsValidate: detailsValidate
                                                                    }}
                                                                    lookups={{
                                                                        categoryLookup: categoryLookup,
                                                                        classLookup: classLookup,
                                                                        contactTypeLookup: contactTypeLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup,
                                                                        addressElements: addressLookUpRef//addressLookup.current
                                                                    }}
                                                                    lookupsHandler={{
                                                                        addressChangeHandler: addressChangeHandler
                                                                    }}
                                                                    stateHandler={{
                                                                        setBusinessDetailsData: setBusinessDetailsData,
                                                                        setBusinessAccountData: setBusinessAccountData,
                                                                        setCustomerAddress: setCustomerAddress,
                                                                        setDetailsValidate: setDetailsValidate
                                                                    }}
                                                                    error={customerDetailsError}
                                                                    setError={setCustomerDetailsError}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') ?
                                                                <BusinessCustomerDetailsPreview custType={selectedCustomerType}
                                                                    data={{
                                                                        businessDetailsData: businessDetailsData,
                                                                        customerAddress: customerAddress
                                                                    }} />
                                                                :
                                                                <></>
                                                        }
                                                    </fieldset>
                                                    {
                                                        (renderMode.customerDetails === 'form') ?
                                                            <div className="d-flex justify-content-end mr-0">
                                                                <button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light ml-2" onClick={handleCustomerDetailsDone}>Done</button>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderMode.customerDetails === 'view' && renderMode.customerDetailsEditButton === 'show') ?
                                                            <div className="d-flex justify-content-end edit-btn mr-0">
                                                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light mr-2" onClick={handleCustomerDetailsEdit}>Edit</button>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                                :
                                                <></>
                                        }
                                    </Element>

                                    <Element name="accountSection" className="element">
                                        <div className="row">
                                            <div className="title-box col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2">Account</h4>
                                                </section>
                                            </div>
                                        </div>
                                        {
                                            (selectedCustomerType && selectedCustomerType !== '') ?
                                                <div className="pt-2 pr-2">
                                                    <fieldset className="scheduler-border">
                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.accountDetails === 'form'
                                                                && addressLookUpRef && addressLookUpRef !== null) ?
                                                                <PersonalCustomerAccountForm data={{
                                                                    personalDetailsData: personalDetailsData,
                                                                    accountData: personalAccountData,
                                                                    accountAddress: accountAddress,
                                                                    billOptions: billOptions,
                                                                    securityData: securityData,
                                                                    detailsValidate: accountValidate,
                                                                    selectedCustomerType: selectedCustomerType
                                                                }}
                                                                    lookups={{
                                                                        idTypeLookup: idTypeLookup,
                                                                        contactTypeLookup: contactTypeLookup,
                                                                        priorityLookup: priorityLookup,
                                                                        accountClassLookup: accountClassLookup,
                                                                        accountCategoryLookup: accountCategoryLookup,
                                                                        baseCollectionPlanLookup: baseCollectionPlanLookup,
                                                                        billLanguageLookup: billLanguageLookup,
                                                                        billDeliveryMethodLookup: billDeliveryMethodLookup,
                                                                        securityQuestionLookup: securityQuestionLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup,
                                                                        accountCategoryForClass: accountCategoryForClass,
                                                                        addressElements: addressLookUpRef,//addressLookup.current,
                                                                        customerTypeLookup: customerTypeLookup
                                                                    }}
                                                                    error={accountDetailsError}
                                                                    setError={setAccountDetailsError}
                                                                    lookupsHandler={{
                                                                        addressChangeHandler: addressChangeHandler
                                                                    }}
                                                                    handler={{
                                                                        setAccountData: setPersonalAccountData,
                                                                        setAccountAddress: setAccountAddress,
                                                                        setBillOptions: setBillOptions,
                                                                        setSecurityData: setSecurityData,
                                                                        handleSameAsCustomerDetailsChange: handleSameAsCustomerDetailsChange,
                                                                        handleContactSameAsCustomerDetailsChange: handleContactSameAsCustomerDetailsChange,
                                                                        setDetailsValidate: setAccountValidate
                                                                    }}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.accountDetails === 'form'
                                                                && addressLookUpRef && addressLookUpRef !== null) ?
                                                                <BusinessCustomerAccountForm data={{
                                                                    accountData: businessAccountData,
                                                                    accountAddress: accountAddress,
                                                                    billOptions: billOptions,
                                                                    securityData: securityData,
                                                                    detailsValidate: accountValidate,
                                                                    selectedCustomerType: selectedCustomerType
                                                                }}
                                                                    lookups={{
                                                                        idTypeLookup: idTypeLookup,
                                                                        contactTypeLookup: contactTypeLookup,
                                                                        priorityLookup: priorityLookup,
                                                                        accountClassLookup: accountClassLookup,
                                                                        accountCategoryLookup: accountCategoryLookup,
                                                                        baseCollectionPlanLookup: baseCollectionPlanLookup,
                                                                        billLanguageLookup: billLanguageLookup,
                                                                        billDeliveryMethodLookup: billDeliveryMethodLookup,
                                                                        securityQuestionLookup: securityQuestionLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup,
                                                                        accountCategoryForClass: accountCategoryForClass,
                                                                        addressElements: addressLookUpRef,//addressLookup.current,
                                                                        customerTypeLookup: customerTypeLookup
                                                                    }}
                                                                    error={accountDetailsError}
                                                                    setError={setAccountDetailsError}
                                                                    lookupsHandler={{
                                                                        addressChangeHandler: addressChangeHandler
                                                                    }}
                                                                    handler={{
                                                                        setAccountData: setBusinessAccountData,
                                                                        setAccountAddress: setAccountAddress,
                                                                        setBillOptions: setBillOptions,
                                                                        setSecurityData: setSecurityData,
                                                                        handleSameAsCustomerDetailsChange: handleSameAsCustomerDetailsChange,
                                                                        setDetailsValidate: setAccountValidate
                                                                    }}
                                                                />
                                                                :
                                                                <></>
                                                        }

                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.accountDetails === 'view') ?
                                                                <PersonalCustomerAccountPreview data={{
                                                                    accountData: personalAccountData,
                                                                    accountAddress: accountAddress,
                                                                    billOptions: billOptions,
                                                                    securityData: securityData
                                                                }}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.accountDetails === 'view') ?
                                                                <BusinessCustomerAccountPreview data={{
                                                                    accountData: businessAccountData,
                                                                    accountAddress: accountAddress,
                                                                    billOptions: billOptions,
                                                                    securityData: securityData
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
                                        {
                                            (renderMode.accountDetails === 'form') ?
                                                <div className="d-flex justify-content-end mr-0 pr-2">
                                                    <button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light ml-2" onClick={handleAccountDetailsDone}>Done</button>
                                                </div>
                                                :
                                                <></>
                                        }
                                        {
                                            (renderMode.accountDetails === 'view' && renderMode.accountDetailsEditButton === 'show') ?
                                                <div className="d-flex justify-content-end edit-btn mr-0">
                                                    <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light mr-2" onClick={handleAccountDetailsEdit}>Edit</button>
                                                </div>
                                                :
                                                <></>
                                        }
                                    </Element>

                                    <Element name="serviceSection" className="element">
                                        <div className="row">
                                            <div className="title-box col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2">Service</h4>
                                                </section>
                                            </div>
                                        </div>
                                        <div><br></br></div>

                                        {

                                            (selectedCustomerType && selectedCustomerType !== ''
                                                && addressLookUpRef && addressLookUpRef !== null) ?
                                                <div className="pr-2">
                                                    <fieldset className="scheduler-border mr-0 pr-0">
                                                        {
                                                            (renderMode.serviceDetails === 'form') ?
                                                                <ServiceDetailsForm data={{
                                                                    serviceData: serviceData,
                                                                    installationAddress: installationAddress,
                                                                    fixedService: fixedService,
                                                                    mobileService: mobileService,
                                                                    gsm: gsm,
                                                                    creditProfile: creditProfile,
                                                                    deposit: deposit,
                                                                    payment: payment,
                                                                    portIn: portIn,
                                                                    detailsValidate: serviceValidate

                                                                }}
                                                                    lookups={{
                                                                        catalogLookup: catalogLookup,
                                                                        productLookup: productLookup,
                                                                        fixedBBServiceNumberLookup: fixedBBServiceNumberLookup,
                                                                        mobileServiceNumberLookup: mobileServiceNumberLookup,
                                                                        dealershipLookup: dealershipLookup,
                                                                        exchangeCodeLookup: exchangeCodeLookup,
                                                                        creditProfileLookup: creditProfileLookup,
                                                                        depositChargeLookup: depositChargeLookup,
                                                                        paymentMethodLookup: paymentMethodLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup,
                                                                        donorLookup: donorLookup,
                                                                        plansList: plansList,
                                                                        addressElements: addressLookUpRef//addressLookup.current
                                                                    }}
                                                                    lookupsHandler={{
                                                                        addressChangeHandler: addressChangeHandler,
                                                                        setProductLookup: setProductLookup
                                                                    }}
                                                                    error={serviceDetailsError}
                                                                    setError={setServiceDetailsError}
                                                                    handler={{
                                                                        setServiceData: setServiceData,
                                                                        setInstallationAddress: setInstallationAddress,
                                                                        setFixedService: setFixedService,
                                                                        setMobileService: setMobileService,
                                                                        setGSM: setGSM,
                                                                        setCreditProfile: setCreditProfile,
                                                                        setDeposit: setDeposit,
                                                                        setPayment: setPayment,
                                                                        setPortIn: setPortIn,
                                                                        setDetailsValidate: setServiceValidate
                                                                    }}
                                                                    setFound={setFound}
                                                                    found={found}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (renderMode.serviceDetails === 'view') ?
                                                                <ServiceDetailsPreview data={{
                                                                    serviceData: serviceData,
                                                                    installationAddress: installationAddress,
                                                                    fixedService: fixedService,
                                                                    mobileService: mobileService,
                                                                    creditProfile: creditProfile,
                                                                    gsm: gsm,
                                                                    deposit: deposit,
                                                                    plansList: plansList,
                                                                    payment: payment,
                                                                    portIn: portIn
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
                                        {
                                            (renderMode.serviceDetails === 'form') ?
                                                <div className="d-flex justify-content-end mr-0 pr-2">
                                                    <button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light ml-2" onClick={handleServiceDetailsDone}>Done</button>
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
                                        }
                                    </Element>
                                    <div className="d-flex justify-content-center">
                                        {
                                            (renderMode.previewAndSubmitButton === 'show') ?
                                                <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handlePreviewAndSubmit}>Preview and Submit</button>
                                                :
                                                <></>
                                        }
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
                                                {/* <section className="triangle col-12">
                                                    <div className="row col-12">
                                                        <div className="col-8">
                                                            <h4 className="pl-1">Service Requests</h4>
                                                            <button type="button" className="btn btn-sm btn-outline-primary text-primary pb-2 float-right" onClick={() => { setRefreshServiceRequest(!refreshServiceRequest) }}>Refresh</button>
                                                        </div>
                                                    </div>
                                                </section> */}
                                                <section className="triangle col-md-12">
                                                    <div className="tit-his row col-md-12">
                                                        <div className="col-md-3">
                                                            <h5 className="pl-1">Service Requests</h5>
                                                        </div>
                                                        <div className="col-md-9 mt-1">
                                                            <span className="act-btn" style={{ float: "right" }}><button type="button" style={{ float: "right" }} className="btn btn-sm btn-outline-primary text-primary" onClick={() => { setRefreshServiceRequest(!refreshServiceRequest) }}>Refresh</button></span>
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
                                                                        leftNavCounts: leftNavCounts,
                                                                        refreshServiceRequest: refreshServiceRequest,
                                                                        selectedAccount : selectedAccount,
                                                                        activeService: activeService
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
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
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
                        </NewCustomerPreviewModal>
                        :
                        <></>
                }
            </div>
        </>
    )

}
export default NewCustomer;
