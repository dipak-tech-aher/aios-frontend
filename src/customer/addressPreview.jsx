import { useTranslation } from "react-i18next";

const AddressPreview = (props) => {

    const { t } = useTranslation();

    let addressData = props.data.addressData
    let title = props.data.title
   

    return (
        <div className="col-md-12 pl-2 pr-2 pt-2">
            <fieldset className="scheduler-border scheduler-box">
                <legend className="scheduler-border">
                    {t(title)}
                </legend>

                {
                    (addressData.postCode !== '' || addressData.district !== '') ?
                        <>
                            <div className="row">
                                {
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="FlatNo" className="col-form-label">Flat/House/Unit No</label>
                                                <p>{(addressData.flatHouseUnitNo)? addressData.flatHouseUnitNo : '-'}</p>
                                            </div>
                                        </div>
                                   
                                }
                                {
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="Block" className="col-form-label">Block</label>
                                                <p>{(addressData.block)? addressData.block : '-'}</p>
                                            </div>
                                        </div>
                                    
                                }
                                {
                                        <div className="col-md-4">
                                            <div className="form-group">
                                                <label htmlFor="Building" className="col-form-label">Building Name/Others</label>
                                                <p>{(addressData.building)? addressData.building : '-'}</p>
                                            </div>
                                        </div>
                                    
                                }
                                {
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Simpang" className="col-form-label">Simpang</label>
                                                <p>{(addressData.street)? addressData.street : '-'}</p>
                                            </div>
                                        </div>
                                        
                                }
                                {
                                    
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Jalan" className="col-form-label">Jalan</label>
                                                <p>{(addressData.road)? addressData.road : '-'}</p>
                                            </div>
                                        </div>
                                    
                                }
                                {
                                   
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="District" className="col-form-label">District</label>
                                                <p>{(addressData.district)? addressData.district : '-'}</p>
                                            </div>
                                        </div>
                                    
                                }
                                {
                                    
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Mukim" className="col-form-label">Mukim</label>
                                                <p>{(addressData.state)? addressData.state : '-'}</p>
                                            </div>
                                        </div>
                                      
                                }
                                {
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Kampong" className="col-form-label">Kampong</label>
                                                <p>{(addressData.village)? addressData.village : '-'}</p>
                                            </div>
                                        </div>
                                       
                                }
                                {
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Bandar" className="col-form-label">Bandar</label>
                                                <p>{(addressData.cityTown)? addressData.cityTown : '-'}</p>
                                            </div>
                                        </div>
                                      
                                }
                                {
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Postcode" className="col-form-label">Postcode</label>
                                                <p>{(addressData.postCode)? addressData.postCode : '-'}</p>
                                            </div>
                                        </div>
                                       
                                }
                                {
                                        <div className="col-md-3">
                                            <div className="form-group">
                                                <label htmlFor="Country" className="col-form-label">Country(Negra)</label>
                                                <p>{(addressData.country)? addressData.country : '-'}</p>
                                            </div>
                                        </div>
                                        
                                }
                            </div>
                            <div className="row pt-2 pl-2">
                                <i className="fas fa-map-marker-alt text-primary font-18 pr-1" />
                                <p className="address-line">
                                    {(addressData.flatHouseUnitNo && addressData.flatHouseUnitNo !== '')? `${addressData.flatHouseUnitNo}, ` : ''}
                                    {(addressData.block && addressData.block !== '')? `${addressData.block}, ` : ''}
                                    {(addressData.building && addressData.building !== '')? `${addressData.building}, ` : ''}
                                    {(addressData.street && addressData.street !== '')? `${addressData.street}, ` : ''}
                                    {(addressData.road && addressData.road !== '')? `${addressData.road}, ` : ''}
                                    {(addressData.state && addressData.state !== '')? `${addressData.state}, ` : ''}
                                    {(addressData.village && addressData.village !== '')? `${addressData.village}, ` : ''}
                                    {(addressData.cityTown && addressData.cityTown !== '')? `${addressData.cityTown}, ` : ''}
                                    {(addressData.district && addressData.district !== '')? `${addressData.district}, ` : ''}
                                    {(addressData.country && addressData.country !== '')? `${addressData.country}, ` : ''}
                                    {(addressData.postCode && addressData.postCode !== '')? `${addressData.postCode}` : ''}
                                </p>
                            </div>
                        </>
                        :
                        <div>Address not available</div>
                }
            </fieldset>
        </div>

    )

}
export default AddressPreview;