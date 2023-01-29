import React from 'react'
import User from '../assets/images/profile.jpg'


function customerDetails() {
    return (
        <div>
            <div className="row bg-light headerbg1">
                <div className="col-8">
                    <h4 id="list-item-0">Mubashar H. Khokhar - Customer ID 100001</h4>
                </div>
                <div className="col-4"> <span className="p-1 float-right"><button type="button" className="btn btn-labeled btn-primary btn-sm">
                    <span className="btn-label"><i className="fa fa-edit"></i></span>Edit</button></span>
                </div>
            </div>

            <div className="row pt-2">
                <div className="col-2">
                    <img src={User} alt="customer" />
                </div>
                <div className="col-10">
                    {/* <span style={{float:'right'}}><button className="btn btn-labeled btn-primary btn-sm"><span className="btn-label"><i className="fa fa-edit"></i></span>Edit</button></span> */}
                    <div className="row">
                        <div className="col-md-3">
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputName" className="col-form-label">Customer Name</label>
                                    <p>Mubashar H. Khokhar</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">Address line 2</label>
                                    <p>Lebuhraya Sultan Hassanal Bolkiah</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">Primary Email</label>
                                    <p>Mubashar@gmail.com</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">City/State</label>
                                    <p>Kg Jaya Setia</p>
                                    <p>Bandar Seri Begawan</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">Primary Contact</label>
                                    <p>9989898</p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">Zip</label>
                                    <p>11234</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="row">
                                <div className="form-group">
                                    <label for="inputState" className="col-form-label">Address line 1</label>
                                    <p>13 M Block, Royal Enclave</p>
                                </div>
                            </div>
                            <div className="row alert alert-light bg-light pl-2 pr-2">
                                <div className="form-group">
                                    Main Credits
                                    <h4><span className="badge badge-outline-secondary">BND 2</span></h4>
                                </div>
                                <div className="form-group">
                                    Account Status :
                                    <h4><span className="badge badge-outline-success">Active</span></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default customerDetails
