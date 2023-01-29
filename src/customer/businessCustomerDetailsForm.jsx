import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";
import { contactValidate, email, isStringSurname } from "../util/validateUtil";
import CustomerAddressForm from './addressForm';
import { validateNumber,handlePaste} from "../util/validateUtil";
const NewBusinessCustomerDetailsForm = (props) => {

    const { t } = useTranslation();

    let businessDetailsData = props.data.businessDetailsData
    let businessAccountData = props.data.businessAccountData
    const customerAddress = props.data.customerAddress
    const detailsValidate = props.data.detailsValidate
    let setBusinessDetailsData = props.stateHandler.setBusinessDetailsData
    let setBusinessAccountData = props.stateHandler.setBusinessAccountData
    const setCustomerAddress = props.stateHandler.setCustomerAddress
    const setDetailsValidate = props.stateHandler.setDetailsValidate

    const categoryLookup = props.lookups.categoryLookup
    const classLookup = props.lookups.classLookup
    const contactTypeLookup = props.lookups.contactTypeLookup

    const districtLookup = props.lookups.districtLookup
    const kampongLookup = props.lookups.kampongLookup
    const postCodeLookup = props.lookups.postCodeLookup

    const addressElements = props.lookups.addressElements

    const addressChangeHandler = props.lookupsHandler.addressChangeHandler

    const error = props.error
    const setError = props.setError
    const validateEmail = (object) => {
        const pattern = new RegExp("^[a-zA-Z0-9@._-]{1,100}$");
        let key = String.fromCharCode(!object.charCode ? object.which : object.charCode);
        let temp = pattern.test(key)
        if (temp === false) {
            object.preventDefault();
            return false;
        }
    }

    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">{t("customer_details")}<span>*</span></h5>
                </div>
            </div>
            <div className="form-row">
                <div className="col-md-9">
                    <div className="form-group">
                        <label htmlFor="companyName" className="col-form-label">{t("company_name")}<span>*</span></label>
                        <input type="text" className={`form-control ${(error.companyName ? "input-error" : "")}`} value={businessDetailsData.companyName} id="Surname" placeholder="Company Name"
                            maxLength="80"
                            onChange={(e) => {
                                setError({...error,companyName:""})
                                setBusinessDetailsData({ ...businessDetailsData, companyName: e.target.value })
                                if (businessAccountData.sameAsCustomerDetails) {
                                    setBusinessAccountData({ ...businessAccountData, companyName: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.companyName || !detailsValidate.companyName ? detailsValidate.companyName && !error.companyName ? "" : error.companyName ? error.companyName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
            </div>
            <div className="form-row">
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="email" className="col-form-label">Email<span>*</span></label>
                        <input type="text" value={businessDetailsData.email} className={`form-control ${(error.email ? "input-error" : "")}`} id="email" placeholder="Email"
                            onKeyPress={(e) => {validateEmail(e)}}
                            onPaste={(e) => handlePaste(e)}
                            maxLength="100"
                            onChange={(e) => {
                                setError({ ...error, email: '' })
                                setBusinessDetailsData({ ...businessDetailsData, email: e.target.value })
                                if (businessAccountData.sameAsCustomerDetails) {
                                    setBusinessAccountData({ ...businessAccountData, email: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.email || !detailsValidate.email ? detailsValidate.email && !error.email ? "" : error.email ? error.email : "Email is not in correct format" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactType" className="col-form-label">Contact Type<span>*</span></label>
                        <select id="contactType" value={businessDetailsData.contactType} className={`form-control ${(error.contactType ? "input-error" : "")}`}
                            onChange={(e) => {
                                setError({ ...error, contactType: '' })
                                setBusinessDetailsData({ ...businessDetailsData, contactType: e.target.value, contactTypeDesc: e.target.options[e.target.selectedIndex].label })
                                if (businessAccountData.sameAsCustomerDetails) {
                                    setBusinessAccountData({ ...businessAccountData, contactType: e.target.value, contactTypeDesc: e.target.options[e.target.selectedIndex].label })
                                }
                            }
                            }
                        >
                            <option value="">Choose Contact Type</option>
                            {
                                contactTypeLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.contactType ? error.contactType : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactNbr" className="col-form-label">Contact Number<span>*</span></label>
                        <input type="text" value={businessDetailsData.contactNbr} className={`form-control ${(error.contactNbr ? "input-error" : "")}`} id="contactNbr" placeholder="Contact Number"
                            maxLength="7"
                            onPaste={(e) => handlePaste(e)}
                            onKeyPress={(e) => {validateNumber(e)}}
                            onChange={(e) => {
                                setError({ ...error, contactNbr: '' })
                                setBusinessDetailsData({ ...businessDetailsData, contactNbr: e.target.value })
                                if (businessAccountData.sameAsCustomerDetails) {
                                    setBusinessAccountData({ ...businessAccountData, contactNbr: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.contactNbr || !detailsValidate.contactNbr ? detailsValidate.contactNbr && !error.contactNbr ? "" : error.contactNbr ? error.contactNbr : "Please enter 7 digits only" : ""}</span>
                    </div>
                </div>
            </div>

            <CustomerAddressForm
                data={customerAddress}
                lookups={{
                    districtLookup: districtLookup,
                    kampongLookup: kampongLookup,
                    postCodeLookup: postCodeLookup,
                    addressElements: addressElements
                }}
                error={error}
                setError={setError}
                lookupsHandler={{
                    addressChangeHandler: addressChangeHandler
                }}
                setDetailsValidate  = {setDetailsValidate}
                detailsValidate = {detailsValidate} 
                handler={setCustomerAddress} />

            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Property</h5>
                </div>
            </div>
            <div className="form-row pl-2">
                <div className="col-md-3">
                    <div className="form-group">
                    <label htmlFor="category" className="col-form-label">Customer Category<span>*</span></label>
                        <select id="category" value={businessDetailsData.category} className={`form-control ${(error.category ? "input-error" : "")}`}
                            onChange={(e) => setBusinessDetailsData({ ...businessDetailsData, category: e.target.value, categoryDesc: e.target.options[e.target.selectedIndex].label })}>
                            <option value="">Select Category</option>
                            {
                                categoryLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.category ? error.category : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                    <label htmlFor="class" className="col-form-label">Customer Class<span>*</span></label>
                        <select id="class" value={businessDetailsData.class} className={`form-control ${(error.class ? "input-error" : "")}`}
                            onChange={e => setBusinessDetailsData({ ...businessDetailsData, class: e.target.value, classDesc: e.target.options[e.target.selectedIndex].label })}>
                            <option value="">Select Class</option>
                            {
                                classLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.class ? error.class : ""}</span>
                    </div>
                </div>
            </div>

        </>
    )

}
export default NewBusinessCustomerDetailsForm;