import React, { memo, useState } from 'react';
import Modal from 'react-modal';
import { formatISODateTime } from '../util/dateUtil';
import moment from 'moment';

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        maxHeight: '70%'
    }
};

const TicketHistory = memo((props) => {
    const { followUpHistory, workflowHistory, taskHistory, appointmentHistory, realTimeDetails, interactionData, taskHistoryMsg } = props.data;
    const { initialize } = props.handlers;
    const [isOpen, setIsOpen] = useState(false);

    const handleOnTaskRefresh = () => {
        initialize();
    }

    return (
        <>
            <div className="full-width-bg row">
                <section className="row triangle col-12">
                    <div className="col">
                        <h4 id="list-item-1">Workflow History</h4>
                    </div>
                    <div className={`col-auto m-auto assig-btn ${['service request'].includes(interactionData.type) && 'd-none'}`}>
                        <button type="button" className="btn btn-primary waves-effect waves-light btn-sm" onClick={() => setIsOpen(true)}>Followup History - {followUpHistory && followUpHistory.length}</button>
                    </div>
                </section>
            </div>
            <div className="col-12 p-2">
                <div className="timeline">
                    {
                        workflowHistory &&
                        workflowHistory.map((data, index) => {
                            return (
                                <div key={index} className="timeline-container primary">
                                    <div className="timeline-icon">
                                        {++index}
                                    </div>
                                    <div className="timeline-body">
                                        <h4 className="timeline-title m-0">
                                            <span className="badge text-white">Workflow on {formatISODateTime(data.flwCreatedAt)}</span>
                                        </h4>
                                        <div className="bg-white border p-2">
                                            <div className="col-md-12 row text-dark">
                                                <div className="col-md-3">
                                                    <label htmlFor="inputState" className="col-form-label pt-0">From Department/Role</label>
                                                    <p>{data.fromEntityName.unitDesc + " - " + data.fromRoleName.roleDesc}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="inputState" className="col-form-label pt-0">To Department/Role</label>
                                                    <p>{data.toEntityName.unitDesc + " - " + data.toRoleName.roleDesc}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="inputState" className="col-form-label pt-0">User</label>
                                                    <p>{data.flwCreatedby.flwCreatedBy}</p>
                                                </div>
                                                <div className="col-md-3">
                                                    <label htmlFor="inputState" className="col-form-label pt-0">Status</label>
                                                    <p>{data.statusDescription.description}</p>
                                                </div>
                                                <div className="col-md-3"><label htmlFor="inputState" className="col-form-label pt-0">Action Performed</label>
                                                    <p>{data.flwAction}</p>
                                                </div>
                                                <div className="col-md-12 pb-0 mb-0 pt-1">
                                                    <div className="form-group detailsbg-grey p-2">
                                                        <label htmlFor="inputState" className="col-form-label pt-0">Comments</label>
                                                        {
                                                            (data.flwAction === "Assign to self") ?
                                                                <p>Assigned to self</p>
                                                                :
                                                                <p style={{ textAlign: "justify" }}>{data.remarks}</p>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                ((interactionData.type === 'complaint' && interactionData.woType === 'FAULT') || interactionData.type === 'service request') && (
                    <div className="full-width-bg row p-0">
                        <section className="row triangle col-12 align-items-center">
                            <div className="col">
                                <h4 id="list-item-1">Task History</h4>
                            </div>
                            <div className="col-auto ref">
                                <button type="button" className={`btn btn-labeled btn-primary btn-sm`} onClick={handleOnTaskRefresh}>
                                    Refresh
                                </button>
                            </div>
                        </section>
                        <div className="work-flow col-12 p-2">
                            <>
                                {
                                    !!taskHistory.length &&
                                    <div className="task-blocks row" style={{ paddingLeft: "115px" }}>
                                        <div className="col-3 task-block1">
                                            <p className="text-justify" style={{ fontSize: "15px" }}><strong>Task Title</strong></p>
                                        </div>
                                        <div className="col-3 task-block2">
                                            <p className="text-justify" style={{ fontSize: "15px" }}><strong>Status</strong></p>
                                        </div>
                                        <div className="col-5 task-block3">
                                            <p className="text-justify" style={{ fontSize: "15px" }}><strong>Remarks</strong></p>
                                        </div>
                                    </div>
                                }
                                {
                                    !!taskHistory.length ?
                                        <div className="d-flex justify-content-start">
                                            <ul className="events">
                                                {
                                                    taskHistory.map((task) => {
                                                        let date = formatISODateTime(task.updatedAt);
                                                        return (
                                                            <li>
                                                                <div className="col-md-8">
                                                                    {
                                                                        task.taskId === 'CREATEBARUNBAR' ?
                                                                            interactionData.woType === "BAR" ?
                                                                                <p><strong>Create Bar Cerillion</strong></p>
                                                                                :
                                                                                <p><strong>Create UnBar Cerillion</strong></p>
                                                                            :
                                                                            ""
                                                                    }
                                                                    {
                                                                        task.taskId === 'PROCESSBARUNBAR' ?
                                                                            interactionData.woType === "BAR" ?
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

                                        (taskHistoryMsg === true) && ['service request'].includes(interactionData.type) &&
                                        <>
                                            <div className="task-blocks row" style={{ paddingLeft: "115px" }}>
                                                <div className="col-3 task-block1">
                                                    <p className="text-justify" style={{ fontSize: "15px" }}><strong>Task Title</strong></p>
                                                </div>
                                                <div className="col-3 task-block2">
                                                    <p className="text-justify" style={{ fontSize: "15px" }}><strong>Status</strong></p>
                                                </div>
                                                <div className="col-5 task-block3">
                                                    <p className="text-justify" style={{ fontSize: "15px" }}><strong>Remarks</strong></p>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-start">
                                                <ul className="events">
                                                    <li>
                                                        <div className="col-md-8">
                                                            {
                                                                (interactionData.woType === 'BAR' && interactionData.row.currStatus === 'CLOSED') ?
                                                                    <p><strong>Create Bar</strong></p>
                                                                    :
                                                                    (interactionData.woType === 'UNBAR' && interactionData.row.currStatus === 'CLOSED') ?
                                                                        <p><strong>Create UnBar</strong></p>
                                                                        :
                                                                        <p><strong>{interactionData.row.woTypeDescription && interactionData.row.woTypeDescription !== null ? interactionData.row.woTypeDescription : interactionData.row.workOrderType && interactionData.row.workOrderType.description !== null && interactionData.row.workOrderType.description } Task</strong></p>
                                                                // <p><strong>{interactionData.row.woTypeDescription} Task</strong></p>

                                                            }
                                                        </div>
                                                        <div className="col-md-2">
                                                            <p><strong>{interactionData.row.currStatus}</strong></p>
                                                        </div>
                                                        <time datetime="NEW"></time>
                                                        <span className="line"></span>
                                                        <div className="col-md-12">
                                                            {
                                                                interactionData.row.currStatus !== 'NEW' && <p className="text-justify"><strong>{formatISODateTime(interactionData.row.createdAt)}</strong></p>
                                                            }
                                                            {
                                                                (interactionData.woType === 'BAR' && interactionData.row.currStatus === 'CLOSED') ?
                                                                    <p className="text-justify">Service Request ID {interactionData.interactionId} to Bar connection completed successfully</p>
                                                                    :
                                                                    (interactionData.woType === 'UNBAR' && interactionData.row.currStatus === 'CLOSED') ?
                                                                        <p className="text-justify">Service Request ID {interactionData.interactionId} to UnBar connection completed successfully</p>
                                                                        :
                                                                        <p className="text-justify">Service Request ID {interactionData.interactionId} is in {interactionData.row.currStatus} status</p>
                                                            }
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </>
                                }

                            </>
                        </div>
                    </div>
                )
            }
            {
                ['complaint', 'service request'].includes(interactionData.type) &&
                realTimeDetails.hasOwnProperty('history') &&
                !!realTimeDetails.history.length && (
                    <div className="full-width-bg row p-0">
                        <section className="row triangle col-12">
                            <div className="col">
                                <h4 id="list-item-1">UNN</h4>
                            </div>
                        </section>
                        <div className="col-12 p-2">
                            <div className="timeline">
                                {
                                    realTimeDetails.history.reverse().map((data, index) => {
                                        return (
                                            <div key={index} className="timeline-container primary">
                                                <div className="timeline-icon">
                                                    {++index}
                                                </div>
                                                <div className="timeline-body">
                                                    <h4 className="timeline-title m-0">
                                                        <span className="badge text-white">Workflow on {moment(data.assigned_date, 'DD-MM-YYYY hh:mm:ss A').format('DD MMM YYYY hh:mm:ss A')}</span>
                                                    </h4>
                                                    <div className="bg-white border p-2">
                                                        <div className="col-md-12 row text-dark">
                                                            <div className="col-md-3">
                                                                <label htmlFor="inputState" className="col-form-label pt-0">From Department</label>
                                                                <p>{data.from_dept}</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label htmlFor="inputState" className="col-form-label pt-0">From Role</label>
                                                                <p>{data.from_role}</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label htmlFor="inputState" className="col-form-label pt-0">To Department</label>
                                                                <p>{data.to_dept}</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label htmlFor="inputState" className="col-form-label pt-0">To Role</label>
                                                                <p>{data.to_role}</p>
                                                            </div>
                                                            <div className="col-md-3">
                                                                <label htmlFor="inputState" className="col-form-label pt-0">User</label>
                                                                <p>{data.user_acted}</p>
                                                            </div>
                                                            <div className="col-md-3"><label htmlFor="inputState" className="col-form-label pt-0">Action Performed</label>
                                                                <p>{data.ticket_action}</p>
                                                            </div>

                                                            <div className="col-md-12 pb-0 mb-0 pt-1">
                                                                <div className="form-group detailsbg-grey p-2">
                                                                    <label htmlFor="inputState" className="col-form-label pt-0">Comments</label>
                                                                    <p>{data.comments}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                )
            }
            {
                interactionData.type === 'complaint' &&
                <div className="full-width-bg row">
                    <section className="row triangle col-12 pb-2">
                        <div className="col">
                            <h4 id="list-item-1">Appointment</h4>
                        </div>
                    </section>
                    <table id="appointment-history" className="table table-responsive table-striped dt-responsive nowrap w-100 border mb-2 mt-2 mr-3">
                        <thead>
                            <tr>
                                <th>Start</th>
                                <th>End</th>
                                <th>Contact Name</th>
                                <th>Number</th>
                                <th>Comments</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                !!appointmentHistory.length ?
                                    appointmentHistory.map((data, index) => (
                                        <tr key={index}>
                                            {/* {data.fromDate} {data.fromTime}
                                            {data.toDate} {data.toTime.slice(11, 19)} */}
                                            <td>{formatISODateTime(data.fromDate + " " + data.fromTime)}</td>
                                            <td>{formatISODateTime(data.toDate + " " + data.toTime)}</td>
                                            <td>{data.contactPerson}</td>
                                            <td>{data.contactNo}</td>
                                            <td>{data.remarks}</td>
                                        </tr>

                                    ))
                                    : (
                                        <p className="m-0 text-center">No Appointments Found.</p>
                                    )
                            }
                        </tbody>
                    </table>
                </div>
            }
            {
                ['complaint', 'inquiry'].includes(interactionData.type) &&
                <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Followup Modal" style={customStyles}>
                    <div className="modal-content tick-det">
                        <div className="page-title-box">
                            <h4 className="page title">Followup History For Ticket Number {interactionData.interactionId}</h4>
                            <button type="button" className="close-btn" onClick={() => setIsOpen(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {/* <div className="modal-header">
                                    <h5 className="modal-title pl-2">Followup History For Ticket Number {interactionData.interactionId}</h5>
                                    <button type="button" className="close" onClick={() => setIsOpen(false)}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div> */}
                        <div className="modal-body overflow-auto">
                            <table id="ticket-history" className="table table-striped dt-responsive nowrap w-100 border mb-0">
                                <thead>
                                    <tr>
                                        <th>Date Time</th>
                                        <th>User</th>
                                        <th>Department</th>
                                        <th>Role</th>
                                        <th>Source</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        !!followUpHistory.length ?
                                            followUpHistory.map((data, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{formatISODateTime(data.flwCreatedAt)}</td>
                                                        <td>{data.flwCreatedBy}</td>
                                                        <td>{data.departmentDescription}</td>
                                                        <td>{data.roleDescription}</td>
                                                        <td>{data.sourceDescription}</td>
                                                        <td>{data.remarks}</td>
                                                    </tr>
                                                )
                                            })
                                            : (
                                                <p className="m-0 text-center">No Followp Found.</p>
                                            )
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Modal>
            }
        </>
    )
})

export default TicketHistory;