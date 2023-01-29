import React, { useState } from "react";

const InlineSpinner = (props) => {
  return (
    <div id="loading" style={{ display : "block", opacity: 0.8, 
        position: "fixed", top: 0, left: 0,  bottom: 0, right: 0}}>
      <div style={{width: "100%", height: "100%", position: "relative"}}>
        <div style={{left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>
          <div className="spinner">{props.data}</div>
        </div>
      </div>
    </div>
  );
};

export default InlineSpinner;
