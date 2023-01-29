/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import Header from "../common/header";
import CustomerDetails from './customerDetails'
import ScrollTabs from './ScrollTabs'
import ServiceRequest from './serviceRequestHistory'
import TopPlans from './topPlans'
import { useParams } from "react-router";
import { showSpinner, hideSpinner } from "../common/spinner";
import { toast } from "react-toastify";
import { get } from "../util/restUtil";
import { properties } from "../properties";

function EditCustomer() {
  const [data, setData] = useState([])
  let id = useParams();
  const custID = sessionStorage.getItem("customerQuickSearchInput")
  const accessToken = localStorage.getItem("accessToken");

  useEffect(async () => {
    showSpinner()
    get(properties.CUSTOMER_API + `/id=29`)
      .then((resp) => {
        if (resp.data) {
          if (resp.status === 200) {
            toast.success("Customer Details Fetched Successfully");
            setData(resp.data);
          } else {
            toast.error("Failed to call get Customer - " + resp.status);
          }
        } else {
          toast.error("Uexpected error ocurred " + resp.statusCode);
        }
      }).finally(hideSpinner);
  }, []);

  return (
    <div>
      <div className="container-fluid">
        <div className="navbar-custom">
          <Header></Header>

        </div>
      </div>
      <div className="row" style={{ marginTop: '6.75rem' }}>
        <div className="col-12">
          <div className="page-title-box">
            <h4 className="page-title text-left">Customer 360</h4>
          </div >
        </div >
      </div >
      <div className="row mt-1" >
        <div className="col-lg-12" >
          <div className="card-box" >
            <div className="row" >
              <div className="col-2" ></div >
              <div className="col-10 p-0" >
                <CustomerDetails data={data} custID={custID} />
                <TopPlans />
                <ScrollTabs data={data} />

                <ServiceRequest />
              </div >
            </div >

          </div >
        </div >
      </div >
    </div >

  );
}

export default EditCustomer;
