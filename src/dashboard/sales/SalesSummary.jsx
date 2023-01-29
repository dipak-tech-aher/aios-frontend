/* eslint-disable jsx-a11y/alt-text */
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useState } from "react";
import { unstable_batchedUpdates } from 'react-dom';
import statistics from '../../assets/images/statistics.svg';
import { hideSpinner, showSpinner } from "../../common/spinner";
import { properties } from "../../properties";
import { post } from "../../util/restUtil";
import TripleCard from './shared/TripleCountCard';
import Card from './shared/Card'
import SalesTable from "./shared/SalesTable";
import _ from 'lodash'
import SalesArchived from './SalesArchivedDetails'

const SalesSummary = (props) => {
    const intialValue = {
        totalSales: 0,
        totalTarget: 0,
        remainingCount: 0,
        remainingPercentage: 0,
        fixedLineSales: 0,
        fixedLineTarget: 0,
        fixedLineDifference: 0,
        fixedLinePercentage: 0,
        postpaidLineSales: 0,
        postpaidTarget: 0,
        postpaidDifference: 0,
        postpaidPercentage: 0,
        prepaidSales: 0,
        prepaidTarget: 0,
        prepaidDifference: 0,
        prepaidPercentage: 0
    }
    // const [seriesData, setSeriesData] = useState({})
    // const [polarFixedLineSeriesData, setPolarFixedLineSeriesData] = useState({})
    // const [polarPostpaidSeriesData, setPolarPostpaidSeriesData] = useState({})
    // const [polarPrepaidSeriesData, setPolarPrepaidSeriesData] = useState({})
    const [location, setLocation] = useState()
    const [salesData, setSalesData] = useState(intialValue)
    const [dateWiseSeriesData, setDateWiseSeriesData] = useState()
    const [dateWisiDataLeger, setDateWiseDataLeger] = useState()
    const [topUserData, setTopUserData] = useState()
    const [topLocationData, setTopLocationData] = useState()
    const [dailySalesData, setDailySalesData] = useState({
        fixed: 0,
        postpaid: 0,
        prepaid: 0
    })
    const { submitData, topUser, topLocation } = props?.data
    const [userData, setUserData] = useState([{}])
    const [locationData, setLocationData] = useState([{}])
    const [centerSummaryData, setCenterSummaryData] = useState()
    const [isOpen,setIsOpen] = useState(false)
    const [exportData, setExportData] = useState()

    useEffect(() => {
        showSpinner()
        const requestBody = {
            location: submitData?.location,
            startDate: submitData?.startDate,
            endDate: submitData?.endDate,
            user: submitData?.user,
            orderType: submitData?.orderType,
            serviceType: submitData?.serviceType
        }

        let FixedSalesCount = []
        let PrepaidSalesCout = []
        let PostpaidSalesCout = []
        let totalSales = []

        post(properties.BUSINESS_ENTITY_API, ['LOCATION'])
            .then((response) => {
                const { data } = response
                if (data['LOCATION'].length > 0) {
                    post(properties.SALES_DASHBOARD_GRAPH, requestBody)
                        .then((res) => {
                            if (res.data.salesTarget.length > 0) {
                                for (let e of res.data.salesTarget) {
                                    if (e.servicetype === 'Fixed') {
                                        FixedSalesCount.push({
                                            description: e.locations,
                                            'FixedTarget': e.targetcount
                                        })
                                    }
                                    if (e.servicetype === 'Prepaid') {
                                        PrepaidSalesCout.push({
                                            description: e.locations,
                                            'PrepaidTarget': e.targetcount
                                        })
                                    }
                                    if (e.servicetype === 'Postpaid') {
                                        PostpaidSalesCout.push({
                                            description: e.locations,
                                            'PostpaidTarget': e.targetcount
                                        })
                                    }

                                }
                                for (let l of data['LOCATION']) {
                                    const Fixed = FixedSalesCount.find(item => item.description === l.description);
                                    const Prepaid = PrepaidSalesCout.find(item => item.description === l.description);
                                    const Postpaid = PostpaidSalesCout.find(item => item.description === l.description);
                                    const rowData = res.data.rows.find(item => item.description === l.description)
                                    totalSales.push({ ...Fixed, ...Prepaid, ...Postpaid, ...rowData })
                                }
                                totalSales = totalSales.filter(element => {
                                    if (Object.keys(element).length !== 0) {
                                        return true;
                                    }
                                    return false;
                                });
                                setCenterSummaryData(totalSales)
                            }
                        })
                }
            })

        post(`${properties.DASHBOARD}/salesDashboard`, requestBody)
            .then((response) => {
                const { data } = response
                if (data) {

                    let salesArchivedCount={}
                    let SalesTargetCount = {}
                    for(let s of data?.salesCount?.groupCount ){
                        salesArchivedCount = {
                            ...salesArchivedCount,
                            [s.servicetype]:s.count
                        }
                    }
                    for(let s of data?.targetCount?.groupedTargetCount ){
                        SalesTargetCount = {
                            ...SalesTargetCount,
                            [s.servicetype]:s.sum
                        }
                    }

                    let SalesSummaryData = {
                        totalSales: Number(data?.salesCount?.totalSaleCount) || 0,
                        totalTarget: Number(data?.targetCount?.totalTargetCount) || 0,
                        currentSalesPercantage: ((Number(data?.salesCount?.totalSaleCount) / Number(data?.targetCount?.totalTargetCount)) * 100 || 0).toFixed(2),
                        previousTotalSales: Number(data?.salesCount.previoustotalSaleCount) || 0,
                        previousTotaltarget: Number(data?.targetCount.previousTargetData) || 0,
                        previousSalesPercentage: (Number(data?.salesCount.previoustotalSaleCount) / Number(data?.targetCount.previousTargetData) * 100).toFixed(2),
                        remainingCount: Number((data?.targetCount?.totalTargetCount - data?.salesCount?.totalSaleCount)) || 0,
                        remainingPercentage: (((data?.targetCount?.totalTargetCount - data?.salesCount?.totalSaleCount) / data?.targetCount?.totalTargetCount) * 100 || 0).toFixed(2),
                        fixedLineSales: Number(salesArchivedCount?.Fixed) || 0,
                        fixedLineTarget: Number(SalesTargetCount?.Fixed) || 0,
                        fixedLineDifference: Number((SalesTargetCount?.Fixed - salesArchivedCount?.Fixed)) || 0,
                        fixedLinePercentage: ((salesArchivedCount?.Fixed / SalesTargetCount?.Fixed) * 100).toFixed(2) || 0,
                        postpaidLineSales: Number(salesArchivedCount?.Postpaid) || 0,
                        postpaidTarget: Number(SalesTargetCount?.Postpaid) || 0,
                        postpaidDifference: Number((SalesTargetCount?.Postpaid - salesArchivedCount?.Postpaid)) || 0,
                        postpaidPercentage: ((salesArchivedCount?.Postpaid / SalesTargetCount?.Postpaid) * 100).toFixed(2) || 0,
                        prepaidSales: Number(salesArchivedCount?.Prepaid) || 0,
                        prepaidTarget: Number(SalesTargetCount?.Prepaid) || 0,
                        prepaidDifference: Number((SalesTargetCount?.Prepaid - salesArchivedCount?.Prepaid)) || 0,
                        prepaidPercentage: ((salesArchivedCount?.Prepaid / SalesTargetCount?.Prepaid) * 100).toFixed(2) || 0
                    }                        
                        setSalesData(SalesSummaryData)
                }
            })

        post(properties.SALES_DASHBOARD_DAILY_API, requestBody)
            .then((response) => {
                const { data } = response
                if (data.DailySalesData.length > 0) {
                    let SalesSummaryDailyData = {
                        fixed: data?.DailySalesData[0]?.count || 0,
                        postpaid: data?.DailySalesData[1]?.count || 0,
                        prepaid: data?.DailySalesData[2]?.count || 0
                    }
                    setDailySalesData(SalesSummaryDailyData)
                }
                let dateRange = []
                let fixedLineDateWise = []
                let postpaidDateWise = []
                let prepaidLineDateWise = []
                if (data.dateWiseData.length > 0) {
                    for (let c of data.dateWiseData) {
                        dateRange.push(c.date)
                    }
                    dateRange = Object.keys(dateRange.reduce((p, c) => (p[c] = true, p), {}));

                    for (let b of dateRange) {
                        for (let c of data.dateWiseData) {
                            if (b === c.date && c.servicetype === 'Fixed') {
                                fixedLineDateWise.push(c.count)
                            }
                            if (b === c.date && c.servicetype === 'Postpaid') {
                                postpaidDateWise.push(c.count)
                            }
                            if (b === c.date && c.servicetype === 'Prepaid') {
                                prepaidLineDateWise.push(c.count)
                            }
                        }
                    }
                }
                unstable_batchedUpdates(() => {
                    setDateWiseDataLeger(dateRange)
                    setDateWiseSeriesData([
                        {
                            name: 'Fixed Line',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: fixedLineDateWise
                        },
                        {
                            name: 'Postpaid',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: postpaidDateWise
                        }, {
                            name: 'Prepaid',
                            type: 'line',
                            stack: 'Total',
                            areaStyle: {},
                            emphasis: {
                                focus: 'series'
                            },
                            data: prepaidLineDateWise
                        }
                    ])
                })
            })
            .catch((error) => {
                hideSpinner();
            })
            .finally(() => {
                hideSpinner();
            })
    }, [submitData])

    useEffect(()=>{
        setExportData({
            location: submitData?.location,
            startDate: submitData?.startDate,
            endDate: submitData?.endDate,
            user: submitData?.user,
            orderType: submitData?.orderType,
            serviceType: submitData?.serviceType
        })

    },[submitData])

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
            <div>
                <div className="container-xl pl-2">
                    <div className="col-12">
                        <div className="card sales-view card-waves border" style={{ minWidth: '1300px' }}>
                            <div className="card-body p-2">
                                <div className="row align-items-center justify-content-between">
                                    <div className="col-md-4">
                                        <div className="widget-left pt-2">
                                            <div className="sale-order-val">
                                                <div className="row">
                                                    <div class="col-6">
                                                        <p className="text-white">Total Sales</p>
                                                        <h2 className="text-white"><span className="dollar-icon"></span>{new Intl.NumberFormat().format(salesData.totalSales)}</h2>
                                                    </div>
                                                    {/* <div className="empt-spc"></div> */}
                                                    <div class="col-6">
                                                        <p className="text-white">Target</p>
                                                        <h2 className="text-white"><span className="dollar-icon"></span>{new Intl.NumberFormat().format(salesData.totalTarget)}</h2>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="billed-cont clearfix">
                                                <div className="contract-left">
                                                    <p>Remaining</p>
                                                    <h3>{new Intl.NumberFormat().format(salesData.remainingCount)}</h3>
                                                </div>
                                                <div className="contract-right">
                                                    <p>Remaining % </p>
                                                    <h3>{salesData.remainingPercentage}% </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <h4 className="text-primary">Yesterday Sales</h4>
                                        <p className="text-gray-700 col-width"><div className="row">
                                            <div className="col-4">
                                                <div className="text-center">
                                                    <p className="mb-2 text-truncate">Fixed</p>
                                                    <h2 className="text-primary  text-center text-bold"><span data-plugin="counterup">{new Intl.NumberFormat().format(dailySalesData.fixed)}</span></h2>
                                                </div>

                                            </div>
                                            <div className="col-4">
                                                <div className="text-center">
                                                    <p className="mb-2 text-truncate">Mobile Postpaid</p>
                                                    <h4 className="text-primary">
                                                        <h2 className="text-primary  text-center text-bold"><span data-plugin="counterup">{new Intl.NumberFormat().format(dailySalesData.postpaid)}</span></h2>
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="text-center">
                                                    <p className="mb-2 text-truncate">Mobile Prepaid</p>
                                                    <h2 className="text-primary  text-center text-bold"><span data-plugin="counterup">{new Intl.NumberFormat().format(dailySalesData.prepaid)}</span></h2>
                                                </div>
                                            </div>

                                        </div></p>

                                    </div>
                                    <div className="col-md-4"><img className="img-fluid px-xl-4 mt-xxl-n5" src={statistics} /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-12 pl-1 pad-left" style={{ marginLeft: "0" }}>
                    <Card
                        data={{
                            header: "Fixedline",
                            targetCount: new Intl.NumberFormat().format(salesData.fixedLineTarget),
                            count1: new Intl.NumberFormat().format(salesData.fixedLineSales),
                            percentage: salesData.fixedLinePercentage,
                            progressbarColor: "progress-bar bg-success",
                            footer1: new Intl.NumberFormat().format(salesData.fixedLineDifference),
                            icon: "mdi mdi-phone font-16 avatar-title text-white ",
                            icon1: salesData.fixedLineSales > salesData.fixedLineTarget
                        }}
                    />
                    <Card
                        data={{
                            header: "PostPaid",
                            targetCount: new Intl.NumberFormat().format(salesData.postpaidTarget),
                            count1: new Intl.NumberFormat().format(salesData.postpaidLineSales),
                            percentage: salesData.postpaidPercentage,
                            progressbarColor: "progress-bar bg-warning",
                            footer1: new Intl.NumberFormat().format(salesData.postpaidDifference),
                            icon: "mdi mdi-cellphone font-20 avatar-title text-white",
                            icon1: salesData.postpaidLineSales > salesData.postpaidTarget
                        }}
                    />
                    <Card
                        data={{
                            header: "Prepaid",
                            targetCount: new Intl.NumberFormat().format(salesData.prepaidTarget),
                            count1: new Intl.NumberFormat().format(salesData.prepaidSales),
                            percentage: salesData.prepaidPercentage,
                            progressbarColor: "progress-bar bg-danger",
                            footer1: new Intl.NumberFormat().format(salesData.prepaidDifference),
                            icon: "mdi mdi-sim font-18 avatar-title text-white",
                            icon1: salesData.prepaidSales > salesData.prepaidTarget
                        }}
                    />
                    <Card
                        data={{
                            header: "Total Performance",
                            targetCount: "",
                            count1: salesData?.currentSalesPercantage || 0,
                            percentage: salesData?.currentSalesPercantage || 0,
                            progressbarColor: "progress-bar bg-primary",
                            footer1: (Number(salesData.currentSalesPercantage) - Number(salesData?.previousSalesPercentage)).toFixed(2),
                            icon: "mdi mdi-percent font-18 avatar-title text-white",
                            icon1: ((Number(salesData.currentSalesPercantage) - Number(salesData?.previousSalesPercentage)).toFixed(2)) > 0
                        }}
                    />
                </div>
                <div className="row py-3" style={{ marginLeft: "0" }}>
                    <div className="col-4 col-width">
                        <TripleCard
                            data={{
                                header: "Monthly Target",
                                count1: new Intl.NumberFormat().format(salesData.fixedLineTarget),
                                count2: new Intl.NumberFormat().format(salesData.postpaidTarget),
                                count3: new Intl.NumberFormat().format(salesData.prepaidTarget),
                                footer1: "Fixed",
                                footer2: "Mobile Postpaid",
                                footer3: "Mobile Prepaid",
                                icon: "mdi mdi-target mr-1 noti-icon font-26",
                                isExport:false,
                                exportData
                            }}
                            handler={{
                                setIsOpen
                            }}
                        />
                    </div>
                    <div className="col-4 col-width">
                        <TripleCard
                            data={{
                                header: "Sales Achived",
                                count1: new Intl.NumberFormat().format(salesData.fixedLineSales),
                                count2: new Intl.NumberFormat().format(salesData.postpaidLineSales),
                                count3: new Intl.NumberFormat().format(salesData.prepaidSales),
                                footer1: "Fixed",
                                footer2: "Mobile Postpaid",
                                footer3: "Mobile Prepaid",
                                icon: "mdi mdi-progress-check mr-1 noti-icon font-26",
                                isExport:true,
                                exportData
                            }}
                            handler={{
                                setIsOpen,
                                setExportData
                            }}
                        />
                    </div>
                    <div className="col-4 col-width">
                        <TripleCard
                            data={{
                                header: "Total to reach Target",
                                count1: new Intl.NumberFormat().format(salesData.fixedLineDifference),
                                count2: new Intl.NumberFormat().format(salesData.postpaidDifference),
                                count3: new Intl.NumberFormat().format(salesData.prepaidDifference),
                                footer1: "Fixed",
                                footer2: "Mobile Postpaid",
                                footer3: "Mobile Prepaid",
                                icon: "mdi mdi-run mr-1 noti-icon font-26",
                                isExport:false,
                                exportData
                            }}
                            handler={{
                                setIsOpen
                            }}
                        />
                    </div>
                </div>
                {/*          <div class="row pt-2">
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
                              {  locationData && <ReactEcharts
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
                                    }}/>}
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
*/}
                <div className="row p-2  ">
                    <div class="card col-12">
                        <div class="card-body">
                            <h4>All Centers Summary</h4>
                            <table class="table table-responsive  dt-responsive nowrap w-100 sum-table">
                                <thead>
                                    <tr>
                                        <th class="table-head1" rowspan="1" colspan="1"></th>
                                        <th class="table-head1" rowspan="1" colspan="2">Fixed</th>
                                        <th class="table-head1" rowspan="1" colspan="2">Postpaid</th>
                                        <th class="table-head1" rowspan="1" colspan="2">Prepaid</th>
                                    </tr>
                                    <tr>
                                        <th class="br-color" rowspan="1">Branches</th>
                                        <th class="table-target" rowspan="2">Target</th>
                                        <th class="table-achived" rowspan="2">Achieved</th>
                                        <th class="table-target" rowspan="2">Target</th>
                                        <th class="table-achived" rowspan="2">Achieved</th>
                                        <th class="table-target" rowspan="2">Target</th>
                                        <th class="table-achived" rowspan="2">Achieved</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {centerSummaryData && centerSummaryData.map((e) => (
                                        <tr>
                                            <td class="br-color">{e?.description}</td>
                                            <td class="table-target">{e?.FixedTarget || 0}</td>
                                            <td class="table-achived">{e?.fixedsales || 0}</td>
                                            <td class="table-target">{e?.PostpaidTarget || 0}</td>
                                            <td class="table-achived">{e?.postpaidsales || 0}</td>
                                            <td class="table-target">{e?.PrepaidTarget || 0}</td>
                                            <td class="table-achived">{e.prepaidsales || 0}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            { /*  <ul class="nav nav-pills navtab-bg nav-justified">
                            <li class="nav-item">
                                <a href="#home1" data-toggle="tab" aria-expanded="false"
                                    class="nav-link active">
                                    Column View
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#profile1" data-toggle="tab" aria-expanded="true"
                                    class="nav-link">
                                    Polar View
                                </a>
                            </li>

                        </ul>
                        <div class="tab-content">
                            <div class="tab-pane show active col-12" id="home1">
                                {location &&
                                    <ReactEcharts
                                        option={{
                                            tooltip: {
                                                trigger: 'axis',
                                                axisPointer: {
                                                    type: 'shadow'
                                                }
                                            },
                                            toolbox: {
                                                feature: {
                                                    magicType: { show: true, type: ['line', 'bar'] },
                                                    saveAsImage: { show: true }
                                                }
                                            },
                                            legend: {},
                                            grid: {
                                                left: '0%',
                                                right: '0%',
                                                bottom: '2%',
                                                containLabel: true
                                            },
                                            xAxis: [
                                                {
                                                    type: 'category',
                                                    data: location
                                                }
                                            ],
                                            yAxis: [
                                                {
                                                    type: 'value'
                                                }
                                            ],
                                            series: seriesData
                                        }}
                                    />}
                            </div>
                            <div class="tab-pane" id="profile1">
                                <div class="row col-12">
                                    <div class="col-4 text-center">
                                        {location && <ReactEcharts
                                            option={{
                                                angleAxis: {
                                                    type: 'category',
                                                    data: location
                                                },
                                                radiusAxis: {},
                                                polar: {},
                                                series: polarFixedLineSeriesData,
                                                legend: {
                                                    show: true,
                                                    data: ['Sales', 'Target']
                                                }
                                            }
                                            }
                                        />
                                        }
                                        <h4>Fixed line</h4>
                                    </div>
                                    <div class="col-4 text-center">
                                        {location && <ReactEcharts
                                            option={{
                                                angleAxis: {
                                                    type: 'category',
                                                    data: location
                                                },
                                                radiusAxis: {},
                                                polar: {},
                                                series: polarPostpaidSeriesData,
                                                legend: {
                                                    show: true,
                                                    data: ['Sales', 'Target']
                                                }
                                            }
                                            }
                                        />
                                        }
                                        <h4>Postpaid</h4>
                                    </div>
                                    <div class="col-4 text-center">
                                        {location && <ReactEcharts
                                            option={{
                                                angleAxis: {
                                                    type: 'category',
                                                    data: location
                                                },
                                                radiusAxis: {},
                                                polar: {},
                                                series: polarPrepaidSeriesData,
                                                legend: {
                                                    show: true,
                                                    data: ['Sales', 'Target']
                                                }
                                            }
                                            }
                                        />
                                        }
                                        <h4>Prepaid</h4>
                                    </div>
                                </div>
                            </div>
                        </div>*/}
                        </div>
                    </div>
                </div>
                {isOpen &&
                <SalesArchived
                data = {{
                    isOpen,
                    exportData
                }}
                handler={{
                    setIsOpen
                }}
                />}
            </div>
        </>
    )
}

export default SalesSummary;