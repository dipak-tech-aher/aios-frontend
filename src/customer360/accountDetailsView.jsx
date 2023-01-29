import { formatISODateDDMMMYY, formatISODDMMMYY } from '../util/dateUtil'
import AccountAddressView from '../customer/addressPreview'
import React from 'react';
//import { formatISODateDDMMMYY } from '../util/dateUtil';
//import AccountAddressView from '../customer/addressPreview';
import Modal from 'react-modal';

const AccountDetailsView = (props) => {

    const customerType = props.data.customerType
    const accountData = props.data.accountData
    const accountRealtimeDetails = props.data.accountRealtimeDetails
    const billingAddress = accountData.billingAddress[0]
    const securityData = accountData.securityData
    const billOptions = accountData.billOptions

    const openBillHistoryModal = props.data.openBillHistoryModal;
    const setOpenBillHistoryModal = props.data.setOpenBillHistoryModal;


    return (
        <>
            <div className="col-12 pl-2 bg-light border">
                <h5 className="text-primary">Account Details</h5>
            </div>
            <div className="row">
                {
                    (customerType === 'RESIDENTIAL') ?
                        <div className="col-md-10">
                            <div className="form-group">
                                <label htmlFor="accountName" className="col-form-label">Account Name</label>
                                <p>{accountData.title + " " + accountData.foreName + " " + accountData.surName}</p>
                            </div>
                        </div>
                        :
                        <></>
                }
                {
                    (customerType === 'BUSINESS') ?
                        <div className="col-md-10">
                            <div className="form-group">
                                <label htmlFor="companyName" className="col-form-label">Company Name</label>
                                <p>{accountData.companyName}</p>
                            </div>
                        </div>
                        :
                        <></>
                }
                <div className="col-md-2 pl-3 pt-2 bold">Status<span className="ml-1 badge badge-outline-success font-17">{accountData.status}</span></div>
                {
                    (customerType === 'RESIDENTIAL') ?
                        <>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="dob" className="col-form-label">Date of Birth</label>
                                    <p>{formatISODDMMMYY(accountData.dob)}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="gender" className="col-form-label">Gender</label>
                                    <p>{(accountData.gender === 'M') ? 'Male' : 'Female'}</p>
                                </div>
                            </div>
                        </>
                        :
                        <></>
                }
                {
                    (customerType === 'BUSINESS') ?
                        <>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="registeredNo" className="col-form-label">Registered Number</label>
                                    <p>{accountData.registeredNbr}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="registeredDate" className="col-form-label">Registered Date</label>
                                    <p>{formatISODDMMMYY(accountData.registeredDate)}</p>
                                    {/* <p>{formatISODateDDMMMYY(accountData.registeredDate)}</p> */}
                                </div>
                            </div>
                            {/* <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="idTypeDesc" className="col-form-label">ID Type</label>
                                    <p>{accountData.idTypeDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="idNbr" className="col-form-label">ID Number</label>
                                    <p>{accountData.idNbr}</p>
                                </div>
                            </div> */}
                        </>
                        :
                        <></>
                }
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="idTypeDesc" className="col-form-label">ID Type</label>
                        <p>{accountData.idTypeDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="idNbr" className="col-form-label">ID Number</label>
                        <p>{accountData.idNbr}</p>
                    </div>
                </div>
                {
                    /*(accountRealtimeDetails.outstanding !== undefined) ?*/
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="outstanding" className="col-form-label">Outstanding</label>
                            {
                                (accountRealtimeDetails.accountBalance !== undefined && !isNaN(accountRealtimeDetails.accountBalance)) ?
                                    (accountRealtimeDetails.accountBalance > 0) ?
                                        <p className="p-0 text-danger">
                                            <font className="bolder font-20">${Number(accountRealtimeDetails.accountBalance).toFixed(2)}</font>
                                        </p>
                                        :
                                        <p className="p-0 text-success">
                                            <font className="bolder font-20">${Number(accountRealtimeDetails.accountBalance).toFixed(2)}</font>
                                        </p>
                                    :
                                    <></>
                            }

                        </div>
                    </div>
                    /*    :
                        <></>*/
                }
                {
                    /*(accountRealtimeDetails.lastPayment !== undefined) ?*/
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="lastPayment" className="col-form-label">Last Payment</label>
                            <p>{(accountRealtimeDetails.lastPayment !== undefined) ? `$${Number(accountRealtimeDetails.lastPayment).toFixed(2)}` : ''}</p>
                        </div>
                    </div>
                    /*    :
                        <></>*/
                }
                {
                    /*(accountRealtimeDetails.lastPaymentDate) ?*/
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="lastPaymentDate" className="col-form-label">Last Payment Date</label>
                            <p>{(accountRealtimeDetails.lastPaymentDate) ? formatISODDMMMYY(accountRealtimeDetails.lastPaymentDate) : ''}</p>
                        </div>
                        {/* <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="lastPaymentDate" className="col-form-label">Last Payment Date</label>
                            <p>{(accountRealtimeDetails.lastPaymentDate) ? formatISODateDDMMMYY(accountRealtimeDetails.lastPaymentDate) : ''}</p>
                        </div> */}
                    </div>
                    /*:
                    <></>*/
                }
                {
                    /*(accountRealtimeDetails.accountCreationDate) ?*/
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="accountCreationDate" className="col-form-label">Account Creation Date</label>
                            <p>{(accountRealtimeDetails.accountCreationDate) ? formatISODDMMMYY(accountRealtimeDetails.accountCreationDate) : ''}</p>
                        </div>

                        {/* <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="accountCreationDate" className="col-form-label">Account Creation Date</label>
                            <p>{(accountRealtimeDetails.accountCreationDate) ? formatISODateDDMMMYY(accountRealtimeDetails.accountCreationDate) : ''}</p>
                        </div> */}
                    </div>

                }
                {
                    (accountRealtimeDetails.serviceType === 'Postpaid' || accountRealtimeDetails.serviceType === 'Fixed') ?
                        <>
                            <div className="d-flex col-12 pl-2 bg-light border justify-content-between">
                                <h5 className="text-primary">Billing Summary</h5>
                                <div className="mt-1">
                                    {
                                        accountRealtimeDetails.billingDetails && !!accountRealtimeDetails.billingDetails.length &&
                                        <button className="btn btn-primary btn-sm" onClick={() => setOpenBillHistoryModal(true)}>Bill History</button>
                                    }
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billUid" className="col-form-label">Bill Uid</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].billUid}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billDate" className="col-form-label">Bill Date</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].billDate ? formatISODDMMMYY(accountRealtimeDetails.billingDetails[0].billDate) : ''}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billAmount" className="col-form-label">Bill Amount</label>
                                    <p>${accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && !isNaN(accountRealtimeDetails.billingDetails[0].billAmount) && Number(accountRealtimeDetails.billingDetails[0].billAmount).toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billDueDate" className="col-form-label">Bill Due Date</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].dueDate ? formatISODDMMMYY(accountRealtimeDetails.billingDetails[0].dueDate) : ''}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billStatus" className="col-form-label">Bill Payment Status</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].billStatus}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billPaidAmount" className="col-form-label">Bill Paid Amount</label>
                                    <p>${accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && !isNaN(accountRealtimeDetails.billingDetails[0].paidAmount) ? Number(accountRealtimeDetails.billingDetails[0].paidAmount).toFixed(2) : ''}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billPaidDate" className="col-form-label">Bill Paid Date</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].paidDate ? formatISODDMMMYY(accountRealtimeDetails.billingDetails[0].paidDate) : ''}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="billMonth" className="col-form-label">Bill Month</label>
                                    <p>{accountRealtimeDetails.billingDetails && accountRealtimeDetails.billingDetails[0] && accountRealtimeDetails.billingDetails[0].billMonth}</p>
                                </div>
                            </div>
                        </>
                        :
                        <></>
                }
            </div>

            {
                (accountData && accountData.billingAddress && accountData.billingAddress.length > 0) ?
                    <div className="col-12 pt-1">
                        <AccountAddressView
                            data={{
                                title: "billing_address",
                                addressData: billingAddress
                            }}
                        />

                    </div>
                    :
                    <></>
            }
            <div className="col-12 pl-2 bg-light border">
                <h5 className="text-primary">Contact Details</h5>
            </div>
            <div className="row pt-1">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="contactTitle" className="col-form-label">Contact Person Name</label>
                        <p>{accountData.contactTitle + " " + accountData.contactForeName + " " + accountData.contactSurName}</p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="email" className="col-form-label">Contact Email</label>
                        <p>{accountData.email}</p>
                    </div>
                </div>
                {/*
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="contactTypeDesc" className="col-form-label">Contact Type</label>
                                            <p>{accountData.contactTypeDesc}</p>
                                        </div>
                                    </div>
                                    */}
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="contactNbr" className="col-form-label">{accountData.contactTypeDesc}</label>
                        <p>{accountData.contactNbr}</p>
                    </div>
                </div>
            </div>


            <div className="col-12 pl-2 bg-light border mt-2">
                <h5 className="text-primary">Account Property</h5>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="categoryDesc" className="col-form-label">Account Category</label>
                        <p>{accountData.categoryDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="classDesc" className="col-form-label">Account Class</label>
                        <p>{accountData.classDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="baseCollPlanDesc" className="col-form-label">Base Plan Collection</label>
                        <p>{accountData.baseCollPlanDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="noOfCopies" className="col-form-label">No of Copies</label>
                        <p>{billOptions.noOfCopies}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="billLanguageDesc" className="col-form-label">Bill Language</label>
                        <p>{billOptions.billLanguageDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="billDeliveryMethodDesc" className="col-form-label">Bill Notification</label>
                        <p>{billOptions.billDeliveryMethodDesc}</p>
                    </div>
                </div>
                {
                    /*(accountRealtimeDetails.billCycle) ?*/
                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="billCycle" className="col-form-label">Bill Cycle</label>
                            <p>{(accountRealtimeDetails.billCycle) ? accountRealtimeDetails.billCycle : ''}</p>
                        </div>
                    </div>
                    /*    :
                        <></>*/
                }
                {/*
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label htmlFor="inputState" className="col-form-label">Priority</label>
                                        <p>{accountData.priorityDesc}</p>
                                    </div>
                                </div>
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
                                */}
            </div>
            <Modal isOpen={openBillHistoryModal} contentLabel="Bill History Modal">
                <div className="modal-content">
                    <div className="modal-header page-title-box">
                        <h5 className="modal-title pl-2">Bill History</h5>
                        <button type="button" className="close" onClick={() => { setOpenBillHistoryModal(false); }}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body overflow-auto">
                        <table id="bill-history" className="table table-striped dt-responsive nowrap w-100 border mb-0">
                            <thead>
                                <tr>
                                    <th>Bill Uid</th>
                                    <th>Bill Date</th>
                                    <th>Bill Amount</th>
                                    <th>Bill Due Date</th>
                                    <th>Bill Payment Status</th>
                                    <th>Bill Paid Amount</th>
                                    <th>Bill Paid Date</th>
                                    <th>Month</th>
                                    <th>Unpaid Amount</th>
                                    <th>Dispute Amount</th>
                                    <th>Refund Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    accountRealtimeDetails.billingDetails && !!accountRealtimeDetails.billingDetails.length &&
                                    accountRealtimeDetails.billingDetails.map((bill, index) => (
                                        <tr key={index}>
                                            <td>{bill.billUid}</td>
                                            <td>{formatISODateDDMMMYY(bill.billDate)}</td>
                                            <td>{!isNaN(bill.billAmount) ? Number(bill.billAmount).toFixed(2) : ''}</td>
                                            <td>{formatISODateDDMMMYY(bill.dueDate)}</td>
                                            <td>{bill.billStatus} </td>
                                            <td>{!isNaN(bill.paidAmount) ? Number(bill.paidAmount).toFixed(2) : ''}</td>
                                            <td>{formatISODateDDMMMYY(bill.paidDate)}</td>
                                            <td>{bill.billMonth}</td>
                                            <td>{!isNaN(bill.unpaidAmount) ? Number(bill.unpaidAmount).toFixed(2) : ''}</td>
                                            <td>{!isNaN(bill.disputeAmount) ? Number(bill.disputeAmount).toFixed(2) : ''}</td>
                                            <td>{!isNaN(bill.refundAmount) ? Number(bill.refundAmount).toFixed(2) : ''}</td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default AccountDetailsView;