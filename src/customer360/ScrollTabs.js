import React, { useState } from 'react'
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import data from './scrollData.json'
import './scroll.css'
import NewCustomerAccount from '../customer/newCustomerAccount';
import NewCustomerService from '../customer/newCustomerService';
import Modal from 'react-modal'
const { TabPane } = Tabs;

const ScrollTabs = () => {
    const [openAccModal, setAccOpenModal] = useState(false)
    const [openSerModal, setServiceOpenModal] = useState(false)
    function callback(key) {
    }
    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="card-box">
                            <div className="row">
                                <div className="col-12 p-0">

                                    <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="scrollspy-div pr-2">
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div className="float-left"><h4 id="list-item-1">Accounts and Services</h4></div>
                                            <div className="add-button">
                                                <button className="btn btn-sm btn-primary p-1" onClick={() => setAccOpenModal(true)}><span className="btn-label"><i className="fa fa-plus"></i></span> Add Account</button>
                                                <button className="btn btn-sm btn-primary p-1" onClick={() => setServiceOpenModal(true)}><span className="btn-label"><i className="fa fa-plus"></i></span> Add Service</button>
                                            </div>
                                        </div>
                                        {(openAccModal) ?
                                            <div>
                                                <Modal isOpen={openAccModal}>

                                                    {/* <NewCustomerAccount /> */}
                                                    <NewCustomerAccount />

                                                    <button className="close-btn" onClick={() => setAccOpenModal(false)} >&times;</button>
                                                </Modal>
                                            </div> :
                                            <div>
                                                <Modal isOpen={openSerModal}>
                                                    {/* <NewCustomerAccount /> */}

                                                    <NewCustomerService />
                                                    <button className="close-btn" onClick={() => setServiceOpenModal(false)} >&times;</button>
                                                </Modal>
                                            </div>
                                        }

                                        <hr />
                                        <div className="row">
                                            <div className="col-md-12">
                                                {/* <div id="tabs2" className="scroll_tabs_theme_light"> */}
                                                {/*Scroll Tabs code starts here */}
                                                <Tabs type="card" onChange={callback}>
                                                    <TabPane tab={<i className="material-icons mdi mdi-plus-circle text-primary"></i>} key="1">
                                                        {/*We can call any UI Component here */}
                                                        <h1>add content here</h1>
                                                    </TabPane>
                                                    {
                                                        data.map((id) => {
                                                            return (
                                                                <TabPane tab={<h6 className="tabs">{id.title}</h6>} key={"1" + id.title} >
                                                                    <h4>{id.content}</h4>{/*We can call any UI Component here */}
                                                                </TabPane>
                                                            )
                                                        })
                                                    }
                                                </Tabs>
                                                {/*Scroll Tabs code ends here */}
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    );
}

export default ScrollTabs;