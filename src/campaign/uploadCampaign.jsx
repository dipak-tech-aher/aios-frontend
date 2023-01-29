import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll';
import * as XLSX from "xlsx";
import { get, post } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { properties } from "../properties";
import DynamicTable from '../common/table/DynamicTable';
import CampaignUploadList from './campaignUploadList';
import { string, object, array } from "yup";
import { useTranslation } from "react-i18next";
import CampaignUploadTemplate from './campaignUploadTemplate.xlsx'
import { formatISODateDDMMMYY, formatISODDMMMYY } from "../util/dateUtil";
import moment from 'moment';

function UploadCampaign() {
    const history = useHistory();
    const [error, setError] = useState(false);
    const [preview, setPreview] = useState(false);
    const { t } = useTranslation();
    const [campaign, setCampaign] = useState([]);
    const [file, setFile] = useState();
    let arrayCamps = []
    const [ServiceNumbers, setServiceNumbers] = useState([]);
    const [terminatedNumbers,setTerminatedNumbers] = useState([]);
    const [campaignNames,setCampaignNames] = useState([])
    const campaignValidationSchema = object().shape({
        file: string().required("file Name is required"),
    });

    useEffect(() => {

        showSpinner();
        get(properties.CONNECTION_API)
            .then((resp) => {
                if (resp.status == 200) {
                    setServiceNumbers(resp.data)
                } else {

                }
            })
            .finally(hideSpinner);
        post(`${properties.CAMPAIGN_API}/list?allNames=`+true)
            .then((response) => {
                setCampaignNames(response.data)

            })
            .finally(hideSpinner)
    }, []);


    const readExcel = () => {

        let fi = document.getElementById('file');
        var extension = file.name.substr(file.name.lastIndexOf('.'));
        if ((extension.toLowerCase() === ".xls") ||
            (extension.toLowerCase() === ".xlsx")
        ) {


            setError(false)
        }
        else {
            setError(true)
            toast.error(file.name + ' is not a excel file, Please try again');
            return false;
        }

        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {

                let fsize = fi.files.item(i).size;

                if (fsize > 5242880) {
                    setError(true)
                    toast.error("File too Big, please select a file less than 4mb");
                    history.push(`${process.env.REACT_APP_BASE}/upload-campaign`)
                }

            }
        }
        if (error) { return; } else {

            const promise = new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsArrayBuffer(file);
                fileReader.onload = (e) => {
                    const bufferArray = e.target.result;

                    const wb = XLSX.read(bufferArray, { type: "buffer" });

                    const wsname = wb.SheetNames[0];

                    const ws = wb.Sheets[wsname];

                    const data = XLSX.utils.sheet_to_json(ws);

                    resolve(data);
                };

                fileReader.onerror = (error) => {
                    reject(error);
                };
            });

            promise.then((d) => {
                validation(d);
                fi.value = "";
                setFile(null)
            });

        }
    };

    const validation = async(d) => {
        let acceptFile = false
        showSpinner();
        let array = []
        d.map((e) => {
            array.push(e["Access Number"])
        })
        let terminatedNumber = []
        const value = await post(properties.CONNECTION_TERMINATED_NUMBERS_API,array)
                            .then((resp) => {
                                if (resp.status == 200) {
                                terminatedNumber = resp.data
                            } 
                            })
                            .finally(hideSpinner);
        d.map((z) => {
            if ("Campaign Name" in z && "Campaign Description" in z && "Access Number" in z && "Valid From" in z && "Valid To" in z) {
                acceptFile = true
            }
        })
        if (acceptFile === false) {
            toast.error("Fields are not matching, Please try again")
            return false;
        }
        toast.success(file.name + ' uploaded successfully');
        d.map((e) => {
            e["Status"] = "VALID"
            e["Message"] = " "
            var date_info = new Date(((Math.floor(e["Valid From"] - 25568)) * 86400) * 1000)
            let date = JSON.stringify(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()))
            date = date.slice(1, 11)
            e["Valid From"] = formatISODateDDMMMYY(date)
            date_info = new Date((((Math.floor(e["Valid To"] - 25568)) * 86400) * 1000))
            date = JSON.stringify(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()))
            date = date.slice(1, 11)
            e["Valid To"] = formatISODateDDMMMYY(date)
            const todayDate = moment(new Date()).format('DD MMM YYYY')
            let count = 0;
            

            if(e["Campaign Name"] === "" || e["Campaign Name"] === null || e["Campaign Name"] === undefined || e["Campaign Name"] === " ")
            {
                e["Status"] = "INVALID"
                e["Message"] ="Campaingn Name is required"
            }
            if(e["Campaign Description"] === "" || e["Campaign Description"] === null || e["Campaign Description"] === undefined || e["Campaign Description"] === " ")
            {
                e["Status"] = "INVALID"
                if(e["Message"].length > 15)
                {
                    e["Message"] = e["Message"] + `${", Campaign Description is required"}`
                }
                else
                {
                    e["Message"] = e["Message"] + `${"Campaign Description is required"}`
                }
            }
            if(e["Access Number"] === "" || e["Access Number"] === null || e["Access Number"] === undefined || e["Access Number"] === " ")
            {
                e["Status"] = "INVALID"
                if(e["Message"].length > 15)
                {
                    e["Message"] = e["Message"] + `${", Access Number is required"}`
                }
                else
                {
                    e["Message"] = e["Message"] + `${"Access Number is required"}`
                }
            }
            if(e["Valid From"] === "" || e["Valid From"] === null || e["Valid From"] === undefined || e["Valid From"] === " " || e["Valid From"] === "NaN undefined NaN")
            {
                e["Status"] = "INVALID"
                if(e["Message"].length > 15)
                {
                    e["Message"] = e["Message"] + `${", Please Enter Valid Date"}`
                }
                else
                {
                    e["Message"] = e["Message"] + `${"Please Enter Valid Date"}`
                }
                e["Valid From"] = ""
            }
            if(e["Valid To"] === "" || e["Valid To"] === null || e["Valid To"] === undefined || e["Valid To"] === " " || e["Valid To"] === "NaN undefined NaN")
            {
                e["Status"] = "INVALID"
                if(e["Message"].length > 15)
                {
                    e["Message"] = e["Message"] + `${", Please Enter Valid Date"}`
                }
                else
                {
                    e["Message"] = e["Message"] + `${"Please Enter Valid Date"}`
                }
                e["Valid To"] = ""
            }
            

            for (const property in d) {
                if (d[property]["Campaign Name"] === e["Campaign Name"] &&
                    d[property]["Campaign Description"] === e["Campaign Description"] &&
                    d[property]["Access Number"] === e["Access Number"] &&
                    d[property]["Valid From"] === e["Valid From"] &&
                    d[property]["Valid To"] === e["Valid To"]
                ) {
                    count = count + 1;
                }
                if (count > 1) {
                    e["Status"] = "INVALID"
                    if(e["Message"].length > 15)
                    {
                        e["Message"] = e["Message"] + `${", Duplicate Campaign"}`
                    }
                    else
                    {
                        e["Message"] = e["Message"] + `${"Duplicate Campaign"}`
                    }
                    break;  
                }
            }
            count = 0   
            for (const property in campaignNames) {
                if (campaignNames[property].campName === e["Campaign Name"] 
                    && campaignNames[property].campDescription === e["Campaign Description"] 
                    && e["Access Number"] !== undefined && e["Access Number"] !== null &&  e["Access Number"] !== ""
                    && campaignNames[property].serviceNo === e["Access Number"].toString()
                    && (moment(e["Valid From"]).isSameOrAfter(formatISODateDDMMMYY(campaignNames[property].validFrom)))
                    && (moment(e["Valid To"]).isSameOrBefore(formatISODateDDMMMYY(campaignNames[property].validTo)))
                ) {
                    e["Status"] = "INVALID"
                    if(e["Message"].length > 15)
                    {
                        e["Message"] = e["Message"] + `${", Campaign Already Exists"}`
                    }
                    else
                    {
                        e["Message"] = e["Message"] + `${"Campaign Already Exists"}`
                    }
                    break;
                }
                else if (campaignNames[property].campName === e["Campaign Name"] 
                    && campaignNames[property].campDescription === e["Campaign Description"] 
                    && e["Access Number"] !== undefined && e["Access Number"] !== null &&  e["Access Number"] !== ""
                    && campaignNames[property].serviceNo === e["Access Number"].toString()
                    && (moment(e["Valid From"]).isSameOrBefore(formatISODateDDMMMYY(campaignNames[property].validTo)))
                    && (moment(e["Valid To"]).isSameOrAfter(formatISODateDDMMMYY(campaignNames[property].validFrom)))
                ) {
                    e["Status"] = "INVALID"
                    if(e["Message"].length > 15)
                    {
                        e["Message"] = e["Message"] + `${", Campaign Already Exists"}`
                    }
                    else
                    {
                        e["Message"] = e["Message"] + `${"Campaign Already Exists"}`
                    }
                    break;
                }
                // else if (campaignNames[property].campName === e["Campaign Name"] 
                //     && campaignNames[property].campDescription === e["Campaign Description"] 
                //     && campaignNames[property].serviceNo === e["Access Number"].toString()
                //     //&& (moment(e["Valid From"]).isSameOrAfter(formatISODateDDMMMYY(campaignNames[property].validFrom)))
                //     && (moment(e["Valid From"]).isSameOrBefore(formatISODateDDMMMYY(campaignNames[property].validTo)))
                // ) {
                //     e["Status"] = "INVALID"
                //     if(e["Message"].length > 15)
                //     {
                //         e["Message"] = e["Message"] + `${", Campaign Already Exists"}`
                //     }
                //     else
                //     {
                //         e["Message"] = e["Message"] + `${"Campaign Already Exists"}`
                //     }
                //     break;
                // }
                else if (campaignNames[property].campName === e["Campaign Name"] 
                    && campaignNames[property].campDescription === e["Campaign Description"] 
                    && e["Access Number"] !== undefined && e["Access Number"] !== null &&  e["Access Number"] !== ""
                    && campaignNames[property].serviceNo === e["Access Number"].toString()
                    && (moment(e["Valid To"]).isSameOrAfter(formatISODateDDMMMYY(campaignNames[property].validFrom)))
                    && (moment(e["Valid To"]).isSameOrBefore(formatISODateDDMMMYY(campaignNames[property].validTo)))
                ) {
                    e["Status"] = "INVALID"
                    if(e["Message"].length > 15)
                    {
                        e["Message"] = e["Message"] + `${", Campaign Already Exists"}`
                    }
                    else
                    {
                        e["Message"] = e["Message"] + `${"Campaign Already Exists"}`
                    }
                    break;
                }
            }
            let flag = 0;
            ServiceNumbers.map((s) => {
                if (e["Access Number"] !== undefined && e["Access Number"] !== null &&  e["Access Number"] !== "" && e["Access Number"].toString() === s.identificationNo) {
                    flag = 1;
                }
            })
            for(let number in terminatedNumber)
            {
                if(e["Access Number"] !== undefined && e["Access Number"] !== null &&  e["Access Number"] !== "" && terminatedNumber[number].identification_no === e["Access Number"].toString())
                {
                    flag = 0
                    break;
                }
            }
            if (flag === 0) {
                if (flag === 0) {
                    e["Status"] = "INVALID"
                    if(e["Message"].length > 15)
                    {
                        e["Message"] = e["Message"] + `${", Access Number not valid"}`
                    }
                    else
                    {
                        e["Message"] = e["Message"] + `${"Access Number not valid"}`
                    }
                    //e["Message"] = e["Message"] + `${", Access Number not valid"}`
                }
            }
            if (moment(e["Valid From"]).isBefore(todayDate) || moment(e["Valid To"]).isBefore(todayDate) || moment(e["Valid From"]).isAfter(e["Valid To"])) {
                e["Status"] = "INVALID"
                if(e["Message"].length > 15)
                {
                    e["Message"] = e["Message"] + `${", Invalid date range"}`
                }
                else
                {
                    e["Message"] = e["Message"] + `${"Invalid date range"}`
                }
                //e["Message"] = e["Message"] + `${", Invalid date range"}`
            }

        })



        let tempArray = []
        let tempArray1 = []
        d.map((p) => {
            let temp = 1
            let temp1 = 1
            let t = p["Message"].includes("Duplicate Campaign Name")
            let t1 = p["Message"].includes("Duplicate Access Number")
            tempArray.map((e) => {
                if (e["Campaign Name"] == p["Campaign Name"] &&
                    e["Campaign Description"] === p["Campaign Description"] &&
                    e["Access Number"] === p["Access Number"] &&
                    e["Valid From"] === p["Valid From"] &&
                    e["Valid To"] === p["Valid To"]
                ) {
                    temp = 0
                }
            })
            tempArray1.map((e) => {
                if (e == p["Access Number"]) {
                    temp1 = 0
                }
            })
            if (t === true && temp === 1) {
                if (p["Message"].includes("Duplicate Campaign")) {
                    if ((p["Message"].length > 35)) {
                        const pieces = p["Message"].split("Duplicate Campaign");
                        p["Message"] = pieces.join(" ");
                        p["Status"] = "INVALID"
                    }
                    else {
                        p["Message"] = ""
                        p["Status"] = "VALID"
                    }
                }
            }

            tempArray.push(p)
            tempArray1.push(p["Access Number"])
        })
        setCampaign(d)
    }


    const handleCellRender = (cell, row) => {
        return (<span>{cell.value}</span>)
    }

    const handleCancel = () => {
        setCampaign([])

    }


    const handleClick = () => {

        campaign.map((e) => {
            if (e["Status"] === "VALID") {
                arrayCamps.push({ "campName": e["Campaign Name"], "serviceNo": e["Access Number"], "campDescription": e["Campaign Description"], "validFrom": moment(e["Valid From"]).format('YYYY-MM-DD'), "validTo": moment(e["Valid To"]).format('YYYY-MM-DD') })
            }
        });
        if(arrayCamps.length === 0)
        {
            toast.error("No Valid Campaign Available")
            return false;
        }
        showSpinner();
        post(properties.CAMPAIGN_API + "/bulk", arrayCamps)
            .then((resp) => {
                if (resp.data) {
                    toast.success("Campaigns created successfully ");
                    history.push(`${process.env.REACT_APP_BASE}/`);
                } else {
                    toast.error("Error while creating campings")
                }

            })
            .finally(hideSpinner);


    }

    return (
        <>

            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Campaign Upload</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">

                    <div className="card-box add-camp">
                        <div className="d-flex">
                            <div className="col-md-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="toupload" spy={true} offset={-300} smooth={true} duration={100} >Upload Campaign</Link></li>
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="topreview" spy={true} offset={-300} smooth={true} duration={100}>Preview</Link></li>
                                </ul>
                            </div>
                            <div className="new-customer col-md-10">
                                <div className="scrollspy-div">

                                    <Element name="toupload" >
                                        <div className="up-gat row">
                                            <div className="col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("Upload Campaign")}</h4>
                                                </section>
                                            </div>
                                        </div>
                                        <div className="pt-0 mt-2 pr-2">
                                            <fieldset className="scheduler-border">
                                                <div className="form-row">
                                                    <div className="col-12 pl-2 bg-light border">
                                                        <span>
                                                            <h5 className="text-primary float-left">Campaign Details</h5></span>
                                                        <span>
                                                            <a className="text-primary pt-1 float-right" download={"Campaign Upload Template.xlsx"} href={CampaignUploadTemplate}><b>Campaign Upload Template</b>&nbsp;<i className="fa fa-download" aria-hidden="true"></i></a>
                                                            {/* <a href={CampaignUploadTemplate} download="sampleCampaign.xlxs"> Download Here </a> */}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="row col-12">
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label
                                                                htmlFor="inputState"
                                                                className="col-form-label">
                                                                Upload Excel File<span>*</span>
                                                            </label>
                                                            <input
                                                                type="file"
                                                                accept=".xlsx, .xls"
                                                                id="file"
                                                                onChange={(e) => {
                                                                    setFile(e.target.files[0])
                                                                    const file = e.target.files[0];
                                                                }}
                                                            />


                                                        </div>
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </div>
                                        <div className="d-flex justify-content-center">
                                            <button type="button"
                                                className="btn btn-outline-primary  text-primary waves-effect waves-light mr-2"
                                                disabled={!file}
                                                onClick={readExcel}>Upload
                                            </button>

                                        </div>

                                    </Element>



                                    <Element name="topreview" className="element">
                                        <div id="preview" >
                                            <h4 id="list-item-1">Preview</h4>
                                            <hr />
                                            <div className="row" >
                                                <div className="col-lg-12">
                                                    {
                                                        campaign.length > 0 &&
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div style={{ width: "1083px", border: "1px solid #ccc", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
                                                                    <DynamicTable
                                                                        row={campaign}
                                                                        header={CampaignUploadList}
                                                                        itemsPerPage={10}
                                                                        handler={{
                                                                            handleCellRender: handleCellRender,
                                                                        }}
                                                                    />
                                                                </div>
                                                                <br></br>
                                                                <div className="d-flex col-12 justify-content-center">
                                                                    <button type="button" className="btn btn-primary waves-effect waves-light mr-2" onClick={handleClick} >Import Valid</button>
                                                                    <button type="button" className="btn btn-secondary waves-effect waves-light ml-2" onClick={handleCancel} >Cancel</button>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                            </div>

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
}

export default UploadCampaign;



