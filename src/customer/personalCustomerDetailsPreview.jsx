import { useTranslation } from "react-i18next";
import CustomerAddressPreview from './addressPreview';

const PersonalCustomerDetailsPreview = (props) => {

    const { t } = useTranslation();

    const customerDetails = props.data.personalDetailsData
    const customerAddress = props.data.customerAddress
    const customerType = props.custType

    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Details</h5>
                </div>
            </div>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Title</label>
                        <p>{customerDetails.title}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Surname</label>
                        <p>{customerDetails.surName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Forename</label>
                        <p>{customerDetails.foreName}</p>
                    </div>
                </div>
                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Customer Type</label>
                        <p>{(customerType === 'BUSINESS') ? t("business") : t("residential")}</p>
                    </div>
                </div> */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Email</label>
                        <p>{customerDetails.email}</p>
                    </div>
                </div>
                {/* <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Contact Type</label>
                        <p>{customerDetails.contactTypeDesc}</p>
                    </div>
                </div> */}
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">{customerDetails.contactTypeDesc}</label>
                        <p>{customerDetails.contactNbr}</p>
                    </div>
                </div>
            </div>

            <CustomerAddressPreview
                data={{
                    title: "customer_address",
                    addressData: customerAddress
                }}
            />
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Customer Property</h5>
                </div>
            </div>
            <div className="form-row col-12 pl-2">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Customer Category</label>
                        <p>{customerDetails.categoryDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Customer Class</label>
                        <p>{customerDetails.classDesc}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default PersonalCustomerDetailsPreview;