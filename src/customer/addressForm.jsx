import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from "react-i18next";

const AddrForm = (props) => {
    const { t } = useTranslation();

    let addressData = props.data
    let setAddressData = props.handler
    let title = props.title;
    const districtLookup = props.lookups.districtLookup
    const kampongLookup = props.lookups.kampongLookup
    const postCodeLookup = props.lookups.postCodeLookup

    const [districtEl, setDistrictEl] = useState([])
    const [kampongEl, setKampongEl] = useState([])
    const [postCodeEl, setPostCodeEl] = useState([])

    const addressElements = props.lookups.addressElements

    const addressChangeHandler = props.lookupsHandler.addressChangeHandler

    const error = props.error
    const setError = props.setError
    const setDetailsValidate = props.setDetailsValidate
    const detailsValidate = props.detailsValidate

    useEffect(() => {
        let district = []
        addressElements && addressElements !== null && addressElements!== undefined && addressElements.map((a) => {
            if (addressData.village !== '' && addressData.postCode !== '') {
                if (a.kampong === addressData.village && a.postCode === addressData.postCode) {
                    if (!district.includes(a.district)) {
                        district.push(a.district)
                    }
                    return <option key={a.district} value={a.district}>{a.district}</option>
                }
            } else if (addressData.village !== '') {
                if (a.kampong === addressData.village) {
                    if (!district.includes(a.district)) {
                        district.push(a.district)
                    }
                }
            } else if (addressData.postCode !== '') {
                if (a.postCode === addressData.postCode) {
                    if (!district.includes(a.district)) {
                        district.push(a.district)
                    }
                }
            } else {
                if (!district.includes(a.district)) {
                    district.push(a.district)
                }
            }
        })
        setDistrictEl(district)
    }, [addressData.village, addressData.postCode]);

    useEffect(() => {
        let kampong = []
        addressElements.map((a) => {
            if (addressData.district !== '' && addressData.postCode !== '') {
                if (a.district === addressData.district && a.postCode === addressData.postCode) {
                    if (!kampong.includes(a.kampong)) {
                        kampong.push(a.kampong)
                    }
                }
            } else if (addressData.district !== '') {
                if (a.district === addressData.district) {
                    if (!kampong.includes(a.kampong)) {
                        kampong.push(a.kampong)
                    }
                }
            } else if (addressData.postCode !== '') {
                if (a.postCode === addressData.postCode) {
                    if (!kampong.includes(a.kampong)) {
                        kampong.push(a.kampong)
                    }
                }
            } else {
                if (!kampong.includes(a.kampong)) {
                    kampong.push(a.kampong)
                }
            }
        })
        setKampongEl(kampong)
    }, [addressData.district, addressData.postCode]);

    useEffect(() => {
        let postCode = []
        addressElements.map((a) => {
            if(addressData.district !== '' && addressData.village !== '') {
                if(a.district === addressData.district && a.kampong === addressData.village) {
                    if (!postCode.includes(a.postCode)) {
                        postCode.push(a.postCode)
                    }
                }
            } else if(addressData.district !== '') {
                if(a.district === addressData.district) {
                    if (!postCode.includes(a.postCode)) {
                        postCode.push(a.postCode)
                    }
                }
            } else if(addressData.village !== '') {
                if(a.kampong === addressData.village) {
                    if (!postCode.includes(a.postCode)) {
                        postCode.push(a.postCode)
                    }
                }
            } else {
                if (!postCode.includes(a.postCode)) {
                    postCode.push(a.postCode)
                }
            }
        })
        setPostCodeEl(postCode)
    }, [addressData.district, addressData.village]);

    return (
        <div className="row ">
            <div className="col-12">
                <div className="p-2">
                    <div className="">
                        <fieldset className="scheduler-border1">
                            <legend className="scheduler-border scheduler-box"> {props.title && title && title !== null && title!== undefined ?t(title) : t("customer_address")}</legend>
                            <form id="address-form">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="flatHouseUnitNo" className="col-form-label">Flat/House/Unit No<span>*</span></label>
                                            <input type="text" value={addressData.flatHouseUnitNo} className={`form-control ${(error.flatHouseUnitNo ? "input-error" : "")}`} id="flatHouseUnitNo" placeholder="Flat/House/Unit No"
                                               maxlength="8"
                                                onChange={(e) => {
                                                    setError({ ...error, flatHouseUnitNo: '' })
                                                    setAddressData({ ...addressData, flatHouseUnitNo: e.target.value })
                                                }
                                                }
                                            />
                                            <span className="errormsg">{error.flatHouseUnitNo || !detailsValidate.flatNo ? detailsValidate.flatNo && !error.flatHouseUnitNo ? "" : error.flatHouseUnitNo ? error.flatHouseUnitNo : "Length more than 8 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="block" className="col-form-label">Block</label>
                                            <input type="text" className={`form-control ${(error.block ? "input-error" : "")}`} value={addressData.block} id="block" placeholder="Block"
                                                maxlength="10"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, block: e.target.value })
                                                    setError({ ...error, block: '' });
                                                }} />
                                            <span className="errormsg">{error.block || !detailsValidate.block ? detailsValidate.block && !error.block ? "" : error.block ? error.block : "Length more than 10 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="building" className="col-form-label">Building Name/Others</label>
                                            <input type="text" className={`form-control ${(error.building ? "input-error" : "")}`} value={addressData.building} id="building" placeholder="Building Name/Others"
                                                maxlength="20"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, building: e.target.value })
                                                    setError({ ...error, building: '' })
                                                }} />
                                            <span className="errormsg">{error.building || !detailsValidate.building ? detailsValidate.building && !error.building ? "" : error.building ? error.building : "Length more than 20 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="simpang" className="col-form-label">Simpang<span>*</span></label>
                                            <input type="text" value={addressData.street} className={`form-control ${(error.street ? "input-error" : "")}`} id="simpang" placeholder="Simpang"
                                                maxlength="50"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, street: e.target.value })
                                                    setError({ ...error, street: '' })
                                                }} />
                                            <span className="errormsg">{error.street || !detailsValidate.simpang ? detailsValidate.simpang && !error.street ? "" : error.street ? error.street : "Length more than 50 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="jalan" className="col-form-label">Jalan<span>*</span></label>
                                            <input type="text" value={addressData.road} className={`form-control ${(error.road ? "input-error" : "")}`} id="jalan" placeholder="Jalan"
                                                maxlength="50"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, road: e.target.value })
                                                    setError({ ...error, road: '' })
                                                }} />
                                            <span className="errormsg">{error.road || !detailsValidate.jalan ? detailsValidate.jalan && !error.road ? "" : error.road ? error.road : "Length more than 50 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="district" className="col-form-label">District<span>*</span></label>
                                            <select id="district" className={`form-control ${(error.district ? "input-error" : "")}`} value={addressData.district}
                                                onChange={(e) => {
                                                    setError({ ...error, district: '' })
                                                    setAddressData({ ...addressData, district: e.target.value })
                                                }
                                                }>
                                                <option key="district" value="">Select District</option>
                                                {
                                                    districtEl.map((e) => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="errormsg">{error.district ? error.district : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="state" className="col-form-label">Mukim</label>
                                            <input type="text" value={addressData.state} className={`form-control ${(error.state ? "input-error" : "")}`} id="state" placeholder="Mukim"
                                                maxlength="50"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, state: e.target.value })
                                                    setError({ ...error, state: '' })

                                                }} />
                                            <span className="errormsg">{error.state || !detailsValidate.mukim ? detailsValidate.mukim && !error.state ? "" : error.state ? error.state : "Length more than 50 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="village" className="col-form-label">Kampong<span>*</span></label>
                                            <select id="village" value={addressData.village} className={`form-control ${(error.village ? "input-error" : "")}`}
                                                onChange={(e) => {
                                                    setError({ ...error, village: '' })
                                                    setAddressData({ ...addressData, village: e.target.value })
                                                }
                                                }>

                                                <option key="kampong" value="">Select Kampong</option>
                                                {
                                                    kampongEl.map((e) => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="errormsg">{error.village ? error.village : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="cityTown" className="col-form-label">City/Town<span>*</span></label>
                                            <input type="text" value={addressData.cityTown} className={`form-control ${(error.cityTown ? "input-error" : "")}`}
                                                id="cityTown"
                                                placeholder="City/Town"
                                                maxlength="30"
                                                onChange={e => {
                                                    setAddressData({ ...addressData, cityTown: e.target.value })
                                                    setError({ ...error, cityTown: '' })

                                                }} />
                                            <span className="errormsg">{error.cityTown || !detailsValidate.city ? detailsValidate.city && !error.cityTown ? "" : error.cityTown ? error.cityTown : "Length more than 30 not allowed" : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="postCode" className="col-form-label">Postcode<span>*</span></label>
                                            <select id="postCode" className={`form-control ${(error.postCode ? "input-error" : "")}`} value={addressData.postCode}
                                                onChange={(e) => {
                                                    setError({ ...error, postCode: '' })
                                                    setAddressData({ ...addressData, postCode: e.target.value })
                                                }
                                                }>
                                                <option key="postCode" value="">Select Postcode</option>
                                                {

                                                    postCodeEl.map((e) => (
                                                        <option key={e} value={e}>{e}</option>
                                                    ))
                                                }
                                            </select>
                                            <span className="errormsg">{error.postCode ? error.postCode : ""}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="country" className="col-form-label">Country(Negra)<span >*</span></label>
                                            <select id="country" className={`form-control ${(error.country ? "input-error" : "")}`} value={addressData.country}
                                                onChange={e => { setAddressData({ ...addressData, country: e.target.value }); setError({ ...error, country: '' }) }}>
                                                <option value="">Select Country(Negra)</option>
                                                <option value="Brunei Darussalam">Brunei Darussalam</option>
                                            </select>
                                            <span className="errormsg">{error.country ? error.country : ""}</span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default AddrForm;