import React, { useRef, useEffect, useState } from 'react';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from 'react-toastify';
import { formFilterObject } from '../util/util';
import NumberFormat from 'react-number-format';
import moment from 'moment'
import WhatsAppChatHistory from './WhatsAppChatHistory';
var momentTz = require('moment-timezone');

const WhatsAppSearch = () => {

    const initialValues = {
        whatsappNumber: "",
        sessionStartFrom: "",
        sessionEndTo: "",
        serviceType: "",
        accessNumber: "",
        customerName: "",
        contactNumber: "",
        emailId: "",
        interactionId: "",
        interactionStatus: ""
    }
    const [searchInputs, setSearchInputs] = useState(initialValues);
    const [searchData, setSearchData] = useState([]);
    const [displayForm, setDisplayForm] = useState(true);
    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true)
    const [listSearch, setListSearch] = useState([]);
    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);
    const [interactionStatusList, setInteractionStatusList] = useState([])
    const serviceTypes = ['Fixed','Prepaid','Postpaid']
    const [whatsappHistoryData,setWhatsappHistoryData] = useState({})
    const [isOpen,setIsOpen] = useState(false)

    useEffect(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ["INTERACTION_STATUS"])
            .then((response) => {
                if (response.data) {
                    setInteractionStatusList(response.data["INTERACTION_STATUS"].filter((x) => !['CLOSED-INCOMPLETE',
                        'ERROR', 'DONE-INCOMPLETE', 'MANUAL', 'CLOSED-INCOMPLETE', 'FAILED', 'PEND-CLOSE', 'REJECT',
                        'APPROVE', 'UNFULFILLED', 'RESOLVED', 'PEND-INV'].includes(x.code)))
                }
            })
            .catch(error => {
                console.error(error);
            })
            .finally(hideSpinner)
    }, [])

    useEffect(() => {
        if (!isFirstRender.current) {
            handleSearch();
        }
        else {
            isFirstRender.current = false;
        }
    }, [currentPage, perPage])

    const handleSubmit = (e) => {
        e.preventDefault();

        isFirstRender.current = true;
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

    const handleSearch = () => {
        showSpinner();
        const requestBody = {
            ...searchInputs,
            filters: formFilterObject(filters)
        }
        setListSearch(requestBody);
        post(`${properties.WHATSAPP}/search?limit=${perPage}&page=${currentPage}`, requestBody)
            .then((resp) => {
                if (resp ?.data) {
                    if (resp ?.status === 200) {
                        const { count, rows } = resp ?.data;
                        if (Number(count) > 0) {
                            unstable_batchedUpdates(() => {
                                setTotalCount(count)
                                setSearchData(rows);
                            })
                        }
                        else {
                            if (filters.length === 0) {
                                setSearchData([]);
                            }
                            toast.error("Records Not found");
                            setFilters([]);
                        }
                    } else {
                        setSearchData([]);
                        toast.error("Records Not Found");
                    }
                } else {
                    setSearchData([]);
                    toast.error("Records Not Found");
                }
            }).finally(() => {
                hideSpinner();
                isTableFirstRender.current = false;
            });
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

    const handleCellRender = (cell, row) => {
        if (["Session Start From","Session End To"].includes(cell.column.Header))
        {
            return (<span>{cell.value ? momentTz(cell.value).tz("Asia/Brunei").format('DD MMM YYYY hh:mm:ss A') : "-"}</span>)
        }
        if (cell.column.Header === "WhatsApp Navigation History") {
            return (                    
                <>
                    <button type="button" className="btn btn-primary btn-sm waves-effect waves-light" onClick={() => handleWhatsappHistory(row.original)}>View</button>			
                </>    
            )
        }
        return (<span>{cell.value}</span>);
    }

    const handleWhatsappHistory = (data) => {
        showSpinner();
        const requestBody = {
            reportId: data.reportId
        }
        setListSearch(requestBody);
        post(`${properties.WHATSAPP}/history`, requestBody)
            .then((resp) => {
                if (resp ?.data) {
                    if (resp ?.status === 200) {
                        if(resp.data.length > 0) {
                            setWhatsappHistoryData({
                                whatsappData: data,
                                history: resp.data
                            })
                            setIsOpen(true)
                        } else {
                            setWhatsappHistoryData({})
                            toast.error("No WhatsApp Navitory History Available");
                        }
                    }
                } else {
                    setWhatsappHistoryData({})
                    toast.error("No WhatsApp Navitory History Available");
                }
            }).finally(() => {
                hideSpinner();
            });
    }

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h4 className="page-title">WhatsApp Search</h4>
                    </div>
                </div>
            </div>
            <div className="row mt-1">
                <div className="col-lg-12">
                    <div className="search-result-box m-t-30 card-box">
                        <div id="searchBlock" className="modal-body p-2 d-block">
                            <div className="d-flex justify-content-end">
                                <h6 className="text-primary cursor-pointer" onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Search" : "Show Search"}</h6>
                            </div>
                            {
                                displayForm && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="row">

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="whatsappNumber" className="control-label">WhatsApp ID (Number)</label>
                                                    <input
                                                        value={searchInputs.whatsappNumber}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="whatsappNumber"
                                                        placeholder="Enter WhatsApp Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="sessionStartFrom" className="control-label">Session Start From</label>
                                                    <input
                                                        placeholder='Enter Session Start From'
                                                        value={searchInputs.sessionStartFrom}
                                                        max={moment().format("YYYY-MM-DD")}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="date"
                                                        className="form-control"
                                                        id="sessionStartFrom"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <label htmlFor="sessionEndTo" className="control-label">Session End To</label>
                                                    <input
                                                        placeholder='Enter Session Start From'
                                                        value={searchInputs.sessionEndTo}
                                                        max={moment().format("YYYY-MM-DD")}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="date"
                                                        className="form-control"
                                                        id="sessionEndTo"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="serviceType" className="control-label">Service Type</label>
                                                    <select value={searchInputs.serviceType} id="serviceType" className="form-control"
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Service Type</option>
                                                        {
                                                            serviceTypes && serviceTypes.map((c, index) => {
                                                                return (<option key={index} value={c}>{c}</option>)
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="accessNumber" className="control-label">Access Number</label>
                                                    <input
                                                        value={searchInputs.accessNumber}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="accessNumber"
                                                        placeholder="Enter Contact Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="customerName" className="control-label">Customer Name </label>
                                                    <input
                                                        value={searchInputs.customerName}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="customerName"
                                                        placeholder="Enter Customer Name"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="contactNumber" className="control-label">Contact Number</label>
                                                    <input
                                                        value={searchInputs.contactNumber}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="contactNumber"
                                                        placeholder="Enter Contact Number"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="emailId" className="control-label">Email ID </label>
                                                    <input
                                                        value={searchInputs.emailId}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        type="text"
                                                        className="form-control"
                                                        id="emailId"
                                                        placeholder="Enter Email ID"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="interactionId" className="control-label">Interaction ID</label>
                                                    <NumberFormat
                                                        value={searchInputs.interactionId}
                                                        onKeyPress={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSubmit(e)
                                                            };
                                                        }}
                                                        onChange={handleInputChange}
                                                        className="form-control"
                                                        id="interactionId"
                                                        placeholder="Enter Interaction ID"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <label htmlFor="interactionStatus" className="control-label">Interaction Status</label>
                                                    <select value={searchInputs.interactionStatus} id="interactionStatus" className="form-control"
                                                        onChange={handleInputChange}
                                                    >
                                                        <option value="">Select Interaction Status</option>
                                                        {
                                                            interactionStatusList && interactionStatusList.map((c, index) => {
                                                                return (<option key={index} value={c.code}>{c.description}</option>)
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 text-center mt-2">
                                            <button type="submit" className="btn btn-primary waves-effect waves- mr-2"
                                                onClick={handleSearch}>Search</button>
                                            <button type="button" className="btn btn-secondary waves-effect waves-light"
                                                onClick={() => { setSearchInputs(initialValues); setSearchData([]); }}>Clear</button>
                                        </div>
                                    </form>
                                )}
                        </div>
                        {
                            !!searchData.length &&
                            <div className="row mt-2">
                                <div className="col-lg-12">
                                    {
                                        !!searchData.length &&
                                        < div className="card">
                                            <div className="card-body" id="datatable">
                                                <div style={{}}>
                                                    <DynamicTable
                                                        listKey={"WhatsApp Search"}
                                                        listSearch={listSearch}
                                                        row={searchData}
                                                        rowCount={totalCount}
                                                        header={Columns}
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
                                        </div>
                                    }
                                </div>
                            </div>
                        }
                        {
                            isOpen && 
                            <WhatsAppChatHistory
                                data = {{
                                    isOpen,
                                    whatsappHistoryData
                                }}
                                handler = {{
                                    setIsOpen
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
export default WhatsAppSearch

const Columns = [
    {
        Header: "WhatsApp Number",
        accessor: "whatsappNumber",
        disableFilters: false,
        id: 'WhatsAppId'
    },
    {
        Header: "Session Start From",
        accessor: "createdAt",
        disableFilters: true,
        id: 'sessionStartFrom'
    },
    {
        Header: "Session End To",
        accessor: "endAt",
        disableFilters: true,
        id: 'sessionEndTo'
    },
    {
        Header: "Service Type",
        accessor: "serviceType",
        disableFilters: false,
        id: 'serviceType'
    },
    {
        Header: "Access Number",
        accessor: "accessNumber",
        disableFilters: false,
        id: 'accessNumber'
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: false,
        id: 'customerName'
    },
    {
        Header: "Contact Number ",
        accessor: "contactNumber",
        disableFilters: false,
        id: 'contactNumber'
    },
    {
        Header: "Email ID",
        accessor: "email",
        disableFilters: false,
        id: 'emailId'
    },
    {
        Header: "Interaction ID",
        accessor: "intxnId",
        disableFilters: false,
        id: 'ineractionId'
    },
    {
        Header: "Interaction Status",
        accessor: "interactionDetails.currStatusDesc.description",
        disableFilters: false,
        id: 'interactionStatus'
    },
    {
        Header: "WhatsApp Navigation History",
        accessor: "view",
        disableFilters: true,

    }
]

