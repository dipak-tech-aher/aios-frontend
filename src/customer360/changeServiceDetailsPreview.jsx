import InstallationAddressPreview from "../customer/addressPreview";

const ChangeServicePreviewDetails = (props) => {

    const fixedCatalog = ["Fixed"]
    const mobileCatalog = ["Prepaid", "Postpaid"]

    let serviceData = props.data.serviceData

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

            {
                fixedCatalog.includes(serviceData.prodType) ?
                    <>
                        <div className="col-12 pl-2 bg-light border mt-2">
                            <h5 className="text-primary">Service Number Details</h5>
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
                        <div className="col-12 pl-2 bg-light border mt-2">
                            <h5 className="text-primary">Service Number Selection</h5>
                        </div>
                        <div className="row">
                            {
                                (fixedService.serviceNumberSelection === 'auto') ?
                                    <>
                                        <div className="col-md-3">
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

                    </>
                    :
                    <></>
            }
            {
                mobileCatalog.includes(serviceData.prodType) ?
                    <>
                        <div className="col-12 pl-2 bg-light border mt-2">
                            <h5 className="text-primary">Dealership</h5>
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
                        <div className="col-12 pl-2 bg-light border mt-2">
                            <h5 className="text-primary">Service Number Selection</h5>
                        </div>
                        <div className="row">
                            {
                                (mobileService.serviceNumberSelection === 'auto') ?
                                    <>
                                        <div className="col-md-3">
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

                    </>
                    :
                    <></>
            }


        </>
    )
}
export default ChangeServicePreviewDetails;