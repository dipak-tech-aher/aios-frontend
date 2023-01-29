import React, { useState, useEffect, useContext, useRef } from 'react';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import { AgentChatListColumn } from './agentChatColumnHeader';
import { string, object } from "yup";
import { toast } from "react-toastify";
import { AppContext } from "../AppContext";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from 'moment'
import ChatHistoryModal from './ChatHistoryModal';
import { unstable_batchedUpdates } from 'react-dom';
import { formFilterObject } from '../util/util';

const ChatAgentListView = (props) => {

    const agentValidationSchema = object().shape({
        chatFromDate: string().required("Chat From date is required"),
        chatToDate: string().test(
            "Date",
            "Chat To date is required",
            (chatToDate) => (chatToDate !== "")
        ).test(
            "Date",
            "Chat To date should not be less than Chat from date",
            (chatToDate) => validateToDate(chatToDate)
        )
    });
    
    const validateToDate = (value) => {
        try {
            if (Date.parse(value) < Date.parse(searchParams.chatFromDate))
                return false;
            return true
        } catch (e) {
            return false
        }
    }

    const hideForm = props?.location?.data?.sourceName === 'card' ? true : false 
    const re = /^[0-9\b]+$/;
    const [error, setError] = useState({});
    const [tableRowData, setTableRowData] = useState([]);
    const { auth, setAuth } = useContext(AppContext);
    //const [fromPage, setFromPage] = useState('');
    const [exportBtn, setExportBtn] = useState(true);
    const [showChatHistoryModal,setShowChatHistoryModal] = useState(false)
    const [chatData,setChatData] = useState({})
    const [searchParams, setSearchParams] = useState({
        chatId: '',
        customerName: '',
        serviceNo: '',
        chatFromDate: '',
        chatToDate: '',
        status: '',
        agent: '',
        selfDept: ''
    });    
    const [isNormalSearch,setIsNormalSearch] = useState(true)
    const isFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const isTableFirstRender = useRef(true);
    const hasExternalSearch = useRef(false);
    const [listSearch, setListSearch] = useState([]);
    useEffect(() => {
        if(hideForm !== '' && hideForm !== null && hideForm !== undefined)
        {
            if(hideForm === true)
            {
                setIsNormalSearch(false)
                search()
                setExportBtn(false)
            }
            else
            {
                setIsNormalSearch(true)
            }
        }  
    },[hideForm, perPage, currentPage])

    useEffect(() => {
        if (!isFirstRender.current && hideForm === false) {
            search()
        }
        else {
            isFirstRender.current = false
        }
    }, [currentPage, perPage])

    // useEffect(() => {
    //     if(props?.location?.data !== undefined)
    //     {
    //         sessionStorage.setItem('sourceName',props?.location?.data?.sourceName || null)
    //     }
    //     let type = sessionStorage.getItem('sourceName')
    //     setFromPage(type)
    //     if(type && type === 'card')
    //     {
    //         search();
    //     }
    // },[props])
       

    const handleChatHistory = (data) => {
        setChatData(data)
        setShowChatHistoryModal(true)
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Action") {
            if(row?.original?.status === 'CLOSED'){
                
                return (                    
                    <>
                        <button type="button" className="btn btn-primary btn-sm waves-effect waves-light" onClick={() => handleChatHistory(row?.original)}>View</button>			
                    </>    
                )
            }
            else{
                return (<></>)
            }
        }
        else if(cell.column.Header === "Status")
        {
            return (<span>{cell.value === 'NEW' ? 'New' : cell.value === 'ASSIGNED' ? 'Assigned' : cell.value === 'CLOSED' ? 'Closed' : cell.value === 'ABANDONED' ? 'Abandoned' : '-'}</span>)
        }
        else if (["Start Date Time","End Date Time"].includes(cell.column.Header))
        {
            return (<span>{cell.value ? moment(cell.value).format('DD MMM YYYY hh:mm:ss A') : "-"}</span>)
        }
        else if (["Agent Name"].includes(cell.column.Header))
        {
            return (<span>{cell.value ? cell.value : "-"}</span>)
        }  
        else if (["Access Number"].includes(cell.column.Header))
        {
            return (<span>{cell.value && cell.value !== "0" ? cell.value : ""}</span>)
        }  
        else if (["Contact Number"].includes(cell.column.Header))
        {
            return (<span>{cell.value && cell.value !== 0 ? cell.value : ""}</span>)
        } 
        return (<span>{cell.value}</span>)
    }      
  
    const search = (fromCallback = false) => {
        let error;
        // page call from Dashboard
        if(props?.location?.data?.sourceName && props?.location?.data?.sourceName === "card")
        {
            let startDate = props?.location?.data?.dateRange?.startDate.split("-")
            let endDate = props?.location?.data?.dateRange?.endDate.split("-")
            searchParams.status = props.location.data.status
            searchParams.agent = props.location.data.agent
            searchParams.selfDept = props.location.data.selfDept
            searchParams.chatFromDate = startDate.reverse().join("-")
            searchParams.chatToDate = endDate.reverse().join("-")
        }
        else
        {  //page call from menu
            if(searchParams.chatId === "" && searchParams.customerName === "" && searchParams.serviceNo === "")
            {
                error = validate(agentValidationSchema, searchParams);
                if (error) {
                    toast.error("Validation errors found. Please check highlighted fields");
                    return false;
                }
            }
        }
        let requestBody = {
            ...searchParams,
            filters: formFilterObject(filters)
        }
        setListSearch(requestBody)
        if(searchParams.chatFromDate === '' || searchParams.chatToDate === '')
        {
            requestBody.chatToDate = null
            requestBody.chatFromDate = null
        }
        if (!error) {
            showSpinner();
            post(`${properties.CHAT_API}/search?limit=${perPage}&page=${fromCallback ? 0 : currentPage}`,requestBody)
            .then((response) => {
                if(response?.data?.rows?.length > 0)
                {
                    const { rows, count } = response?.data
                    setTotalCount(count)
                    setTableRowData(rows)
                    setError({})
                }
                else
                {
                    toast.error("No Records Found")
                    setTableRowData([])
                    setFilters([])
                }
            })
            .finally(hideSpinner)  
        }
    }

    const handleClear = () => {
        setSearchParams( {
            chatId: '',
            customerName: '',
            serviceNo: '',
            chatFromDate: '',
            chatToDate: '',
            status: '',
            agent: '',
            selfDept: ''
        });
        setFilters([])
        setTableRowData([]);
    }

    const validate = () => {
        try {
            agentValidationSchema.validateSync(searchParams, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    const handlePageSelect = (pageNo) => {
        //isFirstRender.current = false
        setCurrentPage(pageNo)
    }

    const handleSubmit = (e) => {
        if(e)
        {
            e.preventDefault();
            //isFirstRender.current = false
            isTableFirstRender.current = true;
            unstable_batchedUpdates(() => {
                setFilters([])
                setCurrentPage((currentPage) => {
                    if (currentPage === 0) {
                        return '0'
                    }
                    return 0
                });
            })
        }
        else
        {
            search(true)
        }
    }

    const exportToCSV = () => {

        const fileName = `AIOS_ChatAgent_${moment(new Date()).format('DD MMM YYYY')}`
        const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        const fileExtension = ".xlsx";
        let tableData = [];
        tableRowData.forEach(element => {
            let objConstruct = {
                "Chat ID": element?.chatId,
                "Customer Name": element?.customerName,
                "Chat Category": element?.category,
                "Access Number": element?.accessNo,
                "Contact Number": element?.contactNo,
                "Email ID": element?.emailId,
                "ID Value": element?.idValue,
                "Start Date Time":  element?.startAt ? moment(element?.startAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                "End Date Time": element?.startAt ? moment(element?.endAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                "Status": element?.status,
                "Agent Name": element?.agentName &&  element?.agentName ? element?.agentName : "-"
            }
            tableData.push(objConstruct);
        })
        
        if (tableData.length !== 0) {
            const ws = XLSX.utils.json_to_sheet(tableData,
            {
                origin: 'A2',                 
                skipHeader: false            
            });
            const wb = {
                Sheets: { data: ws },
                SheetNames: ["data"]
            };

            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });
            const data = new Blob(
                [excelBuffer], { type: fileType }
            );
            FileSaver.saveAs(data, fileName + fileExtension);
        }
    };


    return (
        <div className="row mt-1">
          <div className="col-lg-12">
                <div className="page-title-box">
                    <h4 className="page-title">Chat Agent View</h4>
                </div>
                <div className="search-result-box m-t-30 card-box">
                {
                    isNormalSearch &&        
                    <div id="searchBlock" className="modal-body p-2">
                        <div className="row">
                            <div className="col-md-4" >
                            <div className="form-group">
                                <label htmlFor="field-1" className="control-label">Chat ID</label>
                                <input type="text" className="form-control" id="field-1" value={searchParams.chatId || ''}
                                onChange={(e) =>       
                                    setSearchParams({...searchParams, chatId: re.test(e.target.value) ? e.target.value : ''})   
                                }
                                placeholder="Enter Chat ID"
                                />
                            </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="field-2" className="control-label" >Customer Name</label>
                                    <input type="text" className="form-control" id="field-2" value={searchParams.customerName || ''}
                                    onChange={(e) => setSearchParams({...searchParams, customerName: e.target.value})}
                                    placeholder="Enter Customer Name"
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="field-3" className="control-label" >Access Number</label>
                                    <input type="text" className="form-control" id="field-3" value={searchParams.serviceNo || ''}
                                    onChange={(e) => setSearchParams({...searchParams, serviceNo: e.target.value})}
                                    placeholder="Enter Access Number" maxLength = "15"
                                    />
                                </div>
                            </div>     
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="chatFromDate" className="control-label" >Chat From Date</label>
                                    <input className="form-control" id="chatFromDate" type="date"
                                    max={new Date().toISOString().slice(0, 10)}
                                    value={searchParams.chatFromDate}  name="chatFromDate"
                                    onChange={(e) => {
                                        setError({ ...error, chatFromDate: '' })
                                        setSearchParams({...searchParams, chatFromDate: e.target.value})
                                    }
                                    }
                                    placeholder="Enter Chat Date From"
                                    />
                                <span className="errormsg">{error.chatFromDate ? error.chatFromDate : ""}</span>
                                </div>
                            </div>  
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="chatToDate" className="control-label" >Chat To Date</label>
                                    <input className="form-control" id="chatToDate" type="date"
                                    max={new Date().toISOString().slice(0, 10)}
                                    value={searchParams.chatToDate}  name="chatToDate"
                                    onChange={(e) => {
                                    setError({ ...error, chatToDate: '' })
                                    setSearchParams({...searchParams, chatToDate: e.target.value})}} 
                                    placeholder="Enter Chat To Date"
                                    />
                                    <span className="errormsg">{error.chatToDate ? error.chatToDate : ""}</span>
                                </div>
                            </div>                           
                        </div>                    
                        <div className="row" >
                            <div className="col-md-12">
                                <div className="pt-1 pb-1">
                                    <div className="text-center" >
                                        <button type="button" className="btn waves-effect waves-light btn-primary" onClick={(e) => handleSubmit(e)}>
                                            Search
                                        </button>
                                        &nbsp;&nbsp;
                                        <button type="button" className="btn waves-effect waves-light btn-secondary" onClick={() => handleClear()}>Clear</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }                      
                <div className="row mt-2 pr-2">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">                                 
                                {
                                !!tableRowData.length &&  
                                    <>
                                        {/* <div className="text-left" >
                                            <button type="button" className="btn waves-effect waves-light btn-primary" onClick={() => exportToCSV()}>
                                                Export To Excel
                                            </button>                                    
                                        </div>  
                                        &nbsp;&nbsp; */}
                                        <DynamicTable
                                            listKey={"ChatAgent"}
                                            row={tableRowData}
                                            rowCount={totalCount}
                                            listSearch={listSearch}
                                            itemsPerPage={perPage}
                                            backendPaging={true}
                                            backendCurrentPage={currentPage}
                                            isTableFirstRender={isTableFirstRender}
                                            hasExternalSearch={hasExternalSearch}
                                            header={AgentChatListColumn}
                                            exportBtn={exportBtn}
                                            handler={{
                                                handleCellRender: handleCellRender,
                                                handlePageSelect: handlePageSelect,
                                                handleItemPerPage: setPerPage,
                                                handleCurrentPage: setCurrentPage,
                                                handleFilters: setFilters,
                                                handleExportButton: setExportBtn
                                            }}
                                        />
                                    </>
                                }
                            </div>
                        </div>
                        {
                            showChatHistoryModal && 
                            <ChatHistoryModal
                                data = {{
                                    isOpen: showChatHistoryModal,
                                    chatData: chatData
                                }}
                                handler = {{
                                    setIsOpen: setShowChatHistoryModal
                                }}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
export default ChatAgentListView;