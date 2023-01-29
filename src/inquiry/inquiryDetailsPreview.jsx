import React from 'react'

const InquiryDetailsPreview = (props) => {
    const inquiryDataDetails = props.data.inquiryDataDetails
    return (
        <div className="row pt-1">
            <div className="col-12 pl-2 bg-light border">
                <h5 className="text-primary">Customer Inquiry Details</h5>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="serviceType" className="col-form-label">Service Type</label>
                    <p>{inquiryDataDetails.serviceType}</p>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="productOrServices" className="col-form-label">Product/Services</label>
                    <p>{inquiryDataDetails.productOrServices}</p>
                </div>
            </div>
            {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Product Enquired</label>
                        <p>{personalInquireData.productEnquired}</p>
                    </div>
                </div> */}
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="inquiryAboutDesc" className="col-form-label">Enquiry About </label>
                    <p>{inquiryDataDetails.inquiryAboutDesc}</p>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="ticketUserLocation" className="col-form-label">Ticket Location</label>
                    <p>{inquiryDataDetails.ticketUserLocation}</p>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="ticketChannelDesc" className="col-form-label">Ticket Channel </label>
                    <p>{inquiryDataDetails.ticketChannelDesc}</p>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="ticketSourceDesc" className="col-form-label">Ticket Source </label>
                    <p>{inquiryDataDetails.ticketSourceDesc}</p>
                </div>
            </div>
            <div className="col-md-3">
                <div className="form-group">
                    <label htmlFor="problemCauseDesc" className="col-form-label">Problem Cause </label>
                    <p>{inquiryDataDetails.problemCauseDesc}</p>
                </div>
            </div>

            <div className="col-md-12">
                <div className="form-group">
                    <label htmlFor="remark" className="col-form-label">Remark</label>
                    <p style={{ height: '120px' }}>{inquiryDataDetails.remark}</p>
                </div>
            </div>
        </div>
    )
}
export default InquiryDetailsPreview
