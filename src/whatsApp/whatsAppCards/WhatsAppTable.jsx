const WhatsAppTable = (props) => {

    const {  chartDetails } = props
    console.log('chartDetails',chartDetails)
    return (
        <>        
          <div className="table-responsive top-user">
                <table className="table table-striped table-sm table-wrap table-centered mb-0"> 
                    <thead>
                        <tr>
                            <th>Service Type</th>
                            <th>Count</th>
                        </tr>
                    </thead>
                    <tbody>
                      { chartDetails && chartDetails.map((s)=>(
                        <tr>
                            <td>
                                <h5 className="font-15 my-1 font-weight-normal">{s.name}</h5>
                            </td>
                            <td>{s.value}</td>
                        </tr>
                       ))}
                    </tbody>
                </table>
                </div>
        </>
    )
}

export default WhatsAppTable