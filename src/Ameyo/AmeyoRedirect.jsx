import React, {useContext, useEffect, useState, useRef } from 'react';
import { AppContext } from "../AppContext";
import { hideSpinner, showSpinner } from '../common/spinner';
import { properties } from '../properties';
import {  useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import CreateComplaintOrServiceRequest from './CreateComplaintOrServiceRequest';
import CreateEnquireNewCustomer from './createInquiryNewCustomer';
import { ameyoPost } from '../util/restUtil';


const AmeyoRedirect = (props) => {
    const history = useHistory();
    const qryString = new URLSearchParams(props.location.search);
    const [ticketType, setTicketType] = useState('REQCOMP');
    const phone=qryString.get("phone");
    const [searchInput, setSearchInput] = useState("");
    const [searchData, setSearchData] = useState({});

    const accessToken= localStorage.getItem("accessToken")
    
    useEffect(()=>{
        if (!accessToken && accessToken === '') {
            history.push(`${process.env.REACT_APP_BASE}/}`);
          }
    },[accessToken])
    let requestParam={};

    const handleSearch = () => {
        //e.preventDefault();
        console.log(searchInput)
        if (searchInput === undefined || searchInput === "") {
            toast.error("Please enter a value to Search");
        } else {
            requestParam = {
                searchType: 'QUICK_SEARCH',
                customerQuickSearchInput: searchInput,
                source: "COMPLAINT",
                filters:[]
            }
            showSpinner();
           ameyoPost(properties.CUSTOMER_API + "/search?limit=10&page=0", requestParam, accessToken).then((resp) => {
            if (resp) {
                if (resp.status === 200) {
                    if (resp.data.length === 0) {
                        toast.error("No search results available for the given search input");
                    }
                    else {                        
                        setSearchData(resp.data.rows[0])                      
                    }
                } else {
                    toast.error("Uexpected error during customer search - " + resp.status + ', ' + resp.message);
                }
            } else {
                toast.error("Records Not Found");                
            }
           }).finally(() => {
            //setSearchInput("");
            hideSpinner();
        });
                                 
                                        
        }
    } 

    const [suggestion, setSuggestion] = useState(false)
    
    const handleTicketTypeChange = (e) => {
        const { target } = e;
        let value=null;
        if(target.id === 'radio1'){
            value='REQCOMP'
        }
        else if(target.id === 'radio3'){
            value='REQSR'
        }
        else{
            value='REQINQ'
        }
        setTicketType(value);
        
    }

    return (
        <> 
            <div className="row">
                <div className="title-box col-12 p-0">
                    <section className="triangle">
                        <h4 className="pl-2" style={{ alignContent: 'left' }}>Create Ticket</h4>
                    </section>
                </div>
            </div>           
            <div className="pt-2 pr-2"> 
                <fieldset className="scheduler-border">
                    <div className="form-row">
                        <div className="col-12 pl-2 bg-light border">
                            <h5 className="text-primary">Select Ticket Type</h5>
                        </div>
                    </div>
                    <div className="d-flex flex-row pt-2">
                        <div className="col-md-2 pl-0">
                            <div className="form-group">
                                <div className="radio radio-primary mb-2">
                                    <input type="radio" id="radio1" className="form-check-input" name="optCustomerType" 
                                        checked={ticketType === 'REQCOMP'} onChange={handleTicketTypeChange} />
                                    <label htmlFor="radio1">Complaint</label>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2 pl-0">
                            <div className="form-group">
                                <div className="radio radio-primary mb-2">
                                    <input type="radio" id="radio3" className="form-check-input" name="optCustomerType"
                                        checked={ticketType === 'REQSR'} onChange={handleTicketTypeChange} />
                                    <label htmlFor="radio3">Service Request</label>
                                </div>
                            </div>
                        </div>                      
                        <div className="col-md-2">
                            <div className="form-group">
                                <div className="radio radio-primary mb-2">
                                    <input type="radio" id="radio2" className="form-check-input" name="optCustomerType"
                                        checked={ticketType === 'REQINQ'} onChange={handleTicketTypeChange} />
                                    <label htmlFor="radio2">Inquiry</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </fieldset>             
                {  
                 (ticketType === 'REQCOMP'||ticketType === 'REQSR') ?    
                 <>                   
                            <form className="" >
                                <div className="form-row align-items-center">
                                    <div className="col-auto">
                                        <input
                                            type="text"
                                            style={{ width: "270px" }}
                                            className="form-control"
                                            autoFocus
                                            onChange={(e) => { setSearchInput(e.target.value);}}
                                            value={searchInput}
                                            required
                                            placeholder="Access Number"
                                            maxLength={15}
                                        />
                                    </div>
                                    <div className="col-auto">
                                        <button className="btn btn-primary" type="button" onClick={handleSearch}>Search</button>
                                    </div>                                   
                                </div>
                                </form>
                                <div className="row">
                                {ticketType === 'REQCOMP'?    
                                    <CreateComplaintOrServiceRequest location={{
                                        state: {
                                            data: searchData,
                                            type: 'Complaint'                                            
                                        }
                                    }} />
                                    :
                                    <CreateComplaintOrServiceRequest location={{
                                        state: {
                                            data: searchData,
                                            type: 'Service Request'                                            
                                        }
                                    }} />  
                                }
                                    </div>
                                </>                               
                                    :
                                    <CreateEnquireNewCustomer location={{
                                        state: {
                                            data: {
                                                
                                            }
                                        }
                                    }}/>
                            }                      
            </div>
        </>
    )
}

export default AmeyoRedirect;