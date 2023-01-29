import React, { useEffect, useState } from 'react';
import { properties } from "../properties";
import { post, put } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";

import { string, object } from "yup";
import UnitAddressForm from '../customer/addressForm';
import UnitAddressPreview from '../customer/addressPreview';
import { validateNumber, handlePaste } from '../util/validateUtil';

const unitDetailsValidationSchema = object().shape({
    unitName: string().required("Please enter unit name"),
    unitDesc: string().required("Please enter unit description"),
    title: string().required("Please enter contact title"),
    firstName: string().required("Please enter first name"),
    lastName: string().required("Please enter last name"),
    contactType: string().required("Please select contact type"),
    contactNo: string().required("Please enter contact number"),
});

const addressValidationSchema = object().shape({
    flatHouseUnitNo: string().required("Flat/House/Unit No is required"),
    street: string().required("Street is required"),
    road: string().required("Road is required"),
    district: string().required("District is required"),
    village: string().required("Kampong is required"),
    cityTown: string().required("City/Town is required"),
    postCode: string().required("Postcode is required")
});

const UnitOverview = (props) => {
    const mode = props.data.unit
    const unit = props.data.unit
    //const [mode,setMode] = useState(props.data.unit.mode)
    const unitAddress = props.data.unitAddress

    const districtLookup = props.data.districtLookup
    const kampongLookup = props.data.kampongLookup
    const postCodeLookup = props.data.postCodeLookup

    const addressElements = props.data.addressElements

    const setUnit = props.handler.setUnit
    const setUnitAddress = props.handler.setUnitAddress
    const handleAddressChange = props.handler.handleAddressChange
    const selectUnit = props.handler.selectUnit
    const handlePostSubmit = props.handler.handlePostSubmit

    const [error, setError] = useState({});
    const [detailsValidate, setDetailsValidate] = useState({
        flatNo: true,
        block: true,
        building: true,
        simpang: true,
        jalan: true,
        mukim: true,
        city: true
    })
    const [editForm, setEditForm] = useState(props.edit)

    const validate = (schema, data) => {
        try {
            setError({})
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    const handleSubmit = () => {
        let error
        error = validate(unitDetailsValidationSchema, unit);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }

        error = validate(addressValidationSchema, unitAddress);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        let data
        if (unit.mode === 'new') {
            data = {
                unitId: unit.parentUnit + '.' + unit.unitName,
                unitName: unit.unitName,
                unitDesc: unit.unitDesc,
                unitType: unit.unitType,
                parentUnit: unit.parentUnit,
                mappingPayload: [{}],
                contact: {
                    title: unit.title,
                    firstName: unit.firstName,
                    lastName: unit.lastName,
                    contactType: unit.contactType,
                    contactNo: unit.contactNo
                },
                address: {
                    flatHouseUnitNo: unitAddress.flatHouseUnitNo,
                    block: unitAddress.block,
                    building: unitAddress.building,
                    street: unitAddress.street,
                    road: unitAddress.road,
                    cityTown: unitAddress.cityTown,
                    village: unitAddress.village,
                    state: unitAddress.state,
                    district: unitAddress.district,
                    country: unitAddress.country,
                    postCode: unitAddress.postCode
                }
            }
        } else {
            data = {
                unitId: unit.parentUnit + '.' + unit.unitName,
                unitName: unit.unitName,
                unitDesc: unit.unitDesc,
                unitType: unit.unitType,
                parentUnit: unit.parentUnit,
                mappingPayload: [{}],
                contactId: unit.contactId,
                contact: {
                    contactId: unit.contactId,
                    title: unit.title,
                    firstName: unit.firstName,
                    lastName: unit.lastName,
                    contactType: unit.contactType,
                    contactNo: unit.contactNo
                },
                addressId: unit.addressId,
                address: {
                    addressId: unit.addressId,
                    flatHouseUnitNo: unitAddress.flatHouseUnitNo,
                    block: unitAddress.block,
                    building: unitAddress.building,
                    street: unitAddress.street,
                    road: unitAddress.road,
                    cityTown: unitAddress.cityTown,
                    village: unitAddress.village,
                    state: unitAddress.state,
                    district: unitAddress.district,
                    country: unitAddress.country,
                    postCode: unitAddress.postCode
                }
            }
        }

        showSpinner();
        if (unit.mode === 'new') {
            post(properties.ORGANIZATION, data)
                .then((resp) => {
                    if (resp) {
                        if (resp.status === 200) {
                            toast.success(resp.message);
                            handlePostSubmit(unit.unitId)
                        } else {
                            toast.error(resp.message);
                        }
                    } else {
                        toast.error('Unexpected error creating unit ' + resp.statusCode);
                    }
                }).finally(hideSpinner);
        } else {
            put(properties.ORGANIZATION + "/" + unit.unitId, data)
                .then((resp) => {
                    if (resp) {
                        if (resp.status === 200) {
                            toast.success(resp.message);
                            handlePostSubmit(unit.unitId)
                        } else {
                            toast.error(resp.message);
                        }
                    } else {
                        toast.error('Unexpected error creating unit ' + resp.statusCode);
                    }
                }).finally(hideSpinner);
        }
    }

    const handleCancel = () => {
        selectUnit('')
    }

    useEffect(() => {
        if (unit.mode === "new") {
            setEditForm(true)
        }
        else {
            setEditForm(false)
        }
    }, [props.mode])

    return (
        <div className="admin-user col-md-12">
            <div className="row">
                <section className="triangle flex-fill">
                    <h4 id="list-item-0" className="pl-2">Unit Details</h4>
                </section >
            </div >
            <br></br>
            <fieldset className="scheduler-border" >
                <div className="user-block">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Unit Name</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" placeholder="Unit Name"
                                            data-test="unitName"
                                            value={unit.unitName}
                                            onChange={(e) => {
                                                setUnit({ ...unit, unitName: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.unitName}</p>
                                }
                                {error.unitName ? <p className="error-msg">{error.unitName}</p> : ""}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Unit Description</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" placeholder="Unit Description"
                                            data-test="unitDesc"
                                            value={unit.unitDesc}
                                            onChange={(e) => {
                                                setUnit({ ...unit, unitDesc: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.unitDesc}</p>
                                }

                                {error.unitDesc ? <p className="error-msg">{error.unitDesc}</p> : ""}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Unit Type</label>
                                <p>{unit && unit.unitType}</p>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Parent Unit</label>
                                <p>{unit && unit.parentUnitName}</p>
                            </div>
                        </div>
                    </div>


                </div>
                {
                    (unitAddress) ?
                        editForm ?
                            <UnitAddressForm
                                data={unitAddress}
                                lookups={{
                                    districtLookup: districtLookup,
                                    kampongLookup: kampongLookup,
                                    postCodeLookup: postCodeLookup,
                                    addressElements: addressElements
                                }}
                                error={error}
                                setError={setError}
                                setDetailsValidate={setDetailsValidate}
                                detailsValidate={detailsValidate}
                                lookupsHandler={{
                                    addressChangeHandler: handleAddressChange
                                }}
                                handler={setUnitAddress}
                                editForm={editForm}
                            />
                            :
                            <UnitAddressPreview data={{
                                title: "customer_address",
                                addressData: unitAddress
                            }}
                            />
                        :
                        <></>
                }

                <div className="row" >
                    <section className="triangle flex-fill" >
                        <h4 id="list-item-0" className="pl-2" > Contact</h4 >
                    </section >
                </div >
                <div className="user-block">
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Title</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" value={unit.title} placeholder="Contact Title"
                                            onChange={(e) => {
                                                setUnit({ ...unit, title: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.title}</p>
                                }
                                {error.title ? <p className="error-msg">{error.title}</p> : ""}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">First Name</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" value={unit.firstName} placeholder="First Name"
                                            onChange={(e) => {
                                                setUnit({ ...unit, firstName: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.firstName}</p>
                                }
                                {error.firstName ? <p className="error-msg">{error.firstName}</p> : ""}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Last Name</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" value={unit.lastName} placeholder="Last Name"
                                            onChange={(e) => {
                                                setUnit({ ...unit, lastName: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.lastName}</p>
                                }

                                {error.lastName ? <p className="error-msg">{error.lastName}</p> : ""}
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Contact Type</label>
                                {
                                    editForm ?
                                        <input type="text" className="form-control" value={unit.contactType} placeholder="Contact Type"
                                            onChange={(e) => {
                                                setUnit({ ...unit, contactType: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.contactType}</p>
                                }

                                {error.contactType ? <p className="error-msg">{error.contactType}</p> : ""}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="form-group">
                                <label className="control-label">Contact No</label>
                                {
                                    editForm ?
                                        <input type="text" id="contactNbr" className="form-control" value={unit.contactNo} placeholder="Contact No"
                                            maxLength="7"
                                            onPaste={(e) => handlePaste(e)}
                                            onKeyPress={(e) => { validateNumber(e) }}
                                            onChange={(e) => {
                                                setUnit({ ...unit, contactNo: e.target.value });
                                            }}
                                        // onKeyPress={(e) => {
                                        //     if (e.key === "Enter") handleSubmit();
                                        // }}
                                        />
                                        :
                                        <p>{unit && unit.contactNo}</p>
                                }
                                {error.contactNo ? <p className="error-msg">{error.contactNo}</p> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </fieldset >
            <div className="col-12 d-flex justify-content-center" >
                {
                    editForm ?
                        <>
                            < button className="btn btn-primary btn-md  waves-effect waves-light" type="button" onClick={handleSubmit} >
                                Submit
                            </button >
                            <button className="btn btn-secondary btn-md  waves-effect waves-light ml-2" type="button" onClick={handleCancel}>
                                Cancel
                            </button>
                        </>
                        :
                        <button className="btn btn-primary btn-md  waves-effect waves-light" type="button" onClick={() => { setEditForm(true) }}>
                            Edit
                        </button>
                }


            </div >
        </div >
    );
}



export default UnitOverview;