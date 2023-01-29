import React, {useState} from 'react';
import { Link } from 'react-router-dom';

const CustomerSearchAction = ({data}) =>
{
    const[display, setDisplay] = useState(false);
    return(
        <div className="btn-group">
            <Link to="/advancesearch">
            <button type="button" 
                    className="btn btn-sm btn-outline-primary text-primary" >
                        <i className="mdi mdi-pencil ml-0 mr-2 font-10 vertical-middle"></i>
                        {data["parent"]}
            </button>
            </Link>
            {
                data["child"] && (
                <button type="button" 
                    className="btn btn-sm btn-outline-primary text-primary dropdown-toggle dropdown-toggle-split" 
                    data-toggle="dropdown"  
                    onClick={ () => {
                        setDisplay(!display)
                    }}
                    >
                        <i className="mdi mdi-chevron-down" ></i>
                </button>
            )}
            
            { display && (
            <div className="dropdown-menu dropdown-menu-right show">
                {
                    data["child"][0] && (
                        <Link  className="dropdown-item text-primary" to="/advancesearch">
                            <i className="mdi mdi-account-question  ml-0 mr-2 font-10 vertical-middle"></i>
                            {data["child"][0]}
                        </Link>
                    )
                }
                {
                    data["child"][1] && (
                        <Link  className="dropdown-item text-primary" to="/ticketsearch">
                            <i className="mdi mdi-card-plus-outline  ml-0 mr-2 font-10 vertical-middle"></i>
                            {data["child"][1]}
                        </Link>
                    )
                }
                
            </div>
            )}
        </div>
    );
}

export default CustomerSearchAction;