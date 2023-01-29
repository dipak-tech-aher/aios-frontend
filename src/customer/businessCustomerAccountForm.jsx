import { useState } from "react";
import NumberFormat from 'react-number-format';
import SameAsCustomerDetailsSwitch from "react-switch";
import AccountAddressSwitch from "react-switch";
import {
    contactValidate, email, isNumeric, isStringSurname, title, isStringForename,
    isAlphaNumeric, numericSpecial
} from "../util/validateUtil";
import AccountAddressForm from "./addressForm"
import { validateNumber, handlePaste } from "../util/validateUtil";
const PersonalCustomerAccountForm = (props) => {

    let accountData = props.data.accountData
    let accountAddress = props.data.accountAddress
    let securityData = props.data.securityData
    let billOptions = props.data.billOptions

    let selectedCustomerType = props.data.selectedCustomerType

    let setAccountData = props.handler.setAccountData
    let setAccountAddress = props.handler.setAccountAddress
    let setSecurityData = props.handler.setSecurityData
    let setBillOptions = props.handler.setBillOptions
    const handleSameAsCustomerDetailsChange = props.handler.handleSameAsCustomerDetailsChange

    const idTypeLookup = props.lookups.idTypeLookup
    const contactTypeLookup = props.lookups.contactTypeLookup
    const priorityLookup = props.lookups.priorityLookup
    const accountClassLookup = props.lookups.accountClassLookup
    const accountCategoryLookup = props.lookups.accountCategoryLookup
    const baseCollectionPlanLookup = props.lookups.baseCollectionPlanLookup
    const billLanguageLookup = props.lookups.billLanguageLookup
    const billDeliveryMethodLookup = props.lookups.billDeliveryMethodLookup
    const securityQuestionLookup = props.lookups.securityQuestionLookup
    const accountCategoryForClass = props.lookups.accountCategoryForClass

    const customerTypeLookup = props.lookups.customerTypeLookup

    const districtLookup = props.lookups.districtLookup
    const kampongLookup = props.lookups.kampongLookup
    const postCodeLookup = props.lookups.postCodeLookup

    const addressElements = props.lookups.addressElements

    const addressChangeHandler = props.lookupsHandler.addressChangeHandler

    const error = props.error
    const setError = props.setError
    const detailsValidate = props.data.detailsValidate
    const setDetailsValidate = props.handler.setDetailsValidate
    const validateEmail = (object) => {
        const pattern = new RegExp("^[a-zA-Z0-9@._-]{1,100}$");
        let key = String.fromCharCode(!object.charCode ? object.which : object.charCode);
        let temp = pattern.test(key)
        if (temp === false) {
            object.preventDefault();
            return false;
        }
    }

    const handleIdNumber = (val) => {
        if (accountData.idTypeDesc !== "Passport") {
            let prefix = val.substring(0, 2)
            let postfix = val.substring(2, 8)
            return prefix + (postfix.length ? '-' + postfix : '');
        }
        else {
            return val
        }
    }

    return (
        <>
            <div className="form-row m-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Account Details</h5>
                </div>
            </div>
            <div className="form-row">
                <div className="row mt-2 ml-1 label-align">
                    <SameAsCustomerDetailsSwitch
                        onColor="#f58521"
                        offColor="#6c757d"
                        activeBoxShadow="0px 0px 1px 5px rgba(245, 133, 33, 0.7)"
                        height={20}
                        width={48}
                        className={`${(error.sameAsCustomerDetails ? "input-error" : "")}`} id="sameAsCustomerDetailsSwitch" checked={accountData.sameAsCustomerDetails}
                        onChange={(e) => {
                            handleSameAsCustomerDetailsChange(e)
                        }
                        } />
                    <label htmlFor="sameAsCustomerDetailsSwitch" className="ml-2 col-form-label mt-0 pt-0">Use Customer Details</label>
                </div>
                <span className="errormsg">{error.sameAsCustomerDetails ? error.sameAsCustomerDetails : ""}</span>
            </div>
            <div className="form-row">
            <div className="col-md-9">
                    <div className="form-group">
                        <label htmlFor="accountCompanyName" className="col-form-label">Company Name<span>*</span></label>
                        <input readOnly={accountData.sameAsCustomerDetails ? "readonly" : ""} type="text" className={`form-control ${(error.companyName ? "input-error" : "")}`} id="accountCompanyName" value={accountData.companyName} placeholder="Company Name"
                            maxLength="80"
                            onChange={e => {
                                setAccountData({ ...accountData, companyName: e.target.value });
                                setError({ ...error, companyName: "" })
                                //let result = isStringSurname(e.target.value)
                                //setDetailsValidate({ ...detailsValidate, companyName: result })
                            }} />
                        {/* <span className="errormsg">{error.companyName ? error.companyName : ""}</span> */}
                        <span className="errormsg">{error.companyName || !detailsValidate.companyName ? detailsValidate.companyName && !error.companyName ? "" : error.companyName ? error.companyName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
            </div>
            <div className="form-row">
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="email" className="col-form-label">Email<span>*</span></label>
                        <input readOnly={accountData.sameAsCustomerDetails ? "readonly" : ""} type="text" className={`form-control ${(error.email ? "input-error" : "")}`} id="email" placeholder="Email" value={accountData.email}
                            onKeyPress={(e) => { validateEmail(e) }}
                            onPaste={(e) => handlePaste(e)}
                            maxLength="100"
                            onChange={e => {
                                setAccountData({ ...accountData, email: e.target.value });
                                setError({ ...error, email: '' })
                                //let result1 = email(e.target.value)
                                //setDetailsValidate({ ...detailsValidate, email: result1 })
                            }} />
                        {/* <span className="errormsg">{error.email ? error.email : ""}</span> */}
                        <span className="errormsg">{error.email || !detailsValidate.email ? detailsValidate.email && !error.email ? "" : error.email ? error.email : "Email is not in correct format" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="contactType" className="col-form-label">Contact Type<span>*</span></label>
                        <select disabled={accountData.sameAsCustomerDetails ? "disabled" : ""} id="contactType" className={`form-control ${(error.contactType ? "input-error" : "")}`} value={accountData.contactType}
                            onChange={e => {
                                setAccountData({ ...accountData, contactType: e.target.value, contactTypeDesc: e.target.options[e.target.selectedIndex].label });
                                setError({ ...error, contactType: '' })
                            }}>
                            <option key="contacttype" value="">Choose Contact Type</option>
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
                        <input readOnly={accountData.sameAsCustomerDetails ? "readonly" : ""} type="text" className={`form-control ${(error.contactNbr ? "input-error" : "")}`} id="contactNbr" placeholder="Contact Number" value={accountData.contactNbr}
                            maxLength="7"
                            onPaste={(e) => handlePaste(e)}
                            onKeyPress={(e) => { validateNumber(e) }}
                            onChange={e => {
                                setAccountData({ ...accountData, contactNbr: e.target.value });
                                setError({ ...error, contactNbr: '' })
                                //let result2 = contactValidate(e.target.value)
                                //setDetailsValidate({ ...detailsValidate, contactNbr: result2 })
                            }} />
                        {/* <span className="errormsg">{error.contactNbr ? error.contactNbr : ""}</span> */}
                        <span className="errormsg">{error.contactNbr || !detailsValidate.contactNbr ? detailsValidate.contactNbr && !error.contactNbr ? "" : error.contactNbr ? error.contactNbr : "Please enter 7 digits only" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="dob" className="col-form-label">Registered Date<span>*</span></label>
                        <input className={`form-control mr-2 ${(error.registeredDate ? "input-error" : "")}`} id="dob" type="date" value={accountData.registeredDate} name="dob"
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={e => {
                                setAccountData({ ...accountData, registeredDate: e.target.value });
                                setError({ ...error, registeredDate: '' })
                            }} />
                        <span className="errormsg">{error.registeredDate ? error.registeredDate : ""}</span>

                    </div>
                </div>
            </div>
            <div className="form-row">
                
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="registedNbr" className="col-form-label">Registered Number<span>*</span></label>
                        <input type="text" className={`form-control ${(error.registeredNbr ? "input-error" : "")}`} id="registedNbr" placeholder="Registered Number" value={accountData.registeredNbr}
                            maxLength="10"
                            onChange={e => {
                                setAccountData({ ...accountData, registeredNbr: e.target.value });
                                setError({ ...error, registeredNbr: '' })
                                //let result2 = isNumeric(e.target.value)
                                //setDetailsValidate({ ...detailsValidate, registeredNbr: result2 })
                            }} />
                        {/* <span className="errormsg">{error.registeredNbr ? error.registeredNbr : ""}</span> */}
                        <span className="errormsg">{error.registeredNbr || !detailsValidate.registeredNbr ? detailsValidate.registeredNbr && !error.registeredNbr ? "" : error.registeredNbr ? error.registeredNbr : "Please enter digits only" : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="idType" className="col-form-label">ID Type<span>*</span></label>
                        <select id="idType" className={`form-control ${(error.idType ? "input-error" : "")}`} value={accountData.idType}
                            onChange={e => { setAccountData({ ...accountData, idNbr: '', idType: e.target.value, idTypeDesc: e.target.options[e.target.selectedIndex].label }); setError({ ...error, idType: '' }) }}>
                            <option key="idtype" value="">Choose ID Type</option>
                            {
                                idTypeLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.idType ? error.idType : ""}</span>
                    </div>
                </div>
                {
                    (accountData.idType === 'PASSPORT') ?
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="idNbrPassport" className="col-form-label">ID Number<span>*</span></label>
                                <input type="text" className={`form-control ${(error.idNbr ? "input-error" : "")}`} id="idNbrPassport" placeholder="ID Number" value={accountData.idNbr}
                                    maxLength="15"
                                    onPaste={(e) => handlePaste(e)}
                                    //onKeyPress={(e) => {validateNumber(e)}}
                                    onChange={e => {
                                        setAccountData({ ...accountData, idNbr: e.target.value });
                                        setError({ ...error, idNbr: '' })
                                        //let result3 = isNumeric(e.target.value)
                                        //setDetailsValidate({ ...detailsValidate, idNumber: result3 })
                                    }} />
                                {/* <span className="errormsg">{error.v ? error.idNbr : ""}</span> */}
                                <span className="errormsg">{error.idNbr || !detailsValidate.idNumber ? detailsValidate.idNumber && !error.idNbr ? "" : error.idNbr ? error.idNbr : "Please enter digits only" : ""}</span>
                            </div>
                        </div>
                        :
                        <div className="col-md-3">
                            <div className="form-group">
                                <label htmlFor="idNbrIC" className="col-form-label">ID Number<span>*</span></label>
                                <NumberFormat format={handleIdNumber} className={`form-control ${(error.idNbr ? "input-error" : "")}`} id="idNbrIC" placeholder="ID Number" value={accountData.idNbr}
                                    onPaste={(e) => handlePaste(e)}
                                    onChange={e => {
                                        setAccountData({ ...accountData, idNbr: e.target.value });
                                        setError({ ...error, idNbr: '' })

                                    }} />

                                <span className="errormsg">{error.idNbr || !detailsValidate.idNumber ? detailsValidate.idNumber && !error.idNbr ? "" : error.idNbr ? error.idNbr : "Please enter digits only" : ""}</span>
                            </div>
                        </div>
                }
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="priority" className="col-form-label">Priority<span>*</span></label>
                        <select id="priority" className={`form-control ${(error.priority ? "input-error" : "")}`} value={accountData.priority}
                            onChange={e => setAccountData({ ...accountData, priority: e.target.value, priorityDesc: e.target.options[e.target.selectedIndex].label })}>
                            <option key="priority" value="">Choose Priority</option>
                            {
                                priorityLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.priority ? error.priority : ""}</span>
                    </div>
                </div>
            </div>
            <div className="form-row m-0 mt-2">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Account Contact</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="contactTitle" className="col-form-label">Title<span>*</span></label>
                        <input type="text" className={`form-control ${(error.contactTitle ? "input-error" : "")}`} id="contactTitle" placeholder="Title" value={accountData.contactTitle}
                            maxLength="20"
                            onChange={e => {
                                setAccountData({ ...accountData, contactTitle: e.target.value });
                                setError({ ...error, contactTitle: '' })

                            }} />
                        <span className="errormsg">{error.contactTitle || !detailsValidate.contactTitle ? detailsValidate.contactTitle && !error.contactTitle ? "" : error.contactTitle ? error.contactTitle : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="contactSurname" className="col-form-label">Surname<span>*</span></label>
                        <input type="text" className={`form-control ${(error.contactSurName ? "input-error" : "")}`} id="contactSurname" placeholder="Surname" value={accountData.contactSurName}
                            maxLength="80"
                            onChange={e => {
                                setAccountData({ ...accountData, contactSurName: e.target.value });
                                setError({ ...error, contactSurName: '' })

                            }} />
                        <span className="errormsg">{error.contactSurName || !detailsValidate.contactSurName ? detailsValidate.contactSurName && !error.contactSurName ? "" : error.contactSurName ? error.contactSurName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="contactForename" className="col-form-label">Forename<span>*</span></label>
                        <input type="text" className={`form-control ${(error.contactForeName ? "input-error" : "")}`} id="contactForename" placeholder="Forname" value={accountData.contactForeName}
                            maxLength="40"
                            onChange={e => {
                                setAccountData({ ...accountData, contactForeName: e.target.value });
                                setError({ ...error, contactForeName: '' })

                            }} />
                        <span className="errormsg">{error.contactForeName || !detailsValidate.contactForeName ? detailsValidate.contactForeName && !error.contactForeName ? "" : error.contactForeName ? error.contactForeName : "Please enter alphabets,special characters" : ""}</span>
                    </div>
                </div>
            </div>
            <div className="col-12 pl-2 bg-light border mt-2">
                <h5 className="text-primary">Billing Address</h5>
            </div>

            <div className="row ml-0">
                <div className="col-12">
                    <div className="row mt-2 ml-1 label-align">
                        <AccountAddressSwitch
                            onColor="#f58521"
                            offColor="#6c757d"
                            activeBoxShadow="0px 0px 1px 5px rgba(245, 133, 33, 0.7)"
                            height={20}
                            width={48}
                            className={`${(error.sameAsCustomerAddress ? "input-error" : "")}`} id="sameAsCustomerAddressSwitch" checked={accountAddress.sameAsCustomerAddress}
                            onChange={e => {
                                if(e === true)
                                {
                                    setAccountAddress({ 
                                        ...accountAddress, sameAsCustomerAddress: e,
                                        flatHouseUnitNo: '',
                                        block: '',
                                        building: '',
                                        street: '',
                                        road: '',
                                        district: '',
                                        state: '',
                                        village: '',
                                        cityTown: '',
                                        country: '',
                                        postCode: ''
                                    })
                                }
                                else
                                {
                                    setAccountAddress({...accountAddress, sameAsCustomerAddress: e})
                                }
                            }} />
                        <label htmlFor="sameAsCustomerAddressSwitch" className="col-form-label ml-2 mt-0 pt-0">Use Customer Address</label>
                    </div>
                    <span className="errormsg">{error.sameAsCustomerAddress ? error.sameAsCustomerAddress : ""}</span>
                </div>
            </div>
            {
                (accountAddress.sameAsCustomerAddress) ?
                    <></>
                    :
                    <AccountAddressForm data={accountAddress}
                        lookups={{
                            districtLookup: districtLookup,
                            kampongLookup: kampongLookup,
                            postCodeLookup: postCodeLookup,
                            addressElements: addressElements
                        }}
                        title={"billing_address"}
                        error={error}
                        setError={setError}
                        setDetailsValidate={setDetailsValidate}
                        detailsValidate={detailsValidate}
                        lookupsHandler={{
                            addressChangeHandler: addressChangeHandler
                        }}
                        handler={setAccountAddress} />
            }
            <div className="form-row m-0 mt-2">
            
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Security Question</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="profile" className="col-form-label">Profile<span>*</span></label>
                        <select id="profile" className={`form-control ${(error.securityQuestion ? "input-error" : "")}`} value={securityData.securityQuestion}
                            onChange={e => {
                                setSecurityData({ ...securityData, securityQuestion: e.target.value, securityQuestionDesc: e.target.options[e.target.selectedIndex].label });
                                setError({ ...error, securityQuestion: '' })
                            }}>
                            <option key="secq" value="">Select Security Question</option>
                            {
                                securityQuestionLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.securityQuestion ? error.securityQuestion : ""}</span>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="profileValue" className="col-form-label">Profile Value<span>*</span></label>
                        <input type="text" className={`form-control ${(error.securityAnswer ? "input-error" : "")}`} id="profileValue" placeholder="Profile Value" value={securityData.securityAnswer}
                            maxLength="50"
                            onChange={e => {
                                setSecurityData({ ...securityData, securityAnswer: e.target.value });
                                setError({ ...error, securityAnswer: '' })

                            }} />
                        <span className="errormsg">{error.securityAnswer || !detailsValidate.profileValue ? detailsValidate.profileValue && !error.securityAnswer ? "" : error.securityAnswer ? error.securityAnswer : "Length more than 50 not allowed" : ""}</span>
                    </div>
                </div>
            </div>
            <div className="form-row m-0">
                <div className="col-12 pl-2 bg-light border top-sp btm-sp">
                    <h5 className="text-primary">Account Property</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="accountClass" className="col-form-label">Account Class<span>*</span></label>
                        <select id="accountClass" className={`form-control ${(error.class ? "input-error" : "")}`} value={accountData.class}
                            onChange={e => {
                                setError({ ...error, class: '' })
                                accountCategoryForClass.current.length = 0
                                for (let cls of accountClassLookup) {
                                    if (cls.code === e.target.value) {
                                        for (let clsCtg of cls.mapping.account_category) {
                                            for (let ctg of accountCategoryLookup) {
                                                if (clsCtg === ctg.code) {
                                                    accountCategoryForClass.current.push(ctg)
                                                }
                                            }
                                        }
                                        break
                                    }
                                }
                                setAccountData({
                                    ...accountData,
                                    class: e.target.value, classDesc: e.target.options[e.target.selectedIndex].label,
                                    category: '', categoryDesc: ''
                                })
                            }
                            }
                        >
                            <option key="accountclass" value="">Select Class</option>
                            {
                                accountClassLookup.map((e) => {
                                    return (
                                        customerTypeLookup.map((c) => {
                                            return (
                                                (c.code === selectedCustomerType) ?
                                                    (c && c.mapping && c.mapping.account_class && c.mapping.account_class.length > 0 && c.mapping.account_class.includes(e.code)) ?
                                                        <option key={e.code} value={e.code}>{e.description}</option>
                                                        :
                                                        <></>
                                                    :
                                                    <></>
                                            )
                                        })
                                    )
                                })
                            }
                        </select>
                        <span className="errormsg">{error.class ? error.class : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="category" className="col-form-label">Account Category<span>*</span></label>
                        <select id="category" className={`form-control ${(error.category ? "input-error" : "")}`} value={accountData.category}
                            onChange={e => { setAccountData({ ...accountData, category: e.target.value, categoryDesc: e.target.options[e.target.selectedIndex].label }); setError({ ...error, category: '' }) }}>
                            <option key="accountcategory" value="">Select Category</option>
                            {
                                accountCategoryForClass.current.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.category ? error.category : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="baseCollPlan" className="col-form-label">Base Plan Collection<span>*</span></label>
                        <select id="baseCollPlan" className={`form-control ${(error.baseCollPlan ? "input-error" : "")}`} value={accountData.baseCollPlan}
                            onChange={e => { setAccountData({ ...accountData, baseCollPlan: e.target.value, baseCollPlanDesc: e.target.options[e.target.selectedIndex].label }); setError({ ...error, baseCollPlan: '' }) }}>
                            <option key="accountcategory" value="">Select Category</option>
                            {
                                baseCollectionPlanLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.baseCollPlan ? error.baseCollPlan : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="billLang"
                            className="col-form-label">Bill Language<span>*</span></label>
                        <select id="billLang" className={`form-control ${(error.billLanguage ? "input-error" : "")}`} value={billOptions.billLanguage}
                            onChange={e => {
                                setBillOptions({ ...billOptions, billLanguage: e.target.value, billLanguageDesc: e.target.options[e.target.selectedIndex].label });
                                setError({ ...error, billLanguage: '' })
                            }}>
                            <option key="billlang" value="">Select Bill Language</option>
                            {
                                billLanguageLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.billLanguage ? error.billLanguage : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="billDeliveryMethod" className="col-form-label">Bill Notification<span>*</span></label>
                        <select id="billDeliveryMethod"
                            className={`form-control ${(error.billDeliveryMethod ? "input-error" : "")}`}
                            value={billOptions.billDeliveryMethod}
                            onChange={e => {
                                setBillOptions({ ...billOptions, billDeliveryMethod: e.target.value, billDeliveryMethodDesc: e.target.options[e.target.selectedIndex].label });
                                setError({ ...error, billDeliveryMethod: '' })
                            }}>
                            <option key="billdely" value="">Select Bill Delivery Method</option>
                            {
                                billDeliveryMethodLookup.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.billDeliveryMethod ? error.billDeliveryMethod : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="copies" className="col-form-label">No of Copies<span>*</span></label>
                        <input type="text" className={`form-control ${(error.noOfCopies ? "input-error" : "")}`} id="copies" placeholder="No of Copies" defaultValue={1} value={billOptions.noOfCopies}
                            maxLength="2"
                            onPaste={(e) => handlePaste(e)}
                            onKeyPress={(e) => { validateNumber(e) }}
                            onChange={e => {
                                validateNumber(e)
                                setBillOptions({ ...billOptions, noOfCopies: e.target.value });
                                setError({ ...error, noOfCopies: '' })

                            }} />
                        <span className="errormsg">{error.noOfCopies || !detailsValidate.copiesCount ? detailsValidate.copiesCount && !error.noOfCopies ? "" : error.noOfCopies ? error.noOfCopies : "Please enter only numeric data" : ""}</span>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PersonalCustomerAccountForm;