import { useState } from "react";
import { useTranslation } from "react-i18next";
import BarUBarPopup from "../customer360/barUnbarPopup";

const NewCustomerBusinessInquiryPreview = (props) => {

    const { t } = useTranslation();
    const [showBar, setShowBarpopup] = useState(false)

    const customerDetails = props.data
    const customerType = props.custType

    return (
        <div className="col-md-12">
            <div className="col-12 pl-2 bg-light border">
                <h5 className="text-primary">Customer Details</h5>
            </div>

            <div className="row pt-1">
                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Customer Type</label>
                        <p>{(customerType === 'BUSINESS') ? t("business") : t("Personal")}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Company Name</label>
                        <p>{customerDetails.companyName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Category</label>
                        <p>{customerDetails.customerCategory}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Number</label>
                        <p>{customerDetails.contactNbr}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Email ID</label>
                        <p>{customerDetails.email}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Service Type</label>
                        <p>{customerDetails.serviceType}</p>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Preference</label>
                        <p>{customerDetails.contactPreference}</p>
                    </div>
                </div>

                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Service Type</label>
                        <p>{customerDetails.serviceTypeDesc}</p>
                    </div>
                </div> */}

            </div>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Product Enquired</label>
                        <p>{customerDetails.productEnquired}</p>
                    </div>
                </div>

                <div className="col-md-12">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Remark</label>
                        <p style={{ height: '120px' }}>{customerDetails.remark}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default NewCustomerBusinessInquiryPreview;