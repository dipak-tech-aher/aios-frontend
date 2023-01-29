

import { useTranslation } from "react-i18next";
import CustomerAddressPreview from './addressPreview';

const CreateCatalogueDetailsPreview = (props) => {

    const { t } = useTranslation();

    const catalogueDetails = props.data.catalogueDetailsData


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
                        <p>{catalogueDetails.bundleCategory}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Bundle Type</label>
                        <p>{catalogueDetails.bundleType}</p>
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
                        <label htmlFor="inputState" className="col-form-label">Offer ID</label>
                        <p>{catalogueDetails.offerID}</p>
                    </div>
                </div>
            </div>

            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Type</label>
                        <p>{catalogueDetails.type}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Quota </label>
                        <p>{catalogueDetails.quota}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Units</label>
                        <p>{catalogueDetails.units}</p>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Services</label>
                        <p>{catalogueDetails.services}</p>
                    </div>
                </div>
            </div>

            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Network Type</label>
                        <p>{catalogueDetails.networkType}</p>
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
                        <p>{catalogueDetails.denomination}</p>
                    </div>
                </div>
            </div>


        </>
    )
}
export default CreateCatalogueDetailsPreview;