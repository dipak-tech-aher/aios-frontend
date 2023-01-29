import React from 'react'
const KioskRefUI = (props) => {
  let inquiryData = props.data.inquiryData
  
  return (
    <div id="customer-details" style={{ display: 'block' }}>
      <div className="row">
        <div className="col-md-6">
          <div className="form-group">
            <label className="col-form-label">Usage</label>
            <div className="progress" style={{ height: '1.5rem' }}>
              <div className="progress-bar" role="progressbar" style={{ width: '45%', backgroundColor: '#f58521' }} aria-valuenow={45} aria-valuemin={0} aria-valuemax={100}>{inquiryData.usage}GB</div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="col-form-label">Speed</label>
            <div className="progress" style={{ height: '1.5rem' }}>
              <div className="progress-bar" role="progressbar" style={{ width: '25%', backgroundColor: '#f58521' }} aria-valuenow={25} aria-valuemin={0} aria-valuemax={100}>{inquiryData.speed}Mbps</div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="inputName" className="col-form-label">Customer Name</label>
            <p>{inquiryData.lastName + " " + inquiryData.firstName}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="inputState" className="col-form-label">Contact Number</label>
            <p>{inquiryData.contactNo}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="inputState" className="col-form-label">Service Type</label>
            <p>{inquiryData.product}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label htmlFor="inputState" className="col-form-label">Usage Type</label>
            <p>{(inquiryData.payload!==null?inquiryData.payload.usageType:'NA')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default KioskRefUI
