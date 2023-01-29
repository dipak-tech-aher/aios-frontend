import React, { useState } from 'react'
import { Link } from "react-router-dom";
import DownloadTemplate from './RecordExtractorCreate/DownloadTemplate';
import PreviewValidateTemplate from './RecordExtractorCreate/PreviewValidateTemplate';
import SubmitTemplate from './RecordExtractorCreate/SubmitTemplate';
import AIOS_Call_Collection_Report_Template from './RecordExtractorExcelTemplates/AIOS_Call_Collection_Report_Template.xlsx'
import { CallCollectionReportMandatoryColumns, CallCollectionReportTemplateColumns, 
    CallCollectionReportTemplateFailedHiddenColumns, CallCollectionReportTemplateHiddenColumns, 
    CallCollectionReportTemplateNoOsColumns, UploadedTableHiddenColumns } from './RecordExtractorColumns';
import { hideSpinner, showSpinner } from '../common/spinner';
import { post } from '../util/restUtil';
import { properties } from '../properties';
import { toast } from 'react-toastify';
import { unstable_batchedUpdates } from 'react-dom';

const CreateRecordExtractor = () => {

    const tabs = [
        {
            name: 'Download Template',
            index: 0
        },
        {
            name: 'Preview and Validate',
            index: 1
        },
        {
            name: 'Submit',
            index: 2
        }
    ];
    const bulkUploadTemplateList = [
        {
            type: "CALL_COLLECTION",
            name: "AIOS_Call_Collection_Report_Template.xlsx",
            template: AIOS_Call_Collection_Report_Template,
            description: "Download AIOS Call Collection Report Template",
            mandatoryColumns: CallCollectionReportMandatoryColumns,
            tableColumns: CallCollectionReportTemplateColumns,
            tableNoOsColumns: CallCollectionReportTemplateNoOsColumns,
            tableHiddenColumnsBeforeValidate: CallCollectionReportTemplateHiddenColumns,
            tableHiddenColumnsWhenFailed: CallCollectionReportTemplateFailedHiddenColumns,
            uploadedTableHiddenColumns: UploadedTableHiddenColumns
        }
    ]
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [selectedTemplateType, setSelectedTemplateType] = useState('')
    const [uploadTemplateList, setUploadTemplateList] = useState({
        uploadList: [],
        rejectedList: [],
        finalList: [],
        extraList: []
    })
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("")
    const [templateUploadCounts, setTemplateUploadCounts] = useState({
        success: 0,
        failed: 0,
        total: 0
    })
    const [templateStatusFlags, setTemplateStatusFlags] = useState({
        validateCheck: false,
        showErrorCheck: false,
        proceedCheck: true
    })
    const [uploadStatusResponse, setUploadStatusResponse] = useState()
    const handleOnPreviousNext = (e) => {
        const { target } = e;
        if (target.id === 'prev') {
            setActiveTab(tabs[--activeTab.index])
        }
        else {
            // if (verifyUserNaviagtion(activeTab.index)) {
            //     return;
            // }
            setActiveTab(tabs[++activeTab.index]);
        }
    }

    const handleOnTabChange = (selectedTab) => {
        if (activeTab.index === 1 && selectedTab.index === 0) {
            setActiveTab(selectedTab);
            return;
        }
        // if (verifyUserNaviagtion(activeTab.index)) {
        //     return;
        // }
        setActiveTab(selectedTab);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (templateStatusFlags.validateCheck === false) {
            toast.error('Please Validate the Records')
            return false
        }
        if (templateStatusFlags.showErrorCheck === true && templateStatusFlags.proceedCheck !== true) {
            toast.error('Please Confirm the Skip Check to Upload the Records')
            return false
        }
        if (uploadTemplateList.finalList.length === 0) {
            toast.error('No Valid Records Available')
            return false
        }
        let requestBody = {
            bulkUploadType: selectedTemplateType,
            outstanding: uploadTemplateList.finalList,
            noOutstanding: uploadTemplateList.extraList
        }
        if (selectedTemplateType === 'CALL_COLLECTION') {
            showSpinner()
            post(`${properties.CUSTOMER_API}/create-bill-bulk-data`, requestBody)
                .then((resp) => {
                    if (resp.data) {
                        unstable_batchedUpdates(() => {
                            setUploadStatusResponse({
                                ...resp.data,
                                finalList: uploadTemplateList?.finalList,
                                extraList: uploadTemplateList.extraList
                            })
                        })
                        handleOnPreviousNext(e)
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
                .finally(hideSpinner)
        }
    }

    const handleFinish = (e) => {
        handleSubmit(e)
    }

    return (
        <>
            <div className="row">
                <div className="col-md-12 row p-0">
                    <div className="col-md-8">
                        <div className="page-title-box">
                            <h4 className="page-title">Call Collection Report</h4>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="pt-1 pb-1">
                            <div className="text-right">
                                <Link to={{ pathname: `${process.env.REACT_APP_BASE}/search-excel-records`, state: { data: { type: 'Record Extractor' } } }} className="btn waves-effect waves-light btn-primary">
                                    Search Uploads
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="main pt-0">
                <div className="row p-0">
                    <div className="col p-0">
                        <div className="card-body insta-page row">
                            <div className="col-md-12">
                                <div className="card-box">
                                    <div className="row mt-1 col-md-12 p-0 mb-3">
                                        <section className="triangle col-md-12">
                                            <div className="row col-md-12">
                                                <div className="col-md-12">
                                                    <h5>Upload Call Collection Data</h5>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="card">
                                                <div className="card-body">
                                                    <div id="progressbarwizard">
                                                        <ul className="nav nav-pills bg-light nav-justified form-wizard-header mb-3">
                                                            {
                                                                tabs.map((tab, index) => (
                                                                    <li key={tab.name} className="nav-item">
                                                                        <a className={`nav-link rounded-0 pt-2 pb-2 cursor-pointer ${activeTab.index === index ? 'active' : ''}`} onClick={() => handleOnTabChange(tab)}>
                                                                            <i className={tab.index === 0 ? "mdi mdi-progress-download mr-1 font-22" : tab.index === 1 ? "mdi mdi-checkbox-marked-circle-outline mr-1 font-22" : "mdi mdi-checkbox-marked-circle-outline mr-1 font-22"}></i>
                                                                            <span className="d-none d-sm-inline">{tab.name}</span>
                                                                        </a>
                                                                    </li>
                                                                ))
                                                            }
                                                        </ul>
                                                        <div className="tab-content b-0 mb-0 pt-0">
                                                            <div id="bar" className="progress mb-3" style={{ height: "7px" }}>
                                                                <div className="bar progress-bar progress-bar-striped progress-bar-animated bg-success"></div>
                                                            </div>

                                                            <div className={`tab-pane ${activeTab.index === 0 ? 'show active' : ''}`} >
                                                                {
                                                                    activeTab.index === 0 &&
                                                                    <DownloadTemplate
                                                                        data={{
                                                                            selectedTemplateType,
                                                                            bulkUploadTemplateList,
                                                                            uploadTemplateList,
                                                                            file,
                                                                            fileName,
                                                                            templateUploadCounts
                                                                        }}
                                                                        handler={{
                                                                            setSelectedTemplateType,
                                                                            setUploadTemplateList,
                                                                            setFile,
                                                                            setFileName,
                                                                            setTemplateUploadCounts,
                                                                            setTemplateStatusFlags
                                                                        }}
                                                                    />
                                                                }

                                                            </div>
                                                            <div className={`tab-pane ${activeTab.index === 1 ? 'show active' : ''}`} >
                                                                {
                                                                    activeTab.index === 1 &&
                                                                    <PreviewValidateTemplate
                                                                        data={{
                                                                            selectedTemplateType,
                                                                            bulkUploadTemplateList,
                                                                            uploadTemplateList,
                                                                            templateUploadCounts,
                                                                            templateStatusFlags
                                                                        }}
                                                                        handler={{
                                                                            setUploadTemplateList,
                                                                            setTemplateUploadCounts,
                                                                            setTemplateStatusFlags
                                                                        }}
                                                                    />
                                                                }
                                                            </div>
                                                            <div className={`tab-pane text-center p-2 ${activeTab.index === 2 ? 'show active' : ''}`}>
                                                                {
                                                                    activeTab.index === 2 &&
                                                                    <SubmitTemplate
                                                                        data={{
                                                                            selectedTemplateType,
                                                                            uploadStatusResponse
                                                                        }}
                                                                    />
                                                                }

                                                            </div>
                                                        </div>
                                                        <ul className="list-inline wizard mb-0">
                                                            <li className="previous list-inline-item">
                                                                <button className={`btn btn-primary ${activeTab.index === 0 || activeTab.index === 2 ? 'd-none' : ''}`} id='prev' onClick={handleOnPreviousNext}>Previous</button>
                                                            </li>
                                                            {
                                                                (activeTab.index === 1) ?
                                                                    <li className="next list-inline-item float-right">
                                                                        <button className="btn btn-primary" id="finish" onClick={(e) => { handleFinish(e) }}>
                                                                            Finish
                                                                        </button>
                                                                    </li>
                                                                    :
                                                                    <li className="next list-inline-item float-right">
                                                                        <button className={`btn btn-primary ${activeTab.index === 1 || activeTab.index === 2 ? 'd-none' : ''}`} id="next" onClick={handleOnPreviousNext}>Next</button>
                                                                    </li>
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateRecordExtractor