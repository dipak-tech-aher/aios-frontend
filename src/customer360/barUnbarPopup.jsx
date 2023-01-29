import React, { useEffect, useRef, useState } from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import { get, put, post } from "../util/restUtil";
import { properties } from "../properties";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../common/spinner";
const BarUBarPopup = () => {
    let barRequestBody;
    let custId = sessionStorage.getItem("customerQuickSearchInput");
    let accountId = sessionStorage.getItem("custAccoutID")
    let serviceID = sessionStorage.getItem("custServiceID")
    const [show, setShow] = useState(false)
    const barUnBarlookupData = useRef({})
    //const unBarlookupData = useRef({})
    const [barlookUpData, setBarLookUpData] = useState([{}]);
    const [unBarLookUpData, setUnBarLookUpData] = useState([{}]);

    const [isBar, setBarCustomer] = useState({ barStatus: false })
    const [barData, setBarData] = useState({
        bar: "",
        barDesc: ""
    })
    const [unBarData, setUnBarData] = useState({
        unbar: "",
        unbarDesc: ""
    })

    //bar service called
    const handleBarService = () => {
        barRequestBody = {
            "customerId": custId,
            "accountId": accountId,
            "serviceId": serviceID
        }
        put(properties.BAR_SERVICE, barRequestBody)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("BAR SERVICE SUCCESSFULLY");
                        setBarCustomer({ ...isBar, barStatus: true });

                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);
                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);
                }
            }).finally(hideSpinner);
    }

    //unbar service called
    const handleUnBarService = () => {
        barRequestBody = {
            "customerId": custId,
            "accountId": accountId,
            "serviceId": serviceID
        }
        put(properties.UNBAR_SERVICE, barRequestBody)
            .then((resp) => {
                if (resp.data) {
                    if (resp.status === 200) {
                        toast.success("UNBAR SERVICE SUCCESSFULLY");
                        setBarCustomer({ ...isBar, barStatus: false });

                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);

                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);

                }
            }).finally(hideSpinner);
    }

    useEffect(() => {

        post(properties.BUSINESS_ENTITY_API, ['BAR_REASON',
            'UNBAR_REASON']).then((resp) => {

                if (resp.data) {
                    if (resp.status === 200) {
                        barUnBarlookupData.current = resp.data
                        //toast.success("get Customer called created successfully.");
                        //setData(resp.data);
                        setBarLookUpData(barUnBarlookupData.current['BAR_REASON'])
                        setUnBarLookUpData(barUnBarlookupData.current['UNBAR_REASON'])
                    } else {
                        toast.error("Failed to call get Customer - " + resp.status);

                    }
                } else {
                    toast.error("Uexpected error ocurred " + resp.statusCode);

                }
            }).finally(hideSpinner);


    }, [])
    const popover = (
        <Popover style={{ width: '70%', height: '25%' }} className="mt-2" id="popover-basic">
            <Popover.Title as="h3">
                Service Bar/UnBar Status
                <button type="button" rootClose className="close" style={{ width: '20', height: '20' }} aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </Popover.Title>
            <Popover.Content>
                <div>
                    {(!isBar.barStatus) ?
                        <select id="bar" value={barData.bar} className="form-control input-error"
                            onChange={e => {
                                setBarData({ ...barData, bar: e.target.value, barDesc: e.target.options[e.target.selectedIndex].label })
                            }
                            }>
                            {/* <option value="">Choose Category</option> */}
                            {
                                barlookUpData.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                        :
                        <select id="unbar" value={barData.bar} className="form-control input-error"
                            onChange={e => {
                                setUnBarData({ ...unBarData, unbar: e.target.value, unbarDesc: e.target.options[e.target.selectedIndex].label })
                            }
                            }>
                            {/* <option value="">Choose Category</option> */}
                            {
                                unBarLookUpData.map((e) => (
                                    <option key={e.code} value={e.code}>{e.description}</option>
                                ))
                            }
                        </select>
                    }
                </div>
                <div style={{ marginTop: '20px' }} className="text-center">
                    <Button className="mt-3 text-center float-left">Cancel</Button>
                    {(!isBar.barStatus) ?
                        <Button onClick={handleBarService} className="mt-3 text-center float-right">BAR</Button>
                        :
                        <Button onClick={handleUnBarService} className="mt-3 text-center float-right">UNBAR</Button>}

                </div>
            </Popover.Content>
        </Popover>
    );


    return (
        <div className="text-center">
            {/* Wrap in the trigger to get the target */}

            <OverlayTrigger rootClose trigger="click" placement="bottom" overlay={popover}>
                <Button onClick={() => setShow(true)} className="mt-3 text-center">
                    {(!isBar.barStatus) ?
                        "Activate" : "InActivate"}

                </Button>
            </OverlayTrigger>
        </div>

    );
};

export default BarUBarPopup;
