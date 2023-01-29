import React, { useEffect } from "react";

const TopFive = (props) => {

    const { topFive } = props.data;
    const icons = {
        SRC020: 'fas fa-phone-alt',
        SRC003: 'fas fa-mobile-alt',
        SRC004: 'fas fa-headphones-alt',
        SRC007: 'fas fa-globe',
        SRC019: 'fe-mail',
        SRC005: 'fas fa-headphones-alt',
        SRCACCTOTHRS: 'fas fa-headphones-alt'
    }
    return (
        <div className="col-4 p-1">
            <div className="card-box">
                <h5 className="header-title">Top 5</h5>
                <ul className="nav nav-tabs nav-bordered">
                    <li className="nav-item">
                        <div data-target="#source" data-toggle="tab" aria-expanded="false" className="nav-link active">
                            Ticket Sources
                        </div>
                    </li>
                    {/*<li className="nav-item">
                        <div data-target="#reasonCodes" data-toggle="tab" aria-expanded="true" className="nav-link">
                            Reason Codes
                        </div>
                    </li>*/}
                </ul>
                <div className="tab-content mb-5" style={{ width: "100%", border: "1px solid white", overflowX: "auto", overflowY: "hidden", whiteSpace: "nowrap" }}>
                    <div className="tab-pane show active" id="source">
                        <table className="table table-hover table-centered table-nowrap mb-5" >
                            <tbody>
                                {
                                    !!topFive.length && topFive.map((data, index) => (
                                        <tr key={index}>
                                            {/* <td style={{ width: "60px" }}>
                                                <div className="avatar-xs">
                                                    <div className="avatar-title bg-primary rounded-circle">
                                                        <i className={`${icons[data.sourceCode]}`}></i>
                                                    </div>
                                                </div>
                                            </td> */}
                                            <td>
                                                <h5 className="font-size-14 mb-0">{data.sourceDescription}</h5>
                                            </td>
                                            {/* <td>
                                                <div id="spak-chart1"></div>
                                            </td> */}
                                            <td>
                                                <p className="text-muted mb-0">{data.count}</p>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                    {/*<div className="tab-pane  mb-3" id="reasonCodes">
                        <table className="table table-hover mb-0 table-centered table-nowrap ">
                            <tbody>
                                <tr>
                                    <td style={{ width: "60px" }}>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-globe"></i>
                                            </div>
                                        </div>
                                    </td>

                                    <td>
                                        <h5 className="font-size-14 mb-0">Internet Issues</h5>
                                    </td>
                                    <td>
                                        <div id="spak-chart1"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1200</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-phone-missed"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 className="font-size-14 mb-0">Outgoing Calls</h5>
                                    </td>

                                    <td>
                                        <div id="spak-chart2"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1345</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-wifi-off"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 className="font-size-14 mb-0">Network Issues</h5>
                                    </td>
                                    <td>
                                        <div id="spak-chart3"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1456</p>
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-file-text"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 className="font-size-14 mb-0">Billing</h5>
                                    </td>
                                    <td>
                                        <div id="spak-chart4"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1456</p>
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-minimize-2"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 className="font-size-14 mb-0">Porting</h5>
                                    </td>
                                    <td>
                                        <div id="spak-chart5"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1456</p>
                                    </td>

                                </tr>
                                <tr>
                                    <td>
                                        <div className="avatar-xs">
                                            <div className="avatar-title bg-primary rounded-circle">
                                                <i className="fe-minimize-2"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h5 className="font-size-14 mb-0">Others</h5>
                                    </td>
                                    <td>
                                        <div id="spak-chart5"></div>
                                    </td>
                                    <td>
                                        <p className="text-muted mb-0" style={{ cursor: "pointer" }} onclick="location.href='ticket-list-from-dashboard.html'">1456</p>
                                    </td>

                                </tr>
                            </tbody>
                        </table>
    </div>*/}
                </div>
            </div>
        </div>
    )
}

export default TopFive;