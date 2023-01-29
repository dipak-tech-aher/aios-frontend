import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import '../common/table/table.css';

const AccessNumberList = (props) => {

    const { accessNumbers, setAccessNumberAndGroup, prodType } = props
    const [position, setPosition] = useState(0)

    return (
        <>
            <div className="row col-6 mt-2 pl-3" style={{ width: "50px", display: "flex", flexDirection: "column" }}>
                <table className="access-nbr table table-striped dt-responsive nowrap w-100 cursor-pointer">
                    <tbody>
                        {
                            accessNumbers[position].map((second) => {
                                return (
                                    <tr>
                                        {
                                            second.map((third) => {
                                                return (
                                                    <td onClick={() => { setAccessNumberAndGroup(prodType, third.value, third.category) }}>
                                                        {third.value}
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
            {
                (accessNumbers && accessNumbers.length > 50) ?
                    <div className="row col-6 justify-content-center" >
                        <ReactPaginate
                            previousLabel={"←"}
                            nextLabel={"→"}
                            pageCount={accessNumbers.length}
                            onPageChange={({ selected: selectedPage }) => {
                                setPosition(selectedPage)
                            }}
                            containerClassName={"pagination"}
                            previousLinkClassName={"pagination__link"}
                            nextLinkClassName={"pagination__link"}
                            disabledClassName={"pagination__link--disabled"}
                            activeClassName={"pagination__link--active"}
                        />
                    </div >
                    :
                    <></>

            }
        </>
    );
}


export default AccessNumberList;