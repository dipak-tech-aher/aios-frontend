/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import { unstable_batchedUpdates } from 'react-dom';
import { formFilterObject } from '../util/util';
import { chatReportColumns, chatReporHiddenColumns } from './chatReportColumns';
import { formatISODateTime } from "../util/dateUtil";
import ReactTooltip from "react-tooltip";
import moment from 'moment';

const ChatReport = (props) => {

    const initialValues = {
        chatId: "",
        contactNo: "",
        email: "",
        customerName: "",
        chatFromDate: "",
        chatToDate: "",
        chatStatus: "",
        serviceType: "",
        accessNumber: "",
        agent: ""
    }
    const [searchInputs, setSearchInputs] = useState(initialValues);
    const [displayForm, setDisplayForm] = useState(true);
    const [listSearch, setListSearch] = useState([]);
    const [searchData, setSearchData] = useState([]);

    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true)

    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);

    const [serviceTypeLookup, setServiceTypeLookup] = useState([]);

    useEffect(() => {
        post(properties.BUSINESS_ENTITY_API, ['PROD_TYPE'])
            .then((response) => {
                if (response.data) {
                    let lookupData = response.data;
                    setServiceTypeLookup(lookupData['PROD_TYPE']);
                }
            })
    }, [])

    useEffect(() => {
        if (!isFirstRender.current) {
            getLoginDetails();
        }
        else {
            isFirstRender.current = false;
        }
    }, [currentPage, perPage])

    const getLoginDetails = () => {
        showSpinner();
        const requestBody = {
            ...searchInputs,
            filters: formFilterObject(filters)
        }
        setListSearch(requestBody);
        //setSearchInputs(initialValues)
        post(`${properties.REPORTS_API}/chats?limit=${perPage}&page=${currentPage}`, requestBody)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        const { count, rows } = resp.data;
                        unstable_batchedUpdates(() => {
                            setTotalCount(count)
                            setSearchData(rows);
                        })
                    } else {
                        setSearchData([])
                        toast.error("Records Not Found")
                    }
                } else {
                    setSearchData([])
                    toast.error("Records Not Found")
                }
            }).finally(() => {
                hideSpinner()
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

    const handleSubmit = (e) => {
        e.preventDefault();
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

    const handleCellRender = (cell, row) => {
        if (cell.column.id === "createdAt" || cell.column.id === "endAt") {
            return (
                <span>{cell.value ? formatISODateTime(cell.value) : '-'}</span>
            )
        } else if(cell.column.id === 'responseTime') { 
            return(
                <span>{(cell.row.original.responseMin)? cell.row.original.responseMin :'0'} mins {(cell.row.original.responseSec)? cell.row.original.responseSec :'0'} secs</span>
            )
        } else if(cell.column.id === 'queueWait') { 
            return(
                <span>{(cell.row.original.queueWaitMin)? cell.row.original.queueWaitMin :'0'} mins {(cell.row.original.queueWaitSec)? cell.row.original.queueWaitSec :'0'} secs</span>
            )
        } else if(cell.column.id === 'chatDuration') { 
            return(
                <span>{(cell.row.original.chatDurationMin)? cell.row.original.chatDurationMin :'0'} mins {(cell.row.original.chatDurationSec)? cell.row.original.chatDurationSec :'0'} secs</span>
            )
        } else if(cell.column.id === 'message') { 

            if(cell.row.original.message && cell.row.original.message.length > 0) {
                return(() => {
                    let value = cell.row.original.message[0]
                    let contentData = (value.msg && value.msg.trim() !== '') ? (value.msg.replace('text@@@', '')).split('\n') : []
                    return (
                        <div key='first-msg'>
                            <div className="row col-12 d-flex">
                                <span><strong>[{value.from} {(contentData && contentData.length > 1)? contentData[1] : ''}]: </strong></span>
                            </div>
                            <div className="col-12 d-flex">
                                <div className="flex-grow-1 justify-content-start">
                                    <span>{(contentData && contentData.length > 0)? contentData[0] : ''}</span>
                                </div>
                                <div data-tip data-for="chat-msg" lassName="justify-content-end">
                                    <strong>...</strong>
                                </div>
                            </div>
                            <ReactTooltip id="chat-msg" place="right" effect="solid" className="chatTooltip">
                                {
                                    cell.row.original.message.map((value, index) => {

                                        let contentData = (value.msg && value.msg.trim() !== '') ? (value.msg.replace('text@@@', '')).split('\n') : []
                                                 return (
                                            <div key={index}>
                                                <div className="row col-12 d-flex">
                                                    <span><strong>[{value.from} {(contentData && contentData.length > 1)? contentData[1] : ''}]: </strong></span>
                                                </div>
                                                <div className="col-12 d-flex">
                                                    <span>{(contentData && contentData.length > 0)? contentData[0] : ''}</span>
                                                </div>
                                            </div>
                                        )
                                        })
                                }
                            </ReactTooltip>
                        </div>
                    )
                })
            } else {
                return (
                    <span>-</span>
                )
            }

        } else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleOnCellActionsOrLink = (event, rowData, header) => {

    }

    return (
        <div className="card pt-1">
            <div className="container-fluid">
                <div className="form-row pb-2">
                    <div className="col-12">
                        <section className="triangle">
                            <div className="col-12 row">
                                <div className="col-12"><h4 className="pl-3">Chat Report</h4></div>
                            </div>
                        </section>
                    </div>
                </div>
                <div className="border p-2">
                    <div className="col-12 p-2">
                        <div className="bg-light border pr-0 p-0 row"><div className="col"><h5 className="text-primary pl-2 pt-1">Search</h5></div>
                            <div className="col pt-1">
                                <div className="d-flex justify-content-end">
                                    <h6 className="cursor-pointer" style={{ color: "#142cb1", float: "right" }} onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Search" : "Show Search"}</h6>
                                </div>
                            </div>
                        </div>
                        <div id="searchBlock" className="modal-body p-2 d-block">
                            {
                                displayForm && (
                                    <form onSubmit={handleSubmit}>
                                        <div className="search-result-box p-0">
                                            <div className="autoheight p-1">
                                                <section>
                                                    <div className="form-row pb-2 col-12">
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="chatId" className="control-label">Chat Id</label>
                                                                <input
                                                                    value={searchInputs.chatId}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="chatId"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="contactNo" className="control-label">Contact Number</label>
                                                                <input
                                                                    value={searchInputs.contactNo}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="contactNo"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="email" className="control-label">Email</label>
                                                                <input
                                                                    value={searchInputs.email}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="email"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="customerName" className="control-label">Customer Name</label>
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
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="chatFromDate" className="control-label">Conversation Start From</label>
                                                                <input type="date" id="chatFromDate" className="form-control"
                                                                    value={searchInputs.chatFromDate}
                                                                    max={moment().format("YYYY-MM-DD")}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="chatToDate" className="control-label">Conversation Start To</label>
                                                                <input type="date" id="chatToDate" className="form-control"
                                                                    value={searchInputs.chatToDate}
                                                                    max={moment().format("YYYY-MM-DD")}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="chatStatus" className="control-label">Status</label>
                                                                <select className="form-control" id="chatStatus" value={searchInputs.chatStatus} onChange={handleInputChange}>
                                                                    <option value="">Select Status</option>
                                                                    <option key="NEW" value="NEW">New</option>
                                                                    <option key="ASSIGNED" value="ASSIGNED">Assigned</option>
                                                                    <option key="CLOSED" value="CLOSED">Closed</option>
                                                                    <option jey="ABANDONED" value="ABANDONED">Abandoned</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="serviceType" className="control-label">Service Type</label>
                                                                <select className="form-control" id="serviceType" value={searchInputs.serviceType} onChange={handleInputChange}>
                                                                    <option value="">Select Service Type</option>
                                                                    {
                                                                        serviceTypeLookup && serviceTypeLookup.map((e) => (
                                                                            <option key={e.code} value={e.code}>{e.description}</option>
                                                                        ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
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
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group">
                                                                <label htmlFor="agent" className="control-label">Agent Attended</label>
                                                                <input
                                                                    value={searchInputs.agent}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="agent"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 text-center mt-2">
                                                        <button type="submit" className="btn btn-primary waves-effect waves- mr-2" >Search</button>
                                                        <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={() => { setSearchInputs(initialValues); setSearchData([]); }}>Clear</button>
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </form>
                                )
                            }
                        </div>
                    </div>
                </div>
                {
                    !!searchData.length &&
                    <div className="row mt-2">
                        <div className="col-lg-12">
                            {
                                !!searchData.length &&
                                <div className="card">
                                    <div className="card-body" id="datatable">
                                        <div style={{}}>
                                            <DynamicTable
                                                listSearch={listSearch}
                                                listKey={"Chat Report"}
                                                row={searchData}
                                                rowCount={totalCount}
                                                header={chatReportColumns}
                                                itemsPerPage={perPage}
                                                hiddenColumns={chatReporHiddenColumns}
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
            </div>
        </div>
    );
}

export default ChatReport;