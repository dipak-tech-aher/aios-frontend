const SalesTable = (props) => {

    const { header_1, header_2, header_3, header_4, salesDetails } = props.data

    return (
        <>        
          <div className="table-responsive top-user">
                <table className="table table-striped table-sm table-wrap table-centered mb-0"> 
                    <thead>
                        <tr>
                            <th>{header_1}</th>
                            <th>{header_2}</th>
                            <th>{header_3}</th>
                            <th>{header_4}</th>
                        </tr>
                    </thead>
                    <tbody>
                      { salesDetails && salesDetails.map((s)=>(
                        <tr>
                            <td>
                                <h5 className="font-15 my-1 font-weight-normal">{s.column_1}</h5>
                            </td>
                            <td>{s.column_2}</td>
                            <td>{s.column_3}</td>
                            <td>{s.column_4}</td>
                        </tr>
                       ))}
                    </tbody>
                </table>
                </div>
        </>
    )
}

export default SalesTable