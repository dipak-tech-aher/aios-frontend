import React, { useEffect, useState } from 'react'
import { formatISODateTime } from '../../util/dateUtil';
import WFConfig from '../../wf/wfConfig'

const WFTaskStatusViewer = (props) => {

    const [taskList, setTaskList] = useState([])

    const [message, setMessage] = useState(false)

    const setIsTaskStatusOpen = props.handler.setIsTaskStatusOpen

    const { activityId, wfStatusData, stepConfig } = props.data

    useEffect(() => {

        console.log('wfStatusData', wfStatusData)

        let tList = []
        for (let step of stepConfig) {
            if (step.activityId === activityId) {
                for (let t of step.tasks) {
                    let found = false
                    for (let ts of wfStatusData.wfTxn) {
                        if (Number(ts.taskId) === Number(t.taskId)) {
                            tList.push({
                                taskName: t.taskName,
                                status: ts.wfTxnStatus,
                                statusDesc: ts.txnStatus.description,
                                updatedAt: formatISODateTime(ts.updatedAt),
                                message: 'Test Message'
                            })
                            found = true
                        }
                    }
                    if (!found) {
                        tList.push({
                            taskName: t.taskName,
                            status: 'NOT EXECUTED',
                            statusDesc: 'Not Executed',
                            updatedAt: 'NA',
                            message: 'Test Message'
                        })
                    }
                }
            }
        }
        if (tList.length > 0) {
            setTaskList(tList)
        }

    }, [])

    return (

        <div className="modal-dialog" style={{ maxWidth: "1142px", margin: "0", maxHeight: "500px" }}>
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title" id="myCenterModalLabel">Task Status Viewer</h4>
                    <button type="button" className="close" onClick={() => setIsTaskStatusOpen(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                {
                    taskList.length > 0 ?
                        <div className="modal-body">
                            <div className="row col-12 mb-1">
                                <div className="col-md-4">
                                    <strong>Task Title</strong>
                                </div>
                                <div className="col-md-3">
                                    <strong>Status</strong>
                                </div>
                                <div className="col-md-4">
                                    <strong>Remarks</strong>
                                </div>
                            </div>
                            <ul className="wf-status-viewer">
                                {
                                    taskList.map((task, idx) => {

                                        return (
                                            <li key={idx}>
                                                <div className="row col-12">
                                                    <div className="col-md-4">
                                                        <strong>{task.taskName}</strong>
                                                    </div>
                                                    <div className="col-md-3 pb-0">
                                                        <div className="d-flex flex-row" style={{height: '100%'}}>
                                                            <div><strong>{task.statusDesc}, {taskList.length}, {idx}</strong></div>
                                                            <div className="d-flex flex-column" style={{marginLeft: "50px", position: "relative", height: '100%'}}>
                                                                {
                                                                    (task.status === 'DONE') ?
                                                                        <div className="status-icon done"></div>
                                                                        :
                                                                        (task.status === 'USRWAIT') ?
                                                                            <i className="status-icon usrwait"></i>
                                                                            :
                                                                            (task.status === 'SYSWAIT') ?
                                                                                <i className="status-icon syswait"></i>
                                                                                :
                                                                                <i className="status-icon error"></i>
                                                                }
                                                                {
                                                                    ((taskList.length - 1) !== idx) ?
                                                                        (task.status === 'DONE') ?
                                                                            <div className="line done"></div>
                                                                            :
                                                                            (task.status === 'USRWAIT') ?
                                                                                <div className="line usrwait"></div>
                                                                                :
                                                                                (task.status === 'SYSWAIT') ?
                                                                                    <div className="line syswait"></div>
                                                                                    :
                                                                                    <div className="line error"></div>
                                                                        :
                                                                        <span></span>
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        {
                                                            task.status !== 'NEW' && <p className="text-justify"><strong>{task.updatedAt}</strong></p>
                                                        }
                                                        <p className="text-justify">{task.message !== null ? task.message : ''}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })

                                }
                            </ul>
                        </div>
                        :
                        message === true ?
                            <p className='row pt-4 d-flex justify-content-center bold' style={{ fontSize: "20px" }}>TBD</p>
                            :
                            ""
                }
            </div>
        </div>
    );
}

export default WFTaskStatusViewer;