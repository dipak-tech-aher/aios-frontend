import React from 'react';

const ComplaintOrServiceRequestDetailsForm = (props) => {
    const { lookupOrStateHandler, data, customerData, isEdit = true, error, setError } = props
    const { problemTypeLookup, problemCauseLookup, channelLookup, sourceLookup, priorityLookup, preferenceLookup, natureCodeLookup, clearCodeLookup, causeCodeLookup, ticketTypeLookup, productOrServicesLookup } = props.lookups;
    return (
        <div className="block-section">
            <fieldset className="scheduler-border">
                <div className="form-row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 p-0">
                                <div id="complaint-form" style={{ display: "block" }}>
                                    <div className="row">
                                        <div className="form-group col-md-3 d-none">
                                            <label htmlFor="requestType" className="col-form-label">Request Type</label>
                                            <p id="requestType">Complaint</p>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ticketType" className="col-form-label">Ticket Type<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.ticketType} id="ticketType" className={`form-control ${error.ticketType && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, ticketType: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="ticketType" value="">Select Ticket Type</option>
                                                            {
                                                                ticketTypeLookup && ticketTypeLookup.map((e) => (
                                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.ticketType ? error.ticketType : ""}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.ticketType}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="productOrServices" className="col-form-label">Problem Category<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.productOrServices} id="productOrServices" className={`form-control ${error.productOrServices && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, productOrServices: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="productOrServices" value="">Select Problem Category</option>
                                                            {
                                                                productOrServicesLookup && productOrServicesLookup.map((e) => (
                                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.productOrServices && error.productOrServices}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.problemCause}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="problemType" className="col-form-label">Problem Type<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.problemType} id="problemType" className={`form-control ${error.problemType && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, problemType: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="problemType" value="" data-object={JSON.stringify({})}>Select Problem Type</option>
                                                            {
                                                                problemTypeLookup && problemTypeLookup.map((e) => (

                                                                    <option key={e.code} value={e.code} data-object={JSON.stringify(e)}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.problemType ? error.problemType : ""}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.problemType}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="problemCause" className="col-form-label">Problem Cause<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.problemCause} id="problemCause" className={`form-control ${error.problemCause && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, problemCause: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="problemCause" value="" data-object={JSON.stringify({})}>Select Problem Cause</option>
                                                            {
                                                                problemCauseLookup && problemCauseLookup.map((e) => (
                                                                    <option key={e.code} value={e.code} data-object={JSON.stringify(e)}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.problemCause && error.problemCause}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.problemCause}</p>
                                                    )
                                            }
                                        </div>
                                        {/* <div className="form-group col-md-3">
                                            <label htmlFor="serviceType" className="col-form-label">Service Type</label>
                                            <p id="serviceType">{customerData && customerData.serviceType}</p>
                                        </div> */}
                                        {/* </div> */}
                                        {
                                            data.show &&
                                            <div className="d-none">
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="natureCode" className="col-form-label">Nature Code</label>
                                                    {
                                                        isEdit ? (
                                                            <select value={data.natureCode} id="natureCode" className="form-control" onChange={lookupOrStateHandler}>
                                                                <option key="natureCode" value="">Select Nature Code</option>
                                                                {
                                                                    natureCodeLookup && natureCodeLookup.map((e) => (
                                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        )
                                                            : (
                                                                <p>{data.natureCode}</p>
                                                            )
                                                    }
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="clearCode" className="col-form-label">Clear Code</label>
                                                    {
                                                        isEdit ? (
                                                            <select value={data.clearCode} id="clearCode" className="form-control" onChange={lookupOrStateHandler} >
                                                                <option key="clearCode" value="">Select Clear Code</option>
                                                                {
                                                                    clearCodeLookup && clearCodeLookup.map((e) => (
                                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        )
                                                            : (
                                                                <p>{data.clearCode}</p>
                                                            )
                                                    }
                                                </div>
                                                <div className="form-group col-md-3">
                                                    <label htmlFor="causeCode" className="col-form-label">Cause Code</label>
                                                    {
                                                        isEdit ? (
                                                            <select value={data.causeCode} id="causeCode" className="form-control" onChange={lookupOrStateHandler}>
                                                                <option key="causeCode" value="">Select Cause Code</option>
                                                                {
                                                                    causeCodeLookup && causeCodeLookup.map((e) => (
                                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                                    ))
                                                                }
                                                            </select>
                                                        )
                                                            : (
                                                                <p>{data.causeCode}</p>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        }
                                        {/* <div className="row"> */}
                                        {
                                            (data.unnProblemCodeDesc || data.unnProblemCode) &&
                                            <div className="col-md-3 new-customer" >
                                                <div className="form-group ">
                                                    <label htmlFor="problemCode" className="col-form-label">UNN Problem Code</label>
                                                    <p>{isEdit ? data.unnProblemCodeDesc : data.unnProblemCode}</p>
                                                </div>
                                            </div>
                                        }
                                        <div className="col-md-3 new-customer" >
                                            <div className="form-group ">
                                                <label htmlFor="serviceCategory" className="col-form-label">Service Category</label>
                                                <p>{data.serviceCategory}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3 new-customer" >
                                            <div className="form-group ">
                                                <label htmlFor="userLocation" className="col-form-label">Ticket Location</label>
                                                <p>{data?.userLocationDesc}</p>
                                            </div>
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="channel" className="col-form-label">Ticket Channel<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.channel} id="channel" className={`form-control ${error.channel && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, channel: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="channel" value="">Select Channel</option>
                                                            {
                                                                channelLookup && channelLookup.map((e) => (
                                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.channel && error.channel}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.channel}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="source" className="col-form-label">Ticket Source<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.source} id="source" className={`form-control ${error.source && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, source: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="source" value="">Select Source</option>
                                                            {
                                                                sourceLookup && sourceLookup.map((e) => (
                                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.source && error.source}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.source}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="priority" className="col-form-label">Ticket Priority<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.priority} id="priority" className={`form-control ${error.priority && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, priority: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="priority" value="">Select Priority</option>
                                                            {
                                                                priorityLookup && priorityLookup.map((e) => (
                                                                    <option key={e.code} value={e.code}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.priority && error.priority}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.priority}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="preference" className="col-form-label">Contact Preference<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <select value={data.preference} id="preference" className={`form-control ${error.preference && "error-border"}`}
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, preference: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} >
                                                            <option key="preference" value="">Select Preference</option>
                                                            {
                                                                preferenceLookup && preferenceLookup.map((e) => (
                                                                    <option key={e.code} value={e.description}>{e.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        <span className="errormsg">{error.preference && error.preference}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.preference}</p>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col">
                                            <label htmlFor="remarks" className="col-form-label">Ticket Description<span>*</span></label>
                                            {
                                                isEdit ? (
                                                    <>
                                                        <textarea value={data.remarks} className={`form-control ${error.remarks && "error-border"}`} id="remarks" name="remarks" rows="4"
                                                            maxLength="2500"
                                                            onChange={
                                                                (e) => {
                                                                    setError({ ...error, remarks: "" });
                                                                    lookupOrStateHandler(e)
                                                                }} />
                                                        <span>Maximum 2500 characters</span>
                                                        <span className="errormsg">{error.remarks && error.remarks}</span>
                                                    </>
                                                )
                                                    : (
                                                        <p>{data.remarks}</p>
                                                    )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset>
        </div>
    )
}

export default ComplaintOrServiceRequestDetailsForm;