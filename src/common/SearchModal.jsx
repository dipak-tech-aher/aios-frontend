import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DynamicTable from './table/DynamicTable';

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        maxHeight: '70%'
    }
};

const SearchModal = (props) => {
    const { isOpen, searchInput, tableRowData, tableHeaderColumns, tableHiddenColumns, currentPage, totalCount, perPage, isTableFirstRender, hasExternalSearch } = props.data;
    const { setIsOpen, setSearchInput, setSearchData, handleSearch } = props.modalStateHandlers;
    const { handleCellRender, handleCellLinkClick, handleCurrentPage, handlePageSelect, handleItemPerPage, handleFilters } = props.tableStateHandlers;
    const [suggestion, setSuggestion] = useState(false)
    const handleOnModelClose = () => {
        setIsOpen({ ...isOpen, openModal: false });
        setSearchData([]);
        setSearchInput("");
        setSuggestion(false)
    }
    useEffect(() => {
        if (searchInput !== "") {
            if (tableRowData.length === 0) {
                setSuggestion(true)
            }
            else {
                setSuggestion(false)
            }
        }
    }, [tableRowData])
    return (
        <Modal isOpen={isOpen.openModal} contentLabel="Complaint Search Modal" style={customStyles}>
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title pl-2">Search Customer</h4>
                    <button type="button" className="close" onClick={handleOnModelClose}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div><hr></hr></div>
                <div className="form-row">
                    <div className="col-12 pl-2 bg-light border">
                        <h5 className="text-primary">Search with Customer No./Account No./Access No.</h5>
                    </div>
                </div>
                <br></br>
                <br></br>
                <div className="modal-body overflow-auto cus-srch">
                    <form className="d-flex justify-content-center" onSubmit={handleSearch}>
                        <div className="form-row align-items-center">
                            <div className="col-auto">
                                <input
                                    type="text"
                                    style={{ width: "270px" }}
                                    className="form-control"
                                    autoFocus
                                    onChange={(e) => { setSearchInput(e.target.value); setSuggestion(false) }}
                                    value={searchInput}
                                    required
                                    placeholder="Customer No./Account No./Access No."
                                    maxLength={15}
                                />
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-primary" type="submit">Search</button>
                            </div>
                            <div className="col-auto">
                                <button className="btn btn-secondary" type="button" onClick={() => { setSearchInput(""); setSearchData([]); setSuggestion(false) }}>Clear</button>
                            </div>
                        </div>
                    </form>
                    {
                        !!tableRowData.length ?
                            <div className="row justify-content-center mt-2 pr-2">
                                <DynamicTable
                                    row={tableRowData}
                                    rowCount={totalCount}
                                    header={tableHeaderColumns}
                                    itemsPerPage={perPage}
                                    hiddenColumns={tableHiddenColumns}
                                    backendPaging={true}
                                    backendCurrentPage={currentPage}
                                    isTableFirstRender={isTableFirstRender}
                                    hasExternalSearch={hasExternalSearch}
                                    handler={{
                                        handleCellRender: handleCellRender,
                                        handleLinkClick: handleCellLinkClick,
                                        handlePageSelect,
                                        handleItemPerPage,
                                        handleCurrentPage,
                                        handleFilters
                                    }}
                                />
                            </div>
                            :
                            suggestion === true
                                ?
                                <p className='row pt-4 d-flex justify-content-center' style={{ fontSize: "20px" }}>No Records Found</p>
                                :
                                <></>
                    }
                </div>
            </div>
        </Modal>
    )
}

export default SearchModal;