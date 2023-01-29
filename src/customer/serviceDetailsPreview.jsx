import InstallationAddressPreview from "./addressPreview";

const CustomerServicePreviewDetails = (props) => {

    const fixedCatalog = ["Fixed"]
    const mobileCatalog = ["Prepaid", "Postpaid"]

    let serviceData = props.data.serviceData
    let installationAddress = props.data.installationAddress
    let fixedService = props.data.fixedService
    let mobileService = props.data.mobileService
    let creditProfile = props.data.creditProfile
    let payment = props.data.payment
    let gsm = props.data.gsm
    let deposit = props.data.deposit
    let plansList = props.data.plansList
    let portIn = props.data.portIn

    return (
        <>
            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Service Selection Details</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Catalog</label>
                        <p>{serviceData.catalogDesc}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="inputState" className="col-form-label">Product</label>
                        <p>{serviceData.productDesc}</p>
                    </div>
                </div>
            </div>
            {
                (serviceData.product !== '') ?
                    <>
                        <div className="form-row col-12 p-0 ml-0 mr-0 mt-2">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Selected Plan Details</h5>
                            </div>
                        </div>
                        {
                            plansList.current.map((p) => {
                                return (
                                    (Number(p.planId) === Number(serviceData.product)) ?
                                        <div className="row mt-2 select-plan">
                                            <div className="col-lg-6">
                                                <div className="card card-body border p-0">
                                                    <div className="d-flex justify-content-center card-header p-0">
                                                        <h5>{p.planName}</h5>
                                                    </div>
                                                    <div className="text-center pt-1 pb-2 pl-2">
                                                        <div className="col-12">
                                                            <div className="row">
                                                                <div className="col-5">
                                                                    <label className="col-form-label">ServiceType</label>
                                                                </div>
                                                                <div className="col-7 pt-2">
                                                                    {p.prodType}
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-5">
                                                                    <label className="col-form-label">Plan</label>
                                                                </div>
                                                                <div className="col-7 pt-2">
                                                                    {p.planName}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {
                                                            <div className="row">
                                                                <div className="col-5">
                                                                    <label className="col-form-label">Rental</label>
                                                                </div>
                                                                <div className="col-7">
                                                                    {
                                                                        (p.charge) ?
                                                                            <h4 className="text-dark text-center">${p.charge}</h4>
                                                                            :
                                                                            <></>
                                                                    }

                                                                </div>
                                                            </div>

                                                        }
                                                    </div>
                                                    <div className="mt-1 table-responsive pl-2 pr-2">
                                                        <table className="table border">

                                                            <thead>
                                                                <tr className="bg-light">
                                                                    <th className="text-center">Type</th>
                                                                    <th className="text-center">Quota</th>
                                                                    <th className="text-center">Units</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    p.planoffer.map((o) => {
                                                                        return (
                                                                            <tr>
                                                                                <td className="text-center bold">{o.offerType}</td>
                                                                                <td className="text-center">{o.quota}</td>
                                                                                <td className="text-center">{o.units}</td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        :
                                        <></>
                                )
                            })
                        }
                    </>
                    :
                    <></>
            }

            {
                fixedCatalog.includes(serviceData.prodType) ?
                    <>
                        <div className="form-row col-12 p-0 ml-0 mr-0 mt-2">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Installation Address</h5>
                            </div>
                        </div>
                        {
                            (installationAddress.sameAsCustomerAddress) ?
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="form-group">
                                            <label htmlFor="inputState" className="col-form-label">Installation Address</label>
                                            <p><strong>Same as Customer Address</strong></p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <InstallationAddressPreview data={{
                                    title: "installation_address",
                                    addressData: installationAddress
                                }}
                                />
                        }
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Service Number Details</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Service Number Group</label>
                                    <p>{fixedService.serviceNumberGroupDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Exchange Code</label>
                                    <p>{fixedService.exchangeCodeDesc}</p>
                                </div>
                            </div>

                        </div>
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Access Number Selection</h5>
                            </div>
                        </div>
                        <div className="row">
                            {
                                (fixedService.serviceNumberSelection === 'auto') ?
                                    <>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Auto Selection from Pool</label>
                                                <p><strong>Yes</strong></p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                (fixedService.serviceNumberSelection === 'manual') ?
                                    <>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Manual Selection from Pool</label>
                                                <p><strong>Yes</strong></p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Access Number</label>
                                                <p><strong>{fixedService.accessNbr}</strong></p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Credit Profile</label>
                                    <p>{creditProfile.creditProfileDesc}</p>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
            {
                mobileCatalog.includes(serviceData.prodType) ?
                    <>
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Dealership</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Dealership</label>
                                    <p>{mobileService.dealershipDesc}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputState" className="col-form-label">Number Group</label>
                                    <p>{mobileService.nbrGroupDesc}</p>
                                </div>
                            </div>
                        </div>
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Access Number Selection</h5>
                            </div>
                        </div>
                        <div className="row">
                            {
                                (mobileService.serviceNumberSelection === 'auto') ?
                                    <>
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Auto Selection from Pool</label>
                                                <p><strong>Yes</strong></p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                            {
                                (mobileService.serviceNumberSelection === 'manual') ?
                                    <>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Manual Selection from Pool</label>
                                                <p><strong>Yes</strong></p>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="inputState" className="col-form-label">Access Number</label>
                                                <p><strong>{mobileService.accessNbr}</strong></p>
                                            </div>
                                        </div>
                                    </>
                                    :
                                    <></>
                            }
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Credit Profile</label>
                                    <p>{creditProfile.creditProfileDesc}</p>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
            {
                mobileCatalog.includes(serviceData.prodType) ?
                    <>
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">GSM Details</h5>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">Assign SIM Later</label>
                                    <p>{(gsm.assignSIMLater) ? 'Yes' : 'No'}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">ICCID</label>
                                    <p className="donor">{gsm.iccid}</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label htmlFor="inputName" className="col-form-label">IMSI</label>
                                    <p className="donor">{gsm.imsi}</p>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
            {
                (serviceData.prodType !== 'Prepaid') ?
                    <>
                        <div className="form-row col-12 p-0 ml-0 mr-0">
                            <div className="col-12 pl-2 bg-light border">
                                <h5 className="text-primary">Deposit</h5>
                            </div>
                        </div>
                        {
                            (deposit.includeExclude === 'include') ?
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Deposit</label>
                                            <p>
                                                <span>{deposit.chargeDesc}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                        {
                            (deposit.includeExclude === 'exclude') ?
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="inputName" className="col-form-label">Exclude Reason</label>
                                            <p>
                                                <span>{deposit.excludeReason}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                :
                                <></>
                        }
                    </>
                    :
                    <></>
            }

            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Payment Method</h5>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="inputName" className="col-form-label">Payment Method</label>
                        <p>
                            <span>{payment.paymentMethodDesc}</span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="form-row col-12 p-0 ml-0 mr-0">
                <div className="col-12 pl-2 bg-light border">
                    <h5 className="text-primary">Portin</h5>
                </div>
            </div>

            <div className="row">
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="portIn" className="col-form-label">Port In</label>
                        <p>
                            <span>{portIn.portInChecked ? "Yes" : "No"}</span>
                        </p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="donor" className="col-form-label">Donor</label>
                        <p>
                            <span>{portIn.donorDesc}</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default CustomerServicePreviewDetails;