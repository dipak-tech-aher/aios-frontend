import React from 'react' 

const ChatSingleCard = (props) => {
    
    const { header, icon, count, footer} = props?.data

    return (
        <div className="card-sec">
            <div className="card-body">
                <div className="media">
                    <div className="media-body overflow-hidden">
                        <h5 className="header-title">{header}</h5> 
                        <p className="img-icon"><i className={icon} aria-hidden="true"></i></p>
                    </div>
                </div>
            </div>
            <div className="card-body chat-mon">
                <div className="row">
                    <div className="col-md-12">
                        <div className="time-left text-center agent-count">
                            <h3>{count}</h3>
                            <p>{footer}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatSingleCard