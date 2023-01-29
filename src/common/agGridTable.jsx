import React, { useState,useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const TableGrid = () => {
    const [rowData, setRowData] = useState([]);
    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/row-data.json')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, []);
    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 1000, marginTop: '100px' }}>
            <AgGridReact rowData={rowData} rowSelection="multiple">
                <AgGridColumn field="make" sortable={true} filter={true} checkboxSelection={ true }></AgGridColumn>
                <AgGridColumn field="model" sortable={true} filter={true}></AgGridColumn>
                <AgGridColumn field="price" sortable={true} filter={true}></AgGridColumn>
            </AgGridReact>
        </div>
    );
};

export default TableGrid;
