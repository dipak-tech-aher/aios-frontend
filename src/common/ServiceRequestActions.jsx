import React ,{ useContext }from 'react';
import { AppContext } from "../AppContext";

const ServiceRequestActions = (props) => {
    const { row } = props.data;
    const { setIsResolveOpen, setIsPreviewOpen, setResolveData, setServiceRequestData } = props.handlers;
    const { auth } = useContext(AppContext);
    const handleOnViewClick = () => {
        setServiceRequestData({
            interactionId: row.intxnId,
            customerId: row.customerId,
            serviceId: row.serviceId,
            accountId: row.accountId,
            interactionType: row.intxnType,
            status: row.currStatus,
            externalRefSys1: row.externalRefSys1,
            externalRefNo1: row.externalRefNo1,
            woTypeDesc : row.woTypeDescription,
            intxnTypeDesc : row.intxnTypeDesc,
            accessNumber : row.accessNbr,
            serviceType : row.prodType,
            createdOn: row.createdAt,
            createdBy: row.createdBy
        })
        setIsPreviewOpen(true);
    }

    return (
        <div className="d-flex justify-content-center">
            {
                ((row.currStatus === "FAILED" || row.currStatus === "MANUAL" || row.currStatus === "Failed") && (row.intxnType === 'REQSR' || (row.intxnType === 'REQCOMP' && row.woType === "FAULT"))) ?
                    <div className="btn-group">
                        {
                            (row.intxnType === 'REQSR' || (row.intxnType === 'REQCOMP' && row.woType === "FAULT" && row.currUser === auth.user.userId  && row.currRole === auth.currRoleId && row.currEntity === auth.currDeptId))  && 
                            <button type="button" className="btn btn-sm btn-outline-primary text-primary" onClick={() => { setIsResolveOpen(true); setResolveData(row); }}>Resolve</button>
                        }
                        {
                            row.intxnType === 'REQSR' &&
                            <>
                                <button type="button" className="btn btn-sm btn-outline-primary text-primary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="mdi mdi-chevron-down"></i>
                                </button>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <button
                                        className="dropdown-item text-primary"
                                        onClick={handleOnViewClick}>
                                        <i className="mdi mdi-eye  ml-0 mr-2 font-10 vertical-middle" />
                                        View
                                    </button>
                                </div>
                            </>
                        }
                        
                    </div>
                    :
                    row.intxnType === 'REQSR' ?
                            <button
                                type="button"
                                className="btn btn-outline-primary waves-effect waves-light btn-sm"
                                onClick={handleOnViewClick}>
                                <small>View</small>
                            </button>
                            :
                            <></>
                        
            }
        </div >
    )
}

export default ServiceRequestActions;