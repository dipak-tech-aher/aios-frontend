import { useTranslation } from "react-i18next";

const InquiryDetailsForm = (props) => {

    const { t } = useTranslation();
    const viewMode = props.viewMode;

    let inquiryDataDetails = props.data.inquiryDataDetails
    let autoFillserviceType = props.data.serviceTypeRef.current

    let setInquiryDataDetails = props.stateHandler.setInquiryDataDetails

    const lookupInquiryAbout = props.lookups.lookupInquiryAbout
    const lookupTicketchannel = props.lookups.lookupTicketchannel
    const lookupTicketSource = props.lookups.lookupTicketSource
    const lookupCause = props.lookups.lookupCause
    const serviceTypeLookup = props.lookups.serviceTypeLookup
    const productOrServicesLookup = props.lookups.productOrServicesLookup
    const lookupInquiryCategory = props.lookups.lookupInquiryCategory
    const lookupTicketPriority = props.lookups.lookupTicketPriority
    const handleInquiryDetailsOnChange = props.lookupsHandler.handleInquiryDetailsOnChange


    const error = props.error

    return (
        <form>
            <div className="form-row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="serviceType" className="col-form-label">Service Type<span>*</span></label>
                        {
                            !autoFillserviceType ?
                                <>
                                    <select id="serviceType" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.serviceType} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                                        onChange={handleInquiryDetailsOnChange}>
                                        <option value="" data-object={JSON.stringify({})}>Choose Service Type</option>
                                        {
                                            serviceTypeLookup.map((e) => (
                                                <option key={e.code} value={e.code} data-object={JSON.stringify(e)}>{e.description}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="errormsg">{error.serviceType ? error.serviceType : ""}</span>
                                </>
                                :
                                <p>{inquiryDataDetails.serviceType}</p>
                        }
                    </div>
                </div>
                {
                    inquiryDataDetails.serviceType &&
                    <div className="col-md-3 new-customer" >
                        <div className="form-group ">
                            <label htmlFor="serviceCategory" className="col-form-label">Service Category</label>
                            <p>{inquiryDataDetails.serviceCategory}</p>
                        </div>
                    </div>
                }
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="productOrServices" className="col-form-label">Inquiry Category<span>*</span></label>
                        <select id="productOrServices" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.productOrServices} className={`form-control ${(error.productOrServices ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Inquiry Category</option>
                            {
                                productOrServicesLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.productOrServices ? error.productOrServices : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inquiryAbout" className="col-form-label">Inquiry About<span>*</span></label>
                        <select id="inquiryAbout" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.inquiryAbout} className={`form-control ${(error.inquiryAbout ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Inquiry</option>
                            {
                                lookupInquiryAbout.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>

                        <span className="errormsg">{error.inquiryAbout ? error.inquiryAbout : ""}</span>
                    </div>
                </div>
                <div className="col-md-3 new-customer" >
                    <div className="form-group ">
                        <label htmlFor="userLocation" className="col-form-label">Ticket Location</label>
                        <p>{inquiryDataDetails?.ticketUserLocationDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="ticketChannel" className="col-form-label">Ticket channel<span>*</span></label>
                        <select id="ticketChannel" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.ticketChannel} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Ticket Channel</option>
                            {
                                lookupTicketchannel.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.ticketChannel ? error.ticketChannel : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="ticketSource" className="col-form-label">Ticket Source<span>*</span></label>
                        <select id="ticketSource" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.ticketSource} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Ticket Source</option>
                            {
                                lookupTicketSource.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.ticketSource ? error.ticketSource : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="ticketPriority" className="col-form-label">Ticket Priority<span>*</span></label>
                        <select id="ticketPriority" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.ticketPriority} className={`form-control ${(error.ticketPriority ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Ticket Priority</option>
                            {
                                lookupTicketPriority.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.ticketPriority ? error.ticketPriority : ""}</span>
                    </div>
                </div>
                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="problemCause" className="col-form-label">Problem Cause<span>*</span></label>
                        <select id="problemCause" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={inquiryDataDetails.problemCause} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                            onChange={handleInquiryDetailsOnChange}>
                            <option value="">Choose Problem Cause</option>
                            {
                                lookupCause.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.problemCause ? error.problemCause : ""}</span>
                    </div>
                </div> */}
            </div>

            <div className="form-row">
                <div className="form-group col-12">
                    <label for="remark" className="col-form-label">Remarks</label>
                    <textarea id="remark" name="remark" rows="4"
                        maxLength="2500"
                        value={inquiryDataDetails.remark} className={`form-control ${(error.remark ? "input-error" : "")}`} placeholder="Enter remarks"
                        onChange={handleInquiryDetailsOnChange} />
                    <span>Maximum 2500 characters </span>
                </div>
            </div>
        </form>
    )

}
export default InquiryDetailsForm;