import { useTranslation } from "react-i18next";

const NewCustomerInquiryDetailsForm = (props) => {

    const { t } = useTranslation();
    const viewMode = props.viewMode;

    let personalDetailsData = props.data.personalDetailsData
    let personalAccountData = props.data.personalAccountData

    let setPersonalDetailsData = props.stateHandler.setPersonalDetailsData
    let setPersonalAccountData = props.stateHandler.setPersonalAccountData

    const categoryLookup = props.lookups.categoryLookup
    const classLookup = props.lookups.classLookup
    const contactTypeLookup = props.lookups.contactTypeLookup

    const serviceTypeLookup = [
        { code: 'Postpaid', description: 'Postpaid' },
        { code: 'Prepaid', description: 'Prepaid' },
        { code: 'Fixed', description: 'Fixed' },
        { code: 'Fixed Broadband', description: 'Fixed Broadband' },
        { code: 'Booster', description: 'Booster' }
    ]

    const error = props.error

    return (
        <form>
            <div className="form-row">
                <h5>{t("customer_details")}</h5>
            </div>
            <div className="form-row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="customerTitle" className="col-form-label">Customer Name<span>*</span></label>
                        <input type="text" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} className={`form-control ${(error.customerName ? "input-error" : "")}`} value={personalDetailsData.customerName} id="customerTitle" placeholder="Customer Name"
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, customerName: e.target.value })
                                // if (personalAccountData.sameAsCustomerDetails) {
                                //     setPersonalAccountData({ ...personalAccountData, title: e.target.value })
                                // }
                            }
                            }
                        />
                        <span className="errormsg">{error.customerName ? error.customerName : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="category" className="col-form-label">Category<span>*</span></label>
                        <select id="category" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={personalDetailsData.customerCategory} className={`form-control ${(error.customerCategory ? "input-error" : "")}`}
                            onChange={e => {
                                setPersonalDetailsData({ ...personalDetailsData, customerCategory: e.target.value, customerCategoryDesc: e.target.options[e.target.selectedIndex].label })
                            }
                            }>
                            <option value="">Choose Category</option>
                            {
                                categoryLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.customerCategory ? error.customerCategory : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Contact Number<span>*</span></label>
                        <input type="text" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} className={`form-control ${(error.contactNbr ? "input-error" : "")}`} value={personalDetailsData.contactNbr} id="contacyNbr" placeholder="Contact Number"
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, contactNbr: e.target.value })
                                // if (personalAccountData.sameAsCustomerDetails) {
                                //     setPersonalAccountData({ ...personalAccountData, contacyNbr: e.target.value })
                                // }
                            }
                            }
                        />
                        <span className="errormsg">{error.contactNbr ? error.contactNbr : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="email" className="col-form-label">Email<span>*</span></label>
                        <input type="text" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={personalDetailsData.email} className={`form-control ${(error.email ? "input-error" : "")}`} id="email" placeholder="Email"
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, email: e.target.value })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, email: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.email ? error.email : ""}</span>
                    </div>
                </div>


            </div>

            <div className="form-row">
                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="class" className="col-form-label">Service Type<span>*</span></label>
                        <select id="class" disabled={(viewMode==='Edit')?'dsabled':""} value={personalDetailsData.serviceType} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                            onChange={e => setPersonalDetailsData({ ...personalDetailsData, serviceType: e.target.value, serviceTypeDesc: e.target.options[e.target.selectedIndex].label })}>
                            <option value="">Choose Class</option>
                            {
                                classLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.serviceType ? error.serviceType : ""}</span>
                    </div>
                </div> */}

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="class" className="col-form-label">Service Type<span>*</span></label>
                        <select id="class" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={personalDetailsData.serviceType} className={`form-control ${(error.serviceType ? "input-error" : "")}`}
                            onChange={e => setPersonalDetailsData({ ...personalDetailsData, serviceType: e.target.value, serviceTypeDesc: e.target.options[e.target.selectedIndex].label })}>
                            <option value="">Choose Class</option>
                            {
                                serviceTypeLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.serviceType ? error.serviceType : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactType" className="col-form-label">Contact Preference<span>*</span></label>
                        <select id="contactType" disabled={(viewMode === 'existing_customer') ? 'disabled' : ""} value={personalDetailsData.contactPreference} className={`form-control ${(error.contactPreference ? "input-error" : "")}`}
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, contactPreference: e.target.value, contactPreferenceDesc: e.target.options[e.target.selectedIndex].label })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, contactPreference: e.target.value, contactPreferenceDesc: e.target.options[e.target.selectedIndex].label })
                                }
                            }
                            }>
                            <option value="">Choose Contact Type</option>
                            {
                                contactTypeLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.contactPreference ? error.contactPreference : ""}</span>
                    </div>
                </div>

            </div>
            <div className="form-row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Forename" className="col-form-label">Product Enquired<span>*</span></label>
                        <input type="text" className={`form-control ${(error.productEnquired ? "input-error" : "")}`} value={personalDetailsData.productEnquired} id="Forename" placeholder="Product Enquired"
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, productEnquired: e.target.value })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, foreName: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.productEnquired ? error.productEnquired : ""}</span>
                    </div>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group col-12">
                    <label for="remarks" className="col-form-label">Remark</label>
                    <textarea className="form-control" id="remarks" name="remarks" rows="4"
                        value={personalDetailsData.remark} className={`form-control ${(error.remark ? "input-error" : "")}`} id="remark" placeholder="Enter remark"
                        onChange={(e) => {
                            setPersonalDetailsData({ ...personalDetailsData, remark: e.target.value })
                            if (personalAccountData.sameAsCustomerDetails) {
                                setPersonalAccountData({ ...personalAccountData, remark: e.target.value })
                            }
                        }
                        }
                    ></textarea>
                </div>
                <div className="col-md-12" style={{ display: 'none' }}>
                    <div className="form-group">
                        <label htmlFor="contactNbr" className="col-form-label">Remark<span>*</span></label>
                        <input type="textarea" style={{ width: '90%', height: '30%' }} value={personalDetailsData.remark} className={`form-control ${(error.remark ? "input-error" : "")}`} id="remark" placeholder="Enter remark"
                            onChange={(e) => {
                                setPersonalDetailsData({ ...personalDetailsData, remark: e.target.value })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, remark: e.target.value })
                                }
                            }
                            }

                        />
                        <span className="errormsg">{error.remark ? error.remark : ""}</span>
                    </div>
                </div>
            </div>
        </form>
    )

}
export default NewCustomerInquiryDetailsForm;