import React, { useState } from 'react'
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';
import AddPlanOfferModal from './addOfferModal';
import edit from '../assets/images/edit.png';

function OfferCardView(props) {

    const { t } = useTranslation();

    const offerItems = props.data.offerItems
    const offerList = props.data.offerList
    const setOfferList = props.deleteHandler.setOfferList
    const index = props.data.id
    const viewMode = props.viewMode;
    const formMode = props.formMode

    //for update offer
    const offerItemUpdate = props.data.offerItemUpdate
    const setOfferItemUpdate = props.deleteHandler.setOfferItemUpdate
    //for delete offer ids handle vaiable
    const setDeletedIDS = props.deleteHandler.setDeletedIDS
    const deletedIds = props.data.deletedIds


    const [openofferModal, setOfferOpenModal] = useState(false)

    const handleDelete = (val, itemID, offeredItemId) => {
        if (offeredItemId !== undefined) {
            if (!isNaN(offeredItemId)) {
                setDeletedIDS([...deletedIds, offeredItemId])
            }
            else {
            }
        }

        if (offerList.length > 0) {

            const newTasks = [...offerList];
            newTasks.splice(val.idx, 1);
            setOfferList(newTasks);
            toast.success('Offer Card Deletd Successfully')
        }

    }
    return (
        <div className="item">
            <div className="card border bg-secondary rainbow">
                <div className="card-header bg-primary bold text-white">
                    <div >
                        <span className="card-header bg-primary bold text-white float-left"> Offer Details&nbsp;</span>

                        {(offerItems.planId !== undefined) ?
                            <span
                                className="card-header bg-primary bold text-white float-left"> Plan ID :&nbsp;{offerItems.planId}
                            </span> : ''
                        }

                        {(viewMode === 'Form' && offerItems.planId === undefined) ?
                            <span onClick={() => handleDelete(index, offerItems.id, offerItems.planOfferId)} className="card-header bg-primary bold text-white cursor-pointer float-right"> X </span>
                            : ''}
                        {(viewMode === 'Form' && offerItems.planId === undefined) ?
                            <span
                                className="card-header bg-primary bold text-white cursor-pointer float-right">
                                <img src={edit} alt="" height="23" onClick={() =>
                                    setOfferOpenModal(true)} />
                            </span> : ""}
                    </div>

                </div>
                <div className="card-body" style={{ height: '20%' }}>
                    <div className="row ml-4">
                        <div className="col-12">

                            {
                                (offerItems.offerId !== undefined || offerItems.planOfferId !== undefined) ?
                                    <>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Offer Id</label>
                                            </div>
                                            {/* <div className="col-7 pt-1">{
                                                (offerItems.offerId !== undefined) ?
                                                    offerItems.offerId : (offerItems.planOfferId !== undefined) ?
                                                        offerItems.planOfferId : "No Offer ID"
                                            }
                                            </div> */}
                                            <div className="col-7 pt-1">{
                                                (offerItems.planOfferId !== undefined) ?
                                                    offerItems.offerId : "No Offer ID"
                                            }
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Offer Type</label>
                                            </div>
                                            <div className="col-7 pt-1"><p>{offerItems.offerType}</p></div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Quota</label>
                                            </div>
                                            <div className="col-7">
                                                <p className="pt-1">
                                                    {
                                                        offerItems.quota
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-5">
                                                <label className="col-form-label">Units</label>
                                            </div>
                                            <div className="col-7">
                                                <p className="pt-1">
                                                    {
                                                        offerItems.units
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                    </>
                                    :
                                    <></>
                            }
                        </div>
                    </div>
                    <div>
                        {(viewMode !== 'Preview') ?
                            <div style={{ display: 'none' }} className="col-12 text-center p-1 popup-btn">
                                <button type="button"
                                    onClick={() =>
                                        setOfferOpenModal(true)}
                                    className="btn btn btn-primary p-1">EDIT
                                </button>
                            </div> : ''}
                        {/* Add Offer Modal class for Update value of offer */}
                        <AddPlanOfferModal
                            data={{
                                isOpen: openofferModal,
                                offerList: offerList,
                                offerItemUpdate: offerItemUpdate

                            }}
                            handler={{
                                setOpen: setOfferOpenModal,
                                setOfferList: setOfferList,
                                setOfferItemUpdate: setOfferItemUpdate
                            }}
                            offerItems={offerItems}
                            viewMode={'edit'}

                        />
                    </div>
                </div>
            </div>
        </div>

    )

}
export default OfferCardView;
