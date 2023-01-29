
import { useTranslation } from "react-i18next";
import OfferCardView from "./offerCardView";

const CreateCatalogueDetailsPreview = (props) => {

    const { t } = useTranslation();
    const catalogueDetails = props.data.catalogueDetailsData
    const error = props.error
    const offerList = props.data.offerList
    const setOfferList = props.stateHandler.setOfferList
    const offerdeleteId = props.data.offerdeleteId
    const setOfferDeleteId = props.stateHandler.setOfferDeleteId
    const catalogueDropDownDesc = props.data.catalogueDropDownDesc

    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Catelogue</h5>
                </div>
            </div>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Refill Profile ID </label>
                        <p>{catalogueDetails.refillProfileID}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Tariff Code </label>
                        <p>{catalogueDetails.tariffCode}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bundle Name</label>
                        <p>{catalogueDetails.bundleName}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Commercial Pack Name</label>
                        <p>{catalogueDetails.commercialPackName}</p>
                    </div>
                </div>

            </div>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bundle Category</label>
                        <p>{catalogueDetails.bundleCategoryDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bundle Type</label>
                        <p>{catalogueDetails.bundleTypeDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">OCS Description</label>
                        <p>{catalogueDetails.oCSdescription}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Services</label>
                        <p>{catalogueDetails.serviceDesc}</p>
                    </div>
                </div>
            </div>
            <div className="row pt-12">

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Network Type</label>
                        <p>{catalogueDetails.networkTypeDesc}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">serviceClass </label>
                        <p>{catalogueDetails.serviceClass}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Validity</label>
                        <p>{catalogueDetails.validity}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Denomination</label>
                        <p className="form-control input-error">{catalogueDetails.denomination}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CreateCatalogueDetailsPreview;