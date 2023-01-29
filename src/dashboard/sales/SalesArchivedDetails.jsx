import Modal from 'react-modal';
import React, { useEffect, useState } from 'react'
import DynamicTable from '../../common/table/DynamicTable';
import { unstable_batchedUpdates } from 'react-dom';
import { showSpinner, hideSpinner } from "../../common/spinner";
import { post } from "../../util/restUtil";
import { properties } from "../../properties";

const SalesArchived = (props) => {

    const { exportData,isOpen} = props.data
    const {setIsOpen} = props.handler
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [exportBtn, setExportBtn] = useState(true);
    const [salesArchivedData,setSalesArchivedData] = useState()
    const [totalCount, setTotalCount] = useState(0);


    const RegularModalCustomStyles = {
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
    }

    useEffect(()=>{
        getSalesArchivedData()
    },[exportData])

    const getSalesArchivedData = () =>{
        showSpinner();
        post(`${properties.DASHBOARD}/sales`, exportData).then(resp => {
            if (resp && resp.data && resp.data.rows.length > 0) {
                const { count, rows } = resp.data;
                unstable_batchedUpdates(() => {
                   const salesData = rows.filter((items) => items.stype === exportData.serviceType)
                    setTotalCount(count)
                    setSalesArchivedData(salesData)
                })
            }
        }).finally(hideSpinner);
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    const handleCellRender = (cell, row) => {
            return (<span>{cell.value}</span>)
    }

    const handlePageSelect = (pageNo) => {
        setCurrentPage(pageNo)
    }

    return (
        <>
            <Modal isOpen={isOpen} contentLabel="Worflow History Modal" style={RegularModalCustomStyles}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">{exportBtn.serviceType} Sales Archived</h4>
                            <button type="button" className="close" onClick={handleClose}>×</button>
                        </div>
                        <div className="card">
                            <div className="card-body" id="datatable">
                           { salesArchivedData && <DynamicTable
                                    listKey={"Sales Data"}
                                    row={salesArchivedData}
                                    rowCount={totalCount}
                                    header={SalesDataColumn}
                                    itemsPerPage={perPage}
                                    backendPaging={false}
                                    backendCurrentPage={currentPage}
                                    exportBtn={exportBtn}
                                    listSearch ={exportData}
                                    handler={{
                                        handleCellRender: handleCellRender,
                                        handlePageSelect: handlePageSelect,
                                        handleItemPerPage: setPerPage,
                                        handleCurrentPage: setCurrentPage,
                                        handleExportButton: setExportBtn
                                    }}
                                />}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}
export default SalesArchived;

const SalesDataColumn = [
    {
        Header: "Account Number",
        accessor: "accountNumber",
        disableFilters: true
    },
    {
        Header: "Customer Name",
        accessor: "customerName",
        disableFilters: true
    },
    {
        Header: "Service Type",
        accessor: "stype",
        disableFilters: true
    },
    {
        Header: "Location",
        accessor: "description",
        disableFilters: true
    },
    {
        Header: "User Name",
        accessor: "userName",
        disableFilters: true
    },
    {
        Header: "Order Type",
        accessor: "orderType",
        disableFilters: true
    }
]