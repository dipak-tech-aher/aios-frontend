import React from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";

const Interactions = (props) => {

    const { openByServiceType } = props.data
    const { t } = useTranslation();

    const icons = {
        Prepaid: "fa-mobile-alt",
        Postpaid: "fa-mobile-alt",
        Fixed: "fa-wifi",
        defaultIcon: "fa-signal"
    };
    const titleText = {
        Prepaid: "Mobile-Prepaid",
        Postpaid: "Mobile-Postpaid",
        Fixed: "Fixed",
        defaultTitle: "Default"
    };
    const settings = {
        dots: true,
        autoplay: true,
        speed: 500,
        autoplaySpeed: 3000,
        arrows: false,
        cssEase: 'linear',
        centerMode: false,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="col-md-4 p-1">
            <div className="card text-white">
                <div className="card-body">
                    <div className="media">
                        <div className="media-body overflow-hidden">
                            <h5 className="header-title">{t('open_interactions_by_service_types')}</h5>
                        </div>
                        <div className="text-primary">
                            <i className="fas fa-tasks noti-icon mr-1 font-size-24"></i>
                        </div>
                    </div>
                </div>
                <div style={{ width: 'auto' }} className="card-body border-top pb-4">
                    <Slider {...settings}>
                        {!!openByServiceType.length && openByServiceType.map((item, i) => (
                            <div key={item.prodType} className="carousel-item">
                                <div className="row col-12 justify-content-center">
                                    <div className="text-center">
                                        <i className={"fas fa-2x text-primary " + ((icons[item.prodType] === undefined) ? icons['defaultIcon'] : icons[item.prodType])}></i>
                                        <p className="text-secondary">{titleText[item.prodType]}</p>
                                        <h4 className="text-dark">
                                            <p>{item.count}</p>
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
};

export default Interactions;
