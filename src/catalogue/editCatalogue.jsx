
import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import AddPlanOfferModal from "./addOfferModal";
import OfferCardView from "./offerCardView";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object, number } from "yup";
import { get, put, post } from "../util/restUtil";
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
    services: string().required("services is required"),
    prodType: string().required("Prod Type is required"),
    networkType: string().required("Network type  is required"),
    serviceClass: string().required("Service Class  is required"),
    validity: string().required("Validity  is required"),
    denomination: number().required("Denomination type is required")
});

const EditCatalogDetails = (props) => {
    const newCatalogueData = useRef({})
    const { t } = useTranslation();
    const [catalogId, setCatalogueID] = useState()
    const [offerList, setOfferList] = useState([])
    const [offerdeleteId, setOfferDeleteId] = useState({ deletedID: '' })
    const [formSectionView, setformSectionView] = useState('show')
    const [deleteOffer, setDeletedIDS] = useState([])
    const [catalogueDetailsError, setCatalogueDetailsError] = useState({});// validation error state check
    const [planId, setPlanId] = useState('')
    const [openofferModal, setOfferOpenModal] = useState(false)
    const [viewMode, setViewMode] = useState('Form')
    const [prodTypeLookUp, setProdTypeLookUp] = useState(null)
    const [networkTypeLookUp, setNetworkTypeLookUp] = useState(null)
    const [offerItemUpdate, setOfferItemUpdate] = useState({
        planOfferId: "",
        quota: "",
        units: ""
    })
    const [catalogueData, setCatalogueData] = useState(
        {
            refillProfileID: "",
            tariffCode: "",
            prodType: "",
            prodTypeDesc: '',
            bundleName: "",
            commercialPackName: "",
            bundleCategory: "",
            prodCatType: "RFL-C",
            bundleType: "",
            oCSdescription: "",
            planOffer: offerList,
            services: "",
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
        submitButton: 'hide',
        finalEdit: 'hide'
    });


    useEffect(() => {
        if (planId !== '') {

            getCatalogueApiDataById(planId)
            setRenderMode({
                ...renderMode,
                submitButton: 'hide',
                cancelButton: 'hide',
                previewButton: 'hide',
                catalogueEditPreviewButton: 'hide',
                finalEdit: 'show'
            })
        }
    }, [planId])



    const getLookTarrif = () => {
        post(properties.BUSINESS_ENTITY_API, ['PROD_TYPE', 'NETWORK_TYPE'])
            .then((resp) => {
                if (resp.status === 200) {
                    if (resp.data) {
                        setProdTypeLookUp(resp.data)
                        setNetworkTypeLookUp(resp.data)
                    }
                }
                else {
                    toast.error("Failed to update - " + resp.status);
                }
            }).finally()
    }

    useEffect(() => {
        //setformSectionView('show')
        if (props.location.state === undefined)
            return;
        const { data } = props.location.state
        showSpinner();
        getLookTarrif();
        setCatalogueID(data.planId)
        getCatalogueApiDataById(data.planId)

    }, [props.location.state])

    //delete offer handled
    useEffect(() => {

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
                        quota: offerItemUpdate.quota, units: offerItemUpdate.units,
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


    useEffect(() => {
        if (offerList.length >= 0) {

            setCatalogueData({
                ...catalogueData,
                planOffer: offerList
            })
        }

    }, [offerList])



    const getCatalogueApiDataById = (planId) => {
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
                            bundleType: apiData.planType,
                            planOffer: apiData.planoffer,
                            commercialPackName: apiData.commPackName,
                            oCSdescription: apiData.ocsDesc,
                            serviceClass: apiData.serviceCls,
                            services: apiData.bandwidth,
                            networkType: apiData.networkType,
                            validity: apiData.validity,
                            prodType: apiData.prodType,
                            denomination: apiData.charge
                        })
                        setOfferList(apiData.planoffer)
                        setPlanId('')

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
    const handleCatalogueFormCancel = () => {
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
    // Form cancel button handle
    const handleCatalogueFormDone = () => {
        if (setCatalogueDetails()) {
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
        setViewMode('Preview')
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
        setViewMode('Form')
        setRenderMode({
            ...renderMode,
            submitButton: "hide",
            cancelButton: 'hide',
            catalogueEditPreviewButton: 'hide',
            catalogueForm: 'form',
            previewButton: 'show'
        })
    }
    const handleUserToEdit = () => {
        setRenderMode({
            ...renderMode,
            submitButton: 'hide',
            cancelButton: 'hide',
            previewButton: 'show',
            catalogformDoneButton: 'show',
            catalogformCancelButton: 'show',
            catalogueEditPreviewButton: 'show',
            catalogueForm: 'form',
            finalEdit: "hide"
        })
    }

    const handleSubmit = () => {

        showSpinner();
        put(`${properties.CATALOGUE_API}/${catalogId}`, newCatalogueData.current.customer)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Catalogue Updated successfully");
                    setRenderMode({
                        ...renderMode,
                        submitButton: 'hide',
                        cancelButton: 'hide',
                        previewButton: 'hide',
                        catalogueEditPreviewButton: 'hide',
                    })
                    setPlanId(catalogId)
                } else {
                    toast.error("Failed to update - " + resp.status);
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
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Edit Catalogue</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">
                    <div className="card-box cust360 ">
                        <div className="d-flex">
                            <div className="col-md-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="customersection" spy={true} offset={-190} smooth={true} duration={100}>Cataloge</Link></li>
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="accountSection" spy={true} offset={-100} smooth={true} duration={100}>Create</Link></li>
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
                                                && (networkTypeLookUp && networkTypeLookUp !== null)) ?
                                                <div className="pt-0 mt-2 pr-2">

                                                    <fieldset className="scheduler-border">
                                                        {
                                                            (formSectionView === 'show' && renderMode.catalogueForm === 'form') ?
                                                                <CreateCatalogueDetailsForm data={{
                                                                    catalogueDetailsData: catalogueData,
                                                                    offerList: catalogueData.planOffer,
                                                                    deletedIds: deleteOffer,
                                                                    offerdeleteId: offerdeleteId,
                                                                    offerItemUpdate: offerItemUpdate,
                                                                    prodTypeLookUp: prodTypeLookUp,
                                                                    networkTypeLookUp: networkTypeLookUp
                                                                }}
                                                                    stateHandler={{
                                                                        setCatalogueDetails: setCatalogueData,
                                                                        setOfferList: setOfferList,
                                                                        setOfferDeleteId: setOfferDeleteId,
                                                                        setDeletedIDS: setDeletedIDS,
                                                                        setOfferItemUpdate: setOfferItemUpdate
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
                                                                        offerList: catalogueData.planOffer,
                                                                        offerdeleteId: offerdeleteId
                                                                    }}
                                                                    stateHandler={{
                                                                        setCatalogueDetails: setCatalogueData,
                                                                        setOfferList: setOfferList,
                                                                        setOfferDeleteId: setOfferDeleteId

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

                                    {
                                        (formSectionView === 'show' && renderMode.catalogueForm === 'form') ?
                                            <Element name="customersection" className="element" >
                                                <div className="row">
                                                    <div className="col-12 p-0">
                                                        <section className="triangle col-12">
                                                            <div className="row col-12">
                                                                <div className="col-8">
                                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("catalogue")} Offers</h4>
                                                                </div>
                                                                <div className="col-4">
                                                                    <span className="act-btn float-right">
                                                                        <button type="button" onClick={() => setOfferOpenModal(true)} className="btn btn-labeled btn-primary btn-sm mt-1" data-toggle="modal" data-target="#myModal">
                                                                            <span className="btn-label"><i className="fa fa-plus"></i></span>Add Offer
                                                                        </button>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </section>

                                                        {/* pop up and card controll */}
                                                        <fieldset className="scheduler-border">
                                                            <div style={{ width: "30%", height: '10%' }}>
                                                                <AddPlanOfferModal
                                                                    data={{
                                                                        isOpen: openofferModal,
                                                                        offerList: offerList,
                                                                        //editId: editId
                                                                    }}
                                                                    handler={{
                                                                        setOpen: setOfferOpenModal,
                                                                        setOfferList: setOfferList,
                                                                        //setEditId: setEditId
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
                                                                                                        //editId: editId
                                                                                                    }}
                                                                                                    deleteHandler={{
                                                                                                        setOfferDeleteId: setOfferDeleteId,
                                                                                                        setOfferList: setOfferList,
                                                                                                        //setEditId: setEditId,
                                                                                                        setDeletedIDS: setDeletedIDS,
                                                                                                        setOfferItemUpdate: setOfferItemUpdate
                                                                                                    }}
                                                                                                    viewMode={viewMode}
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


                                            </Element>
                                            : ""
                                    }
                                    {
                                        (renderMode.catalogueForm === 'form') ?
                                            <div className="d-flex justify-content-end mr-0">
                                                {/* <button type="button" className="btn btn-outline-secondary waves-effect waves-light" onClick={handleCatalogueFormCancel}>Cancel</button> */}
                                                <button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light ml-2" onClick={handleCatalogueFormDone}>Done</button>
                                            </div>

                                            :
                                            <></>
                                    }

                                    {
                                        (renderMode.catalogueForm === 'view' && renderMode.catalogueEditPreviewButton === 'show') ?
                                            <div className="d-flex justify-content-end mr-0">
                                                <button type="button" className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light" onClick={handleCatalogueFormEdit}>Edit</button>
                                            </div>
                                            :
                                            <></>
                                    }

                                </div>
                                <br></br>
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
export default EditCatalogDetails;