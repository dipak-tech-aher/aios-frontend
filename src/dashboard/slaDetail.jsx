import { useTranslation } from "react-i18next";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

const SlaDetail = (props) => {
    const { t } = useTranslation();


    return (

        <div className="col-md-3 p-1">
            <div className="card">
                <div className="card-body">
                    <div className="media">
                        <div className="media-body overflow-hidden">
                            <h5 className="header-title">{props.sladata.title === "Service Request" ? t("service_request") : t("complaints_and_inquiry")}</h5>
                            {props.sladata.count !== "" &&
                                <h3 className="mb-0">
                                    <p>{props.sladata.count} </p>
                                </h3>
                            }
                        </div>
                        <div className="text-primary">
                            <i className={(props.sladata.title === "Service Request" ? 'fe-layers' : 'fe-bar-chart-2') + " mr-1 noti-icon"}></i>
                        </div>
                    </div>
                </div>

                <div className="card-body border-top py-3">
                    <Tabs>
                        <TabList>
                            {props.sladata.slaData &&
                                props.sladata.slaData.map((item, i) => <Tab key={i}>{item.title}</Tab>)
                            }
                        </TabList>
                        {props.sladata.slaData && props.sladata.slaData.map((sla, i) => (
                            <TabPanel key={i}>
                                <div className="row">
                                    {sla.data && sla.data.map((item, j) => (
                                        <div key={j} className="col-4">

                                            <div className="text-center">
                                                <p className="mb-2 text-truncate">{item.title}</p>
                                                <h4 className="text-danger">
                                                    <p>{item.total}</p>
                                                </h4>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </TabPanel>
                        ))}
                    </Tabs>

                </div>
            </div>
        </div>

    );
};

export default SlaDetail;
