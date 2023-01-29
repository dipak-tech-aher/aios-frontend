import React, { useCallback, useEffect, useRef, useState } from 'react'
import { unstable_batchedUpdates } from 'react-dom'
import { hideSpinner, showSpinner } from '../../common/spinner'
import { properties } from '../../properties';
import { get } from "../../util/restUtil";
import ChatDoubleCard from './ChatDoubleCard'
import ChatSingleCard from './ChatSingleCard'
import moment from 'moment'
import { Link } from 'react-router-dom';
import { ChatPerAgentModel, LoggedInAgentModel } from './ChatAgentPopView';

const ChatDashboard = () => {

    const autoRefresh = true
    const autoRefreshIntervalRef = useRef();
    const [countRefresh,setCountRefresh] = useState(false)
    const [chatDashboardData,setChatDashboardData] = useState({})
    const [selectedDate,setSelectedDate] = useState(moment(new Date()).format('DD-MMM-YYYY'))
    const [showChatPerAgentModal,setShowChatPerAgentModal] = useState(false)
    const [ chatPerAgentData, setChatPerAgentData ] = useState({})
    const [showLoggedInAgentModal,setShowLoggedInAgentModal] = useState(false)
    const [ loggedInAgentData, setLoggedInAgentData ] = useState({})

    useEffect(() => {
        showSpinner()
        get(`${properties.CHAT_API}/monitor${selectedDate === "" ? '':`?date=${selectedDate}`}`) 
        .then((response) => {
            if(response.data)
            {
                setChatDashboardData(response?.data[0])
            }
        })
        .catch((error) => {
            console.log(error)
        })
        .finally(hideSpinner)
        
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

    const handleDateChange = (e) => {
        unstable_batchedUpdates(() => {
            setSelectedDate(e.target.value)
            setCountRefresh(!countRefresh);
        })
    }
    const handleChatPerAgentView=()=>{
        get(`${properties.CHAT_API}/chat-per-agent`) 
        .then((response) => {
            if(response.data)
            {                
                setChatPerAgentData(response?.data)
            }
        })
        .catch((error) => {
            console.log(error)
        })

        setShowChatPerAgentModal(true)
    }

    const handleLoggedInAgentView=()=>{
        get(`${properties.CHAT_API}/loggedin-agent`) 
        .then((response) => {
            if(response.data)
            {                
                setLoggedInAgentData(response?.data)
            }
        })
        .catch((error) => {
            console.log(error)
        })

        setShowLoggedInAgentModal(true)
    }

    return (
        <div className="row">
            <div className="col-lg-12 pl-0">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-10">
                            <div className="page-title-box">
                                <h4 className="page-title">Chat Monitoring</h4>
                            </div>
                        </div>
                        {/* <div className="col-2 mt-1">
                            <div className="form-group">
                                <input type="date" max={moment(new Date()).format('YYYY-MM-DD')} className="form-control" value={selectedDate} onChange={(e) => handleDateChange(e)}/>
                            </div>
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="col-xl-12 monitor-sec">
                            <div className="row">
                                <div className="col-md-8 p-1">
                                    <div className="card chat-mon que-sec logged-sec">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <ChatSingleCard
                                                    data={{
                                                        header: "Queue",
                                                        icon: "fa fa-indent",
                                                        count: chatDashboardData && chatDashboardData?.queue || 0,
                                                        footer: "Chats"
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <ChatSingleCard
                                                    data={{
                                                        header: "Currently Served",
                                                        icon: "fas fa-comment-dots",
                                                        count: chatDashboardData && chatDashboardData?.currentlyServed || 0,
                                                        footer: "Chats"
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <ChatSingleCard
                                                    data={{
                                                        header: "Abandoned Chat",
                                                        icon: "fas fa-comment-dots",
                                                        count: chatDashboardData && chatDashboardData?.abandonedChat || 0,
                                                        footer: "Chats"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 p-1">
                                    <ChatDoubleCard
                                        data={{
                                            header: "Wait Time",
                                            icon: "fas fa-clock",
                                            count1: chatDashboardData && chatDashboardData?.waitAverage && (chatDashboardData?.waitAverage?.minutes || 0) + "m " + (chatDashboardData?.waitAverage?.seconds || 0)  + "s" || "0m 0s",
                                            count2: chatDashboardData && chatDashboardData?.waitLongest && (chatDashboardData?.waitLongest?.minutes || 0) + "m " + (chatDashboardData?.waitLongest?.seconds || 0) + "s" || "0m 0s",
                                            footer1: "Average",
                                            footer2: "Longest"
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 p-1">
                                    <ChatDoubleCard
                                        data={{
                                            header: "Chat Duration",
                                            icon: "fas fa-stopwatch",   
                                            count1: chatDashboardData && chatDashboardData?.chatDurationAverage && (chatDashboardData?.chatDurationAverage?.minutes || 0) + "m " + (chatDashboardData?.chatDurationAverage?.seconds || 0) + "s" || "0m 0s",
                                            count2: chatDashboardData && chatDashboardData?.chatDurationLongest && (chatDashboardData?.chatDurationLongest?.minutes || 0) + "m " + (chatDashboardData?.chatDurationLongest?.seconds || 0) + "s" || "0m 0s",
                                            footer1: "Average",
                                            footer2: "Longest"
                                        }}
                                    />
                                </div>
                                <div className="col-md-4 p-1">
                                    <div className="card chat-mon">
                                        <div className="card-body">
                                            <div className="media">
                                                <div className="media-body overflow-hidden">
                                                    <h5 className="header-title">Chat Per Agent</h5>   
                                                    <p className="img-icon"> <i className="fas fa-comment-alt"></i></p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-body chat-mon">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="time-left text-center">
                                                            <h3 onClick={()=>handleChatPerAgentView()}>
                                                                {chatDashboardData && chatDashboardData?.noOfAgents || 0}
                                                            </h3>                                                        
                                                        <p>No. Of Agents</p>
                                                    </div>
                                                    {   showChatPerAgentModal&&
                                                            <ChatPerAgentModel
                                                                data={{
                                                                    isOpen: showChatPerAgentModal,
                                                                    chatData: chatPerAgentData
                                                                }}
                                                                handler={{
                                                                    setIsOpen:setShowChatPerAgentModal 
                                                                }}
                                                            />
                                                    }
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="time-left text-center">
                                                        <h3>{chatDashboardData && chatDashboardData?.chatPerAgentAvg || 0}</h3>
                                                        <p>Average</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 p-1">
                                    <div className="card chat-mon que-sec logged-sec">
                                        <div className="row">
                                            <div className="col-md-8">
                                            <div className="card-sec">
                                                <div className="card-body">
                                                    <div className="media">
                                                        <div className="media-body overflow-hidden">
                                                            <h5 className="header-title">Logged In</h5> 
                                                            <p className="img-icon"><i className="fas fa-sign-in-alt" aria-hidden="true"></i></p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body chat-mon">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="time-left text-center agent-count">
                                                                <h3 onClick={()=>handleLoggedInAgentView()}>
                                                                    {chatDashboardData && chatDashboardData?.loggedInAgents || 0}
                                                                </h3>
                                                                <p>Agents</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {   showLoggedInAgentModal&&
                                                            <LoggedInAgentModel
                                                                data={{
                                                                    isOpen: showLoggedInAgentModal,
                                                                    loginData: loggedInAgentData
                                                                }}
                                                                handler={{
                                                                    setIsOpen:setShowLoggedInAgentModal 
                                                                }}
                                                            />
                                                    }
                                                </div>
                                                </div>                                              
                                            </div>
                                        </div>
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

export default ChatDashboard