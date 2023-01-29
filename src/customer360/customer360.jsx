import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import {
    Link, DirectLink, Element, Events,
    animateScroll as scroll, scrollSpy, scroller
} from 'react-scroll'
import { toast } from "react-toastify";
import { string, date, object } from "yup";
import Modal from 'react-modal'
import GetBestOffer from './bestOffers';
//import * as yup from "yup";

import { get, slowGet, post } from "../util/restUtil";
import { properties } from "../properties";
import { showSpinner, hideSpinner } from "../common/spinner";
import CustomerDetailsPreview from './customerDetailsView'
import BusinessCustomerDetailsPreview from '../customer/businessCustomerDetailsPreview'
import ServiceCard from './serviceCard'
import AccountDetailsView from './accountDetailsView'
import ServiceFullView from './serviceFullView'
import ServiceRequestList from './serviceRquestList'
import ComplaintList from './complaintList'
import NewCustomerBkp from '../customer/newCustomerBkp';

import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import InquiryList from './inquiryList';

let Limiter = require('async-limiter');
const { TabPane } = Tabs;
let accessNumber = null

function Customer360(props) {
    const accountNo = sessionStorage.getItem("accountNo") ? Number(sessionStorage.getItem("accountNo")) : null
    //const accountNo = 20179013
    let limiter = new Limiter({ concurrency: 1 });
    let serviceCardRef = useRef(null)
    const refVoid = useRef(null)
    let serviceRef = useRef(null)
    let accountRef = useRef(null)

    const { t } = useTranslation();
    const [refreshPage,setRefreshPage] = useState(true)
    const [searchInput, setSearchInput] = useState({})
    const [activeService, setActiveService] = useState()
    const [customerDetails, setCustomerDetails] = useState({})
    const [accountIdList, setAccountIdList] = useState({})
    const [selectedAccount, setSelectedAccount] = useState({})
    const [accountDetails, setAccountDetails] = useState({})
    const [accountRealtimeDetails, setAccountRealtimeDetails] = useState({})

    const [serviceIdsList, setServiceIdsList] = useState([])

    const [servicesList, setServicesList] = useState([])
    const [servicesSummary, setServicesSummary] = useState([])
    const [serviceModal, setServiceModal] = useState({ state: false })
    const [selectedService, setSelectedService] = useState({ idx: -1 })

    const [leftNavCounts, setLeftNavCounts] = useState({})
    const [leftNavCountsComplaint, setLeftNavCountsComplaint] = useState({})
    const [leftNavCountsInquiry, setLeftNavCountsInquiry] = useState({})
    const [newAccountAddded, setNewAccountAdded] = useState({ isAccountAdded: false })
    const [newServiceAddded, setNewServiceAdded] = useState({ isServicesAdded: false })

    const [refreshServiceList, setRefreshServiceList] = useState(null)

    const [refreshServiceRequest, setRefreshServiceRequest] = useState(true)
    const [refreshComplaint, setRefreshComplaint] = useState(true)
    const [refreshInquiry, setRefreshInquiry] = useState(true)
    const [serviceStatus, setServiceStatus] = useState("")
    const [buttonDisable, setButtonDisable] = useState(true)
    //modal handled 
    const [openAccModal, setAccOpenModal] = useState(false)
    const [openSerModal, setServiceOpenModal] = useState(false)
    const [openCompModal, setComplaintOpenModal] = useState(false)
    const [openInqModal, setInquiryOpenModal] = useState(false)
    const [openBillHistoryModal, setOpenBillHistoryModal] = useState(false)

    const [connectionStatusLookup, setConnectionStatusLookup] = useState([{}])
    const [kioskRefNo, setKioskRefeNo] = useState(null)
    let customerId = ""
    let accountId = ""
    let serviceId = ""
    const [service, setService] = useState(sessionStorage.getItem("service") === "true" ? true : false)
    const [account, setAccount] = useState(sessionStorage.getItem("account") === "true" ? true : false)
    //let service = sessionStorage.getItem("service") === "true" ? true : false
    //let account = sessionStorage.getItem("account") === "true" ? true : false

    const onClickScrollTo = () => {
        showSpinner()
        setTimeout(() => {

            if (Number(accountNo) === Number(selectedAccount.accountNo) && accountNo !== null && accountNo !== undefined && accountNo !== '') {
                if (accountRef && accountRef !== null && account === true) {
                    accountRef.current.scrollIntoView({ top: serviceCardRef.current.offsetTop, behavior: 'smooth', block: "start" })
                }
                if (searchInput.serviceId !== null && activeService !== null && activeService !== undefined && serviceCardRef !== null && serviceCardRef !== undefined && serviceCardRef !== '') {
                    if (searchInput.serviceId !== null && Number(searchInput.serviceId) === Number(activeService)) {
                        if (serviceCardRef && serviceCardRef !== null && service === true) {
                            serviceCardRef.current.scrollIntoView({ top: serviceCardRef.current.offsetTop, bottom: 10, behavior: 'smooth', block: "start" })
                            serviceRef.current.scrollIntoView({ top: serviceRef.current.offsetTop, behavior: 'smooth', block: "start" })
                        }

                    }
                }
            }
            else {
                setService(false)
                setAccount(false)
            }
            hideSpinner();
        }, 5000)
    }

    useEffect(() => {
        accessNumber = sessionStorage.getItem("accessNbr") ? Number(sessionStorage.getItem("accessNbr")) : null
        if (props.location.state !== undefined && props.location.state.data !== undefined) {

            customerId = props.location.state.data.customerId
            accountId = props.location.state.data.accountId
            serviceId = props.location.state.data.serviceId
            if (props.location.state.data.sourceName === 'fromKiosk') {
                customerId = sessionStorage.getItem("customerId") ? Number(sessionStorage.getItem("customerId")) : null
                accountId = sessionStorage.getItem("accountId") ? Number(sessionStorage.getItem("accountId")) : null
                serviceId = sessionStorage.getItem("serviceId") ? Number(sessionStorage.getItem("serviceId")) : null
                accessNumber = props.location.state.data.apiData.accessNumber
            }
            setKioskRefeNo(props.location.state.data.referenceNo)
        }
        else {
            customerId = sessionStorage.getItem("customerId") ? Number(sessionStorage.getItem("customerId")) : null
            accountId = sessionStorage.getItem("accountId") ? Number(sessionStorage.getItem("accountId")) : null
            serviceId = sessionStorage.getItem("serviceId") ? Number(sessionStorage.getItem("serviceId")) : null

        }

        setSearchInput({
            customerId: customerId,
            accountNo: accountId,
            serviceId: serviceId
        })
        // if (serviceId !== null || serviceId !== undefined || serviceId !== '') {
        //     console.log('setActiveService1', serviceId)
        //     setActiveService(serviceId)
        // }

        if (customerId && customerId !== '') {
            showSpinner();
            get(properties.CUSTOMER360_API + '/' + customerId)
                .then((resp) => {
                    if (resp && resp.data) {
                        const customerData = {}
                        customerData.customerId = resp.data.customerId
                        customerData.crmCustomerNo = (resp.data.crmCustomerNo) ? resp.data.crmCustomerNo : ''
                        if (resp.data.customerType === 'RESIDENTIAL') {
                            customerData.title = resp.data.title
                            customerData.foreName = resp.data.foreName
                            customerData.surName = resp.data.surName
                        }
                        if (resp.data.customerType === 'BUSINESS') {
                            customerData.companyName = resp.data.companyName
                        }
                        customerData.customerType = resp.data.customerType
                        customerData.category = resp.data.category
                        customerData.categoryDesc = resp.data.categoryDesc
                        customerData.class = resp.data.class
                        customerData.classDesc = resp.data.classDesc
                        customerData.email = resp.data.email
                        customerData.contactType = resp.data.contactType
                        customerData.contactTypeDesc = resp.data.contactTypeDesc
                        customerData.contactNbr = resp.data.contactNbr
                        customerData.address = []
                        customerData.address.push({})
                        customerData.address[0].flatHouseUnitNo = resp.data.address[0].flatHouseUnitNo
                        customerData.address[0].block = resp.data.address[0].block
                        customerData.address[0].building = resp.data.address[0].building
                        customerData.address[0].street = resp.data.address[0].street
                        customerData.address[0].road = resp.data.address[0].road
                        customerData.address[0].district = resp.data.address[0].district
                        customerData.address[0].subDistrict = resp.data.address[0].subDistrict
                        customerData.address[0].village = resp.data.address[0].village
                        customerData.address[0].cityTown = resp.data.address[0].cityTown
                        customerData.address[0].country = resp.data.address[0].country
                        customerData.address[0].postCode = resp.data.address[0].postCode
                        customerData.address[0].state = resp.data.address[0].state
                        setCustomerDetails(customerData)
                    } else {
                        toast.error("Failed to fetch Customer Details - " + resp.status);
                    }
                }).finally(hideSpinner);

            showSpinner();

            get(properties.ACCOUNTS_LIST_API + '/' + customerId)
                .then((resp) => {
                    if (resp && resp.data) {
                        let acctData = []
                        let selIdx = 0
                        let loopCount = 0
                        for (let r of resp.data.account) {
                            if (String(r.accountId) === String(accountId)) {
                                selIdx = loopCount
                            }
                            acctData.push({
                                customerId: customerId,
                                accountId: r.accountId,
                                accountNo: r.accountNo
                            })
                            loopCount++
                        }
                        setAccountIdList(acctData)
                        if (accountNo !== null && isNaN(accountNo) !== true && accountId !== null && accountNo !== undefined) {
                            setSelectedAccount({
                                customerId: customerId,
                                accountId: accountId,
                                accountNo: accountNo
                            })
                        }
                        else {
                            setSelectedAccount({
                                customerId: acctData[selIdx].customerId,
                                accountId: acctData[selIdx].accountId,
                                accountNo: acctData[selIdx].accountNo
                            })
                        }
                    } else {
                        toast.error("Failed to fetch account ids data - " + resp.status);
                    }
                }).finally(hideSpinner);

            showSpinner();
            post(properties.BUSINESS_ENTITY_API, ['CERILLION_STATUS'])
                .then((resp) => {
                    if (resp.data) {
                        setConnectionStatusLookup(resp.data['CERILLION_STATUS'])
                    }
                }).finally(hideSpinner);

            // showSpinner();
            // get(properties.SERVICE_REQUEST_LIST_BY_CUSTOMER + '/' + customerId
            //     + '?' + 'account-id=' + accountId + '&service-id=' + serviceId + '&status=OPEN')
            //     .then((resp) => {
            //         if (resp && resp.data) {
            //             for (let sr of resp.data) {
            //                 if (sr.woType === 'BAR') {

            //                 }
            //         }
            //         } else {
            //             toast.error("Failed to fetch Service Requests - " + resp.status);
            //         }
            //     }).finally(hideSpinner);

        } else {
            toast.error("Invalid data - customer id is not available");
        }

    }, [newAccountAddded, props.location.state,refreshPage]);

    useEffect(() => {
        if (newAccountAddded.isAccountAdded) {
            setAccOpenModal(false)
        }

        if (selectedAccount && selectedAccount.customerId && selectedAccount.accountId && selectedAccount.customerId !== '' && selectedAccount.accountId !== '') {
            showSpinner();
            get(properties.ACCOUNT_DETAILS_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId)
                .then((resp) => {
                    if (resp && resp.data) {

                        setAccountDetails(resp.data)
                        const serviceIds = []
                        // for(let s of resp.data.serviceIds) {
                        //     serviceIds.push({serviceId: s.connectionId, fetch: false})
                        // }
                        const svcIdsList = []
                        for (let s of resp.data.serviceIds) {
                            if (searchInput && searchInput.serviceId && (Number(searchInput.serviceId) === s.serviceId)) {
                                svcIdsList.splice(0, 0, s)
                            } else {
                                svcIdsList.push(s)
                            }
                        }
                        showSpinner()
                        get(properties.SERVICES_LIST_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId)
                            .then((resp) => {
                                if (resp && resp.data) {
                                    if (resp.data.length > 0) {
                                        const svcList = []
                                        for (let s of resp.data) {
                                            if (searchInput && searchInput.serviceId && (Number(searchInput.serviceId) === s.serviceId)) {
                                                svcList.splice(0, 0, s)
                                            } else {
                                                svcList.push(s)
                                            }
                                        }
                                        setServiceIdsList(svcIdsList)
                                        setServicesList(svcList)
                                        if (accountNo !== selectedAccount.accountNo) {
                                            // service = false
                                            // account = false 
                                            setAccount(false)
                                            setService(false)
                                            setActiveService(svcList[0].serviceId)
                                        }

                                    }
                                } else {
                                    toast.error("Failed to fetch account ids data - " + resp.status);
                                }
                            })
                            .finally(hideSpinner)

                    } else {
                        toast.error("Failed to fetch account ids data - " + resp.status);
                    }
                }).finally(() => {
                    hideSpinner()
                });


        }
    }, [selectedAccount,refreshPage]);

    useEffect(() => {
        const sdf = async () => {
            if (serviceIdsList && serviceIdsList.length > 0) {

                setActiveService(serviceIdsList[0].serviceId)
                await fetchServiceDetails(serviceIdsList[0].serviceId, undefined);
            }
        }
        sdf();
    }, [serviceIdsList,refreshPage]);

    useEffect(() => {
        const sdf = async () => {
            if (refreshServiceList !== undefined && refreshServiceList !== null) {
                showSpinner();
                get(properties.SERVICES_LIST_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId + '&service-id=' + refreshServiceList)
                    .then((resp) => {
                        if (resp && resp.data) {
                            if (resp.data.length === 1) {
                                fetchServiceDetails(refreshServiceList, resp.data[0]);
                                setRefreshServiceList(null)
                                // setServicesList((prevState) => {
                                //     const list = prevState.map((e) => {
                                //         if (e.serviceId === refreshServiceList) {
                                //             found = true
                                //             return resp.data[0]
                                //         } else {
                                //             return e
                                //         }
                                //     })
                                //     return list
                                // })
                            }
                        } else {
                            toast.error("Failed to fetch account ids data - " + resp.status);
                        }
                    }).finally(hideSpinner)


            }
        }
        sdf();
    }, [refreshServiceList,refreshPage]);

    useEffect(() => {
        if (Number(accountNo) === Number(selectedAccount.accountNo)) {
            onClickScrollTo()
        }
    }, [servicesList, serviceCardRef])

    const handleLoadBalances = async (serviceId) => {

        if (serviceId !== undefined && serviceId !== null) {
            await fetchServiceDetails(serviceId, undefined);
        }
    }

    // useEffect(() => {
    //     if (newServiceAddded.isServicesAdded) {
    //         setServiceModal(false)
    //     }
    //     if (selectedAccount && selectedAccount.customerId && selectedAccount.accountId && selectedAccount.customerId !== '' && selectedAccount.accountId !== '') {

    //     }
    // }, [newServiceAddded, refreshServiceList]);


    const fetchServiceDetails = async (serviceId, updatedPortalData) => {
        const resp = await slowGet(properties.SERVICE_REALTIME_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId + '&service-id=' + serviceId)

        if (resp && resp.data) {
            updateAccountRealtimeDetails(resp)
            let found = false
            setServicesList((prevState) => {
                const list = prevState.map((e) => {
                    if (e.serviceId === serviceId) {
                        found = true
                        if (updatedPortalData) {
                            updatedPortalData.realtime = resp.data
                            updatedPortalData.realtimeLoaded = true
                            return updatedPortalData
                        } else {
                            e.realtime = resp.data
                            e.realtimeLoaded = true
                            return e
                        }
                    } else {
                        return e
                    }
                })
                return list
            })
        } else {
            toast.error("Failed to fetch account ids data - " + resp.status);
        }

    }

    const updateAccountRealtimeDetails = (resp) => {
        if (accountRealtimeDetails.filled === undefined || !accountRealtimeDetails.filled) {
            if (resp.data) {
                let firstService = resp.data
                let realtimeData = {}
                if (firstService.accountBalance !== undefined) {
                    realtimeData.accountBalance = firstService.accountBalance
                }
                if (firstService.lastPayment !== undefined) {
                    realtimeData.lastPayment = firstService.lastPayment
                }
                if (firstService.lastPaymentDate) {
                    realtimeData.lastPaymentDate = firstService.lastPaymentDate
                }
                if (firstService.accountCreationDate) {
                    realtimeData.accountCreationDate = firstService.accountCreationDate
                }
                if (firstService.billCycle) {
                    realtimeData.billCycle = firstService.billCycle
                }
                if (firstService.billingDetails) {
                    realtimeData.billingDetails = firstService.billingDetails
                }

                realtimeData.serviceType = firstService.serviceType
                realtimeData.filled = true
                setAccountRealtimeDetails(realtimeData)
            }
        }
    }

    const handleAccountSelect = (evnt, e) => {
        setSelectedAccount({
            customerId: e.customerId,
            accountId: e.accountId,
            accountNo: e.accountNo
        })
    }

    const handleServicePopupOpen = (evnt, idx) => {
        setServiceModal({ state: true })
        setSelectedService({ idx: idx })
    }

    const handleServicePopupClose = () => {
        setServiceModal({ state: false })
    }

    useEffect(() => {
        if (serviceStatus !== "PENDING") {
            setButtonDisable(false)
        }
        else {
            setButtonDisable(true)
        }
    }, [activeService])

    return (
        <div className="row mt-1">
            <div className="col-md-12">
                <h1 className="title">Customer 360</h1>
                <div className="card-box">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '0px' }}>
                        <div className="testFlex">
                            <div className="col-md-2 sticky">
                                <div className="">
                                    <nav className="navbar navbar-default navbar-fixed-top">
                                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                            <ul className="nav navbar-nav">
                                                <li>
                                                    <Link activeClass="active" className="test1" to="customerSection" spy={true} offset={-195} smooth={true} duration={100} >Customer</Link>
                                                </li>
                                                <li>
                                                    <Link activeClass="active" className="test2" to="accountSection" spy={true} offset={-120} smooth={true} duration={100}>Accounts</Link>
                                                </li>
                                                <li>
                                                    <Link activeClass="active" className="test3" to="serviceSection" spy={true} offset={-120} smooth={true} duration={100} >Services</Link>
                                                </li>
                                                <li>
                                                    <Link activeClass="active" className="test4" to="serviceRequestSection" spy={true} offset={-120} smooth={true} duration={100} >Service Requests
                                                        <span className="badge badge-primary badge-pill float-right">{(leftNavCounts && leftNavCounts.srCount !== undefined && leftNavCounts.srCount !== 0) ? leftNavCounts.srCount : ''}</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link activeClass="active" className="test5" to="complaintSection" spy={true} offset={-120} smooth={true} duration={100} >Complaints
                                                        <span className="badge badge-primary badge-pill float-right">{(leftNavCountsComplaint && leftNavCountsComplaint.cmpCount !== undefined && leftNavCountsComplaint.cmpCount !== 0) ? leftNavCountsComplaint.cmpCount : ''}</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link activeClass="active" className="test6" to="inquirySection" spy={true} offset={-120} smooth={true} duration={100} >Inquiry
                                                        <span className="badge badge-primary badge-pill float-right">{(leftNavCountsInquiry && leftNavCountsInquiry.inqCount !== undefined && leftNavCountsInquiry.inqCount !== 0) ? leftNavCountsInquiry.inqCount : ''}</span>
                                                    </Link>
                                                </li>
                                            </ul>

                                            <GetBestOffer
                                                data={{
                                                    selectedAccount: selectedAccount,
                                                    servicesList: servicesList,
                                                    activeService: activeService
                                                }}
                                            />
                                        </div>

                                    </nav>
                                </div>
                            </div>
                            <div className="new-customer cust360 col-md-10">
                                <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div">
                                    <Element name="customerSection" className="edit-customer" >
                                        <section className="triangle col-md-12">
                                            <div className="row col-md-12">
                                                <div className="col-md-10">
                                                    {
                                                        (customerDetails && customerDetails.customerId) ?
                                                            (customerDetails.customerType === 'RESIDENTIAL') ?
                                                                <h4 className="pl-1">{customerDetails.title + " " + customerDetails.surName + " " + customerDetails.foreName} - Customer Number {(customerDetails.crmCustomerNo && customerDetails.crmCustomerNo != '') ? customerDetails.crmCustomerNo : customerDetails.customerId}</h4>
                                                                :
                                                                <h4 className="pl-1">{customerDetails.companyName} - Customer Number {(customerDetails.crmCustomerNo && customerDetails.crmCustomerNo != '') ? customerDetails.crmCustomerNo : customerDetails.customerId}</h4>
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            </div>
                                        </section>
                                        <div className="">
                                            <div className="form-row ml-0 mr-0">
                                                <div className="form-row col-md-12 p-0 ml-0 mr-0">
                                                    <div className="col-md-12 card-box m-0 p-0">
                                                        {
                                                            (customerDetails.customerType === 'RESIDENTIAL') ?
                                                                <CustomerDetailsPreview
                                                                    custType={customerDetails.customerType}
                                                                    data={{
                                                                        personalDetailsData: customerDetails,
                                                                        customerAddress: customerDetails.address[0]
                                                                    }}
                                                                />
                                                                :
                                                                <></>
                                                        }
                                                        {
                                                            (customerDetails.customerType === 'BUSINESS') ?
                                                                <BusinessCustomerDetailsPreview
                                                                    custType={customerDetails.customerType}
                                                                    data={{
                                                                        businessDetailsData: customerDetails,
                                                                        customerAddress: customerDetails.address[0],
                                                                        form: "customer360"
                                                                    }} />
                                                                :
                                                                <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Element>

                                    <Element name="accountSection" className="edit-customer">
                                        <section className="triangle col-md-12" ref={accountRef}>
                                            <div className="row col-md-12">
                                                <div className="col-md-8">
                                                    <h5 className="pl-1">Accounts</h5>
                                                </div>
                                                <div className="col-md-4 cus-act">
                                                    <span className="act-btn float-right">
                                                        <button type="button" /*onClick={() => setAccOpenModal(true)}*/ className="btn btn-labeled btn-primary btn-sm mt-1 disabled" data-toggle="modal" data-target="#myModal">
                                                            <span className="btn-label"><i className="fa fa-plus"></i></span>Add Account
                                                        </button>
                                                    </span>
                                                    <div>
                                                        <Modal isOpen={openAccModal}>
                                                            <NewCustomerBkp
                                                                customerDetails={customerDetails}
                                                                setNewAccountAdded={setNewAccountAdded}
                                                                customerType={customerDetails.customerType}
                                                                sourceName={'new_account'}

                                                            />
                                                            {/* <NewCustomerAccount customerType={customerDetails.customerType} /> */}
                                                            <button className="close-btn" onClick={() => setAccOpenModal(false)} >&times;</button>
                                                        </Modal>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="">
                                            {
                                                (accountIdList && accountIdList.length > 0) ?
                                                    <div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <Tabs defaultActiveKey={accountNo} type="card">
                                                                    {
                                                                        accountIdList.map((e) => {
                                                                            return (
                                                                                <TabPane
                                                                                    tab={
                                                                                        <div className="account-sec">
                                                                                            <div className="nav nav-tabs">
                                                                                                <div id={e.accountId} key={e.accountId} className={"nav-item pl-0 " + ((e.accountId === selectedAccount.accountId) ? "active" : "")}>
                                                                                                    <button key={e.accountId} className={"nav-link font-17 bolder " + ((e.accountId === selectedAccount.accountId) ? "active" : "")} role="tab"
                                                                                                        onClick={(evnt) => handleAccountSelect(evnt, e)}
                                                                                                    >
                                                                                                        {/* onClick={(evnt) => handleAccountSelect(evnt, e)} */}
                                                                                                        <div className="tabs" style={(e.accountId === selectedAccount.accountId) ? { color: "orange" } : {}}>Account&nbsp;{(e.status === 'PENDING') ? 'Pending' : (e.accountNo) ? e.accountNo : e.accountId + ' (Id)'}</div>
                                                                                                    </button>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    }
                                                                                    key={Number(e.accountNo)}
                                                                                >
                                                                                    <div className="bg-light  p-2">
                                                                                        <div className="form-row bg-light ml-0 mr-0">
                                                                                            <div className="form-row border col-md-12 p-0 ml-0 mr-0">
                                                                                                <div className="col-md-12 card-box m-0 p-0">
                                                                                                    {
                                                                                                        (accountDetails && accountDetails.accountId && accountDetails.accountId !== '') ?
                                                                                                            <AccountDetailsView
                                                                                                                data={{
                                                                                                                    customerType: customerDetails.customerType,
                                                                                                                    accountData: accountDetails,
                                                                                                                    accountRealtimeDetails: accountRealtimeDetails,
                                                                                                                    newAccountAddded: newAccountAddded,
                                                                                                                    setNewAccountAdded: setNewAccountAdded,
                                                                                                                    openBillHistoryModal,
                                                                                                                    setOpenBillHistoryModal
                                                                                                                }}
                                                                                                            />
                                                                                                            :
                                                                                                            <></>
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </TabPane>
                                                                            )
                                                                        })
                                                                    }
                                                                </Tabs>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                        </div>
                                        {/* <div className="">
                                            {
                                                (accountIdList && accountIdList.length > 0) ?
                                                    <div className="account-sec  col-md-12">
                                                        <div className="row pt-2 border tab-bg">
                                                            <div className="col-md-12 p-0 tab-scroll">
                                                                <ul className="nav nav-tabs  tab-scroll2" role="tablist">
                                                                    {
                                                                        accountIdList.map((e) =>
                                                                            <li id={e.accountId} key={e.accountId} className={"nav-item pl-0 " + ((e.accountId === selectedAccount.accountId) ? "active" : "")}>
                                                                                <button key={e.accountId} className={"nav-link font-17 bolder " + ((e.accountId === selectedAccount.accountId) ? "active" : "")} role="tab"
                                                                                    onClick={(evnt) => handleAccountSelect(evnt, e)}>
                                                                                    Account&nbsp;&nbsp;{(e.status === 'PENDING') ? 'Pending' : (e.accountNo) ? e.accountNo : 'TEST'}
                                                                                </button>
                                                                            </li>
                                                                        )
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    :
                                                    <></>
                                            }
                                            <div className="bg-light  p-2">
                                                <div className="form-row bg-light ml-0 mr-0">
                                                    <div className="form-row border col-md-12 p-0 ml-0 mr-0">
                                                        <div className="col-md-12 card-box m-0 p-0">
                                                            {
                                                                (accountDetails && accountDetails.accountId && accountDetails.accountId !== '') ?
                                                                    <AccountDetailsView
                                                                        data={{
                                                                            customerType: customerDetails.customerType,
                                                                            accountData: accountDetails,
                                                                            accountRealtimeDetails: accountRealtimeDetails
                                                                        }}
                                                                    />
                                                                    :
                                                                    <></>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                    </Element>

                                    <Element name="serviceSection" className="edit-customer">
                                        <section className="triangle col-md-12" ref={serviceRef}>
                                            <div className="row col-md-12">
                                                <div className="col-md-8">
                                                    <h5 className="pl-1">Services</h5>
                                                </div>
                                                <div className="col-md-4 cus-act">
                                                    <span className="act-btn float-right">
                                                        <button type="button" /*onClick={() => setServiceOpenModal(true)}*/ className="btn btn-labeled btn-primary btn-sm mt-1 disabled" data-toggle="modal" data-target="#myModal">
                                                            <span className="btn-label"><i className="fa fa-plus"></i></span>Add Service
                                                        </button>
                                                    </span>
                                                    <div>

                                                        <Modal isOpen={openSerModal} >
                                                            {/* <NewCustomerAccount /> */}

                                                            <NewCustomerBkp
                                                                customerType={customerDetails.customerType}
                                                                customerDetails={customerDetails}
                                                                accountDetails={accountDetails}
                                                                newServiceAddded={newServiceAddded}
                                                                selectedAccount={selectedAccount}
                                                                sourceName={'new_service'}
                                                                setNewServiceAdded={setNewServiceAdded}
                                                                data={{
                                                                    customerType: customerDetails.customerType,
                                                                    customerDetails: customerDetails,
                                                                    accountDetails: accountDetails,
                                                                    newServiceAddded: newServiceAddded
                                                                }}
                                                                statusHandler={
                                                                    {
                                                                        setNewServiceAdded: setNewServiceAdded
                                                                    }
                                                                }

                                                            />
                                                            {/* <NewCustomerService customerType={customerDetails.customerType} selectedAccount={selectedAccount} /> */}
                                                            <button className="close-btn" onClick={() => setServiceOpenModal(false)} >&times;</button>
                                                        </Modal>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                            <div className="form-row ml-0 mr-0">
                                                <div className="form-row col-md-12 p-0 ml-0 mr-0">
                                                    <div className="col-md-12 m-0 p-0 ms-box2">

                                                        <div className="MS-content pt-2">
                                                            {
                                                                (servicesList && servicesList.length > 0) ?
                                                                    servicesList.map((service, idx) =>

                                                                        <ServiceCard key={service.serviceId}
                                                                            data={{
                                                                                serviceDetails: service,
                                                                                idx: idx,
                                                                                searchInput: searchInput,
                                                                                connectionStatusLookup: connectionStatusLookup,
                                                                                activeService: activeService,
                                                                                selectedAccount :selectedAccount,
                                                                                refreshPage: refreshPage,
                                                                                createSRData: {
                                                                                    selectedAccount,
                                                                                    accountName: accountDetails && `${accountDetails.foreName} ${accountDetails.surName}`,
                                                                                    accountContactNo: accountDetails.contactNbr,
                                                                                    accountEmail: accountDetails.email,
                                                                                    kioskRefId: (kioskRefNo !== null) ? kioskRefNo : null,
                                                                                }
                                                                            }}
                                                                            refProp={serviceCardRef}
                                                                            handler={{
                                                                                handleServicePopupOpen: handleServicePopupOpen,
                                                                                handleLoadBalances: handleLoadBalances,
                                                                                setActiveService: setActiveService,
                                                                                setServiceStatus: setServiceStatus,
                                                                            }}
                                                                        />

                                                                    )
                                                                    :
                                                                    <div>
                                                                        Loading Service Cards...
                                                                    </div>
                                                            }
                                                        </div>


                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Element>

                                    <Modal isOpen={serviceModal.state}>
                                        <ServiceFullView
                                            data={{
                                                customerType: customerDetails.customerType,
                                                selectedAccount: selectedAccount,
                                                serviceDetails: servicesList[selectedService.idx],
                                                customerAddress: customerDetails.hasOwnProperty('address') && customerDetails.address[0],
                                                connectionStatusLookup: connectionStatusLookup
                                            }}
                                            handler={{
                                                handleServicePopupClose: handleServicePopupClose,
                                                setServicesList: setServicesList,
                                                setRefreshServiceList: setRefreshServiceList,
                                                setRefreshServiceRequest: setRefreshServiceRequest,
                                                setRefreshPage: setRefreshPage
                                            }}
                                        />
                                    </Modal>

                                    <Element name="serviceRequestSection" className="edit-customer">
                                        <section className="triangle col-md-12">
                                            <div className="tit-his row col-md-12">
                                                <div className="col-md-3">
                                                    <h5 className="pl-1">Service Request History</h5>
                                                </div>
                                                <div className="col-md-9 mt-1  cus-act">
                                                    <span className="act-btn" style={{ float: "right" }}><button type="button" style={{ float: "right" }} className="btn btn-sm btn-outline-primary text-primary" onClick={() => { setRefreshServiceRequest(!refreshServiceRequest) }}>Refresh</button></span>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                            <div className="form-row ml-0 mr-0">
                                                <div className="form-row col-md-12 p-0 ml-0 mr-0">
                                                    <div className="col-md-12 m-0 p-0">
                                                        <ServiceRequestList
                                                            data={{
                                                                customerDetails: customerDetails,
                                                                leftNavCounts: leftNavCounts,
                                                                refreshServiceRequest: refreshServiceRequest,
                                                                selectedAccount: selectedAccount,
                                                                activeService: activeService
                                                            }}

                                                            handler={{
                                                                setLeftNavCounts: setLeftNavCounts
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Element>
                                    <Element name="complaintSection" className="edit-customer">
                                        <section className="triangle col-md-12">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h5 className="pl-1">Complaint History</h5>
                                                </div>
                                                <div className="col-auto mx-auto">
                                                    <div className="row">
                                                        <button type="button" className="btn btn-sm btn-outline-primary text-primary mr-2"
                                                            onClick={() => { setRefreshComplaint(!refreshComplaint) }}>
                                                            Refresh
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-primary text-primary"
                                                            onClick={() => {

                                                                // console.log(selectedAccount.customerId, selectedAccount.accountId, selectedAccount.accountNo, activeService)

                                                                if (!selectedAccount || !selectedAccount.customerId || !selectedAccount.accountId || !selectedAccount.accountNo || selectedAccount.accountNo === null) {
                                                                    toast.error('Cannot create complaint as Account Number is not available')
                                                                    return false
                                                                }

                                                                if (!activeService) {
                                                                    toast.error('Please select a service first to create an complaint')
                                                                    return false
                                                                }

                                                                const svcDetails = servicesList.find((s) => (s.serviceId === activeService))

                                                                // console.log(svcDetails, svcDetails.status)

                                                                if (svcDetails.status === 'PENDING') {
                                                                    toast.error('Complaint cannot be created when service is in PENDING status')
                                                                    return false
                                                                }
                                                                const accountName = accountDetails && `${accountDetails.foreName} ${accountDetails.surName}`.trim()
                                                                return props.history.push(`${process.env.REACT_APP_BASE}/create-complaint`, {
                                                                    data: {
                                                                        customerId: selectedAccount.customerId,
                                                                        accountId: selectedAccount.accountId,
                                                                        accountNo: selectedAccount.accountNo,
                                                                        accountName: accountName ? accountName : '-',
                                                                        accountContactNo: accountDetails.contactNbr,
                                                                        accountEmail: accountDetails.email,
                                                                        serviceId: svcDetails.serviceId,
                                                                        serviceType : svcDetails.prodType,
                                                                        accessNumber: svcDetails.accessNbr,//access number hard coded here.
                                                                        kioskRefId: (kioskRefNo !== null) ? kioskRefNo : null,
                                                                        type: 'Complaint'
                                                                    }
                                                                })
                                                            }
                                                            }>
                                                            Create Complaint
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                            <div className="form-row ml-0 mr-0">
                                                <div className="form-row col-md-12 p-0 ml-0 mr-0">
                                                    <div className="col-md-12 m-0 p-0">
                                                        <ComplaintList
                                                            data={{
                                                                customerDetails: customerDetails,
                                                                leftNavCounts: leftNavCountsComplaint,
                                                                refreshComplaint: refreshComplaint,
                                                                selectedAccount: selectedAccount,
                                                                activeService: activeService
                                                            }}


                                                            handler={{
                                                                setLeftNavCounts: setLeftNavCountsComplaint
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Element>
                                    <Element name="inquirySection" className="edit-customer">
                                        <section className="triangle col-md-12">
                                            <div className="row align-items-center">
                                                <div className="col">
                                                    <h5 className="pl-1">Inquiry History</h5>
                                                </div>
                                                <div className="col-auto mx-auto">
                                                    <div className="row">
                                                        <button type="button" className="btn btn-sm btn-outline-primary text-primary mr-2"
                                                            onClick={() => { setRefreshInquiry(!refreshInquiry) }}>
                                                            Refresh
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-primary text-primary"
                                                            onClick={() => {

                                                                if (!selectedAccount || !selectedAccount.customerId || !selectedAccount.accountId || !selectedAccount.accountNo || selectedAccount.accountNo === null) {
                                                                    toast.error('Cannot create inquiry as Account Number is not available')
                                                                    return false
                                                                }

                                                                if (!activeService) {
                                                                    toast.error('Please select a service first to create an inquiry')
                                                                    return false
                                                                }

                                                                const svcDetails = servicesList.find((s) => (s.serviceId === activeService))

                                                                // console.log(svcDetails)

                                                                if (svcDetails.status === 'PENDING') {
                                                                    toast.error('Inquiry cannot be created when service is in PENDING status')
                                                                    return false
                                                                }

                                                                props.history.push(`${process.env.REACT_APP_BASE}/create-inquiry-new-customer`
                                                                    , {
                                                                        data: {
                                                                            sourceName: 'customer360',
                                                                            accessNumber: svcDetails.accessNbr,//access number hard coded here.
                                                                            kioskRefId: (kioskRefNo !== null) ? kioskRefNo : null
                                                                        }
                                                                    })
                                                            }
                                                            }>
                                                            Create Inquiry
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                        <div className="col-md-12 pl-2 pr-2 pt-2 pb-1">
                                            <div className="form-row ml-0 mr-0">
                                                <div className="form-row col-md-12 p-0 ml-0 mr-0">
                                                    <div className="col-md-12 m-0 p-0">
                                                        <InquiryList
                                                            data={{
                                                                customerDetails: customerDetails,
                                                                leftNavCounts: leftNavCountsInquiry,
                                                                refreshInquiry: refreshInquiry,
                                                                selectedAccount: selectedAccount,
                                                                activeService: activeService
                                                            }}

                                                            handler={{
                                                                setLeftNavCounts: setLeftNavCountsInquiry
                                                            }}
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Element>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Customer360;
