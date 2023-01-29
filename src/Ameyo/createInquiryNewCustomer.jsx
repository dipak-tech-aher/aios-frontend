import React, { useState, useRef, useEffect, useContext } from 'react'
import { useTranslation } from "react-i18next";
import { Link, Element } from 'react-scroll'
import { toast } from "react-toastify";
import { string, object } from "yup";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import CreateCustomerInquiryDetailsForm from './createCustomerInquiryForm';

import NewCustomerEnquiryPreview from '../inquiry/newCustomerInquiryPreview';
import NewCustomerBusinessInquiryPreview from '../inquiry/newCustomerBusinessInquiryPreview';
import NewCustomerBusinessInquiryForm from '../inquiry/newCustomerBusinessInquiryForm';
import InquiryDetailsForm from '../inquiry/inquiryDetailsForm';
import InquiryDetailsPreview from '../inquiry/inquiryDetailsPreview'

import FileUpload from './fileUpload';
import { useHistory } from "react-router-dom";
import 'react-confirm-alert/src/react-confirm-alert.css'
import { ameyoPost } from '../util/restUtil';


const createInquiryFromValidationSchema = object().shape({
    customerName: string().required("Customer name is required"),
    contactPreference: string().required("Contact Preference is required"),
    customerCategory: string().required("Category is required"),
    email: string().required("Email is required").email("Email is not in correct format"),
    contactNbr: string().required("Contact Number is required")
});

const inquiryDetailsFromValidationSchema = object().shape({
    inquiryAbout: string().required("Inquiry About is required"),
    ticketChannel: string().required("Ticket Channel is required"),
    ticketSource: string().required("Ticket Source is required"),
    ticketPriority: string().required("Ticket Priority is required"),
    serviceType: string().required("Service Type is required"),
    productOrServices: string().required("Inquiry Category is required")
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


function CreateEnquireNewCustomer(props) {
  //  const { auth } = useContext(AppContext);
  //  const userLocation = auth.user.location;

    let switchStatus = 'hide'
    let customerSerchHide = 'show'
    let isExsitingCustomerStatus = false
    let accNo = null
    const { t } = useTranslation();
    const history = useHistory();

    const [customerDetailsError, setCustomerDetailsError] = useState({});
    const [inquiryDetailsError, setInquiryDetailsError] = useState({});
    const [viewMode, setViewMode] = useState({ mode: 'Create_New' })
    const [newcustomerId, setCustomerId] = useState({ customerId: '' })


    if (props.location.data !== undefined) {
        if (props.location.data.sourceName === 'fromDashboard') {
            switchStatus = 'hide'
            customerSerchHide = 'show'
        }
        else if (props.location.data.sourceName === 'customer360') {
            accNo = props.location.state.data.accessNumber
            isExsitingCustomerStatus = true
        }
        else {
            accNo = null
        }
    }
    if (props.location.state !== undefined) {
        if (props.location.state.data.sourceName === 'fromKiosk') {
            switchStatus = 'show'
        }
        if (props.location.state.data.customerType === 'New') {
            customerSerchHide = 'hide'
        }
        else {
            customerSerchHide = 'show'
        }
    }
    const [accessNumber, setAccessNumber] = useState(accNo)
    const [switchToExistingCustomer, setSwitchToExistingCustomer] =
        useState({
            isExsitingCustomer: false
        })

    const [renderMode, setRenderMode] = useState({
        customerTypeSelection: 'hide',
        customerDetails: 'form',
        customerDetailsPreview: 'hide',
        previewButton: 'hide',
        submitButton: 'show',
        cancelButton: 'hide',
        kioskCancelButton: switchStatus,
        customerDetailsEditButton: 'hide',
        kioskEnable: switchStatus,
        createLeadButton: 'hide',
        createCustomerButton: 'hide'
    })

    const newCustomerData = useRef({})
    const newInquiryData = useRef({})

    const [newCustomerDetails, setNewCustomerInquiryDetails] = useState({})

    const [selectedCustomerType, setSelectedCustomerType] = useState('RESIDENTIAL')

    const [customerType, setCustomerType] = useState('')

    const [inquiryData, setInquiryData] = useState(null)

    const [serviceNumber, setServiceNumber] = useState({
        serviceNo: ""
    })

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
        ticketPriority: '',
        ticketPriorityDesc: '',
        ticketSource: '',
        ticketSourceDesc: '',
        serviceType: '',
        serviceTypeDesc: '',
        productOrServices: '',
        productOrServicesDesc: '',
        problemCause: '',
        problemCauseDesc: '',
        remark: '',
        ticketUserLocation: 'CEM: Call Centre',
        serviceCategory: ''
    })

    const [saveSearchResultData, setSaveSearchResultData] = useState()  
    
    const lookupData = useRef({})
    const serviceTypeRef = useRef()
    const statusPendingOrPDCheckRef = useRef(false)
    const [categoryLookup, setCategoryLookup] = useState([{}])
    const [inquiryCategoryLookup, setinquiryCategoryLookup] = useState([{}])
    const [ticketPriority, setTicketPriority] = useState([{}])
    const [classLookup, setClassLookup] = useState([{}])
    const [contactTypeLookup, setContactTypeLookup] = useState([{}])
    const [ticketChannel, setTicketChannelLookup] = useState([{}])
    const [ticketSource, setTicketSourceLookup] = useState([{}])
    const [problemCause, setProblemCauseLookup] = useState([{}])
    const [lookupInquiryAbout, setInquiryAboutLookUp] = useState([{}])
    const [serviceTypeLookup, setServiceTypeLookup] = useState([])
    const [productOrServicesLookup, setProductOrServicesLookup] = useState([])
    const [currentFiles, setCurrentFiles] = useState([])
    const accessToken= localStorage.getItem("accessToken")

    useEffect(() => {
        if (switchToExistingCustomer.isExsitingCustomer) {
            setViewMode({ ...viewMode, mode: 'Create_Existing' })
            setCustomerInquiryData({
                ...personalInquireData,
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
            })
        }
        else {
            setViewMode({ ...viewMode, mode: 'Create_New' })
            setCustomerInquiryData({
                ...personalInquireData,
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
            })
            serviceTypeRef.current = "";
            statusPendingOrPDCheckRef.current = false;
        }
    }, [switchToExistingCustomer]);

    //inquiry api call
    useEffect(() => {
        if (newcustomerId.customerId !== '' && newcustomerId.customerId !== undefined) {
            submitRequstBody()
        }
    }, [newcustomerId]);

    
    useEffect(() => {
        //Bellow business api call was in use-effect with no dependency, Since we need this when refreshed so placed it in one. We need prodType lookup for getting serviceCategory when we route from 360/AdvSearch
        showSpinner();
        ameyoPost(properties.BUSINESS_ENTITY_API,['CATEGORY',
            'CLASS',
            'CONTACT_TYPE',
            'CAUSE_CODE',
            'PROBLEM_CAUSE',
            'TICKET_CHANNEL',
            'TICKET_SOURCE',
            'SERVICES',
            'PROBLEM_TYPE',
            'TICKET_PRIORITY',
            'PROD_TYPE'
        ], accessToken)
            .then((resp) => {
                if (resp.data) {
                    lookupData.current = resp.data
                    setCategoryLookup(lookupData.current['CATEGORY'])
                    setClassLookup(lookupData.current['CLASS'])
                    setContactTypeLookup(lookupData.current['CONTACT_TYPE'])
                    setInquiryAboutLookUp(lookupData.current['PROBLEM_TYPE'])
                    setTicketChannelLookup(lookupData.current['TICKET_CHANNEL'])
                    setTicketSourceLookup(lookupData.current['TICKET_SOURCE'])
                    //setProblemCauseLookup(lookupData.current['PROBLEM_CAUSE'])
                    setTicketPriority(lookupData.current['TICKET_PRIORITY'])
                    setinquiryCategoryLookup(lookupData.current['SERVICES'])
                    setServiceTypeLookup(lookupData.current['PROD_TYPE'])
                    setRenderMode({ ...renderMode, customerTypeSelection: 'show' })
                    hideSpinner();

                    //bellow block was in another use-effect with props.location.state dependency.                  
                    
                }
            }).finally(()=>{
                hideSpinner()
            });
    }, [props.location.state]);    

    const validate = (section, schema, data, holdPrevErrors = false) => {
        try {
            if (section === 'CreateInquiry') {
                holdPrevErrors === false && setCustomerDetailsError({})
            }
            if (section === 'InquriyDetails') {
                holdPrevErrors === false && setInquiryDetailsError({})
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

    const setInquiryDetails = () => {
        let error
        if (selectedCustomerType === 'RESIDENTIAL') {
            error = validate('CreateInquiry', createInquiryFromValidationSchema, personalInquireData);
        }
        if (selectedCustomerType === 'BUSINESS') {
            error = validate('CreateInquiry', businessCustomerInquiryFromValidationSchema, customerbusinessInquireData);
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            const error1 = validate('InquriyDetails', inquiryDetailsFromValidationSchema, inquiryDataDetails, true);
            if (error || error1) {
                toast.error("Validation errors found. Please check highlighted fields");
                return false;
            }
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            if (personalInquireData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }
        if (selectedCustomerType === 'BUSINESS') {
            if (customerbusinessInquireData.contactNbr.length < 7) {
                toast.error("Please Enter 7 Digit Contact Number")
                return false;
            }
        }
        if (selectedCustomerType === 'RESIDENTIAL') {
            if (!newInquiryData.current.customer) {
                newInquiryData.current.customer = {}
            }
            if (switchToExistingCustomer.isExsitingCustomer) {
                newInquiryData.current.customer.serviceType = inquiryDataDetails.serviceType
                newInquiryData.current.customer.productOrServices = inquiryDataDetails.productOrServices
                newInquiryData.current.customer.inquiryCategory = inquiryDataDetails.productOrServices
                newInquiryData.current.customer.inquiryAbout = inquiryDataDetails.inquiryAbout
                newInquiryData.current.customer.ticketPriority = inquiryDataDetails.ticketPriority
                newInquiryData.current.customer.ticketChannel = inquiryDataDetails.ticketChannel//"CHNL004",
                newInquiryData.current.customer.ticketSource = inquiryDataDetails.ticketSource//"SRC006",
                newInquiryData.current.customer.problemCause = inquiryDataDetails.problemCause//"CT007",
                newInquiryData.current.customer.status = "NEW"
                newInquiryData.current.customer.ticketDescription = inquiryDataDetails.remark
                newInquiryData.current.customer.customerId = saveSearchResultData.customerId
                newInquiryData.current.customer.accountId = saveSearchResultData.accountId
                newInquiryData.current.customer.connectionId = saveSearchResultData.serviceId
                newInquiryData.current.customer.kioskRefId = (accessNumber !== null) ? accessNumber : null
                newInquiryData.current.customer.location = inquiryDataDetails.ticketUserLocation
                //accessNumber
            }
            else {
                newInquiryData.current.customer.serviceType = inquiryDataDetails.serviceType
                newInquiryData.current.customer.productOrServices = inquiryDataDetails.productOrServices
                newInquiryData.current.customer.inquiryCategory = inquiryDataDetails.productOrServices
                newInquiryData.current.customer.inquiryAbout = inquiryDataDetails.inquiryAbout
                newInquiryData.current.customer.ticketPriority = inquiryDataDetails.ticketPriority
                newInquiryData.current.customer.ticketChannel = inquiryDataDetails.ticketChannel//"CHNL004",
                newInquiryData.current.customer.ticketSource = inquiryDataDetails.ticketSource//"SRC006",
                newInquiryData.current.customer.problemCause = inquiryDataDetails.problemCause//"CT007",
                newInquiryData.current.customer.status = "NEW"
                newInquiryData.current.customer.ticketDescription = inquiryDataDetails.remark
                newInquiryData.current.customer.kioskRefId = (inquiryData !== null) ? inquiryData.referenceNo : null
                newInquiryData.current.customer.location = inquiryDataDetails.ticketUserLocation
                //newInquiryData.current.customer.customerId = ""
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
        if (personalInquireData.contactNbr.length < 7) {
            toast.error("Please Enter 7 Digit Contact Number")
            return false;
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
            // newCustomerData.current.customer.custName = personalInquireData.customerName
            // newCustomerData.current.customer.custCat = personalInquireData.customerCategory
            // //newCustomerData.current.customer.serviceType = personalInquireData.serviceType
            // //newCustomerData.current.customer.productEnquired = personalInquireData.productEnquired
            // newCustomerData.current.customer.contactPreference = personalInquireData.contactPreference
            // newCustomerData.current.customer.emailId = personalInquireData.email
            // newCustomerData.current.customer.contactNo = personalInquireData.contactNbr
            // newCustomerData.current.customer.remarks = personalInquireData.remark
            // new customer call API DATA
            newCustomerData.current.customer.title = 'Mr'
            //newCustomerData.current.customer.foreName = personalInquireData.customerName
            newCustomerData.current.customer.surName = personalInquireData.customerName
            newCustomerData.current.customer.category = personalInquireData.customerCategory
            newCustomerData.current.customer.categoryDesc = personalInquireData.customerCategoryDesc
            newCustomerData.current.customer.email = personalInquireData.email
            newCustomerData.current.customer.contactType = personalInquireData.contactPreference
            newCustomerData.current.customer.contactNbr = personalInquireData.contactNbr
            newCustomerData.current.customer.class = "CLASTD"
            newCustomerData.current.customer.customerType = 'RESIDENTIAL'
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
            submitButton: 'show',
            cancelButton: 'hide'
        })
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

        //handlePreview()

        if (switchToExistingCustomer.isExsitingCustomer) {
            if (statusPendingOrPDCheckRef.current) {
                toast.error('Inquiry cannot be created when service is in PENDING/PD status.')
                return;
            }
            else {
                if (setInquiryDetails()) {
                    //toast.success("Field validations completed successfully");
                    submitRequstBody();
                    //showPreview()
                }
            }
        }
        else {
            if (setCustomerDetails() && setInquiryDetails()) {
                //toast.success("Field validations completed successfully");
                createCustomer(newCustomerData.current.customer)
                //showPreview()
            }
        }
    }
   
    const createCustomer = () => {
        showSpinner();
        newCustomerData.current.customer.attachments = [...currentFiles.map((current) => current.entityId)]
        ameyoPost(properties.CUSTOMER_API, newCustomerData.current.customer, accessToken)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        //toast.success(resp.message);
                        setCustomerId({
                            ...newcustomerId,
                            customerId: resp.data.customerId
                        })
                        newInquiryData.current.customer.customerId = resp.data.customerId

                    } else {
                        toast.error("Failed to create - " + resp.status);
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            }).finally(hideSpinner);
    }
    
    const submitRequstBody = () => {
        showSpinner();
        newInquiryData.current.customer.attachments = [...currentFiles.map((current) => current.entityId)]
        ameyoPost(properties.CUSTOMER_INQUIRY_API_2, newInquiryData.current.customer, accessToken)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success(`${resp.message} with ID ${resp.data.interactionId}`);
                       // props.history.push(`${process.env.REACT_APP_BASE}/`);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'show',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            customerDetails: 'form',
                            customerDetailsEditButton: 'hide',
                            accountDetailsEditButton: 'hide',
                            serviceDetailsEditButton: 'hide',
                            kioskEnable: 'hide',
                            createCustomerButton: 'hide',
                            createLeadButton: 'hide',
                            kioskCancelButton: 'hide'
                        })
                        setNewCustomerInquiryDetails({
                            customerId: resp.data.leadId,
                            leadId: resp.data.leadId
                        })

                        setCustomerInquiryData({
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
                        })

                        setInquiryDataDetails({
                            inquiryAbout: '',
                            inquiryAboutDesc: '',
                            ticketChannel: '',
                            ticketChannelDesc: '',
                            ticketPriority: '',
                            ticketPriorityDesc: '',
                            ticketSource: '',
                            ticketSourceDesc: '',
                            serviceType: '',
                            serviceTypeDesc: '',
                            productOrServices: '',
                            productOrServicesDesc: '',
                            problemCause: '',
                            problemCauseDesc: '',
                            remark: '',
                           // ticketUserLocation: userLocation,
                            serviceCategory: ''
                        })

                        setCurrentFiles([])
                    } else {
                        toast.error("Failed to create - " + resp.status);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
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

    const getSetFilteredProductOrServices = (filterValue) => {
        let filteredProductOrServices = lookupData.current['SERVICES'].filter((service) => {
            let isTrue = false;
            if (service.mapping && service.mapping.hasOwnProperty('serviceType') && service.mapping.serviceType.includes(filterValue)) {
                return isTrue = true;
            }
            return isTrue;
        })
        setProductOrServicesLookup(filteredProductOrServices)
    }

    const getFilteredInquiryAbout = (filterValue) => {
        let filteredData = lookupData.current['PROBLEM_TYPE'].filter((service) => {
            let isTrue = false;
            if (service.mapping && service.mapping.hasOwnProperty('ticketType') && service.mapping.ticketType.includes(filterValue)) {
                return isTrue = true;
            }
            return isTrue;
        })
        setInquiryAboutLookUp(filteredData)
    }

    const handleInquiryDetailsOnChange = (e) => {
        const { target } = e;
        if (target.localName === 'select') {
            if (target.id === 'serviceType') {
                getSetFilteredProductOrServices(target.value);
                getFilteredInquiryAbout('INQUIRY');
                const selectedObject = JSON.parse(target.options[target.selectedIndex].dataset.object);
                setInquiryDataDetails({
                    ...inquiryDataDetails,
                    [target.id]: target.value,
                    [`${target.id}Desc`]: target.options[e.target.selectedIndex].label,
                    productOrServices: "",
                    productOrServicesDesc: "",
                    serviceCategory: selectedObject.mapping && selectedObject.mapping.hasOwnProperty('serviceCategory') ? selectedObject.mapping.serviceCategory : ""
                })
            }
            else {
                setInquiryDataDetails({
                    ...inquiryDataDetails,
                    [target.id]: target.value,
                    [`${target.id}Desc`]: target.options[e.target.selectedIndex].label
                })
            }
            setInquiryDetailsError({
                ...inquiryDetailsError,
                [target.id]: ""
            })
        }
        else {
            setInquiryDataDetails({
                ...inquiryDataDetails,
                [target.id]: target.value
            })
        }
    }


    return (
        <div className="row mt-1">
            <div className="col-12">
                <h1 className="title">Create Inquiry - (New)</h1>
                <div className="card-box">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '0px' }}>
                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <div className="">
                                    <nav className="navbar navbar-default navbar-fixed-top">
                                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                            <ul className="nav navbar-nav">
                                                {
                                                    (renderMode.kioskEnable === 'show') ?
                                                        <li><Link activeclassName="active" className="test4" to="kiosk_page" spy={true} offset={-190} smooth={true} duration={100}>Kiosk Details</Link></li>
                                                        :
                                                        <></>
                                                }
                                                <li><Link activeclassName="active" className="test1" to="createinquiry" spy={true} offset={-120} smooth={true} duration={100}>{t("create_inquiry")}</Link></li>
                                                {/* <li><Link activeclassName="active" className="test2" to="accountSection" spy={true} offset={-100} smooth={true} duration={100}>Address</Link></li>
                                                <li><Link activeclassName="active" className="test3" to="serviceSection" spy={true} offset={-320} smooth={true} duration={100}>Contact</Link></li> */}
                                                <li><Link activeclassName="active" className="test2" to="inquirydetails" spy={true} offset={-120} smooth={true} duration={100}>{t("inquiry_details")}</Link></li>

                                                <li><Link activeclassName="active" className="test3" to="attachment_upload" spy={true} offset={-120} smooth={true} duration={100}>{t("attachments")}</Link></li>
                                            </ul>
                                        </div>

                                    </nav>
                                </div>
                            </div>
                            <div className="new-customer col-md-10">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">                                   

                                    <Element name="createinquiry" className="element" >
                                        <div className="row">
                                            <div className="col-12 p-0">

                                                <section className="triangle">
                                                    <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("create_inquiry")}&nbsp;{newCustomerDetails.leadId}</h4>
                                                </section>
                                            </div>
                                        </div>

                                        {
                                            (selectedCustomerType && selectedCustomerType !== '') ?
                                                <div className="pt-2">
                                                    {

                                                        (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                            <div className="pt-2 pr-2">
                                                                <fieldset disabled={(renderMode.kioskEnable === 'show') ? "" : ""} className="scheduler-border">

                                                                    <CreateCustomerInquiryDetailsForm data={{
                                                                        personalDetailsData: personalInquireData,
                                                                        switchToExistingCustomer: switchToExistingCustomer,
                                                                        saveSearchResultData: saveSearchResultData,
                                                                        serviceNumber: serviceNumber,
                                                                        serviceTypeRef,
                                                                        statusPendingOrPDCheckRef
                                                                        //accessNumber:(accessNumber!==null)?accessNumber:null
                                                                    }}
                                                                        viewMode={viewMode}
                                                                        customerType={selectedCustomerType}
                                                                        lookups={{
                                                                            categoryLookup: categoryLookup,
                                                                            classLookup: classLookup,
                                                                            contactTypeLookup: contactTypeLookup,
                                                                            prodTypeLookup: lookupData.current['PROD_TYPE']
                                                                        }}
                                                                        customerSearchToShow={customerSerchHide}
                                                                        // lookupsHandler={{
                                                                        //     addressChangeHandler: addressChangeHandler
                                                                        // }}
                                                                        stateHandler={{
                                                                            setPersonalDetailsData: setCustomerInquiryData,
                                                                            setSwitchToExistingCustomer: setSwitchToExistingCustomer,
                                                                            setSaveSearchResultData: setSaveSearchResultData,
                                                                            setViewMode: setViewMode,
                                                                            setServiceNumber: setServiceNumber,
                                                                            getSetFilteredProductOrServices,
                                                                            setInquiryDataDetails
                                                                        }}
                                                                        error={customerDetailsError}
                                                                        setError={setCustomerDetailsError}
                                                                    />

                                                                </fieldset>
                                                            </div>
                                                            :
                                                            <></>
                                                    }


                                                    {/* -------------upload------------------ */}

                                                </div>
                                                : <></>
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
                                    </Element>

                                    <Element name="inquirydetails" className="element" >
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle">
                                                    <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("inquiry_details")}</h4>
                                                </section>
                                            </div>
                                        </div>
                                        {

                                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'form') ?
                                                <div className="pt-2">
                                                    <div className="pt-2 pr-2">
                                                        <fieldset disabled={(renderMode.kioskEnable === 'show') ? "" : ""} className="scheduler-border">

                                                            <InquiryDetailsForm data={{
                                                                inquiryDataDetails: inquiryDataDetails,
                                                                serviceTypeRef
                                                            }}
                                                                customerType={selectedCustomerType}
                                                                lookups={{
                                                                    serviceTypeLookup: serviceTypeLookup,
                                                                    productOrServicesLookup,
                                                                    lookupInquiryAbout: lookupInquiryAbout,
                                                                    lookupTicketchannel: ticketChannel,
                                                                    lookupTicketSource: ticketSource,
                                                                    lookupTicketPriority: ticketPriority,
                                                                    lookupInquiryCategory: inquiryCategoryLookup,
                                                                    lookupCause: problemCause,

                                                                }}
                                                                lookupsHandler={{
                                                                    handleInquiryDetailsOnChange
                                                                }}
                                                                stateHandler={{
                                                                    setInquiryDataDetails: setInquiryDataDetails,
                                                                }}
                                                                error={inquiryDetailsError}
                                                                setError={setInquiryDetailsError}
                                                            />

                                                        </fieldset>
                                                    </div>
                                                </div>
                                                :
                                                <div className="pt-2">
                                                    <div className="pt-2 pr-2">
                                                        <fieldset className="scheduler-border">
                                                            <InquiryDetailsPreview custType={selectedCustomerType}
                                                                data={
                                                                    {
                                                                        personalInquireData: personalInquireData,
                                                                        inquiryDataDetails: inquiryDataDetails
                                                                    }
                                                                } />
                                                        </fieldset>
                                                    </div></div>
                                        }
                                        {
                                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') ?
                                                <fieldset className="scheduler-border">

                                                    <NewCustomerBusinessInquiryPreview custType={selectedCustomerType} data={customerbusinessInquireData} />

                                                </fieldset>
                                                :
                                                <></>
                                        }
                                    </Element>


                                    <div>
                                        <Element name="attachment_upload" className="element" >
                                            {

                                                (selectedCustomerType === 'RESIDENTIAL' && (renderMode.customerDetails === 'form' || renderMode.customerDetails === 'view')) ?
                                                    <div className="pt-2 pr-2">
                                                        <div className="full-width-bg row">
                                                            <div className="col-12 p-0">
                                                                <section className="triangle">
                                                                    <h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{t("attachment")}</h4>
                                                                </section>
                                                            </div>
                                                        </div>
                                                        <div className="pt-2">
                                                            <fieldset disabled={(renderMode.kioskEnable === 'show') ? "" : ""} className="scheduler-border">
                                                                <FileUpload
                                                                    data={{
                                                                        currentFiles: currentFiles,
                                                                        entityType: 'INQUIRY',
                                                                        shouldGetExistingFiles: false,
                                                                        permission: false
                                                                    }}
                                                                    handlers={{
                                                                        setCurrentFiles
                                                                    }}
                                                                />
                                                                {/* <AttachmentToInquiry /> */}
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </Element>
                                    </div>
                                    {/* <fieldset className="scheduler-border"> */}
                                    {
                                        props.location.state && props.location.state.data.sourceName !== 'fromKiosk' &&
                                            (renderMode.customerDetails === 'form') ?
                                            <div className="d-flex justify-content-end">
                                                {/* <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleInquiryDetailsCancel}>Cancel</button> */}
                                                {/* <button type="button" className="btn btn-outline-primary text-primary   waves-effect waves-light ml-2" onClick={handleInquiryrDetailsDone}>Done</button> */}
                                            </div>
                                            :
                                            <></>
                                    }
                                    {
                                        props.location.state && props.location.state.data.sourceName !== 'fromKiosk' &&
                                            (renderMode.customerDetails === 'view' && renderMode.customerDetailsEditButton === 'show') ?
                                            <div className="d-flex justify-content-end edit-btn">
                                                <button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light ml-2" onClick={handleInquiryDetailsEdit}>Edit</button>
                                            </div>
                                            :
                                            <></>
                                    }



                                    {/* kiosk ui end */}

                                    {                                      
                                            <div className="d-flex justify-content-center">

                                                {
                                                    (renderMode.submitButton === 'show') ?
                                                        <>
                                                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>                                                            
                                                        </>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                    }

                                    {/*
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
                                            <></>*/
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </div >


    )

}
export default CreateEnquireNewCustomer;



