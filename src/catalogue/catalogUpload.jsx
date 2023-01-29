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
import CatalogUploadList from './catalogUploadList';
import { useTranslation } from "react-i18next";
import CatalogueUploadTemplate from './catalogueUploadTemplate.xlsx'
function UploadCatalog() {
    const history = useHistory();
    const [error, setError] = useState(false);
    const [preview, setPreview] = useState(false);
    const { t } = useTranslation();
    const [catalog, setCatalog] = useState([]);
    const [file, setFile] = useState();
    let arrayCats = []
    const [ServiceNumbers, setServiceNumbers] = useState([]);
    const [prodTypeLookUp, setProdTypeLookUp] = useState(null)
    const [networkTypeLookUp, setNetworkTypeLookUp] = useState(null)
    const [planTypeLookUp, setPlanTypeLookUp] = useState(null)
    const [planCateTypeLookUp, setPlanCateTypeLookUp] = useState(null)

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
                        setProdTypeLookUp(resp.data.PROD_TYPE)
                        setNetworkTypeLookUp(resp.data.NETWORK_TYPE)
                        setPlanTypeLookUp(resp.data.PLAN_TYPE)
                        setPlanCateTypeLookUp(resp.data.PROD_CAT_TYPE)
                    }
                }
                else {
                    toast.error("Failed to update - " + resp.status);
                }
            }).finally(hideSpinner)
    }, [])

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
                    history.push(`${process.env.REACT_APP_BASE}/upload-catalog`)
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
            });

        }
    };


    const validation = (d) => {
        let acceptFile = false
        d.map((z) => {
            if ("Refill Profile Id" in z &&  "Tariff Code" in z && "Bundle Name" in z &&  "Commercial Pack Name"in z && "Bundle Category"in z && "Bundle Type" in z) {
                acceptFile = true
            }

        })
        if (acceptFile === false) {
            toast.error("Fields are not matching, Please try again")
            return false;
        }
        toast.success(file.name + ' uploaded successfully');
        let planOfferTemp = []
        let offer = []
        d.map((e) => {
            let flag = 0
            let flag1 = 0
            planOfferTemp.map((p) => {
                if (e["Refill Profile Id"] === p) {
                    flag = 1
                }
            })
            let offerArray = []
            d.map((o) => {
                flag = 0
                offer.map((p) => {
                    if (o["Offer Id"] === p) {
                        flag1 = 1
                    }
                })
                if (e["Refill Profile Id"] === o["Refill Profile Id"] && e["Offer Id"] != o["Offer Id"] && flag1 === 0) {
                    offerArray.push({
                        "refillId": e["Refill Profile Id"],
                        "offerId": o["Offer Id"],
                        "units": o["Units"],
                        "quota": o["Quota"],
                        "offerType": o["Type"]
                    })
                    offer.push(o["Offer Id"])
                }
            })
            if (flag === 0) {
                offerArray.push({
                    "refillId": e["Refill Profile Id"],
                    "offerId": e["Offer Id"],
                    "units": e["Units"],
                    "quota": e["Quota"],
                    "offerType": e["Type"]
                })
                e["Plan Offer"] = offerArray

            }
            planOfferTemp.push(e["Refill Profile Id"])
        })

        d.map((e) => {
            e["Status"] = "VALID"
            e["Message"] = ""

            let count = 0;
            d.map((o) => {
                if (e["Refill Profile Id"].toUpperCase() === o["Refill Profile Id"].toUpperCase()) {
                    count = count + 1;
                }
                if (count > 1) {
                    e["Status"] = "INVALID"
                    e["Message"] = "Duplicate Refill Id"

                } else {
                    e["Status"] = "VALID"
                    e["Message"] = ""
                }

            })
            count = 0;

            let count1 = 0
            for (const property in d) {
                if (Number(d[property]["Offer Id"]) === Number(e["Offer Id"])) {
                    count1 = count1 + 1;
                }
                if (count1 > 1) {
                    e["Status"] = "INVALID"
                    if (e["Message"].includes("Duplicate Refill Id")) {
                        e["Message"] = "Duplicate Refill Id Duplicate Offer Id"
                        e["Status"] = "INVALID"
                        break;
                    }
                    else {
                        e["Message"] = `${"Duplicate Offer Id"}`
                        e["Status"] = "INVALID"
                        break;
                    }
                }
            }
            count1 = 0

            let networkFlag = 1
            for (const property in networkTypeLookUp) {
                if (networkTypeLookUp[property].description === e["Network Type"]) {
                    networkFlag = 0
                    break;
                }
            }
            if (networkFlag === 0) {
                if (e["Status"] === "VALID") {
                    e["Status"] = "VALID"
                }
            }
            else {
                e["Status"] = "INVALID"
                e["Message"] = e["Message"] + `${" Invalid Network Type  "}`

            }

            let bundleCategoryFlag = 1
            for (const property in planCateTypeLookUp) {
                if (planCateTypeLookUp[property].description === e["Bundle Category"]) {
                    e["Bundle Category Code"] = planCateTypeLookUp[property].code
                    bundleCategoryFlag = 0
                    break;
                }
            }
            if (bundleCategoryFlag === 0) {
                if (e["Status"] === "VALID") {
                    e["Status"] = "VALID"
                }

            } else {
                e["Status"] = "INVALID"
                e["Message"] = e["Message"] + `${" Invalid Bundle Category  "}`

            }

            let bundleTypeFlag = 1
            for (const property in planTypeLookUp) {
                if (planTypeLookUp[property].description === e["Bundle Type"]) {
                    bundleTypeFlag = 0
                    break;
                }
            }
            if (bundleTypeFlag === 0) {
                if (e["Status"] === "VALID") {
                    e["Status"] = "VALID"
                }

            } else {
                e["Status"] = "INVALID"
                e["Message"] = e["Message"] + `${" Invalid Bundle Type  "}`

            }

            let serviceFlag = 1
            for (const property in prodTypeLookUp) {
                if (prodTypeLookUp[property].description === e["Services"]) {
                    serviceFlag = 0
                    break;
                }
            }
            if (serviceFlag === 0) {
                if (e["Status"] === "VALID") {
                    e["Status"] = "VALID"
                }
            } else {
                e["Status"] = "INVALID"
                e["Message"] = e["Message"] + `${" Invalid Service Type  "}`
            }

        })




        let tempArray = []
        let tempArray1 = []
        d.map((p) => {
            let temp = 1
            let temp1 = 1
            let t = p["Message"].includes("Duplicate Refill Id")
            let t1 = p["Message"].includes("Duplicate Offer Id")
            tempArray.map((e) => {
                if (e == p["Refill Profile Id"]) {
                    temp = 0
                }
            })
            tempArray1.map((e) => {
                if (e == p["Offer Id"]) {
                    temp1 = 0
                }
            })
            if (t === true && temp === 1) {
                if (p["Message"].includes("Duplicate Refill Id")) {
                    if ((p["Message"].length > 30)) {
                        const pieces = p["Message"].split("Duplicate Refill Id");
                        p["Message"] = pieces.join(" ");
                        p["Status"] = "INVALID"
                    }
                    else {
                        p["Message"] = ""
                        p["Status"] = "VALID"
                    }
                }
            }
            if (t1 === true && temp1 === 1) {
                if (p["Message"].includes("Duplicate Offer Id")) {
                    if ((p["Message"].length > 30)) {
                        const pieces = p["Message"].split("Duplicate Offer Id");
                        p["Message"] = pieces.join(" ");
                        p["Status"] = "INVALID"
                    }
                    else {
                        p["Message"] = ""
                        p["Status"] = "VALID"
                    }
                }
            }
            tempArray.push(p["Refill Profile Id"])
            tempArray1.push(p["Offer Id"])
        })
        setCatalog(d)
    }


    const handleCellRender = (cell, row) => {
        return (<span>{cell.value}</span>)
    }

    const handleCancel = () => {
        setCatalog([])

    }


    const handleClick = () => {

        catalog.map((e) => {
            if (e["Status"] === "VALID") {
                arrayCats.push({
                    "refillProfileId": e["Refill Profile Id"],
                    "TarrifCode": e["Tariff Code"],
                    "bundleName": e["Bundle Name"],
                    "commPackName": e["Commercial Pack Name"],
                    "bundleCatagory": e["Bundle Category Code"],
                    "bundleType": e["Bundle Type"],
                    "ocsDescription": e["OCS Description"],
                    "type": e["Type"],
                    "offerId": e["Offer Id"],
                    "quota": e["Quota"],
                    "units": e["Units"],
                    "service": e["Services"],
                    "networkType": e["Network Type"],
                    "serviceClass": e["Service Class"],
                    "validity": e["Validity"],
                    "denomination": e["Denomination"],
                    "planOffer": e["Plan Offer"]
                })
            }
        })


        showSpinner();
        post(properties.CATALOGUE_API + "/bulk", arrayCats)
            .then((resp) => {
                if (resp.data) {
                    toast.success("Catalogs created successfully ");
                } else {
                    toast.error("Error while creating Catalogs")
                }

            })
            .finally(hideSpinner);


    }


    return (
        <>

            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">Catalog Upload</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-12 p-0">

                    <div className="card-box add-camp">
                        <div className="d-flex">
                            <div className="col-md-2 p-0 sticky">
                                <ul className="list-group">
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="toupload" spy={true} offset={-300} smooth={true} duration={100} >Upload Catalog</Link></li>
                                    <li><Link activeclassName="active" className="list-group-item list-group-item-action" to="topreview" spy={true} offset={-300} smooth={true} duration={100}>Preview</Link></li>
                                </ul>
                            </div>
                            <div className="new-customer col-md-10">
                                <div className="scrollspy-div">

                                    <Element name="toupload">
                                        <div className="up-gat row">
                                            <div className="col-12 p-0">
                                                <section className="triangle">
                                                    <h4 className="pl-2" style={{ alignContent: 'left' }}>{t("Upload Catalog")}</h4>
                                                </section>
                                            </div>
                                        </div>

                                        <div className="pt-0 mt-2 pr-2">
                                            <fieldset className="scheduler-border">
                                                <div className="form-row">
                                                    <div className="col-12 pl-2 bg-light border">
                                                        <span>
                                                            <h5 className="text-primary float-left">Catalog Details</h5></span>
                                                        <span>
                                                            <a className="text-primary pt-1 float-right" download={"Catalogue Upload Template.xlsx"} href={CatalogueUploadTemplate}><b>Catalogue Upload Template</b>&nbsp;<i className="fa fa-download" aria-hidden="true"></i></a>
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
                                                className="btn btn-outline-primary text-primary waves-effect waves-light mr-2"
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
                                                        catalog.length > 0 &&
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div style={{ width: "1083px", border: "1px solid #ccc", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
                                                                    <DynamicTable
                                                                        row={catalog}
                                                                        header={CatalogUploadList}
                                                                        itemsPerPage={10}
                                                                        handler={{
                                                                            handleCellRender: handleCellRender,
                                                                        }}

                                                                    />
                                                                </div><br />
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

export default UploadCatalog;



