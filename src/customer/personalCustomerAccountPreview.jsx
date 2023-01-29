import { formatISODateDDMMMYY, formatISODDMMMYY } from '../util/dateUtil'
import AccountAddressPreview from './addressPreview'

const PersonalCustomerAccountPreview = (props) => {

    const accountData = props.data.accountData
    const accountAddress = props.data.accountAddress
    const securityData = props.data.securityData
    const billOptions = props.data.billOptions

    return (
        <>
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Account Details</h5>
                </div>
            </div>

            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Tilte</label>
                        <p>{accountData.title}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Surname</label>
                        <p>{accountData.surName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Forename</label>
                        <p>{accountData.foreName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Gender</label>
                        <p>{(accountData.gender === 'M') ? 'Male' : 'Female'}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Date of Birth</label>
                        <p>{formatISODDMMMYY(accountData.dob)}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">ID Type</label>
                        <p>{accountData.idTypeDesc}</p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">ID Number</label>
                        <p>{accountData.idNbr}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Email</label>
                        <p>{accountData.email}</p>
                    </div>
                </div>
                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Type</label>
                        <p>{accountData.contactTypeDesc}</p>
                    </div>
                </div> */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">{accountData.contactTypeDesc}</label>
                        <p>{accountData.contactNbr}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Priority</label>
                        <p>{accountData.priorityDesc}</p>
                    </div>
                </div>
            </div>
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Account Contact</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Title</label>
                        <p>{accountData.contactTitle}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Surname</label>
                        <p>{accountData.contactSurName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Forename</label>
                        <p>{accountData.contactForeName}</p>
                    </div>
                </div>
            </div>
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Billing Address</h5>
                </div>
            </div>
            {
                (accountAddress.sameAsCustomerAddress) ?
                    <h5>Same as Customer Address</h5>
                    :
                    <AccountAddressPreview data={{
                        title: "billing_address",
                        addressData: accountAddress
                    }}
                    />
            }
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Security Question</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="col-form-label">Profile</label>
                        <p>{securityData.securityQuestionDesc}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label className="col-form-label">Profile Value</label>
                        <p>{securityData.securityAnswer}</p>
                    </div>
                </div>
            </div>
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Account Property</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Account Class</label>
                        <p>{accountData.classDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Account Category</label>
                        <p>{accountData.categoryDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Base Collection Plan</label>
                        <p>{accountData.baseCollPlanDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bill Language</label>
                        <p>{billOptions.billLanguageDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bill Notification</label>
                        <p>{billOptions.billDeliveryMethodDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">No of Copies</label>
                        <p>{billOptions.noOfCopies}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PersonalCustomerAccountPreview;