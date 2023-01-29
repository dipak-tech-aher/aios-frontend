import React from "react";
import { unstable_batchedUpdates } from "react-dom";

const TripleCard = (props) => {
    const { header, count1, count2, count3, footer1, footer2, footer3, icon, isExport, exportData } = props?.data;
    const { setIsOpen, setExportData } = props.handler

    const handlerOnClick = (key) => {
        if (isExport) {
            key = key === "Mobile Postpaid" ? "Postpaid" : key === "Mobile Prepaid" ? "Prepaid" : key === "Fixed" ? "Fixed" : key
            unstable_batchedUpdates(() => {
                setExportData({
                    ...exportData,
                    serviceType: key

                })
                setIsOpen(true)
            })
        }
    }

    return (

        <div className="card">
            <div className="card-body">
                <div className="media">
                    <div className="media-body overflow-hidden ">
                        <h5 className="header-title pt-2">{header} </h5>
                    </div>
                    <div className="text-primary">
                        <i className={icon}></i>
                    </div>
                </div>
            </div>
            <div className="card-body border-top py-3">
                <div className="row">
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer1}</p>
                            <h4 class="text-danger" >
                                <h2 className={isExport ? "text-primary text-center text-bold":  "text-center text-bold" } style={isExport ? { cursor:"pointer"}:{cursor:"default"}} onClick={() => { handlerOnClick(footer1) }}>
                                    <span data-plugin="counterup">{count1}</span></h2>
                            </h4>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer2}</p>
                            <h4 className="text-primary" >
                                <h2 className={isExport ? "text-primary text-center text-bold":  "text-center text-bold" } style={isExport ? { cursor:"pointer"}:{cursor:"default"}} onClick={() => { handlerOnClick(footer2) }}>
                                    <span data-plugin="counterup">{count2}</span></h2>
                            </h4>

                        </div>
                    </div>
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer3}</p>
                            <h4 className="text-primary" >
                                <h2 className={isExport ? "text-primary text-center text-bold":  "text-center text-bold" } style={isExport ? { cursor:"pointer"}:{cursor:"default"}} onClick={() => { handlerOnClick(footer3) }}>
                                    <span data-plugin="counterup">{count3}</span></h2>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default TripleCard;