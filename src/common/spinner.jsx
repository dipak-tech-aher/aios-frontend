import React, { useState } from "react";

let showSpinner;
let hideSpinner;
const Spinner = () => {
  const [spinnerCount, setSpinnerCount] = useState(0);
  showSpinner = () => {
    setSpinnerCount((prevState) => {
      return  prevState + 1;
    });
  };
  hideSpinner = () => {
    setSpinnerCount((prevState) => {
      if (prevState > 0) return prevState - 1;
      else return 0;
    });
  };
  return (
    <div
      id="loading"
      style={{ display: spinnerCount <= 0 ? "none" : "block", opacity: 0.8, zIndex: 99999, 
        position: "fixed", top: 0, left: 0,  bottom: 0, right: 0}}
    >
      <div style={{width: "100%", height: "100%", position: "relative"}}>
        <div style={{left: "50%", top: "50%", position: "absolute", transform: "translate(-50%, -50%)"}}>
        <div className="spinner"></div>
        </div>
      </div>
    </div>
  );
};

export default Spinner;
export { showSpinner, hideSpinner };
