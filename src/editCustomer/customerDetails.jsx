import React from 'react'
import User from '../assets/images/profile.jpg'


function CustomerDetails(props) {
    const data = props?.data;

    return (
        <div>
            <div className="row bg-light headerbg1">
                <div className="col-8">
                    <h4 id="list-item-0">Mubashar H. Khokhar - Customer ID {props.custID}</h4>
                </div>
                <div className="col-md-4" > <span className="p-1 float-right"><button type="button" className="btn btn-labeled btn-primary btn-sm">
                    <span className="btn-label"><i className="fa fa-edit"></i></span > Edit</button ></span >
                </div >
            </div >

            <div className="row pt-2" >
                <div className="col-2" >
                    <img src={User} alt="customer" />
                </div >
                <div className="col-10" >
                    <div className="row" >
                        <div className="col-md-3" >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputName" className="col-form-label" > Customer Name</label >
                                    <p>{data?.foreName} {data?.surName}</p>
                                </div >
                            </div >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > Address line 2</label >
                                </div >
                            </div >
                        </div >
                        <div className="col-md-3" >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > Primary Email</label >
                                    <p>{data?.email}</p>
                                </div >
                            </div >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > City / State</label >

                                </div >
                            </div >
                        </div >
                        <div className="col-md-3" >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > Primary Contact</label >
                                    <p>{data?.contactNbr}</p>
                                </div >
                            </div >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > Zip</label >
                                </div >
                            </div >
                        </div >
                        <div className="col-md-3" >
                            <div className="row" >
                                <div className="form-group" >
                                    <label for="inputState" className="col-form-label" > Address line 1</label >
                                </div >
                            </div >
                            <div className="row alert alert-light bg-light pl-2 pr-2" >
                                <div className="form-group" >
                                    Main Credits
                                    < h4 > <span className="badge badge-outline-secondary" > BND 2</span ></h4 >
                                </div >
                                <div className="form-group" >
                                    Account Status:
                                    <h4><span className="badge badge-outline-success">{data?.status}</span></h4 >
                                </div >
                            </div >
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )
}

export default CustomerDetails
