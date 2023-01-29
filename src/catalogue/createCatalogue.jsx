
import React, { useState, useRef, useEffect } from 'react'
import NewCustomerPreviewModal from 'react-modal'
import { useTranslation } from "react-i18next";
import AddPlanOfferModal from "./addOfferModal";
import OfferCardView from "./offerCardView";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object, number } from "yup";
//import * as yup from "yup";

import { get, put, post } from "../util/restUtil";
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
    services: string().required("services is required"),
    networkType: string().required("Network type  is required"),
    serviceClass: string().required("Service Class  is required"),
    //prodType: string().required("Prod Type is required"),
    validity: string().required("Validity  is required"),
    denomination: string().required("Denomination type is required"),
});

const CreateCatalog = (props) => {
    let modeChange = 'Create'
    const history = useHistory();
    const newCatalogueData = useRef({})
    const { t } = useTranslation();
    const [catalogId, setCatalogueID] = useState()
    const [formSectionView, setformSectionView] = useState('show')
    const [offerList, setOfferList] = useState([])
    const [catalogueDetailsError, setCatalogueDetailsError] = useState({});// validation error state check
    const [offerdeleteId, setOfferDeleteId] = useState({ deletedID: '' })
    const [editId, setEditId] = useState({ editedId: '' })
    const [deleteOffer, setDeletedIDS] = useState([])
    const [planId, setPlanId] = useState('')
    const [openofferModal, setOfferOpenModal] = useState(false)
    const [viewMode, setViewMode] = useState('Form')
    const [prodTypeLookUp, setProdTypeLookUp] = useState(null)
    const [networkTypeLookUp, setNetworkTypeLookUp] = useState(null)
    const [planTypeLookUp, setPlanTypeLookUp] = useState(null)
    const [planCateTypeLookUp, setPlanCateTypeLookUp] = useState(null)
    const [planOfferTypeLookUp, setPlanOfferTypeLookUp] = useState(null)
    const [handleServiceRequest, setHandleServiceRequest] = useState('SUBMIT')
    const [screenRedirect, setScreenRedirect] = useState('Dashboard')
    const [formModeChange, setFormModeChange] = useState({
        formMode: 'CREATE_MODE'
    })
    const [catalogueDropDownDesc, setCatalogueDropDownDesc] = useState({
        bundleCategoryDesc: "",
        bundleTypeDesc: "",
        serviceDesc: "",
        networkTypeDesc: "",
    })
    //column update useState
    const [offerItemUpdate, setOfferItemUpdate] = useState({
        planOfferId: "",
        quota: "",
        units: ""
    })
    const [catalogueData, setCatalogueData] = useState(
        {
            refillProfileID: "",
            tariffCode: "",
            tariffCodeDesc: "",
            //prodType: "",
            bundleName: "",
            commercialPackName: "",
            bundleCategory: "",
            bundleCategoryDesc: "",
            prodCatType: "RFL-C",
            bundleType: "",
            bundleTypeDesc: "",
            oCSdescription: "",
            planOffer: offerList,
            services: "",
            serviceDesc: "",
            networkType: "",
            networkTypeDesc: "",
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
        submitButton: 'show',
        finalEdit: 'hide',
        addOfferBtn: 'show'
    });

    //edit list call here
    useEffect(() => {
        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        showSpinner();
        setCatalogueID(data.planId)
        setHandleServiceRequest('EDIT')
        setScreenRedirect('searchlist')
        setViewMode('Form')
        getCatalogueApiDataById(data.planId, "list")
    }, [props.location.state])

    useEffect(() => {
        showSpinner()
        post(properties.BUSINESS_ENTITY_API, [
            'PROD_TYPE',//services
            'NETWORK_TYPE',
            'PLAN_TYPE',//bunlde Name lookup
            'PROD_CAT_TYPE',//bundle category lookup,
            'PLAN_OFFER_TYPE'
        ])
            .then((resp) => {
                if (resp.status === 200) {
                    if (resp.data) {
                        setProdTypeLookUp(resp.data)
                        setNetworkTypeLookUp(resp.data)
                        //setPlanOfferTypeLookUp(resp.data)
                        setPlanTypeLookUp(resp.data)
                        setPlanCateTypeLookUp(resp.data)
                    }
                }
                else {
                    toast.error("Failed to update - " + resp.status);
                }
            }).finally(hideSpinner())
    }, [])

    //after submit Ui to be refreshed with new data
    useEffect(() => {
        if (planId !== '') {
            getCatalogueApiDataById(planId)
        }
    }, [planId])

    useEffect(() => {
        //setformSectionView('show')
        if (offerList !== undefined) {
            if (offerList.length >= 0) {

                setCatalogueData({
                    ...catalogueData,
                    planOffer: offerList
                })
            }
        }
    }, [offerList, offerdeleteId])

    //delete offer handled
    useEffect(() => {
        //setformSectionView('show')
        if (deleteOffer !== undefined) {

        }
    }, [deleteOffer])
    useEffect(() => {
        //setformSectionView('show')
        if (offerItemUpdate.planOfferId !== "") {
            const newList = offerList.map((item) => {
                if ((item.planOfferId === offerItemUpdate.planOfferId)
                    || (item.offerId === offerItemUpdate.planOfferId)) {
                    const updatedItem = {
                        ...item,
                        offerType: offerItemUpdate.offerType,
                        quota: offerItemUpdate.quota,
                        units: offerItemUpdate.units,
                    };
                    return updatedItem;
                }
                else {
                }
                return item;
            });
            setOfferList(newList)
        }
        setCatalogueData({
            ...catalogueData,
            planOffer: offerList
        })
    }, [offerItemUpdate])

    const getCatalogueApiDataById = (planId, source) => {
        let apiData;
        get(properties.CATALOGUE_API + `/${planId}`)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        apiData = resp.data
                        setCatalogueData({
                            refillProfileID: apiData.refillProfileId,
                            tariffCode: apiData.refPlanCode,
                            bundleName: apiData.planName,
                            bundleCategory: apiData.planCategory,
                            bundleCategoryDesc: (apiData.prodCatTypeDesc!==null)?apiData.prodCatTypeDesc.description:"",
                            bundleType: apiData.planType,
                            bundleTypeDesc: (apiData.planTypeDesc!==null)?apiData.planTypeDesc.description:"",
                            planOffer: apiData.planoffer,
                            commercialPackName: apiData.commPackName,
                            oCSdescription: apiData.ocsDesc,
                            serviceClass: apiData.serviceCls,
                            services: apiData.prodType,
                            serviceDesc: (apiData.prodTypeDesc!==null)?apiData.prodTypeDesc.description:"",
                            networkType: apiData.networkType,
                            networkTypeDesc: (apiData.networkTypeDesc!==null)?apiData.networkTypeDesc.description:"",
                            validity: apiData.validity,
                            denomination: apiData.charge,
                            prodType: apiData.prodType
                        })


                        // setCatalogueData({
                        //     refillProfileID: apiData.refillProfileId,
                        //     tariffCode: apiData.refPlanCode,
                        //     bundleName: apiData.planName,
                        //     bundleCategory: apiData.planCategory,
                        //     bundleCategoryDesc: "",//apiData.planCategoryDesc
                        //     bundleType: apiData.planType,
                        //     bundleTypeDesc: "",//apiData.bundleTypeDesc
                        //     planOffer: apiData.planoffer,
                        //     commercialPackName: apiData.commPackName,
                        //     oCSdescription: apiData.ocsDesc,
                        //     serviceClass: apiData.serviceCls,
                        //     services: apiData.prodType,
                        //     serviceDesc: "",//apiData.serviceDesc
                        //     networkType: apiData.networkType,
                        //     networkTypeDesc: "",//apiData.networkTypeDesc
                        //     validity: apiData.validity,
                        //     denomination: apiData.charge,
                        //     prodType: apiData.prodType
                        // })
                        setOfferList(apiData.planoffer)
                        if (source === 'list') {
                            setRenderMode({
                                ...renderMode,
                                submitButton: 'show',
                                cancelButton: 'show',
                                previewButton: 'hide',
                                catalogueEditPreviewButton: 'hide',
                                catalogueForm: 'form',
                                finalEdit: 'hide',
                            })
                        }
                        else {
                            setRenderMode({
                                ...renderMode,
                                submitButton: 'hide',
                                cancelButton: 'hide',
                                previewButton: 'hide',
                                catalogueEditPreviewButton: 'hide',
                                catalogueForm: 'view',
                                finalEdit: 'show',
                                addOfferBtn: 'hide'
                            })
                        }
                        setFormModeChange({ ...formModeChange, formMode: "EDIT_MODE" })
                        //setViewMode('Preview')
                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);
                    }
                    hideSpinner();
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            }).finally();
    }

    const handleCatalogueFormCancel = () => {
        modeChange = "Create"
        if (!newCatalogueData.current.customer) {
            return;
        }
        if (!newCatalogueData.current.customer) {
            newCatalogueData.current.customer = {}
        }
        setRenderMode({
            submitButton: "hide",
            cancelButton: 'hide',
            previewButton: 'show',
            catalogueForm: 'form',
            catalogueEditPreviewButton: 'hide'
        })

    }

    const handleCatalogueFormEdit = () => {
        setViewMode('Form')
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

    const isOfferAdded = () => {
        if (catalogueData.planOffer === undefined) {
            toast.error('Please add offer')
            return false
        }
        if (catalogueData.planOffer.length === 0) {
            toast.error('Please add offer')
            return false
        }
        return true
    }
    // Form cancel button handle
    const handleCatalogueFormDone = () => {

        if (setCatalogueDetails() && isOfferAdded()) {
            setViewMode('Preview')
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
        modeChange = "Preview"

        if (setCatalogueDetails() && isOfferAdded()) {
            setViewMode('Preview')

        }
        else {
            return false
        }
        return true
    }
    const handleCancel = () => {
        modeChange = "Create"
        setViewMode('Form')
        setRenderMode({
            ...renderMode,
            submitButton: "show",
            cancelButton: 'show',
            catalogueEditPreviewButton: 'hide',
            catalogueForm: 'form',

            previewButton: 'show'
        })
        if (screenRedirect === 'searchlist') {
            history.push(`${process.env.REACT_APP_BASE}/catalogue-list-view`)
        }
        else {
            history.push(`${process.env.REACT_APP_BASE}/`)
        }
    }
    const handleUserToEdit = () => {
        setHandleServiceRequest('EDIT')
        setViewMode('Form')
        setRenderMode({
            ...renderMode,
            submitButton: "show",
            cancelButton: 'show',
            catalogueEditPreviewButton: 'show',
            previewButton: 'hide',
            catalogueForm: 'form',
            finalEdit: 'hide',
            addOfferBtn: "show"

        })
        return
    }

    const handleSubmit = () => {
        if (!handlePreview()) {
            return
        }
        if (handleServiceRequest === 'EDIT') {
            showSpinner();
            put(properties.CATALOGUE_API + `/${catalogId}`, newCatalogueData.current.customer)
                .then((resp) => {
                    if (resp.status === 200) {
                        toast.success("Catalogue Updated successfully ");
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'hide',
                            previewButton: 'hide',
                            catalogueForm: 'view',
                            finalEdit: 'show',
                            catalogueEditPreviewButton: 'hide',
                            addOfferBtn: 'hide'
                        })
                        //setCatalogueDescription()
                        getCatalogueApiDataById(catalogId, 'edit')
                    } else {
                        toast.error("Failed to create - " + resp.status);
                        setRenderMode({
                            ...renderMode,
                            submitButton: 'hide',
                            cancelButton: 'show',
                            previewButton: 'hide'
                        })
                    }
                }).finally(hideSpinner);
        }
        else {
            showSpinner();
            post(properties.CATALOGUE_API + '/', newCatalogueData.current.customer)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            toast.success("Catalogue created successfully ");
                            setRenderMode({
                                ...renderMode,
                                submitButton: 'hide',
                                cancelButton: 'hide',
                                previewButton: 'hide',
                                catalogueForm: 'view',
                                catalogueEditPreviewButton: 'hide',
                                finalEdit: "show",
                                addOfferBtn: 'hide'
                            })
                            setCatalogueID(resp.data.planId)
                            getCatalogueApiDataById(resp.data.planId, 'submit')
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
    }

    // const setCatalogueDescription = () => {
    //     setCatalogueDropDownDesc({
    //         ...catalogueDropDownDesc,
    //         bundleCategoryDesc: catalogueData.bundleCategoryDesc,
    //         bundleTypeDesc: catalogueData.bundleTypeDesc,
    //         serviceDesc: catalogueData.serviceDesc,
    //         networkTypeDesc: catalogueData.networkTypeDesc,
    //     })
    // }

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
            newCatalogueData.current.customer.planOffer = []
        }
        if (formSectionView === 'show') {
            newCatalogueData.current.customer.refillProfileId = catalogueData.refillProfileID
            newCatalogueData.current.customer.TarrifCode = catalogueData.tariffCode
            newCatalogueData.current.customer.bundleName = catalogueData.bundleName
            newCatalogueData.current.customer.bundleCatagory = catalogueData.bundleCategory
            newCatalogueData.current.customer.bundleType = catalogueData.bundleType
            newCatalogueData.current.customer.planOffer = catalogueData.planOffer
            newCatalogueData.current.customer.commPackName = catalogueData.commercialPackName
            newCatalogueData.current.customer.ocsDescription = catalogueData.oCSdescription
            newCatalogueData.current.customer.serviceClass = catalogueData.serviceClass
            newCatalogueData.current.customer.service = catalogueData.services
            newCatalogueData.current.customer.prodType = catalogueData.prodType
            newCatalogueData.current.customer.networkType = catalogueData.networkType
            newCatalogueData.current.customer.validity = catalogueData.validity
            newCatalogueData.current.customer.charge = catalogueData.denomination
            newCatalogueData.current.customer.deleteOffer = deleteOffer
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
        {
            
        }
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
                            <div className="col-md-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="customersection" spy={true} offset={-130} smooth={true} duration={100}>{t("catalogue")}</Link></li>
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="catalogueOffer" spy={true} offset={-120} smooth={true} duration={100}>Catalogue Offer</Link></li>

                                </ul>
                            </div>
                            <div className="new-customer col-md-10">
                                <div className="scrollspy-div">

                                    <Element name="customersection" className="element" >
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("catalogue")}</h4>
                                                </section>
                                            </div>
                                        </div>

                                        {
                                            ((formSectionView && formSectionView !== '') && (prodTypeLookUp && prodTypeLookUp !== null)
                                                && (networkTypeLookUp && networkTypeLookUp !== null) && (planTypeLookUp && planTypeLookUp !== null)
                                                && (planCateTypeLookUp && planCateTypeLookUp !== null)

                                                && (planTypeLookUp && planTypeLookUp !== null)) ?
                                                <div className="pt-0 mt-2 pr-2">

                                                    <fieldset className="scheduler-border">
                                                        {
                                                            (formSectionView === 'show' && renderMode.catalogueForm === 'form') ?
                                                                <CreateCatalogueDetailsForm data={{
                                                                    catalogueDetailsData: catalogueData,
                                                                    offerList: catalogueData.planOffer,
                                                                    offerdeleteId: offerdeleteId,
                                                                    deletedIds: deleteOffer,
                                                                    offerItemUpdate: offerItemUpdate,
                                                                    editId: editId,
                                                                    prodTypeLookUp: prodTypeLookUp,
                                                                    networkTypeLookUp: networkTypeLookUp,
                                                                    planCateTypeLookUp: planCateTypeLookUp,
                                                                    planTypeLookUp: planTypeLookUp,
                                                                }}
                                                                    stateHandler={{
                                                                        setCatalogueDetails: setCatalogueData,
                                                                        setOfferList: setOfferList,
                                                                        setOfferDeleteId: setOfferDeleteId,
                                                                        setDeletedIDS: setDeletedIDS,
                                                                        setEditId: setEditId,
                                                                        setOfferItemUpdate: setOfferItemUpdate
                                                                    }}
                                                                    error={catalogueDetailsError}
                                                                    formMode={formModeChange}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (formSectionView === 'show' && renderMode.catalogueForm === 'view') ?
                                                                <CreateCatalogueDetailsPreview
                                                                    data={{
                                                                        catalogueDetailsData: catalogueData,
                                                                        catalogueDropDownDesc: catalogueDropDownDesc,
                                                                        offerList: catalogueData.planOffer,
                                                                        offerdeleteId: offerdeleteId
                                                                    }}
                                                                    stateHandler={{
                                                                        setCatalogueDetails: setCatalogueData,
                                                                        setOfferList: setOfferList,
                                                                        setOfferDeleteId: setOfferDeleteId

                                                                    }}
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
                                    {

                                    }
                                    {
                                        (formSectionView === 'show' && (renderMode.catalogueForm === 'form' || renderMode.catalogueForm === 'view')  /*&&
                                           (planOfferTypeLookUp && planOfferTypeLookUp !== null)*/) ?
                                            <Element name="catalogueOffer" className="element" >
                                                <div className="row">
                                                    <div className="col-12 p-0 cat-off">
                                                        <section className="triangle col-12">
                                                            <div className="row col-12">
                                                                <div className="col-8">
                                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("catalogue_offer")}</h4>
                                                                </div>

                                                                {(renderMode.addOfferBtn === 'show') ?
                                                                    <div className="col-4 cus-act">
                                                                        <span className="act-btn float-right">
                                                                            <button type="button" onClick={() => setOfferOpenModal(true)} className="btn btn-labeled btn-primary btn-sm mt-1" data-toggle="modal" data-target="#myModal">
                                                                                <span className="btn-label"><i className="fa fa-plus"></i></span>Add Offer
                                                                            </button>
                                                                        </span>
                                                                    </div> : ""}
                                                            </div>
                                                        </section>

                                                        {/* pop up and card controll */}
                                                        <div class="pt-0 mt-2 pl-2 pr-2">
                                                        <fieldset className="scheduler-border">
                                                            <div style={{ width: "30%", height: '10%' }}>
                                                                <AddPlanOfferModal
                                                                    data={{
                                                                        isOpen: openofferModal,
                                                                        offerList: offerList,
                                                                        editId: editId,
                                                                        //planOfferTypeLookUp: planOfferTypeLookUp
                                                                    }}
                                                                    handler={{
                                                                        setOpen: setOfferOpenModal,
                                                                        setOfferList: setOfferList,
                                                                        setEditId: setEditId
                                                                    }}
                                                                    viewMode={'create'}
                                                                />
                                                            </div>
                                                            <div className="col-md-12 pl-2 pr-2 pt-2 pb-1 card-offer">
                                                                <div className="form-row ml-0 mr-0">
                                                                    <div className="form-row col-12 p-0 ml-0 mr-0">
                                                                        <div className="col-md-12 m-0 p-0">
                                                                            <div className="row">
                                                                                <div className="MS-content mb-2">
                                                                                    {
                                                                                        (offerList && offerList.length > 0) ?
                                                                                            offerList.map((offeritems, idx) =>
                                                                                                <OfferCardView key={idx}
                                                                                                    data={{
                                                                                                        offerItems: offeritems,
                                                                                                        id: { idx },
                                                                                                        offerdeleteId: offerdeleteId,
                                                                                                        offerList: offerList,
                                                                                                        deletedIds: deleteOffer,
                                                                                                        offerItemUpdate: offerItemUpdate,
                                                                                                        editId: editId,
                                                                                                        //planOfferTypeLookUp: planOfferTypeLookUp
                                                                                                    }}
                                                                                                    deleteHandler={{
                                                                                                        setOfferDeleteId: setOfferDeleteId,
                                                                                                        setOfferList: setOfferList,
                                                                                                        setEditId: setEditId,
                                                                                                        setDeletedIDS: setDeletedIDS,
                                                                                                        setOfferItemUpdate: setOfferItemUpdate
                                                                                                    }}
                                                                                                    viewMode={viewMode}
                                                                                                    formMode={formModeChange}
                                                                                                />
                                                                                            ) :
                                                                                            ""
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                        </div>
                                                    </div>
                                                </div>


                                            </Element>
                                            : ""
                                    }

                                </div>
                                <br></br>
                                <div className="d-flex justify-content-center">

                                    {
                                        (renderMode.submitButton === 'show') ?
                                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>
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
                                <div className="d-flex justify-content-end edit-btn mr-0">
                                    {
                                        (renderMode.finalEdit === 'show') ?

                                            <button type="button float-right" className="btn btn-primary btn-md  waves-effect waves-light ml-2 " onClick={handleUserToEdit}>Edit</button>

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