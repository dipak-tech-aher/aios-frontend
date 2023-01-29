import React, { useState } from 'react'
import Modal from 'react-modal'
import { formatISODateTime } from '../util/dateUtil'
import StatusSwitch from "react-switch";
import { properties } from "../properties";
import { put } from "../util/restUtil";
import { showSpinner, hideSpinner } from "../common/spinner";

const NotificationModal = (props) => {

    const {data, isOpen, setIsOpen,getNotifications} = props
    const [switchStatus,setSwitchStatus] = useState(data.isViewed === "N" ? false : true)
    const customStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
        }
    };
    const switchChange = (e) => {
        setSwitchStatus(e)
        showSpinner()
        const requestBody = [data.notificationId]
        put(`${properties.NOTIFICATION_API}`, requestBody)
            .then(({ status }) => {
                if (status === 200) {
                    getNotifications();
                }
            }).finally(hideSpinner)
    }
    return(
        <>
            <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Worflow History Modal" style={customStyles}>
            <div className="modal-dialog" style={{ width: "900px", maxHeight: "400px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myCenterModalLabel">View Notification</h4>
                        <button type="button" className="close" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                        <hr/>
                    </div>
                    <div className="modal-body">
				        <div id="searchBlock" className="modal-body">
                            <div className="col-md-12 row pb-2">
						        <div className="col-md-8">
                                    <div className="form-group">
                                        <label className="control-label">Title</label>
                                            <p className="pt-1">{data.source} {data.referenceId}</p>
                                    </div>
							   </div>
							    <div className="col-md-4">
							        <div className="form-group">
                                        <label className="control-label">Published Date/Time</label>
                                        <p className="pt-1">{formatISODateTime(data.createdAt)}</p>
                                    </div>
							    </div>
                            </div>
                            <div className="col-md-12 pt-3 pb-3 bg-gray border">
                                <div className="form-group">
                                    <label className="control-label">Notification Message</label>
                                    <textarea disabled={true} className="form-control mb-2" rows="3" value={data.subject}></textarea>
                                </div>
                            </div>
						    <div className="col-md-12 pt-3 row" style={{display:'none'}}>
						        <div className="col-md-2 pt-1">Mark as {switchStatus === true ? "Unread" : "Read"}</div>
						        <div className="col-md-10">
                                    <div className="switchToggle ml-1">
                                        <StatusSwitch checked={switchStatus} onChange={(e) => switchChange(e)}/>
                                    </div>
						        </div>
						    </div>
                        </div>
					</div>
                    <div className="modal-footer d-flex mt-2 justify-content-center">
                        <button type="button" className="btn btn-secondary waves-effect waves-light mr-2" onClick={() => setIsOpen(false)}>Close</button>
					</div>
                </div>
            </div>
            </Modal>
        </>
    )
}

export default NotificationModal;