

import React, { useState, useEffect } from 'react';

import Switch from "react-switch";
import { properties } from "../properties";
import { put, get } from "../util/restUtil";
import { toast } from "react-toastify";
import { string, object } from "yup";
import { useTranslation } from "react-i18next";
import { showSpinner, hideSpinner } from "../common/spinner";
import Modal from 'react-modal';


const validationSchema = object().shape({
    code: string().required("Please enter service name"),
    description: string().required("Please enter service description"),
    codeType: string().required("Please select service type"),

});




const EditParameter = ({ Code , Data, isOpen, setUpdate }) => {
    const { t } = useTranslation();
    const [error, setError] = useState({});
    const [state, setState] = useState(false);

    const [data, setData] = useState({
        oldCode: Data.code,
        code: Data.code,
        description: Data.description,
        codeType: Data.codeType,
        mappingPayload: "",
        status: Data.status,

    })
    const options = Code
    useEffect(() => {
        //setData({ ...data, code: Data.code, description: Data.description, codeType: Data.codeType, status: Data.status })
    }, [Data])

    const validate = () => {
        try {
            validationSchema.validateSync(data, { abortEarly: false });
        } catch (e) {
            e.inner.forEach((err) => {
                setError((prevState) => {
                    return { ...prevState, [err.params.path]: err.message };
                });
            });
            return e;
        }
    };

    const setCodeType = (e) => {
        setData({ ...data, codeType: e })

    }

    const handleChange = (checked) => {
        setState(checked)
        if (checked) {
            setData({ ...data, status: "AC" })
        } else {
            setData({ ...data, status: "IN" })
        }

    }



    const handleClear = () => {

        setData({
            ...data,
            code: "",
            description: "",
            codeType: "",
            mappingPayload: "",
            status: "IN"

        })
        setState(false)

    }




    const onHandleSubmit = () => {
        const error = validate(validationSchema, data);
        if (error) return;
        showSpinner();

        put(properties.BUSINESS_PARAMETER_API + "/" + data.oldCode, data)
            .then((resp) => {
                if (resp.status === 200) {
                    toast.success("Business Entity updated successfully")
                    setUpdate(false)
                }
                else {
                    toast.error("Error while updating business entity")
                }
            })
            .finally(() => { hideSpinner() });
    }





    return (


        <Modal

            style={{
                overlay: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.75)'
                },
                content: {
                    position: 'absolute',
                    top: '50px',
                    left: '50px',
                    right: '50px',
                    bottom: '0px',
                    border: '1px solid #ccc',
                    background: '#fff',
                    overflow: 'auto',
                    
                    borderRadius: '4px',
                    outline: 'none',
                    padding: '0',
                    height: '50%'

                }
            }}
            isOpen={isOpen} onRequestClose={() => setUpdate(false)} contentLabel="Edit Parameters" >
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Update Parameters</h4>
                    <button type="button" className="close" onClick={() => setUpdate(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div><hr></hr></div>
                <div className="modal-body">
                    <div className="modal-body p-2" style={{ display: "block" }}>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Service Name
                                    </label>
                                    <input type="text"
                                        className={`form-control mr-2 ${error.code ? "input-error" : ""}`}
                                        placeholder="Charge Batteries"
                                        value={data.code}
                                        onChange={(e) => { setData({ ...data, code: e.target.value }); setError({ ...error, code: "" }) }} />

                                    {error.code ? <span className="errormsg">{error.code}</span> : ""}

                                </div>
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Service Description
                                    </label>
                                    <input type="text"
                                        className={`form-control mr-2 ${error.description ? "input-error" : ""}`}
                                        id="field-1"
                                        value={data.description}
                                        placeholder="Charge Batteries"
                                        onChange={(e) => { setData({ ...data, description: e.target.value }); setError({ ...error, description: "" }) }} />

                                    {error.description ? <span className="errormsg">{error.description}</span> : ""}

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label className="control-label">Code Type
                                    </label>

                                    <select placeholder="Select Code Type" id="system"
                                        className={`form-control mr-2 ${error.codeType ? "input-error" : ""}`}
                                        value={data.codeType}
                                        onChange={e => { setData({ ...data, codeType: e.target.value }); setError({ ...error, codeType: "" }) }}
                                    >
                                        <option key="" value=''>Select Code Type</option>
                                        {
                                            options.map((e) => (
                                                <option key={e.codeType} value={e.codeType}>{e.codeType}</option>
                                            ))
                                        }
                                    </select>
                                    {error.codeType ? <span className="errormsg">{error.codeType}</span> : ""}

                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label >Enable/Disable</label>
                                    <Switch onChange={handleChange} checked={data.status === "AC" ? true : false} />
                                </div>
                            </div>




                        </div>
                        <br />

                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <button className="btn btn-primary" onClick={onHandleSubmit}>{t("Save")}</button>&nbsp;&nbsp;
                            <button className="btn btn-secondary" type="button" onClick={handleClear}>Clear</button>
                        </div>

                    </div>
                </div>
            </div>
        </Modal>


    )
}
export default EditParameter;

