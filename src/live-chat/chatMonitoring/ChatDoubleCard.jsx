import React from 'react' 

const ChatDoubleCard = (props) => {
    
    const { header, icon, count1, count2, footer1, footer2} = props?.data

    return (
        <div className="card chat-mon">
            <div className="card-body">
                <div className="media">
                    <div className="media-body overflow-hidden">
                        <h5 className="header-title">{header}</h5>   
                        <p className="img-icon"> <i className={icon}></i></p>
                    </div>
                </div>
            </div>
            <div className="card-body chat-mon">
                <div className="row">
                    <div className="col-md-6">
                        <div className="time-left text-center">
                            <h3>{count1}</h3>
                            <p>{footer1}</p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="time-left text-center">
                            <h3>{count2}</h3>
                            <p>{footer2}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatDoubleCard