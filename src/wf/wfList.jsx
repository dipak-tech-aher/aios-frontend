import React, { useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { toast } from "react-toastify";
import { hideSpinner, showSpinner } from "../common/spinner";
import DynamicTable from '../common/table/DynamicTable';
import { properties } from "../properties";
import { get } from "../util/restUtil";

const WFList = (props) => {

    const setIsOpen = props.handler.setIsOpen
    const openWorkflow = props.handler.openWorkflow
    const [wfData, setWFData] = useState([])
    const [filters, setFilters] = useState([]);
    const [pageSelect, setPageSelect] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const isFirstRender = useRef(true);
    const isTableFirstRender = useRef(true);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        showSpinner();
        get(`${properties.WORKFLOW_DEFN_API}?limit=${perPage}&page=${pageSelect}`)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    unstable_batchedUpdates(() => {
                        setTotalCount(resp.data.count)
                        setWFData({ rows: resp.data.rows, count: resp.data.count })
                    });
                } else {
                    if (resp && resp.status) {
                        toast.error("Error fetching Workflow Definitions - " + resp.status + ', ' + resp.message);
                    } else {
                        toast.error("Unexpected error fetching Workflow Definitions");
                    }
                }
            }).finally(() => {
                isTableFirstRender.current = false;
                hideSpinner()
            });
    }, []);

    const getWFDetails = () => {
        showSpinner();
        get(`${properties.WORKFLOW_DEFN_API}?limit=${perPage}&page=${pageSelect}`)
            .then((resp) => {
                if (resp && resp.status === 200 && resp.data) {
                    unstable_batchedUpdates(() => {
                        setTotalCount(resp.data.count)
                        setWFData({ rows: resp.data.rows, count: resp.data.count })
                    });
                } else {
                    if (resp && resp.status) {
                        toast.error("Error fetching Workflow Definitions - " + resp.status + ', ' + resp.message);
                    } else {
                        toast.error("Unexpected error fetching Workflow Definitions");
                    }
                }
            }).finally(() => {
                isTableFirstRender.current = false;
                hideSpinner()
            });
    }

    useEffect(() => {
        if (!isFirstRender.current) {
            getWFDetails();
        }
        else {
            isFirstRender.current = false;
        }
    }, [pageSelect, perPage])

    const handlePageSelect = (pageNo) => {
        setPageSelect(pageNo)
    }

    const handleOnPerPageChange = (perPage) => {
        setPerPage(perPage)
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.id === 'action') {
            return (
                <button type="button" className="btn btn-sm btn-primary p-1"
                    onClick={(e) => {
                        openWorkflow(e, row.original.workflowId)
                        setIsOpen(false)
                    }}>
                    Edit
                </button>
            )
        } else {
            return (<span>{cell.value}</span>)
        }
    }

    const setRowData = () => {

    }

    const setData = () => {

    }

    return (
        <>
            <div className="modal-dialog" style={{ margin: "1rem", height: "100%" }}>
                <div className="modal-content" style={{ height: "100%" }}>
                    <div className="modal-header">
                        <h4 className="modal-title" id="myCenterModalLabel">Workflow List</h4>
                        <button type="button" className="close" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div>
                        <hr />
                    </div>
                    <div className="modal-body">
                        <div className="form-row col-12 justify-content-center">
                            {
                                (wfData && wfData.rows && wfData.rows.length > 0) ?
                                    <div className="card" style={{ width: '100%' }}>
                                        <div className="card-body" id="datatable">
                                            <DynamicTable
                                                row={wfData.rows}
                                                rowCount={totalCount}
                                                header={WFListColumns}
                                                handleRow={setData}
                                                itemsPerPage={perPage}
                                                hiddenColumns={WFListHiddenColumns}
                                                backendPaging={true}
                                                isTableFirstRender={isTableFirstRender}
                                                backendCurrentPage={pageSelect}
                                                handler={{
                                                    handleCellRender: handleCellRender,
                                                    handlePageSelect: handlePageSelect,
                                                    handleItemPerPage: handleOnPerPageChange,
                                                    handleFilters: setFilters,
                                                    handleCurrentPage: setPageSelect
                                                }}
                                            />
                                        </div>
                                    </div >
                                    :
                                    <p><strong>No Workflows defined yet</strong></p>
                            }
                        </div>
                    </div>
                    <div className="modal-footer d-flex mt-2 justify-content-center">
                        <button className="btn btn-secondary" onClick={() => setIsOpen(false)} type="button">Close</button>
                    </div>
                </div>
            </div>
        </>
    )
}

const WFListColumns = [
    {
        Header: "Workflow Id",
        accessor: "workflowId",
        disableFilters: true
    },
    {
        Header: "Workflow Name",
        accessor: "workflowName",
        disableFilters: true
    },
    {
        Header: "Interaction Type Code",
        accessor: "interactionType",
        disableFilters: true
    },
    {
        Header: "Interaction Type",
        accessor: "intxnTypeDesc.description",
        disableFilters: true
    },
    {
        Header: "Service Type",
        accessor: "productTypeDesc.description",
        disableFilters: true
    },
    {
        Header: "Service Type Code",
        accessor: "productType",
        disableFilters: true
    },
    {
        Header: "Status",
        accessor: "statusDesc.description",
        disableFilters: true
    },
    {
        Header: "StatusCode",
        accessor: "status",
        disableFilters: true
    },
    {
        Header: "Updated By",
        accessor: "updatedByName.firstName",
        disableFilters: true
    },
    {
        Header: "Updated By Id",
        accessor: "updatedBy",
        disableFilters: true
    },
    {
        Header: "Action",
        accessor: "action",
        disableFilters: true
    }
]

const WFListHiddenColumns = ['status', 'updatedBy', 'interactionType', 'productType']

export default WFList;