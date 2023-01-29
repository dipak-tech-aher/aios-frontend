import React, { useState, useEffect } from 'react';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { get } from '../util/restUtil';
import { LeadSearchColumns } from './leadSearchColumns';
import { useHistory } from "react-router-dom";

const LeadDataTable = () => {
    const history = useHistory();
    const [tableRowData, setTableRowData] = useState([]);
    useEffect(() => {
        showSpinner();
        get(`${properties.CUSTOMER_INQUIRY_API}`)
            .then((response) => {
                setTableRowData(response.data)
            })
            .finally(hideSpinner)
    }, [])

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Lead Id") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
        } else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleCellLinkClick = (e, rowData) => {
        const { leadId } = rowData;
        history.push(`${process.env.REACT_APP_BASE}/edit-customer-inquiry`, {
            data: {
                leadId
            }
        })
    }

    return (
        <div className="row" style={{ marginTop: "120px" }}>
            <div className="col-lg-12">
                {
                    !!tableRowData.length &&
                    <div className="card">
                        <div className="card-body">
                            <DynamicTable
                                row={tableRowData}
                                header={LeadSearchColumns}
                                itemsPerPage={10}
                                handler={{
                                    handleCellRender: handleCellRender,
                                    handleLinkClick: handleCellLinkClick
                                }}
                            />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default LeadDataTable;