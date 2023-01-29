/* eslint-disable jsx-a11y/anchor-is-valid */
import moment from 'moment';
import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from "../common/spinner";
import { properties } from "../properties";
import { get, post } from "../util/restUtil";
import SalesSummary from './sales/SalesSummary';

const SalesDashboard = () => {
    const intialValue = {
        role: "",
        location: "",
        startDate: moment().startOf('month').format('YYYY-MM-DD'),
        endDate: moment().endOf('month').format('YYYY-MM-DD'),
        maxEndDate: moment().endOf('month').format('YYYY-MM-DD'),
        serviceType: "",
        orderType: "",
        user: ""
    }
    const [filter, SetFilter] = useState(intialValue)
    const [activeTab, setActiveTab] = useState('Summary of Sales')
    const [displayForm, setDisplayForm] = useState(false);
    const [salesLocation, setSalesLocation] = useState()
    const [role, setRole] = useState()
    const [submitData, setSubmitData] = useState(filter)
    const [fieldAccess, setFiledAcces] = useState(true)
    const [userLookup, setUserLookup] = useState()
    const [serviceTypeLookup, setServiceTypeLookup] = useState()
    const [orderTypeLookup, setOrderTypeLookUp] = useState()
    const [lastUpdatedDate, setLastUpdatedDate] = useState()
    const [topUser, setTopUser] = useState([{}])
    const [topLocation, setTopLocation] = useState([{}])

    useEffect(() => {
        setActiveTab('Summary of Sales')
        showSpinner()
        post(properties.BUSINESS_ENTITY_API, ['LOCATION'])
            .then((response) => {
                const { data } = response
                if (data) {
                    get(properties.ROLE_API)
                        .then((res) => {
                            if (res.data) {
                                unstable_batchedUpdates(() => {
                                    setRole(res.data)
                                    setSalesLocation(data['LOCATION'])
                                })
                            }
                        })
                }
            })
            .catch((error) => {
                hideSpinner();
            })
            .finally(() => {
                hideSpinner();
            })

    }, [])

    useEffect(() => {
        getUserAndServiceTyepe()
    }, [submitData])

    const getUserAndServiceTyepe = () => {
        const requestBody = {
            location: filter?.location,
            startDate: filter?.startDate,
            endDate: filter?.endDate,
            user: filter?.user,
            serviceType: filter?.serviceType,
            orderType: filter?.orderType

        }

        showSpinner()
        post(properties.SALES_DASHBOARDDATA_API, requestBody)
            .then((response) => {
                const { data } = response
                if (data) {
                    unstable_batchedUpdates(() => {
                        setUserLookup(data.user)
                        setLastUpdatedDate(data.lastUpdatedDate[0])
                        setServiceTypeLookup(data.serviceType)
                        setOrderTypeLookUp(data.orderType)
                        setTopUser(data.topUser)
                        setTopLocation(data.topLocation)
                    })
                }
            })
            .catch((error) => {
                hideSpinner();
            })
            .finally(() => {
                hideSpinner();
            })
    }

    const handleTabChange = (name) => {
        unstable_batchedUpdates(() => {
            setActiveTab(name)
            setSubmitData({ ...submitData, location: name === 'Summary of Sales' ? "" : name })
            setFiledAcces(name === 'Summary of Sales' ? true : false)
            SetFilter({ ...filter, location: name === 'Summary of Sales' ? "" : name })
        })
        //   sessionStorage.setItem('SalesDashboard', name || null)
    }

    const handleOnChange = (e) => {
        const { target } = e;
        if (target.id === 'startDate') {
            SetFilter({
                ...filter, maxEndDate: moment(target.value, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD'),
                [target.id]: target.value,
                endDate: moment(target.value, 'YYYY-MM-DD').endOf('month').format('YYYY-MM-DD')
            })
        }
        else {
            SetFilter({ ...filter, [target.id]: target.value })
        }
    }

    const handleSubmit = () => {
        setSubmitData(filter)
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="row pl-1">
                        <div className="col-6 text-left">
                            <div className="page-title-box">
                                <h4 className="page-title text-capitalize pl-2">{activeTab}</h4>
                            </div>
                        </div>

                        <div class="col-4">
                            <h5> <i class="far fa-clock text-primary pr-1"></i> Last Updated  {lastUpdatedDate && moment(lastUpdatedDate?.updateddate, 'YYYY-MM-DD').format('DD-MMMM-YYYY')}</h5>
                        </div>
                        <div className="col pr-4 sale-filter">
                            <div class="col-1 text-right pt-1" style={{ color: "#142cb1", float: "right" }}>
                                <i class="fas fa-filter text-primary"></i></div>
                            <h6 className="cursor-pointer " style={{ color: "#142cb1", float: "right" }} onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Filter" : "Show Filter"}

                            </h6>

                        </div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="sales-sum">
                    <div className="col-lg-12">
                        <div className="search-result-box m-t-30">
                            {displayForm && <div className="modal-body">
                                <fieldset className="scheduler-border">
                                    <div className="row pl-1">
                                        {fieldAccess && filter.role && <div className="col-md-2">
                                            <div className="form-group">
                                                <label htmlFor="source" className="">Role</label>
                                                <select className="form-control" id="role" value={filter.role} onChange={handleOnChange}>
                                                    <option value="" key="SelectChannel">Select Role</option>
                                                    {
                                                        role && role.map((e) => (
                                                            <option key={e.roleId} value={e.roleId}>{e.roleDesc}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </div>}
                                        {fieldAccess && <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="source" className="">Location</label>
                                                <select className="form-control" id="location" value={filter.location} onChange={handleOnChange}>
                                                    <option value="" key="SelectChannel">Select Location</option>
                                                    {
                                                        salesLocation && salesLocation.map((e) => (
                                                            <option key={e.code} value={e.description}>{e.description}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>}
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="user" className="">User</label>
                                                <select className="form-control" id="user" value={filter.user} onChange={handleOnChange}>
                                                    <option value="" key="SelectChannel">Select User</option>
                                                    {
                                                        userLookup && userLookup.map((e) => (
                                                            <option key={e.firstname} value={e.firstname}>{e.firstname}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="serviceType" className="">Service Type</label>
                                                <select className="form-control" id="serviceType" value={filter.serviceType} onChange={handleOnChange}>
                                                    <option value="" key="SelectChannel">Select Service Type</option>
                                                    {
                                                        serviceTypeLookup && serviceTypeLookup.map((e) => (
                                                            <option key={e.servicetype} value={e.servicetype}>{e.servicetype}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="orderType" className="">order Type</label>
                                                <select className="form-control" id="orderType" value={filter.orderType} onChange={handleOnChange}>
                                                    <option value="" key="SelectChannel">Select order Type</option>
                                                    {
                                                        orderTypeLookup && orderTypeLookup.map((e) => (
                                                            <option key={e.ordertype} value={e.ordertype}>{e.ordertype}</option>
                                                        ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="dateTo" className="control-label">Start Date</label>
                                                <input type="date" id="startDate" className="form-control"
                                                    value={filter.startDate} onChange={handleOnChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <label htmlFor="dateTo" className="control-label">End Date</label>
                                                <input type="date" id="endDate" className="form-control" max={filter.maxEndDate}
                                                    value={filter.endDate} onChange={handleOnChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-2 text-center mt-3">
                                            <button type="submit" className="btn btn-primary waves-effect waves- mr-2" onClick={handleSubmit} >Search</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>}
                            {(() => {
                                if (activeTab === "Summary of Sales") {
                                    return <SalesSummary
                                        data={{
                                            submitData,
                                            topUser,
                                            topLocation
                                        }}
                                    />
                                }
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SalesDashboard;