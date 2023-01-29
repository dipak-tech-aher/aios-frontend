import React, { useContext, useRef, useState, useEffect } from "react";
import { AppContext } from "../AppContext";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import { CustomerSearchColumns, CustomerSearchHiddenColumns, ComplaintCustomerSearchHiddenColumns } from "../customer/customerSearchColumns";
import SearchModal from "./SearchModal";
import { unstable_batchedUpdates } from "react-dom";
import { formFilterObject } from "../util/util";

const MainMenu = () => {

    const history = useHistory();
    let requestParam;
    const { auth } = useContext(AppContext);
    const [errorMsg, setErrorMsg] = useState('')
    const [customerQuickSearchInput, setCustomerQuickSearchInput] = useState("");

    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);

    const isFirstRender = useRef(true);
    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);
    const handleCustomerQuickSearch = (e) => {
        e.preventDefault();
        if (customerQuickSearchInput === undefined || customerQuickSearchInput === "") {
            toast.error("Please enter a value to Search");
        } else {
            requestParam = {
                searchType: 'QUICK_SEARCH',
                customerQuickSearchInput: customerQuickSearchInput
            }
            showSpinner();
            post(properties.CUSTOMER_API + "/search?limit=10&page=0", requestParam)
                .then((resp) => {
                    if (resp.data) {
                        if (resp.status === 200) {
                            if (resp.data.length === 0) {
                                toast.error("No search results available for the given search input");
                            } else if (resp.data.rows.length === 1) {
                                sessionStorage.setItem("customerId", resp.data.rows[0].customerId)
                                sessionStorage.setItem("accountId", resp.data.rows[0].accountId)
                                sessionStorage.setItem("serviceId", resp.data.rows[0].serviceId)
                                sessionStorage.setItem("accountNo", resp.data.rows[0].accountNo)
                                if (Number(resp.data.rows[0].crmCustomerNo) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.removeItem("account")
                                }
                                else if (Number(resp.data.rows[0].accountNo) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.setItem("account", true)
                                }
                                else if (Number(resp.data.rows[0].accessNbr) === Number(customerQuickSearchInput)) {
                                    sessionStorage.removeItem("account")
                                    sessionStorage.setItem("service", true)
                                }
                                else {
                                    sessionStorage.removeItem("service")
                                    sessionStorage.removeItem("account")
                                }
                                history.push(`${process.env.REACT_APP_BASE}/customer360`)
                                //setCustomerQuickSearchInput("")
                            } else {
                                sessionStorage.setItem("searchType", 'QUICK_SEARCH')
                                sessionStorage.setItem("customerQuickSearchInput", customerQuickSearchInput)
                                history.push(`${process.env.REACT_APP_BASE}/search`)
                                //setCustomerQuickSearchInput("")
                            }
                        } else {
                            toast.error("Uexpected error during customer search - " + resp.status + ', ' + resp.message);
                        }
                    } else {
                        toast.error("Records Not Found");
                        //toast.error("Uexpected error during customer search " + resp.statusCode);
                    }
                }).finally(() => {
                    setCustomerQuickSearchInput("");
                    hideSpinner();
                });
        }
    }

    const [isComplaintModalOpen, setIsComplaintModalOpen] = useState({ openModal: false, searchType: '' });
    const [complaintSearchInput, setComplaintSearchInput] = useState("");
    const [complaintSearchData, setComplaintSearchData] = useState([]);

    useEffect(() => {
        if (!isFirstRender.current) {
            getCustomerDataForComplaint()
        }
        else {
            isFirstRender.current = false;
        }
    }, [perPage, currentPage])

    const handleOnCustomerSearch = (e) => {
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

    const getCustomerDataForComplaint = () => {
        requestParam = {
            searchType: 'QUICK_SEARCH',
            customerQuickSearchInput: complaintSearchInput,
            filters: formFilterObject(filters),
            source: 'COMPLAINT'
        }
        showSpinner();
        post(`${properties.CUSTOMER_API}/search?limit=${perPage}&page=${currentPage}`, requestParam)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        const { rows, count } = resp.data;
                        unstable_batchedUpdates(() => {
                            setTotalCount(count)
                            setComplaintSearchData(rows);
                        })
                    } else {
                        setComplaintSearchData([])
                        //toast.error("Error searching for customer - " + resp.status + ', ' + resp.message);
                    }
                } else {
                    setComplaintSearchData([])
                    //toast.error("Uexpected error searching for customer " + resp.statusCode);
                }
            }).finally(hideSpinner);
    }

    const handleCellLinkClick = (e, rowData, searchName) => {
        const { customerId, accountId, accountNo, accountName, accountContactNo, accountEmail, serviceId, accessNbr, serviceStatus, prodType } = rowData;

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
            type: searchName.searchType
        }
        if (['Complaint', 'Service Request'].includes(searchName.searchType)) {
            if (serviceStatus === "PENDING") {
                toast.error('Complaint cannot be created when service is in PENDING status');
                setIsComplaintModalOpen({ ...isComplaintModalOpen, openModal: true });
                return false;
            }
            setIsComplaintModalOpen({ openModal: false });
            history.push(`${process.env.REACT_APP_BASE}/create-${searchName.searchType.toLowerCase().replace(' ', '-')}`, { data })
            setComplaintSearchData([]);
            setComplaintSearchInput("")
        }
        else if (searchName.searchType === 'Inquiry') {
            history.push(`${process.env.REACT_APP_BASE}/create-inquiry-existing-customer`, { data })
            setComplaintSearchData([]);
            setComplaintSearchInput("")
        }

    }
    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Access Number") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original, isComplaintModalOpen)}>{cell.value}</span>)
        } else {
            return (<span>{cell.value}</span>)
        }
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    return (
        <div className="clearfix">
            {auth && auth?.user ? (
                <div id="menu_area" className="menu-area topnav">
                    <div className="container-fluid">
                        <div className="row">
                            <nav className="navbar navbar-light navbar-expand-lg mainmenu topnav-menu">
                                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav">
                                        <li className="nav-item dropdown">
                                            <Link className="nav-link dropdown-toggle arrow-none active" to="/" id="topnav-dashboard">
                                                <i className="fe-airplay mr-1"></i> Dashboard
                                            </Link>
                                        </li>
                                        <li className="dropdown">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-grid mr-1"></i> Interaction <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/ticket-search`} className="dropdown-item">
                                                        <i className="fe-search"></i> Search
                                                    </Link>
                                                </li>

                                                <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() !== 'cso') ? "" : "d-none"}`}>
                                                    <span className="dropdown-item dropdown-toggle arrow-none" id="topnav-new" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fe-plus-circle mr-1"></i>New<div className="arrow-down"></div>
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                        <li className="d-none"> <Link to={() => {
                                                            const dt = new Date()
                                                            return ({
                                                                pathname: `${process.env.REACT_APP_BASE}/new-customer`,
                                                                state: { dt: dt }
                                                            })
                                                        }} className="dropdown-item">Customer</Link></li>
                                                        <li>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/create-inquiry-new-customer`, data: { sourceName: 'fromDashboard' } }}>
                                                                Inquiry
                                                            </Link>

                                                        </li>
                                                        <li> <span onClick={() => setIsComplaintModalOpen({ openModal: true, searchType: 'Complaint' })} className="dropdown-item">Complaint</span></li>
                                                        <li> <span onClick={() => setIsComplaintModalOpen({ openModal: true, searchType: 'Service Request' })} className="dropdown-item">Service request</span></li>
                                                    </ul>
                                                </li>

                                                <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'chat' || auth?.currRole.toLowerCase() === 'cso' || auth?.currRole.toLowerCase() === 'cch') ? "" : "d-none"}`}>
                                                    <span className="dropdown-item dropdown-toggle arrow-none" id="topnav-new" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fe-plus-circle mr-1"></i>Live-Chat<div className="arrow-down"></div>
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                        <li>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/agent-chat`, data: { sourceName: 'fromDashboard' } }}>
                                                                Agent Live Chat
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/agentChatListView`, data: { sourceName: 'fromDashboard' } }}>
                                                                Agent Chat View
                                                            </Link>
                                                        </li>
                                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'cch' || auth?.currRole.toLowerCase() === 'cso') ? "" : "d-none"}`}>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/chat-monitoring`, data: {} }}>
                                                                Chat Monitoring
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown d-none">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-flag mr-1"></i> Manage Campaign <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/add-campaign`} className="dropdown-item">

                                                        <i className="fe-plus-square"></i> Create
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/campaignlist`} className="dropdown-item">
                                                        <i className="fas fa-th-list"></i> List
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/upload-campaign`} className="dropdown-item">
                                                        <i className="fas fa-file-upload"></i> Upload
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className="dropdown d-none">
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-layer-group mr-1"></i> Manage Catalogue <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/create-catalogue`} className="dropdown-item">
                                                        <i className="fe-plus-square"></i> Create
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/catalogue-list-view`} className="dropdown-item" data-toggle="modal">
                                                        <i className="fas fa-th-list"></i> List
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/upload-catalogue`} className="dropdown-item">
                                                        <i className="fas fa-file-upload"></i> Upload
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && auth?.currRole.toLowerCase() === 'admin' ? "" : "d-none"}`}>
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fe-flag mr-1"></i> Manage Organization <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li>
                                                    <Link to={`${process.env.REACT_APP_BASE}/admin-user-view`} className="dropdown-item">
                                                        <i className="fe-plus-square"></i> Admin View
                                                    </Link>
                                                </li>
                                            </ul>
                                        </li>
                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc' || auth?.currRole.toLowerCase() === 'cch'
                                            || auth?.currRole.toLowerCase() === 'bss' || auth?.currRole.toLowerCase() === 'billing' || auth?.currRole.toLowerCase() === 'creditmgmt' || auth?.currRole.toLowerCase() === 'adj' || auth?.currRole.toLowerCase() === 'Op') ? "" : "d-none"}`}>
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-cubes mr-1"></i> MIS <div className="arrow-down"></div>
                                            </span>
                                            <ul className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                                auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc' || auth?.currRole.toLowerCase() === 'cch'
                                                || auth?.currRole.toLowerCase() === 'bss' || auth?.currRole.toLowerCase() === 'billing' || auth?.currRole.toLowerCase() === 'creditmgmt' || auth?.currRole.toLowerCase() === 'adj' || auth?.currRole.toLowerCase() === 'Op'
                                            ) ? "" : "d-none"}`} aria-labelledby="navbarDropdown">

                                                <li key="bulkUpload" className="dropdown">
                                                    <span className="dropdown-item dropdown-toggle arrow-none" id="topnav-new" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fe-plus-circle mr-1"></i>CEM<div className="arrow-down"></div>
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc' || auth?.currRole.toLowerCase() === 'cch'
                                                            || auth?.currRole.toLowerCase() === 'bss' || auth?.currRole.toLowerCase() === 'billing' || auth?.currRole.toLowerCase() === 'creditmgmt' || auth?.currRole.toLowerCase() === 'adj' || auth?.currRole.toLowerCase() === 'Op'
                                                        ) ? "" : "d-none"}`}>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/interaction-report` }}>
                                                                Open/Close Interactions Report
                                                            </Link>
                                                        </li>
                                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc' || auth?.currRole.toLowerCase() === 'cch'
                                                        ) ? "" : "d-none"}`}>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/chat-report` }}>
                                                                Chat Report
                                                            </Link>
                                                        </li>

                                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cch' ||
                                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc') ? "" : "d-none"}`}>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/whatsApp-search` }}>
                                                                WhatsApp Report
                                                            </Link>
                                                        </li>

                                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cch' ||
                                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc') ? "" : "d-none"}`}>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/whatsApp-dashboard` }}>
                                                                WhatsApp Dashboard
                                                            </Link>
                                                        </li>

                                                        <li key="bulkUpload" className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                            auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                                            auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' ||
                                                            auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm' || auth?.currRole.toLowerCase() === 'custeng' ||
                                                            auth?.currRole.toLowerCase() === 'sq' || auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'soc' || auth?.currRole.toLowerCase() === 'cch'
                                                        ) ? "" : "d-none"}`}>
                                                            <span className="dropdown-item dropdown-toggle arrow-none" id="topnav-new" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                Daily Chat Report<div className="arrow-down"></div>
                                                            </span>
                                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                                <li className="dropdown">
                                                                    <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/reports/new-customer-request` }}>
                                                                        New Customer Chat Report
                                                                    </Link>
                                                                </li>
                                                                <li className="dropdown">
                                                                    <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/reports/booster-purchase` }}>
                                                                        Booster Purchase Chat Report
                                                                    </Link>
                                                                </li>
                                                                <li className="dropdown">
                                                                    <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/reports/customer-counts` }}>
                                                                        Customer Chat Report Counts
                                                                    </Link>
                                                                </li>
                                                            </ul>
                                                        </li>
                                                    </ul>
                                                </li>

                                                <li key="bulkUpload" className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'icb' || auth?.currRole.toLowerCase() === 'icbia' ||
                                                    auth?.currRole.toLowerCase() === 'iccs' || auth?.currRole.toLowerCase() === 'ickb' || auth?.currRole.toLowerCase() === 'icm' || auth?.currRole.toLowerCase() === 'icp' || auth?.currRole.toLowerCase() === 'cemhead' ||
                                                    auth?.currRole.toLowerCase() === 'icpm' || auth?.currRole.toLowerCase() === 'icr' || auth?.currRole.toLowerCase() === 'ictb' || auth?.currRole.toLowerCase() === 'icy' || auth?.currRole.toLowerCase() === 'sq' ||
                                                    auth?.currRole.toLowerCase() === 'ss' || auth?.currRole.toLowerCase() === 'c.s.o' || auth?.currRole.toLowerCase() === 'brm') ? "" : "d-none"}`}>
                                                    <span className="dropdown-item dropdown-toggle arrow-none" id="topnav-new" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fe-plus-circle mr-1"></i>Sales<div className="arrow-down"></div>
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                        <li>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/sales-dashboard` }}>
                                                                Sales Dashboard
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link className="dropdown-item" to={{ pathname: `${process.env.REACT_APP_BASE}/Branch-sales-dashboard` }}>
                                                                Branch Sales Dashboard
                                                            </Link>
                                                        </li>
                                                        {/* <li>
                                                            <Link className="dropdown-item d-none" to={{ pathname: `${process.env.REACT_APP_BASE}/sales-report` }}>
                                                                Sales Report
                                                            </Link>
                                                        </li> */}
                                                    </ul>
                                                </li>


                                                <li></li>
                                                <li></li>
                                            </ul>
                                        </li>
                                        <li className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'cch') ? "" : "d-none"}`} >
                                            <span className="nav-link dropdown-toggle arrow-none" id="topnav-apps" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <i className="fas fa-layer-group mr-1"></i> Manage Parameters <div className="arrow-down"></div>
                                            </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li className={`dropdown ${auth && auth?.currRole !== undefined && auth?.currRole.toLowerCase() === 'admin' ? "" : "d-none"}`}>
                                                    <Link
                                                        to={`${process.env.REACT_APP_BASE}/manage-parameters`}
                                                        className="dropdown-item">
                                                        <i className="fe-plus-square"></i> Create
                                                    </Link>

                                                </li>
                                                <li key="callCollectionReport" className={`dropdown ${auth && auth?.currRole !== undefined && (auth?.currRole.toLowerCase() === 'admin' || auth?.currRole.toLowerCase() === 'cch') ? "" : "d-none"}`}>
                                                    <span className="dropdown-item dropdown-toggle arrow-none" id="Record-Extractor" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="fe-plus-circle mr-1"></i>
                                                        Call Collection Report
                                                        <div className="arrow-down"></div>
                                                    </span>
                                                    <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                        <li>
                                                            <Link to={{ pathname: `${process.env.REACT_APP_BASE}/create-Record-Extractor` }} className="dropdown-item">
                                                                <i className="fe-plus-circle mr-1" />Upload
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </li>
                                                <li>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div className="pull-right">
                                    <form className="form-inline" onSubmit={handleCustomerQuickSearch}>
                                        <div className="form-group">
                                            <div className="input-group input-group-sm">
                                                <input type="text" className="form-control border-0"
                                                    value={customerQuickSearchInput}
                                                    onChange={(e) => {
                                                        setCustomerQuickSearchInput(e.target.value)
                                                    }}
                                                    placeholder="Service/Account No."
                                                    maxLength={15}
                                                />
                                                <br></br>
                                                <p className="error-msg">{(errorMsg !== "") ? errorMsg : ""}</p>
                                                <div className="input-group-append">
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={handleCustomerQuickSearch}
                                                            type="submit">
                                                            <i className="fe-search" />
                                                        </button>
                                                        <button
                                                            type='button'
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => { history.push(`${process.env.REACT_APP_BASE}/customer-advance-search`, {}) }}
                                                            data-toggle="tooltip"
                                                            data-placement="bottom"
                                                            title="Advanced Search">
                                                            <i className="fe-pocket" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </nav>
                        </div>
                    </div>
                    <SearchModal
                        data={{
                            isOpen: isComplaintModalOpen,
                            searchInput: complaintSearchInput,
                            tableRowData: complaintSearchData,
                            tableHeaderColumns: CustomerSearchColumns,
                            tableHiddenColumns: ComplaintCustomerSearchHiddenColumns,
                            currentPage,
                            perPage,
                            totalCount,
                            isTableFirstRender,
                            filters,
                            hasExternalSearch
                        }}
                        modalStateHandlers={{
                            setIsOpen: setIsComplaintModalOpen,
                            setSearchInput: setComplaintSearchInput,
                            setSearchData: setComplaintSearchData,
                            handleSearch: handleOnCustomerSearch
                        }}
                        tableStateHandlers={{
                            handleCellLinkClick: handleCellLinkClick,
                            handleCellRender: handleCellRender,
                            handlePageSelect: handlePageSelect,
                            handleItemPerPage: setPerPage,
                            handleCurrentPage: setCurrentPage,
                            handleFilters: setFilters
                        }}
                    />
                </div>
            ) : (
                ""
            )
            }
        </div >
    );
};

export default MainMenu;
