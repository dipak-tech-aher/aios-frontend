import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { formatISODateDDMMMYY, formatISODateTime, formatISODDMMMYY } from '../util/dateUtil'
import printHeader from '../assets/images/print-header.jpg'
import logo from '../assets/images/logo-dark.png'

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '75%'
    }
};

const NewCustomerPreview = React.forwardRef((props, ref) => {

    const [showHeader, setShowHeader] = useState(true)
    const newCustomerData = props.data.newCustomerData
    const plansList = props.data.plansList
    const { title, foreName, surName, customerType, companyName } = newCustomerData.current.customer
    document.title = customerType === 'BUSINESS' ? `AIOS-${companyName ? companyName : ''}` : `AIOS-${title ? `${title}.` : ''}${surName ? `${surName} ` : ''}${foreName ? `${foreName}` : ''}`
    const serviceRequestData = (props.data.serviceRequestData) ? props.data.serviceRequestData : null
    const { renderMode } = props.previewData;
    const { handleSubmit, handleNewCustomerPreviewModalClose, handlePreviewCancel, handlePrint } = props.modalStateHandlers;
    const printPreviewCssClass = customerType === 'BUSINESS' ? 'business' : 'residential';

    const handlePrintCopy = () => {
        setShowHeader(false)

        setTimeout(() => {
            handlePrint()
        },
            2000)
        setTimeout(() => {
            setShowHeader(true)
        },
            5000)
    }
    return (
        <div className="modal-content custom-app">
            <div className="modal-header">
                <h4 className="modal-title">Preview</h4>
                {
                    (renderMode.previewCancelButton === 'show') ?
                        <button type="button" className="close" onClick={() => {handlePreviewCancel();document.title="AIOS"}}>
                            <span>&times;</span>
                        </button>
                        :
                        <></>
                }
                {
                    (renderMode.previewCloseButton === 'show') ?
                        <button type="button" className="close" onClick={() => {handleNewCustomerPreviewModalClose();document.title="AIOS"}}>
                            <span>&times;</span>
                        </button>
                        :
                        <></>
                }
            </div>
            <div><hr /></div>
            <div className={`preview-box ${printPreviewCssClass}`} ref={ref}>
                <div className="modal-body ml-2 mr-2 pr-0 pl-0">
                    <fieldset className="scheduler-border2">

                        <div className="row">
                            <div className="row col-12 pb-2 text-center" style={{ backgroundImage: `url(${printHeader})`, backgroundSize: "cover" }}>
                                <div className="col-md-2 mt-2 h-logo">
                                    <img src={logo} width="120px" />
                                </div>
                                <div className="col-md-10 pt-3 text-left h-text">
                                    <h4 style={{ marginLeft: "250px" }}>Customer Application Form</h4>
                                </div>
                            </div>
                        </div>
                        <div className="row tri-sec">
                            <div className="col-12">
                                <section className="triangle">
                                    <h4 id="list-item-2" className="pl-2">
                                        Customer Details</h4>
                                </section>
                            </div>
                        </div>
                        <div className="col-12 row pr-0 break-page">
                            <div className="row col-12 pl-2">
                                {
                                    (newCustomerData.current.customer.customerType === 'RESIDENTIAL') ?
                                        <>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="inputName" className="col-form-label">Title</label>
                                                    <p>{newCustomerData.current.customer.title}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="inputName" className="col-form-label">Surname</label>
                                                    <p>{newCustomerData.current.customer.surName}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label for="inputName" className="col-form-label">Forename</label>
                                                    <p>{newCustomerData.current.customer.foreName}</p>
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <></>
                                }
                                {
                                    (newCustomerData.current.customer.customerType === 'BUSINESS') ?
                                        <>
                                            <div className="bussi comp-print col-md-9">
                                                <div className="form-group">
                                                    <label for="inputName" className="col-form-label">Company Name</label>
                                                    <p>{newCustomerData.current.customer.companyName}</p>
                                                </div>
                                            </div>
                                            <div className="col-md-2"></div>
                                        </>
                                        :
                                        <></>
                                }
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label for="inputState" className="col-form-label">Customer Type</label>
                                        <p>{newCustomerData.current.customer.customerType === 'BUSINESS' ? 'Business' : 'Residential'}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label for="inputState" className="col-form-label">Email</label>
                                        <p>{newCustomerData.current.customer.email}</p>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="form-group">
                                        <label for="inputState" className="col-form-label">{newCustomerData.current.customer.contactTypeDesc}</label>
                                        <p>{newCustomerData.current.customer.contactNbr}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 pl-2 pr-2 pt-2" id="address-form">
                                <fieldset className="scheduler-border1">
                                    <legend className="scheduler-border">Customer Address</legend>
                                    <div className="row col-md-12 p-0">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No</label>
                                                <p>{newCustomerData.current.customer.address[0].flatHouseUnitNo}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="block" className="col-form-label">Block</label>
                                                <p>{newCustomerData.current.customer.address[0].block}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="building" className="col-form-label">Building Name/Others</label>
                                                <p>{newCustomerData.current.customer.address[0].building}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="simpang" className="col-form-label">Simpang</label>
                                                <p>{newCustomerData.current.customer.address[0].street}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="jalan" className="col-form-label">Jalan</label>
                                                <p>{newCustomerData.current.customer.address[0].road}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="district" className="col-form-label">District</label>
                                                <p>{newCustomerData.current.customer.address[0].district}</p>


                                            </div>
                                        </div>
                                        <div className="col-md-3 text-left">
                                            <div className="form-group">
                                                <label for="mukim" className="col-form-label">Mukim</label>
                                                <p>{newCustomerData.current.customer.address[0].state}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="kampong" className="col-form-label">Kampong</label>
                                                <p>{newCustomerData.current.customer.address[0].village}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="cityTown" className="col-form-label">City/Town</label>
                                                <p>{newCustomerData.current.customer.address[0].cityTown}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="postcode" className="col-form-label">Postcode</label>
                                                <p>{newCustomerData.current.customer.address[0].postCode}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3 pr-align-btm">
                                            <div className="form-group">
                                                <label for="country" className="col-form-label">Country(Negra)</label>
                                                <p>{newCustomerData.current.customer.address[0].country}</p>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row pt-2"> <i className="fas fa-map-marker-alt text-primary font-18 pr-1"></i>
                                        <p className="address-line">
                                            {(newCustomerData.current.customer.address[0].flatHouseUnitNo && newCustomerData.current.customer.address[0].flatHouseUnitNo !== '') ? `${newCustomerData.current.customer.address[0].flatHouseUnitNo}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].block && newCustomerData.current.customer.address[0].block !== '') ? `${newCustomerData.current.customer.address[0].block}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].building && newCustomerData.current.customer.address[0].building !== '') ? `${newCustomerData.current.customer.address[0].building}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].street && newCustomerData.current.customer.address[0].street !== '') ? `${newCustomerData.current.customer.address[0].street}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].road && newCustomerData.current.customer.address[0].road !== '') ? `${newCustomerData.current.customer.address[0].road}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].state && newCustomerData.current.customer.address[0].state !== '') ? `${newCustomerData.current.customer.address[0].state}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].village && newCustomerData.current.customer.address[0].village !== '') ? `${newCustomerData.current.customer.address[0].village}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].cityTown && newCustomerData.current.customer.address[0].cityTown !== '') ? `${newCustomerData.current.customer.address[0].cityTown}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].district && newCustomerData.current.customer.address[0].district !== '') ? `${newCustomerData.current.customer.address[0].district}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].country && newCustomerData.current.customer.address[0].country !== '') ? `${newCustomerData.current.customer.address[0].country}, ` : ''}
                                            {(newCustomerData.current.customer.address[0].postCode && newCustomerData.current.customer.address[0].postCode !== '') ? `${newCustomerData.current.customer.address[0].postCode}` : ''}
                                        </p>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="col-12 pl-1">
                                <div className="col-12 pl-2 bg-light border pr-view">
                                    <h5 className="text-primary">Customer Property</h5>
                                </div>
                            </div>
                            <div className="form-row pl-2 col-12 pl-2 cus-prop">
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label for="category" className="col-form-label">Customer Category</label>
                                        <p>{newCustomerData.current.customer.categoryDesc}</p>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="form-group">
                                        <label for="class" className="col-form-label">Customer Class</label>
                                        <p>{newCustomerData.current.customer.classDesc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row tri-sec">
                            <div className="col-12">
                                <section className="triangle">
                                    <h4 id="list-item-2" className="pl-2">Account Details</h4>
                                </section>
                            </div>
                        </div>
                        <div className="form-row pl-2 pl-2 pr-form scd-form acc-detail">
                            {
                                (newCustomerData.current.customer.customerType === 'RESIDENTIAL') ?
                                    <>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="accountTitle" className="col-form-label">Title</label>
                                                <p>{newCustomerData.current.customer.account[0].title}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="accountSurname" className="col-form-label">Surname</label>

                                                <p>{newCustomerData.current.customer.account[0].surName}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="accountForename" className="col-form-label">Forename</label>
                                                <p>{newCustomerData.current.customer.account[0].foreName}</p>

                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="accountForename" className="col-form-label">Email</label>
                                                <p>{newCustomerData.current.customer.account[0].email}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="accountForename" className="col-form-label">{newCustomerData.current.customer.account[0].contactTypeDesc}</label>
                                                <p>{newCustomerData.current.customer.account[0].contactNbr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <div className="d-flex  flex-column">
                                                    <label for="accountmfbtn" className="col-form-label">Gender</label>
                                                    <p>{(newCustomerData.current.customer.account[0].gender === 'M') ? 'Male' : 'Female'}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="dob" className="col-form-label">Date of Birth</label>
                                                <p>{formatISODDMMMYY(newCustomerData.current.customer.account[0].dob)}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idType" className="col-form-label">ID Type</label>
                                                <p>{newCustomerData.current.customer.account[0].idTypeDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idNbr" className="col-form-label">ID Number</label>
                                                <p>{newCustomerData.current.customer.account[0].idNbr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idNbr" className="col-form-label">Priority</label>
                                                <p>{newCustomerData.current.customer.account[0].priorityDesc}</p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                (newCustomerData.current.customer.customerType === 'BUSINESS') ?
                                    <>

                                        <div className="comp-print col-md-9">
                                            <div className="form-group">
                                                <label for="accountTitle" className="col-form-label">Company Name</label>
                                                <p>{newCustomerData.current.customer.account[0].companyName}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3"></div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="email" className="col-form-label">Email</label>
                                                <p>{newCustomerData.current.customer.account[0].email}</p>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-3">
                                        <div className="form-group">
                                            <label for="contactType" className="col-form-label">Contact Type</label>
                                            <p>{newCustomerData.current.customer.account[0].contactTypeDesc}</p>
                                        </div>
                                    </div> */}
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="contactNbr" className="col-form-label">{newCustomerData.current.customer.account[0].contactTypeDesc}</label>
                                                <p>{newCustomerData.current.customer.account[0].contactNbr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="dob" className="col-form-label">Registered Date</label>
                                                <p>{formatISODDMMMYY(newCustomerData.current.customer.account[0].registeredDate)}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idType" className="col-form-label">Registered No</label>
                                                <p>{newCustomerData.current.customer.account[0].registeredNbr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idType" className="col-form-label">ID Type</label>
                                                <p>{newCustomerData.current.customer.account[0].idTypeDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="idNbr" className="col-form-label">ID Number</label>
                                                <p>{newCustomerData.current.customer.account[0].idNbr}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="priority" className="col-form-label">Priority</label>
                                                <p>{newCustomerData.current.customer.account[0].priorityDesc}</p>
                                            </div>
                                        </div>

                                    </>
                                    :
                                    <></>
                            }

                        </div>
                        <div className="form-row pl-2 pl-2 pr-form scd-form acc-detail">

                            {/* <div className="col-md-3">
                                <div className="form-group">
                                    <label for="accountClass" className="col-form-label">Account Class</label>
                                    <p>{newCustomerData.current.customer.account[0].classDesc}</p>
                                </div>
                            </div> */}
                        </div>

                        <div className="col-12 pl-1">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Account Contact</h5>
                            </div>
                        </div>

                        <div className="form-row pl-2 pl-2 pr-form acc-detail1">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="contactTitle" className="col-form-label">Title</label>
                                    <p>{newCustomerData.current.customer.account[0].contactTitle}</p>

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="contactSurname" className="col-form-label">Surname</label>
                                    <p>{newCustomerData.current.customer.account[0].contactSurName}</p>

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="contactForename" className="col-form-label">Forename</label>
                                    <p>{newCustomerData.current.customer.account[0].contactForeName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 pl-1">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Billing Address</h5>
                            </div>
                        </div>

                        <div className="col-12 pl-2 pr-2 pt-2">
                            <fieldset className="scheduler-border1 bill-add">
                                <legend className="scheduler-border">Billing Address</legend>
                                {
                                    (!newCustomerData.current.customer.account[0].billingAddress[0].sameAsCustomerAddress) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].flatHouseUnitNo}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="block" className="col-form-label">Block</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].block}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="building" className="col-form-label">Building Name/Others</label>

                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].building}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="simpang" className="col-form-label">Simpang</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].street}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="jalan" className="col-form-label">Jalan</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].road}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="district" className="col-form-label">District</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].district}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="mukim" className="col-form-label">Mukim</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].state}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="kampong" className="col-form-label">Kampong</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].village}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="cityTown" className="col-form-label">City/Town</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].cityTown}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="postcode" className="col-form-label">Postcode</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].postCode}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="country" className="col-form-label">Country(Negra)</label>
                                                        <p>{newCustomerData.current.customer.account[0].billingAddress[0].country}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row pt-2"> <i className="fas fa-map-marker-alt text-primary font-18 pr-1"></i>
                                                <p className="address-line">
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].flatHouseUnitNo && newCustomerData.current.customer.account[0].billingAddress[0].flatHouseUnitNo !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].flatHouseUnitNo}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].block && newCustomerData.current.customer.account[0].billingAddress[0].block !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].block}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].building && newCustomerData.current.customer.account[0].billingAddress[0].building !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].building}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].street && newCustomerData.current.customer.account[0].billingAddress[0].street !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].street}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].road && newCustomerData.current.customer.account[0].billingAddress[0].road !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].road}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].state && newCustomerData.current.customer.account[0].billingAddress[0].state !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].state}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].village && newCustomerData.current.customer.account[0].billingAddress[0].village !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].village}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].cityTown && newCustomerData.current.customer.account[0].billingAddress[0].cityTown !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].cityTown}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].district && newCustomerData.current.customer.account[0].billingAddress[0].district !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].district}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].country && newCustomerData.current.customer.account[0].billingAddress[0].country !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].country}, ` : ''}
                                                    {(newCustomerData.current.customer.account[0].billingAddress[0].postCode && newCustomerData.current.customer.account[0].billingAddress[0].postCode !== '') ? `${newCustomerData.current.customer.account[0].billingAddress[0].postCode}` : ''}
                                                </p>
                                            </div>

                                        </>
                                        :
                                        <></>
                                }
                                {
                                    (newCustomerData.current.customer.account[0].billingAddress[0].sameAsCustomerAddress) ?
                                        <>
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No</label>
                                                        <p>{newCustomerData.current.customer.address[0].flatHouseUnitNo}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="block" className="col-form-label">Block</label>
                                                        <p>{newCustomerData.current.customer.address[0].block}</p>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="building" className="col-form-label">Building Name/Others</label>
                                                        <p>{newCustomerData.current.customer.address[0].building}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="simpang" className="col-form-label">Simpang</label>
                                                        <p>{newCustomerData.current.customer.address[0].street}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="jalan" className="col-form-label">Jalan</label>
                                                        <p>{newCustomerData.current.customer.address[0].road}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="district" className="col-form-label">District</label>
                                                        <p>{newCustomerData.current.customer.address[0].district}</p>


                                                    </div>
                                                </div>
                                                <div className="col-md-3 text-left">
                                                    <div className="form-group">
                                                        <label for="mukim" className="col-form-label">Mukim</label>
                                                        <p>{newCustomerData.current.customer.address[0].state}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="kampong" className="col-form-label">Kampong</label>
                                                        <p>{newCustomerData.current.customer.address[0].village}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="cityTown" className="col-form-label">City/Town</label>
                                                        <p>{newCustomerData.current.customer.address[0].cityTown}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="postcode" className="col-form-label">Postcode</label>
                                                        <p>{newCustomerData.current.customer.address[0].postCode}</p>

                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label for="country" className="col-form-label">Country(Negra)</label>
                                                        <p>{newCustomerData.current.customer.address[0].country}</p>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row pt-2"> <i className="fas fa-map-marker-alt text-primary font-18 pr-1"></i>
                                                <p className="address-line">
                                                    {(newCustomerData.current.customer.address[0].flatHouseUnitNo && newCustomerData.current.customer.address[0].flatHouseUnitNo !== '') ? `${newCustomerData.current.customer.address[0].flatHouseUnitNo}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].block && newCustomerData.current.customer.address[0].block !== '') ? `${newCustomerData.current.customer.address[0].block}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].building && newCustomerData.current.customer.address[0].building !== '') ? `${newCustomerData.current.customer.address[0].building}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].street && newCustomerData.current.customer.address[0].street !== '') ? `${newCustomerData.current.customer.address[0].street}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].road && newCustomerData.current.customer.address[0].road !== '') ? `${newCustomerData.current.customer.address[0].road}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].state && newCustomerData.current.customer.address[0].state !== '') ? `${newCustomerData.current.customer.address[0].state}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].village && newCustomerData.current.customer.address[0].village !== '') ? `${newCustomerData.current.customer.address[0].village}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].cityTown && newCustomerData.current.customer.address[0].cityTown !== '') ? `${newCustomerData.current.customer.address[0].cityTown}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].district && newCustomerData.current.customer.address[0].district !== '') ? `${newCustomerData.current.customer.address[0].district}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].country && newCustomerData.current.customer.address[0].country !== '') ? `${newCustomerData.current.customer.address[0].country}, ` : ''}
                                                    {(newCustomerData.current.customer.address[0].postCode && newCustomerData.current.customer.address[0].postCode !== '') ? `${newCustomerData.current.customer.address[0].postCode}` : ''}
                                                </p>
                                            </div>

                                        </>
                                        :
                                        <></>
                                }
                            </fieldset>
                        </div>


                        <div className="col-12 pl-1">
                            <div className="col-12 bg-light border pl-2">
                                <h5 className="text-primary">Security Question</h5>
                            </div>
                        </div>
                        <div className="form-row pl-2 pr-form secure-block">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="profile" className="col-form-label">Profile</label>
                                    <p>{newCustomerData.current.customer.account[0].securityData.securityQuestionDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="profileValue" className="col-form-label">Profile Value</label>
                                    <p>{newCustomerData.current.customer.account[0].securityData.securityAnswer}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 pl-1">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Account Property</h5>
                            </div>
                        </div>
                        <div className="form-row pl-2 pr-form scd-form acc-detail2 break-page">
                            <div className="col-md-3 pr-align3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">Account Class</label>
                                    <p>{newCustomerData.current.customer.account[0].classDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">Account Category</label>
                                    <p>{newCustomerData.current.customer.account[0].categoryDesc}</p>
                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">Base Plan Collection</label>
                                    <p>{newCustomerData.current.customer.account[0].baseCollPlanDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">Bill Language</label>
                                    <p>{newCustomerData.current.customer.account[0].billOptions.billLanguageDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">Bill Delivery Method</label>
                                    <p>{newCustomerData.current.customer.account[0].billOptions.billDeliveryMethodDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="category" className="col-form-label">No of Copies</label>
                                    <p>{newCustomerData.current.customer.account[0].billOptions.noOfCopies}</p>
                                </div>
                            </div>
                        </div>

                        <div className="row tri-sec">
                            <div className="col-12">
                                <section className="triangle">
                                    <h4 id="list-item-2" className="pl-2">Service Details</h4>
                                </section>
                            </div>
                        </div>
                        <div><br></br></div>
                        <div className="col-12 pl-1">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Service Selection Details</h5>
                            </div>
                        </div>

                        <div className="form-row pl-2 pr-form secure-block">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="catalog" className="col-form-label">Catalog</label>
                                    <p>{newCustomerData.current.customer.account[0].service[0].catalogDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label for="product30" className="col-form-label">Product</label>
                                    <p>{newCustomerData.current.customer.account[0].service[0].hasOwnProperty('productDesc') && newCustomerData.current.customer.account[0].service[0].productDesc}</p>
                                </div>
                            </div>
                        </div>
                        {
                            (newCustomerData.current.customer.account[0].service[0].product !== '') ?
                                <>
                                    <div className="col-12 pl-1">
                                        <div className="col-12 pl-2 bg-light border">
                                            <h5 className="text-primary">Selected Plan Details</h5>
                                        </div>
                                    </div>
                                    {
                                        plansList.current.map((p) => {
                                            return (
                                                (Number(p.planId) === Number(newCustomerData.current.customer.account[0].service[0].product)) ?
                                                    <div className="row mt-2 select-plan">
                                                        <div className="col-lg-6">
                                                            <div className="card card-body border p-0">
                                                                <div className="d-flex justify-content-center card-header p-0">
                                                                    <h5>{p.planName}</h5>
                                                                </div>
                                                                <div className="text-center pt-1 pb-2 pl-2">
                                                                    <div className="col-12">
                                                                        <div className="row">
                                                                            <div className="col-md-5">
                                                                                <label className="col-form-label">ServiceType</label>
                                                                            </div>
                                                                            <div className="col-md-7 pt-2">
                                                                                <p>{p.prodType}</p>
                                                                            </div>
                                                                        </div >
                                                                        <div className="row" >
                                                                            <div className="col-md-5" >
                                                                                <label className="col-form-label" > Plan</label >
                                                                            </div >
                                                                            <div className="col-md-7 pt-2" >
                                                                                <p>{p.planName}</p>
                                                                            </div >
                                                                        </div >
                                                                    </div >
                                                                    {
                                                                        (p.charge) ?
                                                                            <div className="row" >
                                                                                <div className="col-md-5" >
                                                                                    <label className="col-form-label" > Rental</label >
                                                                                </div >
                                                                                <div className="col-md-7 pt-1" >
                                                                                    <p>${p.charge}</p>
                                                                                </div >
                                                                            </div >
                                                                            :
                                                                            <></>
                                                                    }
                                                                </div >
                                                                <div className="mt-1 table-responsive pl-2 pr-2">
                                                                    <table className="table border">

                                                                        <thead>
                                                                            <tr className="bg-light">
                                                                                <th className="text-center">Type</th>
                                                                                <th className="text-center">Quota</th>
                                                                                <th className="text-center">Units</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {
                                                                                p.planoffer && p.planoffer.map((o) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td className="text-center bold">{o.offerType}</td>
                                                                                            <td className="text-center">{o.quota}</td>
                                                                                            <td className="text-center">{o.units}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                            {
                                                                                p.offers && p.offers.map((o) => {
                                                                                    return (
                                                                                        <tr>
                                                                                            <td className="text-center bold">{o.offerType}</td>
                                                                                            <td className="text-center">{o.quota}</td>
                                                                                            <td className="text-center">{o.units}</td>
                                                                                        </tr>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div >
                                                        </div >
                                                    </div >

                                                    :
                                                    <></>
                                            )
                                        })
                                    }
                                </>
                                :
                                <></>
                        }


                        <div><br></br></div>

                        {
                            (newCustomerData.current.customer.account[0].service[0].prodType === 'Fixed') ?
                                <>
                                    <div className="col-12 pl-1">
                                        <div className="col-12 pl-2 bg-light border install-add">
                                            <h5 className="text-primary">Installation Address</h5>
                                        </div>
                                    </div>

                                    <div className="mt-2">
                                        <div className="col-12 pl-2 pr-2 pt-2">
                                            <fieldset className="scheduler-border1 prv-top">
                                                <legend className="scheduler-border">Installation Address</legend>
                                                {
                                                    (!newCustomerData.current.customer.account[0].service[0].installationAddress[0].sameAsCustomerAddress) ?
                                                        <>
                                                            <div className="row col-md-12 p-0">
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].flatHouseUnitNo}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="block" className="col-form-label">Block</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].block}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="building" className="col-form-label">Building Name/Others</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].building}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="simpang" className="col-form-label">Simpang</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].street}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3 pr-align2">
                                                                    <div className="form-group">
                                                                        <label for="jalan" className="col-form-label">Jalan</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].road}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="district" className="col-form-label">District</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].district}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="mukim" className="col-form-label">Mukim</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].state}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="kampong" className="col-form-label">Kampong</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].village}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="cityTown" className="col-form-label">City/Town</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].cityTown}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="postcode" className="col-form-label">Postcode</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].postCode}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="country" className="col-form-label">Country(Negra)</label>
                                                                        <p>{newCustomerData.current.customer.account[0].service[0].installationAddress[0].country}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row pt-2">
                                                                <i className="fas fa-map-marker-alt text-primary font-18 pr-1"></i>
                                                                <p className="address-line">
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].flatHouseUnitNo && newCustomerData.current.customer.account[0].service[0].installationAddress[0].flatHouseUnitNo !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].flatHouseUnitNo}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].block && newCustomerData.current.customer.account[0].service[0].installationAddress[0].block !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].block}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].building && newCustomerData.current.customer.account[0].service[0].installationAddress[0].building !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].building}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].street && newCustomerData.current.customer.account[0].service[0].installationAddress[0].street !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].street}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].road && newCustomerData.current.customer.account[0].service[0].installationAddress[0].road !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].road}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].state && newCustomerData.current.customer.account[0].service[0].installationAddress[0].state !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].state}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].village && newCustomerData.current.customer.account[0].service[0].installationAddress[0].village !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].village}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].cityTown && newCustomerData.current.customer.account[0].service[0].installationAddress[0].cityTown !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].cityTown}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].district && newCustomerData.current.customer.account[0].service[0].installationAddress[0].district !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].district}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].country && newCustomerData.current.customer.account[0].service[0].installationAddress[0].country !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].country}, ` : ''}
                                                                    {(newCustomerData.current.customer.account[0].service[0].installationAddress[0].postCode && newCustomerData.current.customer.account[0].service[0].installationAddress[0].postCode !== '') ? `${newCustomerData.current.customer.account[0].service[0].installationAddress[0].postCode}` : ''}
                                                                </p>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    (newCustomerData.current.customer.account[0].service[0].installationAddress[0].sameAsCustomerAddress) ?
                                                        <>
                                                            <div className="row">
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No</label>
                                                                        <p>{newCustomerData.current.customer.address[0].flatHouseUnitNo}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="block" className="col-form-label">Block</label>
                                                                        <p>{newCustomerData.current.customer.address[0].block}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="building" className="col-form-label">Building Name/Others</label>
                                                                        <p>{newCustomerData.current.customer.address[0].building}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="simpang" className="col-form-label">Simpang</label>
                                                                        <p>{newCustomerData.current.customer.address[0].street}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="jalan" className="col-form-label">Jalan</label>
                                                                        <p>{newCustomerData.current.customer.address[0].road}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="district" className="col-form-label">District</label>
                                                                        <p>{newCustomerData.current.customer.address[0].district}</p>


                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3 text-left">
                                                                    <div className="form-group">
                                                                        <label for="mukim" className="col-form-label">Mukim</label>
                                                                        <p>{newCustomerData.current.customer.address[0].state}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="kampong" className="col-form-label">Kampong</label>
                                                                        <p>{newCustomerData.current.customer.address[0].village}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="cityTown" className="col-form-label">City/Town</label>
                                                                        <p>{newCustomerData.current.customer.address[0].cityTown}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="postcode" className="col-form-label">Postcode</label>
                                                                        <p>{newCustomerData.current.customer.address[0].postCode}</p>

                                                                    </div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <div className="form-group">
                                                                        <label for="country" className="col-form-label">Country(Negra)</label>
                                                                        <p>{newCustomerData.current.customer.address[0].country}</p>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row pt-2"> <i className="fas fa-map-marker-alt text-primary font-18 pr-1"></i>
                                                                <p className="address-line">
                                                                    {(newCustomerData.current.customer.address[0].flatHouseUnitNo && newCustomerData.current.customer.address[0].flatHouseUnitNo !== '') ? `${newCustomerData.current.customer.address[0].flatHouseUnitNo}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].block && newCustomerData.current.customer.address[0].block !== '') ? `${newCustomerData.current.customer.address[0].block}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].building && newCustomerData.current.customer.address[0].building !== '') ? `${newCustomerData.current.customer.address[0].building}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].street && newCustomerData.current.customer.address[0].street !== '') ? `${newCustomerData.current.customer.address[0].street}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].road && newCustomerData.current.customer.address[0].road !== '') ? `${newCustomerData.current.customer.address[0].road}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].state && newCustomerData.current.customer.address[0].state !== '') ? `${newCustomerData.current.customer.address[0].state}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].village && newCustomerData.current.customer.address[0].village !== '') ? `${newCustomerData.current.customer.address[0].village}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].cityTown && newCustomerData.current.customer.address[0].cityTown !== '') ? `${newCustomerData.current.customer.address[0].cityTown}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].district && newCustomerData.current.customer.address[0].district !== '') ? `${newCustomerData.current.customer.address[0].district}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].country && newCustomerData.current.customer.address[0].country !== '') ? `${newCustomerData.current.customer.address[0].country}, ` : ''}
                                                                    {(newCustomerData.current.customer.address[0].postCode && newCustomerData.current.customer.address[0].postCode !== '') ? `${newCustomerData.current.customer.address[0].postCode}` : ''}
                                                                </p>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }


                                            </fieldset>
                                        </div>
                                    </div>
                                    <div className="col-12 pl-1">
                                        <div className="col-12 pl-2 bg-light border ">
                                            <h5 className="text-primary">Service Details</h5>
                                        </div>
                                    </div>
                                    <div className="form-row pl-2 pr-form secure-block padd-left">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label for="svcNbrGroup" className="col-form-label">Service Number Group</label>
                                                <p>{newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberGroupDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label for="exchangeCode" className="col-form-label">Exchange Code</label>
                                                <p>{newCustomerData.current.customer.account[0].service[0].fixed.exchangeCodeDesc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                                :
                                <></>
                        }

                        {
                            (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType)) ?
                                <div id="mobile30">
                                    <div className="col-12 pl-1">
                                        <div className="col-12 pl-2 bg-light border ">
                                            <h5 className="text-primary">Dealership</h5>
                                        </div>
                                    </div>
                                    <div className="row acc-detail4">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="dealership" className="col-form-label">Dealership</label>
                                                <p>{newCustomerData.current.customer.account[0].service[0].mobile.dealershipDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="nbrGroup" className="col-form-label">Number Group</label>
                                                <p>{newCustomerData.current.customer.account[0].service[0].mobile.nbrGroupDesc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                        <div className="col-12 pl-1">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Access Number Selection</h5>
                            </div>
                        </div>
                        <div className="row pr-form padd-left serve-num">
                            {
                                (newCustomerData.current.customer.account[0].service[0].prodType === 'Fixed' && newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection === 'auto') ?
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label for="iccid" className="col-form-label">Auto Selection from Pool</label>
                                            <p>Yes</p>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                (newCustomerData.current.customer.account[0].service[0].prodType === 'Fixed' && newCustomerData.current.customer.account[0].service[0].fixed.serviceNumberSelection === 'manual') ?
                                    <>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">Manual Selection from Pool</label>
                                                <p>Yes</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">Access Number</label>
                                                {
                                                    (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType)) ?
                                                        <p>{newCustomerData.current.customer.account[0].service[0].mobile.accessNbr}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    (newCustomerData.current.customer.account[0].service[0].prodType === 'Fixed') ?
                                                        <p>{newCustomerData.current.customer.account[0].service[0].fixed.accessNbr}</p>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType) && newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection === 'auto') ?
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label for="iccid" className="col-form-label">Auto Selection from Pool</label>
                                            <p>Yes</p>
                                        </div>
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType) && newCustomerData.current.customer.account[0].service[0].mobile.serviceNumberSelection === 'manual') ?
                                    <>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">Manual Selection from Pool</label>
                                                <p>Yes</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">Access Number</label>
                                                {
                                                    (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType)) ?
                                                        <p>{newCustomerData.current.customer.account[0].service[0].mobile.accessNbr}</p>
                                                        :
                                                        <></>
                                                }
                                                {
                                                    (newCustomerData.current.customer.account[0].service[0].prodType === 'Fixed') ?
                                                        <p>{newCustomerData.current.customer.account[0].service[0].fixed.accessNbr}</p>
                                                        :
                                                        <></>
                                                }
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                        </div>

                        <br></br>
                        <div className="row pr-form padd-left serve-num" >
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="nbrGroup" className="col-form-label">Credit Profile</label>
                                    <p>{newCustomerData.current.customer.account[0].service[0].creditProfileDesc}</p>
                                </div>
                            </div>
                        </div >
                        {
                            (['Prepaid', 'Postpaid'].includes(newCustomerData.current.customer.account[0].service[0].prodType)) ?
                                <div id="mobile30">
                                    <div className="col-12 pl-1">
                                        <div className="col-12 pl-2 bg-light border ">
                                            <h5 className="text-primary">GSM Details</h5>
                                        </div>
                                    </div>
                                    <div className="row acc-detail4">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">Assign SIM Later</label>
                                                <p>{(newCustomerData.current.customer.account[0].service[0].mobile.gsm.assignSIMLater === 'Y') ? 'Yes' : 'No'}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="iccid" className="col-form-label">ICCID</label>
                                                <p className="donor">{newCustomerData.current.customer.account[0].service[0].mobile.gsm.iccid}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label for="imsi" className="col-form-label">IMSI</label>
                                                <p className="donor">{newCustomerData.current.customer.account[0].service[0].mobile.gsm.imsi}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                        {
                            (newCustomerData.current.customer.account[0].service[0].prodType !== 'Prepaid') ?
                                <>
                                    <div className="col-12 pl-1 deps">
                                        <div className="col-12 pl-2 bg-light border">
                                            <h5 className="text-primary">Deposit</h5>
                                        </div>
                                    </div>
                                    <div className="row col-12 break-page padd-left serve-num">
                                        {
                                            (newCustomerData.current.customer.account[0].service[0].deposit.includeExclude === 'include') ?
                                                <>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label for="excludeReason" className="col-form-label">Include</label>
                                                            <p>Yes</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label for="charge" className="col-form-label">Charge</label>
                                                            <p>{newCustomerData.current.customer.account[0].service[0].deposit.chargeDesc}</p>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <></>
                                        }
                                        {
                                            (newCustomerData.current.customer.account[0].service[0].deposit.includeExclude === 'exclude') ?
                                                <>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label for="excludeReason" className="col-form-label">Exclude</label>
                                                            <p>Yes</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label for="charge" className="col-form-label">Reason</label>
                                                            <p>{newCustomerData.current.customer.account[0].service[0].deposit.excludeReason}</p>
                                                        </div>
                                                    </div>
                                                </>
                                                :
                                                <></>
                                        }
                                    </div>
                                </>
                                :
                                <></>
                        }

                        <div className="col-12 pl-1 pay-meth">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Payment Method</h5>
                            </div>
                        </div>
                        <div className="row col-12 padd-left acc-detail2">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="paymentMethod" className="col-form-label">Payment Method</label>
                                    <p>{newCustomerData.current.customer.account[0].service[0].paymentMethodDesc}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 pl-1 prev-port">
                            <div className="col-12 pl-2 bg-light border ">
                                <h5 className="text-primary">Portin</h5>
                            </div>
                        </div>
                        <div className="row col-12 padd-left acc-detail2">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="portIn" className="col-form-label">Port In</label>
                                    <p>{newCustomerData.current.customer.account[0].service[0].portIn.portInChecked}</p>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label for="donor" className="col-form-label">Donor</label>
                                    <p className="donor">{newCustomerData.current.customer.account[0].service[0].portIn.donorDesc}</p>
                                </div>
                            </div>
                        </div>

                        {
                            renderMode.serviceWorkOrderSection === 'show' &&
                            <>
                                <div className="row tri-sec">
                                    <div className="col-12">
                                        <section className="triangle">
                                            <h4 id="list-item-2" className="pl-2">Service Request</h4>
                                        </section>
                                    </div>
                                </div>
                                <div className="col-12 pl-1 mt-2">
                                    <div className="col-12 pl-2 bg-light border ">
                                        <h5 className="text-primary">Work Order Details</h5>
                                    </div>
                                </div>
                                <div className="col-12 pl-1 acc-detail">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Service Request Number</label>
                                                <p>{serviceRequestData && serviceRequestData.interactionId !== null && serviceRequestData.interactionId}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Work Order Type</label>
                                                <p>{serviceRequestData && serviceRequestData.woTypeDesc !== null &&  serviceRequestData.woTypeDesc}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Access Number</label>
                                                <p>{serviceRequestData && serviceRequestData.accessNumber !== null &&  serviceRequestData.accessNumber}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Service Type</label>
                                                <p>{serviceRequestData && serviceRequestData.serviceType !== null &&  serviceRequestData.serviceType}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Created On</label>
                                                <p>{serviceRequestData && serviceRequestData.createdOn !== null &&  formatISODateTime(serviceRequestData.createdOn)}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Created By</label>
                                                <p>{serviceRequestData && serviceRequestData.createdBy !== null &&  serviceRequestData.createdBy}</p>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">SR Current Status</label>
                                                <p>{serviceRequestData && serviceRequestData.status !== null &&  serviceRequestData.status}</p>
                                            </div>
                                        </div>
                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Work Order Number</label>
                                                <p>
                                                    {
                                                        (serviceRequestData.externalRefNo1) ?
                                                            serviceRequestData.externalRefSys1 + '/' + serviceRequestData.externalRefNo1
                                                            :
                                                            ''
                                                    }
                                                </p>
                                            </div>
                                        </div> */}
                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Work Order Type</label>
                                                <p>{serviceRequestData.interactionType}</p>
                                            </div>
                                        </div> */}
                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woType" className="col-form-label">Work Order Current Department</label>
                                                <p>-</p>
                                            </div>
                                        </div> */}
                                        {/* <div className="col-md-4">
                                            <div className="form-group">
                                                <label for="woStatus" className="col-form-label">Work Order Status</label>
                                                <p>{serviceRequestData.status}</p>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </>
                        }
                    </fieldset >
                </div >
            </div >
            <div className="modal-body ml-2 mr-2 pr-0 pl-0">
                <div className="form-row pl-2 mt-2 justify-content-center">
                    {
                        (renderMode.printButton === 'show') ?
                            <button type="button" onClick={handlePrint} className="btn btn-primary btn-md  waves-effect waves-light">Print</button>
                            :
                            <></>
                    }
                    {
                        (renderMode.submitButton === 'show') ?
                            <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>
                            :
                            <></>
                    }
                    {
                        (renderMode.previewCancelButton === 'show') ?
                            <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={() => {handlePreviewCancel();document.title="AIOS"}}>Cancel</button>
                            :
                            <></>
                    }
                    {
                        (renderMode.previewCloseButton === 'show') ?
                            <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={() => {handleNewCustomerPreviewModalClose();document.title="AIOS"}}>Close</button>
                            :
                            <></>
                    }
                </div>
            </div>
        </div >
    )
})

export default NewCustomerPreview;

