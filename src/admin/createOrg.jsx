/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { properties } from "../properties";
import { post, put } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { string, object } from "yup";

const validationSchema = object().shape({
    unitName: string().required("Please enter unit name"), //.email("Please enter a valid email"),
    unitDesc: string().required("Please enter unit description"),
    unitType: string().required("Please enter unit type"),
    // parentUnit: string().required("Please enter parent unit"),
    // flatHouseUnitNo: string().required("Please enter flat/house unit number"),
    // street: string().required("Please enter street"),
    // road: string().required("Please enter road name"),
    // city: string().required("Please enter city"),
    // town: string().required("Please enter town"),
    // state: string().required("Please enter state"),
    // district: string().required("Please enter disrict"),
    // country: string().required("Please enter country"),
    // postCode: string().required("Please enter post code"),
    // title: string().required("Please enter title"),
    // firstName: string().required("Please enter firstname"),
    // lastName: string().required("Please enter last name"),
    // contactType: string().required("Please enter contact type"),
    // contactNo: string().required("Please enter contact number"),
});

const CreateOrg = (props) => {

    const [orgFields, setOrgFields] = useState({
        unitName: "", unitDesc: "", unitType: "", parentUnit: "", flatHouseUnitNo: "", block: "", building: "", street: "", road: "",
        city: "", town: "", state: "", district: "", country: "", postCode: "", title: "", firstName: "", lastName: "", contactType: "", contactNo: ""
    });
    const [error, setError] = useState({});

    let userData = props.orgFormData.currentNodeData;

    let addressData = (userData.address && userData.address !== undefined) ? userData.address : {
        addressId: "",
        addressType: "",
        flatHouseUnitNo: "",
        block: "",
        buildingName: "",
        street: "",
        road: "",
        city: "",
        town: "",
        state: "",
        district: "",
        country: "",
        latitude: "",
        longitude: "",
        postCode: "",
        zone: ""
    };

    let contactData = (userData.contact && userData.contact !== undefined) ? userData.contact : {
        title: "",
        firstName: "",
        lastName: "",
        contactType: "",
        contactNo: ""
    };

    useEffect(
        () => {
            setOrgFields({
                unitName: userData.unitName, unitDesc: userData.unitName, unitType: userData.unitType,
                parentUnit: userData.parentUnit,
                flatHouseUnitNo: addressData.flatHouseUnitNo, block: addressData.block, building: addressData.building, street: addressData.street, road: addressData.road,
                city: addressData.cityTown, town: addressData.cityTown, state: addressData.state, district: addressData.district, country: addressData.country, postCode: addressData.postCode,
                title: contactData.title, firstName: contactData.firstName, lastName: contactData.lastName, contactType: contactData.contactType, contactNo: contactData.contactNo
            })
        },
        [userData]
    )

    const validate = () => {
        try {
            validationSchema.validateSync(orgFields, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    const createOrg = () => {
        const error = validate(validationSchema, orgFields);
        if (error) {
            return;
        }
        const address = {
            "flatHouseUnitNo": orgFields.flatHouseUnitNo,
            "block": orgFields.block,
            "building": orgFields.building,
            "street": orgFields.street,
            "road": orgFields.road,
            "city": orgFields.city,
            "town": orgFields.town,
            "state": orgFields.state,
            "district": orgFields.district,
            "country": orgFields.country,
            "postCode": orgFields.postCode
        }

        const contacts = {
            "title": orgFields.title,
            "firstName": orgFields.firstName,
            "lastName": orgFields.lastName,
            "contactType": orgFields.contactType,
            "contactNo": orgFields.contactNo
        }

        const orgDatas = {
            "unitId": props.currentNode.currentNodeId,
            "unitName": orgFields.unitName,
            "unitDesc": orgFields.unitDesc,
            "unitType": orgFields.unitType,
            "parentUnit": orgFields.parentUnit,
            "mappingPayload": [{}],
            "address": address,
            "contact": contacts,
            "contactId": contactData.contactId,
            "addressId": addressData.addressId
        }

        showSpinner();
        if (props.isCreate) {
            post(properties.ORGANIZATION_CREATE, orgDatas)
                .then((resp) => {
                    if (resp.data) {
                        props.updateTreeView(resp.data);
                        toast.success(resp.message);
                    } else {
                        toast.error("Failed, Please try again");
                    }
                }

                )
                .finally(hideSpinner);
        } else {
            put(properties.ORGANIZATION_CREATE + "/" + props.currentNode.currentNodeId, orgDatas)
                .then((resp) => {
                    if (resp.status === 200) {
                        toast.success(resp.message);
                    } else {
                        toast.error("Failed, Please try again");
                    }
                })
                .finally(hideSpinner);
        }
    }

    return (
        <div className="new-customer admin-user col-md-12">
            <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">
                <div style={{ marginTop: "0px" }}>
                    {/* <h3>Create Organisation</h3> */}
                    <div className="row">
                        <form action="#">
                            <div className="col-md-12">
                                <div className="row"><section className="triangle"><h4 id="list-item-0" className="pl-2">User Details</h4></section></div>
                                <div className="user-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Unit Name</label>
                                                <input type="text" className="form-control"
                                                    data-test="unitName"
                                                    value={orgFields.unitName}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, unitName: e.target.value });
                                                        props.textlabel(e.target.value);
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.unitName ? <p className="error-msg">{error.unitName}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Unit Description</label>
                                                <input type="text" className="form-control"
                                                    data-test="unitDesc"
                                                    value={orgFields.unitDesc}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, unitDesc: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.unitDesc ? <p className="error-msg">{error.unitDesc}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Unit Type</label>
                                                <input disabled={true} type="text" className="form-control disabled"
                                                    value={orgFields.unitType}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, unitType: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.unitType ? <p className="error-msg">{error.unitType}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Parent Unit</label>
                                                <input disabled={true} type="text" className="form-control disabled"
                                                    value={orgFields.parentUnit}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, parentUnit: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.parentUnit ? <p className="error-msg">{error.parentUnit}</p> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <fieldset className="scheduler-border">
                                <legend className="scheduler-border">Address</legend>
                                <div className="col-md-12">
                                    <div className="user-block">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Flat/House/UnitNo
                                                    </label>
                                                    <input type="text" className="form-control"
                                                        value={orgFields.flatHouseUnitNo}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, flatHouseUnitNo: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.flatHouseUnitNo ? <p className="error-msg">{error.flatHouseUnitNo}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Block</label>
                                                    <input type="text" className="form-control"
                                                        value={orgFields.block}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, block: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Building</label>
                                                    <input type="text" className="form-control" value={orgFields.building}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, building: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.building ? <p className="error-msg">{error.building}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Street</label>
                                                    <input type="text" className="form-control" value={orgFields.street}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, street: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.street ? <p className="error-msg">{error.street}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Road</label>
                                                    <input type="text" className="form-control"
                                                        value={orgFields.road}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, road: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.road ? <p className="error-msg">{error.road}</p> : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">City</label>
                                                    <input type="text" className="form-control"
                                                        value={orgFields.city}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, city: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.city ? <p className="error-msg">{error.city}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Town</label>
                                                    <input type="text" className="form-control" value={orgFields.town}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, town: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.town ? <p className="error-msg">{error.town}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">State</label>
                                                    <input type="text" className="form-control" value={orgFields.state}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, state: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.state ? <p className="error-msg">{error.state}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">District</label>
                                                    <input type="text" className="form-control" value={orgFields.district}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, district: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.district ? <p className="error-msg">{error.district}</p> : ""}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">Country</label>
                                                    <input type="text" className="form-control" value={orgFields.country}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, country: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.country ? <p className="error-msg">{error.country}</p> : ""}
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label className="control-label">PostCode</label>
                                                    <input type="text" className="form-control" value={orgFields.postCode}
                                                        onChange={(e) => {
                                                            setOrgFields({ ...orgFields, postCode: e.target.value });
                                                        }}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") createOrg();
                                                        }}
                                                    />
                                                    {error.postCode ? <p className="error-msg">{error.postCode}</p> : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <div className="col-md-12">
                                <div className="row"><section className="triangle"><h4 id="list-item-0" className="pl-2">Contact</h4></section ></div >
                                <div className="user-block">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Title</label>
                                                <input type="text" className="form-control" value={orgFields.title}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, title: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.title ? <p className="error-msg">{error.title}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">First Name</label>
                                                <input type="text" className="form-control" value={orgFields.firstName}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, firstName: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.firstName ? <p className="error-msg">{error.firstName}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Last Name</label>
                                                <input type="text" className="form-control" value={orgFields.lastName}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, lastName: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.lastName ? <p className="error-msg">{error.lastName}</p> : ""}
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Contact Type</label>
                                                <input type="text" className="form-control" value={orgFields.contactType}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, contactType: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.contactType ? <p className="error-msg">{error.contactType}</p> : ""}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label className="control-label">Contact No</label>
                                                <input type="text" className="form-control" value={orgFields.contactNo}
                                                    onChange={(e) => {
                                                        setOrgFields({ ...orgFields, contactNo: e.target.value });
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter") createOrg();
                                                    }}
                                                />
                                                {error.contactNo ? <p className="error-msg">{error.contactNo}</p> : ""}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                            <div className="form-group mb-0 text-center">
                                <button className="col-md-2 btn btn-primary" type="button" data-test="login" onClick={createOrg}>
                                    {(props.isCreate) ? "Create" : "Update"}
                                </button>
                            </div>
                        </form >
                        <br></br>
                    </div >
                </div >
            </div >
        </div >
    );
}

export default CreateOrg;