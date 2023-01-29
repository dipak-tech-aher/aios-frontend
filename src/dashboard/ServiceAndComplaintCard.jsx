import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { formatDateForBirthDate } from "../util/dateUtil";

const ServiceAndComplaintCard = (props) => {
    const { data, type, selfDept, dateRange } = props
    const { open, assigned, closed, failed, total } = data;
    const interactionTypeText = type === 'Service Request' ? "REQSR" : "REQCOMP";
    const ALL = "";
    const textWIP = "NEW";
    const textASSIGNED = "ASSIGNED";
    const textCLOSED = "CLOSED";
    const textFAILED = "CANCELLED";
    const baseURL = `${process.env.REACT_APP_BASE}/ticket-search`;

    return (
        <div className="col-md-4 p-1">
            <div className="card">
                <div className="card-body">
                    <div className="media">
                        <div className="media-body overflow-hidden">
                            <h5 className="header-title">{type === "Complaints" ? "Tickets" : type}</h5>
                            <h3 className="mb-0">
                                {
                                    total > 0 ? (
                                        <Link to={`${baseURL}?requestType=${interactionTypeText === "REQCOMP" || interactionTypeText === "REQINQ" ? "ticket" : interactionTypeText}&status=${ALL}&selfDept=${selfDept}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`}><p className="cursor-pointer">{total}</p></Link>
                                    ) : (
                                        <p className="cursor-pointer">{total}</p>
                                    )
                                }
                            </h3>
                        </div>
                        <div className="text-primary">
                            <i className={`${type === 'Service Request' ? "fe-layers" : "fe-bar-chart-2"}  mr-1 noti-icon `}></i>
                        </div>
                    </div>
                </div>

                <div className="card-body border-top py-3">
                    <div className="row">
                        <div className="col-3">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">New</p>
                                <h4 className="text-danger">
                                    {
                                        open > 0 ? (
                                            <Link to={`${baseURL}?requestType=${interactionTypeText === "REQCOMP" || interactionTypeText === "REQINQ" ? "ticket" : interactionTypeText}&status=${textWIP}&selfDept=${selfDept}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`}>
                                                <p>{open}</p>
                                            </Link>
                                        )
                                            : (
                                                <p className="cursor-pointer">{open}</p>
                                            )
                                    }
                                </h4>
                            </div>
                        </div>
                        {
                            <div className="col-3">
                                <div className="text-center">
                                    <p className="mb-2 text-truncate">Assigned</p>
                                    <h4 className="text-primary">
                                        {
                                            assigned > 0 ? (
                                                <Link to={`${baseURL}?requestType=${interactionTypeText === "REQCOMP" || interactionTypeText === "REQINQ" ? "ticket" : interactionTypeText}&status=${textASSIGNED}&selfDept=${selfDept}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`}>
                                                    <p>{assigned}</p>
                                                </Link>
                                            ) : (
                                                <p className="cursor-pointer">{assigned}</p>
                                            )
                                        }
                                    </h4>
                                </div>
                            </div>
                        }
                        <div className="col-3">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">Cancelled</p>
                                <h4 className="text-success">
                                    {
                                        failed > 0 ? (
                                            <Link to={`${baseURL}?requestType=${interactionTypeText === "REQCOMP" || interactionTypeText === "REQINQ" ? "ticket" : interactionTypeText}&status=${textFAILED}&selfDept=${selfDept}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`}>
                                                <p>{failed}</p>
                                            </Link>
                                        ) : (
                                            <p className="cursor-pointer">{failed}</p>
                                        )
                                    }
                                </h4>
                            </div>
                        </div>

                        <div className="col-3">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">Closed</p>
                                <h4 className="text-success">
                                    {
                                        closed > 0 ? (
                                            <Link to={`${baseURL}?requestType=${interactionTypeText === "REQCOMP" || interactionTypeText === "REQINQ" ? "ticket" : interactionTypeText}&status=${textCLOSED}&selfDept=${selfDept}&fromDate=${dateRange.startDate}&toDate=${dateRange.endDate}`}>
                                                <p>{closed}</p>
                                            </Link>
                                        ) : (
                                            <p className="cursor-pointer">{closed}</p>
                                        )
                                    }
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceAndComplaintCard;