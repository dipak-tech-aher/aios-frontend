import React, { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Bar } from '@reactchartjs/react-chart.js'

const InteractionsChart = (props) => {
    const { chartData } = props.data;
    const { t } = useTranslation();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const data = useRef({});

    const options = {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        callback: function(val) {
                            return Number.isInteger(val) ? val : null;
                        }
                        //fixedStepSize: 1
                    },
                },
            ],
        },
    }

    const getData = useCallback((type) => {
        if (type === "mobile") {
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            chartData.mobileGraph.forEach(({ mobilemonth, mobile }) => {
                data[new Date(mobilemonth).getMonth()] = parseInt(mobile);
            })
            return data;
        }
        else {
            let data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            chartData.broadBandGraph.forEach(({ createdmonth, broadbrand }) => {
                data[new Date(createdmonth).getMonth()] = parseInt(broadbrand);
            })
            return data;
        }
    }, [chartData.broadBandGraph, chartData.mobileGraph])


    useEffect(() => {
        data.current = {
            labels: monthNames,
            datasets: [{
                label: "Mobile",
                backgroundColor: "#f68720",
                data: getData('mobile'),
            }, {
                label: "Fixed",
                backgroundColor: "#94C4E6",
                data: getData('broadband')
            }],
        };
    }, [chartData, getData])

    return (
        <div className="col-md-8 p-1">
            <div className="card">
                <div className="card-body">
                    <div className="float-right d-none">
                        <div className="btn-group mb-2">
                            <button type="button" className="btn btn-xs btn-light">{t('today')}</button>
                            <button type="button" className="btn btn-xs btn-light">{t('weekly')}</button>
                            <button type="button" className="btn btn-xs btn-secondary ">{t('monthly')}</button>
                        </div>
                    </div>
                    <h5 className="header-title">{t('interactions_by')} {t('month')}</h5>
                    <div className="mt-3 chartjs-chart"><div className="chartjs-size-monitor">
                        <Bar data={data.current} options={options} />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InteractionsChart;
