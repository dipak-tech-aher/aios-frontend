/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react'
import NumberFormat from 'react-number-format';
import { toast } from 'react-toastify';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import { CustomerAdvanceSearchColumns, CustomerAdvanceSearchHiddenColumns } from './CustomerAdvanceSearchColumns';
import { unstable_batchedUpdates } from 'react-dom';
import { validateNumber } from '../util/validateUtil';
import { formFilterObject } from '../util/util';

const CustomerAdvanceSearch = (props) => {
    const initialValues = {
        customerName: "",
        customerNumber: "",
        serviceNumber: "",
        accountNumber: "",
        accountName: "",
        primaryContactNumber: "",
        idType: "",
        idValue: ""
    }
    const [searchInputs, setSearchInputs] = useState(initialValues);
    const [displayForm, setDisplayForm] = useState(true);
    const [idTypeLookup, setIdTypeLookup] = useState();
    const [listSearch, setListSearch] = useState([]);
    const [customerSearchData, setCustomerSearchData] = useState([]);

    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true)

    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);

    useEffect(() => {
        post(properties.BUSINESS_ENTITY_API, [
            'ID_TYPE'
        ])
            .then((response) => {
                if (response.data) {
                    let lookupData = response.data;
                    setIdTypeLookup(lookupData['ID_TYPE']);
                }
            })
    }, [])

    useEffect(() => {
        if (!isFirstRender.current) {
            getCustomerData();
        }
        else {
            isFirstRender.current = false;
        }
    }, [currentPage, perPage])

    const getCustomerData = () => {
        showSpinner();
        const requestBody = {
            "searchType": "ADV_SEARCH",
            ...searchInputs,
            filters: formFilterObject(filters)
        }
        setListSearch(requestBody);
        //setSearchInputs(initialValues)
        post(`${properties.CUSTOMER_API}/search?limit=${perPage}&page=${currentPage}`, requestBody)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        const { count, rows } = resp.data;
                        unstable_batchedUpdates(() => {
                            setTotalCount(count)
                            setCustomerSearchData(rows);
                        })
                    } else {
                        setCustomerSearchData([])
                        toast.error("Records Not Found")
                        //toast.error("Error searching for customer - " + resp.status + ', ' + resp.message);
                    }
                } else {
                    setCustomerSearchData([])
                    toast.error("Records Not Found")
                    //toast.error("Uexpected error searching for customer " + resp.statusCode);
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
        if (e.target.id === "idType") {
            setSearchInputs({
                ...searchInputs,
                [target.id]: target.value,
                idValue: ""
            })
            return;
        }
        setSearchInputs({
            ...searchInputs,
            [target.id]: target.value
        })
    }

    const handleSubmit = (e) => {
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
        if (searchInputs.primaryContactNumber.length !== 0) {
            if (searchInputs.primaryContactNumber.length < 3) {
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

    const handleIdNumber = (val) => {
        if (searchInputs.idType !== "PASSPORT") {
            let prefix = val.substring(0, 2)
            let postfix = val.substring(2, 8)
            return prefix + (postfix.length ? '-' + postfix : '');
        }
        else {
            return "";
        }
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Customer Number" || cell.column.Header === "Account Number" || cell.column.Header === "Access Number") {
            return (<span className="text-primary cursor-pointer" id="CUSTOMERID" onClick={(e) => handleOnCellActionsOrLink(e, row.original, cell.column.Header)}>{cell.value}</span>)
        }
        else if (cell.column.Header === "Action") {
            return (
                <div className="btn-group">
                    <button type="button" id="Complaint"
                        className="btn btn-sm btn-outline-primary text-primary"
                        onClick={(e) => handleOnCellActionsOrLink(e, row.original, cell.column.Header)}>
                        <i className="mdi mdi-pencil ml-0 mr-2 font-10 vertical-middle" />
                        Create Complaint
                    </button>
                    <button type="button" className="btn btn-sm btn-outline-primary text-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i className="mdi mdi-chevron-down"></i>
                    </button>
                    <div className="dropdown-menu dropdown-menu-right">
                        <button
                            id="Inquiry"
                            className="dropdown-item text-primary"
                            onClick={(e) => handleOnCellActionsOrLink(e, row.original, cell.column.Header)}>
                            <i className="mdi mdi-account-question  ml-0 mr-2 font-10 vertical-middle" />
                            Create Inquiry
                        </button>
                        <button
                            id="Service Request"
                            className="dropdown-item text-primary"
                            onClick={(e) => handleOnCellActionsOrLink(e, row.original, cell.column.Header)}>
                            <i className="mdi mdi-nut  ml-0 mr-2 font-10 vertical-middle" />
                            Create Service Request
                        </button>
                    </div>
                </div >
            )
        }
        return (<span>{cell.value}</span>);
    }

    const handleOnCellActionsOrLink = (event, rowData, header) => {
        const { id } = event.target;
        const { customerId, accountId, accountNo, accountName, accountContactNo, accountEmail, serviceId, accessNbr, serviceStatus, prodType } = rowData;
        sessionStorage.setItem("accountNo", rowData.accountNo)
        sessionStorage.setItem("customerId", rowData.customerId)
        sessionStorage.setItem("accountId", rowData.accountId)
        sessionStorage.setItem("serviceId", rowData.serviceId)
        if (header === "Customer Number") {
            sessionStorage.removeItem("service")
            sessionStorage.removeItem("account")
        }
        if (header === "Account Number") {
            sessionStorage.removeItem("service")
            sessionStorage.setItem("account", true)
        }
        if (header === "Access Number") {
            sessionStorage.removeItem("account")
            sessionStorage.setItem("service", true)
        }
        sessionStorage.setItem('accessNbr', rowData.accessNbr)
        const data = {
            customerId,
            accountId,
            accountNo,
            accountName,
            accountContactNo,
            accountEmail,
            serviceId,
            serviceNo: accessNbr,
            serviceStatus,
            serviceType: prodType,
            accessNumber: rowData.accessNbr,
            sourceName: 'customer360',
            type: id
        }
        if (['Complaint', 'Service Request'].includes(id)) {
            if (serviceStatus === "PENDING") {
                toast.error(`${id} cannot be created when service is in PENDING status`);
                return false;
            }
            props.history.push(`${process.env.REACT_APP_BASE}/create-${id.toLowerCase().replace(' ', '-')}`, { data })
        }
        else if (id === 'Inquiry') {
            if (serviceStatus === "PENDING") {
                toast.error(`${id} cannot be created when service is in PENDING status`);
                return false;
            }
            props.history.push(`${process.env.REACT_APP_BASE}/create-inquiry-new-customer`, { data })
        }
        else {
            props.history.push(`${process.env.REACT_APP_BASE}/customer360`/*, { data }*/)
        }
    }

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box">
                            <h4 className="page-title">Customer Advance Search</h4>
                        </div>
                    </div>
                </div>
                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="search-result-box m-t-30 card-box">
                            <div id="searchBlock" className="modal-body p-2 d-block">
                                <div className="d-flex justify-content-end">
                                    <h6 className="cursor-pointer" style={{ color: "orange" }} onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Search" : "Show Search"}</h6>
                                </div>
                                {
                                    displayForm && (
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="serviceNumber" className="control-label">Access Number</label>
                                                        <input
                                                            maxLength={15}
                                                            value={searchInputs.serviceNumber}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                            className="form-control"
                                                            id="serviceNumber"
                                                            placeholder="Enter Access Number"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="customerNumber" className="control-label">Customer Number</label>
                                                        <NumberFormat
                                                            value={searchInputs.customerNumber}
                                                            onKeyPress={(e) => {
                                                                validateNumber(e);
                                                                if (e.key === "Enter") {
                                                                    handleSubmit(e)
                                                                };
                                                            }}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                            className="form-control"
                                                            id="customerNumber"
                                                            placeholder="Enter Customer Number"
                                                        />
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
                                                            placeholder="Enter Account Number"
                                                        />
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
                                                        <label htmlFor="primaryContactNumber" className="control-label">Primary Contact Number</label>
                                                        <NumberFormat
                                                            maxLength={7}
                                                            onKeyPress={(e) => {
                                                                validateNumber(e);
                                                                if (e.key === "Enter") {
                                                                    handleSubmit(e)
                                                                };
                                                            }}
                                                            value={searchInputs.primaryContactNumber}
                                                            onChange={handleInputChange}
                                                            type="text"
                                                            className="form-control"
                                                            id="primaryContactNumber"
                                                            placeholder="Enter Primary Contact Number"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="idType" className="control-label">ID Type</label>
                                                        <select id="idType" className="form-control" value={searchInputs.idType} onChange={handleInputChange}>
                                                            <option key="idType" value="">Choose ID Type</option>
                                                            {
                                                                idTypeLookup && idTypeLookup.map((id) => (
                                                                    <option key={id.code} value={id.code}>{id.description}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                                {
                                                    searchInputs.idType === "PASSPORT" ?
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="idValue" className="control-label">ID Number</label>
                                                                <input
                                                                    maxLength={15}
                                                                    value={searchInputs.idValue}
                                                                    onChange={handleInputChange}
                                                                    className="form-control"
                                                                    id="idValue"
                                                                    placeholder="Enter ID Number"
                                                                />
                                                            </div>
                                                        </div>
                                                        :
                                                        <div className="col-md-4">
                                                            <div className="form-group">
                                                                <label htmlFor="idValue" className="control-label">ID Number</label>
                                                                <NumberFormat
                                                                    maxLength={9}
                                                                    format={handleIdNumber}
                                                                    className="form-control"
                                                                    id="idValue"
                                                                    placeholder="Enter ID Number"
                                                                    value={searchInputs.idValue}
                                                                    onKeyPress={(e) => {
                                                                        if (e.key === "Enter") {
                                                                            handleSubmit(e)
                                                                        };
                                                                    }}
                                                                    onChange={handleInputChange}
                                                                />
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                            <div className="col-md-12 text-center mt-2">
                                                <button type="submit" className="btn btn-primary waves-effect waves- mr-2">Search</button>
                                                <button type="button" className="btn btn-secondary waves-effect waves-light" onClick={() => { setSearchInputs(initialValues); setCustomerSearchData([]); }}>Clear</button>
                                            </div>
                                        </form>
                                    )
                                }
                            </div>
                            {
                                !!customerSearchData.length &&
                                <div className="row mt-2">
                                    <div className="col-lg-12">
                                        {
                                            !!customerSearchData.length &&
                                            <div className="card">
                                                <div className="card-body" id="datatable">
                                                    <div style={{  }}>
                                                        <DynamicTable
                                                            listSearch={listSearch}
                                                            listKey={"Customer Advance Search"}
                                                            row={customerSearchData}
                                                            rowCount={totalCount}
                                                            header={CustomerAdvanceSearchColumns}
                                                            itemsPerPage={perPage}
                                                            hiddenColumns={CustomerAdvanceSearchHiddenColumns}
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
                            {/* {
                                !!customerSearchData.length &&
                                <div className="p-2">
                                    <DynamicTable
                                        row={customerSearchData}
                                        rowCount={totalCount}
                                        header={CustomerAdvanceSearchColumns}
                                        itemsPerPage={perPage}
                                        hiddenColumns={CustomerAdvanceSearchHiddenColumns}
                                        backendPaging={true}
                                        backendCurrentPage={currentPage}
                                        handler={{
                                            handleCellRender: handleCellRender,
                                            handlePageSelect: handlePageSelect,
                                            handleItemPerPage: setPerPage,
                                            handleCurrentPage: setCurrentPage
                                        }}
                                    />
                                </div>
                            } */}
                        </div>
                    </div >
                </div >
            </div >
        </>
    );
}

export default CustomerAdvanceSearch;