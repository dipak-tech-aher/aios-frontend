import React, { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from '../common/spinner'
import { properties } from '../properties';
import { post } from "../util/restUtil";
import moment from 'moment'
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import WhatsAppTodayCard from './whatsAppCards/WhatsAppTodayCard';
import WhatsAppMonthCard from './whatsAppCards/WhatsAppMonthCard';
import WhatsAppComplaintCard from './whatsAppCards/WhatsAppComplaintCard';
import WhatsAppFollowUpCard from './whatsAppCards/WhatsAppFollowUpCard';
import ReactEcharts from "echarts-for-react";
import WhatsAppTable from './whatsAppCards/WhatsAppTable';

const WhatsAppDashboard = () => {

    const autoRefresh = true
    const autoRefreshIntervalRef = useRef();
    const [countRefresh,setCountRefresh] = useState(false)
    const [chatDashboardData,setChatDashboardData] = useState({
        countsByToday: {},
        countsByMonth: {},
        countsByComplaint: {},
        countsByFollowUp: {},
        graphByMonth: [],
        graphByComplaint: [],
        graphByFollowUp: [],
    })
    const [selectedDate,setSelectedDate] = useState({
        startDate: moment().format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
    })
    const [monhtlyFixedline, setMonthlyFixedline] = useState([])
    const [monhtlyPrepaid, setMonthlyPrepaid] = useState([])
    const [monhtlyPostpaid, setMonthlyPostpaid] = useState([])
    const [rangeMonthly, setRangeMonthly] = useState()

    const [complaintFixedline, setComplaintFixedline] = useState([])
    const [complaintPrepaid, setComplaintPrepaid] = useState([])
    const [complaintPostpaid, setComplaintPostpaid] = useState([])
    const [rangeComplaint, setRangeComplaint] = useState()

    const [followUpFixedline, setFollowUpFixedline] = useState([])
    const [followUpPrepaid, setFollowUpPrepaid] = useState([])
    const [followUpPostpaid, setFollowUpPostpaid] = useState([])
    const [rangeFollowUp, setRangeFollowUp] = useState()

    const [dailyFixedline, setDailyFixedline] = useState([])
    const [dailyPrepaid, setDailyPrepaid] = useState([])
    const [dailyPostpaid, setDailyPostpaid] = useState([])
    const [dailyAll, setDailyAll] = useState([])

    const [dataRange, setDataRange] = useState([])

    useEffect(() => {
        showSpinner()
        const requestBody = {
            ...selectedDate
        }
        post(`${properties.WHATSAPP}/count`, requestBody) 
        .then((response) => {
            if(response.data)
            {
            console.log('response?.data?.countsByFollowUp------>',response?.data?.countsByFollowUp)

                const data = {
                    countsByToday: {
                        total: response?.data?.countsByToday.reduce((partialSum, a) => Number(partialSum) + Number(a.count), 0),
                        fixed: response?.data?.countsByToday.find((x) => x.serviceType === 'Fixed')?.count || 0,
                        postpaid: response?.data?.countsByToday.find((x) => x.serviceType === 'Postpaid')?.count || 0,
                        prepaid: response?.data?.countsByToday.find((x) => x.serviceType === 'Prepaid')?.count || 0
                    },
                    countsByMonth: {
                        total: response?.data?.countsByMonth.reduce((partialSum, a) => Number(partialSum) + Number(a.count), 0),
                        fixed: response?.data?.countsByMonth.find((x) => x.serviceType === 'Fixed')?.count || 0,
                        postpaid: response?.data?.countsByMonth.find((x) => x.serviceType === 'Postpaid')?.count || 0,
                        prepaid: response?.data?.countsByMonth.find((x) => x.serviceType === 'Prepaid')?.count || 0
                    },
                    countsByComplaint: {
                        total: response?.data?.countsByComplaint.reduce((partialSum, a) => Number(partialSum) + Number(a.count), 0),
                        fixed: response?.data?.countsByComplaint.find((x) => x.serviceType === 'Fixed')?.count || 0,
                        postpaid: response?.data?.countsByComplaint.find((x) => x.serviceType === 'Postpaid')?.count || 0,
                        prepaid: response?.data?.countsByComplaint.find((x) => x.serviceType === 'Prepaid')?.count || 0
                    },
                    countsByFollowUp: {
                        total: response?.data?.countsByFollowUp.reduce((partialSum, a) => Number(partialSum) + Number(a.count), 0),
                        fixed: response?.data?.countsByFollowUp.find((x) => x.serviceType === 'Fixed')?.count || 0,
                        postpaid: response?.data?.countsByFollowUp.find((x) => x.serviceType === 'Postpaid')?.count || 0,
                        prepaid: response?.data?.countsByFollowUp.find((x) => x.serviceType === 'Prepaid')?.count || 0
                    },
                    graphByMonth: response?.data?.countsByMonth.map((x) => { return { value: Number(x.count), name: x.serviceType } }),
                    graphByComplaint: response?.data?.countsByComplaint.map((x) => { return { value: Number(x.count), name: x.serviceType } }),
                    graphByFollowUp: response?.data?.countsByFollowUp.map((x) => { return { value: Number(x.count), name: x.serviceType } })
                }
                console.log('data',data)
                setChatDashboardData(data)
                // setChatDashboardData([{ value: 4, name: 'Fixed Line' },{ value: 4, name: 'Prepaid' },{ value: 4, name: 'Postpaid' }])
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(hideSpinner)
    showSpinner()
    post(properties.WHATSAPP + '/graph/day', requestBody)
        .then((response) => {
            if (response.data) {
                const currMonthDays = moment().daysInMonth()
                const currMonth = String(moment().format('MMM')).toUpperCase()
                const { data } = response
                let dateRange = []
                let postpaidDateWise = []
                let prepaidDateWise = []
                let fixedLineDateWise = []
                let range = []
                for(let i = 1; i <= currMonthDays; i++) {
                    range.push(i)
                    dateRange.push(String(i).length === 1 ?  '0' + String(i) + '-' + currMonth : String(i) + '-' + currMonth)
                }
                if (data && data.length > 0) {
                    for (let b of dateRange) {
                        const fixedInfo = data.find((x) => x.serviceType === 'Fixed' && x.date === b)
                        if(fixedInfo) {
                            fixedLineDateWise.push(fixedInfo.count)
                        } else {
                            fixedLineDateWise.push(0)
                        }
                        const prepaidInfo = data.find((x) => x.serviceType === 'Prepaid' && x.date === b)
                        if(prepaidInfo) {
                            prepaidDateWise.push(prepaidInfo.count)
                        } else {
                            prepaidDateWise.push(0)
                        }
                        const postpaidInfo = data.find((x) => x.serviceType === 'Postpaid' && x.date === b)
                        if(postpaidInfo) {
                            postpaidDateWise.push(postpaidInfo.count)
                        } else {
                            postpaidDateWise.push(0)
                        }
                    }
                }
                unstable_batchedUpdates(() => {
                    setMonthlyFixedline(fixedLineDateWise)
                    setMonthlyPostpaid(postpaidDateWise)
                    setMonthlyPrepaid(prepaidDateWise)
                    setRangeMonthly(range)
                    setDataRange(dataRange)
                })
            }
        }).finally(hideSpinner)
        showSpinner()
        post(properties.WHATSAPP + '/graph/complaint', requestBody)
            .then((response) => {
                if (response.data) {
                    const currMonthDays = moment().daysInMonth()
                    const currMonth = String(moment().format('MMM')).toUpperCase()
                    const { data } = response
                    let dateRange = []
                    let postpaidDateWise = []
                    let prepaidDateWise = []
                    let fixedLineDateWise = []
                    let range = []
                    for(let i = 1; i <= currMonthDays; i++) {
                        range.push(i)
                        dateRange.push(String(i).length === 1 ?  '0' + String(i) + '-' + currMonth : String(i) + '-' + currMonth)
                    }
                    if (data && data.length > 0) {
                        for (let b of dateRange) {
                            const fixedInfo = data.find((x) => x.serviceType === 'Fixed' && x.date === b)
                            if(fixedInfo) {
                                fixedLineDateWise.push(fixedInfo.count)
                            } else {
                                fixedLineDateWise.push(0)
                            }
                            const prepaidInfo = data.find((x) => x.serviceType === 'Prepaid' && x.date === b)
                            if(prepaidInfo) {
                                prepaidDateWise.push(prepaidInfo.count)
                            } else {
                                prepaidDateWise.push(0)
                            }
                            const postpaidInfo = data.find((x) => x.serviceType === 'Postpaid' && x.date === b)
                            if(postpaidInfo) {
                                postpaidDateWise.push(postpaidInfo.count)
                            } else {
                                postpaidDateWise.push(0)
                            }
                        }
                    }
                    unstable_batchedUpdates(() => {
                        setComplaintFixedline(fixedLineDateWise)
                        setComplaintPostpaid(postpaidDateWise)
                        setComplaintPrepaid(prepaidDateWise)
                        setRangeComplaint(range)
                        setDataRange(dataRange)
                    })
                }
            }).finally(hideSpinner)
            showSpinner()
        post(properties.WHATSAPP + '/graph/followup', requestBody)
            .then((response) => {
                    if (response.data) {
                        const currMonthDays = moment().daysInMonth()
                        const currMonth = String(moment().format('MMM')).toUpperCase()
                        const { data } = response
                        let dateRange = []
                        let postpaidDateWise = []
                        let prepaidDateWise = []
                        let fixedLineDateWise = []
                        let range = []
                        for(let i = 1; i <= currMonthDays; i++) {
                            range.push(i)
                            dateRange.push(String(i).length === 1 ?  '0' + String(i) + '-' + currMonth : String(i) + '-' + currMonth)
                        }
                        if (data && data.length > 0) {
                            for (let b of dateRange) {
                                const fixedInfo = data.find((x) => x.serviceType === 'Fixed' && x.date === b)
                                if(fixedInfo) {
                                    fixedLineDateWise.push(fixedInfo.count)
                                } else {
                                    fixedLineDateWise.push(0)
                                }
                                const prepaidInfo = data.find((x) => x.serviceType === 'Prepaid' && x.date === b)
                                if(prepaidInfo) {
                                    prepaidDateWise.push(prepaidInfo.count)
                                } else {
                                    prepaidDateWise.push(0)
                                }
                                const postpaidInfo = data.find((x) => x.serviceType === 'Postpaid' && x.date === b)
                                if(postpaidInfo) {
                                    postpaidDateWise.push(postpaidInfo.count)
                                } else {
                                    postpaidDateWise.push(0)
                                }
                            }
                        }
                        unstable_batchedUpdates(() => {
                            setFollowUpFixedline(fixedLineDateWise)
                            setFollowUpPostpaid(postpaidDateWise)
                            setFollowUpPrepaid(prepaidDateWise)
                            setRangeFollowUp(range)
                            setDataRange(dataRange)
                        })
                    }
            }).finally(hideSpinner)     
            showSpinner()
            post(properties.WHATSAPP + '/graph/time', requestBody)
            .then((response) => {
                    if (response.data) {
                        const currMonthDays = moment().daysInMonth()
                        console.log('currMonthDays',currMonthDays)
                        const currMonth = String(moment().format('MMM')).toUpperCase()
                        console.log('currMonth',currMonth)
                        const { data } = response
                        let dateRange = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
                        let postpaidDateWise = ['Postpaid']
                        let prepaidDateWise = ['Prepaid']
                        let fixedLineDateWise = ['Fixed Line']
                        let allDateWise = ['All']
                        let range = []
                        console.log('dateRange',dateRange)
                        if (data && data.length > 0) {
                            for (let b of dateRange) {
                                const fixedInfo = data.filter((x) => x.serviceType === 'Fixed' && x.createdAt === b)
                                if(fixedInfo) {
                                    fixedLineDateWise.push(String(fixedInfo.reduce((partialSum, a) => Number(partialSum) + Number(a.counts), 0)))
                                } else {
                                    fixedLineDateWise.push(String(0))
                                }
                                const prepaidInfo = data.filter((x) => x.serviceType === 'Prepaid' && x.createdAt === b)
                                if(prepaidInfo) {
                                    prepaidDateWise.push(String(prepaidInfo.reduce((partialSum, a) => Number(partialSum) + Number(a.counts), 0)))
                                } else {
                                    prepaidDateWise.push(String(0))
                                }
                                const postpaidInfo = data.filter((x) => x.serviceType === 'Postpaid' && x.createdAt === b)
                                if(postpaidInfo) {
                                    postpaidDateWise.push(String(postpaidInfo.reduce((partialSum, a) => Number(partialSum) + Number(a.counts), 0)))
                                } else {
                                    postpaidDateWise.push(String(0))
                                }
                                const allInfo = data.filter((x) => x.createdAt === b)
                                if(allInfo) {
                                    allDateWise.push(String(allInfo.reduce((partialSum, a) => Number(partialSum) + Number(a.counts), 0)))
                                } else {
                                    allDateWise.push(String(0))
                                }
                            }
                        }
                        unstable_batchedUpdates(() => {
                            console.log('fixedLineDateWise',fixedLineDateWise)
                            console.log('postpaidDateWise',postpaidDateWise)
                            console.log('prepaidLineDateWise',prepaidDateWise)
                            console.log('allDateWise',allDateWise)
                            setDailyFixedline(fixedLineDateWise)
                            setDailyPostpaid(postpaidDateWise)
                            setDailyPrepaid(prepaidDateWise)
                            setDailyAll(allDateWise)
                        })
                    }
            }).finally(hideSpinner)   
    },[countRefresh])
    
    const setAutoRefreshInterval = useCallback(() => {
        autoRefreshIntervalRef.current = setInterval(() => {
            unstable_batchedUpdates(() => {
                setCountRefresh(!countRefresh);
            })
        }, 30000)
     }, [countRefresh])
  
     useEffect(() => {
        if (autoRefresh)
            setAutoRefreshInterval();
        return () => clearInterval(autoRefreshIntervalRef.current)
    }, [setAutoRefreshInterval, autoRefresh]);

    const handleDateRangeChange = (event, picker) => {
        setSelectedDate({
            startDate: moment(picker.startDate).format('DD-MM-YYYY'),
            endDate: moment(picker.endDate).format('DD-MM-YYYY')
        })
    }

    const handleDateChange = (e) => {
        unstable_batchedUpdates(() => {
            setSelectedDate({
                startDate: e.target.value,
                endDate: e.target.value
            })
            setCountRefresh(!countRefresh);
        })
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12 row p-0">
                    <div className="col-10">
                        <div className="page-title-box">
                            <h4 className="page-title">WhatsApp Dashboard</h4>
                        </div>
                    </div>
                    <div className="col-2 mt-1">
                            <div className="form-group">
                            <input type="date" max={moment(new Date()).format('YYYY-MM-DD')} className="form-control" value={selectedDate.startDate} onChange={(e) => handleDateChange(e)}/>
                            </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="row">
                        <WhatsAppTodayCard data={{data:chatDashboardData.countsByToday,requestBody:selectedDate}}/>
                        <WhatsAppMonthCard data={{data:chatDashboardData.countsByMonth,requestBody:selectedDate}}/>
                        <WhatsAppComplaintCard data={{data:chatDashboardData.countsByComplaint,requestBody:selectedDate}}/>
                        <WhatsAppFollowUpCard data={{data:chatDashboardData.countsByFollowUp,requestBody:selectedDate}}/>
                     </div>   
                    <div className="row">
                        <div class="col-6 mrg-top mt-1">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers’ Visit Whatsapp This Month</h4>
                                        {<ReactEcharts
                                            option={{
                                                legend: {
                                                    top: 'top'
                                                },
                                                toolbox: {
                                                    show: true,
                                                    feature: {
                                                        saveAsImage: { show: true }
                                                    }
                                                },
                                                series: [
                                                    {
                                                        name: 'Nightingale Chart',
                                                        type: 'pie',
                                                        radius: [50, 100],
                                                        center: ['50%', '50%'],
                                                        roseType: 'area',
                                                        itemStyle: {
                                                            borderRadius: 2
                                                        },
                                                        label: {
                                                            show: true
                                                        },
                                                        data: [
                                                            ...chatDashboardData?.graphByMonth
                                                        ]
                                                    }
                                                ]
                                            }} />}
                                            <WhatsAppTable
                                                chartDetails={chatDashboardData?.graphByMonth}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers' Created Complaint Via Whatsapp This Month</h4>
                                        {<ReactEcharts
                                            option={{
                                                legend: {
                                                    top: 'top'
                                                },
                                                toolbox: {
                                                    show: true,
                                                    feature: {
                                                        saveAsImage: { show: true }
                                                    }
                                                },
                                                series: [
                                                    {
                                                        name: 'Nightingale Chart',
                                                        type: 'pie',
                                                        radius: [50, 100],
                                                        center: ['50%', '50%'],
                                                        roseType: 'area',
                                                        itemStyle: {
                                                            borderRadius: 2
                                                        },
                                                        label: {
                                                            show: true
                                                        },
                                                        data: [
                                                            ...chatDashboardData?.graphByComplaint
                                                        ]
                                                    }
                                                ]
                                            }} />}
                                            <WhatsAppTable
                                                chartDetails={chatDashboardData?.graphByComplaint}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers' Followed Up Complaints Via Whatsapp This Month</h4>
                                        {<ReactEcharts
                                            option={{
                                                legend: {
                                                    top: 'top'
                                                },
                                                toolbox: {
                                                    show: true,
                                                    feature: {
                                                        saveAsImage: { show: true }
                                                    }
                                                },
                                                series: [
                                                    {
                                                        name: 'Nightingale Chart',
                                                        type: 'pie',
                                                        radius: [50, 100],
                                                        center: ['50%', '50%'],
                                                        roseType: 'area',
                                                        itemStyle: {
                                                            borderRadius: 2
                                                        },
                                                        label: {
                                                            show: true
                                                        },
                                                        data: [
                                                            ...chatDashboardData?.graphByFollowUp
                                                        ]
                                                    }
                                                ]
                                            }} />}
                                            <WhatsAppTable
                                                chartDetails={chatDashboardData?.graphByFollowUp}
                                            />
                                    </div>
                                </div>
                            </div>
                        </div>    
                        <div class="col-6 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers’ Visit Whatsapp This Month</h4>
                                        {monhtlyPostpaid && monhtlyPrepaid && monhtlyFixedline &&
                                                <ReactEcharts
                                                    style={{ width: "100%", height: "600%" }}
                                                    option={{
                                                        tooltip: {
                                                            trigger: 'axis',
                                                            axisPointer: {
                                                                type: 'shadow'
                                                            }
                                                        },
                                                        legend: {
                                                            data: ['Fixed Line', 'Prepaid', 'Postpaid']
                                                        },
                                                        grid: {
                                                            left: '3%',
                                                            right: '4%',
                                                            bottom: '3%',
                                                            containLabel: true
                                                        },
                                                        xAxis: {
                                                            type: 'value'
                                                        },
                                                        yAxis: {
                                                            type: 'category',
                                                            data: rangeMonthly
                                                        },
                                                        series: [
                                                            {
                                                                name: 'Fixed Line',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: monhtlyFixedline
                                                            },
                                                            {
                                                                name: 'Prepaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: monhtlyPrepaid
                                                            },
                                                            {
                                                                name: 'Postpaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: monhtlyPostpaid
                                                            },

                                                        ]
                                                    }}
                                                />
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers' Created Complaint Via Whatsapp This Month</h4>
                                        {complaintFixedline && complaintPostpaid && complaintPrepaid &&
                                                <ReactEcharts
                                                    style={{ width: "100%", height: "600%" }}
                                                    option={{
                                                        tooltip: {
                                                            trigger: 'axis',
                                                            axisPointer: {
                                                                type: 'shadow'
                                                            }
                                                        },
                                                        legend: {
                                                            data: ['Fixed Line', 'Prepaid', 'Postpaid']
                                                        },
                                                        grid: {
                                                            left: '3%',
                                                            right: '4%',
                                                            bottom: '3%',
                                                            containLabel: true
                                                        },
                                                        xAxis: {
                                                            type: 'value'
                                                        },
                                                        yAxis: {
                                                            type: 'category',
                                                            data: rangeComplaint
                                                        },
                                                        series: [
                                                            {
                                                                name: 'Fixed Line',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: complaintFixedline
                                                            },
                                                            {
                                                                name: 'Prepaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: complaintPrepaid
                                                            },
                                                            {
                                                                name: 'Postpaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: complaintPostpaid
                                                            },

                                                        ]
                                                    }}
                                                />
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-6 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers' Followed Up Complaints Via Whatsapp This Month</h4>
                                        {followUpFixedline && followUpPostpaid && followUpPrepaid &&
                                                <ReactEcharts
                                                    style={{ width: "100%", height: "600%" }}
                                                    option={{
                                                        tooltip: {
                                                            trigger: 'axis',
                                                            axisPointer: {
                                                                type: 'shadow'
                                                            }
                                                        },
                                                        legend: {
                                                            data: ['Fixed Line', 'Prepaid', 'Postpaid']
                                                        },
                                                        grid: {
                                                            left: '3%',
                                                            right: '4%',
                                                            bottom: '3%',
                                                            containLabel: true
                                                        },
                                                        xAxis: {
                                                            type: 'value'
                                                        },
                                                        yAxis: {
                                                            type: 'category',
                                                            data: rangeFollowUp
                                                        },
                                                        series: [
                                                            {
                                                                name: 'Fixed Line',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: followUpFixedline
                                                            },
                                                            {
                                                                name: 'Prepaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: followUpPrepaid
                                                            },
                                                            {
                                                                name: 'Postpaid',
                                                                type: 'bar',
                                                                stack: 'total',
                                                                label: {
                                                                    show: true
                                                                },
                                                                emphasis: {
                                                                    focus: 'series'
                                                                },
                                                                data: followUpPostpaid
                                                            },

                                                        ]
                                                    }}
                                                />
                                            }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="row">
                        <div class="col-12 mrg-top mt-2">
                            <div class="card">
                                <div class="card-body" dir="ltr">
                                    <div class="p-1 ">
                                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Customers' Visit Whatsapp Today</h4>
                                    {chatDashboardData && <>
                                        <ReactEcharts style={{ width: "100%", height: "600%" }}
                                            option={{
                                                legend: { data: ['Prepaid', 'Postpaid', 'Fixed Line', 'All'] },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    showContent: true
                                                },
                                                dataset: {
                                                    source: [
                                                        ['product', ...['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10  PM', '11 PM']],
                                                        dailyPrepaid,
                                                        dailyPostpaid,
                                                        dailyFixedline,
                                                        dailyAll,
                                                    ],

                                                },
                                                xAxis: { type: 'category', /*boundaryGap: false*/ },
                                                yAxis: { gridIndex: 0 },
                                                grid: { top: '20%' },
                                                series: [
                                                    {
                                                        type: 'line',
                                                        smooth: true,
                                                        seriesLayoutBy: 'row',
                                                        emphasis: { focus: 'series' }
                                                    },
                                                    {
                                                        type: 'line',
                                                        smooth: true,
                                                        seriesLayoutBy: 'row',
                                                        emphasis: { focus: 'series' }
                                                    },
                                                    {
                                                        type: 'line',
                                                        smooth: true,
                                                        seriesLayoutBy: 'row',
                                                        emphasis: { focus: 'series' }
                                                    },
                                                    {
                                                        type: 'line',
                                                        smooth: true,
                                                        seriesLayoutBy: 'row',
                                                        emphasis: { focus: 'series' }
                                                    },
                                                    // {
                                                    //     type: 'pie',
                                                    //     id: 'pie',
                                                    //     radius: '30%',
                                                    //     center: ['50%', '25%'],
                                                    //     emphasis: {
                                                    //         focus: 'self'
                                                    //     },
                                                    //     label: {
                                                    //         formatter: ''
                                                    //     },
                                                    //     encode: {
                                                    //         itemName: 'product',
                                                    //         value: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10  PM', '11 PM'][0],
                                                    //         tooltip: ['12 AM', '1 AM', '2 AM', '3 AM', '4 AM', '5 AM', '6 AM', '7 AM', '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10  PM', '11 PM'][0]
                                                    //     }
                                                    // }
                                                ]
                                            }}
                                        />
                                    </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default WhatsAppDashboard