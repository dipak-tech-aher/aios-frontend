import React from 'react';
import { formatDateForBirthDate } from '../util/dateUtil';
import NumberFormat from 'react-number-format';
import { validateNumber, handlePaste } from "../util/validateUtil";

const AddEditAppointmentForm = (props) => {
    const { ticketDetailsInputs, isAppointmentEdit, permissions = {} } = props.data;
    const { handleOnTicketDetailsInputsChange, setIsAppointmentEdit } = props.handlers;

    const calculateToTimeBasedOnFromTime = (fromTime) => {
        const time = fromTime.split(':');
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let totalMinutes = minutes + 15;
        hours += Math.floor(totalMinutes / 60);
        minutes = Math.round((((totalMinutes / 60) - Math.floor(totalMinutes / 60))) * 60);
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    }

    const getMinimumTime = (source) => {
        const { toDate, fromDate, fromTime } = ticketDetailsInputs;
        if (new Date(fromDate).getDate() === new Date(toDate).getDate()) {
            if (new Date(fromDate).getTime() > new Date().getTime() || new Date(toDate).getTime() > new Date().getTime()) {
                if (source === 'to') {
                    return calculateToTimeBasedOnFromTime(fromTime)
                }
                return;
            }
            if (source === 'from') {
                return new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toTimeString().slice(0, 5);
            }
            else {
                return calculateToTimeBasedOnFromTime(fromTime)
            }
        }
        if (fromDate === new Date().toISOString().slice(0, 10) && source === 'from') {
            return new Date(new Date().setMinutes(new Date().getMinutes() + 5)).toTimeString().slice(0, 5);
        }
    }

    const checkIsRequired = () => {
        const { fromDate, toDate, fromTime, toTime, contactNumber, contactPerson, appointmentRemarks } = ticketDetailsInputs;
        if (fromDate !== "" || toDate !== "" || fromTime !== "" || toTime !== "" || contactNumber !== "" || contactPerson !== "" || appointmentRemarks !== "") {
            return true;
        }
        return false;
    }

    return (
        !permissions.readOnly && <>
            <div className="col-12">
                <div className="add-app row inner-title bg-light border align-items-center">
                    <div className="col pl-2 ">
                        <h5 className="text-primary">{isAppointmentEdit ? 'Edit' : 'Add'} Appointment</h5>
                    </div>
                    <div className="col-auto">
                        {
                            isAppointmentEdit &&
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => setIsAppointmentEdit(!isAppointmentEdit)}><span className="fa fa-pen p-0 text-white" /> Cancel</button>
                        }
                    </div>
                </div>
            </div>
            <div className="app-field col-12">
                <div className="pt-1">
                    <div className="form-group col-12">
                        <label className="col-form-label" htmlFor="fromDate">Date &amp; Time</label>
                        <div className="form-inline">
                            <input disabled={permissions.readOnly} required={checkIsRequired()} className="form-control mr-2" min={formatDateForBirthDate(new Date())} id="fromDate" type="date" name="fromDate" value={ticketDetailsInputs.fromDate} onChange={handleOnTicketDetailsInputsChange} />
                            <input disabled={permissions.readOnly} required={checkIsRequired()} className="form-control mr-2" min={getMinimumTime('from')} id="fromTime" type="time" name="fromTime" value={ticketDetailsInputs.fromTime} onChange={handleOnTicketDetailsInputsChange} />
                            <span>To</span>
                            <input disabled={permissions.readOnly} required={checkIsRequired()} className="form-control mr-2 ml-2" min={new Date(ticketDetailsInputs.fromDate) > Date.now() ? ticketDetailsInputs.fromDate : formatDateForBirthDate(new Date())} id="toDate" type="date" name="toDate" value={ticketDetailsInputs.toDate} onChange={handleOnTicketDetailsInputsChange} />
                            <input disabled={permissions.readOnly} required={checkIsRequired()} className="form-control" min={getMinimumTime('to')} id="toTime" type="time" name="toTime" value={ticketDetailsInputs.toTime} onChange={handleOnTicketDetailsInputsChange} />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="contactPerson" className="col-form-label">Contact Person</label>
                                <input disabled={permissions.readOnly} required={checkIsRequired()} type="text" className="form-control" id="contactPerson" value={ticketDetailsInputs.contactPerson} onChange={handleOnTicketDetailsInputsChange} />
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="form-group">
                                <label htmlFor="contactNumber" className="col-form-label">Contact Number</label>
                                <NumberFormat
                                    onKeyPress={(e) => { validateNumber(e) }}
                                    onPaste={(e) => handlePaste(e)}
                                    disabled={permissions.readOnly} required={checkIsRequired()} type="text" minLength='7' maxLength='7' className="form-control" id="contactNumber" value={ticketDetailsInputs.contactNumber} onChange={handleOnTicketDetailsInputsChange} />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 p-0">
                        <div className="form-group ">
                            <label htmlFor="appointmentRemarks" className="col-form-label pt-0">Appointment Remarks</label>
                            <textarea disabled={permissions.readOnly} maxLength="200" className="form-control" id="appointmentRemarks" name="appointmentRemarks" rows="4" value={ticketDetailsInputs.appointmentRemarks} onChange={handleOnTicketDetailsInputsChange} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddEditAppointmentForm;