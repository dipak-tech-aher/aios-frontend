import moment from 'moment';
import React, { useEffect, useState, useContext } from "react";
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from "../../common/spinner";
import { properties } from "../../properties";
import { get, post } from "../../util/restUtil";
import TheMall from './theMall';
import { AppContext } from "../../AppContext";


const SalesReport = () =>{
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
    const [displayForm, setDisplayForm] = useState(false);
    const [submitData, setSubmitData] = useState(filter)
    const [topUser, setTopUser] = useState([{}])
    const [topLocation, setTopLocation] = useState([{}])
    let { auth } = useContext(AppContext)

    useEffect(() => {
        showSpinner()
        post(properties.BUSINESS_ENTITY_API, ['LOCATION'])
            .then((response) => {
                const { data } = response
                if (data) {
                   for (let e of data['LOCATION']){
                       if(e.code === auth.user.location){
                           unstable_batchedUpdates(()=>{
                            setSubmitData({
                                ...submitData,
                                location:e.description
                            })
                            SetFilter({
                                ...filter,
                                location:e.description
                            })
                           })
                           
                       }
                   }
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
            location: submitData?.location,
            startDate: submitData?.startDate,
            endDate: submitData?.endDate,
            user: submitData?.user,
            serviceType: submitData?.serviceType,
            orderType: submitData?.orderType
        }

        showSpinner()
        post(properties.SALES_DASHBOARDDATA_API, requestBody)
            .then((response) => {
                const { data } = response
                if (data) {
                    unstable_batchedUpdates(() => {
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
                        <div className="page-title-box text-center">
                            <h4 className="page-title text-capitalize">Sales Report</h4>
                        </div>
                        <div className="col pr-4">
                            {/* <h6 className='pl-1' style={{ float: "right" }} >Last Updated Date : {lastUpdatedDate && moment(lastUpdatedDate?.updateddate, 'YYYY-MM-DD').format('DD-MM-YYYY')} </h6> */}
                            <h6 className="cursor-pointer " style={{ color: "#142cb1", float: "right" }} onClick={() => { setDisplayForm(!displayForm) }}>{displayForm ? "Hide Filter" : "Show Filter"}
                            </h6>

                        </div>
                    </div>
                </div>
            </div>
            <div className="row pl-2">
                <div className="col-lg-12 row">
                    <div className="col-lg-12 pl-0 pr-0">
                        <div className="search-result-box m-t-30">
                            {displayForm && <div className="modal-body">
                                <fieldset className="scheduler-border">
                                    <div className="row">                                       
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
                            <div className='px-2'>
                                <TheMall
                                    data={{
                                        submitData,
                                        topUser,
                                        topLocation
                                    }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default SalesReport