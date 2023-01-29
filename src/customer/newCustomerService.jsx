import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";

import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";

import ServiceDetailsForm from './serviceDetailsForm';
import ServiceDetailsPreview from './serviceDetailsPreview';

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
    companyName: string().required("ForeName is required"),
    surName: string().required("SurName is required"),
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
    idType: string().required("ID & ID Type are required"),
    idNbr: string().required("ID & ID Type are required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactType: string().required("Contact type is required"),
    contactNbr: string().required("Contact Number is required"),
    priority: string().required("Priority is required"),
    class: string().required("Account Class is required"),
    category: string().required("Account Category is required"),
    //baseCollPlan: string().required("Base collection plan is required"),
    contactTitle: string().required("Contact title is required"),
    contactSurName: string().required("Contact Surname is required"),
    contactForeName: string().required("Contact Surname is required"),
});

const businessAccountValidationSchema = object().shape({
    companyName: string().required("SurName is required"),
    registeredDate: date().required("Date of Birth is required"),
    registeredNbr: string().required("ID & ID Type are required"),
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
    exchangeCode: string().required("Exchange Code is required")
});

const mobileServiceValidationSchema = object().shape({
    serviceNumberSelection: string().required("Service Number Selection is required"),
    nbrGroup: string().required("Number Group is required"),
    dealership: string().required("Dealership is required")
});

const gsmValidationSchema = object().shape({
    iccid: string().required("ICCID is required"),
    imsi: string().required("IMSI is required"),
    creditProfile: string().required("Credit Profile is required")
});

const depositValidationSchema = object().shape({
    includeExclude: string().required("Deposit inclusion or exclusion is required"),
    charge: string().when("includeExclude", {
        is: "include",
        then: string().required("Deposit Charge is required")
    }
    ),
    paymentMethod: string().when("includeExclude", {
        is: includeExclude => includeExclude === "include",
        then: string().required("Payment method is required")
    }
    ),
    excludeReason: string().when("includeExclude", {
        is: includeExclude => includeExclude === "exclude",
        then: string().required("Exclude Reason is required")
    }
    )
});

function NewCustomerService(props) {

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
    const { t } = useTranslation();
    let customerId

    let customerType = props.customerType
    const accountId = props.selectedAccount.accountId
    const [accountDetailsError, setAccountDetailsError] = useState({});
    const [serviceDetailsError, setServiceDetailsError] = useState({});

    const [renderMode, setRenderMode] = useState({
        customerTypeSelection: 'hide',
        customerDetails: 'hide',
        customerDetailsPreview: 'hide',
        accountDetails: 'form',
        accountDetailsPreview: 'hide',
        serviceDetails: 'form',
        previewButton: 'show',
        submitButton: 'hide',
        cancelButton: 'hide',
        customerDetailsEditButton: 'show',
        accountDetailsEditButton: 'show',
        serviceDetailsEditButton: 'show'
    })

    const newCustomerData = useRef({})

    const [selectedCustomerType, setSelectedCustomerType] = useState(customerType)

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
        noOfCopies: ''
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

    const [gsm, setGSM] = useState({
        iccid: '',
        imsi: '',
        creditProfile: '',
        creditProfileDesc: ''
    });

    const [deposit, setDeposit] = useState({
        includeExclude: '',
        charge: '',
        chargeDesc: '',
        paymentMethod: '',
        paymentMethodDesc: '',
        excludeReason: ''
    });

    const lookupData = useRef({})
    const addressLookup = useRef({})
    const plansList = useRef({})
    const catalogList = useRef({})

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
                                                    plans.push({
                                                        planId: p.planId,
                                                        prodType: p.prodType,
                                                        planName: p.planName
                                                    })
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
                    setDistrictLookup(district)
                    setKampongLookup(kampong)
                    setPostCodeLookup(postCode)
                    getCataloglookUp()

                    //resp.data['PRIORITY'].forEach((e) => priority.push(e))

                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    hideSpinner();

                }
            }).finally();

    }, []);


    const validate = (section, schema, data) => {
        try {

            if (section === 'ACCOUNT') {
            }
            if (section === 'SERVICE') {
                setServiceDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {

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
        let district = []
        let kampong = []
        let postCode = []

        if (field === 'DISTRICT') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.district === value) || value === '')
                    && ((customerAddress.village != '' && e.kampong === customerAddress.village) || customerAddress.village === '')
                    && ((customerAddress.postCode != '' && e.postCode === customerAddress.postCode) || customerAddress.postCode === '')) {
                    if (!kampong.includes(e.kampong)) {
                        kampong.push(e.kampong)
                    }
                    if (!postCode.includes(e.postCode)) {
                        postCode.push(e.postCode)
                    }
                }
            }
            setKampongLookup(kampong)
            setPostCodeLookup(postCode)
        }

        if (field === 'KAMPONG') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.kampong === value) || value === '')
                    && ((customerAddress.postCode != '' && e.postCode === customerAddress.postCode) || customerAddress.postCode === '')
                    && ((customerAddress.district != '' && e.district === customerAddress.district) || customerAddress.district === '')) {
                    if (!district.includes(e.district)) {
                        district.push(e.district)
                    }
                    if (!postCode.includes(e.postCode)) {
                        postCode.push(e.postCode)
                    }
                }
            }
            setDistrictLookup(district)
            setPostCodeLookup(postCode)
        }

        if (field === 'POSTCODE') {
            for (let e of addressLookup.current) {
                if (((value != '' && e.postCode === value) || value === '')
                    && ((customerAddress.village != '' && e.kampong === customerAddress.village) || customerAddress.village === '')
                    && ((customerAddress.district != '' && e.district === customerAddress.district) || customerAddress.district === '')) {

                    if (!district.includes(e.district)) {
                        district.push(e.district)
                    }
                    if (!kampong.includes(e.kampong)) {
                        kampong.push(e.kampong)
                    }
                }
            }
            setDistrictLookup(district)
            setKampongLookup(kampong)
        }
    }

    const getCataloglookUp = () => {
        const catalog = []
        for (let c of catalogList.current) {

            if (c.mapping.customerType === customerType) {
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

        setRenderMode({ ...renderMode, customerDetails: 'form', accountDetails: 'form', serviceDetails: 'form', previewButton: 'show' })
    }

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
            product: '',
            productDesc: '',
            prodType: ''
        })
        setSelectedCustomerType(value)
        setRenderMode({ ...renderMode, customerDetails: 'form', accountDetails: 'form', serviceDetails: 'form', previewButton: 'show' })
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
            const error = validate('CUSTOMER', personalCustomerValidationSchema, personalDetailsData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (selectedCustomerType === 'BUSINESS') {
            const error = validate('CUSTOMER', businessCustomerValidationSchema, businessDetailsData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        const error = validate('CUSTOMER', addressValidationSchema, customerAddress);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
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
            newCustomerData.current.customer.class = personalDetailsData.class
            newCustomerData.current.customer.email = personalDetailsData.email
            newCustomerData.current.customer.contactType = personalDetailsData.contactType
            newCustomerData.current.customer.contactNbr = personalDetailsData.contactNbr
        }
        if (selectedCustomerType === 'BUSINESS') {
            newCustomerData.current.customer.companyName = personalDetailsData.companyName
            newCustomerData.current.customer.category = personalDetailsData.category
            newCustomerData.current.customer.class = personalDetailsData.class
            newCustomerData.current.customer.email = personalDetailsData.email
            newCustomerData.current.customer.contactType = personalDetailsData.contactType
            newCustomerData.current.customer.contactNbr = personalDetailsData.contactNbr
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
        return true
    }

    const handleCustomerDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            customerDetails: 'form',
            customerTypeSelection: 'show'
        })
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
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        if (selectedCustomerType === 'BUSINESS') {
            let error = validate('ACCOUNT', businessAccountValidationSchema, businessAccountData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        if (!accountAddress.sameAsCustomerAddress) {
            let error = validate('ACCOUNT', addressValidationSchema, accountAddress);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        let error = validate('ACCOUNT', billOptionsValidationSchema, billOptions);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }

        error = validate('ACCOUNT', securityQuestionValidationSchema, securityData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
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
            newCustomerData.current.customer.account[0].idNbr = personalAccountData.idNbr
        }
        if (selectedCustomerType === 'BUSINESS') {
            newCustomerData.current.customer.account[0].companyName = businessAccountData.companyName
            newCustomerData.current.customer.account[0].registeredDate = businessAccountData.registeredDate
            newCustomerData.current.customer.account[0].registeredNbr = businessAccountData.registeredNbr
        }
        newCustomerData.current.customer.account[0].email = personalAccountData.email
        newCustomerData.current.customer.account[0].contactType = personalAccountData.contactType
        newCustomerData.current.customer.account[0].contactNbr = personalAccountData.contactNbr
        newCustomerData.current.customer.account[0].priority = personalAccountData.priority
        newCustomerData.current.customer.account[0].class = personalAccountData.class
        newCustomerData.current.customer.account[0].category = personalAccountData.category
        newCustomerData.current.customer.account[0].baseCollPlan = personalAccountData.baseCollPlan
        newCustomerData.current.customer.account[0].contactTitle = personalAccountData.contactTitle
        newCustomerData.current.customer.account[0].contactForeName = personalAccountData.contactForeName
        newCustomerData.current.customer.account[0].contactSurName = personalAccountData.contactSurName

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
        newCustomerData.current.customer.account[0].billOptions.billDeliveryMethod = billOptions.billDeliveryMethod
        newCustomerData.current.customer.account[0].billOptions.noOfCopies = billOptions.noOfCopies

        if (!newCustomerData.current.customer.account[0].securityData) {
            newCustomerData.current.customer.account[0].securityData = {}
        }
        newCustomerData.current.customer.account[0].securityData.securityQuestion = securityData.securityQuestion
        newCustomerData.current.customer.account[0].securityData.securityAnswer = securityData.securityAnswer
        return true;
    }

    const handleAccountDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            accountDetails: 'form'
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
                accountPartDetails.email = personalDetailsData.email
                accountPartDetails.contactType = personalDetailsData.contactType
                accountPartDetails.contactTypeDesc = personalDetailsData.contactTypeDesc
                accountPartDetails.contactNbr = personalDetailsData.contactNbr
                setBusinessAccountData({ ...businessAccountData, ...accountPartDetails, sameAsCustomerDetails: value })
            }
        } else {
            if (selectedCustomerType === 'RESIDENTIAL') {
                setPersonalAccountData({ ...personalAccountData, sameAsCustomerDetails: value })
            }
            if (selectedCustomerType === 'BUSINESS') {
                setBusinessAccountData({ ...businessAccountData, sameAsCustomerDetails: value })
            }
        }
    }
    const setCutomerIDAndAccountID = () => {
        if (!newCustomerData.current.customer) {
            newCustomerData.current.customer = {}
        }
        if (!newCustomerData.current.customer.account) {
            newCustomerData.current.customer.account = []
            newCustomerData.current.customer.account.push({})
        }
        customerId = sessionStorage.getItem("customerQuickSearchInput");
        newCustomerData.current.customer.customerId = customerId
        newCustomerData.current.customer.account[0].accountId = accountId


    }

    const setServiceDetails = () => {
        setCutomerIDAndAccountID()
        let error = validate('SERVICE', serviceDataValidationSchema, serviceData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
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
            error = validate('SERVICE', gsmValidationSchema, gsm);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        error = validate('SERVICE', depositValidationSchema, deposit);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
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
        newCustomerData.current.customer.account[0].service[0].product = serviceData.product

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
            newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection = fixedService.serviceNumberSelection
            newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberGroup = fixedService.serviceNumberGroup
            newCustomerData.current.customer.account[0].service[0].fixed.exchangeCode = fixedService.exchangeCode
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
            newCustomerData.current.customer.account[0].service[0].mobile.dealership = mobileService.dealership
            if (mobileService.serviceNumberSelection === 'manual') {
                newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection = 'manual'
                newCustomerData.current.customer.account[0].service[0].mobile.accessNbr = mobileService.accessNbr
            } else {
                newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection = 'auto'
            }
            if (!newCustomerData.current.customer.account[0].service[0].mobile.gsm) {
                newCustomerData.current.customer.account[0].service[0].mobile.gsm = {}
            }
            newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid = gsm.iccid
            newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi = gsm.imsi
            newCustomerData.current.customer.account[0].service[0].mobile.gsm.creditProfile = gsm.creditProfile
        }

        if (!newCustomerData.current.customer.account[0].service[0].deposit) {
            newCustomerData.current.customer.account[0].service[0].deposit = {}
        }

        if (deposit.includeExclude === 'include') {
            newCustomerData.current.customer.account[0].service[0].deposit.includeExclude = deposit.includeExclude
            newCustomerData.current.customer.account[0].service[0].deposit.charge = deposit.charge
            newCustomerData.current.customer.account[0].service[0].deposit.paymentMethod = deposit.paymentMethod
        }
        if (deposit.includeExclude === 'exclude') {
            newCustomerData.current.customer.account[0].service[0].deposit.includeExclude = deposit.includeExclude
            newCustomerData.current.customer.account[0].service[0].deposit.excludeReason = deposit.excludeReason
        }
        return true;
    }

    const handleServiceDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            serviceDetails: 'form'
        })
    }

    const handlePreview = () => {
        if (setServiceDetails()) {
            toast.success("Field validations completed successfully");
            setRenderMode({
                ...renderMode,
                customerTypeSelection: 'hide',
                customerDetails: 'view',
                accountDetails: 'view',
                serviceDetails: 'view',
                submitButton: 'show',
                cancelButton: 'show',
                previewButton: 'hide'
            })
        }
    }

    const handleCancel = () => {
        setRenderMode({
            ...renderMode,
            customerTypeSelection: 'show',
            customerDetails: 'form',
            accountDetails: 'form',
            serviceDetails: 'form',
            submitButton: 'hide',
            cancelButton: 'hide',
            previewButton: 'show'
        })
    }

    const handleSubmit = () => {
        showSpinner();
        post(properties.CUSTOMER_API + "/service", newCustomerData.current.customer)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Customer, Account & Service created successfully.");
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            customerDetailsEditButton: 'hide',
                            accountDetailsEditButton: 'hide',
                            serviceDetailsEditButton: 'hide'
                        })
                    } else {
                        toast.error("Failed to create - " + resp.status);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'show',
                            previewButton: 'hide'
                        })
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                    setRenderMode({
                        ...renderMode,
                        submitButton: 'hide',
                        cancelButton: 'show',
                        previewButton: 'hide'
                    })
                }
            }).finally(hideSpinner);
    }

    return (
        <div className="row mt-1">
            <div className="col-12">
                <div className="">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '0px' }}>
                        <div className="testFlex">

                            <div className="new-customer col-md-12">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">

                                    <Element name="serviceSection" className="element">
                                        <div className="modal-header">
                                            <h4 className="modal-title">Add Services</h4>
                                        </div>
                                        <div><hr></hr></div>

                                        <fieldset className="scheduler-border">
                                            {
                                                (renderMode.serviceDetails === 'form') ?
                                                    <ServiceDetailsForm data={{
                                                        serviceData: serviceData,
                                                        installationAddress: installationAddress,
                                                        fixedService: fixedService,
                                                        mobileService: mobileService,
                                                        gsm: gsm,
                                                        deposit: deposit,
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
                                                            plansList: plansList
                                                        }}
                                                        lookupsHandler={{
                                                            addressChangeHandler: addressChangeHandler,
                                                            setProductLookup: setProductLookup,
                                                        }}
                                                        error={serviceDetailsError}
                                                        setError={setServiceDetailsError}
                                                        handler={{
                                                            setServiceData: setServiceData,
                                                            setInstallationAddress: setInstallationAddress,
                                                            setFixedService: setFixedService,
                                                            setMobileService: setMobileService,
                                                            setGSM: setGSM,
                                                            setDeposit: setDeposit,
                                                            setDetailsValidate: setServiceValidate

                                                        }}
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
                                                        mobileService: fixedService,
                                                        gsm: gsm,
                                                        deposit: deposit
                                                    }}
                                                    />
                                                    :
                                                    <></>
                                            }
                                            {
                                                (renderMode.serviceDetails === 'form') ?
                                                    <div className="d-flex justify-content-end">
                                                        <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleServiceDetailsCancel}>Cancel</button>
                                                        <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleServiceDetailsDone}>Done</button>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            {
                                                (renderMode.serviceDetails === 'view' && renderMode.accountDetailsEditButton === 'show') ?
                                                    <div className="d-flex justify-content-end edit-btn">
                                                        <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleServiceDetailsEdit}>Edit</button>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </fieldset>
                                    </Element>
                                    <div className="d-flex justify-content-center">
                                        {
                                            (renderMode.previewButton === 'show') ?
                                                <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handlePreview}>Preview</button>
                                                :
                                                <></>
                                        }
                                        {
                                            (renderMode.submitButton === 'show') ?
                                                <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>
                                                :
                                                <></>
                                        }
                                        {
                                            (renderMode.cancelButton === 'show') ?
                                                <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={handleCancel}>Cancel</button>
                                                :
                                                <></>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div >


    )

}
export default NewCustomerService;
