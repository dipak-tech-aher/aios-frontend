import React, { useEffect, useRef, useState } from 'react';
import { Link, Element } from 'react-scroll';
import { get, post, put } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from 'react-toastify';
import FileUpload from '../common/uploadAttachment/fileUpload';
import ServiceRequestDetailsForm from './serviceRequestDetailsForm';

const EditServiceRequest = (props) => {
    const [customerData, setCustomerData] = useState(null);

    const [problemTypeLookup, setProblemTypeLookup] = useState();
    const [problemCauseLookup, setProblemCauseLookup] = useState();
    const [channelLookup, setChannelLookup] = useState();
    const [sourceLookup, setSourceLookup] = useState();
    const [priorityLookup, setPriorityLookup] = useState();
    const [preferenceLookup, setPreferenceLookup] = useState();
    const [natureCodeLookup, setNatureCodeLookup] = useState();
    const [clearCodeLookup, setClearCodeLookup] = useState();
    const [causeCodeLookup, setCauseCodeLookup] = useState();

    const lookupData = useRef({})

    const [serviceRequestData, setServiceRequestData] = useState({
        problemType: '',
        problemCause: '',
        channel: '',
        source: '',
        priority: '',
        preference: '',
        remarks: '',
        natureCode: '',
        clearCode: '',
        causeCode: '',
        followUpDetails: '',
        fromDate: '',
        fromTime: '',
        toDate: '',
        toTime: '',
        contactName: '',
        contactNumber: '',
        appointmentRemarks: '',
        show: true
    });

    useEffect(() => {
        const { data } = props.location.state;
        showSpinner();
        get(`${properties.CUSTOMER_DETAILS}/${data.customerId}?serviceId=${data.serviceId}`)
            .then((response) => {
                setCustomerData(response.data)
            })
        get(`${properties.COMPLAINT_API}/${data.interactionId}`)
            .then((response) => {
                setServiceRequestData({
                    problemType: response.data.problemCode,
                    problemCause: '',
                    channel: response.data.chnlCode,
                    source: response.data.sourceCode,
                    priority: response.data.priority,
                    preference: response.data.cntPrefer,
                    remarks: '',
                    natureCode: '',
                    clearCode: response.data.clearCode,
                    causeCode: response.data.causeCode,
                    followUpDetails: '',
                    fromDate: '',
                    fromTime: '',
                    toDate: '',
                    toTime: '',
                    contactName: '',
                    contactNumber: '',
                    appointmentRemarks: '',
                    show: response.data.problemCode === null && false
                })
            })
        post(properties.BUSINESS_ENTITY_API, ['PROBLEM_TYPE',
            'PROBLEM_CAUSE',
            'TICKET_CHANNEL',
            'TICKET_SOURCE',
            'TICKET_PRIORITY',
            'CONTACT_TYPE',
            'NATURE_CODE',
            'CLEAR_CODE',
            'CAUSE_CODE',
            'NEXT_STAGE'
        ])
            .then((response) => {
                if (response.data) {
                    lookupData.current = response.data;
                    setProblemTypeLookup(lookupData.current['PROBLEM_TYPE'])
                    setProblemCauseLookup(lookupData.current['PROBLEM_CAUSE'])
                    setChannelLookup(lookupData.current['TICKET_CHANNEL'])
                    setSourceLookup(lookupData.current['TICKET_SOURCE'])
                    setPriorityLookup(lookupData.current['TICKET_PRIORITY'])
                    setPreferenceLookup(lookupData.current['CONTACT_TYPE'])
                    setNatureCodeLookup(lookupData.current['NATURE_CODE'])
                    setClearCodeLookup(lookupData.current['CLEAR_CODE'])
                    setCauseCodeLookup(lookupData.current['CAUSE_CODE'])
                    hideSpinner();
                }
            })

    }, [props.location.state])

    const [isEdit, setIsEdit] = useState(false);

    const handleLookupOrStateChange = (e) => {
        const target = e.target;
        let selectedObject;
        if (target.tagName === 'SELECT') {
            if (target.id === 'problemType') selectedObject = JSON.parse(target.options[target.selectedIndex].dataset.object)
            setServiceRequestData({
                ...serviceRequestData,
                [target.id]: target.value,
                show: selectedObject !== undefined ?
                    selectedObject.mapping === null ?
                        false
                        : true
                    : true
            })
        }
        else {
            setServiceRequestData({
                ...serviceRequestData,
                [target.id]: target.value
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const { data } = props.location.state;
        showSpinner();
        const requestParam = {
            complaint: {
                customerId: customerData.customerId,
                accountId: customerData.account[0].accountId,
                serviceId: customerData.account[0].service[0].serviceId,
                problemType: serviceRequestData.problemType,
                problemCause: serviceRequestData.problemCause,
                channel: serviceRequestData.channel,
                source: serviceRequestData.source,
                priority: serviceRequestData.priority,
                preference: serviceRequestData.preference,
                remarks: serviceRequestData.remarks,
                natureCode: serviceRequestData.natureCode,
                clearCode: serviceRequestData.clearCode,
                causeCode: serviceRequestData.causeCode,
            }
        }
        put(`${properties.COMPLAINT_API}/${data.interactionId}`, requestParam)
            .then((response) => {
                toast.success(`${response.message} with ID ${response.data.intxnId}`)
            })
            .finally(hideSpinner);
    }

    return (
        <div className="container-fluid">
            <div className="col-12">
                <h1 className="title">Edit Complaint</h1>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="card-box">
                        <div className="row p-1">
                            <div className="testFlex">
                                <div className="col-12 col-md-2 sticky">
                                    <nav className="navbar navbar-default navbar-fixed-top">
                                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                            <ul className="nav navbar-nav">
                                                <li><Link activeClass="active" className="test1" to="customerSection" spy={true} offset={-100} smooth={true} duration={100}>Customer</Link></li>
                                                <li><Link activeClass="active" className="test2" to="complaintSection" spy={true} offset={-100} smooth={true} duration={100}>Complaint</Link></li>
                                                <li><Link activeClass="active" className="test3" to="followUpSection" spy={true} offset={-100} smooth={true} duration={100}>Follow up</Link></li>
                                                <li><Link activeClass="active" className="test3" to="AppointmentSection" spy={true} offset={-100} smooth={true} duration={100}>Appointment</Link></li>
                                                <li><Link activeClass="active" className="test4" to="attachmentsSection" spy={true} offset={-100} smooth={true} duration={100}>Attachments</Link></li>
                                            </ul>
                                        </div>
                                    </nav>
                                </div>

                                <div className="col-12 col-md-10 p-0">
                                    <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div new-customer">
                                        <Element name="customerSection" className="element">
                                            <div className="row">
                                                <div className="col-12 p-0">
                                                    <section className="triangle"><h4 id="list-item-0" className="pl-2">Customer - {customerData && customerData.customerId}</h4></section>
                                                </div>
                                            </div>

                                            <div className="block-section">
                                                <fieldset className="scheduler-border">
                                                    <div id="customer-details">
                                                        <div className="row pt-2 pr-2">
                                                            <div className="col-2"><img src="../assets/images/profile.jpg" alt="profile" />
                                                            </div>
                                                            <div className="col-10 pr-0">
                                                                <div className="form-row">
                                                                    <div className="col-12">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputName" className="col-form-label">Customer Name</label>
                                                                                    <p>{customerData && customerData.foreName} {customerData && customerData.surName}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">

                                                                            <div className="col-md-3">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Customer Type</label>
                                                                                    <p>{customerData && customerData.customerType}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Category</label>
                                                                                    <p>{customerData && customerData.category}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Class</label>
                                                                                    <p>{customerData && customerData.class}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="row">
                                                                            <div className="col-md-3">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Email ID</label>
                                                                                    <p>{customerData && customerData.email}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Contact Type</label>
                                                                                    <p>{customerData && customerData.contactType}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <div className="form-group">
                                                                                    <label htmlFor="inputState" className="col-form-label">Customer Address</label>
                                                                                    <p>{customerData && customerData.address[0].flatHouseUnitNo} {customerData && customerData.address[0].flatHouseUnitNo} Block, {customerData && customerData.address[0].street}, {customerData && customerData.address[0].cityTown}</p>
                                                                                    <p>{customerData && customerData.address[0].country}</p>
                                                                                    <p>{customerData && customerData.address[0].postcode}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                        </Element>

                                        <Element name="complaintSection" className="element comp-sec">
                                            <div className="row align-items-center">
                                                <div className="col-12 p-0">
                                                    <section className="triangle"><h4 id="list-item-0" className="pl-2">Complaint</h4>

                                                    </section>
                                                </div>
                                                <div className="col-auto ml-auto">

                                                </div>
                                            </div>

                                            <ServiceRequestDetailsForm
                                                data={serviceRequestData}
                                                customerData={customerData}
                                                lookups={{
                                                    problemTypeLookup: problemTypeLookup,
                                                    problemCauseLookup: problemCauseLookup,
                                                    channelLookup: channelLookup,
                                                    sourceLookup: sourceLookup,
                                                    priorityLookup: priorityLookup,
                                                    preferenceLookup: preferenceLookup,
                                                    natureCodeLookup: natureCodeLookup,
                                                    clearCodeLookup: clearCodeLookup,
                                                    causeCodeLookup: causeCodeLookup
                                                }}
                                                lookupOrStateHandler={handleLookupOrStateChange}
                                                isEdit={isEdit}
                                            />

                                            <button className="btn btn-outline-primary btn-xs text-primary edit-comp btn-edit" onClick={() => setIsEdit(!isEdit)}><i className={`mdi ${isEdit ? 'mdi-eye' : 'mdi-pencil'} pr-1`} />{isEdit ? 'Preview' : 'Edit'}</button>
                                        </Element>

                                        <Element name="followUpSection" className="element">
                                            <div className="row">
                                                <div className="col-12 p-0">
                                                    <section className="triangle"><h4 id="list-item-0" className="pl-2">Follow up</h4></section>
                                                </div>
                                            </div>
                                            <div className="block-section">
                                                <fieldset className="scheduler-border">

                                                    <div className="form-group col-12">
                                                        <label htmlFor="followUpDetails" className="col-form-label">follow up Details</label>
                                                        <textarea value={serviceRequestData.followUpDetails} onChange={handleLookupOrStateChange} className="form-control" id="followUpDetails" name="followUpDetails" rows="4" ></textarea>
                                                    </div>
                                                    <div className="mb-1">
                                                        <label><h5>Previous follow up on 28-Jan-21 10:00 AM </h5>   </label>
                                                        <span>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</span><br />
                                                        <span>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</span>
                                                    </div>
                                                    <div className="mb-1">
                                                        <label><h5>Previous follow up up on 15-Jan-21 4:00 PM </h5>   </label>
                                                        <span>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</span><br />
                                                        <span>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</span>
                                                    </div>
                                                </fieldset>
                                            </div>
                                        </Element>

                                        <Element name="AppointmentSection" className="element">
                                            <div className="row">
                                                <div className="col-12 p-0">
                                                    <section className="triangle"><h4 id="list-item-0" className="pl-2">Appointment</h4></section>
                                                </div>
                                            </div>
                                            <div className="block-section">
                                                <fieldset className="scheduler-border">
                                                    <form>
                                                        <div className="form-group col-12">
                                                            <label className="col-form-label" htmlFor="fromDate">Date &amp; Time</label>
                                                            <div className="form-inline">
                                                                <input value={serviceRequestData.formDate} className="form-control mr-2" id="fromDate" type="date" name="fromDate" onChange={handleLookupOrStateChange} />
                                                                <input value={serviceRequestData.formTime} className="form-control mr-2" id="fromTime" type="time" name="fromTime" onChange={handleLookupOrStateChange} />
                                                                <span>To</span>
                                                                <input value={serviceRequestData.toDate} className="form-control mr-2 ml-2" id="toDate" type="date" name="toDate" onChange={handleLookupOrStateChange} />
                                                                <input value={serviceRequestData.toTime} className="form-control" id="toTime" type="time" name="toTime" onChange={handleLookupOrStateChange} />
                                                            </div>
                                                        </div>
                                                        <div className="form-row">
                                                            <div className="form-group col-4">
                                                                <label htmlFor="contactName" className="col-form-label mr-2">Contact Name</label>
                                                                <input value={serviceRequestData.contactName} onChange={handleLookupOrStateChange} type="text" className="form-control mr-2" id="contactName" placeholder="Contact Name" />
                                                            </div>
                                                            <div className="form-group col-3">
                                                                <label htmlFor="contactNumber" className="col-form-label mr-2">Contact No.</label>
                                                                <input value={serviceRequestData.contactNumber} onChange={handleLookupOrStateChange} type="text" className="form-control" id="contactNumber" placeholder="Contact Nbr" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group col-12">
                                                            <label htmlFor="appointmentremarks" className="col-form-label">Remarks </label>
                                                            <textarea value={serviceRequestData.appointmentRemarks} onChange={handleLookupOrStateChange} className="form-control" id="appointmentRemarks" name="appointmentRemarks" rows="4"></textarea>
                                                        </div>
                                                    </form>
                                                </fieldset>
                                            </div >
                                        </Element >

                                        <Element name="attachmentsSection" className="element">
                                            <div className="row">
                                                <div className="col-12 p-0">
                                                    <section className="triangle"><h4 id="list-item-0" className="pl-2">Attachments</h4></section>
                                                </div>
                                            </div>

                                            <FileUpload />
                                        </Element >
                                        <div id="page-buttons" className="d-flex justify-content-center mt-3">
                                            <button type="button" id="submit" className="btn btn-primary waves-effect waves-light mr-2" onClick={handleSubmit} >Submit</button>
                                            <button type="button" id="saveAsDraft" className="btn btn-secondary waves-effect waves-light">Save as draft</button>
                                            <button type="button" id="cancel" className="btn btn-secondary waves-effect waves-light ml-2">Cancel</button>
                                        </div>
                                    </div >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >

            </div >
        </div >
    )
}

export default EditServiceRequest;