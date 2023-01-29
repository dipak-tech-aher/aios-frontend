import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from 'moment'
import { hideSpinner, showSpinner } from '../../common/spinner';

const SubmitTemplate = (props) => {

    const { selectedTemplateType, uploadStatusResponse } = props.data
    const exportToCSV = (type) => {
        showSpinner()
        const fileName = `AIOS_${selectedTemplateType.toLowerCase()}_Template_${moment(new Date()).format('DD MMM YYYY')}`
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        let tableData = [];
        uploadStatusResponse[type]?.forEach(element => {
            let objConstruct = {}
            if (selectedTemplateType === 'CALL_COLLECTION') {
                if (type === 'finalList') {
                    objConstruct["Customer Number"] = element?.customerNo
                    objConstruct["Account Number"] = element?.accountNo
                    objConstruct["Contact Number"] = element?.contactNo
                }
                else {
                    objConstruct["Customer Number"] = element?.customerNo
                    objConstruct["Account Number"] = element?.accountNo
                    objConstruct["Customer Status"] = element?.customerStatus
                    objConstruct["Account Status"] = element?.accountStatus
                    objConstruct["Creation Date"] = element?.accountCreationDate
                    objConstruct["Plan Code"] = element?.basicCollectionPlanCode
                    objConstruct["Bill UID"] = element?.billUid
                    objConstruct["Bill Status"] = element?.billStatus
                    objConstruct["Bill Month"] = element?.billMonth
                    objConstruct["Bill Amount"] = element?.billAmount
                    objConstruct["Bill Date"] = element?.billDate
                    objConstruct["Paid Date"] = element?.paidDate
                    objConstruct["Due Date"] = element?.dueDate
                    objConstruct["Paid Amount"] = element?.paidAmount
                    objConstruct["Unpaid Amount"] = element?.unpaidAmount
                    objConstruct["Dispute Number"] = element?.disputeAmount
                    objConstruct["Refund Amount"] = element?.refundAmount
                }
            }
            tableData.push(objConstruct);
        })

        if (tableData.length !== 0) {
            const ws = XLSX.utils.json_to_sheet(tableData,
                {
                    origin: 'A1',
                    skipHeader: false
                });
            const wb = {
                Sheets: { data: ws },
                SheetNames: ["data"]
            };

            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const data = new Blob(
                [excelBuffer], { type: fileType }
            );
            FileSaver.saveAs(data, fileName + fileExtension);
        }
        hideSpinner()
    };

    return (
        <>
            {
                uploadStatusResponse?.finalList.length > 0 && uploadStatusResponse?.uploadProcessId &&
                <>
                    <h3 className="text-success pb-2">Bulk Upload Success!</h3>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Upload Process ID</label>
                        <div className="col-4 text-left mt-2">{uploadStatusResponse?.uploadProcessId}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Bulk Upload Type</label>
                        <div className="col-6 text-left mt-2">{uploadStatusResponse?.bulkUploadType}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">No of Records Attempted</label>
                        <div className="col-6 text-left mt-2">{uploadStatusResponse?.noOfRecordsAttempted}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Successfully Uploaded</label>
                        <div className="col-6 text-left mt-2">{uploadStatusResponse?.successfullyUploaded}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Failed</label>
                        <div className="col-6 text-left mt-2">{uploadStatusResponse?.failed}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Uploaded By</label>
                        <div className="col-6 text-left mt-2">{(uploadStatusResponse?.createdByDetails?.firstName || '') + ' ' + (uploadStatusResponse?.createdByDetails?.lastName || '')}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Uploaded Date and Time</label>
                        <div className="col-6 text-left mt-2">{uploadStatusResponse?.createdAt ? moment(uploadStatusResponse?.createdAt).format('DD-MMM-YYYY hh:mm:ss A') : '-'}</div>
                    </div>
                    <div className="col-12 form-group row">
                        <label htmlFor="email_address" className="col-4 col-form-label text-md-left">Successfully Uploaded Data</label>
                        <div className="row align-items-center bg-white mt-2">
                            <div className="form-group row bg-white border p-2">
                                <div className="col-auto">
                                    <div className="avatar-sm">
                                        <a onClick={() => exportToCSV('finalList')}>
                                            <span className="avatar-title bg-primary rounded">
                                                <i className="mdi mdi-microsoft-excel font-22"></i>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div className="col">
                                    <a className="text-black font-weight-bold" onClick={() => exportToCSV('finalList')}>{`AIOS_Outstanding_${selectedTemplateType.toLowerCase()}_Template_${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`}</a>
                                </div>
                                <div className="col-auto">
                                    <a className="btn btn-link btn-lg text-muted" onClick={() => exportToCSV('finalList')}>
                                        <i className="dripicons-download"></i>
                                    </a>
                                </div>
                            </div>
                            {
                                !!uploadStatusResponse?.extraList?.length &&
                                <div className="form-group row bg-white border p-2">
                                    <div className="col-auto">
                                        <div className="avatar-sm">
                                            <a onClick={() => exportToCSV('extraList')}>
                                                <span className="avatar-title bg-primary rounded">
                                                    <i className="mdi mdi-microsoft-excel font-22"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <a className="text-black font-weight-bold" onClick={() => exportToCSV('extraList')}>{`AIOS_NoOustanding_${selectedTemplateType.toLowerCase()}_Template_${moment(new Date()).format('DD-MMM-YYYY')}.xlsx`}</a>
                                    </div>
                                    <div className="col-auto">
                                        <a className="btn btn-link btn-lg text-muted" onClick={() => exportToCSV('extraList')}>
                                            <i className="dripicons-download"></i>
                                        </a>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default SubmitTemplate