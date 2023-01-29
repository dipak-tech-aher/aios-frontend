import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { formatDateDDMMMYY } from '../util/dateUtil'

function ServiceSummary(props) {

    const { t } = useTranslation();

    const summaryData = props.data.summaryData

    return (
        <div className="card greyborder">
            <div className="card-body">
                <div className="card-header">
                    <h5 className="card-title mb-0">{summaryData.serviceType} - {summaryData.serviceNbr}</h5>
                </div>
                <div id="cardCollpase2" className="pt-3 collapse show">
                    {
                        summaryData.serviceType === 'Fixed'?
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Account Status</label>
                                            <p>{summaryData.accountStatus}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Service Status</label>
                                            <p>{summaryData.serviceStatus}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Current Balance</label>
                                            <p>${Number(summaryData.currentBalance).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Outstanding Amount</label>
                                            <p>${Number(summaryData.outstandingAmount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Gross Amount</label>
                                            <p>${Number(summaryData.grossAmount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment</label>
                                            <p>${Number(summaryData.lastPayment).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment Date</label>
                                            <p>{formatDateDDMMMYY(summaryData.lastPaymentDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Unbilled Usage</label>
                                            <p>{summaryData.unbilledUsage}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Usage Limit</label>
                                            <p>{summaryData.usageLimit}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Accumulated Usage</label>
                                            <p>{summaryData.accumulatedUsage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :
                            <></>
                    }
                    {
                        summaryData.serviceType === 'Prepaid'?
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Account Status</label>
                                            <p>{summaryData.accountStatus}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Service Status</label>
                                            <p>{summaryData.serviceStatus}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Account Balance</label>
                                            <p>${Number(summaryData.accountBalance).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Main Balance</label>
                                            <p>${Number(summaryData.mainBalance).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment</label>
                                            <p>${Number(summaryData.lastPayment).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment Date</label>
                                            <p>{formatDateDDMMMYY(summaryData.lastPaymentDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Voice</label>
                                            <p>{summaryData.voice}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">SMS</label>
                                            <p>{summaryData.sms}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Data</label>
                                            <p>{summaryData.data}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :
                            <></>
                    }
                    {
                        summaryData.serviceType === 'Postpaid'?
                            <div className="form">
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Account Status</label>
                                            <p>{summaryData.accountStatus}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Service Status</label>
                                            <p>{summaryData.serviceStatus}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Account Balance</label>
                                            <p>${Number(summaryData.accountBalance).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Current Balance</label>
                                            <p>${Number(summaryData.currentBalance).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Outstanding Amount</label>
                                            <p>${Number(summaryData.outstandingAmount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Gross Amount</label>
                                            <p>${Number(summaryData.grossAmount).toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment</label>
                                            <p>{Number(summaryData.lastPayment).toFixed(2)}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Last Payment Date</label>
                                            <p>{formatDateDDMMMYY(summaryData.lastPaymentDate)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Unbilled Usage</label>
                                            <p>{summaryData.unbilledUsage}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            :
                            <></>
                    }                    
                </div>
            </div>
        </div>


    )

}
export default ServiceSummary;



