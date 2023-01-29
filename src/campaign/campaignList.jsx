import React, { useState, useEffect, useRef } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from '../common/spinner';
import DynamicTable from '../common/table/DynamicTable';
import { properties } from '../properties';
import { post } from '../util/restUtil';
import CampListCol from './campListCol';
import { useHistory } from "react-router-dom";
import { formatISODateDDMMMYY ,formatISODateTime } from '../util/dateUtil';
import { formFilterObject } from '../util/util';

const CampaignList = () => {

    const history = useHistory();
    const [tableRowData, setTableRowData] = useState([]);

    const [totalCount, setTotalCount] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState([]);
    const [exportBtn, setExportBtn] = useState(true);

    const isTableFirstRender = useRef(true);

    useEffect(() => {
        showSpinner();
        const requestBody = {
            filters: formFilterObject(filters)
        }
        post(`${properties.CAMPAIGN_API}/list?limit=${perPage}&page=${currentPage}`, requestBody)
            .then((response) => {
                const { count, rows } = response.data;
                if (!!rows.length) {
                    unstable_batchedUpdates(() => {
                        setTotalCount(count)
                        setTableRowData(rows)
                    })
                }
            })
            .finally(hideSpinner)
    }, [currentPage, perPage])

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Campaign Name") {
            return (<span className="text-primary cursor-pointer" onClick={(e) => handleCellLinkClick(e, row.original)}>{cell.value}</span>)
        }
        else if (['Valid From', 'Valid To'].includes(cell.column.Header)) {
            return (<span>{formatISODateDDMMMYY(cell.value)}</span>)
        }
        else if (cell.column.Header === "Created On") {
            return (<span>{formatISODateTime(cell.value)}</span>)
        }
        else {
            return (<span>{cell.value}</span>)
        }
    }

    const handleCellLinkClick = (e, rowData) => {
        const { campId } = rowData
        history.push(`${process.env.REACT_APP_BASE}/edit-campaign`, {
            data: {
                campId,
                type: 'EDIT'
            }
        })
    }


    return (
        <div className="row mt-1">
            <div className="col-lg-12">
                <div className="page-title-box">
                    <h4 className="page-title">Campaign Listing</h4>
                </div>
                <div className="search-result-box m-t-30 card-box">
                    <div className="row mt-2 pr-2">
                        <div className="col-lg-12">
                            <div className="card">
                                <div className="card-body">
                                    {
                                        !!tableRowData.length &&
                                        <div className="card">
                                            <div className="card-body">
                                                <DynamicTable
                                                    listKey={"Campaign Listing"}
                                                    row={tableRowData}
                                                    rowCount={totalCount}
                                                    header={CampListCol}
                                                    itemsPerPage={perPage}
                                                    backendPaging={true}
                                                    backendCurrentPage={currentPage}
                                                    isTableFirstRender={isTableFirstRender}
                                                    exportBtn={exportBtn}
                                                    handler={{
                                                        handleCellRender: handleCellRender,
                                                        handlePageSelect: handlePageSelect,
                                                        handleItemPerPage: setPerPage,
                                                        handleCurrentPage: setCurrentPage,
                                                        handleFilters: setFilters,
                                                        handleExportButton: setExportBtn
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CampaignList;