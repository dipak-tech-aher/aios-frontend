import CustomerAddressForm from './addressForm';
import { useTranslation } from "react-i18next";
import { contactValidate, email, isStringForename, isStringSurname, title } from '../util/validateUtil';
import { useState } from 'react';
import NumberFormat from 'react-number-format';
import { validateNumber,handlePaste} from "../util/validateUtil";
const PersonalCustomerDetailsForm = (props) => {

    const maxLength = (object,name) => {
        if(name === "title")
        {
            if (object.target.value.length > 20) 
            {
                object.target.value = object.target.value.slice(0, 20)
            }
        }
        if(name === "surName")
        {
            if (object.target.value.length > 40) 
            {
                object.target.value = object.target.value.slice(0, 40)
            }
        }
        if(name === "foreName")
        {
            if (object.target.value.length > 30) 
            {
                object.target.value = object.target.value.slice(0, 30)
            }
        }
        if(name === "email")
        {
            if (object.target.value.length > 100) 
            {
                object.target.value = object.target.value.slice(0, 100)
            }
        }
        if(name === "contactNbr")
        {
            if (object.target.value.length > 7) 
            {
                object.target.value = object.target.value.slice(0, 7)
            }
        }
        
    }
    const validateEmail = (object) => {
        const pattern = new RegExp("^[a-zA-Z0-9@._-]{1,100}$");
        let key = String.fromCharCode(!object.charCode ? object.which : object.charCode);
        let temp = pattern.test(key)
        if (temp === false) {
            object.preventDefault();
            return false;
        }
    }

    const { t } = useTranslation();
    const detailsValidate = props.data.detailsValidate
    const personalDetailsData = props.data.personalDetailsData
    const personalAccountData = props.data.personalAccountData
    const customerAddress = props.data.customerAddress

    const setPersonalDetailsData = props.stateHandler.setPersonalDetailsData
    const setPersonalAccountData = props.stateHandler.setPersonalAccountData
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
    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Details</h5>
                </div>
            </div>
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="customerTitle" className="col-form-label">Title<span>*</span></label>
                        <input type="text" className={`form-control ${(error.title ? "input-error" : "")}`} value={personalDetailsData.title} id="customerTitle" placeholder="Title"
                            maxLength="20"
                            onChange={(e) => {
                                setError({ ...error, title: '' })
                                
                                setPersonalDetailsData({ ...personalDetailsData, title: e.target.value })
                                let data
                                if (personalAccountData.sameAsCustomerDetails) {
                                    data = { ...personalAccountData, title: e.target.value }
                                }
                                if (personalAccountData.contactSameAsCustomerDetails) {
                                    data = { ...personalAccountData, contactTitle: e.target.value }
                                }
                                if (personalAccountData.sameAsCustomerDetails || personalAccountData.contactSameAsCustomerDetails) {
                                    setPersonalAccountData(data)
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.title || !detailsValidate.title ? detailsValidate.title && !error.title ? "" : error.title ? error.title : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Surname<span>*</span></label>
                        <input type="text" className={`form-control ${(error.title ? "input-error" : "")}`} value={personalDetailsData.surName} id="Surname" placeholder="Surname"
                           maxLength="80"
                            onChange={(e) => {
                                setError({ ...error, surName: '' })
                             
                                setPersonalDetailsData({ ...personalDetailsData, surName: e.target.value })
                                let data
                                if (personalAccountData.sameAsCustomerDetails) {
                                    data = { ...personalAccountData, surName: e.target.value }
                                }
                                if (personalAccountData.contactSameAsCustomerDetails) {
                                    data = { ...personalAccountData, contactSurName: e.target.value }
                                }
                                if (personalAccountData.sameAsCustomerDetails || personalAccountData.contactSameAsCustomerDetails) {
                                    setPersonalAccountData(data)
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.surName || !detailsValidate.surName ? detailsValidate.surName && !error.surName ? "" : error.surName ? error.surName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Forename" className="col-form-label">Forename<span>*</span></label>
                        <input type="text" className={`form-control ${(error.title ? "input-error" : "")}`} value={personalDetailsData.foreName} id="Forename" placeholder="Forename"
                            maxLength="40"
                            onChange={(e) => {
                                setError({ ...error, foreName: '' })
                                
                                setPersonalDetailsData({ ...personalDetailsData, foreName: e.target.value })
                                let data
                                if (personalAccountData.sameAsCustomerDetails) {
                                    data = { ...personalAccountData, foreName: e.target.value }
                                }
                                if (personalAccountData.contactSameAsCustomerDetails) {
                                    data = { ...personalAccountData, contactForeName: e.target.value }
                                }
                                if (personalAccountData.sameAsCustomerDetails || personalAccountData.contactSameAsCustomerDetails) {
                                    setPersonalAccountData(data)
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.foreName || !detailsValidate.foreName ? detailsValidate.foreName && !error.foreName ? "" : error.foreName ? error.foreName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="email" className="col-form-label">Email<span>*</span></label>
                        <input type="text" value={personalDetailsData.email} className={`form-control ${(error.email ? "input-error" : "")}`} id="email" placeholder="Email"
                            maxLength="100"
                            onKeyPress={(e) => {validateEmail(e)}}
                            onPaste={(e) => handlePaste(e)}
                            onChange={(e) => {
                                setError({ ...error, email: '' })
                            
                                setPersonalDetailsData({ ...personalDetailsData, email: e.target.value })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, email: e.target.value })
                                }
                            }
                            }
                        />
                        <span className="errormsg">{error.email || !detailsValidate.email ? detailsValidate.email && !error.email ? "" : error.email ? error.email : "Email is not in correct format" : ""}</span>
                    </div>
                </div>
            </div>
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactType" className="col-form-label">Contact Type<span>*</span></label>
                        <select id="contactType" value={personalDetailsData.contactType} className={`form-control ${(error.contactType ? "input-error" : "")}`}
                            onChange={(e) => {
                                setError({ ...error, contactType: '' })
                                setPersonalDetailsData({ ...personalDetailsData, contactType: e.target.value, contactTypeDesc: e.target.options[e.target.selectedIndex].label })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, contactType: e.target.value, contactTypeDesc: e.target.options[e.target.selectedIndex].label })
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
                        <span className="errormsg">{error.contactType ? error.contactType : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactNbr" className="col-form-label">Contact Number<span>*</span></label>
                        <input type="text" value={personalDetailsData.contactNbr} className={`form-control ${(error.contactNbr ? "input-error" : "")}`} id="contactNbr" placeholder="Contact Number"
                           maxLength="7"
                           onPaste={(e) => handlePaste(e)}
                           onKeyPress={(e) => {validateNumber(e)}} 
                           onChange={(e) => {
                                setError({ ...error, contactNbr: '' })
                             
                                setPersonalDetailsData({ ...personalDetailsData, contactNbr: e.target.value })
                                if (personalAccountData.sameAsCustomerDetails) {
                                    setPersonalAccountData({ ...personalAccountData, contactNbr: e.target.value })
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
                handler={setCustomerAddress}
                setDetailsValidate={setDetailsValidate}
                detailsValidate={detailsValidate}
            />

            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Property</h5>
                </div>
            </div>
            <div className="form-row pl-2">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="category" className="col-form-label">Customer Category<span>*</span></label>
                        <select id="category" value={personalDetailsData.category} className={`form-control ${(error.category ? "input-error" : "")}`}
                            onChange={e => {
                                setError({ ...error, category: '' })
                                setPersonalDetailsData({ ...personalDetailsData, category: e.target.value, categoryDesc: e.target.options[e.target.selectedIndex].label })
                            }
                            }>
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
                        <select id="class" value={personalDetailsData.class} className={`form-control ${(error.class ? "input-error" : "")}`}
                            onChange={e => { setPersonalDetailsData({ ...personalDetailsData, class: e.target.value, classDesc: e.target.options[e.target.selectedIndex].label }); setError({ ...error, class: '' }) }}>
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
export default PersonalCustomerDetailsForm;