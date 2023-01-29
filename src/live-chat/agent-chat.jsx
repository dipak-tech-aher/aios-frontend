import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { useHistory } from "react-router-dom";
import socketClient, { } from "socket.io-client";
import { AppContext } from "../AppContext";
import { get, put, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";
import _ from "lodash";
import { unstable_batchedUpdates } from 'react-dom';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import boopSfx from '../assets/audio/AiosMsgSound.mp3';
import Avatar1 from '../assets/images/Avatar1.jpg'
import Avatar2 from '../assets/images/Avatar2.jpg'
import moment from 'moment';

const AgentChatBox = (props) => {

   const [totalPrepaidData, setTotalPrepaidData] = useState();
   const [dataBalance, setDataBalance] = useState();

   const [postpaidServiceDetails, setPostpaidServiceDetails] = useState();

   const [latestMonthPostpaidData, setLatestMonthPostpaidData] = useState();

   const [latestMonthFixedLineData, setLatestMonthFixedLineData] = useState();
   const [prepaidTarrifNameDetails, setPrepaidTarrifNameDetails] = useState();
   const [fixedLineTarrifNameDetails, setFixedLineTarrifNameDetails] = useState();
   const [postpaidTarrifNameDetails, setPostpaidTarrifNameDetails] = useState();


   const [newChatPageCount, setNewChatPageCount] = useState(0)
   const history = useHistory();
   const { auth, setAuth } = useContext(AppContext);
   const [newCustomer, setNewCustomer] = useState([]);
   const [connectedCustomer, setConnectedCustomer] = useState([]);
   const [selectedCustomer, setSelectedCustomer] = useState({});
   let [assignedCustomerCount, setAssignedCustomerCount] = useState(0);
   const [refresh, setRefresh] = useState(true)
   const [socket, setSocket] = useState();
   const [message, setMessage] = useState('');
   const [messageArr, setMessageArr] = useState([]);
   let colorAlign;
   const autoRefreshIntervalRef = useRef();
   const [autoRefresh, setAutoRefresh] = useState(true)
   const hasMoreTodo = useRef(true);
   const mergeTodoPrevList = useRef(false);
   const chatRef = useRef(null)
   const [newChatCount, setNewChatCount] = useState(0)
   const [countRefresh, setCountRefresh] = useState(false)
   const maxChatCount = auth?.chatCount ? auth?.chatCount : 10
   const [msgObject, setMsgObject] = useState({});
   // For message Time-start

   const msgTime = moment(new Date()).format('hh:mm:ss A')
   //For message Time-End

   const playSound = () => {
      const demo = document.getElementsByClassName('message-notification')[0]
      demo.play()
   }

   useEffect(() => {
      // var socketIO = socketClient(properties.API_ENDPOINT, { //removed properties.API_ENDPOINT and add '' for UAT & PROD
      //    // path:properties.SOCKET_PATH, //Enable it for UAT & PROD
      //    // port:properties.API_SERVICE_PORT, //Enable it for UAT & PROD
      //    withCredentials: true,
      //    transportOptions: {
      //       polling: {
      //          extraHeaders: {
      //             "my-custom-header": "chat"
      //          },
      //       },
      //    },
      // });
      var socketIO = socketClient('', { //removed properties.API_ENDPOINT and add '' for UAT & PROD
         path: properties?.SOCKET_PATH, //Enable it for UAT & PROD
         port: properties?.API_SERVICE_PORT, //Enable it for UAT & PROD
         withCredentials: true,
         transportOptions: {
            polling: {
               extraHeaders: {
                  "my-custom-header": "chat"
               },
            },
         },
      });
      socketIO && socketIO.on('connect', () => {
      })
      setSocket(socketIO)
   }, []);

   useEffect(() => {
      console.log('inside 1st useeffect')
      if (socket !== undefined) {
         customerQueue()
         //connectedCustomerByAgent();   
      }
   }, [socket, refresh, newChatPageCount]); // Pass in empty array to run useEffect only on mount.

   useEffect(() => {
      if (socket !== undefined) {
         connectedCustomerByAgent();
      }
   }, [socket])

   useEffect(() => {
      showSpinner()
      get(properties?.CHAT_API + "/count/new")
         .then((response) => {
            if (response) {
               if (Number(response?.data) !== Number(newChatCount)) {
                  unstable_batchedUpdates(() => {
                     setNewCustomer([])
                     setNewChatPageCount(0)
                     setRefresh(!refresh)
                  })
               }
               setNewChatCount(response?.data)
            }
         })
         .finally(hideSpinner)
   }, [countRefresh])

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
      return () => clearInterval(autoRefreshIntervalRef?.current)
   }, [setAutoRefreshInterval, autoRefresh]);

   //Default selected customer while loading the page
   useEffect(() => {
      if (connectedCustomer?.length > 0) {
         const chatID = connectedCustomer&&connectedCustomer[0].chatId;
         selectCustomer(chatID);
      }
   }, [connectedCustomer]);

   const handleOnScroll = (e) => {
      const { scrollHeight, scrollTop, clientHeight } = e?.target;
      const defaultIndex = Number(e?.target?.attributes?.defaultindex?.value);
      if (Math.ceil(scrollHeight - scrollTop) === clientHeight && hasMoreTodo?.current) {
         if (defaultIndex === 2) {
            mergeTodoPrevList.current = true;
            setNewChatPageCount(newChatPageCount + 1);
         }
      }
   }

   const customerQueue = () => {
      //load the new user's in queue-If status is "New"
      showSpinner();
      get(`${properties?.CHAT_API}?limit=10&page=${newChatPageCount}`)
         .then((resp) => {
            if (resp.data) {
               if (resp.status === 200) {
                  const { count, rows } = resp?.data;
                  setNewCustomer((newCustomer) => {
                     let updatedLength = mergeTodoPrevList?.current ? newCustomer?.length + rows?.length : rows?.length
                     hasMoreTodo.current = updatedLength < Number(count) ? true : false;
                     return mergeTodoPrevList?.current ? [...newCustomer, ...rows] : rows;
                  })
                  mergeTodoPrevList.current = false;
               } else {
                  toast.error("Failed to create - " + resp?.status);
               }
            } else {
               toast.error("Uexpected error ocurred " + resp?.statusCode);
            }
         }).finally(hideSpinner);
   }

   const scrollToBottom = () => {
      chatRef.current.scrollIntoView({ behavior: 'smooth' })
   }

   const connectedCustomerByAgent = () => {
      showSpinner();
      //customerQueue();
      get(`${properties.CHAT_API}/assigned`)
         .then((resp) => {
            if (resp.data) {
               if (resp.status === 200) {
                  resp.data && resp.data.forEach(element => {
                     let messages = []
                     get(`${properties?.CHAT_API}/message?email=${element?.emailId}&id=${element?.chatId}`)
                        .then((response) => {
                           if (response?.data) {
                              messages = response?.data
                              element["message"] = _.map(response?.data, 'msg');
                              element["messageColorAlign"] = messages.map((agentMsg) => { delete agentMsg?.msg; return agentMsg })
                           }
                           else {
                              element["message"] = [];
                              element["messageColorAlign"] = [];
                           }
                           let result = _.unionBy(connectedCustomer, resp?.data, 'chatId');
                           //result = _.filter(result, { 'status': 'Assigned' });
                           setConnectedCustomer(result);
                           setAssignedCustomerCount(result?.length)
                        })
                  }
                  );
               }
               else {
                  toast.error("Failed to create - " + resp?.status);
               }
            }
            else {
               toast.error("Uexpected error ocurred " + resp?.statusCode);
            }
         }).finally(hideSpinner);
   }

   const selectCustomer = (chatId) => {
      console.log('connectedCustomer------>', connectedCustomer)
      connectedCustomer && connectedCustomer?.length>0 && connectedCustomer?.forEach(element => {
         if (element?.chatId === chatId) {
            if (element?.identifier == 'Prepaid') {
               console.log('here in prepaid-->')
               post(properties?.GETTARRIFCODE_API, { tarrifCode: element?.customerInfo?.customerSummary?.return?.context?.contextElements && element?.customerInfo?.customerSummary?.return?.context?.contextElements?.filter((ele) => ele?.name === 'ProductCode')[0]?.value.stringValue })
                  .then(respData => {
                     setPrepaidTarrifNameDetails(respData?.data?.planName);
                  });
               const dataValues = element?.customerInfo?.serviceStatus?.mobile?.prepaid?.balance && element?.customerInfo?.serviceStatus?.mobile?.prepaid?.balance.filter((e) => e.balanceType === 'Data');
               const result = dataValues&&dataValues?.reduce(function (tot, arr) {
                  return tot + (+arr.value)
               }, 0);
               const tData = ((result / 1024) / 1024) / 1024;
               setTotalPrepaidData(tData)
            }
            if (element?.identifier == 'Postpaid') {
               console.log('here in postpaid-->')
               post(properties.GETTARRIFCODE_API, { tarrifCode: element?.customerInfo?.customerSummary?.return?.context?.contextElements.filter((ele) => ele?.name === 'ProductCode')[0]?.value?.stringValue })
                  .then(respData => {
                     setPostpaidTarrifNameDetails(respData?.data?.planName);
                  });
               const billingDetailsArr = element?.customerInfo?.serviceStatus?.mobile?.postpaid?.billingDetails;
               let dateArray = [];
               billingDetailsArr && billingDetailsArr?.forEach((ele) => {
                  ele?.billDate && dateArray.push(new Date(moment(ele?.billDate?.split('T')[0]).format('YYYY/MM/D')))
               })
               let maxDate = new Date(Math.max(...dateArray));
               const latestDate = moment(maxDate).format('YYYY/MM/D');
               const latestMonthData = billingDetailsArr && billingDetailsArr?.filter((e) => e.billDate && moment(e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestDate)
               setLatestMonthPostpaidData(latestMonthData);
            }
            if (element?.identifier == 'Fixedline') {
               console.log('here ---->')
               post(properties.GETTARRIFCODE_API, { tarrifCode: element?.customerInfo?.customerSummary?.return?.context?.contextElements && element?.customerInfo?.customerSummary?.return?.context?.contextElements.filter((ele) => ele?.name == 'ProductCode')[0].value.stringValue })
                  .then(respData => {
                     setFixedLineTarrifNameDetails(respData?.data?.planName);
                  });
               const a = element?.customerInfo?.serviceStatus?.fixedLine?.billingDetails;
               console.log('a--->', a)
               const dataBalance = element?.customerInfo?.serviceStatus?.fixedLine?.usage && (element?.customerInfo?.serviceStatus?.fixedLine?.usage[0]?.limit - element?.customerInfo?.serviceStatus?.fixedLine?.usage[0]?.accumulatedUsage);
               console.log('dataBalance---->', dataBalance)
               const tData = ((dataBalance / 1024) / 1024) / 1024;
               console.log('tdata---->', tData)
               setDataBalance(tData);
               let dateArray = [];
               if (a === undefined || a === null || a === "") {
                  console.log('inside if---')
               } else {
                  console.log('inside else---')
                  a && a.forEach((ele) => {
                     ele?.billDate && dateArray.push(new Date(moment(ele?.billDate.split('T')[0]).format('YYYY/MM/D')))
                  });
                  let maxDate = new Date(Math.max(...dateArray));
                  const latestDate = moment(maxDate).format('YYYY/MM/D');
                  setLatestMonthFixedLineData(latestDate);
               }
            }
            setSelectedCustomer(element)
         }
      });
   }

   //Assign customer chat
   const assignCustomer = (chatId) => {
      // console.log('This function is calling time of assignment')
      let count = assignedCustomerCount + 1
      setAssignedCustomerCount(count)
      if (count <= maxChatCount) {
         showSpinner();
         put(`${properties?.CHAT_API}/assign` + `/${chatId}`)
            .then((resp) => {
               //if (resp.data) {
               if (resp.status === 200) {
                  post(`${properties?.WEBCHAT_API}/get-chat-info`, { chatId: chatId })
                     .then((resp) => {
                        const msg = 'ConnectionConfirmed';
                        const msgType = 'text'
                        socket.emit("CLIENT-2", msgType + '@@@' + msg + '^^' + resp?.data?.socketId);
                        setNewCustomer([])
                        setNewChatPageCount(0)
                        customerQueue()
                        connectedCustomerByAgent()
                     })
               } else {
                  toast.error("Failed to update - " + resp?.status);
               }
               // } else {
               //    toast.error("Uexpected error ocurred " + resp.statusCode);             
               // }
            }).finally(hideSpinner);
      }
   }

   //Receive Message from Agent
   selectedCustomer && connectedCustomer && connectedCustomer.forEach((element) => {
      colorAlign = {
         from: "User",
         textAlign: "left",
         bgColor: "#F7941E",
      };
      socket && element?.socketId && socket.off(element?.socketId).on(element?.socketId + "-CLIENT-2", (msg) => {
         msg = 'text@@@' + msg?.split('@@@')[1].split('\n')[0] + '\n' + moment(new Date()).format('hh:mm:ss A')
         if (element.chatId === selectedCustomer?.chatId) {
            if (!element?.message.includes(msg)) {
               element?.messageColorAlign.push(colorAlign);
               element?.message.push(msg);
               let array = []
               element.message.map((userMsg, index) => {
                  console.log('----userMsg--->', userMsg)
                  array.push({ ...element?.messageColorAlign[index], msg: userMsg })
               })
               let body = {
                  chatId: element?.chatId,
                  email: element?.emailId,
                  message: array
               }
               showSpinner()
               post(properties.CHAT_API + "/message", body)
                  .then((resp) => {
                     playSound()
                     scrollToBottom()
                     console.log("Response :", resp?.message)
                  })
                  .catch((error) => {
                     console.log("error : ", error)
                  })
                  .finally(hideSpinner)
               // console.log('msg...message..', message)

               setMessageArr([...messageArr, message]);
            }
         }
      });
   });

   const handleSendMessage = () => {
      colorAlign = {
         from: 'Agent',
         textAlign: 'right',
         bgColor: '#F0532D',
      }
      const time = moment(new Date()).format('hh:mm:ss A')
      const msg = msgObject?.type === 'media' ? msgObject?.message : message
      const msgType = msgObject?.type === 'media' ? 'media' : 'text'
      connectedCustomer && connectedCustomer.forEach(element => {
         if (element.chatId === selectedCustomer?.chatId) {
            element?.messageColorAlign.push(colorAlign);
            element?.message.push(msgType + '@@@' + msg + '\n' + time)
            let array = []
            element.message.map((agentMsg, index) => {
               array.push({ ...element?.messageColorAlign[index], msg: agentMsg })
            })
            let body = {
               chatId: element?.chatId,
               email: element?.emailId,
               message: array
            }
            showSpinner()
            post(properties.CHAT_API + "/message", body)
               .then((resp) => {
                  scrollToBottom()
                  console.log("Response :", resp?.message)
               })
               .catch((error) => {
                  console.log("error : ", error)
               })
               .finally(hideSpinner)
            setMessageArr([...messageArr, message]);
            selectCustomer(element?.chatId);
         }
      });
      //Send Message to Server 
      socket.emit("CLIENT-2", msgType + '@@@' + msg + '\n' + time + '^^' + selectedCustomer?.socketId);
      setMessage('');//Do not remove it    
   }

   const endChat = (chatId, message, colorAlignFrom) => {
      showSpinner();
      post(`${properties.WEBCHAT_API}/get-chat-info`, { chatId: chatId })
         .then((resp) => {
            const msg = 'ConnectionClosed';
            const msgType = 'text'
            // console.log('selectedCustomer.socketId.ending....', resp?.data?.socketId)
            socket.emit("CLIENT-2", msgType + '@@@' + msg + '^^' + resp?.data?.socketId);
            put(`${properties?.CHAT_API}/end`, { chatId: chatId, message: message.toString(), messageFrom: "Chat" })
               .then((resp) => {
                  if (resp.status === 200) {
                     setNewCustomer([])
                     setNewChatPageCount(0)
                     //setNewCustomer(resp.data)    
                     customerQueue()
                     _.remove(connectedCustomer, { 'chatId': chatId })
                     //socket.disconnect();          
                     connectedCustomerByAgent();
                     //Select first customer as default 
                     if (connectedCustomer && connectedCustomer?.length > 0) {
                        setSelectedCustomer(connectedCustomer[0])
                     } else {
                        setSelectedCustomer(null)
                     }
                     setAssignedCustomerCount(assignedCustomerCount - 1)

                  } else {
                     toast.error("Failed to endChat - " + resp?.status);
                  }
               }).finally(hideSpinner);
         })

   }

   const sendtoCreateComplaint = () => {
      const customerInput = { "searchType": "QUICK_SEARCH", "customerQuickSearchInput": selectedCustomer?.contactNo, "filters": [], "source": "COMPLAINT" }
      post(`${properties?.CUSTOMER_API}/search?limit=10&page=0`, customerInput)
         .then((resp) => {
            if (resp?.data) {
               if (resp?.status === 200) {

                  let data = {
                     serviceNo: resp?.data?.rows&&resp?.data?.rows[0]?.accessNbr,
                     accessNumber: resp?.data?.rows&&resp?.data?.rows[0]?.accessNbr,
                     //sourceName: "customer360",      
                     accountId: resp?.data?.rows&&resp?.data?.rows[0]?.accountId,
                     customerId: resp?.data?.rows&&resp?.data?.rows[0]?.customerId,
                     serviceId: resp?.data?.rows&&resp?.data?.rows[0]?.serviceId,
                     accountNo: resp?.data?.rows&&resp?.data?.rows[0]?.accountNo,
                     accountName: resp?.data?.rows&&resp?.data?.rows[0]?.accountName,
                     accountContactNo: resp?.data?.rows&&resp?.data?.rows[0]?.accountContactNo,
                     accountEmail: resp?.data?.rows&&resp?.data?.rows[0]?.accountEmail,
                     serviceType: resp?.data?.rows&&resp?.data?.rows[0]?.prodType,
                     accessNumber: resp?.data?.rows&&resp?.data?.rows[0]?.accessNbr,
                     type: 'Complaint',
                     liveChat: "FROM_LIVE_CHAT"
                  };

                  props.history.push(
                     `${process.env.REACT_APP_BASE}/create-complaint`, { data }
                  );
               }
               else {
                  toast.error("Failed to get the customer search - " + resp?.status);
               }
            }
            else {
               toast.error("Uexpected error ocurred " + resp?.statusCode);
            }
         })
   };

   const sendtoCreateInquiry = async () => {
      let data = {}
      if (selectedCustomer?.customerInfo && selectedCustomer?.customerName) {
         const customerInput = { "searchType": "QUICK_SEARCH", "customerQuickSearchInput": selectedCustomer?.contactNo, "filters": [], "source": "COMPLAINT" }
         await post(`${properties?.CUSTOMER_API}/search?limit=10&page=0`, customerInput)
            .then((resp) => {
               if (resp.data) {
                  if (resp.status === 200) {
                     data = {
                        serviceNo: resp?.data?.rows&&resp?.data?.rows[0]?.accessNbr,
                        accessNumber: resp?.data?.rows&&resp?.data?.rows[0]?.accessNbr,
                        sourceName: "customer360",
                        liveChat: "FROM_LIVE_CHAT"
                     };
                  }
               }
            })
      }
      else {
         data = {
            serviceNo: selectedCustomer?.contactNo,
            accessNumber: selectedCustomer?.contactNo,
            sourceName: "fromDashboard",
            liveChat: "FROM_LIVE_CHAT"
         };
      }
      props.history.push(
         `${process?.env?.REACT_APP_BASE}/create-inquiry-new-customer`,
         { data }
      );
   };

   return (
      <div className="content-page">
         <div className="content">
            <div className="container-fluid">
               <audio className="message-notification">
                  <source src={boopSfx} type="audio/mpeg" >
                  </source>
               </audio>
               <div className="card-box p-0 border">
                  <div className="card-body chat-page">
                     <div className="row">
                        <div className="col-md-6 col-lg-3">
                           <div className="col-letf section1">
                              <h2>
                                 Chat Queue
                              </h2>
                              <Tabs>
                                 <TabList style={{ display: "none" }}>
                                    <Tab style={{ display: "none" }}></Tab>
                                 </TabList>
                                 <TabPanel defaultIndex={2} onScroll={handleOnScroll} style={{ maxHeight: "515px" }} className="border-grey">
                                    <div className="list-user chat-queue">
                                       {
                                          newCustomer&&newCustomer?.length>0 ? newCustomer?.map((data) => (
                                             <div className="user-section clearfix" key={data?.chatId}>
                                                <div className="user-left">
                                                   <div className="avatar-area">
                                                      <img className="avatar-icon" src={Avatar1} alt="..." />
                                                   </div>
                                                   <div className="user-data">

                                                      <p style={{ wordWrap: "break-word" }}>CT-00{data?.chatId} - {data?.category}</p>

                                                      <p style={{ wordWrap: "break-word" }}>{data?.customerName}</p>

                                                      <p style={{ wordWrap: "break-word" }}>{data?.emailId}</p>

                                                      <p>{data?.contactNo}</p>

                                                      <p className="channel"><span>Channel:</span> Chat Bot
                                                         <br />
                                                         <br /><span>Language:</span> {data?.chatLanguage}
                                                      </ p>                                                      <br /><br />
                                                      <div className="user-right">
                                                         <button type="button" onClick={(e) => assignCustomer(data?.chatId)} className="btn btn-primary btn-sm waves-effect waves-light">Assign</button>
                                                      </div>
                                                   </div>
                                                </div>

                                             </div>
                                          ))
                                             : ""
                                       }
                                    </div>
                                 </TabPanel>
                              </Tabs>
                           </div>
                        </div>

                        <div className="col-md-6 col-lg-3 cursor-pointer">
                           <div className="col-letf section2">
                              <h2>Connected Users</h2>
                              <div className="list-user bg-white" style={{ maxHeight: "653px", border: "1px solid #ccc", overflowY: "auto" }}>
                                 <span className="errormsg"><b>{assignedCustomerCount > maxChatCount ? `Agent cannot assign more than ${maxChatCount} users` : ""}</b></span>
                                 {
                                    connectedCustomer && connectedCustomer?.length>0 ? connectedCustomer?.map((data) => (
                                       <div className={`user-section clearfix ${Number(data?.chatId) === Number(selectedCustomer?.chatId) ? "bg-secondary" : "bg-white"}`} key={data?.chatId} onClick={(e) => selectCustomer(data.chatId)} >
                                          <div className="user-left">
                                             <div className="avatar-area"><img className="avatar-icon" src={Avatar2} alt="..." /></div>
                                             <div className="user-data">
                                                <p style={{ wordWrap: "break-word" }}>CT-00{data?.chatId} - {data?.category}</p>
                                                <p style={{ wordWrap: "break-word" }}>{data?.customerName}</p>
                                                <p style={{ wordWrap: "break-word" }}>{data?.emailId}</p>
                                                <p>{data?.contactNo}</p>
                                                <p className="channel"><span>Channel:</span> Chat Bot
                                                   <br />
                                                   <br /><span>Language:</span> {data?.chatLanguage}
                                                </ p>                                                      <br /><br />
                                                <div className="user-right">
                                                   <button type="button" onClick={(e) => endChat(data?.chatId, data?.message, data?.messageColorAlign)} className="btn btn-primary btn-sm waves-effect waves-light">End Chat</button>
                                                </div>
                                             </div>
                                          </div>

                                       </div>
                                    ))
                                       : ""
                                 }
                              </div>
                           </div>
                        </div>

                        <div className="cus-ct col-md-6">
                           {
                              selectedCustomer && selectedCustomer?.message ? (
                                 <div id={selectedCustomer?.chatId} style={{ visibility: "visible" }}>
                                    <div className="col-letf section3 clearfix" >
                                       <h2>CT-00{selectedCustomer?.chatId} - {selectedCustomer?.category}</h2>
                                       <div className="fname">
                                          <div className="user-stat-left pr-1">Customer Name: </div>{selectedCustomer?.customerName}
                                       </div>
                                       <div className="cus-type user-status clearfix">
                                          <div className="user-stat-left">Customer Type:</div>
                                          <div className="user-stat-right">{selectedCustomer?.customerInfo && selectedCustomer?.customerInfo?.customerSummary?.return?.accountSummary?.accountFinancialItem?.basicCollectionPlanCode == 'RES1' ? 'Residential' : selectedCustomer?.customerInfo?.customerSummary?.return?.accountSummary?.accountFinancialItem?.basicCollectionPlanCode == 'BUS1' ? "Business" : ''}</div>
                                       </div>

                                       <div className="user-status clearfix ">
                                          <div className="row">
                                             <div className="col-md-9">
                                                <div className="user-stat-left pr-1">Email:</div><span style={{ wordWrap: "break-word" }}>{selectedCustomer?.emailId ? selectedCustomer?.emailId : ''}</span>
                                             </div>
                                             <div className="col-md-3">
                                                <div className="user-stat-left pr-1">Contact:</div><span style={{ wordWrap: "break-word" }}>{selectedCustomer?.contactNo ? selectedCustomer?.contactNo : ''}</span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="user-status clearfix ">
                                          <div className="row">
                                             <div className="col-md-9">
                                                <div className="user-stat-left pr-1">Plan Name:</div><span style={{ wordWrap: "break-word" }}>{selectedCustomer?.identifier == 'Prepaid' ? prepaidTarrifNameDetails : selectedCustomer?.identifier == 'Postpaid' ? postpaidTarrifNameDetails : selectedCustomer?.identifier == 'Fixedline' ? fixedLineTarrifNameDetails : ''}</span>
                                             </div>
                                             <div className="col-md-3">
                                                <div className="user-stat-left pr-1">ID Value:</div> <span style={{ wordWrap: "break-word" }}>{selectedCustomer?.customerInfo && selectedCustomer?.customerInfo?.customerSummary?.return?.accountSummary?.identificationFields?.id3Value}</span>
                                             </div>
                                          </div>
                                       </div>


                                       <div className="user-detail1">
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Customer Status:</div>
                                             <div className="user-stat-right">{selectedCustomer?.customerInfo && selectedCustomer?.customerInfo?.customerSummary?.return?.customerStatus}</div>
                                          </div>
                                          {/* <div className="user-status clearfix">
                                             <div className="user-stat-left">Plan Name:</div>
                                             <div className="user-stat-right" style={{ wordWrap: "break-word" }}>
                                             {selectedCustomer?.identifier == 'Prepaid' ? prepaidTarrifNameDetails : selectedCustomer?.identifier == 'Postpaid' ? postpaidTarrifNameDetails : selectedCustomer?.identifier == 'Fixedline' ? fixedLineTarrifNameDetails : ''}</div>
                                          </div> */}
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Data Balance(GB):</div>
                                             <div className="user-stat-right">{selectedCustomer?.identifier == 'Prepaid' ? Number(totalPrepaidData).toFixed(2) : selectedCustomer?.identifier == 'Postpaid' ? 'NA' : selectedCustomer?.identifier == 'Fixedline' ? Number(dataBalance).toFixed(2) : ''}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Bill Amount(BND):</div>
                                             <div className="user-stat-right">{selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.billAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ? selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e.billDate && moment(e?.billDate && e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.billAmount).toFixed(2) : 'NA'}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Bill Status:</div>
                                             <div className="user-stat-right">{selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && latestMonthPostpaidData[0]?.billStatus : selectedCustomer?.identifier == 'Fixedline' ?
                                                selectedCustomer?.customerInfo.serviceStatus?.fixedLine?.billingDetails && selectedCustomer?.customerInfo.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && e?.billDate && moment(e.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.billStatus : 'NA'}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Unpaid Amount(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.unpaidAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && e.billDate && moment(e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.unpaidAmount).toFixed(2) : 'NA'}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="user-detail1">
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Access Number:</div>
                                             <div className="user-stat-right">{selectedCustomer?.contactNo}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Account Status:</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.customerInfo?.customerSummary?.return?.accountStatus}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">OS Amount(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? Number(selectedCustomer?.customerInfo?.serviceStatus?.mobile?.postpaid?.outstandingAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.outstandingAmount).toFixed(2) : 'NA'}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Bill Date:</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && moment(latestMonthPostpaidData[0]?.billDate).format('D-MM-YYYY') : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && moment(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && moment(e.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.billDate).format('D-MM-YYYY') : 'NA'}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Paid Amount(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.paidAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && e.billDate && moment(e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.paidAmount).toFixed(2) : 'NA'}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Dispute Amount(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.disputeAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && e.billDate && moment(e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.disputeAmount).toFixed(2) : 'NA'}
                                             </div>
                                          </div>
                                       </div>
                                       <div className="user-detail1">
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Service Type:</div>
                                             <div className="user-stat-right">{selectedCustomer?.customerInfo && (selectedCustomer?.identifier) ? selectedCustomer?.customerInfo?.serviceStatus?.mobile?.subscriberType || 'FIXEDLINE' : 'NA'}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Service Status:</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? selectedCustomer?.customerInfo?.serviceStatus?.mobile?.subscriberStatus : selectedCustomer?.identifier == 'Postpaid' ? selectedCustomer?.customerInfo?.serviceStatus?.mobile?.subscriberStatus : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.status : 'NA'}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Main balance(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? selectedCustomer?.customerInfo?.serviceStatus?.mobile?.prepaid?.balance && Number(selectedCustomer?.customerInfo?.serviceStatus?.mobile?.prepaid?.balance?.filter((e) => e?.balanceType == 'MainBalance')[0]?.value).toFixed(2) : selectedCustomer?.identifier == 'Postpaid' ? 'NA' :
                                                   'NA'}</div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Due Date:</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && moment(latestMonthPostpaidData[0]?.dueDate).format('D-MM-YYYY') : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && moment(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && moment(e?.billDate.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.dueDate).format('D-MM-YYYY') : 'NA'}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Paid Date:</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.paidAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails.filter((e) => e?.billDate && moment(e.billDate?.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.paidAmount).toFixed(2) : 'NA'}
                                             </div>
                                          </div>
                                          <div className="user-status clearfix">
                                             <div className="user-stat-left">Refund Amount(BND):</div>
                                             <div className="user-stat-right">
                                                {selectedCustomer?.identifier == 'Prepaid' ? 'NA' : selectedCustomer?.identifier == 'Postpaid' ? latestMonthPostpaidData && Number(latestMonthPostpaidData[0]?.refundAmount).toFixed(2) : selectedCustomer?.identifier == 'Fixedline' ?
                                                   selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails && Number(selectedCustomer?.customerInfo?.serviceStatus?.fixedLine?.billingDetails?.filter((e) => e?.billDate && moment(e.billDate?.split('T')[0]).format('YYYY/MM/D') == latestMonthFixedLineData)[0]?.refundAmount).toFixed(2) : 'NA'}
                                             </div>
                                          </div>
                                       </div>

                                    </div>
                                    <div className="ps-container ps-theme-default ps-active-y pb-4" id="chat-content" style={{ height: "400px !important" }}>
                                       <div className="media media-chat">
                                          <div className="media-body" style={{ whiteSpace: "pre-line", width: "100%" }}>
                                             {
                                                connectedCustomer && connectedCustomer?.length>0 ? connectedCustomer.map((element, index) => (
                                                   selectedCustomer?.chatId === element?.chatId ?
                                                      <>
                                                         {
                                                            element?.message&&element?.message?.length>0&&element?.message.map((value, index) => {

                                                               return <div style={{ width: "100%", display: "inline-block" }}>
                                                                  <div style={{ float: element?.messageColorAlign[index]?.textAlign }}>
                                                                     {/* <li  style={{ listStyleType:"none", backgroundColor: element.messageColorAlign[index].bgColor, textAlign:"left",  borderRadius:"50px", padding:"12px 38px"  }} key={index} className="chat-box">{value}</li> */}
                                                                     {value && value.split('@@@')[0] === 'text' ?
                                                                        <p style={{ listStyleType: "none", backgroundColor: element?.messageColorAlign[index]?.bgColor, textAlign: "left", borderRadius: "50px", padding: "12px 38px" }} key={index} className="message-content">
                                                                           {value && value?.split('@@@')[1]}</p>
                                                                        :
                                                                        value && value?.split('@@@')[0] === 'media' && value?.split('@@@')[1].split(';')[0] != "data:application/pdf" ?

                                                                           <div className="download-col">
                                                                              <ul>
                                                                                 <li style={{ listStyleType: "none", backgroundColor: element?.messageColorAlign[index]?.bgColor, textAlign: "left", borderRadius: "50px", padding: "12px 38px" }}>
                                                                                    <div className="image-download-col">
                                                                                    </div>
                                                                                 </li>
                                                                              </ul>
                                                                           </div> :
                                                                           <div className="download-col">
                                                                              <ul>
                                                                                 <li>
                                                                                    <div className="image-download-col">
                                                                                    </div>
                                                                                 </li>
                                                                              </ul>
                                                                           </div>
                                                                     }
                                                                  </div>
                                                               </div>
                                                            })
                                                         }
                                                         <div ref={chatRef} />
                                                      </>
                                                      :
                                                      ""
                                                )) : ""
                                             }
                                          </div>
                                       </div>
                                       <div className="ps-scrollbar-x-rail" style={{ left: "0px", bottom: "0px" }}>
                                          <div className="ps-scrollbar-x" tabIndex="0" style={{ left: "0px", bottom: "0px" }}></div>
                                       </div>
                                       <div className="ps-scrollbar-y-rail" style={{ top: "0px", height: "0px", right: "2px" }}>
                                          <div className="ps-scrollbar-y" tabIndex="0" style={{ top: "0px", height: "0px", right: "2px" }}></div>
                                       </div>
                                    </div>
                                    <div className="publisher bt-1 border-grey">
                                       <img className="avatar-icon avatar-icon-icon-xs" src="https://img.icons8.com/color/36/000000/administrator-male.png" alt="..." />
                                       <textarea cols="50" rows="1" className="publisher-input" placeholder="Write something"
                                          value={message || ''}
                                          onChange={(e) => {
                                             setMessage(e?.target?.value);
                                          }}
                                       />

                                       <div className="chat-buttons clearfix">
                                          <button type="button" className="btn btn-primary btn-sm waves-effect waves-light" onClick={handleSendMessage}><i className="fa fa-paper-plane"></i></button>
                                          {
                                             selectedCustomer?.customerInfo && selectedCustomer?.customerName ? (
                                                <button type="button" className="btn btn-primary btn-sm waves-effect waves-light" onClick={(e) => sendtoCreateComplaint()}>Create Complaint</button>
                                             ) : ""
                                          }
                                          <button type="button" className="btn btn-primary btn-sm waves-effect waves-light" onClick={(e) => sendtoCreateInquiry()}>Create Inquiry</button>

                                       </div>
                                    </div>
                                 </div>
                              ) : ""
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
export default AgentChatBox;