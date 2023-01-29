import React from "react";

const TripleCard = (props) => {
    const { header, count1, count2, count3, footer1, footer2, footer3, } = props?.data;


    return (

        <div className="card">
            <div className="card-body">
                <div className="media">
                    <div className="media-body overflow-hidden ">
                        <h5 className="header-title">{header} </h5>
                    </div>
                    <div className="text-primary">
                        <i className="fe-layers mr-1 noti-icon"></i>
                    </div>
                </div>
            </div>
            <div className="card-body chat-mon border-top py-3">
                <div className="row">
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer1}</p>
                            <h4 class="text-primary" >
                                <h2 class="text-primary  text-center text-bold">
                                    <span data-plugin="counterup">{count1}</span></h2>
                            </h4>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer2}</p>
                            <h4 class="text-primary" >
                                <h2 class="text-primary  text-center text-bold">
                                    <span data-plugin="counterup">{count2}</span></h2>
                            </h4>

                        </div>
                    </div>
                    <div className="col-4">
                        <div className="text-center">
                            <p className="mb-2 text-truncate">{footer3}</p>
                            <h4 class="text-primary" >
                                <h2 class="text-primary  text-center text-bold">
                                    <span data-plugin="counterup">{count3}</span></h2>
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default TripleCard;