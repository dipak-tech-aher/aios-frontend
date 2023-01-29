import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DynamicTable from "../common/table/DynamicTable";
import { ManageParametersCols } from "./manageParaCol"
import { properties } from "../properties";
import { hideSpinner, showSpinner } from '../common/spinner';
import { get } from "../util/restUtil";
import AddParameter from "./addParameter";
import Modal from 'react-modal';
import EditParameter from "./editParameter";


const ManageParameters = () => {
   
    const { t } = useTranslation();

    const [data, setData] = useState([])
    const [adminMenu, setAdminMenu] = useState([]);
    const [isActive, setIsActive] = useState()
   
    const showtab = (selectedMenuId) => { setIsActive(selectedMenuId) }
    const [display, setDisplay] = useState(false);
    const [update, setUpdate] = useState(false);
    const [exportBtn, setExportBtn] = useState(true);

    let codeType

    useEffect(() => {

        showSpinner();
        get(properties.BUSINESS_PARAMETER_API + "/code-types").then(resp => {
            if (resp.data) {
              
                setAdminMenu(resp.data)

                handleRender(resp.data[0].codeType)
                setIsActive(resp.data[0].codeType)
              

            }
        }).finally(hideSpinner)


    }, [])



    useEffect(() => {

        if (display === false && update === false) {

            handleRender(isActive)
        }

    }, [display, update])

    const handleRender = (e) => {
        showSpinner();


        get(properties.BUSINESS_PARAMETER_API + "/list/" + e).then(resp => {
            if (resp.data) {
             
                let value = Object.keys(resp.data).map((key) => resp.data[key]);
                let merged = [].concat.apply([], value);
                setData(merged)
            }
        }).finally(hideSpinner)

    }

    const handleSubmit = (data, code) => {
        setData(data);
        setUpdate(true)

    }

    const handleCellRender = (cell, row) => {

        if (cell.column.Header === "Edit") {
            return (
                <button type="button" className="btn btn-sm btn-outline-primary waves-effect waves-light color-white" onClick={(e) => handleSubmit(row.original, row.original.code)}><span className="btn-label"><i className="mdi mdi-file-document-edit-outline font20"></i></span> Edit</button>
            )
        }
        else if (cell.column.Header === "Mapping") {
            return (
                <button type="button" className="map-btn btn btn-sm btn-outline-primary waves-effect waves-light color-white"><span className="btn-label"><i className="ti-arrow-circle-right font20"></i></span>Map</button >
            )
        }

        else {
            return (<span>{cell.value}</span>)
        }
    }


    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="page-title-box">
                        <h1 className="page-title">Business Parameter Management  </h1>
                    </div>
                </div>
            </div>
            {(display) ?

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
                    isOpen={display}>

                    <AddParameter Code={adminMenu} setDisplay={setDisplay} />
                    <button className="close-btn" onClick={() => setDisplay(false)} >&times;</button>

                </Modal>
                : <></>}

            <div className="row mt-1">

                <div className="col-lg-12">
                    <div className="m-t-30 card-box">

                        <form className="col-12 d-flex justify-content-left ml-1" >
                            <div className="col-8 form-row align-items-left">
                                <lable><h5>Business Parameter :</h5></lable>&nbsp;&nbsp;
                                <select className="form-control" id="example-select" required
                                    style={{ width: "400px" }}
                                    autoFocus
                                    onChange={(e) => { codeType = e.target.value; handleRender(codeType); showtab(codeType) }}

                                >

                                    {adminMenu.map((e) =>
                                    (

                                        <option key={e.codeType} value={e.codeType}>{e.description}</option>
                                    )
                                    )}
                                </select>
                            </div>
                            <div className="col-4 text-right pt-1">
                                <button type="button" className="btn btn-outline-primary waves-effect waves-light mb-2"
                                    onClick={() => setDisplay(true)}
                                >Add New Parameters</button>
                            </div>
                        </form>
                      
                        <div className="tab-content p-0">
                            <div className="tab-pane  show active" id="naturecode">
                                <div className="row mt-2" id="datatable">
                                    <div className="col-lg-12 p-0">
                                        <div className="card-body">

                                            {
                                                data.length > 0 &&
                                                <div className="card">
                                                    <div className="card-body">
                                                        <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
                                                            <DynamicTable
                                                                listKey={"Manage Parametrs"}

                                                                row={data}
                                                                header={ManageParametersCols}
                                                                itemsPerPage={10}
                                                                exportBtn={exportBtn}
                                                                handler={{
                                                                    handleCellRender: handleCellRender,
                                                                    handleExportButton: setExportBtn
                                                                }}

                                                            />
                                                        </div><br />

                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    {(update === true) ?

                                        <EditParameter Code={adminMenu} Data={data} setUpdate={setUpdate} isOpen={update} style={{ height: "50%" }} />
                                        :
                                        <></>
                                    }
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            </div >

        </>
    )


}
export default ManageParameters;
