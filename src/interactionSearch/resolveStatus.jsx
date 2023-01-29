import React, { useState, useRef, useEffect } from 'react'
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { properties } from '../properties'
import { get, put, post } from '../util/restUtil'
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import { showSpinner, hideSpinner } from "../common/spinner";


const validationSchema = object().shape({
    accessNbr: string().required("Please enter Access Number"),
    system: string().required("Please enter system choice"),
    woNbr: string().required("Please enter Work Order Number"),
    failure: string().required("Please enter Failure Reason")
});

const ResolveStatus = (props) => {

    const { value, isOpen, setIsOpen } = props

    const [failureLookup, setFailureLookup] = useState([])

    const [manualData, setManualData] = useState({
        accessNbr: '',
        system: '',
        woNbr: '',
        failure: ''
    })

    const [disableFields, setDisableFields] = useState({ accessNbr: false, system: false, refNbr: false })

    const [submitButton, setSubmitButton] = useState(true)

    const { t } = useTranslation();

    useEffect(() => {
        if (value && value.customerId && value.accountId && value.serviceId) {
            showSpinner();
            get(properties.SERVICE_API + '/' + value.customerId + '?' + 'account-id=' + value.accountId + '&service-id=' + value.serviceId)
                .then((resp) => {
                    if (resp && resp.data) {
                        if (resp.data.length > 0) {
                            const svcData = resp.data[0]
                            const disableSettings = {}
                            let mData
                            if (value.woType === 'WONC' || value.woType === 'WONC-ACCSER' || value.woType === 'WONC-SER' || value.woType === 'RELOCATE') {
                                if (svcData.prodType === 'Prepaid' || svcData.prodType === 'Postpaid') {
                                    if (svcData.serviceNumberSelection === 'manual' || value.currStatus === 'MANUAL') {
                                        mData = { ...manualData, accessNbr: svcData.mobile.accessNbr }
                                        disableSettings.accessNbr = true
                                    }
                                }
                                if (svcData.prodType === 'Fixed') {
                                    if (svcData.serviceNumberSelection === 'manual' || value.currStatus === 'MANUAL') {
                                        mData = { ...manualData, accessNbr: svcData.fixed.accessNbr }
                                        disableSettings.accessNbr = true
                                    }
                                }
                                disableSettings.system = true
                                mData = { ...mData, system: 'CERILLION' }
                            } else {
                                let accessNbr
                                if (svcData.prodType === 'Prepaid' || svcData.prodType === 'Postpaid') {
                                    mData = { ...manualData, accessNbr: svcData.mobile.accessNbr }
                                    disableSettings.accessNbr = true
                                }
                                if (svcData.prodType === 'Fixed') {
                                    mData = { ...manualData, accessNbr: svcData.fixed.accessNbr }
                                    disableSettings.accessNbr = true
                                }
                                if (value.woType === 'BAR' || value.woType === 'UNBAR') {
                                    disableSettings.system = true
                                    disableSettings.refNbr = true
                                } else if (value.woType === 'FAULT') {
                                    disableSettings.system = true
                                    mData.system = 'OMS'
                                } else {
                                    disableSettings.system = false
                                }
                            }
                            if(value.woType === 'TERMINATE')
                            {
                                mData = { ...mData, system: 'CERILLION' }
                                disableSettings.system = true
                                disableSettings.refNbr = true
                            }
                            if(value.woType === "UPGRADE" || value.woType === "DOWNGRADE")
                            {
                                mData = { ...mData, system: 'CERILLION',woNbr : value.externalRefNo1}
                                disableSettings.system = true
                                disableSettings.refNbr = true
                            }
                            setDisableFields(disableSettings)
                            setManualData(mData)
                        }
                    } else {
                        toast.error("Failed to fetch connection data - " + resp.status);
                    }
                }).finally(hideSpinner)
        }
    }, [props]);

    useEffect(() => {
        post(properties.BUSINESS_ENTITY_API, ['MANUAL_RES_REASON'])
            .then((resp) => {
                if (resp.data) {
                    setFailureLookup(resp.data['MANUAL_RES_REASON'])
                }
            })
    }, [props])

    const onHandleSubmit = () => {
        if (value.woType === "WONC" || value.woType === "RELOCATE") {
            if (manualData.accessNbr === '') {
                toast.error("Access Number is mandatory");
                return false;
            }
        }
        if (manualData.failure === '') {
            toast.error("Failure Reason mandatory");
            return false;
        }
        if (value.woType === "WONC" || value.woType === "RELOCATE" || value.woType === "TELEPORT") {
            if (manualData.system === '') {
                toast.error("System is mandatory");
                return false;
            }

            if (manualData.woNbr === '') {
                toast.error("Work Order Number is mandatory");
                return false;
            }
        }
        if (value.woType === "FAULT") {
            if (manualData.system === '') {
                toast.error("System is mandatory");
                return false;
            }

            if (manualData.woNbr === '') {
                toast.error("Work Order Number is mandatory");
                return false;
            }
        }
        showSpinner();
        put(properties.RESOLVE_FAILED_INTERACTION_API + '/' + value.intxnId, manualData)
            .then((resp) => {
                if (resp) {
                    toast.success(resp.message);
                    setSubmitButton(false)
                    props.refreshSearch()
                } else {
                    toast.error("Error while resolving SR")
                }
            }).finally(hideSpinner);
    }

    const handleCancel = () => {
        setManualData({ ...manualData, accessNbr: '', system: '', woNbr: '', failure: '' })
        setIsOpen(false)
        props.refreshSearch()
    }

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
            maxHeight: '100%'
        }
    };
    return (
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Worflow History Modal" style={customStyles}>
            <div className="modal-dialog reslove-state" style={{ marginTop: "0px" }}>
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title" id="myCenterModalLabel">Resolve {(value.intxnType === 'REQSR') ? 'Service Request' : (value.intxnType === 'REQCOMP') ? 'Complaint' : ''}</h4>
                        <button type="button" className="close" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className="modal-body">
                        <div className="form-row col-12 justify-content-center">
                            <div className="col-4">
                                <label htmlFor="accessNbr">Access Number<span className="required">*</span></label>
                                <input
                                    maxLength={15}
                                    disabled={disableFields.accessNbr}
                                    onChange={(e) => setManualData({ ...manualData, accessNbr: e.target.value })}
                                    id="accessNbr"
                                    value={manualData.accessNbr}
                                    className="form-control"
                                    type="text"
                                    placeholder="Access Number"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") onHandleSubmit();
                                    }}
                                />
                            </div>
                            <div className="col-4 ml-2">
                                <label htmlFor="failure">Manual Resolution Reason<span className="required">*</span></label>
                                <select id="failure" className="form-control" value={manualData.failure}
                                    onChange={e => setManualData({ ...manualData, failure: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") onHandleSubmit();
                                    }}>
                                    <option key="failure" value=''>Choose Reason</option>
                                    {
                                        (failureLookup && failureLookup.length > 0) ?
                                            failureLookup.map((e) => (
                                                <option key={e.code} value={e.code}>{e.description}</option>
                                            ))
                                            :
                                            <></>
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-row col-12 justify-content-center mt-2">
                            <div className="col-4">
                                <label htmlFor="system">System<span className="required">*</span></label>
                                <select disabled={disableFields.system} id="system" className="form-control" value={manualData.system}
                                    onChange={e => setManualData({ ...manualData, system: e.target.value })}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") onHandleSubmit();
                                    }}>
                                    <option key="system" value=''>Choose System</option>
                                    {
                                        ["OMS", "CERILLION"].map((e) => (
                                            <option key={e} value={e}>{e}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="col-4 ml-2">
                                <label htmlFor="woNbr">Work Order/Ticket Number<span className="required">*</span></label>
                                <input disabled={disableFields.refNbr} onChange={(e) => setManualData({ ...manualData, woNbr: e.target.value })} id="woNbr" value={manualData.woNbr} className="form-control" type="text" required='' placeholder="Work Order Number"
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") onHandleSubmit();
                                    }}
                                />
                            </div>
                        </div>
                        <div className="modal-footer d-flex mt-2 justify-content-center">
                            {
                                (submitButton) ?
                                    <button className="btn btn-primary mr-2" onClick={onHandleSubmit}>{t("Submit")}</button>
                                    :
                                    <></>
                            }
                            <button className="btn btn-secondary" onClick={handleCancel} type="button">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ResolveStatus;