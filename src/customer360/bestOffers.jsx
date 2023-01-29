import React, { useEffect, useState } from 'react';
import { get } from "../util/restUtil";
import { properties } from "../properties";
import { hideSpinner, showSpinner } from '../common/spinner';
import { formatISODateDDMMMYY } from '../util/dateUtil';

const GetBestOffer = (props) => {

    const [campaignData, setCampaignData] = useState()                        
    let activeService = props.data.activeService;
    
    useEffect(() => {
        if (activeService && activeService !==undefined && activeService!==null) {
            showSpinner()     
            get(properties.CAMPAIGN_API + '/accessnumber/' + activeService)
                .then((resp) => {
                    if (resp && resp.status === 200 && resp.data) {
                            //charge
                            setCampaignData(resp);                           
                    } 
                }).catch((error) => {
                    console.log("No Campaings found",error)
                })
                .finally(hideSpinner)
        }
        
    },[activeService]);

    return (
        <>
            <div class="accordion custom-accordion" id="custom-accordion-one">
                <div className="card mt-1 border">
                    <div class="card-header" id="headingFive">
                        <h5 class="m-0 position-relative">
                            <a class="custom-accordion-title text-reset collapsed d-block"
                                data-toggle="collapse" href="#collapseFive"
                                aria-expanded="false" aria-controls="collapseFive"
                            >
                                Offers
                                <i class="mdi mdi-chevron-down accordion-arrow"></i>
                            </a>
                        </h5>
                    </div>
                    {
                        <div id="collapseFive" className="collapse show" aria-labelledby="headingFive" data-parent="#custom-accordion-one">											
                            <div className="card-body p-0" >
                                <div>
                                    <div className="card border p-2">      
                                    {
                                        (campaignData && campaignData.data.length > 0) ?
                                            campaignData.data.map((val,k)=> (
                                            <div className="card border p-1"><h5>{val.camp_name}</h5>
                                                <ul>
                                                    <li className="cmp-desc"><p className="mb-1">{val.camp_description}</p></li> 
                                                    <li><p className="m-0">Valid From : {formatISODateDDMMMYY(val.valid_from)}</p></li>  
                                                    <li><p className="m-0">Valid Till : {formatISODateDDMMMYY(val.valid_to)}</p></li>
                                                    {/* <li><p className="m-0">Charge : {val.charge}</p></li>                                        */}
                                                </ul>
                                            </div>
                                        ))
                                        :   
                                        <h5>No Best Offers Available</h5>                          
                            
                                    }               
                                    </div>
                                </div>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </>
    )
}


export default GetBestOffer;