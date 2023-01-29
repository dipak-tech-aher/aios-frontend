import React, { useState } from "react";

function AccountDetails(props) {
  let data = props && props.data.account[0];
  let serviceData = props && props.data.account[0].service[0];
  const [flag, setFlag] = useState(false);
  const [accountFlag, setAccountFlag] = useState(true);
  const showMore = () => {
    setFlag(!flag);
  };

  const accountView = () => {
    setAccountFlag(!accountFlag);
  }

  return (
    <div>
      <div className={accountFlag ? 'd-block' : 'd-none'}>
        <div className="col-12 pr-2 pt-2 pl-2">
          <div className="row">
            <div className="col-3">
              <p>Account Status</p>
              <p>{data && data?.status}</p>
            </div>
            <div className="col-3">
              <p>Account Category</p>
              <p>{data?.category}</p>
            </div>
            <div className="col-3">
              <p>Account Type</p>
              <p>{data?.accountType}</p>
            </div>
            <div className="col-3">
              <p>Account Creation Date</p>
              <p>{data?.registeredDate}</p>
            </div>
          </div>
          <div id="accountFinancials" className={flag ? "d-block" : "d-none"}>
            <div className="row">
              <div className="col-3">
                <p>ID Type</p>
                <p>{data?.idType}</p>
              </div>
              <div className="col-3">
                <p>ID Number</p>
                <p>{data?.idNbr}</p>
              </div>
              <div className="col-3">
                <p>Bill Language</p>
                <p>{data?.class}</p>
              </div>
            </div>
            <div className="row m-0">
              <h5>Service Address</h5>
            </div>
            <div className="row">
              <div className="col-3">
                <label className="form-label">Address Line 1</label>
                <p>
                  {data?.billingAddress[0]?.flatHouseUnitNo}{" "}
                  {data?.billingAddress[0]?.block}{" "}
                  {data?.billingAddress[0]?.building}{" "}
                </p>
              </div>
              <div className="col-3">
                <label className="form-label">Address line 2</label>
                <p>
                  {data?.billingAddress[0]?.street}{" "}
                  {data?.billingAddress[0]?.road}{" "}
                  {data?.billingAddress[0]?.district}{" "}
                </p>
              </div>
              <div className="col-3">
                <label className="form-label">City/State</label>
                <p>{data?.billingAddress[0]?.cityTown}</p>
                <p>{data?.billingAddress[0]?.country}</p>
              </div>
              <div className="col-3">
                <label className="form-label">Zip</label>
                <p>{data?.billingAddress[0]?.postCode}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p>Bill Cycle</p>
                <p></p>
              </div>
              <div className="col-3">
                <p>Base Collection Plan</p>
                <p></p>
              </div>
              <div className="col-3">
                <p>Current Outstanding</p>
                <p></p>
              </div>
            </div>
            <div className="row">
              <div className="col-3">
                <p>Main Balance</p>
                <p></p>
              </div>
              <div className="col-3">
                <p>Last Payment</p>
                <p></p>
              </div>
              <div className="col-3">
                <p>Last Payment Date</p>
                <p></p>
              </div>
            </div>
          </div>
          <div className="d-flex col-12 justify-content-end">
            <p
              className="text-primary waves-effect waves-light ml-2"
              style={{ cursor: "pointer" }}
              onClick={showMore}
            >
              {flag ? "...Less" : "...More"}
            </p>
          </div>
        </div>
        <div>
          <div
            id="carouselExampleControls"
            className="carousel slide"
            data-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <div className="row px-4">
                  <div className="col-6">
                    <div className="card w-100 d-inline-block" id="">
                      <div className="card-header text-dark">
                        {serviceData.catalog}
                      </div>
                      <div className="card-body">
                        <div className="row ml-0">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-6 text-dark">
                                <p>Service Number</p>
                              </div>
                              <div className="col-6 text-dark">
                                <p>{serviceData.serviceId}</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 text-dark">
                                <p>Status</p>
                              </div>
                              <div className="col-6 text-dark">
                                <p>Active</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6 text-dark">
                                <p>Service Type/Plan</p>
                              </div>
                              <div className="col-6 text-dark">
                                <p> {serviceData.catalog}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex col-12 justify-content-center">
                            <span
                              onClick={accountView}
                            >
                              <i
                                className="mr-1 fas fa-ellipsis-h"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="carousel-item">
                  <div className="col-6">
                    <div className="card w-100 d-inline-block" id="">
                      <div className="card-header">
                        Mobile Post-Paid/Super Offer 599
                      </div>
                      <div className="card-body">
                        <div className="row ml-0">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-6">
                                <p>Service Number</p>
                              </div>
                              <div className="col-6">
                                <p>235199</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <p>Status</p>
                              </div>
                              <div className="col-6">
                                <p>Active</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <p>Service Type/Plan</p>
                              </div>
                              <div className="col-6">
                                <p>Mobile/599 Post paid</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex col-12 justify-content-center">
                            <span
                              onClick={accountView}
                            >
                              <i
                                className="mr-1 fas fa-ellipsis-h"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="card w-100 d-inline-block" id="">
                      <div className="card-header">
                        Mobile Post-Paid/Super Offer 599
                      </div>
                      <div className="card-body">
                        <div className="row ml-0">
                          <div className="col-12">
                            <div className="row">
                              <div className="col-6">
                                <p>Service Number</p>
                              </div>
                              <div className="col-6">
                                <p>235199</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <p>Status</p>
                              </div>
                              <div className="col-6">
                                <p>Active</p>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-6">
                                <p>Service Type/Plan</p>
                              </div>
                              <div className="col-6">
                                <p>Mobile/599 Post paid</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="d-flex col-12 justify-content-center">
                            <span
                              onClick={accountView}
                            >
                              <i
                                className="mr-1 fas fa-ellipsis-h"
                                style={{ fontSize: "1.5rem" }}
                              ></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={accountFlag ? 'd-none' : 'd-block'}>

        <div id="service-wide" className=" text-dark">
          <div className="card">
            <div className="card-body">
              <div className="col-6 float-left m-0 p-0 mb-2">
                <ul className="nav">
                  <li className="nav-item">
                    <a
                      id="s1"
                      className="btn btn-sm btn-outline-primary text-primary active"
                      onclick="$('#b1').removeClass('active');$('#v1').removeClass('active');$('#s1').addClass('active');$('#service-details').show();$('#booster-details').hide();$('#vas-details').hide();"
                    >
                      Manage Service
                    </a>
                  </li>
                  <li className="ml-2 nav-item">
                    <a
                      id="b1"
                      className="btn btn-sm btn-outline-primary text-primary"
                      onclick="$('#s1').removeClass('active');$('#v1').removeClass('active');$('#b1').addClass('active');$('#service-details').hide();$('#booster-details').show();$('#vas-details').hide();"
                    >
                      Manage Boosters
                    </a>
                  </li>
                  <li className="ml-2 nav-item">
                    <a
                      id="v1"
                      className="btn btn-sm btn-outline-primary text-primary"
                      onclick="$('#s1').removeClass('active');$('#b1').removeClass('active');$('#v1').addClass('active');$('#service-details').hide();$('#booster-details').hide();$('#vas-details').show();$('#vas1-form').hide();$('#vas2-form').hide();"
                    >
                      Manage VAS
                    </a>
                  </li>
                </ul>
              </div>
              <div className="col-6 float-right text-right m-0 p-0 mb-2">
                <span
                  onClick={accountView}
                >
                  <i className="far fa-times-circle" style={{ fontSize: '1rem' }}></i>
                </span>
              </div>
              <div id="service-details" className="m-0 p-0 d-block">
                <div className="d-flex flex-row col-12 ml-0 mb-2">
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#upgrade-form').show();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 fas fa-arrow-circle-up"></i>
                    <span id="upgradeText">Upgrade</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#downgrade-form').show();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 fas fa-arrow-circle-down" ></i>
                    <span>Downgrade</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#relocate-form').show();$('#teleport-section').hide();$('#teleport-preview-section').hide();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 fas fa-plane-departure" ></i>
                    <span>Teleport</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#relocate-form').show();$('#teleport-section').show();$('#teleport-preview-section').show();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 fas fa-truck-moving" ></i>
                    <span>Relocate</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#changesim-form').show();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 fas fa-sim-card" ></i>
                    <span>Change SIM</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onclick="$('#service-panel').hide();$('#changesvcnbr-form').show();$(this).children('span').css('text-decoration', 'underline 2px');"
                    style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 fas fa-exchange-alt"></i>
                    <span>Change Service Nbr</span>
                    <span className="ml-2"></span>
                  </a>
                  <a
                    href="#"
                    onClick={accountView} style={{ fontSize: '.85rem' }}
                  >
                    <i className="mr-1 ml-2 far fa-minus-square" ></i>
                    <span>Terminate</span>
                  </a>
                </div>
                <div id="service-panel" className="row m-0">
                  <div className="col-12">
                    <div className="row m-0">
                      <h5>Service Details</h5>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label text-dark">Service Number</label>
                        <p>
                          <span className='text-dark'>235199</span>
                        </p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Status</label>
                        <div id="active-status" className="row m-0">
                          <span data-toggle="dropdown text-dark">Active</span>
                          <span data-toggle="dropdown">
                            <i className="ml-2 text-primary fas fa-ban"></i>
                          </span>
                          <div className="dropdown">
                            <div className="dropdown-menu dropdown-menu-right">
                              <div className="card">
                                <div className="card-body">
                                  <form id="bar-unbar-form">
                                    <div className="d-flex flex-column justify-content-center">
                                      <select id="reason" className="form-control">
                                        <option>Select Reason</option>
                                        <option>Reason 1</option>
                                        <option>Reason 2</option>
                                      </select>
                                    </div>
                                    <div className="mt-2 d-flex flex-row justify-content-center">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary waves-effect waves-light btn-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type=" button"
                                        className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2"
                                      >
                                        Bar
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="inactive-status" className="row m-0">
                          <div className="dropdown">
                            <div className="dropdown-menu dropdown-menu-right">
                              <div className="card">
                                <div className="card-body">
                                  <form id="bar-unbar-form">
                                    <div className="d-flex flex-column justify-content-center">
                                      <select id="reason" className="form-control">
                                        <option>Select Reason</option>
                                        <option>Reason 1</option>
                                        <option>Reason 2</option>
                                      </select>
                                    </div>
                                    <div className="mt-2 d-flex flex-row justify-content-center">
                                      <button
                                        type="button"
                                        className="btn btn-outline-secondary waves-effect waves-light btn-sm"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type=" button"
                                        className="btn btn-outline-primary text-primary btn-sm  waves-effect waves-light ml-2"
                                      >
                                        Unbar
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Service Type</label>
                        <p>{serviceData.catalog}</p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Installation Date</label>
                        <p className='text-dark'></p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label text-dark">Service Start Date</label>
                        <p>
                          <span className='text-dark'>11/1/21</span>
                        </p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Number Group</label>
                        <p>
                          <span className='text-dark'></span>
                        </p>
                      </div>
                    </div>
                    <div className="row m-0">
                      <h5>Plan Details</h5>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label text-dark">Plan Name</label>
                        <p className='text-dark'>{serviceData.catalog}</p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Start Date/Expiry Date</label>
                        <p className='text-dark'></p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Charge Amount</label>
                        <p className='text-dark'>{serviceData.deposit.charge}</p>
                      </div>
                      <div className="col-3">
                        <label className="form-label text-dark">Credit Limit</label>
                        <p className='text-dark'></p>
                      </div>
                    </div>
                    <div className="row m-0">
                      <h5>Service Address</h5>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label">Address Line 1</label>
                      </div>
                      <div className="col-3">
                        <label className="form-label">Address line 2</label>
                        <p></p>
                      </div>
                      <div className="col-3">
                        <label className="form-label">City/State</label>
                        <p></p>
                        <p></p>
                      </div>
                      <div className="col-3">
                        <label className="form-label">Zip</label>
                        <p>11234</p>
                      </div>
                    </div>
                    <div className="row m-0">
                      <h5>SIM Card Details</h5>
                    </div>
                    <div className="row">
                      <div className="col-3">
                        <label className="form-label">PIN</label>
                        {/* <p>12345</p> */}
                      </div>
                      <div className="col-3">
                        <label className="form-label">ICCID</label>
                        {/* <p>12345</p> */}
                      </div>
                      <div className="col-3">
                        <label className="form-label">PUK</label>
                        {/* <p>12345</p> */}
                      </div>
                      <div className="col-3">
                        <label className="form-label">IMSI</label>
                        {/* <p>11234</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
