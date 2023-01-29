import Modal from 'react-modal';
import React, { useState } from 'react'
import DynamicTable from '../../common/table/DynamicTable';
import moment from 'moment'
import { ceil } from 'lodash';

const TodayAndMonthCardModal = (props) => {
    const { isOpen, whatsappTodayData, exportData, serviceType ,source} = props.data;
    const { setIsOpen, setWhatsappTodayData } = props.handler
    const [currentPage, setCurrentPage] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [exportBtn, setExportBtn] = useState(true);
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

    const handleClose = () => {
        setIsOpen(false);
        setWhatsappTodayData([])
    }

    const handleCellRender = (cell, row) => {
        if (cell.column.Header === "Whatsapp Visit Date/Time") {
            return (<span>{cell.value ?  moment(cell.value).format('DD MMM YYYY hh:mm:ss A') : '-'}</span>)
        }else{
            return (<span>{cell.value}</span>)
        }
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
                            <h4></h4>
                            <button type="button" className="close" onClick={handleClose}>×</button>
                        </div>
                        <div className="card">
                            <div className="card-body" id="datatable">
                                {whatsappTodayData && <DynamicTable
                                    listKey={`Whatsapp ${serviceType === 'All' ? '' : serviceType === 'Fixed' ? 'FixedLine' :serviceType} ${source==='MONTH' ?'Monthly':'Today'} Data`}
                                    row={whatsappTodayData}
                                    rowCount={totalCount}
                                    header={WhatsAppDataColumn}
                                    itemsPerPage={perPage}
                                    backendPaging={false}
                                    backendCurrentPage={currentPage}
                                    exportBtn={exportBtn}
                                    listSearch={exportData}
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
export default TodayAndMonthCardModal;

const WhatsAppDataColumn = [
    {
        Header: "Customer Number",
        accessor: "crm_customer_no",
        disableFilters: true
    },
    {
        Header: "Customer Name",
        accessor: "customer_name",
        disableFilters: true
    },
    {
        Header: "Account Number",
        accessor: "account_no",
        disableFilters: true
    },
    {
        Header: "Account Name",
        accessor: "account_name",
        disableFilters: true
    },
    {
        Header: "Access Number",
        accessor: "access_number",
        disableFilters: true
    },
    {
        Header: "Service Type",
        accessor: "service_type",
        disableFilters: true
    },
    {
        Header: "Contact Number",
        accessor: "contact_number",
        disableFilters: true
    },
    {
        Header: "Email ID",
        accessor: "email",
        disableFilters: true
    },
    {
        Header: "Whatsapp Visit Date/Time",
        accessor: "created_at",
        disableFilters: true
    }
]