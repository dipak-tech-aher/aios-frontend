import React from 'react';

const ServiceRequestDetailsForm = (props) => {
    const { lookupOrStateHandler, data, customerData, isEdit = true } = props
    const { problemTypeLookup, problemCauseLookup, channelLookup, sourceLookup, priorityLookup, preferenceLookup, natureCodeLookup, clearCodeLookup, causeCodeLookup } = props.lookups;
    return (
        <div className="block-section" >
            <fieldset className="scheduler-border" >
                <div className="form-row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12 p-0">
                                <div id="complaint-form" style={{ display: "block" }}>
                                    <div className="row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="ticketType" className="col-form-label">Interaction Type</label>
                                            <p id="ticketType">Service Request</p>
                                        </div>

                                        <div className="form-group col-md-3">
                                            <label htmlFor="ticketType" className="col-form-label">Service Type</label>
                                            {/* <p id="ticketType">Fixed, {customerData && customerData.account[0].hasOwnProperty('service') && customerData.account[0].service[0].plan.planName}</p> */}
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="problemType" className="col-form-label">Problem Type</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.problemType} id="problemType" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="problemType" value="" data-object={JSON.stringify({})}>Select Problem Type</option>
                                                        {
                                                            problemTypeLookup && problemTypeLookup.map((e) => (
                                                                <option key={e.code} value={e.description} data-object={JSON.stringify(e)}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.problemType}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="problemCause" className="col-form-label">Problem Cause</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.problemCause} id="problemCause" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="problemType" value="">Select Problem Cause</option>
                                                        {
                                                            problemCauseLookup && problemCauseLookup.map((e) => (
                                                                <option key={e.code} value={e.description}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.problemCause}</p>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="channel" className="col-form-label">Channel</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.channel} id="channel" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="channel" value="">Select Channel</option>
                                                        {
                                                            channelLookup && channelLookup.map((e) => (
                                                                <option key={e.code} value={e.description}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.channel}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="source" className="col-form-label">Source</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.source} id="source" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="source" value="">Select Source</option>
                                                        {
                                                            sourceLookup && sourceLookup.map((e) => (
                                                                <option key={e.code} value={e.description}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.source}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="priority" className="col-form-label">Priority</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.priority} id="priority" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="priority" value="">Select Priority</option>
                                                        {
                                                            priorityLookup && priorityLookup.map((e) => (
                                                                <option key={e.code} value={e.description}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.priority}</p>
                                                    )
                                            }
                                        </div>
                                        <div className="form-group col-md-3">
                                            <label htmlFor="preference" className="col-form-label">Contact Preference</label>
                                            {
                                                isEdit ? (
                                                    <select value={data.preference} id="preference" className="form-control" onChange={lookupOrStateHandler}>
                                                        <option key="preference" value="">Select Preference</option>
                                                        {
                                                            preferenceLookup && preferenceLookup.map((e) => (
                                                                <option key={e.code} value={e.description}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                )
                                                    : (
                                                        <p>{data.preference}</p>
                                                    )
                                            }
                                        </div>
                                    </div>
                                    {
                                        data.show &&
                                        <div className="row" id="external">
                                            <div className="form-group col-md-3">
                                                <label htmlFor="natureCode" className="col-form-label">Nature Code</label>
                                                {
                                                    isEdit ? (
                                                        <select value={data.natureCode} id="natureCode" className="form-control" onChange={lookupOrStateHandler}>
                                                            <option key="natureCode" value="">Select Nature Code</option>
                                                            {
                                                                natureCodeLookup && natureCodeLookup.map((e) => (
                                                                    <option key={e.code} value={e.description}>{e.description}</option>
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
                                                                    <option key={e.code} value={e.description}>{e.description}</option>
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
                                                                    <option key={e.code} value={e.description}>{e.description}</option>
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
                                    <div className="form-group col-12">
                                        <label htmlFor="remarks" className="col-form-label">Remarks</label>
                                        {
                                            isEdit ? (
                                                <textarea value={data.remarks} onChange={lookupOrStateHandler} className="form-control" id="remarks" name="remarks" rows="4" ></textarea>
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
            </fieldset >
        </div >
    )
}

export default ServiceRequestDetailsForm;