
import { useTranslation } from "react-i18next";

const CreateCatalogueDetailsForm = (props) => {
    const { t } = useTranslation();

    const catalogueDetails = props.data.catalogueDetailsData
    const setCatalogueDetails = props.stateHandler.setCatalogueDetails
    const error = props.error
    return (
        <>
            <div className="form-row">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Catalogue Details</h5>
                </div>
            </div>
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="customerTitle" className="col-form-label">Refill Profile ID<span>*</span></label>
                        <input type="text" className={`form-control ${(error.refillProfileID ? "input-error" : "")}`} value={catalogueDetails.refillProfileID} id="customerTitle" placeholder="Re fillProfile ID"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, refillProfileID: e.target.value })
                            }
                            }
                        />
                        <span className="errormsg">{error.title ? error.title : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Tariff Code<span>*</span></label>
                        <input type="text" className={`form-control ${(error.tariffCode ? "input-error" : "")}`} value={catalogueDetails.tariffCode} id="Surname" placeholder="Tarrif Code"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, tariffCode: e.target.value })
                                
                            }
                            }
                        />
                        <span className="errormsg">{error.tariffCode ? error.tariffCode : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Bundle Name<span>*</span></label>
                        <input type="text" className={`form-control ${(error.bundleName ? "input-error" : "")}`} value={catalogueDetails.bundleName} id="Surname" placeholder="Bundle Name"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, bundleName: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.bundleName ? error.bundleName : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Commercial Pack Name<span>*</span></label>
                        <input type="text" className={`form-control ${(error.commercialPackName ? "input-error" : "")}`} value={catalogueDetails.commercialPackName} id="Surname" placeholder="Commercial Pack Name"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, commercialPackName: e.target.value })
                                
                            }
                            }
                        />
                        <span className="errormsg">{error.commercialPackName ? error.commercialPackName : ""}</span>
                    </div>
                </div>
            </div>
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Bundle Category<span>*</span></label>
                        <input type="text" className={`form-control ${(error.bundleCategory ? "input-error" : "")}`} value={catalogueDetails.bundleCategory} id="Surname" placeholder="Bundle Category"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, bundleCategory: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.bundleCategory ? error.bundleCategory : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Bundle Type<span>*</span></label>
                        <input type="text" className={`form-control ${(error.bundleType ? "input-error" : "")}`} value={catalogueDetails.bundleType} id="Surname" placeholder="Bundle Type"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, bundleType: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.bundleType ? error.bundleType : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">OCS Description<span>*</span></label>
                        <input type="text" className={`form-control ${(error.oCSdescription ? "input-error" : "")}`} value={catalogueDetails.oCSdescription} id="Surname" placeholder="OCS Description"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, oCSdescription: e.target.value })
                                
                            }
                            }
                        />
                        <span className="errormsg">{error.oCSdescription ? error.oCSdescription : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Offer ID<span>*</span></label>
                        <input type="text" className={`form-control ${(error.offerID ? "input-error" : "")}`} value={catalogueDetails.offerID} id="Surname" placeholder="Offer ID"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, offerID: e.target.value })
                              
                            }
                            }
                        />
                        <span className="errormsg">{error.offerID ? error.offerID : ""}</span>
                    </div>
                </div>
            </div>

            {/* 3rd line */}
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Type<span>*</span></label>
                        <input type="text" className={`form-control ${(error.type ? "input-error" : "")}`} value={catalogueDetails.type} id="Surname" placeholder="Type"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, type: e.target.value })
                                
                            }
                            }
                        />
                        <span className="errormsg">{error.type ? error.type : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Quota <span>*</span></label>
                        <input type="text" className={`form-control ${(error.quota ? "input-error" : "")}`} value={catalogueDetails.quota} id="Surname" placeholder="Quota"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, quota: e.target.value })
                              
                            }
                            }
                        />
                        <span className="errormsg">{error.quota ? error.quota : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Units<span>*</span></label>
                        <input type="text" className={`form-control ${(error.units ? "input-error" : "")}`} value={catalogueDetails.units} id="Surname" placeholder="Units"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, units: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.units ? error.units : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Services<span>*</span></label>
                        <input type="text" className={`form-control ${(error.services ? "input-error" : "")}`} value={catalogueDetails.services} id="Surname" placeholder="Services"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, services: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.services ? error.services : ""}</span>
                    </div>
                </div>
            </div>

            {/* 4th line */}
            <div className="row col-12">
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Network Type<span>*</span></label>
                        <input type="text" className={`form-control ${(error.networkType ? "input-error" : "")}`} value={catalogueDetails.networkType} id="networkType" placeholder="Network Type"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, networkType: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.networkType ? error.networkType : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Service Class <span>*</span></label>
                        <input type="text" className={`form-control ${(error.serviceClass ? "input-error" : "")}`} value={catalogueDetails.serviceClass} id="serviceClass" placeholder="Service Class"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, serviceClass: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.serviceClass ? error.serviceClass : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Validity<span>*</span></label>
                        <input type="text" className={`form-control ${(error.validity ? "input-error" : "")}`} value={catalogueDetails.validity} id="validity" placeholder="Validity"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, validity: e.target.value })
                             
                            }
                            }
                        />
                        <span className="errormsg">{error.units ? error.units : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Denomination<span>*</span></label>
                        <input type="text" className={`form-control ${(error.denomination ? "input-error" : "")}`} value={catalogueDetails.denomination} id="Surname" placeholder="Denomination"
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, denomination: e.target.value })
                               
                            }
                            }
                        />
                        <span className="errormsg">{error.denomination ? error.denomination : ""}</span>
                    </div>
                </div>
            </div>

        </>

    )
}
export default CreateCatalogueDetailsForm;