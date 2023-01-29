
import React, { useState, useRef, useEffect } from 'react'
import NewCustomerPreviewModal from 'react-modal'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";
//import * as yup from "yup";

import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import CreateCatalogueDetailsForm from "./createCatalogueDetailsForm";
import CreateCatalogueDetailsPreview from './createCatalogueDetailsPreview';


const catalogueValidationSchema = object().shape({
    refillProfileID: string().required("Refill profile ID  is required"),
    tariffCode: string().required("Tariff code is required"),
    bundleName: string().required("Bundle Name is required"),
    commercialPackName: string().required("Commercial pack naame is required"),
    bundleCategory: string().required("Bundle category  is required"),
    bundleType: string().required('Bundle Type is required'),
    oCSdescription: string().required('OCS Description Type is required'),
    offerID: string().required("Offer ID Number is required"),
    type: string().required("Type is required"),
    quota: string().required("Quota is required"),
    units: string().required("Units is required"),
    services: string().required("services is required"),
    networkType: string().required("Network type  is required"),
    serviceClass: string().required("Service Class  is required"),
    validity: string().required("Validity  is required"),
    denomination: string().required("Denomination type is required"),
    
});

const CreateCatalog = () => {
    const newCatalogueData = useRef({})
    const { t } = useTranslation();
    const [formSectionView, setformSectionView] = useState('show')
    const [catalogueDetailsError, setCatalogueDetailsError] = useState({});// validation error state check
    const [catalogueData, setCatalogueData] = useState(
        {
            refillProfileID: "",
            tariffCode: "",
            bundleName: "",
            commercialPackName: "",
            bundleCategory: "",
            bundleType: "",
            oCSdescription: "",
            offerID: "",
            type: "",
            quota: "",
            units: "",
            services: "",
            networkType: "",
            serviceClass: "",
            validity: "",
            denomination: ""
        }
    )
    const [renderMode, setRenderMode] = useState({
        catalogueForm: 'form',// status(form,hide,show,view)
        cataloguePreview: 'hide',
        catalogformDoneButton: 'show',
        catalogformCancelButton: 'show',
        catalogueEditPreviewButton: 'hide',
        previewButton: 'show',
        cancelButton: 'show',
        submitButton: 'hide'
    });

    useEffect(() => {
    }, [])
    // Form cancel button handle
    const handleCatalogueFormCancel = () => {
        if (!newCatalogueData.current.customer) {
            return;
        }
        if (!newCatalogueData.current.customer) {
            newCatalogueData.current.customer = {}
        }
        setCatalogueData({
        refillProfileID : newCatalogueData.current.customer.refillProfileId,
        tariffCode : newCatalogueData.current.customer.refPlanCode,
        bundleName : newCatalogueData.current.customer.planName,
        bundleCategory : newCatalogueData.current.customer.planCategory,
        bundleType : newCatalogueData.current.customer.planType,
        offerID : newCatalogueData.current.customer.planOffer.offerId,
        type : newCatalogueData.current.customer.planOffer.offerType,
        quota : newCatalogueData.current.customer.planOffer.quota,
        units : newCatalogueData.current.customer.planOffer.units,
        services : newCatalogueData.current.customer.prodType,
        networkType : newCatalogueData.current.customer.networkType,
        validity : newCatalogueData.current.customer.validity,
        denomination : newCatalogueData.current.customer.charge
    })
        setRenderMode({
            submitButton: "hide",
            cancelButton: 'hide',
            previewButton: 'show',
            catalogueForm: 'form',
            catalogueEditPreviewButton: 'hide'
        })

    }

    const handleCatalogueFormEdit = () => {
        setRenderMode({
            ...renderMode,
            submitButton: "hide",
            cancelButton: 'hide',
            previewButton: 'show',
            catalogueForm: 'form',
            catalogformDoneButton: 'show',
            catalogformCancelButton: 'show',
            catalogueEditPreviewButton: 'hide'
        })
    }
    // Form cancel button handle
    const handleCatalogueFormDone = () => {
        if (setCatalogueDetails()) {
            setRenderMode({
                ...renderMode,
                submitButton: "show",
                cancelButton: 'show',
                previewButton: 'hide',
                catalogueForm: 'view',
                catalogformDoneButton: 'hide',
                catalogformCancelButton: 'hide',
                catalogueEditPreviewButton: 'show'
            })
        }
    }
    const handlePreview = () => {
        if (setCatalogueDetails()) {
            toast.success("Field validations completed successfully");
            setRenderMode({
                ...renderMode,
                submitButton: "show",
                cancelButton: 'show',
                catalogueEditPreviewButton: 'show',
                previewButton: 'hide',
                catalogueForm: 'view',

            })
        }
    }
    const handleCancel = () => {
        setRenderMode({
            ...renderMode,
            submitButton: "hide",
            cancelButton: 'hide',
            catalogueEditPreviewButton: 'hide',
            catalogueForm: 'form',

            previewButton: 'show'
        })
    }

    const handleSubmit = () => {
        showSpinner();
        post(properties.CATALOGUE_API+'/', newCatalogueData.current.customer)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("Customer, Account & Service created successfully " + resp.data.serviceRequest.intxnId);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            catalogueEditPreviewButton: 'hide',
                        })
                        
                    } else {
                        toast.error("Failed to create - " + resp.status);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'show',
                            previewButton: 'hide'
                        })
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                    setRenderMode({
                        ...renderMode,
                        submitButton: 'hide',
                        cancelButton: 'show',
                        previewButton: 'hide'
                    })
                }
            }).finally(hideSpinner);
       
    }
   
    const setCatalogueDetails = () => {

        const error = validate('CUSTOMER', catalogueValidationSchema, catalogueData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        if (!newCatalogueData.current.customer) {
            newCatalogueData.current.customer = {}
        }
        if (!newCatalogueData.current.customer.planOffer) {
            newCatalogueData.current.customer.planOffer = {}
        }
        if (formSectionView === 'show') {
            newCatalogueData.current.customer.refillProfileId = catalogueData.refillProfileID
            newCatalogueData.current.customer.refPlanCode = catalogueData.tariffCode
            newCatalogueData.current.customer.planName = catalogueData.bundleName
            newCatalogueData.current.customer.planCategory = catalogueData.bundleCategory
            newCatalogueData.current.customer.planType = catalogueData.bundleType
            newCatalogueData.current.customer.planOffer.offerId = catalogueData.offerID
            newCatalogueData.current.customer.planOffer.offerType = catalogueData.type
            newCatalogueData.current.customer.planOffer.quota = catalogueData.quota
            newCatalogueData.current.customer.planOffer.units = catalogueData.units
            newCatalogueData.current.customer.prodType = catalogueData.services
            newCatalogueData.current.customer.networkType = catalogueData.networkType
            newCatalogueData.current.customer.validity = catalogueData.validity
            newCatalogueData.current.customer.charge = catalogueData.denomination
        }
        return true
    }
    const validate = (section, schema, data) => {
        try {
            if (section === 'CUSTOMER') {
                setCatalogueDetailsError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'CUSTOMER') {
                    setCatalogueDetailsError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };


    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Create Catalogue</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">
                    <div className="card-box">
                        <div className="d-flex">
                            <div className="col-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="customersection" spy={true} offset={-190} smooth={true} duration={100}>Cataloge</Link></li>
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="accountSection" spy={true} offset={-100} smooth={true} duration={100}>Create</Link></li>
                                    
                                </ul>
                            </div>
                            <div className="new-customer col-md-10 p-0">
                                <Element name="customersection" className="element" >
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <section className="triangle">
                                                <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("catalogue")}</h4>
                                            </section>
                                        </div>
                                    </div>
                                   
                                    {
                                        (formSectionView && formSectionView !== '') ?
                                            <div className="pt-0 mt-0">
                                               
                                                <fieldset className="scheduler-border">
                                                    {
                                                        (formSectionView === 'show' && renderMode.catalogueForm === 'form') ?
                                                            <CreateCatalogueDetailsForm data={{
                                                                catalogueDetailsData: catalogueData,
                                                            }}
                                                                stateHandler={{
                                                                    setCatalogueDetails: setCatalogueData

                                                                }}
                                                                error={catalogueDetailsError}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (formSectionView === 'show' && renderMode.catalogueForm === 'view') ?
                                                            <CreateCatalogueDetailsPreview
                                                                data={{
                                                                    catalogueDetailsData: catalogueData,
                                                                }}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                </fieldset>
                                                {
                                                    (renderMode.catalogueForm === 'form') ?
                                                        <div className="d-flex justify-content-end mr-0">
                                                            <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleCatalogueFormCancel}>Cancel</button>
                                                            <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2" onClick={handleCatalogueFormDone}>Done</button>
                                                        </div>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    (renderMode.catalogueForm === 'view' && renderMode.catalogueEditPreviewButton === 'show') ?
                                                        <div className="d-flex justify-content-end edit-btn mr-0">
                                                            <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light" onClick={handleCatalogueFormEdit}>Edit</button>
                                                        </div>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                            :
                                            <></>
                                    }
                                </Element>
                                <div className="d-flex justify-content-center">
                                    {
                                        (renderMode.previewButton === 'show') ?
                                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handlePreview}>Preview and Submit</button>
                                            :
                                            <></>
                                    }
                                    {
                                        (renderMode.submitButton === 'show') ?
                                            <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>
                                            :
                                            <></>
                                    }
                                    {
                                        (renderMode.cancelButton === 'show') ?
                                            <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={handleCancel}>Cancel</button>
                                            :
                                            <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default CreateCatalog;