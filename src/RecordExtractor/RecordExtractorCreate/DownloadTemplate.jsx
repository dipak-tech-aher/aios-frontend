import React, { useState } from 'react'
import * as XLSX from "xlsx";
import moment from 'moment'
import { toast } from 'react-toastify';
import { hideSpinner, showSpinner } from '../../common/spinner';

const DownloadTemplate = (props) => {

    const { selectedTemplateType, bulkUploadTemplateList, uploadTemplateList, file, fileName, templateUploadCounts } = props.data
    const { setSelectedTemplateType, setUploadTemplateList, setFile, setFileName, setTemplateUploadCounts, setTemplateStatusFlags } = props.handler
    const [showImportantInstruction, setShowImportantInstruction] = useState(false)

    const formatExcelDate = (dateValue) => {
        let date_info = new Date(((Math.floor(dateValue - 25568)) * 86400) * 1000)
        let date = JSON.stringify(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate()))
        date = date.slice(1, 11)
        return moment(date).format('YYYY-MM-DD')
    }

    const handleFileRejection = () => {
        setUploadTemplateList({
            uploadList: [],
            rejectedList: [],
            finalList: []
        })
        setTemplateUploadCounts({
            success: 0,
            failed: 0,
            total: 0
        })
        setTemplateStatusFlags({
            validateCheck: false,
            showErrorCheck: false,
            proceedCheck: true
        })
    }

    const handleFileSelect = (e) => {
        showSpinner()
        setFileName(e.target.files[0]?.name);
        setFile(e.target.files[0]);
        readExcel(e.target.files[0])
    }

    const handleFileUpload = (list) => {
        let acceptFile = false
        if (selectedTemplateType === 'CALL_COLLECTION') {
            list.forEach((z) => {
                if ("Customer Number" in z && "Account Number" in z) {
                    acceptFile = true
                }
            })
        }
        if (acceptFile === false) {
            setFile(null)
            setFileName("")
            handleFileRejection()
            hideSpinner()
            toast.error("Fields are not matching, Please Check the Mandatory Fields and try again")
            return false;
        }
        let tempTaskList = list.map((task, idx) => {
            let taskObject = {}
            if (selectedTemplateType === 'CALL_COLLECTION') {
                taskObject = {
                    indexId: idx + 1,
                    customerNo: task["Customer Number"] || null,
                    accountNo: task["Account Number"] || null,
                    validationRemark: null,
                    validationStatus: null
                }
            }
            return taskObject;
        })
        toast.success(fileName + ' Uploaded Successfully');

        console.log('uploadTemplateList', tempTaskList)

        setUploadTemplateList({ ...uploadTemplateList, uploadList: tempTaskList, rejectedList: [], finalList: [] })
        setTemplateUploadCounts({ ...templateUploadCounts, total: tempTaskList.length, failed: 0, success: 0 })
        setTemplateStatusFlags({
            validateCheck: false,
            showErrorCheck: false,
            proceedCheck: true
        })
        hideSpinner()
    }

    const readExcel = (file) => {
        let error = false
        let fi = document.getElementById('file');
        var extension = file.name.substr(file.name.lastIndexOf('.'));
        if ((extension.toLowerCase() === ".xls") || (extension.toLowerCase() === ".xlsx")) {
            error = false
        }
        else {
            error = true
            toast.error(file.name + ' is not a excel file, Please try again');
            hideSpinner()
            handleFileRejection()
            return false;
        }
        if (fi.files.length > 0) {
            for (let i = 0; i <= fi.files.length - 1; i++) {
                let fsize = fi.files.item(i).size;
                if (fsize > 5242880) {
                    error = true
                    toast.error("File too Big, Please Select a File less than 4mb");
                    setFile(null)
                    setFileName("")
                    handleFileRejection()
                    hideSpinner()
                }
            }
        }
        if (error) {
            hideSpinner()
            return;
        }
        else {
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
                    hideSpinner()
                    reject(error);
                };
            });
            promise.then((d) => {
                handleFileUpload(d);
                fi.value = "";
            });
        }
    };

    const validateFileInput = (e) => {
        const { target } = e;
        if (target.closest('.excel')) {
            if (selectedTemplateType === '') {
                toast.error('Please Select Template Type');
            }
        }
    }

    return (
        <div className="row ">
            <div className="col-6 pt-4 float-left">
                <div className="form-group row">
                    <label htmlFor="selectedTemplateType" className="col-md-7 col-form-label text-md-left">
                        Select Sample Excel/CSV Template
                    </label>
                    <div className="col-md-5">
                        <select name="selectedTemplateType" className="form-control" id="selectedTemplateType" value={selectedTemplateType}
                            onChange={(e) => {
                                if (e.target.value === '') {
                                    setShowImportantInstruction(false)
                                }
                                else {
                                    setShowImportantInstruction(true)
                                }
                                setSelectedTemplateType(e.target.value)
                            }}
                        >
                            <option value="">Select Template</option>
                            <option value="CALL_COLLECTION">Call Collection</option>=
                        </select>
                    </div>
                </div>
                <br />
            </div>
            {
                selectedTemplateType && selectedTemplateType !== '' &&
                <div className="col-6 float-right">
                    {
                        bulkUploadTemplateList && bulkUploadTemplateList.length > 0 && bulkUploadTemplateList.map((temp, index) => (
                            <>
                                {
                                    temp?.type === selectedTemplateType &&
                                    <>
                                        <h5>{temp?.description}</h5>
                                        <div className="form-group row bg-white border p-2" key={index}>
                                            <div className="col-md-2">
                                                <div className="avatar-sm">
                                                    <a download={temp?.name} href={temp?.template}>
                                                        <span className="avatar-title bg-primary rounded">
                                                            <i className="mdi mdi-microsoft-excel font-22"></i>
                                                        </span>
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="col-md-7">
                                                <a className="text-black font-weight-bold" download={temp?.name} href={temp?.template}>{temp?.name}</a>
                                                {/* <p className="mb-0">1.11 MB</p> */}
                                            </div>
                                            <div className="col-md-3">
                                                <a className="btn btn-link btn-lg text-muted" download={temp?.name} href={temp?.template}>
                                                    <i className="dripicons-download"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </>
                                }
                            </>
                        ))
                    }
                    <br />
                </div>
            }
            <div className="accordion custom-accordion col-md-12 p-0 border customer skill status-card-btm" id="custom-accordion-one" >
                <div className="card-header" id="headingTen">
                    <h5 className="m-0 position-relative" onClick={() => { setShowImportantInstruction(!showImportantInstruction) }}>
                        <a className="custom-accordion-title text-reset d-block" data-toggle="collapse" data-target="#collapseTen" aria-expanded="true" aria-controls="collapseTen">
                            Important Instructions
                            {
                                showImportantInstruction ?
                                    <i className="mdi mdi-chevron-down accordion-arrow"></i>
                                    :
                                    <i className="mdi mdi-chevron-right accordion-arrow"></i>
                            }

                        </a>
                    </h5>
                </div>
                {
                    showImportantInstruction && selectedTemplateType !== '' &&
                    <div id="collapseTen" className="collapse show" aria-labelledby="headingTen" data-parent="#custom-accordion-one" >
                        <div>
                            <div className="col-md-12 row pt-2 pl-2">
                                <div className="border bg-light p-2 mb-2">
                                    {
                                        bulkUploadTemplateList && bulkUploadTemplateList.length > 0 && bulkUploadTemplateList.map((temp, index) => (
                                            <>
                                                {
                                                    temp?.type === selectedTemplateType &&
                                                    <div className="col-md-12" key={index}>
                                                        <p>These are the mandatory fields required for the bulk upload. The Excel sheet template should contain these mandatory fields</p>
                                                        <p></p>
                                                        {/* <p>Es un hecho establecido hace demasiado tiempo que un lector se distraerá con el contenido del texto de un sitio mientras que mira su diseño. El punto de usar Lorem Ipsum es que tiene una distribución más o menos normal de las letras, al contrario de usar textos como por ejemplo "Contenido aquí, contenido aquí". </p> */}
                                                        <h4>Mandatory Fileds</h4>
                                                        <div className="card-body">
                                                            <div className="row col-12">
                                                                {
                                                                    temp?.mandatoryColumns && temp?.mandatoryColumns.length > 0 && temp?.mandatoryColumns.map((column, idx) => (
                                                                        <div className="col-4" key={idx}>
                                                                            <ul className="list-group">
                                                                                {
                                                                                    column.length > 0 && column.map((name) => (
                                                                                        <li className="list-group-item" key={name}>{name}</li>
                                                                                    ))
                                                                                }
                                                                            </ul>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className="col-12 pt-2">
                <div className=" pl-2 bg-light border">
                    <h5 className="text-primary">File Upload</h5>
                </div>
            </div>
            <div className="col-12">
                <br />
                <div className="form-group col-12">
                    <label htmlFor="email_address" className=" col-form-label text-md-left">Choose the file to Upload</label>
                </div>
                <div className="grid-x grid-padding-x">
                    <div className="small-10 small-offset-1 medium-8 medium-offset-2 cell">
                        <fieldset className="scheduler-border">
                            <div className="ml-6 file-upload d-flex justify-content-center mt-3 cursor-pointer excel" >
                                <div className="file-select" onClick={validateFileInput}>
                                    <div className="file-select-button" id="fileName" >Choose File</div>
                                    {
                                        selectedTemplateType !== '' &&
                                        <input
                                            type="file"
                                            accept=".xlsx, .xls"
                                            id="file"
                                            onChange={handleFileSelect}
                                        />
                                    }
                                </div>
                            </div>
                            <div className="ml-3 d-flex justify-content-center">
                                <div className="file-select">
                                    <div className="file-select-name" id="noFile">{fileName}</div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </div>
                <br /><br /><br />
            </div>
        </div>
    )
}

export default DownloadTemplate