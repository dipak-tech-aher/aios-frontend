/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from 'react';
import ServiceRequestActions from '../common/ServiceRequestActions';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { formatISODateTime } from '../util/dateUtil';
import { post } from '../util/restUtil';
import { InteractionSearchColumns, InteractionSearchHiddenColumns } from './interactionSearchColumns';
import ResolveStatus from './resolveStatus';
import ServiceRequestPreview from './ServiceRequestPreview';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from 'react-toastify';
import NumberFormat from 'react-number-format';
import { formFilterObject } from '../util/util';
import { validateNumber } from '../util/validateUtil';

const InteractionSearch = (props) => {

    const initialValues = {
        customerName: "",
        serviceNumber: "",
        accountNumber: "",
        accountName: "",
        contactNumber: "",
        interactionId: "",
        ticketId:"",    
        unAssignedOnly: false
    }

    const [tableRowData, setTableRowData] = useState([]);
    const [searchInputs, setSearchInputs] = useState(initialValues);
    const [isResolveOpen, setIsResolveOpen] = useState(false);
    const [serviceRequestData, setServiceRequestData] = useState({});
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)
    const [resolveData, setResolveData] = useState({})
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const requestType = params.get('requestType');
    const status = params.get('status');
    const selfDept = params.get('selfDept');
    const startDate = params.get('fromDate');
    const endDate = params.get('toDate');
    const [isCountSearch, setIsCountSearch] = useState(true);
    const [displayForm, setDisplayForm] = useState(true);

    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [listSearch, setListSearch] = useState([]);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true)

    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);

    useEffect(() => {
        if (search !== "") {
            interactionSearchByTypeAndStatus();
            setIsCountSearch(false);
        } else {
            setIsCountSearch(true);
        }
    }, [search, perPage, currentPage])

    useEffect(() => {
        if (!isFirstRender.current && !params.has('status')) {
            getInteractionSearchData();
        }
        else {
            isFirstRender.current = false
        }
    }, [currentPage, perPage])

    const getInteractionSearchData = (fromCallback = false) => {
        showSpinner();
        const { customerName, serviceNumber, accountNumber, accountName, ticketId, interactionId } = searchInputs;
        const requestBody = {
            searchType: "ADV_SEARCH",
            customerName,
            serviceNumber,
            accountNumber,
            accountName,
            ticketId,
            interactionId,
            filters: formFilterObject(filters)
        }

        setListSearch(requestBody);
        post(`${properties.INTERACTION_API}/search?limit=${perPage}&page=${fromCallback ? 0 : Number(currentPage)}`, requestBody)
            .then((response) => {
                if (response.data) {
                    if (Number(response.data.count) > 0) {
                        unstable_batchedUpdates(() => {
                            setTotalCount(response.data.count)
                            setTableRowData(response.data.rows)
                        })
                    }
                    else {
                        toast.error("Records not Found")
                    }
                }
            })
            .finally(() => {
                hideSpinner()
                isTableFirstRender.current = false;
            })
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    const handleInputChange = (e) => {
        const target = e.target;
        setSearchInputs({
            ...searchInputs,
            [target.id]: target.type === 'checkbox' ? target.checked : target.value
        })
    }

    const interactionSearchByTypeAndStatus = () => {
        if (requestType !== undefined && requestType !== null) {
            showSpinner()
            let requestBody = {
                status: status,
                type: requestType,
                selfDept,
                startDate: startDate.split("-").reverse().join("-"),
                endDate: endDate.split("-").reverse().join("-"),
                roleId: JSON.parse(sessionStorage.getItem('auth')).currRoleId,
                filters: formFilterObject(filters)
            }
            setListSearch(requestBody);
            post(`${properties.INTERACTION_API}/search?limit=${perPage}&page=${currentPage}`, requestBody)
                .then((response) => {
                    if (Number(response.data.count) > 0) {
                        unstable_batchedUpdates(() => {
                            setTotalCount(response.data.count)
                            setTableRowData(response.data.rows)
                        })
                    }
                    else {
                        toast.error("No Records Found")
                    }
                })
                .finally(hideSpinner)
        }
    }

    const handleSubmit = (e) => {
        if (e) {
            e.preventDefault();
            if (searchInputs.serviceNumber.length !== 0) {
                if (searchInputs.serviceNumber.length < 3) {
                    toast.error("Please Enter Minimum 3 digits for Access Number")
                    return
                }
            }
            if (searchInputs.accountNumber.length !== 0) {
                if (searchInputs.accountNumber.length < 3) {
                    toast.error("Please Enter Minimum 3 digits for Account Number")
                    return
                }
            }
            if (searchInputs.contactNumber.length !== 0) {
                if (searchInputs.contactNumber.length < 3) {
                    toast.error("Please Enter Minimum 3 digits for Contact Number")
                    return
                }
            }
            isTableFirstRender.current = true;
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
            getInteractionSearchData(true);
        }
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Interaction ID") {
            return (<span className="text-primary" style={{ cursor: "pointer" }} onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
        }
        else if (cell.column.Header === "Created Date") {
            return (<span>{formatISODateTime(cell.value)}</span>)
        }
        else if (cell.column.Header === "Action") {
            return (
                <ServiceRequestActions
                    data={{
                        row: row.original
                    }}
                    handlers={{
                        setIsResolveOpen,
                        setIsPreviewOpen,
                        setResolveData,
                        setServiceRequestData
                    }}
                />
            )
        }
        else if (cell.column.Header === "Customer Name" || cell.column.Header === "Account Name" || cell.column.Header === "Assigned" || cell.column.Header === "Created By") {
            return (<span>{cell.value}</span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleCellLinkClick = (event, rowData) => {
        const { intxnId, customerId, intxnType, intxnTypeDesc, serviceId, accountId, woType, woTypeDesc } = rowData;
        if (intxnType === 'REQCOMP' || intxnType === 'REQINQ' || intxnType === 'REQSR') {
            const isAdjustmentOrRefund = ['Adjustment', 'Refund'].includes(woTypeDesc) ? true : ['Fault'].includes(woTypeDesc) && intxnType === 'REQSR' ? true : false;
            props.history.push(`${process.env.REACT_APP_BASE}/edit-${intxnTypeDesc.toLowerCase().replace(' ', '-')}`, {
                data: {
                    customerId,
                    serviceId,
                    interactionId: intxnId,
                    accountId,
                    type: isAdjustmentOrRefund ? 'complaint' : intxnTypeDesc.toLowerCase(),
                    woType,
                    isAdjustmentOrRefund,
                    row: rowData
                }
            })
        }
    }

    const handleParentModalState = () => {
        setIsPreviewOpen(false);
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col">
                    <div className="page-title-box">
                        <h4 className="page-title">Interactions Search</h4>
                    </div>
                </div>
                {
                    isCountSearch === false &&
                    <div className="col-auto">
                        <button type="button" onClick={() => props.history.goBack()} className="btn btn-labeled btn-primary btn-sm mt-1">Back</button>
                    </div>
                }

            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="search-result-box m-t-30 card-box">
                        {isCountSearch && (
                            <div id="searchBlock" className="modal-body p-2 d-block">
                                <div className="d-flex justify-content-end">
                                    <h6 style={{ color: "orange", cursor: "pointer" }} onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Search" : "Show Search"}</h6>
                                </div>
                                {
                                    displayForm &&
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="interactionId" className="control-label">Interaction ID</label>
                                                    <NumberFormat
                                                        value={searchInputs.interactionId}
                                                        onKeyPress={(e) => {
                                                            validateNumber(e);
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="interactionId"
                                                        placeholder="Enter Interaction ID" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="customerName" className="control-label">Customer Name</label>
                                                    <input
                                                        value={searchInputs.customerName}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="customerName"
                                                        placeholder="Enter Customer Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="serviceNumber" className="control-label">Access Number</label>
                                                    <input
                                                        type='text'
                                                        maxLength={15}
                                                        value={searchInputs.serviceNumber}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        id="serviceNumber"
                                                        placeholder="Enter Access Number" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="accountNumber" className="control-label">Account Number</label>
                                                    <NumberFormat
                                                        value={searchInputs.accountNumber}
                                                        onKeyPress={(e) => {
                                                            validateNumber(e);
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="accountNumber"
                                                        placeholder="Enter Account Number" />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="accountName" className="control-label">Account Name</label>
                                                    <input
                                                        value={searchInputs.accountName}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="accountName"
                                                        placeholder="Enter Account Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="ticketId" className="control-label">Ticket ID</label>
                                                    <input
                                                        value={searchInputs.ticketId}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="ticketId"
                                                        placeholder="Enter Ticket ID"
                                                    />
                                                    {/*
                                                    <NumberFormat
                                                        type="text"
                                                        maxLength={7}
                                                        value={searchInputs.contactNumber}
                                                        onKeyPress={(e) => {
                                                            validateNumber(e);
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        id="contactNumber"
                                                        placeholder="Enter Primary Contact Number "
                                                    />
                                                    */ }
                                                </div>
                                            </div>
                                            <div className="col-md-4 switchery-demo">
                                                {/* <div className="custom-control custom-switch">
                                                    <input onChange={handleInputChange} checked={searchInputs.unAssignedOnly} type="checkbox" className="custom-control-input" id="unAssignedOnly" />
                                                    <label className="custom-control-label" htmlFor="unAssignedOnly">Unassigned only</label>
                                                </div> */}
                                            </div>
                                            <div className="col-md-4 text-center mt-3">
                                                <button type="submit" className="btn btn-primary waves-effect waves- mr-2">Search</button>
                                                <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={() => { setSearchInputs(initialValues); setTableRowData([]) }}>Clear</button>
                                            </div>
                                        </div>
                                    </form>
                                }
                            </div>
                        )}
                        {
                            !!tableRowData.length &&
                            <div class="row mt-2">
                                <div class="col-lg-12">
                                    {
                                        !!tableRowData.length &&
                                        <div class="card">
                                            <div class="card-body" id="datatable">
                                                <DynamicTable
                                                    listKey={"Interactions Search"}
                                                    listSearch={listSearch}
                                                    row={tableRowData}
                                                    header={InteractionSearchColumns}
                                                    rowCount={totalCount}
                                                    handleRow={setResolveData}
                                                    itemsPerPage={perPage}
                                                    hiddenColumns={InteractionSearchHiddenColumns}
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
                        {
                            isResolveOpen ?
                                <ResolveStatus value={resolveData} isOpen={isResolveOpen} setIsOpen={setIsResolveOpen} refreshSearch={handleSubmit} />
                                :
                                <></>
                        }
                        {
                            isPreviewOpen &&
                            <ServiceRequestPreview data={{ serviceRequestData }} stateHandlers={{ handleParentModalState: handleParentModalState }} />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InteractionSearch;