import { useTranslation } from "react-i18next";
import CustomerAddressPreview from './addressPreview';

const BusinessCustomerDetailsPreview = (props) => {

    const { t } = useTranslation();

    const customerDetails = props.data.businessDetailsData
    const customerAddress = props.data.customerAddress
    const customerType = props.custType
    const form = props.data.form
    return (
        <>
            <div className="form-row m-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">{t("customer_details")}</h5>
                </div>
            </div>
            <div className="col-12 pr-0">
                <div className="form-row">
                    <div className="col-12">
                        <div className="row">
                            <div className="col-md-9">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Company Name</label>
                                    <p>{customerDetails.companyName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {<div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Customer Type</label>
                                    <p>{(customerType === 'RESIDENTIAL') ? t("residential") : t("business")}</p>
                                </div>
                            </div>}
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Email</label>
                                    <p>{customerDetails.email}</p>
                                </div>
                            </div>
                            {
                                form && form !== null && form !== undefined && form === "customer360" ?
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">{customerDetails.contactTypeDesc}</label>
                                            <p>{customerDetails.contactNbr}</p>
                                        </div>
                                    </div>
                                    :
                                    <>
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
                                    </>
                            }
                        </div>
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
export default BusinessCustomerDetailsPreview;