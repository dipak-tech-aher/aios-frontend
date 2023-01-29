import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Link, Element } from 'react-scroll'
import { toast } from "react-toastify";
import { string, object } from "yup";
import { put, get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import CreateCustomerInquiryDetailsForm from './createCustomerInquiryForm';

import NewCustomerEnquiryPreview from './newCustomerInquiryPreview';
import CustomerInquiryList from './getCustomerInquiryList';
import NewCustomerBusinessInquiryPreview from './newCustomerBusinessInquiryPreview';
import NewCustomerBusinessInquiryForm from './newCustomerBusinessInquiryForm';
import InquiryDetailsForm from './inquiryDetailsForm';
import FileUpload from '../common/uploadAttachment/fileUpload';

const createInquiryFromValidationSchema = object().shape({
    customerName: string().required("Customer name is required"),
    contactPreference: string().required("Contact Preference is required"),
    customerCategory: string().required("Category is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactNbr: string().required("Contact Number is required")
});

const inquiryDetailsFromValidationSchema = object().shape({
    inquiryAbout: string().required("Inquiry About is required"),
    ticketChannel: string().required("Ticket Channel Preference is required"),
    ticketSource: string().required("Ticket Source is required"),
    serviceType: string().required("Service type is required"),
    problemCause: string().required("Problem Cause is required")

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

function EditCustomersInquiryDetails(props) {

    const { t } = useTranslation();

    const [customerDetailsError, setCustomerDetailsError] = useState({});
    const [inquiryDetailsError, setInquiryDetailsError] = useState({});
    const [incomingLeadID, setLeadID] = useState()
    const [customerStatus, setCustomerStatus] = useState({ mode: '' })
    const [crmCustomerId, setCRMCustomerID] = useState(
        {
            customerId: "",
            transactionID: ""
        }
    )


    const [switchToExistingCustomer, setSwitchToExistingCustomer] =
        useState({
            isExsitingCustomer: false
        })


    const [renderMode, setRenderMode] = useState({
        customerTypeSelection: 'hide',
        customerDetails: 'form',
        customerDetailsPreview: 'hide',
        previewButton: 'show',
        submitButton: 'hide',
        cancelButton: 'hide',
        customerDetailsEditButton: 'show',
    })

    const newCustomerData = useRef({})

    const [newCustomerDetails, setNewCustomerInquiryDetails] = useState({})

    const [selectedCustomerType, setSelectedCustomerType] = useState('RESIDENTIAL')

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

    const [inquiryDataDetails, setInquiryDataDetails] = useState({
        inquiryAbout: '',
        inquiryAboutDesc: '',
        ticketChannel: '',
        ticketChannelDesc: '',
        ticketSource: '',
        ticketSourceDesc: '',
        serviceType: '',
        serviceTypeDesc: '',
        problemCause: '',
        problemCauseDesc: ''
    })
    //lookup data assigment
    const serviceTypeLookup = [
        { code: 'Postpaid', description: 'Postpaid' },
        { code: 'Prepaid', description: 'Prepaid' },
        { code: 'Fixed', description: 'Fixed' },
        { code: 'Fixed Broadband', description: 'Fixed Broadband' },
        { code: 'Booster', description: 'Booster' }
    ]

    const lookupInquiryAbout = [

        { code: 'fixed', description: 'Billing' },
        { code: 'Prepaid', description: 'Budget' },
        { code: 'postpaid', description: 'Data Usage' },
        { code: 'Rewards', description: 'Rewards' },
        { code: 'SelfCare', description: 'Self Care' },
        { code: 'VAS', description: 'Value Added Service' }
    ]

    const lookupTicketchannel = [
        { code: 'Roadshow', description: 'Roadshow' },
        { code: 'Walkin', description: 'Walkin' },
        { code: 'Email', description: 'Email' },
        { code: 'Center', description: 'Center' },
        { code: 'SocialMedia', description: 'Social Media' }
    ]


    const lookupTicketSource = [
        { code: 'Customer', description: 'Customer' },
        { code: 'staff', description: 'Staff' },
        { code: 'others', description: 'Others' }
    ]

    const lookupCause = [
        { code: 'cause1', description: 'Cause1' },
        { code: 'cause2', description: 'Cause2' },
        { code: 'cause3', description: 'Cause3' }
    ]


    const lookupData = useRef({})
    const addressLookup = useRef({})
    const plansList = useRef({})
    const catalogList = useRef({})

    const [categoryLookup, setCategoryLookup] = useState([{}])
    const [classLookup, setClassLookup] = useState([{}])
    const [contactTypeLookup, setContactTypeLookup] = useState([{}])
    const [ticketChannel, setTicketChannelLookup] = useState([{}])
    const [ticketSource, setTicketSourceLookup] = useState([{}])
    const [problemCause, setProblemCauseLookup] = useState([{}])
    const [saveSearchResultData, setSaveSearchResultData] = useState()


    useEffect(() => {
        //showSpinner();

        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        //setLeadID(data.customerId)
        setCRMCustomerID({
            customerId: data.customerId,
            transactionID: data.interactionId
        })
        getInquiryDetailsByIntxnID(data)
        if (crmCustomerId.customerId !== null) {
            setCustomerStatus({ customerStatus, mode: 'existing_customer' })
        }
        else {
            setCustomerStatus({ customerStatus, mode: 'Create_New' })
        }
    }, [props.location.state, crmCustomerId.customerId, crmCustomerId.transactionID]);

    useEffect(() => {
        let district = []
        let kampong = []
        let postCode = []
        let plans = []

        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['CATEGORY',
            'CLASS',
            'CONTACT_TYPE',
            'PROBLEM_CAUSE',
            'TICKET_CHANNEL',
            'TICKET_SOURCE'
        ])
            .then((resp) => {
                if (resp.data) {
                    lookupData.current = resp.data

                    setCategoryLookup(lookupData.current['CATEGORY'])
                    setClassLookup(lookupData.current['CLASS'])
                    setContactTypeLookup(lookupData.current['CONTACT_TYPE'])
                    setTicketChannelLookup(lookupData.current['TICKET_CHANNEL'])
                    setTicketSourceLookup(lookupData.current['TICKET_SOURCE'])
                    setProblemCauseLookup(lookupData.current['PROBLEM_CAUSE'])
                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    hideSpinner();

                }
            }).finally();

    }, []);

    //get lead api data call
    const getInquiryDetailsByIntxnID = (data) => {
        let apiData;
        let custData;
        showSpinner();
        get(properties.CUSTOMER_INQUIRY_API_2 + `/${data.interactionId}`)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        apiData = resp.data
                        toast.success("get customer Inquiry Successfully");
                        setInquiryDataDetails({
                            inquiryAbout: '',
                            ticketChannel: apiData.chnlCode,
                            ticketSource: apiData.sourceCode,
                            serviceType: '',
                            problemCause: apiData.problemCode,
                        })
                        setSaveSearchResultData(apiData)
                        get(`${properties.CUSTOMER_DETAILS}/${data.customerId}?serviceId=${data.serviceId}`)
                            .then((customerResp) => {
                                if (customerResp && customerResp.data) {
                                    custData = customerResp.data
                                }
                                //customer details
                                setCustomerInquiryData({
                                    customerName: custData.title + " " + custData.foreName + " " + custData.surName,
                                    customerCategory: custData.category,
                                    email: custData.email,
                                    contactPreference: custData.contactType,
                                    contactNbr: custData.contactNbr,
                                })
                            })
                        // setCustomerBusinessInquiryData({
                        //     companyName: apiData.custName,
                        //     customerCategory: apiData.custCat,
                        //     serviceType: apiData.serviceType,
                        //     productEnquired: apiData.productEnquired,
                        //     email: apiData.emailId,
                        //     contactPreference: apiData.contactPreference,
                        //     contactNbr: apiData.contactNo,
                        //     remark: apiData.remarks
                        // })

                        //setCustomerData(resp.data)
                        //setData(resp.data);
                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);

                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);

                }
            }).finally(hideSpinner);

    }


    const validate = (section, schema, data) => {
        try {
            if (section === 'CreateInquiry') {
                setCustomerDetailsError({})
            }
            if (section === 'InquriyDetails') {
                setInquiryDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'CreateInquiry') {
                    setCustomerDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
                if (section === 'InquriyDetails') {
                    setInquiryDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }

            });
            return e;
        }


    };


    const handleCustomerTypeChange = (value) => {

        setSelectedCustomerType(value)
        setRenderMode({ ...renderMode, customerDetails: 'form', accountDetails: 'form', serviceDetails: 'form', previewButton: 'show' })
    }

    const handleInquiryDetailsCancel = () => {
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
            submitButton: 'hide',
            cancelButton: 'hide',
            previewButton: 'show'
        })
    }

    const handleInquiryrDetailsDone = () => {
        if (/*setCustomerDetails() && */setInquiryDetails()) {
            setRenderMode({
                ...renderMode,
                customerDetails: 'view',
                customerTypeSelection: 'hide',
                submitButton: 'hide',
                cancelButton: 'hide',
                previewButton: 'show'
            })
        }
    }

    const setInquiryDetails = () => {
        if (selectedCustomerType === 'RESIDENTIAL') {
            const error = validate('InquriyDetails', inquiryDetailsFromValidationSchema, inquiryDataDetails);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            if (!newCustomerData.current.customer) {
                newCustomerData.current.customer = {}
            }
            if (customerStatus.mode === 'existing_customer') {
                newCustomerData.current.customer.service = inquiryDataDetails.serviceType
                newCustomerData.current.customer.inquryAbout = inquiryDataDetails.inquiryAbout
                newCustomerData.current.customer.ticketChannel = inquiryDataDetails.ticketChannel//"CHNL004",
                newCustomerData.current.customer.ticketSource = inquiryDataDetails.ticketSource//"SRC006",
                newCustomerData.current.customer.problem_cause = inquiryDataDetails.problemCause//"CT007",
                newCustomerData.current.customer.status = "NEW"
                newCustomerData.current.customer.details = saveSearchResultData.description
                newCustomerData.current.customer.customerId = saveSearchResultData.customerId
                newCustomerData.current.customer.accountId = saveSearchResultData.accountId
                newCustomerData.current.customer.connectionId = saveSearchResultData.connectionId
            }
            else {
                newCustomerData.current.customer.service = inquiryDataDetails.serviceType
                newCustomerData.current.customer.inquryAbout = inquiryDataDetails.inquiryAbout
                newCustomerData.current.customer.ticketChannel = inquiryDataDetails.ticketChannel//"CHNL004",
                newCustomerData.current.customer.ticketSource = inquiryDataDetails.ticketSource//"SRC006",
                newCustomerData.current.customer.problemCause = inquiryDataDetails.problemCause//"CT007",
                newCustomerData.current.customer.status = "NEW"
                newCustomerData.current.customer.details = "Details"
                // newCustomerData.current.customer.customerId = ""
                // newCustomerData.current.customer.accountId = ""
                // newCustomerData.current.customer.connectionId = ""
            }
        }
        return true
    }

    const setCustomerDetails = () => {
        if (selectedCustomerType === 'RESIDENTIAL') {
            const error = validate('CreateInquiry', createInquiryFromValidationSchema, personalInquireData);
            if (error) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }

        if (selectedCustomerType === 'BUSINESS') {
            const error = validate('CreateInquiry', businessCustomerInquiryFromValidationSchema, customerbusinessInquireData);
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
            // newCustomerData.current.customer.companyName = personalDetailsData.companyName
            // newCustomerData.current.customer.category = personalDetailsData.category
            // newCustomerData.current.customer.class = personalDetailsData.class
            // newCustomerData.current.customer.email = personalDetailsData.email
            // newCustomerData.current.customer.contactType = personalDetailsData.contactType
            // newCustomerData.current.customer.contactNbr = personalDetailsData.contactNbr

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

    const handleInquiryDetailsEdit = () => {
        setRenderMode({
            ...renderMode,
            customerDetails: 'form',
            customerTypeSelection: 'show',
            submitButton: 'hide',
            cancelButton: 'hide'
        })
    }

    const handlePreview = () => {
        if (setInquiryDetails()) {
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
            submitButton: 'hide',
            cancelButton: 'hide',
            previewButton: 'show'
        })
    }

    const handleSubmit = () => {
        showSpinner();
        put(properties.CUSTOMER_INQUIRY_API_2 + `/${crmCustomerId.interactionId}`, newCustomerData.current.customer)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Customer Inquiry created successfully " + resp.data);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            customerDetailsEditButton: 'hide',
                            accountDetailsEditButton: 'hide',
                            serviceDetailsEditButton: 'hide'
                        })
                        setNewCustomerInquiryDetails({
                            customerId: resp.data.leadId,
                            leadId: resp.data.leadId
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
        // setNewCustomerDetails({
        //     customerId: 135
        // })
    }

    return (
        <div className="row mt-1">
            <div className="col-12">
                <h1 className="title">Update Inquiry - (New)</h1>
                <div className="card-box">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '0px' }}>
                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <div className="">
                                    <nav className="navbar navbar-default navbar-fixed-top">
                                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                            <ul className="nav navbar-nav">
                                                <li><Link activeclassName="active" className="test1" to="customersection" spy={true} offset={-190} smooth={true} duration={100}>Update Inquiry</Link></li>
                                                {/* <li><Link activeclassName="active" className="test2" to="accountSection" spy={true} offset={-100} smooth={true} duration={100}>Address</Link></li>
                                                <li><Link activeclassName="active" className="test3" to="serviceSection" spy={true} offset={-320} smooth={true} duration={100}>Contact</Link></li> */}
                                                <li><Link activeclassName="active" className="test1" to="serviceSection" spy={true} offset={-320} smooth={true} duration={100}>Inquiry Details</Link></li>
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
                                                <section className="triangle">
                                                    <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("update_inquiry")}&nbsp;{newCustomerDetails.leadId}</h4>
                                                </section>
                                            </div>
                                            {/* <div className="col-8">
                                                <h4 id="list-item-0" style={{ alignContent: 'left' }}>{t("new_customer")}</h4>
                                            </div> */}
                                        </div>


                                        {
                                            (renderMode.customerTypeSelection === 'show') ?
                                                <div className="pt-2">
                                                    {/* <fieldset className="scheduler-border">
                                                        <div className="row col-12 form-row mt-1">
                                                            <div className="col-12 pl-2 bg-light border">
                                                                <h5 className="text-primary">Customer Type</h5>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-row pt-2">
                                                            <div className="col-md-2 pl-0">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio1" className="form-check-input" name="optCustomerType" value='RESIDENTIAL'
                                                                            checked={'RESIDENTIAL' === selectedCustomerType} onChange={e => handleCustomerTypeChange(e.target.value)} />
                                                                        <label htmlFor="radio1">{t("personal")}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-2">
                                                                <div className="form-group">
                                                                    <div className="radio radio-primary mb-2">
                                                                        <input type="radio" id="radio2" className="form-check-input" name="optCustomerType" value='BUSINESS'
                                                                            checked={'BUSINESS' === selectedCustomerType} onChange={e => handleCustomerTypeChange(e.target.value)} />
                                                                        <label htmlFor="radio2">{t("business")}</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </fieldset> */}
                                                </div>
                                                :
                                                <></>
                                        }

                                        {
                                            (selectedCustomerType && selectedCustomerType !== '') ?
                                                <div className="pt-2">
                                                    {

                                                        (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                            <div className="pt-2 pr-2">
                                                                <fieldset className="scheduler-border">

                                                                    <CreateCustomerInquiryDetailsForm data={{
                                                                        personalDetailsData: personalInquireData,
                                                                        switchToExistingCustomer: switchToExistingCustomer
                                                                    }}
                                                                        viewMode={customerStatus}
                                                                        customerType={selectedCustomerType}
                                                                        lookups={{
                                                                            categoryLookup: categoryLookup,
                                                                            classLookup: classLookup,
                                                                            contactTypeLookup: contactTypeLookup,
                                                                        }}
                                                                        // lookupsHandler={{
                                                                        //     addressChangeHandler: addressChangeHandler
                                                                        // }}
                                                                        stateHandler={{
                                                                            setPersonalDetailsData: setCustomerInquiryData,
                                                                            setSwitchToExistingCustomer: setSwitchToExistingCustomer
                                                                        }}
                                                                        error={customerDetailsError}
                                                                    />

                                                                </fieldset>
                                                            </div>
                                                            :
                                                            <></>
                                                    }

                                                    {

                                                        (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                            <div className="pt-2">
                                                                <div className="row">
                                                                    <div className="col-12 p-0">
                                                                        <section className="triangle">
                                                                            <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("inquiry_details")}</h4>
                                                                        </section>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-2 pr-2">
                                                                    <fieldset className="scheduler-border">

                                                                        <InquiryDetailsForm data={{
                                                                            inquiryDataDetails: inquiryDataDetails,
                                                                        }}
                                                                            viewMode={'Create'}
                                                                            customerType={selectedCustomerType}
                                                                            lookups={{
                                                                                serviceTypeLookup: serviceTypeLookup,
                                                                                lookupInquiryAbout: lookupInquiryAbout,
                                                                                lookupTicketchannel: ticketChannel,
                                                                                lookupTicketSource: ticketSource,
                                                                                lookupCause: problemCause
                                                                            }}
                                                                            // lookupsHandler={{
                                                                            //     addressChangeHandler: addressChangeHandler
                                                                            // }}
                                                                            stateHandler={{
                                                                                setInquiryDataDetails: setInquiryDataDetails,
                                                                            }}
                                                                            error={inquiryDetailsError}
                                                                        />

                                                                    </fieldset>
                                                                </div>
                                                            </div>
                                                            :
                                                            <></>
                                                    }

                                                    {

                                                        (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                            <div className="pt-2">

                                                                <div className="row">
                                                                    <div className="col-12 p-0">
                                                                        <section className="triangle">
                                                                            <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("attachment")}</h4>
                                                                        </section>
                                                                    </div>
                                                                </div>
                                                                <div className="pt-2 pr-2">
                                                                    <fieldset className="scheduler-border">
                                                                        <FileUpload />
                                                                        {/* <AttachmentToInquiry /> */}
                                                                    </fieldset>
                                                                </div>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'view') ?
                                                            <fieldset className="scheduler-border">

                                                                <NewCustomerEnquiryPreview custType={selectedCustomerType}
                                                                    data={
                                                                        {
                                                                            personalInquireData: personalInquireData,
                                                                            inquiryDataDetails: inquiryDataDetails
                                                                        }

                                                                    } />

                                                            </fieldset>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'form') ?
                                                            <fieldset className="scheduler-border">

                                                                <NewCustomerBusinessInquiryForm
                                                                    data={{
                                                                        businessDetailsData: customerbusinessInquireData,

                                                                    }}
                                                                    lookups={{
                                                                        categoryLookup: categoryLookup,
                                                                        classLookup: classLookup,
                                                                        contactTypeLookup: contactTypeLookup
                                                                    }}
                                                                    stateHandler={{
                                                                        setPersonalDetailsData: setCustomerBusinessInquiryData,
                                                                    }}
                                                                    error={customerDetailsError}
                                                                />

                                                            </fieldset>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') ?
                                                            <fieldset className="scheduler-border">

                                                                <NewCustomerBusinessInquiryPreview custType={selectedCustomerType} data={customerbusinessInquireData} />

                                                            </fieldset>
                                                            :
                                                            <></>
                                                    }

                                                    {
                                                        (renderMode.customerDetails === 'form') ?
                                                            <div className="d-flex justify-content-end">
                                                                <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleInquiryDetailsCancel}>Cancel</button>
                                                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleInquiryrDetailsDone}>Done</button>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderMode.customerDetails === 'view' && renderMode.customerDetailsEditButton === 'show') ?
                                                            <div className="d-flex justify-content-end edit-btn">
                                                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleInquiryDetailsEdit}>Edit</button>
                                                            </div>
                                                            :
                                                            <></>
                                                    }

                                                </div>
                                                : <></>
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
                                    {
                                        (newCustomerDetails && newCustomerDetails.customerId) ?
                                            <Element name="serviceRequestSection">
                                                <section className="triangle col-12">
                                                    <div className="row col-12">
                                                        <div className="col-8">
                                                            <h4 className="pl-1">Customer Inquiry List</h4>
                                                        </div>
                                                    </div>
                                                </section>
                                                <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                                    <div className="form-row bg-light pt-2 ml-0 mr-0">
                                                        <div className="form-row border col-12 p-0 ml-0 mr-0">
                                                            <div className="col-md-12 card-box m-0 p-0">
                                                                <CustomerInquiryList
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
export default EditCustomersInquiryDetails;

