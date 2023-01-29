import React, { useState, useEffect } from 'react'
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import './scroll.css'
import AccountDetails from './AccountDetails'
import axios from "axios";
import { useParams } from "react-router";

const { TabPane } = Tabs;

const ScrollTabs = (props) => {
    let id = useParams();
    const [data, setData] = useState([]);
    const accessToken = localStorage.getItem("accessToken");
    const [openAccModal, setAccOpenModal] = useState(false)
    const [openSerModal, setServiceOpenModal] = useState(false)

    function callback(key) {
    }

    useEffect(async () => {
        const headers = {
            "Content-Type": "application/json",
            authorization: accessToken,
        };
        // showSpinner();
        const result = await axios.get(
            `http://localhost:4000/api/customer/account-id-list/${id.id}`,
            {
                headers: headers,
            }
        );
        // hideSpinner();
        setData(result.data.data.account);
    }, []);

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mt-1">
                    <div className="col-lg-12">
                        <div className="">
                            <div className="row">
                                <div className="col-12 p-0">

                                    <div data-spy="scroll" data-target="#scroll-list" data-offset="0" className="text-left">
                                        <h4 id="list-item-1">Accounts and Services</h4>
                                        <hr />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <Tabs type="card" onChange={callback}>
                                                    <TabPane tab={<i className="material-icons mdi mdi-plus-circle text-primary"></i>} key="1">

                                                    </TabPane>
                                                    {
                                                        data?.map((id) => {
                                                            return (
                                                                <TabPane tab={<h6 className="tabs">{id.accountId}</h6>} key={"1" + id.accountId} >
                                                                    {/* <h4>{id.content}</h4>We can call any UI Component here */}
                                                                    <AccountDetails data={props.data} />
                                                                    {/* <Carousel/> */}
                                                                </TabPane>
                                                            )
                                                        })
                                                    }
                                                </Tabs>

                                            </div>
                                        </div>

                                        <hr />
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div id="tabs2" className="scroll_tabs_theme_light">
                                                    Scroll Tabs code starts here
                                                    <Tabs type="card" onChange={callback}>
                                                        <TabPane tab={<i className="material-icons mdi mdi-plus-circle text-primary"></i>} key="1">
                                                            We can call any UI Component here
                                                            <h1>add content here</h1>
                                                        </TabPane>
                                                        {
                                                            data.map((id) => {
                                                                return (
                                                                    <TabPane tab={<h6 className="tabs">{id.title}</h6>} key={"1" + id.title} >
                                                                        <h4>{id.content}</h4>
                                                                        We can call any UI Component here
                                                                    </TabPane>
                                                                )
                                                            })
                                                        }
                                                    </Tabs>
                                                    Scroll Tabs code ends here
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
        </div >

    );
}

export default ScrollTabs;