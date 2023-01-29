import React, { useState } from "react";
import { hideSpinner, showSpinner } from '../../common/spinner'
import CreatedComplaintsCardModal from "../WhatsAppCardModals/CreatedComplaintsCardModal";

import { properties } from '../../properties';
import { post } from "../../util/restUtil";

const WhatsAppComplaintCard = (props) => {
    let { data } = props;
    const requestBody = data.requestBody
    data = data.data

    const [isOpen, setIsOpen] = useState(false)
    const [exportData, setExportData] = useState()
    const [whatsappCreatedComplaintsData, setWhatsappCreatedComplaintsData] = useState([])
    const [serviceType, setServiceType] = useState('All')
    const handlerOnClick = async (key, flag) => {
        if (key == 'Monthly Created Complaints On Whatsapp') {
            const payload = {
                startDate: requestBody.startDate,
                endDate: requestBody.endDate,
                flag: flag,
                flagOne: key
            }
            setServiceType(flag)
            await getCustomersDetails(payload);
            setExportData(payload)
            setIsOpen(true)
        }
    }

    const getCustomersDetails = async (payload) => {
        showSpinner();
        post(`${properties.WHATSAPP}/count-details`, payload).then(resp => {
            if (resp && resp.data) {
                setWhatsappCreatedComplaintsData(resp.data.rows)
            }
        }).finally(hideSpinner);
    }
    return (
        <div className="col-md-3 p-1">
            <div className="card">
                <div className="card-body">
                    <div className="media">
                        <div className="media-body overflow-hidden">
                            <h5 className="header-title">Customers' Created Complaint Via Whatsapp This Month</h5>
                            <h3 className="mb-0" style={{ cursor: "pointer" }} onClick={() => { handlerOnClick('Monthly Created Complaints On Whatsapp', 'All') }}>
                                {data?.total || 0}
                            </h3>
                        </div>
                        <div className="text-primary">
                            <i className="icon dripicons-message mr-1 noti-icon" aria-hidden="true"></i>
                        </div>
                    </div>
                </div>
                <div className="card-body border-top py-3">
                    <div className="row">
                        <div className="col-4">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">Fixed Line</p>
                                <h4 className="text-danger">
                                    <p className="cursor-pointer" onClick={() => { handlerOnClick('Monthly Created Complaints On Whatsapp', 'Fixed') }}>{data?.fixed || 0}</p>
                                </h4>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">Prepiad</p>
                                <h4 className="text-primary">
                                    <p className="cursor-pointer" onClick={() => { handlerOnClick('Monthly Created Complaints On Whatsapp', 'Prepaid') }}>{data?.prepaid || 0}</p>
                                </h4>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="text-center">
                                <p className="mb-2 text-truncate">Postpaid</p>
                                <h4 className="text-success">
                                    <p className="cursor-pointer" onClick={() => { handlerOnClick('Monthly Created Complaints On Whatsapp', 'Postpaid') }}>{data?.postpaid || 0}</p>
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && exportData && whatsappCreatedComplaintsData &&
                <CreatedComplaintsCardModal
                    data={{
                        isOpen,
                        whatsappCreatedComplaintsData,
                    exportData,
                    serviceType
                    }}
                    handler={{
                        setIsOpen,
                        setWhatsappCreatedComplaintsData
                    }}
                />}
        </div>
    )
}

export default WhatsAppComplaintCard;