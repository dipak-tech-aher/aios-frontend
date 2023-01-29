
import { useTranslation } from "react-i18next";

import React, { useState, useRef, useEffect } from 'react'
import AddPlanOfferModal from "./addOfferModal";
import OfferCardView from "./offerCardView";
import { validateNumber } from "../util/validateUtil";
const CreateCatalogueDetailsForm = (props) => {
    const { t } = useTranslation();

    const catalogueDetails = props.data.catalogueDetailsData
    const setCatalogueDetails = props.stateHandler.setCatalogueDetails
    const error = props.error
    const offerList = props.data.offerList
    const setOfferList = props.stateHandler.setOfferList
    const offerdeleteId = props.data.offerdeleteId
    const deletedIds = props.data.deletedIds
    const setOfferDeleteId = props.stateHandler.setOfferDeleteId
    const editId = props.data.editId
    const setEditId = props.stateHandler.setEditId
    const setDeletedIDS = props.stateHandler.setDeletedIDS
    //for update offer
    const offerItemUpdate = props.data.offerItemUpdate
    const setOfferItemUpdate = props.stateHandler.setOfferItemUpdate
    const [openofferModal, setOfferOpenModal] = useState(false)
    const prodTypeLookUp = props.data.prodTypeLookUp.PROD_TYPE
    const networkTypeLookUp = props.data.networkTypeLookUp.NETWORK_TYPE
    const planTypeLookUp = props.data.planTypeLookUp.PLAN_TYPE
    const planCateTypeLookUp = props.data.planCateTypeLookUp.PROD_CAT_TYPE
    const formMode = props.formMode

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
                        <span className="errormsg">{error.refillProfileID ? error.refillProfileID : ""}</span>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Tariff Code<span>*</span></label>
                        <input type="text"
                            className={`form-control ${(error.tariffCode ? "input-error" : "")}`}
                            value={catalogueDetails.tariffCode}
                            id="Surname"
                            placeholder="Tarrif Code"
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
                        <select id="tarrifCode" disabled={(formMode.formMode === 'EDIT_MODE') ? 'disabled' : ''} value={catalogueDetails.bundleCategory} className={`form-control ${(error.bundleCategory ? "input-error" : "")}`}
                            onChange={e => {
                                setCatalogueDetails({
                                    ...catalogueDetails, bundleCategory: e.target.value,
                                    bundleCategoryDesc: e.target.options[e.target.selectedIndex].label
                                })
                            }
                            }>
                            <option value="">Select Product</option>
                            {
                                planCateTypeLookUp.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.bundleCategory ? error.bundleCategory : ""}</span>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Bundle Type<span>*</span></label>
                        <select id="tarrifCode" disabled={(formMode.formMode === 'EDIT_MODE') ? 'disabled' : ''} value={catalogueDetails.bundleType} className={`form-control ${(error.bundleType ? "input-error" : "")}`}
                            onChange={e => {
                                setCatalogueDetails({
                                    ...catalogueDetails, bundleType: e.target.value,
                                    bundleTypeDesc: e.target.options[e.target.selectedIndex].label
                                })
                            }
                            }>
                            <option value="">Select Product</option>
                            {
                                planTypeLookUp.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>

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
                        <label htmlFor="Surname" className="col-form-label">Services<span>*</span></label>

                        <select id="tarrifCode" disabled={(formMode.formMode === 'EDIT_MODE') ? 'disabled' : ''} value={catalogueDetails.services} className={`form-control ${(error.services ? "input-error" : "")}`}
                            onChange={e => {
                                setCatalogueDetails({
                                    ...catalogueDetails, services: e.target.value,
                                    serviceDesc: e.target.options[e.target.selectedIndex].label
                                })
                            }
                            }>
                            <option value="">Select Product</option>
                            {
                                prodTypeLookUp.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        <span className="errormsg">{error.services ? error.services : ""}</span>
                    </div>
                </div>
            </div>


            <div className="row col-12">



                <div className="col-md-3">
                    <div className="form-group">
                        <label htmlFor="Surname" className="col-form-label">Network Type<span>*</span></label>

                        <select id="tarrifCode" value={catalogueDetails.networkType} className={`form-control ${(error.networkType ? "input-error" : "")}`}
                            onChange={e => {
                                setCatalogueDetails({
                                    ...catalogueDetails, networkType: e.target.value,
                                    networkTypeDesc: e.target.options[e.target.selectedIndex].label
                                })
                            }
                            }>
                            <option value="">Select Network</option>
                            {
                                networkTypeLookUp.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
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
                            onKeyPress={(e) => { validateNumber(e) }}
                            onChange={(e) => {
                                setCatalogueDetails({ ...catalogueDetails, denomination: e.target.value })
                            }
                            }
                        />
                        <span className="errormsg">{error.denomination ? error.denomination : ""}</span>
                    </div>
                </div>

                <br></br>

            </div>


        </>

    )
}
export default CreateCatalogueDetailsForm;