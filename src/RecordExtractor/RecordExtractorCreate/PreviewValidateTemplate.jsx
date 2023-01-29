import React, {useState} from 'react'
import { toast } from 'react-toastify';
import moment from 'moment'
import { hideSpinner, showSpinner } from '../../common/spinner';
import DynamicTable from '../../common/table/DynamicTable';
import { properties } from '../../properties';
import { post } from '../../util/restUtil';

const PreviewValidateTemplate = (props) => {

    const { selectedTemplateType, bulkUploadTemplateList, uploadTemplateList, templateUploadCounts, templateStatusFlags } = props.data
    const { setUploadTemplateList, setTemplateUploadCounts, setTemplateStatusFlags } = props.handler

    const [validated, setValidated] = useState(false)

    const handleCellRender = (cell, row) => {
        if (["Bill Date", "Due Date", "Paid Date"].includes(cell.column.Header)) {
            return (<span>{cell.value ? moment(cell.value).format('DD MMM YYYY') : '-'}</span>)
        }
        return (<span>{cell.value}</span>)
    }

    const handleValidationResult = (invalidRecordFound, templateList, extraList = []) => {
        let rejectedList = [], acceptedList = []
        if (invalidRecordFound === true) {
            setTemplateStatusFlags({ ...templateStatusFlags, validateCheck: true, showErrorCheck: true })
        }
        else {
            setTemplateStatusFlags({ ...templateStatusFlags, validateCheck: true, showErrorCheck: false })
        }
        console.log('templateList', templateList)
        if(templateList && templateList.length > 0) {
            rejectedList = templateList.filter((record) => record.validationStatus === 'FAILED')
            acceptedList = templateList.filter((record) => record.validationStatus === 'SUCCESS')
        }
        console.log('extraList', extraList)
        setTemplateUploadCounts({ ...templateUploadCounts, success: acceptedList.length, failed: rejectedList.length, extra: (extraList) ? extraList.length : 0 })
        setUploadTemplateList({ ...uploadTemplateList, rejectedList: rejectedList, finalList: acceptedList, extraList })
    }

    const handleValidate = () => {
        if (uploadTemplateList?.uploadList.length === 0) {
            toast.error("No Records to Validate")
            return
        }
        let invalidRecordFound = false
        let templateList = uploadTemplateList?.uploadList
        if (selectedTemplateType === 'CALL_COLLECTION') {
            templateList.map((record) => {
                if (record?.customerNo === null || record?.accountNo === null) {
                    record.validationStatus = 'FAILED'
                    record.validationRemark = 'Mandatory Columns(Values) are Missing'
                    invalidRecordFound = true
                }
                else {
                    record.validationStatus = 'SUCCESS'
                }
                return record
            })
            let requestBody = {
                data: uploadTemplateList.uploadList?.map((list) => ({ customerNo: list.customerNo, accountNo: list.accountNo, contactNo: list.contactNo }))
            }
            showSpinner()
            post(`${properties.CUSTOMER_API}/bulk-billing-data`, requestBody)
                .then((response) => {
                    const { status, data } = response;
                    if (status === 200) {
                        let extraList;
                        let newTemplateList = []

                        for(let list of templateList) {
                            let foundData = data?.outstanding?.find((os) => os.accountNo === list.accountNo)
                            if (foundData) {
                                newTemplateList.push({
                                    ...foundData,
                                    validationStatus: 'SUCCESS'
                                })
                            }
                            foundData = data?.validationFailed?.find((os) => os.accountNo === list.accountNo)
                            if(foundData) {
                                newTemplateList.push({
                                    ...list,
                                    validationStatus: 'FAILED',
                                    validationRemark: 'Record Not Found'
                                })
                                invalidRecordFound = true;
                            }
                        }

                        extraList = data?.noOutstanding || []
                        handleValidationResult(invalidRecordFound, newTemplateList, extraList)
                        setValidated(true)
                    }
                })
                .catch((error) => {
                    console.error(error)
                })
                .finally(hideSpinner)
        }
    }

    const getHiddenColumnBasedOnType = (type) => {
        let mainTemplate = bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0];
        return type === 'BF_VALIDATE' ? !!uploadTemplateList?.finalList.length ? ["validationRemark"] : mainTemplate?.tableHiddenColumnsBeforeValidate : mainTemplate?.tableHiddenColumnsWhenFailed;
    }

    return (
        <div className="col-12 mb-3">
            <div className="mb-2">
                <div className="row">
                    <div className="col-12 text-sm-center form-inline">
                        <div className="form-group mr-2">
                        </div>
                        <div className="col-12 text-center">
                            <p className="text-center font-22">{templateUploadCounts?.total} Rows of Records Found </p>
                        </div>
                        <div className="col-md-12 text-left">
                            <p className={`text-danger font-weight-bold font-18 ${templateStatusFlags.validateCheck ? '' : 'd-none'}`}>{templateUploadCounts?.failed}  Invalid Record Found</p>
                        </div>
                        <div className="col-md-12 text-left pt-2">
                            <p className={`text-danger font-weight-bold font-18 ${templateStatusFlags.validateCheck ? '' : 'd-none'}`}>{templateUploadCounts?.success} No. of Records with Outstanding</p>
                        </div>
                        <div className="col-md-12 text-left pt-2">
                        <p className={`text-success font-weight-bold font-18 ${templateStatusFlags.validateCheck ? '' : 'd-none'}`}>{templateUploadCounts?.extra} No. of Records with No Outstanding</p>
                        </div>
                    </div>
                </div>
                {
                    (uploadTemplateList?.uploadList?.length > 0) &&
                    <>
                        <div className=" bg-light border m-2 pr-2 mb-3">
                            <h5 className="text-primary pl-2">Uploaded Records</h5>
                        </div>
                        <div className="card p-1">
                            <DynamicTable
                                row={uploadTemplateList?.uploadList}
                                itemsPerPage={10}
                                header={bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0].tableColumns}
                                hiddenColumns={bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0].uploadedTableHiddenColumns}
                                handler={{
                                    handleCellRender: handleCellRender,
                                }}
                            />
                        </div>
                    </>
                }
                {
                    (uploadTemplateList?.finalList?.length > 0) &&
                    <>
                        {
                            validated && templateUploadCounts?.success > 0 &&
                            <div className=" bg-light border m-2 pr-2 mb-3">
                                <h5 className="text-primary pl-2">Records with Outstanding</h5>
                            </div>
                        }
                        <div className="card p-1">
                            <DynamicTable
                                row={templateStatusFlags.validateCheck === true ? uploadTemplateList?.finalList : uploadTemplateList?.uploadList}
                                itemsPerPage={10}
                                header={bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0].tableColumns}
                                hiddenColumns={getHiddenColumnBasedOnType('BF_VALIDATE')}
                                handler={{
                                    handleCellRender: handleCellRender,
                                }}
                            />
                        </div>
                    </>
                }
                {
                    uploadTemplateList?.extraList.length > 0 && (
                        <>
                            <div className=" bg-light border m-2 pr-2 mb-3 mt-2">
                                <h5 className="text-primary pl-2">Records with No Outstanding</h5>
                            </div>
                            <div className="card p-1">
                                <DynamicTable
                                    row={templateStatusFlags.validateCheck === true && uploadTemplateList?.extraList}
                                    itemsPerPage={10}
                                    header={bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0]?.tableNoOsColumns}
                                    handler={{
                                        handleCellRender: handleCellRender,
                                    }}
                                />
                            </div>
                        </>
                    )
                }
            </div>

            <div className="d-flex  justify-content-center">
                <button className="btn btn-primary" onClick={handleValidate}>Validate</button>
            </div>

            {
                templateStatusFlags.validateCheck && templateStatusFlags.showErrorCheck &&
                <>
                    <div className=" bg-light border m-2 pr-2 mb-3">
                        <h5 className="text-primary pl-2">Invalid Records</h5>
                    </div>
                    {/*
                    <p className="text-danger font-weight-bold font-13">Please correct the failed records and reupload again or you can skip the records</p>
                    */}
                    {
                        uploadTemplateList?.rejectedList && uploadTemplateList?.rejectedList?.length > 0 &&
                        <div className="card p-1">
                            <DynamicTable
                                row={uploadTemplateList?.rejectedList}
                                itemsPerPage={10}
                                header={bulkUploadTemplateList.filter((temp) => temp?.type === selectedTemplateType)[0].tableColumns}
                                hiddenColumns={getHiddenColumnBasedOnType('FAILED')}
                                handler={{
                                    handleCellRender: handleCellRender,
                                }}
                            />
                        </div>
                    }
                    {/*
                    <div className="d-flex justify-content-center">
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="proceedCheck" checked={templateStatusFlags.proceedCheck}
                                onChange={(e) => setTemplateStatusFlags({ ...templateStatusFlags, proceedCheck: e.target.checked })}
                            />
                            <label className="custom-control-label" htmlFor="proceedCheck">Skip Error Data and Proceed to Bulkupload</label>
                        </div>
                    </div>
                    */}
                </>
            }
        </div>
    )
}

export default PreviewValidateTemplate