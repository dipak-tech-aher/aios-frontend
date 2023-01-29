/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useMemo, useEffect } from 'react';
import { useTable, useSortBy, useFilters } from 'react-table';
import { unstable_batchedUpdates } from 'react-dom';
import ReactPaginate from 'react-paginate';
import { ColumnFilter } from './columnFilter';
import ExportExcelFile from "../excelUtils/ExportExcelFile"
import './table.css';
import { formatISODateDDMMMYY } from '../../util/dateUtil';

const DynamicTable = (props) => {

    const backendPaging = props.backendPaging
    const handlePageSelect = props.handler.handlePageSelect
    const handleItemPerPage = props.handler.handleItemPerPage
    const handleCurrentPage = props.handler.handleCurrentPage
    const handleFilters = props.handler.handleFilters
    const handleExportButton = props.handler.handleExportButton
    const listKey = props.listKey != undefined ? props.listKey : "NA"
    const listSearch = props.listSearch != undefined ? props.listSearch : "NA"
    const listSelectedTab = props.listSelectedTab != undefined ? props.listSelectedTab : "NA"

    const { row, rowCount, header, itemsPerPage, backendCurrentPage, isTableFirstRender, hasExternalSearch, exportBtn, hiddenColumns = [] } = props

    const columns = useMemo(() => header, [])

    const fileName = "AIOS_" + listKey.replaceAll(/ /g, "_") + "_" + formatISODateDDMMMYY(Date().toLocaleString()); // filename of the excel file

    const [currentPage, setCurrentPage] = useState(0);
    const [PER_PAGE, setPER_PAGE] = useState(itemsPerPage)

    let offset = currentPage * PER_PAGE;

    const data = useMemo(() => {
        return row?.slice(offset, offset + PER_PAGE)
    }, [offset, PER_PAGE, row])

    let pagecount = Math.ceil(row?.length / PER_PAGE);

    const defaultColumn = useMemo(() => {
        return {
            Filter: ColumnFilter
        }
    }, [])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setAllFilters
    } = useTable({
        columns: columns,
        data: data,
        defaultColumn,
        manualFilters: backendPaging,
        initialState: {
            hiddenColumns: hiddenColumns
        }
    }, useFilters, useSortBy)

    const { filters } = state;

    if (backendPaging && isTableFirstRender) {

        if (hasExternalSearch) {
            useEffect(() => {
                if (isTableFirstRender.current && hasExternalSearch.current) {
                    setAllFilters([])
                }
                else {
                    hasExternalSearch.current = true
                }
            }, [isTableFirstRender.current])
        }


        useEffect(() => {
            if (!isTableFirstRender.current) {
                unstable_batchedUpdates(() => {
                    handleCurrentPage((backendCurrentPage) => {
                        if (backendCurrentPage === 0) {
                            return '0';
                        }
                        return 0;
                    });
                    handleFilters(filters);
                })
            }
            else {
                isTableFirstRender.current = false;
            }

        }, [filters])
    }

    const handlePageSizeChange = (e) => {
        unstable_batchedUpdates(() => {
            setPER_PAGE(Number(e.target.value));
            setCurrentPage(0);
            if (backendPaging) {
                handleItemPerPage(Number(e.target.value));
                handleCurrentPage(0);
            }
        })
    }

    return (
        <div className="data-scroll1" style={{ width: "100%", maxHeight:"580px",border: "1px solid #ccc", overflowX: "scroll", overflowY: "auto", whiteSpace: "nowrap" }}>
            <div className="row">
                {/* Export to Excel File Components */}
                {
                    exportBtn ?
                        <ExportExcelFile
                            fileName={fileName} listSelectedTab={listSelectedTab}
                            listKey={listKey} listSearch={listSearch} filters={filters}
                            handleExportButton={handleExportButton}
                        />
                        : ""
                }
                <table {...getTableProps()}
                    className="table table-responsive table-striped dt-responsive nowrap w-100"
                    style={{ textAlign: "center", marginLeft: "0px" }}>

                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()} >
                                {headerGroup.headers.map((column, idx) => (
                                    <th key={idx} {...column.getHeaderProps(/*column.getSortByToggleProps(){
                                    onClick : () => handleClick()
                                    }*/)}>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                                            {column.render('Header')}
                                            <span>
                                                {/* {column.isSorted ? (column.isSortedDesc ? '' : '') : ''} */}
                                            </span>
                                            {column.canFilter ? column.render('Filter') : null}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} >
                        {
                            rows.map((row, idx) => {
                                prepareRow(row)
                                return (
                                    <tr key={idx}  {...row.getRowProps()}>
                                        {

                                            row.cells.map((cell, idx) => {
                                                return (
                                                    <td key={idx} >
                                                        {cell.render(props.handler.handleCellRender(cell, row))}
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>

            <div className="d-flex">
                <div className="d-flex flex-grow-1 justify-content-center">
                    {
                        (backendPaging) ?
                            <>
                                <ReactPaginate
                                    previousLabel={"←"}
                                    nextLabel={"→"}
                                    pageCount={((rowCount !== undefined && !isNaN(rowCount) && !isNaN(PER_PAGE)) ? Math.ceil(rowCount / PER_PAGE) : 0)}
                                    onPageChange={({ selected: selectedPage }) => {
                                        handlePageSelect(selectedPage)
                                    }}
                                    forcePage={Number(backendCurrentPage)}
                                    containerClassName={"pagination"}
                                    previousLinkClassName={"pagination__link"}
                                    nextLinkClassName={"pagination__link"}
                                    disabledClassName={"pagination__link--disabled"}
                                    activeClassName={"pagination__link--active"}
                                />
                                <div className="select-cus"> 
                                    <select value={PER_PAGE}
                                        onChange={handlePageSizeChange}
                                        className="custom-select custom-select-sm ml-1" >
                                        {
                                            [10, 20, 30, 40, 50].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    {pageSize} Rows
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <span className="ml-1">per Page</span>
                                </div>
                            </>
                            :
                            <>
                                <ReactPaginate
                                    previousLabel={"←"}
                                    nextLabel={"→"}
                                    pageCount={pagecount}
                                    onPageChange={({ selected: selectedPage }) => {
                                        setCurrentPage(selectedPage)
                                    }}
                                    containerClassName={"pagination"}
                                    previousLinkClassName={"pagination__link"}
                                    nextLinkClassName={"pagination__link"}
                                    disabledClassName={"pagination__link--disabled"}
                                    activeClassName={"pagination__link--active"}
                                />
                                <div>
                                    <select value={PER_PAGE}
                                        onChange={handlePageSizeChange}
                                        className="custom-select custom-select-sm ml-1" >
                                        {
                                            [10, 20, 30, 40, 50].map((pageSize) => (
                                                <option key={pageSize} value={pageSize}>
                                                    {pageSize} Rows
                                                </option>
                                            ))
                                        }
                                    </select>
                                    <span className="ml-1">per Page</span>
                                </div>
                            </>
                    }
                </div>
            </div>
        </div >
    );
}

export default DynamicTable;