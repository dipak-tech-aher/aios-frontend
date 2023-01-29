import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import {
    Link, Element
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";
import { put, get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import ServiceRequestList from '../customer360/serviceRquestList'
import CreateCustomerInquiryDetailsForm from './createCustomerInquiryForm';
import CustomerEnquiryPreview from './newCustomerInquiryPreview';
import NewCustomerBusinessInquiryPreview from './newCustomerBusinessInquiryPreview';
import NewCustomerBusinessInquiryForm from './newCustomerBusinessInquiryForm';


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

const customerInquiryFromValidationSchema = object().shape({
    customerName: string().required("Customer name is required"),
    //remark: string().required("Remark is required"),
    contactPreference: string().required("Contact Preference is required"),
    customerCategory: string().required("Category is required"),
    serviceType: string().required("Service type is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    productEnquired: string().required("Product enquired type is required"),
    contactNbr: string().required("Contact Number is required")
});
const personalCustomerInquiryFromValidationSchema = object().shape({
    customerName: string().required("Customer name is required"),
    //remark: string().required("Remark is required"),
    contactPreference: string().required("Contact Preference is required"),
    customerCategory: string().required("Category is required"),
    serviceType: string().required("Service type is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    productEnquired: string().required("Product enquired type is required"),
    contactNbr: string().required("Contact Number is required")
});

const businessCustomerInquiryFromValidationSchema = object().shape({
    companyName: string().required("Company name is required"),
    //remark: string().required("Remark is required"),
    contactPreference: string().required("Contact Preference is required"),
    customerCategory: string().required("Category is required"),
    serviceType: string().required("Service type is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    productEnquired: string().required("Product enquired type is required"),
    contactNbr: string().required("Contact Number is required")
});

const validateDateFormat = (value) => {
    try {
        Date.parse(value)
        return true
    } catch (e) {
        return false
    }
}


function EditCustomerInquiry(props) {

    const { t } = useTranslation();
    //let crmCustomerId = null;
    let leadId = sessionStorage.getItem("leadID")

    const [customerDetailsError, setCustomerDetailsError] = useState({});

    const [renderMode, setRenderMode] = useState({
        customerTypeSelection: 'hide',
        customerDetails: 'form',
        customerDetailsPreview: 'hide',
        previewButton: 'show',
        submitButton: 'hide',
        cancelButton: 'hide',
        customerDetailsEditButton: 'show',
        isCustomerEditMode: 'show'
    })

    const newCustomerData = useRef({})

    const [newCustomerDetails, setNewCustomerDetails] = useState({})

    //const [selectedCustomerType, setSelectedCustomerType] = useState('RESIDENTIAL')
    const [selectedCustomerType, setSelectedCustomerType] = useState('RESIDENTIAL')

    const [customerStatus, setCustomerStatus] = useState('')
    const [crmCustomerId, setCRMCustomerID] = useState('123')
    //const [crmCustomerId, setCRMCustomerID] = useState(null)


    const [personalInquireData, setCustomerInquiryData] = useState({
        customerName: '',
        customerCategory: '',
        customerCategoryDesc: '',
        serviceType: '',
        serviceTypeDesc: '',
        productEnquired: '',
        email: '',
        contactPreference: '',
        contactPreferenceDesc: '',
        contactNbr: '',
        remark: ''
    });
    const [customerbusinessInquireData, setCustomerBusinessInquiryData] = useState({
        companyName: '',
        customerCategory: '',
        customerCategoryDesc: '',
        serviceType: '',
        serviceTypeDesc: '',
        productEnquired: '',
        email: '',
        contactPreference: '',
        contactPreferenceDesc: '',
        contactNbr: '',
        remark: ''
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
    const [incomingLeadID, setLeadID] = useState()


    useEffect(() => {
        let district = []
        let kampong = []
        let postCode = []
        let plans = []
        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        showSpinner();
        setLeadID(data.leadId)
        getLeadApiData(data)
        if (crmCustomerId !== null) {
            setCustomerStatus('existing_customer')
        }
        else {
            setCustomerStatus('new_customer')
        }


        post(properties.BUSINESS_ENTITY_API, ['CATEGORY',
            'CLASS',
            'CONTACT_TYPE'
        ])
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
                    setDistrictLookup(district)
                    setKampongLookup(kampong)
                    setPostCodeLookup(postCode)
                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    hideSpinner();

                }
            }).finally();

    }, [props.location.state]);
    //get lead api data call
    const getLeadApiData = (data) => {
        let apiData;
        get(properties.CUSTOMER_INQUIRY_API + `/${data.leadId}`)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        apiData = resp.data
                        toast.success("get customer Inquiry Successfully");
                        setCustomerInquiryData({
                            customerName: apiData.custName,
                            customerCategory: apiData.custCat,
                            serviceType: apiData.serviceType,
                            productEnquired: apiData.productEnquired,
                            email: apiData.emailId,
                            contactPreference: apiData.contactPreference,
                            contactNbr: apiData.contactNo,
                            remark: apiData.remarks
                        })
                        setCustomerBusinessInquiryData({
                            companyName: apiData.custName,
                            customerCategory: apiData.custCat,
                            serviceType: apiData.serviceType,
                            productEnquired: apiData.productEnquired,
                            email: apiData.emailId,
                            contactPreference: apiData.contactPreference,
                            contactNbr: apiData.contactNo,
                            remark: apiData.remarks
                        })

                        //setCustomerData(resp.data)
                        //setData(resp.data);
                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);

                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);

                }
            });

    }
    const validate = (section, schema, data) => {
        try {
            if (section === 'CUSTOMER') {
                setCustomerDetailsError({})
            }
            // if (section === 'ACCOUNT') {
            //     //setAccountDetailsError({})
            // }
            // if (section === 'SERVICE') {
            //     setServiceDetailsError({})
            // }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'CUSTOMER') {
                    setCustomerDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
                // if (section === 'ACCOUNT') {
                //     setAccountDetailsError((prevState) => {
                //         return { ...prevState, [err.params.path]: err.message };
                //     });
                // }
                // if (section === 'SERVICE') {
                //     setServiceDetailsError((prevState) => {
                //         return { ...prevState, [err.params.path]: err.message };
                //     });
                // }
            });
            return e;
        }
    };


    const handleCustomerTypeChange = (value) => {
        setSelectedCustomerType(value)
        setRenderMode({ ...renderMode, customerDetails: 'form', accountDetails: 'form', serviceDetails: 'form', previewButton: 'show' })
    }

    const handleCustomerDetailsCancel = () => {
        if (!newCustomerData.current.customer) {
            return;
        }
        newCustomerData.current.customer.customerType = selectedCustomerType
        if (newCustomerData.current.customer.customerType === 'RESIDENTIAL') {
            setCustomerInquiryData(
                {
                    customerName: newCustomerData.current.customer.custName,
                    customerCategory: newCustomerData.current.customer.custCat,
                    serviceType: newCustomerData.current.customer.serviceType,
                    productEnquired: newCustomerData.current.customer.productEnquired,
                    email: newCustomerData.current.customer.emailId,
                    contactPreference: newCustomerData.current.customer.contactPreference,
                    contacyNbr: newCustomerData.current.customer.contactNo,
                    remark: newCustomerData.current.customer.remarks,
                }
            )
        }
        if (selectedCustomerType === 'BUSINESS') {
            setCustomerBusinessInquiryData(
                {
                    companyName: newCustomerData.current.customer.custName,
                    customerCategory: newCustomerData.current.customer.custCat,
                    serviceType: newCustomerData.current.customer.serviceType,
                    productEnquired: newCustomerData.current.customer.productEnquired,
                    email: newCustomerData.current.customer.emailId,
                    contactPreference: newCustomerData.current.customer.contactPreference,
                    contacyNbr: newCustomerData.current.customer.contactNo,
                    remark: newCustomerData.current.customer.remarks,
                }
            )
        }
        setSelectedCustomerType(newCustomerData.current.customer.customerType)
        setRenderMode({
            ...renderMode,
            customerDetails: 'view',
            customerTypeSelection: 'hide',
            previewButton: "hide",
            submitButton: 'hide',
            cancelButton: 'hide'
        })
    }

    const handleCustomerDetailsDone = () => {
        if (setCustomerDetails()) {
            setRenderMode({
                ...renderMode,
                customerDetails: 'view',
                customerTypeSelection: 'hide',
                submitButton: 'hide',
                cancelButton: 'hide'
            })
        }
    }

    const setCustomerDetails = () => {
        if (selectedCustomerType === 'RESIDENTIAL') {
            const error = validate('CUSTOMER', customerInquiryFromValidationSchema, personalInquireData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (selectedCustomerType === 'BUSINESS') {
            const error = validate('CUSTOMER', businessCustomerInquiryFromValidationSchema, customerbusinessInquireData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (!newCustomerData.current.customer) {
            newCustomerData.current.customer = {}
        }
        //newCustomerData.current.customer.customerType = selectedCustomerType
        if (selectedCustomerType === 'RESIDENTIAL') {
            newCustomerData.current.customer.leadId = incomingLeadID //need dynamic lead id from search
            newCustomerData.current.customer.custName = personalInquireData.customerName
            newCustomerData.current.customer.custCat = personalInquireData.customerCategory
            newCustomerData.current.customer.serviceType = personalInquireData.serviceType
            newCustomerData.current.customer.productEnquired = personalInquireData.productEnquired
            newCustomerData.current.customer.contactPreference = personalInquireData.contactPreference
            newCustomerData.current.customer.emailId = personalInquireData.email
            newCustomerData.current.customer.contactNo = personalInquireData.contactNbr
            newCustomerData.current.customer.remarks = personalInquireData.remark
        }
        if (selectedCustomerType === 'BUSINESS') {
            newCustomerData.current.customer.leadId = '42' //need dynamic lead id from search
            newCustomerData.current.customer.custName = customerbusinessInquireData.companyName
            newCustomerData.current.customer.custCat = customerbusinessInquireData.customerCategory
            newCustomerData.current.customer.serviceType = customerbusinessInquireData.serviceType
            newCustomerData.current.customer.productEnquired = customerbusinessInquireData.productEnquired
            newCustomerData.current.customer.contactPreference = customerbusinessInquireData.contactPreference
            newCustomerData.current.customer.emailId = customerbusinessInquireData.email
            newCustomerData.current.customer.contactNo = customerbusinessInquireData.contactNbr
            newCustomerData.current.customer.remarks = customerbusinessInquireData.remark
        }

        return true
    }

    const handleCustomerDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            customerDetails: 'form',
            customerTypeSelection: 'show',
            previewButton: 'show',
            submitButton: 'hide',
            cancelButton: 'hide'
        })
    }

    const handlePreview = () => {
        if (setCustomerDetails()) {
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

    const handleUpdate = () => {
        showSpinner();
        put(properties.CUSTOMER_INQUIRY_API + `/${incomingLeadID}`, newCustomerData.current.customer)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Customer, Inquiry Updated  successfully " + resp.data);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            customerDetailsEditButton: 'hide',
                            accountDetailsEditButton: 'hide',
                            serviceDetailsEditButton: 'hide'
                        })
                        setNewCustomerDetails({
                            customerId: resp.data.leadId
                        })
                        //getLeadApiData();
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
        // setNewCustomerDetails({
        //     customerId: 135
        // })
    }

    return (
        <div className="row mt-1">
            <div className="col-12">
                <h1 className="title">Inquiry - (New)</h1>
                <div className="card-box">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '0px' }}>
                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <div className="">
                                    <nav className="navbar navbar-default navbar-fixed-top">
                                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                            <ul className="nav navbar-nav">
                                                <li><Link activeclassName="active" className="test3" to="customersection" spy={true} offset={-190} smooth={true} duration={100}>Customer</Link></li>
                                                {/* <li><Link activeclassName="active" className="test2" to="accountSection" spy={true} offset={-100} smooth={true} duration={100}>Address</Link></li>
                                                <li><Link activeclassName="active" className="test3" to="serviceSection" spy={true} offset={-320} smooth={true} duration={100}>Contact</Link></li> */}
                                                <li><Link activeclassName="active" className="test1" to="serviceSection" spy={true} offset={-320} smooth={true} duration={100}>Inquiry</Link></li>
                                                {
                                                    (newCustomerDetails && newCustomerDetails.customerId) ?
                                                        <li><Link activeclassName="active" className="test4" to="serviceRequestSection" spy={true} offset={-320} smooth={true} duration={100}>Service Request</Link></li>
                                                        :
                                                        <></>
                                                }
                                            </ul>
                                        </div>

                                    </nav>
                                </div>
                            </div>
                            <div className="new-customer col-md-10">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">
                                    <Element name="customersection" className="element" >
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle"><h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>Edit {t("customer")} ID : {incomingLeadID}</h4>
                                                </section>
                                                {/* <div className="col-8">
                                                <h4 id="list-item-0" style={{ alignContent: 'left' }}>{t("new_customer")}</h4>
                                            </div> */}
                                            </div>
                                        </div>


                                        {
                                            (renderMode.customerTypeSelection === 'show') ?
                                                <div className="pt-2">
                                                    <fieldset className="scheduler-border">
                                                        <div className="row col-12 form-row mt-1">
                                                            <div className="col-12 pl-2 bg-light border">
                                                                <h5 className="text-primary">Customer Type</h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row pt-2">
                                                            <div className="col-md-2 pl-0">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio1" disabled className="form-check-input" name="optCustomerType" value='RESIDENTIAL'
                                                                            checked={'RESIDENTIAL' === selectedCustomerType} onChange={e => handleCustomerTypeChange(e.target.value)} />
                                                                        <label htmlFor="radio1">{t("personal")}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio2" disabled className="form-check-input" name="optCustomerType" value='BUSINESS'
                                                                            checked={'BUSINESS' === selectedCustomerType} onChange={e => handleCustomerTypeChange(e.target.value)} />
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
                                            (selectedCustomerType && selectedCustomerType !== '') ?
                                                <div className="pt-2">
                                                    <fieldset className="scheduler-border">
                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                                <CreateCustomerInquiryDetailsForm data={{
                                                                    personalDetailsData: personalInquireData,
                                                                    personalAccountData: personalAccountData
                                                                }}
                                                                    customerType={selectedCustomerType}
                                                                    viewMode={customerStatus}
                                                                    lookups={{
                                                                        categoryLookup: categoryLookup,
                                                                        classLookup: classLookup,
                                                                        contactTypeLookup: contactTypeLookup,
                                                                        districtLookup: districtLookup,
                                                                        kampongLookup: kampongLookup,
                                                                        postCodeLookup: postCodeLookup
                                                                    }}
                                                                    // lookupsHandler={{
                                                                    //     addressChangeHandler: addressChangeHandler
                                                                    // }}
                                                                    stateHandler={{
                                                                        setPersonalDetailsData: setCustomerInquiryData,
                                                                        setPersonalAccountData: setPersonalAccountData
                                                                    }}
                                                                    error={customerDetailsError}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'view') ?
                                                                <CustomerEnquiryPreview custType={selectedCustomerType}
                                                                    data={personalInquireData} />
                                                                :
                                                                <></>
                                                        }

                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'form') ?
                                                                <NewCustomerBusinessInquiryForm
                                                                    data={{
                                                                        businessDetailsData: customerbusinessInquireData,
                                                                        businessAccountData: businessAccountData
                                                                    }}
                                                                    viewMode={customerStatus}
                                                                    lookups={{
                                                                        categoryLookup: categoryLookup,
                                                                        classLookup: classLookup,
                                                                        contactTypeLookup: contactTypeLookup
                                                                    }}
                                                                    stateHandler={{
                                                                        setPersonalDetailsData: setCustomerBusinessInquiryData,
                                                                        setPersonalAccountData: setPersonalAccountData
                                                                    }}
                                                                    // stateHandler={{
                                                                    //     setBusinessDetailsData: setBusinessDetailsData,
                                                                    //     setBusinessAccountData: setBusinessAccountData
                                                                    // }}
                                                                    error={customerDetailsError}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') ?
                                                                <NewCustomerBusinessInquiryPreview custType={selectedCustomerType} data={customerbusinessInquireData} />
                                                                :
                                                                <></>
                                                        }

                                                        {/* {
                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'form') ?
                                                <BusinessCustomerDetailsForm
                                                    data={{
                                                        businessDetailsData: businessDetailsData,
                                                        businessAccountData: businessAccountData
                                                    }}
                                                    lookups={{
                                                        categoryLookup: categoryLookup,
                                                        classLookup: classLookup,
                                                        contactTypeLookup: contactTypeLookup
                                                    }}
                                                    stateHandler={{
                                                        setBusinessDetailsData: setBusinessDetailsData,
                                                        setBusinessAccountData: setBusinessAccountData
                                                    }}
                                                    error={customerDetailsError}
                                                />
                                                :
                                                <></>
                                        }
                                        {
                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') ?
                                                <BusinessCustomerDetailsPreview custType={selectedCustomerType} data={businessDetailsData} />
                                                :
                                                <></>
                                        } */}



                                                        {
                                                            (renderMode.customerDetails === 'form') ?
                                                                <div className="d-flex justify-content-end">
                                                                    <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleCustomerDetailsCancel}>Cancel</button>
                                                                    <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleCustomerDetailsDone}>Done</button>
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (renderMode.customerDetails === 'view' && renderMode.customerDetailsEditButton === 'show') ?
                                                                <div className="d-flex justify-content-end edit-btn">
                                                                    <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleCustomerDetailsEdit}>Edit</button>
                                                                </div>
                                                                :
                                                                <></>
                                                        }
                                                    </fieldset>
                                                </div> : <></>
                                        }
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
                                                <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleUpdate}>Save</button>
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
                                                                        customerDetails: newCustomerDetails
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
                </div>
            </div>

        </div>

    )

}
export default EditCustomerInquiry;



