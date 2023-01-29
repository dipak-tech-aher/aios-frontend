import React, { useCallback, useEffect, useRef, useState, useContext } from "react";
import { unstable_batchedUpdates } from 'react-dom'
import moment from 'moment';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import { AppContext } from "../AppContext";
import { da } from "date-fns/locale";
import { date } from "yup";


const Filter = (props) => {

    let { auth, setAuth } = useContext(AppContext);
    const refresh = props.refresh;
    const setSelfDept = props.handlers.setSelfDept;
    const setRefresh = props.setRefresh;
    const selfDept = props.data.selfDept;
    const dateRange = props.data.dateRange;
    const setDateRange = props.handlers.setDateRange;
    const setTodoPageCount = props.handlers.setTodoPageCount;
    const setAutoRefresh = props.handlers.setAutoRefresh;
    const autoRefresh = props.data.autoRefresh;
    const setTimer = props.handlers.setTimer;
    const timer = props.data.timer
    const handleAuthChange = props.handlers.handleAuthChange
    // const [autoRefresh, setAutoRefresh] = useState(false);
    // const [timer, setTimer] = useState(5);

    const autoRefreshIntervalRef = useRef();

    const manualRefresh = () => {
        unstable_batchedUpdates(() => {
            setRefresh(!refresh);
            setTodoPageCount(0);
        })
    }

    const handleDateRangeChange = (event, picker) => {
        let startDate = moment(picker.startDate).format('DD-MM-YYYY');
        let endDate = moment(picker.endDate).format('DD-MM-YYYY');
        unstable_batchedUpdates(() => {
            setDateRange({ startDate, endDate });
            setRefresh(!refresh);
            setTodoPageCount(0);
        })
        let dashboardData = {
            selfDept,
            timer,
            autoRefresh,
            startDate,
            endDate,
            refresh
        }
        handleAuthChange(dashboardData)
    }

    const setAutoRefreshInterval = useCallback(() => {
        autoRefreshIntervalRef.current = setInterval(() => {
            unstable_batchedUpdates(() => {
                setRefresh(!refresh);
                setTodoPageCount(0);
            })
        }, `${timer * 60000}`)
    }, [timer, refresh])

    useEffect(() => {
        if (autoRefresh)
            setAutoRefreshInterval();
        return () => clearInterval(autoRefreshIntervalRef.current)
    }, [setAutoRefreshInterval, autoRefresh]);

    const handleSelfDeptChange = (value) => {
        unstable_batchedUpdates(() => {
            setSelfDept(value);
            setRefresh(!refresh);
            setTodoPageCount(0);
        })
        let dashboardData = {
            selfDept: value,
            timer: timer,
            autoRefresh: autoRefresh,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            refresh: refresh
        }
        handleAuthChange(dashboardData)
    }

    const handleAutoRefreshChange = (e) => {
        setAutoRefresh(!autoRefresh);
        //setRefresh(!refresh);
        let dashboardData = {
            selfDept,
            timer,
            autoRefresh: !autoRefresh,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            refresh: refresh
        }
        handleAuthChange(dashboardData)
    }

    const handleTimerChange = (e) => {
        setTimer(Number(e.target.value));
        //setRefresh(!refresh);
        let dashboardData = {
            selfDept,
            timer: Number(e.target.value),
            autoRefresh,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            refresh: refresh
        }
        handleAuthChange(dashboardData)
    }

    return (
        <div className="row">
            <div className="col-12">
                <div className="page-title-box">
                    <div className="page-title-left pt-1 depart-sec">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={`btn btn-secondary ${selfDept === 'self' ? 'active' : ""}`}>
                                <input type="radio" name="options" id="option1" onClick={(e) => { handleSelfDeptChange('self'); }} checked={selfDept === 'self' ? true : false} /> Self
                            </label>
                            <label className={`btn btn-secondary ${selfDept === 'dept' ? 'active' : ""}`}>
                                <input type="radio" name="options" id="option3" autoComplete="off" onClick={(e) => { handleSelfDeptChange('dept'); }} checked={selfDept === 'dept' ? true : false} /> Department
                            </label>
                        </div>
                        <select id="dept-select" style={{ display: "none" }} multiple="multiple">
                            <option value="CEM">CEM</option>
                            <option value="Call Center">Call Center</option>
                        </select>
                    </div>
                    <div className="page-title-right ">
                        <div className="form-inline">
                            <span className="ml-1" >Auto Refresh</span>
                            <div className="switchToggle ml-1">
                                <input type="checkbox" id="autoRefresh" checked={autoRefresh} onChange={handleAutoRefreshChange} />
                                <label htmlFor="autoRefresh">Toggle</label>
                            </div>
                            <button className="ladda-button  btn btn-secondary btn-xs ml-1" dir="ltr" data-style="slide-left" onClick={manualRefresh}><span className="ladda-label"><i className="mdi mdi-rotate-right md-18"></i>
                            </span><span className="ladda-spinner"></span>
                            </button>
                            <select className="custom-select custom-select-sm ml-1" value={timer} onChange={handleTimerChange}>
                                <option value="5">5 Min</option>
                                <option value="15">15 Min</option>
                                <option value="30">30 Min</option>
                            </select>
                            <DateRangePicker
                                initialSettings={{
                                    startDate: dateRange.startDate, endDate: dateRange.endDate,
                                    linkedCalendars: true, showCustomRangeLabel: true,
                                    showDropdowns: true, alwaysShowCalendars: true,
                                    locale: { format: "DD/MM/YYYY" },
                                    maxDate: moment(),
                                    opens: 'left',
                                    ranges: {
                                        'Today': [moment(), moment()],
                                        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                        'This Month': [moment().startOf('month'), moment().endOf('month')],
                                        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                                        'This Year': [moment().startOf('year'), moment().format('DD-MM-YYYY')]
                                    }
                                }}
                                onApply={handleDateRangeChange}
                            >
                                <input className='form-control border-0 ml-1 pl-3 cursor-pointer' />
                            </DateRangePicker>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Filter;