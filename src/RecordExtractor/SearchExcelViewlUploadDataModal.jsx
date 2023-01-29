import React from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import DynamicTable from '../common/table/DynamicTable';
import { CallCollectionReportTemplateColumns, CallCollectionReportTemplateNoOsColumns } from './RecordExtractorColumns';
import { OMSModalViewDataColumns } from './SearchExcelRecordsColumns';

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
    }
};

const SearchExcelViewUploadDataModal = (props) => {
    const { isOpen, row } = props.data;
    const { setIsOpen } = props.handlers;
    const { bulkUploadType, payload } = row;

    const handleCellRender = (cell, row) => {
        if (["Bill Date", "Due Date", "Paid Date"].includes(cell.column.Header)) {
            return (<span>{cell.value ? moment(cell.value).format('DD MMM YYYY') : '-'}</span>)
        }
        return (<span>{cell.value}</span>)
    }

    return (
        <Modal isOpen={isOpen} contentLabel="Worflow History Modal" style={customStyles}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">Outstanding Details</h4>
                        <button type="button" className="close" onClick={() => setIsOpen(!isOpen)}>×</button>
                    </div>
                    <div className="modal-body">
                        <div className="row">
                            {
                                bulkUploadType === 'CALL_COLLECTION' ? (
                                    <>
                                        {
                                            !!payload?.outstanding?.length ?
                                                <>
                                                    <div className="row col-12 bg-light border m-2 pr-2 mb-3 mt-2 mr-1">
                                                        <h5 className="text-primary pl-2">Records with Outstanding</h5>
                                                    </div>
                                                    <DynamicTable
                                                        row={payload?.outstanding}
                                                        header={CallCollectionReportTemplateColumns}
                                                        hiddenColumns={['validationStatus', 'validationRemark']}
                                                        rowCount={payload?.outstanding?.length}
                                                        itemsPerPage={10}
                                                        handler={{
                                                            handleCellRender: handleCellRender
                                                        }}
                                                    />
                                                </>
                                                :
                                                <h5 className="text-center mx-auto my-3">No oustanding bill records found.</h5>
                                        }
                                        {
                                            !!payload?.noOutstanding?.length ?
                                                <>
                                                    <div className="row col-12 bg-light border m-2 pr-2 mb-3 mt-2 mr-1">
                                                        <h5 className="text-primary pl-2">Records with No Outstanding</h5>
                                                    </div>
                                                    <DynamicTable
                                                        row={payload?.noOutstanding}
                                                        header={CallCollectionReportTemplateNoOsColumns}
                                                        rowCount={payload?.noOutstanding?.length}
                                                        itemsPerPage={10}
                                                        handler={{
                                                            handleCellRender: handleCellRender
                                                        }}
                                                    />
                                                </>
                                                :
                                                <h5 className="text-center mx-auto my-3">No paid bill records found.</h5>
                                        }
                                    </>
                                )
                                    :
                                    payload?.length ? (
                                        <DynamicTable
                                            row={payload}
                                            header={OMSModalViewDataColumns}
                                            rowCount={payload?.length}
                                            itemsPerPage={10}
                                            handler={{
                                                handleCellRender: handleCellRender
                                            }}
                                        />
                                    )
                                        : null
                            }
                        </div>
                        <div className="row pt-4">
                            <button className="btn btn-secondary btn-sm mx-auto" type="button" data-dismiss="modal" onClick={() => setIsOpen(!isOpen)}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default SearchExcelViewUploadDataModal;