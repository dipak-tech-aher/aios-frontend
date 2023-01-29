import { useState } from "react";
import { useTranslation } from "react-i18next";
import BarUBarPopup from "../customer360/barUnbarPopup";

const NewCustomerEnquiryPreview = (props) => {

    const { t } = useTranslation();
    const [showBar, setShowBarpopup] = useState(false)

    const personalInquireData = props.data.personalInquireData
    const inquiryDataDetails = props.data.inquiryDataDetails
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
                        <label htmlFor="inputName" className="col-form-label">Customer Name</label>
                        <p>{personalInquireData.customerName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Category</label>
                        <p>{personalInquireData.customerCategoryDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Number</label>
                        <p>{personalInquireData.contactNbr}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Email ID</label>
                        <p>{personalInquireData.email}</p>
                    </div>
                </div>


                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Preference</label>
                        <p>{personalInquireData.contactPreferenceDesc}</p>
                    </div>
                </div>

            </div>

        </div>
    )
}
export default NewCustomerEnquiryPreview;