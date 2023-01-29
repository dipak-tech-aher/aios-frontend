import React, { useCallback, useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { post } from "../util/restUtil";
import { hideSpinner, showSpinner } from '../common/spinner';
import { toast } from "react-toastify";
import { properties } from '../properties';

const ChatCard = (props) => {
    const { agent, selfDept, data, dateRange} = props 
    return (
        <div className="col-md-4 p-1">
        <div className="card">
            <div className="card-body">
                <div className="media">
                    <div className="media-body overflow-hidden">
                        <h5 className="header-title">Chat</h5>
                        <h3 className="mb-0">
                            {data.total}
                        </h3>
                    </div>
                    <div className="text-primary">
                    <i className="icon dripicons-message mr-1 noti-icon" aria-hidden="true"></i>

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
                                    data.new > 0 ? (
                                        <Link to={{ pathname: `${process.env.REACT_APP_BASE}/agentChatListView`, data: { sourceName: 'card', status:'NEW', agent:agent, selfDept:selfDept, dateRange } }}>
                                            <p>{data.new}</p>
                                        </Link>
                                    )
                                    : (
                                        <p className="cursor-pointer">{data.new}</p>
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
                                        data.assigned > 0 ? (
                                            <Link to={{ pathname: `${process.env.REACT_APP_BASE}/agentChatListView`, data: { sourceName: 'card', status:'ASSIGNED', agent:agent, selfDept:selfDept, dateRange } }}>
                                            <p>{data.assigned}</p>
                                            </Link>
                                        ) : (
                                            <p className="cursor-pointer">{data.assigned}</p>
                                        )
                                    }
                                </h4>
                            </div>
                        </div>
                    }
                   

                    <div className="col-3">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">Closed</p>
                            <h4 className="text-success">
                            {
                                data.closed > 0 ? (
                                    <Link to={{ pathname: `${process.env.REACT_APP_BASE}/agentChatListView`, data: { sourceName: 'card', status:'CLOSED', agent:agent, selfDept:selfDept, dateRange } }}>
                                    <p>{data.closed}</p>
                                    </Link>
                                ) : (
                                    <p className="cursor-pointer">{data.closed}</p>
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

export default ChatCard;