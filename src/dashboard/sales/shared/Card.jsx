import React from "react";

const Card = (props) => {
    const { header, targetCount, count1, footer1, icon, icon1, percentage, progressbarColor } = props?.data;
    return (
        <div class="col-3 card-body">
            <div class="card p-2">
                <div class=" pb-0 border-bottom-0 row">
                    <div class="pl-1 col-12">
                        <h4 class="card-title">{header}<br></br>{targetCount ? `Target (${targetCount})` : ""}
                        </h4>
                        <span class="card-options round-card float-right">
                            <div class="avatar-sm rounded-circle bg-primary">
                                <i
                                    class={icon}></i>
                            </div>
                        </span>
                    </div>
                   
                </div>
                <div class="card-body pt-0">
                    <h3 class="d-inline-block mb-2">{targetCount ? count1 : `${count1}%`}</h3>
                    <div class="progress h-2 mt-2 mb-2">
                        <div class={progressbarColor} style={{ width: percentage + "%" }}
                            role="progressbar"></div>
                    </div>
                    <div class="float-start">
                        <div class="mt-2">
                            <i class={icon1 ? "fa fa-caret-up text-success" : "fa fa-caret-down text-warning"}></i>
                            <span> {targetCount ? icon1 ? `(${footer1}) - Balance` : `${footer1} - Balance` : footer1<0 ? `${footer1}% Decrease from Last Month`:`${footer1}% increase from Last Month`}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

};

export default Card;