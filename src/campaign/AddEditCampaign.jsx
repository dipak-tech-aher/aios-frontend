import React, { useCallback, useEffect, useState, useRef } from "react";
import { properties } from "../properties";
import { useHistory } from "react-router-dom";
import { post, get, put } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { string, object } from "yup";
import { Element, Link } from 'react-scroll'
import { formatDateForBirthDate, formatISODDMMMYY } from "../util/dateUtil";
import moment from 'moment';

const AddEditCampaign = (props) => {

    const campaignValidationSchema = object().shape({
        campName: string().required("campaign Name is required"),
        serviceNo: string().required("Access Number is required"),
        campDescription: string().required("Description is required"),
        validFrom: string().required("From date is required"),
        validTo: string().test(
            "Date",
            "To date is required",
            (validTo) => (validTo !== "")
        ).test(
            "Date",
            "To date should not be less than from date",
            (validTo) => validateToDate(validTo)
        )
    });

    const { t } = useTranslation();
    const history = useHistory();
    const [error, setError] = useState({});

    const [campaign, setCampaign] = useState({
        campName: "",
        serviceNo: "",
        campDescription: "",
        validFrom: "",
        validTo: "",
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isEditInCreate, setIsEditInCreate] = useState(false);
    const [isExpire,setIsExpire] = useState(false)
    const campIdRef = useRef("")

    const getCampApiData = useCallback((campId) => {
        let apiData;
        showSpinner()
        get(properties.CAMPAIGN_API + `/${campId}`)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        apiData = resp.data
                        const validFromFormat = moment(apiData.validFrom).format('YYYY-MM-DD')
                        const validToFormat = moment(apiData.validTo).format('YYYY-MM-DD')
                        setCampaign({
                            campName: apiData.campName,
                            campDescription: apiData.campDescription,
                            serviceNo: apiData.serviceNo,
                            validFrom: validFromFormat,
                            validTo: validToFormat,
                        })
                        const todayDate = moment(new Date()).format('DD MMM YYYY')
                        if(moment(moment(apiData.validTo).format('DD MMM YYYY')).isBefore(todayDate))
                        {
                            setIsEdit(true)
                            setIsExpire(true)
                        }
                    } else {
                        toast.error("Failed to call get Campaign - " + resp.status);
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            })
            .finally(hideSpinner)
    }, [])

    useEffect(() => {
        const { state } = props.location
        if (state && state.hasOwnProperty('data')) {
            const { type, campId } = state.data;
            if (type === 'EDIT') {
                getCampApiData(campId)
            }
        }
    }, [getCampApiData, props.location])


    const validateToDate = (value) => {
        try {
            if (Date.parse(value) < Date.parse(campaign.validFrom))
                return false;
            return true
        } catch (e) {
            return false
        }
    }

    const validate = () => {
        try {
            campaignValidationSchema.validateSync(campaign, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    const addUpdateCampaign = () => {
        const error = validate(campaignValidationSchema, campaign);
        if (!error) {
            setError({})
            const type = props.location.state && props.location.state.data ? props.location.state.data.type : "";
            showSpinner();
            if (type === 'EDIT' || isEditInCreate) {
                put(`${properties.CAMPAIGN_API}/${type === 'EDIT' ? props.location.state.data.campId : campIdRef.current}`, campaign)
                    .then((resp) => {
                        if (resp.status === 200) {
                            setIsEdit(!isEdit);
                            toast.success("Campaign updated successfully");
                        }
                        else {
                            toast.error("Error while updating campaign.");
                        }
                    })
                    .finally(hideSpinner);
            }
            else {
                post(properties.CAMPAIGN_API, campaign)
                    .then((resp) => {
                        if (resp.data) {
                            setIsEdit(!isEdit);
                            setIsEditInCreate(!isEditInCreate);
                            campIdRef.current = resp.data.campId;
                            toast.success("Campaign created successfully ");
                        }
                    })
                    .finally(hideSpinner);
            }
        }
    };

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">{props.location.state && props.location.state.data ? "Edit" : "Create"} Campaign</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">
                    <div className="card-box add-camp">
                        <div className="d-flex">
                            <div className="col-md-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="compaignSection" spy={true} offset={-190} smooth={true} duration={100}>{props.location.state && props.location.state.data ? "Edit" : "Create"} Campaign</Link></li>
                                </ul>
                            </div>
                            <div className="new-customer col-md-10">
                                <div className="scrollspy-div">
                                    <Element name="compaignSection" className="element" >
                                        <div className="row">
                                            <div className="col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("Campaign")}</h4>
                                                </section>
                                            </div>
                                        </div>
                                        <div className="pt-0 mt-2 pr-2">
                                            <fieldset className="scheduler-border">
                                                <div className="form-row">
                                                    <div className="col-12 pl-2 bg-light border">
                                                        <h5 className="text-primary">Campaign Details</h5>
                                                    </div>
                                                </div>
                                                <div className="row col-12">
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label"
                                                            >
                                                                Campaign Name<span>*</span>
                                                            </label>
                                                            {
                                                                isEdit ?
                                                                    <p>{campaign.campName}</p>
                                                                    :
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control mr-2 ${error.campName ? "input-error" : ""}`}
                                                                        id="Campaign Name"
                                                                        placeholder="Campaign Name"
                                                                        value={campaign.campName}
                                                                        onChange={(e) => {
                                                                            setError({ ...error, campName: '' })
                                                                            setCampaign({
                                                                                ...campaign,
                                                                                campName: e.target.value,
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                            }
                                                            <span className="errormsg">
                                                                {error.campName ? error.campName : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label"
                                                            >
                                                                Access Number<span>*</span>
                                                            </label>
                                                            {
                                                                isEdit ?
                                                                    <p>{campaign.serviceNo}</p>
                                                                    :
                                                                    <input
                                                                        type="text"
                                                                        maxLength={15}
                                                                        className={`form-control mr-2 ${error.serviceNo ? "input-error" : ""}`}
                                                                        id="Service number"
                                                                        placeholder="Access Number"
                                                                        value={campaign.serviceNo}
                                                                        onChange={(e) => {
                                                                            setError({ ...error, serviceNo: '' })
                                                                            setCampaign({
                                                                                ...campaign,
                                                                                serviceNo: e.target.value,
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                            }
                                                            <span className="errormsg">
                                                                {error.serviceNo ? error.serviceNo : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label"
                                                            >
                                                                Campaign Description<span>*</span>
                                                            </label>
                                                            {
                                                                isEdit ?
                                                                    <p>{campaign.campDescription}</p>
                                                                    :
                                                                    <input
                                                                        type="text"
                                                                        className={`form-control mr-2 ${error.campDescription ? "input-error" : ""}`}
                                                                        id="Campaign Description"
                                                                        placeholder="Campaign Description"
                                                                        value={campaign.campDescription}
                                                                        onChange={(e) => {
                                                                            setError({ ...error, campDescription: '' })
                                                                            setCampaign({
                                                                                ...campaign,
                                                                                campDescription: e.target.value,
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                            }
                                                            <span className="errormsg">
                                                                {error.campDescription ? error.campDescription : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row col-12">
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label"
                                                            >
                                                                Campaign validity From<span>*</span>
                                                            </label>
                                                            {
                                                                isEdit ?
                                                                    <p>{formatISODDMMMYY(campaign.validFrom)}</p>
                                                                    :
                                                                    <input
                                                                        className={`form-control mr-2 ${error.validFrom ? "input-error" : ""
                                                                            }`}
                                                                        id="validFrom"
                                                                        type="date"
                                                                        min={formatDateForBirthDate(new Date())}
                                                                        value={campaign.validFrom}
                                                                        name="validFrom"
                                                                        onChange={(e) => {
                                                                            setError({ ...error, validFrom: '' })
                                                                            setCampaign({
                                                                                ...campaign,
                                                                                validFrom: e.target.value
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                            }
                                                            <span className="errormsg">
                                                                {error.validFrom ? error.validFrom : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label"
                                                            >
                                                                Campaign validity To<span>*</span>
                                                            </label>
                                                            {
                                                                isEdit ?
                                                                    <p>{formatISODDMMMYY(campaign.validTo)}</p>
                                                                    :
                                                                    <input
                                                                        className={`form-control mr-2 ${error.validTo ? "input-error" : ""
                                                                            }`}
                                                                        id="validTo"
                                                                        type="date"
                                                                        min={formatDateForBirthDate(new Date())}
                                                                        value={campaign.validTo}
                                                                        name="validTo"
                                                                        onChange={(e) => {
                                                                            setError({ ...error, validTo: '' })
                                                                            setCampaign({
                                                                                ...campaign,
                                                                                validTo: e.target.value,
                                                                            })
                                                                        }
                                                                        }
                                                                    />
                                                            }
                                                            <span className="errormsg">
                                                                {error.validTo ? error.validTo : ""}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-end mr-0">
                                                    {
                                                        isEdit ?
                                                            <button
                                                                type="submit"
                                                                disabled={isExpire}
                                                                className="btn btn-primary waves-effect waves-light mr-2"
                                                                onClick={() => setIsEdit(!isEdit)}>
                                                                Edit
                                                            </button>
                                                            :
                                                            <button
                                                                disabled={isExpire}
                                                                type="submit"
                                                                className="btn btn-primary waves-effect waves-light mr-2"
                                                                onClick={addUpdateCampaign}>
                                                                Submit
                                                            </button>
                                                    }
                                                    {
                                                        ((props.location.state && props.location.state.data.type === 'EDIT') || !isEdit) &&
                                                        <button
                                                            onClick={() => history.push(`${process.env.REACT_APP_BASE}/${props.location.state && props.location.state.data.type === 'EDIT' && "campaignlist"}`)}
                                                            className="btn btn-secondary waves-effect waves-light">
                                                            Cancel
                                                        </button>
                                                    }
                                                </div>
                                            </fieldset>
                                            <br></br>
                                        </div>
                                    </Element>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default AddEditCampaign;
