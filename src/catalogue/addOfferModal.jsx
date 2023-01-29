import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import NewCustomerBkp from '../customer/newCustomerBkp';
import crypto from 'crypto'
import { toast } from "react-toastify";
import { string, date, object, number } from "yup";
import { get, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
const planOfferValidationShecma = object().shape({
    offerId: string().required("Offer ID Number is required"),
    offerType: string().required("Plan Offer Type is required"),
    quota: number().required("Quota is required"),
    units: string().required("Units is required")
})
const customStyles = {
    content: {
        top: '50%',
        innerWidth: '20%',
        maxWidth: '50%',
        minHeight: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const AddPlanOfferModal = (props) => {
    const viewMode = props.viewMode
    const offerItems = props.offerItems
    const { isOpen, offerList } = props.data
    const { setOpen, setOfferList } = props.handler
    //for update Offeritems
    const offerItemUpdate = props.data.offerItemUpdate
    const setOfferItemUpdate = props.handler.setOfferItemUpdate
    //const planOfferTypeLookUp = props.data.planOfferTypeLookUp.PLAN_OFFER_TYPE
    let offerData;
    const [offerErrorDetails, setOfferErrorDetails] = useState({});
    const [planOfferTypeLookUp, setPlanOfferTypeLookUp] = useState(null)
    const validate = (section, schema, data) => {
        try {
            if (section === 'OFFER') {
                setOfferErrorDetails({})
            }

            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {

                if (section === 'OFFER') {
                    setOfferErrorDetails((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };

    const handleAddOffer = () => {
        let error = validate('OFFER', planOfferValidationShecma, planOfferDetails);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        setPlanOfferDetails({ ...planOfferDetails, planOfferId: crypto.randomBytes(3 * 4).toString("base64") })
        setOfferList([...offerList, planOfferDetails])
        setOpen(false)
    }

    const handleUpdateOffer = (planOfferId, offerId) => {
        let error = validate('OFFER', planOfferValidationShecma, planOfferDetails);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        setOfferList([...offerList])

        if (planOfferId !== undefined) {
            setOfferItemUpdate({
                ...offerItemUpdate,
                planOfferId: planOfferId,
                offerType: planOfferDetails.offerType,
                quota: planOfferDetails.quota,
                units: planOfferDetails.units
            })
        }
        else if (offerId !== undefined) {
            setOfferItemUpdate({
                ...offerItemUpdate,
                planOfferId: offerId,
                offerType: planOfferDetails.offerType,
                quota: planOfferDetails.quota,
                units: planOfferDetails.units
            })
        }
        setOpen(false)
    }

    const [planOfferDetails, setPlanOfferDetails] =
        useState({
            'offerId': "",
            "planOfferId": "",
            "offerTypeDesc": "",
            "offerType": "",
            "quota": "",
            "units": ""
        })

    useEffect(() => {
        showSpinner()
        post(properties.BUSINESS_ENTITY_API, [
            'PLAN_OFFER_TYPE'
        ])
            .then((resp) => {
                if (resp.status === 200) {
                    if (resp.data) {
                        setPlanOfferTypeLookUp(resp.data)
                    }
                }
                else {
                    toast.error("Failed to update - " + resp.status);
                }
            }).finally(hideSpinner())



        if (viewMode === 'create') {
            offerData = {
                'offerId': "",
                "planOfferId": crypto.randomBytes(3 * 4).toString("base64"),
                "offerType": "",
                "offerTypeDesc": "",
                "quota": "",
                "units": ""
            }
        }
        else {
            if (offerItems === undefined) {
                return;
            }
            offerData = {
                'offerId': offerItems.offerId,
                "planOfferId": (offerItems.planOfferId !== undefined) ? offerItems.planOfferId :
                    (offerItems.offerId !== undefined) ? offerItems.offerId : 'No ID',
                "offerType": offerItems.offerType,
                "quota": offerItems.quota,
                "offerTypeDesc": "",
                "units": offerItems.units
            }
        }
        setPlanOfferDetails(offerData)
    }, [])
    return (

        <Modal style={customStyles} isOpen={isOpen}>

            <div className="addoff">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">{(viewMode === 'create') ? 'Add Offer' : 'Update Offer'}</h4>
                    </div>
                </div>
                <div className="form-row mt-2">
                    <div className="col-12 pl-2 bg-light border">
                        <h5 className="text-primary">Plan Offers</h5>
                    </div>
                </div>
                <div className="add-off row col-12">

                    <div className="col-md-6" >
                        <div className="form-group">
                            <label htmlFor="customerTitle" className="col-form-label">Offer ID<span>*</span></label>
                            <input type="text" disabled={(viewMode === 'edit') ? 'disabled' : ''} className={`form-control ${(offerErrorDetails.offerId ? "input-error" : "")}`} value={planOfferDetails.offerId} id="customerTitle" placeholder="offer Id"
                                onChange={(e) => {
                                    setPlanOfferDetails({ ...planOfferDetails, offerId: e.target.value })
                                }
                                }
                            />
                            <span className="errormsg">{offerErrorDetails.offerId ? offerErrorDetails.offerId : ""}</span>
                        </div>
                    </div>
                    {
                        (planOfferTypeLookUp && planOfferTypeLookUp !== null) ?
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="Surname" className="col-form-label">Offer Type<span>*</span></label>


                                    <select id="tarrifCode" value={planOfferDetails.offerType} className={`form-control ${(offerErrorDetails.offerType ? "input-error" : "")}`}
                                        onChange={e => {
                                            setPlanOfferDetails({
                                                ...planOfferDetails, offerType: e.target.value,
                                                offerTypeDesc: e.target.options[e.target.selectedIndex].label
                                            })
                                        }
                                        }>
                                        <option value="">select plan type</option>
                                        {
                                            planOfferTypeLookUp.PLAN_OFFER_TYPE.map((e) => (
                                                <option key={e.code} value={e.code}>{e.description}</option>
                                            ))
                                        }
                                    </select>
                                    <span className="errormsg">{offerErrorDetails.offerType ? offerErrorDetails.offerType : ""}</span>
                                </div>
                            </div>
                            : ""
                    }


                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="Surname" className="col-form-label">Quota<span>*</span></label>
                            <input type="text" className={`form-control ${(offerErrorDetails.quota ? "input-error" : "")}`} value={planOfferDetails.quota} id="quota" placeholder="quota"
                                onChange={(e) => {
                                    setPlanOfferDetails({ ...planOfferDetails, quota: e.target.value })
                                }
                                }
                            />
                            <span className="errormsg">{offerErrorDetails.quota ? offerErrorDetails.quota : ""}</span>
                        </div>
                    </div>
                    <div className={(viewMode === 'edit') ? "col-md-6" : "col-md-6"}>
                        <div className="form-group">
                            <label htmlFor="Surname" className="col-form-label">Units<span>*</span></label>
                            <input type="text" className={`form-control ${(offerErrorDetails.quota ? "input-error" : "")}`} value={planOfferDetails.units} id="quota" placeholder="Units"
                                onChange={(e) => {
                                    setPlanOfferDetails({ ...planOfferDetails, units: e.target.value })
                                }
                                }
                            />
                            <span className="errormsg">{offerErrorDetails.units ? offerErrorDetails.units : ""}</span>
                        </div>
                    </div>
                    <div className="mt-2 d-flex flex-row justify-content-center">
                        <button onClick={() => setOpen(false)} type="button" className="btn btn-secondary btn-sm  waves-effect waves-light ml-2">Cancel</button>
                        {
                            (viewMode === 'create') ?
                                <button onClick={handleAddOffer}
                                    type=" button" className="btn btn-primary btn-sm  waves-effect waves-light ml-2">
                                    Save
                                </button> :
                                <button onClick={() => handleUpdateOffer(offerItems.planOfferId, offerItems.offerId)}
                                    type=" button" className="btn btn-primary btn-sm  waves-effect waves-light ml-2">
                                    Save
                                </button>
                        }


                    </div>
                </div>
                <button className="close-btn" onClick={() => setOpen(false)} >&times;</button>
            </div>
        </Modal>

    )
}
export default AddPlanOfferModal