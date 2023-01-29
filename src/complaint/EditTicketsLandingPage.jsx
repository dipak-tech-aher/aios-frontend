import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-scroll';
import { get, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import TicketDetails from './TicketDetails';
import { string, object } from "yup";
import TicketHistory from './TicketHistory';
import { AppContext } from "../AppContext";
import { formatISODateTime } from '../util/dateUtil';
import { unstable_batchedUpdates } from 'react-dom';

const ticketDetailsValidationSchema = object().shape({
    assignRole: string().required("Assign Role is required"),
    currStatus: string().required("Current Status is required"),
    // isSurveyReq: string().required("Is Survey required or not?")
});

const EditTicketsLandingPage = (props) => {

    const { auth } = useContext(AppContext);
    const [permissions, setPermissions] = useState({
        assignToSlef: false,
        followup: false,
        readOnly: false,
        reAssign: false,
        reAssignToSelf: false,
    });
    const [flowValue, setFlowValue] = useState()
    const [taskHistoryMsg, setTaskHistoryMsg] = useState(false)
    const [customerData, setCustomerData] = useState(null);
    const [showInquiryCustomer, setShowInquiryCustomer] = useState(false)
    const [complaintData, setComplaintData] = useState({
        problemType: "",
        problemCause: "",
        ticketChannel: "",
        ticketSource: "",
        ticketPriority: "",
        contactPreference: "",
        ticketCreatedBy: "",
        currentStatus: "",
        currentDeptRole: "",
        currentUser: "",
        ticketCreatedOn: "",
        ticketDescription: "",
        latestAppointment: "",
        serviceOrProduct: "",
        inquiryAbout: "",
        realTimeDetails: {},
        ticketUserLocation: ""
    });
    const [ticketDetailsError, setTicketDetailsError] = useState({});
    const [ticketDetailsInputs, setTicketDetailsInputs] = useState({
        surveyReq: "",
        assignRole: "",
        entity: "",
        user: "",
        currStatus: "",
        additionalRemarks: "",
        fromDate: "",
        fromTime: "",
        toDate: "",
        toTime: "",
        contactPerson: "",
        contactNumber: "",
        appointmentRemarks: ""
    })
    const [followUpHistory, setFollowUpHistory] = useState([]);
    const [workflowHistory, setWorkflowHistory] = useState([]);
    const [taskHistory, setTaskHistory] = useState([]);
    const [appointmentHistory, setAppointmentHistory] = useState([]);
    const [currentFiles, setCurrentFiles] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const entityRef = useRef()
    const isRoleChangedByUserRef = useRef(false);
    const currentWorkflowRef = useRef();
    const currentTicketUserRef = useRef({
        currRole: "",
        currDept: "",
        currRoleName: "",
        currUser: "",
        currStatus: ""
    });

    const { isAdjustmentOrRefund, type } = props.location.state.data;

    const initialize = useCallback(() => {
        const { data } = props.location.state;
        showSpinner();
        isRoleChangedByUserRef.current = false;
        get(`${data.type === 'complaint' ? `${properties.COMPLAINT_API}/${data.interactionId}?type=${isAdjustmentOrRefund ? 'REQSR' : 'REQCOMP'}` : data.type === 'inquiry' ? `${properties.CUSTOMER_INQUIRY_API_2}/${data.interactionId}` : `${properties.SERVICE_REQUEST_DETAILS}/${data.interactionId}`}`)
            .then((response) => {
             
                setComplaintData({
                    ...response.data,
                    problemType: response.data.problemTypeDescription,
                    problemCause: response.data.problemCause,
                    ticketChannel: response.data.chnlDescription,
                    ticketSource: response.data.sourceDescription,
                    ticketPriority: response.data.priorityDescription,
                    ticketId: response.data.refIntxnId,
                    contactPreference: response.data.cntPrefer,
                    ticketCreatedBy: response.data.createdBy,
                    ticketCreatedOn: formatISODateTime(response.data.createdAt),
                    currentStatus: response.data.currStatus,
                    currentStatusDesc: response.data.currStatusDescription,
                    currentDeptRole: `${response.data.currEntity} - ${response.data.currRoleName}`,
                    currentDeptRoleDesc: `${response.data.currEntityDesc} - ${response.data.roleDesc}`,
                    currentUser: response.data.userName,
                    ticketDescription: response.data.description,
                    latestAppointment: response.data.latestAppointment,
                    serviceOrProduct: response.data.services,
                    inquiryAbout: response.data.causeCode,
                    serviceTypeDesc: response.data.typeDescription,
                    ticketUserLocation: response.data.location
                })
                if (['complaint', 'inquiry'].includes(data.type)) {
                    let assignRole = !!response.data.currRole ? parseInt(response.data.currRole) : "";
                    let assignDept = !!response.data.currEntity ? response.data.currEntity : "";
                    let assignRoleName = !!response.data.currRoleName ? response.data.currRoleName : "";
                    let user = !!response.data.currUser ? parseInt(response.data.currUser) : "";
                    let currStatus = response.data.currStatus;
                    currentTicketUserRef.current = {
                        currRole: assignRole,
                        currDept: assignDept,
                        currRoleName: assignRoleName,
                        currUser: user,
                        currStatus
                    };
                    // setTicketDetailsInputs({
                    //     ...ticketDetailsInputs,
                    //     assignRole,
                    //     assignRoleName,
                    //     user,
                    //     currStatus
                    // })
                    grantPermissions(assignRole, user, response.data.currStatus, assignDept);
                }
            })
        if (data.type === 'complaint') {
            get(`${properties.COMPLAINT_API}/appointment/${data.interactionId}?type=${isAdjustmentOrRefund ? 'REQSR' : 'REQCOMP'}`)
                .then((response) => {
                    setAppointmentHistory(response.data)
                })
        }
        if (['complaint', 'inquiry'].includes(data.type)) {
            get(`${properties.INTERACTION_API}/followUp/${data.interactionId}`)
                .then((response) => {
                    setFollowUpHistory(response.data)
                })
        }
        get(`${properties.INTERACTION_API}/history/${data.interactionId}`)
            .then((response) => {
                setWorkflowHistory(response.data)
            })
        if ((data.type === 'complaint' && data.woType === 'FAULT') || data.type === 'service request') {
            getTaskHistory();
        }
        get(`${properties.CUSTOMER_DETAILS}/${data.customerId}?serviceId=${data.serviceId}`)
            .then((customerResp) => {
                if (!data.accountId) {
                    setShowInquiryCustomer(true)
                    setCustomerData(customerResp.data)
                }
                else {
                    setShowInquiryCustomer(false)
                }
                if (data.accountId) {
                    setShowInquiryCustomer(false)
                    get(`${properties.ACCOUNT_DETAILS_API}/${data.customerId}?account-id=${data.accountId}`)
                        .then((accountResp) => {
                            get(`${properties.SERVICES_LIST_API}/${data.customerId}?account-id=${data.accountId}&service-id=${data.serviceId}&realtime=false`)
                                .then((serviceResp) => {
                                    customerResp.data.accountNumber = accountResp?.data?.accountNo;
                                    customerResp.data.accountEmail = accountResp?.data?.email;
                                    customerResp.data.accountContactNbr = accountResp?.data?.contactNbr;
                                    customerResp.data.accountName = `${accountResp?.data?.foreName} ${accountResp?.data?.surName}`;
                                    customerResp.data.serviceNumber = serviceResp.data[0]?.accessNbr;
                                    customerResp.data.serviceType = serviceResp.data[0]?.prodType;
                                    customerResp.data.serviceStatus = serviceResp.data[0]?.statusDesc;
                                    customerResp.data.planName = serviceResp.data[0]?.planName;
                                    customerResp.data.customerName = customerResp?.data?.surName + " " + customerResp?.data?.foreName
                                    setCustomerData(customerResp.data)
                                })
                                .finally(() => {
                                    hideSpinner();
                                })
                        })
                        .catch((error) => {
                            hideSpinner();
                        })
                }
                else {
                    hideSpinner();
                }
            })
        hideSpinner();
    }, [])

    useEffect(() => {
        initialize();
    }, [props.location.state, initialize])

    const getTaskHistory = () => {
        const { interactionId } = props.location.state.data;
        showSpinner();
        get(`${properties.CUSTOMER_API}/interaction/${interactionId}`)
            .then((response) => {
                if (response.data.length > 0) {
                    setTaskHistory(response.data)
                    setTaskHistoryMsg(false)
                }
                else {
                    setTaskHistoryMsg(true)
                }
            })
            .finally(hideSpinner)
    }

    const grantPermissions = (assignedRole, assignedUserId, currStatus, assignedDept) => {
        const { user, currRoleId, currDeptId } = auth;
        if (["CLOSED", "QC-PASS", "CANCELLED"].includes(currStatus)) {
    
            setPermissions({
                assignToSlef: false,
                followup: false,
                readOnly: true,
                reAssign: false,
                reAssignToSelf: false,
            })
            return;
        }

    if (Number(assignedRole) === Number(currRoleId) && assignedDept === currDeptId) {
            if (assignedUserId !== "") {
                if (Number(assignedUserId) === Number(user.userId)) {

                    setPermissions({
                        assignToSlef: false,
                        followup: false,
                        readOnly: false,
                        reAssign: true,
                        reAssignToSelf: false,
                    })
                }
                else {

                    setPermissions({
                        assignToSlef: false,
                        followup: true,
                        readOnly: true,
                        reAssign: false,
                        reAssignToSelf: true,
                    })
                }
            }
            else {

                setPermissions({
                    assignToSlef: true,
                    followup: true,
                    readOnly: true,
                    reAssign: false,
                    reAssignToSelf: false,
                })
            }
        }
        else {
            if (assignedUserId !== "") {

                setPermissions({
                    assignToSlef: false,
                    followup: true,
                    readOnly: true,
                    reAssign: false,
                    reAssignToSelf: false,
                })
            }
            else {

                setPermissions({
                    assignToSlef: false,
                    followup: true,
                    readOnly: true,
                    reAssign: false,
                    reAssignToSelf: false,
                })
            }
        }
    }

    const handleOnTicketDetailsInputsChange = (e) => {
        const { target } = e;
        if (target.id === 'assignRole') {
            const { unitName = "", unitId = "" } = target.value !== "" && JSON.parse(target.options[target.selectedIndex].dataset.entity)

            entityRef.current = { unitId, unitName }
            unstable_batchedUpdates(() => {
                setTicketDetailsInputs({
                    ...ticketDetailsInputs,
                    [target.id]: target.value,
                    user: "",
                    entity: entityRef.current,
                })
            })
            isRoleChangedByUserRef.current = true;
        }
        if (target.id === 'user') {
            setTicketDetailsInputs({
                ...ticketDetailsInputs,
                [target.id]: target.value,
                //currStatus: target.value === "" ? 'NEW' : 'ASSIGNED'
            })
        }
        else if (target.id === 'currStatus') {
            const { realTimeDetails } = complaintData;
            let restrictStatus = false;
            if (realTimeDetails && realTimeDetails.hasOwnProperty('status')) {
                if (target.value === 'CLOSED') {
                    if (realTimeDetails.status === 'CLOSED') {
                        restrictStatus = false;
                    }
                    else {
                        restrictStatus = true;
                        toast.info('Cannot close this ticket until UNN status is also closed.');
                    }
                }
            }
            setTicketDetailsInputs({
                ...ticketDetailsInputs,
                [target.id]: restrictStatus ? "" : target.value,
            })
        }
        else {
            setTicketDetailsInputs({
                ...ticketDetailsInputs,
                [target.id]: target.id === 'contactNumber' ? Number(target.value) ? target.value : "" : target.value
            })
        }
    }

    const validate = (section, schema, data) => {
        try {
            if (section === 'DETAILS') {
                setTicketDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'DETAILS') {
                    setTicketDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };

    const checkTicketDetails = useCallback(() => {
        let error = validate('DETAILS', ticketDetailsValidationSchema, ticketDetailsInputs);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        } else if (ticketDetailsInputs.currStatus === 'PEND-CLOSE') {
            if (!ticketDetailsInputs.surveyReq) {
                toast.error("Validation errors found. Please check for mandatory fields");
                return false;
            }
        }
        return true;
    }, [ticketDetailsInputs])

    const handleTicketDetailsSubmit = (e, isAppointmentEdit) => {
        e.preventDefault();
        const { data } = props.location.state;
        const { accountId, causeCode, chnlCode, clearCode, natureCode, priorityCode, problemCode, problemTypeDescription, sourceCode, description, customerId, connectionId, cntPrefer, serviceOrProduct, inquiryAbout } = complaintData;
        const { assignRole, user, currStatus, additionalRemarks, fromDate, fromTime, toDate, toTime, contactPerson, contactNumber, appointmentRemarks, entity, surveyReq } = ticketDetailsInputs;

        if (checkTicketDetails()) {
            let reqBody = data.type === 'complaint' ? {
                accountId: accountId,
                causeCode: causeCode,
                chnlCode: chnlCode,
                clearCode: clearCode,
                natureCode: natureCode,
                priorityCode: priorityCode,
                problemCause: complaintData.commentCause,
                problemType: complaintData.commentType,
                remarks: description,
                sourceCode: sourceCode,
                customerId: customerId,
                serviceId: connectionId,
                cntPrefer: cntPrefer,
                toRole: assignRole,
                toUser: user ? user : null,
                currStatus,
                productOrServices: serviceOrProduct,
                additionalRemarks: additionalRemarks,
                ticketType: complaintData.intxnCatType && complaintData.intxnCatType,
                flow: flowValue,
                attachments: [...existingFiles.map((current) => current.entityId), ...currentFiles.map((current) => current.entityId)],
                appointment: {
                    appointmentId: isAppointmentEdit ? complaintData.latestAppointment.appointmentId : "",
                    fromDate: fromDate,
                    fromTime: fromTime,
                    toDate: toDate,
                    toTime: toTime,
                    contactPerson,
                    contactNumber,
                    remarks: appointmentRemarks
                },
                ...currentWorkflowRef.current,
                unitName: entityRef.current.unitName,
                toEntity: entityRef.current.unitId,
                surveyReq,
                intxnType: complaintData.intxnType && complaintData.intxnType
            }
                :
                {
                    //service: serviceOrProduct,
                    inquiryAbout: complaintData.commentType,
                    inquiryCategory: serviceOrProduct,
                    ticketPriority: priorityCode,
                    ticketChannel: chnlCode,
                    ticketSource: sourceCode,
                    problemCause: problemCode,
                    currStatus,
                    additionalRemarks: additionalRemarks,
                    customerId: customerId,
                    accountId: accountId,
                    toRole: assignRole,
                    toUser: user ? user : null,
                    connectionId: connectionId,
                    ticketType: complaintData.intxnCatType && complaintData.intxnCatType,
                    flow: flowValue,
                    attachments: [...existingFiles.map((current) => current.entityId), ...currentFiles.map((current) => current.entityId)],
                    ...currentWorkflowRef.current,
                    unitName: entityRef.current.unitName,
                    toEntity: entityRef.current.unitId,
                    surveyReq
                }
            showSpinner();
            put(`${data.type === 'complaint' ? properties.COMPLAINT_API : properties.CUSTOMER_INQUIRY_API_2}/${data.interactionId}`, { ...reqBody })
                .then((response) => {
                    toast.success(`${response.message}`);
                    // setTicketDetailsInputs({
                    //     ...ticketDetailsInputs,
                    //     fromDate: "",
                    //     fromTime: "",
                    //     toDate: "",
                    //     toTime: "",
                    //     contactPerson: "",
                    //     contactNumber: "",
                    //     appointmentRemarks: ""
                    // });
                    //initialize();
                    props.history.push(`${process.env.REACT_APP_BASE}/`);
                })
                .catch((error) => {
                    console.error(error);
                    toast.error(error);
                })
                .finally(() => {
                    hideSpinner();
                })
        }
    }

    return (
        <div className="container-fluid edit-complaint">
            <div className="row align-items-center">
                <div className="col">
                    <h1 className="title bold">{isAdjustmentOrRefund ? 'Service Request Number' : type === 'complaint' ? 'Ticket Number' : type === 'inquiry' ? 'Inquiry Number' : 'Service Request Number'} - {props.location.state.data.interactionId}</h1>
                </div>
                <div className="col-auto">
                    <button type="button" onClick={() => props.history.goBack()} className="btn btn-labeled btn-primary btn-sm">Back</button>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">

                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <nav className="navbar navbar-default navbar-fixed-top">
                                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                        <ul key="ecul1" className="nav navbar-nav">
                                            <li key="ecli11">
                                                <Link activeClass="active" to="ticketDetailsSection" spy={true} offset={-250} smooth={true} duration={100}>
                                                    {type === 'complaint' ? 'Ticket Details' : type === 'inquiry' ? 'Inquiry Details' : 'Service Details'}
                                                </Link>
                                            </li>
                                            <li key="ecli12"><Link activeClass="active" to="customerSection" spy={true} offset={-230} smooth={true} duration={100}>Customer</Link></li>
                                            {
                                                type !== 'service request' && (
                                                    <li key="ecli13"><Link activeClass="active" to="attachmentsSection" spy={true} offset={-220} smooth={true} duration={100}>Attachments</Link></li>
                                                )
                                            }
                                            {
                                                type === 'complaint' && (
                                                    <>
                                                        <li key="ecli14"><Link activeClass="active" to="AppointmentSection" spy={true} offset={-220} smooth={true} duration={100}>Appointment</Link></li>
                                                    </>
                                                )
                                            }
                                        </ul>
                                    </div>
                                </nav>
                            </div>

                            <div className="edit-inq  new-customer col-md-10">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div new-customer">
                                    <div className="col-12">
                                        <ul key="ecul2" className="nav nav-tabs" role="tablist">
                                            <li key="ecli21" className="nav-item pl-0">
                                                <button data-target="#ticketDetails" role="tab" data-toggle="tab" aria-expanded="false" className="nav-link active font-17 bolder">
                                                    {type === 'complaint' ? 'Ticket Details' : type === 'inquiry' ? 'Inquiry Details' : 'Service Request Details'}
                                                </button>
                                            </li>
                                            <li key="ecli22" className="nav-item">
                                                <button data-target="#ticketHistory" role="tab" data-toggle="tab" aria-expanded="false" className="nav-link font-17 bolder">
                                                    Workflow History
                                                </button>
                                            </li>
                                        </ul>

                                    </div>
                                    <div className="tab-content py-0 pl-3">
                                        <div className="tab-pane show active" id="ticketDetails">
                                            <TicketDetails
                                                data={{
                                                    customerData,
                                                    showInquiryCustomer,
                                                    complaintData,
                                                    ticketDetailsInputs,
                                                    permissions,
                                                    interactionData: props.location.state.data,
                                                    isRoleChangedByUserRef,
                                                    currentFiles,
                                                    existingFiles,
                                                    currentWorkflowRef,
                                                    currentTicketUserRef,
                                                    entityRef: entityRef.current
                                                }}
                                                handlers={{
                                                    handleOnTicketDetailsInputsChange: handleOnTicketDetailsInputsChange,
                                                    handleTicketDetailsSubmit: handleTicketDetailsSubmit,
                                                    setTicketDetailsInputs,
                                                    setCurrentFiles,
                                                    setExistingFiles,
                                                    initialize,
                                                    setTicketDetailsError,
                                                    setFlowValue,
                                                    setPermissions
                                                }}
                                                error={ticketDetailsError}
                                            />
                                        </div>
                                        <div className="tab-pane" id="ticketHistory">
                                            <TicketHistory
                                                data={{
                                                    realTimeDetails: complaintData.realTimeDetails,
                                                    followUpHistory,
                                                    appointmentHistory,
                                                    workflowHistory,
                                                    taskHistory,
                                                    interactionData: props.location.state.data,
                                                    taskHistoryMsg
                                                }}
                                                handlers={{
                                                    initialize
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTicketsLandingPage;