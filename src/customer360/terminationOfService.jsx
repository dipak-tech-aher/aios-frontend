import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { string, object } from "yup";
import { toast } from 'react-toastify';
import { post, put } from '../util/restUtil';
import { properties } from "../properties";
import { hideSpinner, showSpinner } from "../common/spinner";

const terminationValidationSchema = object().shape({
    terminationReason: string().required("Termination Reason is required")
    //refundDeposit: string().required("Reason Deposite is required"),
    //contractFeesWaiver: string().required("Road is required"),
})
const TerminationOfService = (props) => {

    const { serviceDetails, selectedAccount, interactionData} = props.data;
    const handleServicePopupClose = props.handleServicePopupClose
    const setRefreshPage = props.setRefreshPage
    const { t } = useTranslation();
    const initialState = {
        terminationReason: "",
        refundDeposit: "N",
        contractFeesWaiver: "N"
    };
    const [terminationReason, setTerminationReason] = useState([]);
    const [terminationData, setTerminationData] = useState(initialState);
    const [terminationDataError, setTerminationDataError] = useState({});
    
    useEffect(() => {
        showSpinner();
        post(properties.BUSINESS_ENTITY_API, ['WO_TYPE'])
            .then((response) => {
                if (response.data) {
                    let lookupData = response.data;
                    setTerminationReason(lookupData['WO_TYPE']);
                }
            })
            .finally(hideSpinner)
    }, [])

    const validate = (section, schema, data) => {
        try {
            if (section === 'TERMINATION') {
                setTerminationDataError({})
            }
            schema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                if (section === 'TERMINATION') {
                    setTerminationDataError((prevState) => {
                        return { ...prevState, [err.params.path]: err.message };
                    });
                }
            });
            return e;
        }
    };
    const validateAddressDetails = () => {
        let error = validate('TERMINATION', terminationValidationSchema, terminationData);
        if (error) {
            toast.error("Validation errors found. Please check highlighted fields");
            return false;
        }
        return true;
    }
    const handleSubmit = () => {
        if (validateAddressDetails()) {
            const { accountId, customerId } = selectedAccount;
            const { serviceId } = serviceDetails;
            showSpinner();
            put(`${properties.CONNECTION_TERMINATE_API}`, {
                customerId,
                serviceId,
                accountId,
                ...terminationData
            })
                .then((response) => {
                    toast.success(response.message);
                    handleServicePopupClose()
                    setRefreshPage((prevState) => (!prevState))
                })
                .finally(() => {
                    hideSpinner();
                    setTerminationData(initialState);
                })
        }
    }

    return (
        <div className="row p-0 card border" >
            <section className="triangle">
                <div className="row col-12">
                    <h5 id="list-item-2" className="pl-1">Termination</h5>
                </div>
            </section>

            <div className="row ">
                <div className="col-12">
                    <div className="p-2">
                        <div className="">
                            {
                                !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge) ?
                            
                                <fieldset className="scheduler-border1">
                                    <legend className="scheduler-border scheduler-box"> {t("termination_reason")}</legend>
                                    <form id="address-form">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="flatHouseUnitNo" className="col-form-label">Terminate Reason<span>*</span></label>
                                                    <select id="serviceNumberGroup" className="form-control"
                                                        value={terminationData.terminationReason}
                                                        onChange={(e) => {setTerminationData({ ...terminationData, terminationReason: e.target.value });
                                                        setTerminationDataError({...terminationDataError,terminationReason:""})
                                                    }}
                                                    >
                                                        <option value="">Select Reason</option>
                                                        {
                                                            terminationReason && terminationReason.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                    <span className="errormsg">{terminationDataError.terminationReason ? terminationDataError.terminationReason : ""}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <br></br> <br></br>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox"
                                                            value={terminationData.refundDeposit}
                                                            checked={terminationData.refundDeposit === 'Y' ? true : false}
                                                            onChange={(e) => setTerminationData({ ...terminationData, refundDeposit: e.target.checked ? 'Y' : 'N' })}
                                                            className="custom-control-input" id="checkbox-signin" />
                                                        <label className="custom-control-label" htmlFor="checkbox-signin">{t("refund_deposite")}</label>
                                                    </div>
                                                </div>
                                                <span className="errormsg">{terminationDataError.refundDeposit ? terminationDataError.refundDeposit : ""}</span>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <br></br> <br></br>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox"
                                                            value={terminationData.contractFeesWaiver}
                                                            checked={terminationData.contractFeesWaiver === 'Y' ? true : false}
                                                            onChange={(e) => setTerminationData({ ...terminationData, contractFeesWaiver: e.target.checked ? 'Y' : 'N' })}
                                                            className="custom-control-input" id="checkbox-signin2" />
                                                        <label className="custom-control-label" htmlFor="checkbox-signin2">{t("contract_fees_waiver")}</label>
                                                    </div>
                                                </div>
                                                <span className="errormsg">{terminationDataError.contractFeesWaiver ? terminationDataError.contractFeesWaiver : ""}</span>
                                            </div>

                                        </div>

                                    </form>
                                    <div className="row justify-content-center mt-3">
                                        {
                                            ((serviceDetails.status === 'ACTIVE' || serviceDetails.status === 'TOS') && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                <>
                                                    <button type="button" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                                                </>
                                                :
                                                (interactionData && interactionData.length > 0 && interactionData[0].woType === 'TERMINATE' && interactionData[0].currStatus === 'CLOSED') ?
                                                <button type="button" className="btn btn-primary mr-2" onClick={handleSubmit}>Submit</button>
                                                :
                                                <button type="button" disabled="disabled" className="btn btn-primary mr-2">Submit</button>
                                      
                                        }

                                    </div>
                                </fieldset>
                            :
                            <>
                                    
                                    <fieldset className="scheduler-border1">
                                    <h5 className="errormsg ml-2">Termination not available, another Service Request is in process</h5>
                                    <legend className="scheduler-border scheduler-box"> {t("termination_reason")}</legend>
                                    <form id="address-form">
                                        <div className="row">
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <label htmlFor="flatHouseUnitNo" className="col-form-label">Terminate Reason<span>*</span></label>
                                                    <select id="serviceNumberGroup" className="form-control" disabled="true"
                                                        value={interactionData[0]?.terminateReason}
                                                    >
                                                        <option value="">Select Reason</option>
                                                        {
                                                            terminationReason && terminationReason.map((e) => (
                                                                <option key={e.code} value={e.code}>{e.description}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <br></br> <br></br>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox"
                                                            value={interactionData && interactionData[0]?.refundDeposit}
                                                            checked={interactionData && interactionData[0]?.refundDeposit === 'Y' ? true : false}
                                                            disabled="true"
                                                            className="custom-control-input" id="checkbox-signin" />
                                                        <label className="custom-control-label" htmlFor="checkbox-signin">{t("refund_deposite")}</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div className="form-group">
                                                    <br></br> <br></br>
                                                    <div className="custom-control custom-checkbox">
                                                        <input type="checkbox"
                                                            value={interactionData && interactionData[0]?.contractFeesWaiver}
                                                            checked={interactionData && interactionData[0]?.contractFeesWaiver === 'Y' ? true : false}
                                                            disabled="true"
                                                            className="custom-control-input" id="checkbox-signin2" />
                                                        <label className="custom-control-label" htmlFor="checkbox-signin2">{t("contract_fees_waiver")}</label>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                    </form>
                                </fieldset>
                            </>
                        }
                        </div>
                    </div >
                </div >
            </div >
        </div >
    )
}
export default TerminationOfService