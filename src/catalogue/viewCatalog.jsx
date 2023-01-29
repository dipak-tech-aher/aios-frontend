
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";

import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import CreateCatalogueDetailsForm from "./createCatalogueDetailsForm";
import CreateCatalogueDetailsPreview from './createCatalogueDetailsPreview';
import { useHistory } from "react-router-dom";

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

const ViewCatalogDetails = (props) => {
    const newCatalogueData = useRef({})
    const history = useHistory();
    const { t } = useTranslation();
    const [catalogId, setCatalogueID] = useState()
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
        catalogueForm: 'view',// status(form,hide,show,view)
        cataloguePreview: 'hide',
        catalogformDoneButton: 'show',
        catalogformCancelButton: 'show',
        catalogueEditPreviewButton: 'hide',
        previewButton: 'show',
        cancelButton: 'show',
        submitButton: 'hide'
    });

    useEffect(() => {
        //setformSectionView('show')
        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        showSpinner();
        setCatalogueID(data.planId)
        getCatalogueApiDataById(data)


    }, [props.location.state])

    const getCatalogueApiDataById = (data) => {
        let apiData;
        get(properties.CATALOGUE_API + `/${data.planId}`)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        apiData = resp.data
                        toast.success("get customer Inquiry Successfully");
                        setCatalogueData({
                            refillProfileID: apiData.refillProfileId,
                            tariffCode: apiData.prodType,
                            bundleName: apiData.planName,
                            bundleCategory: apiData.planCategory,
                            bundleType: apiData.planType,
                            planOffer: apiData.planoffer,
                            commercialPackName: apiData.commPackName,
                            oCSdescription: apiData.ocsDesc,
                            serviceClass: apiData.serviceCls,
                            services: apiData.bandwidth,
                            networkType: apiData.networkType,
                            validity: apiData.validity,
                            denomination: apiData.charge
                        })
                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);

                    }
                    hideSpinner();
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);

                }
            }).finally();

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
        history.push({ pathname: `${process.env.REACT_APP_BASE}/catalogue-list-view`, aboutProps: { name: 'view' } })
        return;
    }

    const handleSubmit = () => {
        showSpinner();
        post(properties.CATALOGUE_API + '/', newCatalogueData.current.customer)
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
                        <h4 className="page-title">View Catalogue</h4>
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
                                                <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("catalogue")} Details</h4>
                                            </section>
                                        </div>
                                    </div>

                                    {
                                        (formSectionView && formSectionView !== '') ?
                                            <div className="pt-0 mt-0">

                                                <fieldset disabled aria-readonly='true' className="scheduler-border" onClick={() => toast.success('Only Preview')}>
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
                                                            <CreateCatalogueDetailsPreview disabled='true'
                                                                data={{
                                                                    catalogueDetailsData: catalogueData,
                                                                    offerList: catalogueData.planOffer,

                                                                }}
                                                                stateHandler={{
                                                                    setCatalogueDetails: setCatalogueData,
                                                                    //setOfferList: setOfferList,

                                                                }}
                                                                viewMode={'PreviewOnly'}
                                                                error={catalogueDetailsError}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                </fieldset>

                                            </div>
                                            :
                                            <></>
                                    }
                                </Element>
                                <div className="d-flex justify-content-center">

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
export default ViewCatalogDetails;