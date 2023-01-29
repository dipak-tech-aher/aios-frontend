/* eslint-disable jsx-a11y/alt-text */
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from "../../common/spinner";
import { properties } from "../../properties";
import { post } from "../../util/restUtil";
import moment from 'moment';
import SalesTable from "./shared/SalesTable";

const TheMall = (props) => {
    const [targetData, setTargetData] = useState()
    const [salesData, setSalesData] = useState()

    const [dailyPrepaid, setDailyPrepaid] = useState([])
    const [dailyPrepaidNew, setDailyPrepaidNew] = useState([])
    const [dailyPrepaidPortin, setDailyPrepaidPortin] = useState([])
    const [dailyPrepaidPortBundle, setDailyPrepaidPortBundle] = useState([])

    const [dailyPostpaid, setDailyPostpaid] = useState([])
    const [dailyPostpaidNew, setDailyPostpaidNew] = useState([])
    const [dailyPostpaidPortin, setDailyPostpaidPortin] = useState([])
    const [dailyPostpaidBundle, setDailyPostpaidBundle] = useState([])

    const [dailyFixedline, setDailyFixedline] = useState([])
    const [dailyFixedlineChart, setDailyFixedlineChart] = useState([])

    const [dailyFixedlineNew, setDailyFixedlineNew] = useState([])
    const [dailyFixedlinePortin, setDailyFixedlinePortin] = useState([])
    const [dailyFixedlinetBundle, setDailyFixedlinetBundle] = useState([])

    const { submitData, topUser, topLocation } = props?.data
    const [range, setRange] = useState()
    const [dataRange, setDataRange] = useState()
    const [topUserData, setTopUserData] = useState()
    const [topLocationData, setTopLocationData] = useState()
    const [userData, setUserData] = useState([{}])
    const [locationData, setLocationData] = useState([{}])

    useEffect(() => {
        const requestBody = {
            location: submitData?.location,
            startDate: submitData?.startDate,
            endDate: submitData?.endDate,
            user: submitData?.user,
            orderType: submitData?.orderType,
            serviceType: submitData?.serviceType
        }
        showSpinner()
        post(properties.SALES_DASHBOARD_API, requestBody)
            .then((response) => {
                if (response.data) {
                    let salesArchivedCount = {}
                    let SalesTargetCount = {}
                    for (let s of response.data?.salesCount?.groupCount) {
                        salesArchivedCount = {
                            ...salesArchivedCount,
                            [s.servicetype]: s.count
                        }
                    }
                    for (let s of response.data?.targetCount?.groupedTargetCount) {
                        SalesTargetCount = {
                            ...SalesTargetCount,
                            [s.servicetype]: s.sum
                        }
                    }

                    unstable_batchedUpdates(() => {
                        setTargetData(SalesTargetCount)
                        setSalesData(salesArchivedCount)
                    })
                }
            }).finally(hideSpinner)
        showSpinner()
        post(properties.SALES_DASHBOARD_DAILY_API, requestBody)
            .then((response) => {
                if (response.data) {

                    const { data } = response
                    let dateRange = []
                    let fixedLineDateWise = ['Fixedline']
                    let postpaidDateWise = ['Postpaid']
                    let postpaidDateWiseNew = []
                    let postpaidDateWisePortin = []
                    let postpaidDateWiseBundle = []
                    let prepaidLineDateWise = ['Prepaid']
                    let prepaidLineDateWiseNew = []
                    let prepaidLineDateWisePortin = []
                    let prepaidLineDateBundle = []
                    let fixedLineDateWiseChart = []
                    let range = []
                    let dataRange = []
                    let fixedLineDateWiseNew = []
                    let fixedLineDateWisePortin = []
                    let fixedLineDateWiseBundle = []

                    if (data.dateWiseData.length > 0) {
                        for (let c of data.dateWiseData) {
                            if (!dateRange.includes(c.date)) {
                                dateRange.push(c.date)
                            }

                            if (!range.includes(c.date.substring(0, 2))) {
                                range.push(c.date.substring(0, 2))
                            }

                        }
                        dateRange = Object.keys(dateRange.reduce((p, c) => (p[c] = true, p), {}));
                        range = Object.keys(range.reduce((p, c) => (p[c] = true, p), {}));
                        range = range.map(i => Number(i));
                        range = range.sort(function (a, b) { return a - b })
                        dataRange = range.map(i => i.toString())

                        for (let b of dateRange) {
                            for (let c of data.dateWiseData) {
                                if (b === c.date && c.servicetype === 'Fixed') {
                                    fixedLineDateWise.push(c.count)
                                    fixedLineDateWiseNew.push(c.new_con)
                                    fixedLineDateWisePortin.push(c.portin)
                                    fixedLineDateWiseBundle.push(c.bundle)
                                }
                                if (b === c.date && c.servicetype === 'Postpaid') {
                                    postpaidDateWise.push(c.count)
                                    postpaidDateWiseNew.push(c.new_con)
                                    postpaidDateWiseBundle.push(c.bundle)
                                    postpaidDateWisePortin.push(c.portin)
                                }
                                if (b === c.date && c.servicetype === 'Prepaid') {
                                    prepaidLineDateWise.push(c.count)
                                    prepaidLineDateWiseNew.push(c.new_con)
                                    prepaidLineDateWisePortin.push(c.portin)
                                    prepaidLineDateBundle.push(c.bundle)
                                }
                                if (b === c.date && c.servicetype === 'Fixed') {
                                    let date = moment(c.date).format('YYYY/MM/DD')
                                    fixedLineDateWiseChart.push([date, c.bundle, 'Bundle'])
                                    fixedLineDateWiseChart.push([date, c.portin, 'Port-in'])
                                    fixedLineDateWiseChart.push([date, c.new_con, 'New'])
                                    fixedLineDateWiseChart.push([date, c.upgrade, 'Upgrade'])
                                }

                            }
                        }


                    }
                    unstable_batchedUpdates(() => {
                        setDailyPrepaidNew(prepaidLineDateWiseNew)
                        setDailyPrepaidPortin(prepaidLineDateWisePortin)
                        setDailyPrepaidPortBundle(prepaidLineDateBundle)

                        setDailyPostpaidBundle(postpaidDateWiseBundle)
                        setDailyPostpaidNew(postpaidDateWiseNew)
                        setDailyPostpaidPortin(postpaidDateWisePortin)

                        setDailyFixedlineChart(fixedLineDateWiseChart)
                        setDailyFixedlineNew(fixedLineDateWiseNew)
                        setDailyFixedlinePortin(fixedLineDateWisePortin)
                        setDailyFixedlinetBundle(fixedLineDateWiseBundle)

                        setDailyPrepaid(prepaidLineDateWise)
                        setDailyFixedline(fixedLineDateWise)
                        setDailyPostpaid(postpaidDateWise)
                        setRange(range)
                        setDataRange(dataRange)
                    })
                }
            }).finally(hideSpinner)


    }, [submitData])

    useEffect(() => {
        let topUserData = []
        let topLocationData = []
        let userData = []
        let locationData = []

        for (let u of topUser) {
            topUserData.push({
                column_1: u.username,
                column_2: u.fixed,
                column_3: u.postpaid,
                column_4: u.prepaid
            })
            userData.push({
                value: Number(u.count),
                name: u.username
            })
        }

        for (let s of topLocation) {
            topLocationData.push({
                column_1: s.branches,
                column_2: s.fixed,
                column_3: s.postpaid,
                column_4: s.prepaid
            })

            locationData.push({
                value: Number(s.count),
                name: s.branches
            })
        }
        unstable_batchedUpdates(() => {
            setTopUserData(topUserData)
            setTopLocationData(topLocationData)
            setUserData(userData)
            setLocationData(locationData)
        })
    }, [topUser, topLocation])

    return (
        <>
            <div class="row pt-2">
                <div class="col-6">
                    <div class="card">
                        <div class="card-body" dir="ltr">
                            <div class="p-1 ">
                                <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Top 5 users</h4>
                                {userData && <ReactEcharts
                                    option={{
                                        tooltip: {
                                            trigger: 'item',
                                            formatter: '{a} <br/>{b}: {c} ({d}%)'
                                        },
                                        legend: {
                                            top: 'top',
                                            orient: 'horizontal',
                                            data: Object.values(userData)
                                        },
                                        series: [
                                            {
                                                name: 'Sales',
                                                type: 'pie',
                                                radius: ['50%', '70%'],
                                                avoidLabelOverlap: false,
                                                label: {
                                                    show: false,
                                                    position: 'center'
                                                },
                                                emphasis: {
                                                    label: {
                                                        show: true,
                                                        fontSize: '30',
                                                        fontWeight: 'bold'
                                                    }
                                                },
                                                labelLine: {
                                                    show: true
                                                },
                                                data: [...userData]
                                            }
                                        ]
                                    }}
                                />}
                                <SalesTable
                                    data={{
                                        header_1: "User",
                                        header_2: "Fixedline",
                                        header_3: "Postpaid",
                                        header_4: "Prepaid",
                                        salesDetails: topUserData
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-6 mrg-top">
                    <div class="card">
                        <div class="card-body" dir="ltr">
                            <div class="p-1 ">
                                <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Top 5 Branches</h4>
                                {locationData && <ReactEcharts
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
                                                    ...locationData
                                                ]
                                            }
                                        ]
                                    }} />}
                                <SalesTable
                                    data={{
                                        header_1: "Location",
                                        header_2: "Fixedline",
                                        header_3: "Postpaid",
                                        header_4: "Prepaid",
                                        salesDetails: topLocationData
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row py-3">
                <div className="col-4">
                    <div className="card">
                        <div className="py-2 pl-2" >
                            <div className="media">
                                <div className="media-body overflow-hidden">
                                    <h5 className="header-title">Fixedline Sales  (%)</h5>
                                </div>
                            </div>
                        </div>
                        <div className="card-body border-top py-3">
                            <div className="row">
                                <ReactEcharts
                                    style={{ width: "100%", height: "300%" }}
                                    option={{
                                        tooltip: {
                                            formatter: '{a} <br/>{b} : {c}%'
                                        },
                                        series: [
                                            {
                                                name: 'Pressure',
                                                type: 'gauge',
                                                progress: {
                                                    show: true
                                                },
                                                itemStyle: {
                                                    color: "orange",
                                                    shadowColor: "rgba(0,138,255,0.45)",
                                                    shadowBlur: 10,
                                                    shadowOffsetX: 2,
                                                    shadowOffsetY: 2
                                                },
                                                detail: {
                                                    formatter: '{value}',
                                                    valueAnimation: true,

                                                },
                                                data: [
                                                    {
                                                        value: Number((Number(salesData?.Fixed) / Number(targetData?.Fixed) * 100 || 0).toFixed(2)),
                                                        name: 'SCORE'
                                                    }
                                                ]
                                            }
                                        ]
                                    }}
                                />

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 p-1 space-align">
                    <div className="card">
                        <div className="py-2 pl-2">
                            <div className="media">
                                <div className="media-body overflow-hidden">
                                    <h5 className="header-title">Postpaid Sales  (%)</h5>
                                </div>
                            </div>
                        </div>

                        <div className="card-body border-top py-3">
                            <div className="row">

                                <>
                                    <ReactEcharts
                                        style={{ width: "100%", height: "300%" }}
                                        option={{
                                            tooltip: {
                                                formatter: '{a} <br/>{b} : {c}%'
                                            },
                                            series: [
                                                {
                                                    name: 'Pressure',
                                                    type: 'gauge',
                                                    progress: {
                                                        show: true
                                                    },
                                                    itemStyle: {
                                                        color: "orange",
                                                        shadowColor: "rgba(0,138,255,0.45)",
                                                        shadowBlur: 10,
                                                        shadowOffsetX: 2,
                                                        shadowOffsetY: 2
                                                    },
                                                    detail: {
                                                        formatter: '{value}',
                                                        valueAnimation: true,

                                                    },
                                                    data: [
                                                        {

                                                            value: Number.isFinite(Number((Number(salesData?.Postpaid) / Number(targetData?.Postpaid) * 100 || 0).toFixed(2))) ? Number((Number(salesData?.Postpaid) / Number(targetData?.Postpaid) * 100 || 0).toFixed(2)) : 0,
                                                            name: 'SCORE'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }}
                                    />
                                </>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-md-4 p-1 space-align">
                    <div className="card">
                        <div className="py-2 pl-2">
                            <div className="media">
                                <div className="media-body overflow-hidden">
                                    <h5 className="header-title">Prepaid Sales  (%)</h5>

                                </div>

                            </div>
                        </div>

                        <div className="card-body border-top py-3">
                            <div className="row">
                                <>
                                    <ReactEcharts
                                        style={{ width: "100%", height: "300%" }}
                                        option={{
                                            tooltip: {
                                                formatter: '{a} <br/>{b} : {c}%'
                                            },
                                            series: [
                                                {
                                                    name: 'Pressure',
                                                    type: 'gauge',
                                                    progress: {
                                                        show: true
                                                    },
                                                    itemStyle: {
                                                        color: "orange",
                                                        shadowColor: "rgba(0,138,255,0.45)",
                                                        shadowBlur: 2,
                                                        shadowOffsetX: 2,
                                                        shadowOffsetY: 2
                                                    },
                                                    detail: {
                                                        formatter: '{value}',
                                                        valueAnimation: true,

                                                    },
                                                    data: [
                                                        {
                                                            value: Number.isFinite(Number((Number(salesData?.Prepaid) / Number(targetData?.Prepaid) * 100 || 0).toFixed(2))) ? Number((Number(salesData?.Prepaid) / Number(targetData?.Prepaid) * 100 || 0).toFixed(2)) : 0,
                                                            name: 'SCORE'
                                                        }
                                                    ]
                                                }
                                            ]
                                        }}
                                    />
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row p-2 ">
                <div className="card col-6">
                    <div className="card-body">
                        <div className="p-1">
                            <div className="tab-content">
                                <div className="tab-pane show active col-12" id="home1">
                                    <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Daily Sales - All Products</h4>
                                    {dailyFixedline && dailyPostpaid && dailyPrepaid && range && <>
                                        <ReactEcharts style={{ width: "100%", height: "500%" }}
                                            option={{
                                                legend: { data: ['Prepaid', 'Postpaid', 'Fixedline'] },
                                                tooltip: {
                                                    trigger: 'axis',
                                                    showContent: true
                                                },
                                                dataset: {
                                                    source: [
                                                        ['product', ...dataRange],
                                                        dailyFixedline,
                                                        dailyPrepaid,
                                                        dailyPostpaid

                                                    ],

                                                },
                                                xAxis: { type: 'category', boundaryGap: false, },
                                                yAxis: { gridIndex: 0 },
                                                grid: { top: '55%' },
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
                                                    {
                                                        type: 'pie',
                                                        id: 'pie',
                                                        radius: '30%',
                                                        center: ['50%', '25%'],
                                                        emphasis: {
                                                            focus: 'self'
                                                        },
                                                        label: {
                                                            formatter: '{b}: {@01} ({d}%)'
                                                        },
                                                        encode: {
                                                            itemName: 'product',
                                                            value: range[0],
                                                            tooltip: range[0]
                                                        }
                                                    }
                                                ]
                                            }}
                                        />
                                    </>}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="card">
                        <div className="p-1">
                            <div className="tab-content">
                                <div className="tab-pane show active col-12" id="home1">
                                    <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Break UP - Fixedline</h4>
                                    {dailyFixedlineNew && dailyFixedlinePortin && dailyFixedlinetBundle &&
                                        <ReactEcharts
                                            style={{ width: "100%", height: "500%" }}
                                            option={{
                                                tooltip: {
                                                    trigger: 'axis',
                                                    axisPointer: {
                                                        type: 'shadow'
                                                    }
                                                },
                                                legend: {
                                                    data: ['New', 'Port in', 'Bundle']
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
                                                    data: range
                                                },
                                                series: [
                                                    {
                                                        name: 'New',
                                                        type: 'bar',
                                                        stack: 'total',
                                                        label: {
                                                            show: true
                                                        },
                                                        emphasis: {
                                                            focus: 'series'
                                                        },
                                                        data: dailyFixedlineNew
                                                    },
                                                    {
                                                        name: 'Port in',
                                                        type: 'bar',
                                                        stack: 'total',
                                                        label: {
                                                            show: true
                                                        },
                                                        emphasis: {
                                                            focus: 'series'
                                                        },
                                                        data: dailyFixedlinePortin
                                                    },
                                                    {
                                                        name: 'Bundle',
                                                        type: 'bar',
                                                        stack: 'total',
                                                        label: {
                                                            show: true
                                                        },
                                                        emphasis: {
                                                            focus: 'series'
                                                        },
                                                        data: dailyFixedlinetBundle
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
            </div>
            <div className="col-12 row pt-2 pl-2 pr-0  ">
                <div className="card col-12">
                    <div className="card-body">
                        <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Break UP - Postpaid</h4>
                        {dailyPostpaidBundle && dailyPostpaidNew && dailyPostpaidPortin && <ReactEcharts
                            style={{ width: "100%", height: "500%" }}
                            option={{
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {
                                        // Use axis to trigger tooltip
                                        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                                    }
                                },
                                legend: {
                                    data: ['New', 'Port in', 'Bundle']
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
                                    data: range
                                },
                                series: [
                                    {
                                        name: 'New',
                                        type: 'bar',
                                        stack: 'total',
                                        label: {
                                            show: true
                                        },
                                        emphasis: {
                                            focus: 'series'
                                        },
                                        data: dailyPostpaidNew
                                    },
                                    {
                                        name: 'Port in',
                                        type: 'bar',
                                        stack: 'total',
                                        label: {
                                            show: true
                                        },
                                        emphasis: {
                                            focus: 'series'
                                        },
                                        data: dailyPostpaidPortin
                                    },
                                    {
                                        name: 'Bundle',
                                        type: 'bar',
                                        stack: 'total',
                                        label: {
                                            show: true
                                        },
                                        emphasis: {
                                            focus: 'series'
                                        },
                                        data: dailyPostpaidBundle
                                    },

                                ]
                            }}
                        />}

                    </div>
                </div>
            </div>

            <div className="row pt-2 pl-2 pr-1">
                <div className="col-12">

                    <div className="card">
                        <div className="card-body">
                            <div className="card-widgets">
                            </div>
                            <h4 class="header-title mb-2" style={{ fontWeight: "bold" }}>Break UP - Prepaid</h4>
                            {dailyPrepaidNew && dailyPrepaidPortin && dailyPrepaidPortBundle &&
                                <ReactEcharts
                                    option={{
                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer: {
                                                type: 'shadow'
                                            }
                                        },
                                        legend: {
                                            data: ['New', 'Port in', 'Bundle']
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
                                            data: range
                                        },
                                        series: [
                                            {
                                                name: 'New',
                                                type: 'bar',
                                                stack: 'total',
                                                label: {
                                                    show: true
                                                },
                                                emphasis: {
                                                    focus: 'series'
                                                },
                                                data: dailyPrepaidNew
                                            },
                                            {
                                                name: 'Port in',
                                                type: 'bar',
                                                stack: 'total',
                                                label: {
                                                    show: true
                                                },
                                                emphasis: {
                                                    focus: 'series'
                                                },
                                                data: dailyPrepaidPortin
                                            },
                                            {
                                                name: 'Bundle',
                                                type: 'bar',
                                                stack: 'total',
                                                label: {
                                                    show: true
                                                },
                                                emphasis: {
                                                    focus: 'series'
                                                },
                                                data: dailyPrepaidPortBundle
                                            },

                                        ]
                                    }}
                                />}

                        </div>
                    </div>
                </div>
            </div>
        </>

    )

}

export default TheMall;