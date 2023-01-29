import React, { useCallback, useEffect, useRef, useState } from 'react'
import NumberFormat from 'react-number-format';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import { validateNumber } from '../util/validateUtil';
import { RecordExtractorColumns } from './SearchExcelRecordsColumns';
import moment from 'moment';
import { formFilterObject } from '../util/util';
import { unstable_batchedUpdates } from 'react-dom';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import SearchExcelViewUploadDataModal from './SearchExcelViewlUploadDataModal';

const SearchExcelRecords = (props) => {

    const { type } = props.location?.state?.data;

    const helperValues = {
        RecordExtractor: {
            title: 'Record Extractor',
            tableColumns: RecordExtractorColumns
        }
    }

    const initialValues = {
        processId: "",
        uploadType: "",
        uploadedBy: "",
        uploadedDate: ""
    };

    const [searchInputs, setSearchInputs] = useState(initialValues);
    const [entityTypes, setEntityTypes] = useState({
        uploadType: []
    });
    const [tableRowData, setTableRowData] = useState([]);
    const [displayForm, setDisplayForm] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const modalViewData = useRef({});

    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [listSearch, setListSearch] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true)

    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);

    const getEntityLookup = useCallback(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['BULK_UPLOAD'])
            .then((response) => {
                const { data } = response;
                setEntityTypes({
                    uploadType: data['BULK_UPLOAD'],
                });
            })
            .catch(error => {
                console.error(error);
            })
            .finally(hideSpinner)
    }, [])

    const getExtractedRecordList = useCallback(() => {
        showSpinner();
        const requestBody = {
            ...searchInputs,
            filters: formFilterObject(filters)
        }
        setListSearch(requestBody);
        post(`${properties.CUSTOMER_API}/list-bulk-data?limit=${perPage}&page=${currentPage}`, requestBody)
            .then((response) => {
                const { status, data } = response;
                if (status === 200) {
                    setTotalCount(data.count)
                    setTableRowData(data.rows);
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(hideSpinner)
    }, [currentPage, filters, perPage])

    useEffect(() => {
        if (!isFirstRender.current) {
            if (type === 'Record Extractor') {
                getExtractedRecordList();
            }
            else {

            }
        }
        else {
            isFirstRender.current = false
            getEntityLookup();
        }
    }, [type, currentPage, perPage, getEntityLookup, getExtractedRecordList])

    const handleCellRender = (cell, row) => {

        if (cell.column.Header === "Uploaded By") {
            return (<span>{`${cell?.row?.original?.createdByDetails?.firstName || '-'} ${cell?.row?.original?.createdByDetails?.lastName || '-'}`}</span>)
        }
        else if (cell.column.Header === "Upload Type") {
            return (
                <span className="text-capitalize"> {row?.original?.bulkUploadTypeDescription?.description || row?.original?.bulkUploadType}</span>
            )
        }
        else if (["Uploaded Date and Time", "Successfully Uploaded"].includes(cell.column.Header)) {
            return (<span>{cell.value ? moment(cell.value).format('DD MMM YYYY hh:mm:ss A') : '-'}</span>)
        }
        else if (cell.column.Header === "Action") {
            return (
                <>
                    <button type="button" className="btn btn-outline-primary waves-effect waves-light btn-sm mr-1" onClick={() => handleOnView(row?.original)}>
                        <i className="mdi mdi-eye  ml-0 mr-2 font-10 vertical-middle" />
                        View
                    </button>
                    <button type="button" className="btn btn-outline-primary waves-effect waves-light btn-sm" onClick={() => handleOnDownload(row?.original)}>
                        <i className={`mdi ${['CALL_COLLECTION'].includes(row?.original?.bulkUploadType) ? 'mdi-download-multiple' : 'mdi-download'}   ml-0 mr-2 font-10 vertical-middle`} />
                        Download
                    </button>
                </>
            )
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleOnView = (row) => {
        modalViewData.current = row;
        setIsOpen(true);
    }

    const handleOnDownload = (row) => {
        try {
            const { bulkUploadType, payload, bulkUploadTypeDescription = {} } = row;
            showSpinner()
            let tableData1 = [];
            let tableData2 = [];
            switch (bulkUploadType) {
                case 'CALL_COLLECTION':
                    payload?.outstanding?.forEach(element => {
                        let objConstruct = {}
                        objConstruct["Customer Number"] = element?.customerNo
                        objConstruct["Account Number"] = element?.accountNo
                        objConstruct["Contact Number"] = element?.contactNo
                        tableData1.push(objConstruct);
                    })
                    payload?.noOutstanding?.forEach(element => {
                        let objConstruct = {}
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
                        tableData2.push(objConstruct)
                    })
                    createExcel(`${bulkUploadTypeDescription?.description}_Outstanding`, tableData1)
                    createExcel(`${bulkUploadTypeDescription?.description}_NoOutstanding`, tableData2)
                    break;
                default:
                    payload?.forEach(element => {
                        let objConstruct = {}
                        objConstruct["Ticket ID"] = element?.ticketId
                        objConstruct["Ticket Type"] = element?.ticketType
                        objConstruct["service Number"] = element?.serviceNo
                        objConstruct["Service Type"] = element?.serviceType
                        objConstruct["Problem Code"] = element?.problemCode
                        objConstruct["Nature Code"] = element?.natureCode
                        objConstruct["Cause Code"] = element?.causeCode
                        objConstruct["Clear Code"] = element?.clearCode
                        objConstruct["Last Comment"] = element?.lastCommment
                        objConstruct["Ticket Description"] = element?.ticketDescription
                        tableData1.push(objConstruct);
                    })
                    createExcel(`${bulkUploadTypeDescription?.description}_Outstanding`, tableData1)
                    break;
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            hideSpinner();
        }
    }

    const createExcel = (typeName, tableData) => {
        if (!!tableData.length) {
            const fileName = `AIOS_${typeName.toLowerCase()}_Template_${moment(new Date()).format('DD MMM YYYY')}`
            const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
            const ws = XLSX.utils.json_to_sheet(tableData,
                {
                    origin: 'A2',
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
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    const handleInputChange = (e) => {
        const target = e.target;
        setSearchInputs({
            ...searchInputs,
            [target.id]: target.value
        })
    }

    const handleOnKeyPress = (e) => {
        const { key } = e;
        validateNumber(e);
        if (key === "Enter") {
            handleSubmit(e)
        };
    }

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
            unstable_batchedUpdates(() => {
                setFilters([])
                setCurrentPage((currentPage) => {
                    if (currentPage === 0) {
                        return '0'
                    }
                    return 0
                });
            })
        }
        else {
            getExtractedRecordList();
        }
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="page-title-box">
                        <h4 className="page-title">{helperValues[type?.replace(' ', '')]?.title} Search</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="search-result-box m-t-30 card-box">
                        <div id="searchBlock" className="modal-body p-2 d-block">
                            <div className="d-flex justify-content-end">
                                <h6 className='cursor-pointer' onClick={() => { setDisplayForm(!displayForm) }}>
                                    {displayForm ? "Hide Search" : "Show Search"}
                                </h6>
                            </div>
                            {
                                displayForm &&
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="processId" className="control-label">Process ID</label>
                                                <NumberFormat
                                                    value={searchInputs.processId}
                                                    onKeyPress={(e) => handleOnKeyPress(e)}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    className="form-control"
                                                    id="processId"
                                                    placeholder="Enter Proccess ID" />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="uploadType" className="control-label">Upload Type</label>
                                                <select id='uploadType' className='form-control' value={searchInputs.uploadType} onChange={handleInputChange} >
                                                    <option value="">Select Upload Type</option>
                                                    {
                                                        entityTypes?.uploadType?.map((e) => (
                                                            <option key={e.code} value={e.code}>{e.description}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="uploadedBy" className="control-label">Uploaded By</label>
                                                <input
                                                    value={searchInputs.uploadedBy}
                                                    onChange={handleInputChange}
                                                    type="text"
                                                    className="form-control"
                                                    id="uploadedBy"
                                                    placeholder="Enter Uploaded By"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="uploadedDate" className="control-label">Uploaded Date</label>
                                                <input
                                                    value={searchInputs.uploadedDate}
                                                    onChange={handleInputChange}
                                                    type="date"
                                                    className="form-control"
                                                    id="uploadedDate"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <div className="text-center mt-3">
                                            <button type="submit" className="btn btn-primary waves-effect waves- mr-2">Search</button>
                                            <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={() => { setSearchInputs(initialValues); setTableRowData([]) }}>Clear</button>
                                        </div>
                                    </div>
                                </form>
                            }
                        </div>
                        {
                            !!tableRowData.length &&
                            <div className="row mt-2">
                                <div className="col-lg-12">
                                    {
                                        <div className="card">
                                            <div className="card-body" id="datatable">
                                                <DynamicTable
                                                    listKey={`${type} Search`}
                                                    listSearch={listSearch}
                                                    row={tableRowData}
                                                    header={helperValues[type?.replace(' ', '')]?.tableColumns}
                                                    rowCount={totalCount}
                                                    itemsPerPage={perPage}
                                                    backendPaging={true}
                                                    backendCurrentPage={currentPage}
                                                    isTableFirstRender={isTableFirstRender}
                                                    hasExternalSearch={hasExternalSearch}
                                                    exportBtn={exportBtn}
                                                    handler={{
                                                        handleCellRender: handleCellRender,
                                                        handlePageSelect: handlePageSelect,
                                                        handleItemPerPage: setPerPage,
                                                        handleCurrentPage: setCurrentPage,
                                                        handleFilters: setFilters,
                                                        handleExportButton: setExportBtn
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {
                isOpen && (
                    <SearchExcelViewUploadDataModal
                        data={{
                            isOpen,
                            row: modalViewData.current
                        }}
                        handlers={{
                            setIsOpen
                        }}
                    />
                )
            }
        </div>
    )
}

export default SearchExcelRecords