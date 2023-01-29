import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { showSpinner, hideSpinner } from "../../common/spinner";
import { UltimateTextToImage } from "ultimate-text-to-image";

const randomGenerator = require("randomstring");

const BCAECaptcha = (props) => {

    const setCaptchaValidityStatus = props.handler.setCaptchaValidityStatus
    const login = props.handler.login

    const [captchaURL, setCaptchaURL] = useState();
    const [captchaValue, setCaptchaValue] = useState();
    const [captchaText, setCaptchaText] = useState();

    useEffect(() => {
       // console.log('Generating Captcha')
        genCaptcha()
    }, [])

    const captchaRefresh = () => {
        genCaptcha()
    }

    const genCaptcha = () => {

        showSpinner();

        const val = randomGenerator.generate(6)

        // const el = document.createElement('h4')
        // el.innerHTML = val
        // el.style.fontFamily = "Tahoma, 'Courier New', serif, monospace"
        // el.style.letterSpacing = "5px"
        // el.style.textAlign = "center"
        // el.style.padding = "0px"
        // el.style.paddingTop = "5px"
        // el.style.margin = "0px"
        // el.style.verticalAlign = "middle"
        // el.style.fontSize = "2em"

        // toPng(el, { width: 200, height: 50 })
        //     .then(function (dataUrl) {
        //         setCaptchaURL(dataUrl)
        //         setCaptchaValue(val)
        //         setCaptchaValidityStatus(false)
        //     })
        //     .catch(function (error) {
        //         hideSpinner()
        //         toast.error('Unable to generate captcha', error)
        //     });

        const dataUrl = new UltimateTextToImage(val, {
            width: 200,
            height: 50,
            fontFamily: "Tahoma",
            fontSize: 36,
            align: "center",
            valign: "middle"
        }).render().toDataUrl();
        setCaptchaURL(dataUrl)
        setCaptchaValue(val)
        setCaptchaValidityStatus(false)
        hideSpinner()
    }

    return (
        <div className="bcaeCaptcha">
            {
                (captchaURL) ?
                    <>
                        <div className="d-flex align-items-center">
                            <img src={captchaURL} />
                            <button className="btn btn-primary" type="button" onClick={captchaRefresh} style={{ padding: "0px", width: "20px", height: "25px" }}>
                                <i className="mdi mdi-rotate-right md-18"></i>
                            </button>
                        </div>
                        <div className="d-flex">
                            <input
                                className="form-control"
                                style={{ width: "220px", border: "1 px" }}
                                type="text"
                                placeholder="Enter captcha text"
                                value={captchaText}
                                onChange={(e) => {
                                    if (e.target.value === captchaValue) {
                                        setCaptchaValidityStatus(true)
                                    } else {
                                        setCaptchaValidityStatus(false)
                                    }
                                    setCaptchaText(e.target.value);
                                }}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") login();
                                }}
                            />
                        </div>
                    </>
                    :
                    <div style={{ marginTop: "10px" }}>Loading captcha...</div>
            }
        </div>
    )
}

export default BCAECaptcha;