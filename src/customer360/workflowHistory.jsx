import React, { useEffect, useState } from 'react'
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { properties } from '../properties'
import { formatISODateTime } from '../util/dateUtil';
import { get } from '../util/restUtil'
import { showSpinner, hideSpinner } from "../common/spinner";
const WorkflowHistory = (props) => {

    const [data, setData] = useState([])
    const [message,setMessage] = useState(false)
    let length = 0
    const [worflowDate,setWorflowDate] = useState()
    //let data = []
    const { workFlowData, isOpen, setIsOpen } = props
    const customStyles = {
        content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '85%',
            maxHeight: '100%'
        }
    };
    useEffect(() => {
        let date = formatISODateTime(workFlowData.createdAt);
        setWorflowDate(date)
        {/*for testing we can specify value as 208 641, 636 to test all cases*/ }
        showSpinner()
        get(properties.CUSTOMER_API + "/interaction/" + workFlowData.intxnId)
            .then((resp) => {
                if (resp.data.length > 0) {
                    length = resp.data.length
                    setData([...resp.data])
                    setMessage(false)
                    //toast.success("Fetched workflow history successfully")
                    //data = resp.data
                }
                else {
                    //toast.error("No Workflow History")
                    setMessage(true)
                }
            })
            .catch((error) => {
                toast.error("Error while fetching data")
            })
            .finally(hideSpinner)
        length = data.length
    }, [])

    return (

        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Worflow History Modal" style={customStyles}>
            {/* <div className="modal fade" tabindex="-1" role="dialog" aria-hidden="true"> */}
            <div className="modal-dialog" style={{ maxWidth: "100%", margin: "0", maxHeight: "500px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myCenterModalLabel">Service Request Workflow History</h4>
                        <button type="button" className="close" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className="modal-body work-flow">
                        
                                <div className="task-blocks row" style={{ paddingLeft: "100px" }}>
                                    <div className="col-3 task-block1">
                                        <p className="text-justify" style={{ fontSize: "15px" }}><strong>Task Title</strong></p>
                                    </div>
                                    <div className="col-3 task-block2">
                                        <p className="text-justify" style={{ fontSize: "15px", paddingLeft: "40px" }}><strong>Status</strong></p>
                                    </div>
                                    <div className="col-5 task-block3">
                                        <p className="text-justify" style={{ fontSize: "15px" }}><strong>Remarks</strong></p>
                                    </div>
                                </div>
                       {
                           data.length > 0 ?
                           
                           
                        <div className="d-flex justify-content-start">
                            <ul className="events">
                                {
                                    data.map((task) => {
                                        length = length - 1;
                                        let date = formatISODateTime(task.updatedAt);
                                        return (
                                            <li>
                                                <div className="col-md-8"> 
                                                    {
                                                        task.taskId === 'CREATEBARUNBAR' ?
                                                                workFlowData.woType === "BAR" ?
                                                                <p><strong>Create Bar Cerillion</strong></p>
                                                                :
                                                                <p><strong>Create UnBar Cerillion</strong></p>
                                                            :
                                                        ""
                                                    }
                                                    {
                                                        task.taskId === 'PROCESSBARUNBAR'?
                                                                workFlowData.woType === "BAR"?
                                                                <p><strong>Process Bar</strong></p>
                                                                :
                                                                <p><strong>Process UnBar</strong></p>
                                                            :
                                                        ""  
                                                    }
                                                    {
                                                        task.taskId !== 'PROCESSBARUNBAR' && task.taskId !== 'CREATEBARUNBAR' &&
                                                                <p><strong>{task.taskIdLookup.description}</strong></p>
                                                    } 
                                                    
                                                </div>
                                                <div className="col-md-2">
                                                    <p><strong>{task.taskStatusLookup.description}</strong></p>
                                                </div>
                                                <time datetime="NEW"></time>
                                                <span className="line"></span>
                                                <div className="col-md-12">
                                                    {
                                                        task.status !== 'NEW' && <p className="text-justify"><strong>{date}</strong></p>
                                                    }
                                                    {
                                                        task.message !== null ?
                                                            <div className="badges">
                                                                <p className="badge badge-primary" style={{ fontSize: "12px" }}><strong>Portal</strong></p>
                                                            </div>
                                                            :
                                                            <></>
                                                    }
                                                    <p className="text-justify">{task.message !== null ? task.message : ''}</p>
                                                    {
                                                        task.payload !== null ?
                                                            task.payload.remarks !== null || task.payload.remarks ?
                                                                <div className="badges">
                                                                    <p className="badge badge-info" style={{ fontSize: "12px" }}><strong>Bots</strong></p>
                                                                </div>
                                                                :
                                                                <></>
                                                            :
                                                            ""
                                                    }
                                                    <p className="text-justify">
                                                        {
                                                            task.payload !== null ?
                                                                task.payload.remarks !== null || task.payload.remarks ?
                                                                    task.payload.remarks
                                                                    :
                                                                    ""
                                                                :
                                                                ""
                                                        }
                                                    </p>
                                                </div>
                                            </li>
                                        )
                                    })

                                }
                            </ul>
                        </div>
                        :
                        (message === true) &&
                        <div className="d-flex justify-content-start">
                            <ul className="events">
                                <li>
                                    <div className="col-md-8">
                                        {
                                            (workFlowData.woType === 'BAR' && workFlowData.currStatus === 'CLOSED') ?
                                                <p><strong>Create Bar</strong></p>
                                            :
                                            (workFlowData.woType === 'UNBAR' && workFlowData.currStatus === 'CLOSED') ?
                                            <p><strong>Create UnBar</strong></p>
                                                :
                                                <p><strong>{workFlowData.workOrderType.description} Task</strong></p>
                                        
                                        }
                                    </div>
                                    <div className="col-md-2">
                                        <p><strong>{workFlowData.currStatusDesc.description}</strong></p>
                                    </div>
                                    <time datetime="NEW"></time>
                                    <span className="line"></span>
                                    <div className="col-md-12">
                                    {
                                        workFlowData.currStatus !== 'NEW' && <p className="text-justify"><strong>{worflowDate}</strong></p>
                                    }
                                    {
                                            (workFlowData.woType === 'BAR' && workFlowData.currStatus === 'CLOSED') ?
                                            <p className="text-justify">Service Request ID {workFlowData.intxnId} to Bar connection completed successfully</p>
                                            :
                                            (workFlowData.woType === 'UNBAR' && workFlowData.currStatus === 'CLOSED') ?
                                            <p className="text-justify">Service Request ID {workFlowData.intxnId} to UnBar connection completed successfully</p>
                                                :
                                                <p className="text-justify">Service Request ID {workFlowData.intxnId} is in {workFlowData.currStatusDesc.description} status</p>
                                        
                                    }
                                    </div>
                                </li>
                            </ul>
                        </div>
                    }
                    </div>
                
                </div>
            </div>
        </Modal>
    );
}

export default WorkflowHistory;