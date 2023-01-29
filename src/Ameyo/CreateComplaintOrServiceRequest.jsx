import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, Element } from 'react-scroll';
import { string, object } from "yup";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import ComplaintOrServiceRequestDetailsForm from '../complaint/ComplaintOrServiceRequestDetailsForm';
import { toast } from 'react-toastify';
import FileUpload from './fileUpload';
import { unstable_batchedUpdates } from 'react-dom';
import AddEditAppointmentForm from '../complaint/AddEditAppointmentForm';
import { filterLookupBasedOnType, getServiceCategoryMappingBasedOnProdType } from '../util/util';
import { ameyoPost, ameyoGet } from '../util/restUtil';

const complaintDetailsValidationSchema = object().shape({
    ticketType: string().required("Tickect Type is required"),
    problemType: string().required("Problem Type is required"),
    productOrServices: string().required("Product/Services is required"),
    problemCause: string().required("Problem Cause is required"),
    channel: string().required("Ticket Channel is required"),
    source: string().required("Ticket Source is required"),
    priority: string().required("Ticket Priority is required"),
    preference: string().required("Contact Preference is required"),
    remarks: string().required("Remarks is required")
});

const CreateComplaintOrServiceRequest = (props) => {

    //const { auth } = useContext(AppContext);
    //const userLocation = auth.user.location;    
    const type = props.location.state && props.location.state.type;   
    const ticketTypeCode = type.toLowerCase() === 'complaint' ? 'REQCOMP' : 'REQSR';

    const [customerData, setCustomerData] = useState(null);

    const [ticketTypeLookup, setTicketTypeLookup] = useState();
    const [problemTypeLookup, setProblemTypeLookup] = useState();
    const [productOrServicesLookup, setProductOrServicesLookup] = useState();
    const [problemCauseLookup, setProblemCauseLookup] = useState();
    const [channelLookup, setChannelLookup] = useState();
    const [sourceLookup, setSourceLookup] = useState();
    const [priorityLookup, setPriorityLookup] = useState();
    const [preferenceLookup, setPreferenceLookup] = useState();
    const [natureCodeLookup, setNatureCodeLookup] = useState();
    const [clearCodeLookup, setClearCodeLookup] = useState();
    const [causeCodeLookup, setCauseCodeLookup] = useState();

    const [complaintData, setComplaintData] = useState({
        ticketType: '',
        problemType: '',
        productOrServices: '',
        problemTypeDesc: '',
        problemCause: '',
        unnProblemCode: '',
        unnProblemCodeDesc: '',
        channel: '',
        source: '',
        priority: '',
        preference: '',
        remarks: '',
        natureCode: '',
        clearCode: '',
        causeCode: '',
        show: false,
        fromDate: "",
        fromTime: "",
        toDate: "",
        toTime: "",
        contactPerson: "",
        contactNumber: "",
        appointmentRemarks: "",
        userLocation: 'CEM: Call Centre',
        serviceCategory: ""
    })

    const lookupData = useRef({})

    const [complaintDetailsError, setComplaintDetailsError] = useState({});
    const [kioskRefNo, setKioskRefNo] = useState(null)

    const [currentFiles, setCurrentFiles] = useState([])
    const accessToken= localStorage.getItem("accessToken")   

    useEffect(() => {
        const { data = undefined } = props.location.state && props.location.state;
        
        if (data) {
            if (props.location.state.data.kioskRefId !== null) {
                setKioskRefNo(props.location.state.data.kioskRefId)
            }
                 
            if(data.customerId && data.serviceId){
                showSpinner();
                ameyoGet(`${properties.CUSTOMER_DETAILS}/${data.customerId}?serviceId=${data.serviceId}`,'', accessToken).then((customerResp)=>{
                   // console.log('customerResp==>',customerResp)
                    if (customerResp && customerResp.data) {
                        ameyoGet(`${properties.SERVICES_LIST_API}/${data.customerId}?account-id=${data.accountId}&service-id=${data.serviceId}&realtime=false`,'', accessToken)
                            .then((serviceResp) => {

                                //console.log('serviceResp==>',serviceResp)
                                if (serviceResp && serviceResp.data) {
                                    setCustomerData({
                                        ...customerResp.data,
                                        ...data,
                                        customerName: customerResp.data.surName + " " + customerResp.data.foreName,
                                        planName: serviceResp.data[0].planName,
                                        serviceNo: serviceResp.data[0].accessNbr,
                                        serviceType: serviceResp.data[0].prodType,
                                        serviceStatus: serviceResp.data[0].statusDesc
                                    })
                                    ameyoPost(properties.BUSINESS_ENTITY_API,['PROBLEM_TYPE',
                                        'PROBLEM_CAUSE',
                                        'PROBLEM_CODE',
                                        'TICKET_CHANNEL',
                                        'TICKET_SOURCE',
                                        'TICKET_PRIORITY',
                                        'CONTACT_TYPE',
                                        'NATURE_CODE',
                                        'CLEAR_CODE',
                                        'CAUSE_CODE',
                                        'INTXN_CAT_TYPE',
                                        'SERVICES',
                                        'PROD_TYPE'
                                    ], accessToken)
                                        .then((response) => {
                                            if (response.data) {
                                                lookupData.current = response.data;
                                              //  unstable_batchedUpdates(() => {
                                                    setChannelLookup(lookupData.current['TICKET_CHANNEL'])
                                                    setSourceLookup(lookupData.current['TICKET_SOURCE'])
                                                    setPriorityLookup(lookupData.current['TICKET_PRIORITY'])
                                                    setPreferenceLookup(lookupData.current['CONTACT_TYPE'])
                                                    setNatureCodeLookup(lookupData.current['NATURE_CODE'])
                                                    setClearCodeLookup(lookupData.current['CLEAR_CODE'])
                                                    setCauseCodeLookup(lookupData.current['CAUSE_CODE'])
                                                    let filteredTicketType = filterLookupBasedOnType(lookupData.current['INTXN_CAT_TYPE'], ticketTypeCode, 'requestType');
                                                    setTicketTypeLookup(filteredTicketType);
                                                    let filteredProductOrServices = filterLookupBasedOnType(lookupData.current['SERVICES'], serviceResp.data[0].prodType, 'serviceType');
                                                    setProductOrServicesLookup(filteredProductOrServices);
                                                    let filteredProblemType = filterLookupBasedOnType(lookupData.current['PROBLEM_TYPE'], serviceResp.data[0].prodType, 'serviceType');
                                                    setProblemTypeLookup(filteredProblemType);
                                                    let serviceCategoryMapping = getServiceCategoryMappingBasedOnProdType(lookupData.current['PROD_TYPE'], serviceResp.data[0].prodType);
                                                    setComplaintData({
                                                        ...complaintData,
                                                        serviceCategory: serviceCategoryMapping.hasOwnProperty('serviceCategory') ? serviceCategoryMapping.serviceCategory : ""
                                                    })
                                               // })
                                            }
                                        })
                                } else {
                                    toast.error("Failed to fetch account ids data - " + serviceResp.status);
                                }
                            })
                    }
                    else {
                        toast.error("Failed to fetch customer ids data - " + customerResp.status);
                    }
                }).finally(hideSpinner)
            }
        }
    }, [props.location.state])

    
    const handleLookupOrStateChange = (e) => {
        const target = e.target;        
        const serviceType  = customerData.serviceType;
        //console.log(serviceType)
        let selectedObject;
        if (target.id === 'ticketType') {
            // selectedObject = JSON.parse(target.options[target.selectedIndex].dataset.object)
             const typeLookup = lookupData.current['PROBLEM_TYPE'].filter((cause) => {
                 let isTrue = false;              
                 if (cause.mapping && cause.mapping.hasOwnProperty('ticketType') &&
                     cause.mapping.ticketType.includes(target.value)) {
                     return isTrue = true;
                 }
                 return isTrue
             })
             unstable_batchedUpdates(() => {
                 setComplaintData({
                     ...complaintData,
                     [target.id]: target.value,
                    // problemTypeDesc: selectedObject.description,
                     problemCause: '',
                     natureCode: '',
                     clearCode: '',
                     causeCode: '',
                     unnProblemCode: '',
                     unnProblemCodeDesc: '',
                     show: false
                 })
                 setProblemTypeLookup(typeLookup);
             })
         }
        else if (target.id === 'problemType') {
            selectedObject = JSON.parse(target.options[target.selectedIndex].dataset.object)
            const causeLookup = lookupData.current['PROBLEM_CAUSE'].filter((cause) => {
                let isTrue = false;
                if (cause.mapping && cause.mapping.hasOwnProperty('problemType') &&
                    cause.mapping.problemType.includes(target.value) &&
                    cause.mapping.hasOwnProperty('complaintType') &&
                    cause.mapping.hasOwnProperty('serviceType') &&
                    cause.mapping.serviceType.includes(serviceType) && cause.mapping.complaintType === 'FAULT') {
                    return isTrue = true;
                }
                if (cause.mapping && cause.mapping.hasOwnProperty('problemType') &&
                    cause.mapping.problemType.includes(target.value) &&
                    cause.mapping.hasOwnProperty('serviceType') &&
                    cause.mapping.serviceType.includes(serviceType)) {
                    return isTrue = true;
                }
                return isTrue
            })
            unstable_batchedUpdates(() => {
                setComplaintData({
                    ...complaintData,
                    [target.id]: target.value,
                    problemTypeDesc: selectedObject.description,
                    problemCause: '',
                    natureCode: '',
                    clearCode: '',
                    causeCode: '',
                    unnProblemCode: '',
                    unnProblemCodeDesc: '',
                    show: false
                })
                setProblemCauseLookup(causeLookup);
            })
        }
        else if (target.id === 'problemCause') {
            let UNNData;
            selectedObject = JSON.parse(target.options[target.selectedIndex].dataset.object);
            if (selectedObject && selectedObject.hasOwnProperty('code')) {
                UNNData = lookupData.current['PROBLEM_CODE'].find((pc) => {
                    let isTrue = false;
                    if (pc.mapping && pc.mapping.hasOwnProperty('problemCause') && selectedObject.code === pc.mapping.problemCause) {
                        return isTrue = true;
                    }
                    return isTrue;
                })
            }
            setComplaintData({
                ...complaintData,
                [target.id]: target.value,
                unnProblemCode: UNNData ? UNNData.code : "",
                unnProblemCodeDesc: UNNData ? UNNData.description : "",
                show: selectedObject.mapping !== null && selectedObject.mapping.hasOwnProperty('complaintType') && selectedObject.mapping.complaintType === 'FAULT' ?
                    true
                    : false
            })
        }
        else {
            setComplaintData({
                ...complaintData,
                [target.id]: target.value
            })
        }
    }

    const validate = (section, schema, data) => {
        try {
            if (section === 'DETAILS') {
                setComplaintDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'DETAILS') {
                    setComplaintDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };

    const checkComplaintDetails = () => {
        let error = validate('DETAILS', complaintDetailsValidationSchema, complaintData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        return true;
    }

    const handleSubmit = (e) => {
        e.preventDefault();        
        if (checkComplaintDetails()) {            
            const { fromDate, fromTime, toDate, toTime, contactPerson, contactNumber, appointmentRemarks, ticketType, productOrServices, userLocation } = complaintData;
            showSpinner();
            let complaint = {
                customerId: customerData.customerId,
                accountId: customerData.accountId,
                serviceId: customerData.serviceId,
                problemType: complaintData.problemType,
                problemCode: complaintData.unnProblemCode,
                problemCause: complaintData.problemCause,
                chnlCode: complaintData.channel,
                sourceCode: complaintData.source,
                priorityCode: complaintData.priority,
                cntPrefer: complaintData.preference,
                remarks: complaintData.remarks,
                intxnType: ticketTypeCode,
                kioskRefId: (kioskRefNo !== null) ? kioskRefNo : null,
                attachments: [...currentFiles.map((current) => current.entityId)],
                ticketType,
                appointment: {
                    fromDate,
                    fromTime,
                    toDate,
                    toTime,
                    contactPerson,
                    contactNumber,
                    remarks: appointmentRemarks
                },
                productOrServices,
               // location: userLocation
            };
            if (complaintData.show) {
                if (complaintData.natureCode !== "")
                    complaint.natureCode = complaintData.natureCode;
                if (complaintData.clearCode !== "")
                    complaint.clearCode = complaintData.clearCode
                if (complaintData.causeCode !== "")
                    complaint.causeCode = complaintData.causeCode
            }
            
            ameyoPost(properties.COMPLAINT_API,{ ...complaint },accessToken)
                .then((response) => {                   
                    toast.success(`${response.message} with ID ${response.data.interactionId}`);
                    setCustomerData({
                        crmCustomerNo: '',
                        customerName: '',
                        planName: '',
                        serviceNo: '',
                        serviceType: '',
                        serviceStatus: '',
                        customerType:'',
                        accountNo:'',
                        accountName:'',
                        serviceNo:'',
                        serviceType:'',
                        accountEmail:'',
                        accountContactNo:''

                    });
                    setComplaintData({
                        ticketType: '',
                        problemType: '',
                        productOrServices: '',
                        problemTypeDesc: '',
                        problemCause: '',
                        unnProblemCode: '',
                        unnProblemCodeDesc: '',
                        channel: '',
                        source: '',
                        priority: '',
                        preference: '',
                        remarks: '',
                        natureCode: '',
                        clearCode: '',
                        causeCode: '',
                        show: false,
                        fromDate: "",
                        fromTime: "",
                        toDate: "",
                        toTime: "",
                        contactPerson: "",
                        contactNumber: "",
                        appointmentRemarks: "",
                       // userLocation,
                        serviceCategory: ""
                    })
                    setCurrentFiles([])
                }).catch((err)=>{                                  
                            toast.error(err);
                        })
                .finally(() => {                   
                    hideSpinner();
                });
        }
    }
    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title bold">{type} - (New)</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">

                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <nav className="navbar navbar-default navbar-fixed-top">
                                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                        <ul className="nav navbar-nav">
                                            <li><Link activeClass="active" className="test1" to="customerSection" spy={true} offset={-165} smooth={true} duration={100}>Customer Details</Link></li>
                                            <li><Link activeClass="active" className="test2" to="complaintSection" spy={true} offset={-130} smooth={true} duration={100}>{type} Details</Link></li>
                                            <li><Link activeClass="active" className="test5" to="attachmentsSection" spy={true} offset={-120} smooth={true} duration={100}>Attachments</Link></li>
                                            <li><Link activeClass="active" className="test6" to="appointmentSection" spy={true} offset={-120} smooth={true} duration={100}>Appointment</Link></li>
                                        </ul>
                                    </div>
                                </nav>
                            </div>

                            <div className="new-customer col-md-10">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">
                                    <Element name="customerSection" className="element new-customer">
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle"><h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>Customer Details</h4></section>
                                            </div>
                                        </div>

                                        <div className="block-section">
                                            <fieldset className="scheduler-border">
                                                <div id="customer-details">
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputId" className="col-form-label">Customer Number</label>
                                                                <p>{customerData && customerData.crmCustomerNo}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputId" className="col-form-label">Customer Name</label>
                                                                <p>{customerData && customerData.customerName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Customer Type</label>
                                                                <p>{customerData && customerData.customerType === "RESIDENTIAL" ? "Residential" : customerData && customerData.customerType === "BUSINESS" ? "Business" : ""}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputAccountNo" className="col-form-label">Account Number</label>
                                                                <p>{customerData && customerData.accountNo}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputAccountName" className="col-form-label">Account Name</label>
                                                                <p>{customerData && customerData.accountName}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Access Number</label>
                                                                <p>{customerData && customerData.serviceNo}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Service Type</label>
                                                                <p>{customerData && customerData.serviceType}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Plan Name</label>
                                                                <p>{customerData && customerData.planName}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Service Status</label>
                                                                <p>{customerData && customerData.serviceStatus}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Email ID</label>
                                                                <p>{customerData && customerData.accountEmail}</p>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="inputState" className="col-form-label">Contact Number</label>
                                                                <p>{customerData && customerData.accountContactNo}</p>
                                                            </div>
                                                        </div>
                                                        {/* <div className="col-md-3">
                                                                <div className="form-group">
                                                                    <label htmlFor="inputState" className="col-form-label">Contact Type</label>
                                                                    <p>{customerData && customerData.contactTypeDesc}</p>
                                                                </div>
                                                            </div> */}
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                    </Element>

                                    <Element name="complaintSection" className="element">
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle"><h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>{type} Details</h4></section>
                                            </div>
                                        </div>

                                        <ComplaintOrServiceRequestDetailsForm
                                            data={complaintData}
                                            customerData={customerData}
                                            lookups={{
                                                ticketTypeLookup,
                                                problemTypeLookup,
                                                productOrServicesLookup,
                                                problemCauseLookup,
                                                channelLookup,
                                                sourceLookup,
                                                priorityLookup,
                                                preferenceLookup,
                                                natureCodeLookup,
                                                clearCodeLookup,
                                                causeCodeLookup
                                            }}
                                            lookupOrStateHandler={handleLookupOrStateChange}
                                            error={complaintDetailsError}
                                            setError={setComplaintDetailsError}
                                        />
                                    </Element>

                                    <Element name="attachmentsSection" className="element btm-space attach-sec">
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle"><h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>Attachments </h4></section>
                                            </div>
                                        </div>
                                        <FileUpload
                                            data={{
                                                currentFiles,
                                                //customerId: props.location.state.data.customerId,
                                                entityType: 'COMPLAINT',
                                                shouldGetExistingFiles: false,
                                                permission: false
                                            }}
                                            handlers={{
                                                setCurrentFiles
                                            }}
                                        />
                                    </Element>

                                    <Element name="appointmentSection" className="element">
                                        <div className="row mb-2">
                                            <div className="col-12 p-0">
                                                <section className="triangle"><h4 id="list-item-0" className="pl-2" style={{ alignContent: 'left' }}>Appointment</h4></section>
                                            </div>
                                        </div>
                                        <AddEditAppointmentForm
                                                data={{
                                                    ticketDetailsInputs: complaintData,
                                                    isAppointmentEdit: false
                                                }}
                                                handlers={{
                                                    handleOnTicketDetailsInputsChange: handleLookupOrStateChange
                                                }}
                                            />
                                        <form>
                                          
                                            <div id="page-buttons" className="d-flex justify-content-center mt-3" >
                                                <button type="submit" id="submit" className="btn btn-primary waves-effect waves-light mr-2" onClick={handleSubmit}>Submit</button>                                               
                                            </div>
                                        </form>
                                    </Element>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    )
}

export default CreateComplaintOrServiceRequest;