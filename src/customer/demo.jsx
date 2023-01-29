import React from 'react';
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'



const Demo = () => {




    return (
        <div className="row mt-1">
            <div className="col-12">
                <div className="card-box">
                    <div className="d-flex"></div>
                    <div style={{ marginTop: '18px' }}>
                        <div className="testFlex">
                            <div className="col-2">
                                <nav className="navbar navbar-default navbar-fixed-top">
                                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                        <ul className="nav navbar-nav">
                                            <li><Link activeclassName="active" className="test1" to="Customer" spy={true} smooth={true} duration={500} >Customer</Link></li>
                                            <li><Link activeclassName="active" className="test2" to="Complaint" spy={true} smooth={true} duration={500}>Complaint</Link></li>
                                            <li><Link activeclassName="active" className="test3" to="followUp" spy={true} smooth={true} duration={500} >Follow UP</Link></li>
                                            <li><Link activeclassName="active" className="test4" to="appoinment" spy={true} smooth={true} duration={500}>Appoinment</Link></li>
                                        </ul>
                                    </div>

                                </nav>
                            </div>
                            <div className="new-customer col-8 p-0">
                                <Element name="Customer" className="element" >
                                    Customer
                                </Element>

                                <Element name="Complaint" className="element">
                                    Complaint
                                </Element>

                                <Element name="followUp" className="element">
                                    Follow UP
                                </Element>

                                <Element name="appoinment" className="element">
                                    Appoinment
                                </Element>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>





    );
};

export default Demo;