import React, { useEffect, useState } from 'react'
import { formatISODateDDMMMYY } from '../util/dateUtil'
import InstallationAddressView from '../customer/addressPreview'
import MobileServiceDetailsView from './mobileServiceDetailsView'
import FixedServiceDetailsView from './fixedServiceDetailsView'
import PlanUpgrade from './planUpgradeDowngrade'
import PlanDowngrade from './planUpgradeDowngrade'
import ManageBooster from './manageBooster'
import ManageVAS from './manageVAS'
import ChangeSIM from './changeSIM'
import TeleportAndRelocate from './teleportAndRelocate'
import ServiceNumberChange from './newChangeServiceNumber'
import TerminationOfService from './terminationOfService'
import { get , post} from "../util/restUtil";
import { properties } from "../properties";
import { unstable_batchedUpdates } from 'react-dom';
import { hideSpinner, showSpinner } from '../common/spinner'

const ServiceFullView = (props) => {

    const customerType = props.data.customerType
    const selectedAccount = props.data.selectedAccount
    //const renderState = props.data.renderState
    const serviceDetail = props.data.serviceDetails
    //let serviceDetails = serviceDetail
    const [serviceDetails,setServiceDetails] = useState(props.data.serviceDetails)
    const customerAddress = props.data.customerAddress
    const realtimeDetails = (props.data.serviceDetails) ? serviceDetails.realtime : {}
    const installationAddress = (props.data.serviceDetails) ? serviceDetails.installationAddress[0] : {}
    const [interactionData,setInteractionData] = useState([])
    //const setRenderState = props.handler.setRenderState
    const handleServicePopupClose = props.handler.handleServicePopupClose
    const setServicesList = props.handler.setServicesList
    const setRefreshServiceList = props.handler.setRefreshServiceList

    const setRefreshServiceRequest = props.handler.setRefreshServiceRequest

    const connectionStatusLookup = props.data.connectionStatusLookup

    const setRefreshPage = props.handler.setRefreshPage

    const [renderState, setRenderState] = useState({
        service: 'show',
        booster: 'hide',
        vas: 'hide',
        serviceDetails: 'show',
        planUpgrade: 'hide',
        planDowngrade: 'hide',
        changeSIM: 'hide',
        changeServiceNbr: 'hide',
        teleportAndRelocate: 'hide',
        termination: 'hide'
    })
    const [renderStateChange, setRenderStateChange] = useState({ activeBoosters: 'show', purchaseHistory: 'hide', newBoosters: 'hide' })
    useEffect(() => {
        console.log("service Details : ",props.data.serviceDetails)
        showSpinner()
        get(properties.SERVICE_BADGE_API + '/' + selectedAccount.customerId + '?' + 'account-id=' + selectedAccount.accountId + '&service-id=' + serviceDetails.serviceId)
        .then((resp) => {
            showSpinner()
            let reqBody = {
                customerId : selectedAccount.customerId,
                accountId : selectedAccount.accountId,
                accessNbr : serviceDetails.accessNbr
            }
            post(properties.INTERACTION_API + "/interaction-detail",reqBody)
            .then((resp) => {
                console.log("resp : ",resp.data)
                    unstable_batchedUpdates(() => {
                        setInteractionData(resp.data)
                    })

            })
            .finally(hideSpinner)
            if(resp.data.badge === "TERMINATE")
            {
                unstable_batchedUpdates(() => {
                    setServiceDetails({...serviceDetails,badge:resp.data.badge})
                })
            }
        })
        .finally(hideSpinner)
    },[])

    const handleTabChange = (booster, service, vas, serviceDetails, planUpgrade, planDowngrade, changeSIM, teleportAndRelocate, changeServiceNbr, termination) => {
        setRenderState({ ...renderState, booster: booster, service: service, vas: vas, serviceDetails: serviceDetails, planUpgrade: planUpgrade, planDowngrade: planDowngrade, changeSIM: changeSIM, teleportAndRelocate: teleportAndRelocate, changeServiceNbr: changeServiceNbr, termination: termination})
    }

    return (
        (serviceDetails && serviceDetails.accessNbr !== undefined) ?
            <div className="modal-content">
                <div className="modal-header">
                    <h4 className="modal-title">Service Number {serviceDetails.accessNbr}&nbsp;({serviceDetails.prodType})</h4>
                    <button type="button" className="close" onClick={handleServicePopupClose}>
                        <span>&times;</span>
                    </button>
                </div>
                <div><hr /></div>
                <div className="modal-body">
                    <div className="p-0">
                        <div className="card-body p-0">
                            <ul className="nav nav-tabs">
                                <li key="service" className="nav-item pl-0">
                                    <button
                                        className={"nav-link " + ((renderState.service === 'show') ? "active" : "")}
                                        onClick={() => handleTabChange('hide', 'show', 'hide', 'show', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide')}
                                    >
                                        Manage Services
                                    </button>
                                </li>
                                <li key="booster" className="nav-item">
                                    <button
                                        className={"nav-link " + ((renderState.booster === 'show') ? "active" : "")}
                                        onClick={() => {handleTabChange('show', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide')
                                        setRenderStateChange({ activeBoosters: 'show', purchaseHistory: 'hide', newBoosters: 'hide' })
                                    }}
                                    >
                                        
                                        Manage Boosters/Topups
                                    </button>
                                </li>
                                <li key="vas" className="nav-item">
                                    <button
                                         disabled={true}
                                         className="nav-link"
                                        // disabled={!(serviceDetails.prodType === 'Fixed' || serviceDetails.prodType === 'Postpaid')}
                                        // className={"nav-link " + ((renderState.vas === 'show') ? "active" : "")}
                                        onClick={() => handleTabChange('hide', 'hide', 'show', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide', 'hide')}
                                    >
                                        Manage VAS
                                    </button>
                                </li>
                            </ul>
                            <div className="tab-content p-2 panelbg border">
                                <div className="tab-pane show active" id="mservices1">
                                    <div className="row">
                                        {
                                            (renderState.service === 'show') ?
                                                <div className="col-sm-2">
                                                    <div className="nav flex-column nav-pills nav-pills-tab" id="v-pills-tab"
                                                        role="tablist" aria-orientation="vertical">
                                                        <button
                                                            className={"nav-link show list-group-item list-group-item-action "
                                                                + ((renderState.serviceDetails === 'show') ? "active" : "")
                                                            }
                                                            onClick={() => setRenderState({ ...renderState, serviceDetails: 'show', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'hide' })}
                                                            role="tab"
                                                        >
                                                            Service Details
                                                        </button>

                                                        {
                                                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    // disabled={!(serviceDetails.prodType === 'Fixed' || serviceDetails.prodType === 'Postpaid')}
                                                                    // className={"nav-link show list-group-item list-group-item-action "
                                                                    //     + (!(serviceDetails.prodType === 'Fixed' || serviceDetails.prodType === 'Postpaid') ? "disabled" : ((renderState.planUpgrade === 'show') ? "active" : ""))
                                                                    // }
                                                                    onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'show', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'hide' })}
                                                                    role="tab">
                                                                    Plan Upgrade
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Plan Upgrade
                                                                </button>

                                                        }
                                                        {
                                                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    // disabled={!(serviceDetails.prodType === 'Fixed' || serviceDetails.prodType === 'Postpaid')}
                                                                    // className={"nav-link show list-group-item list-group-item-action "
                                                                    //     + (!(serviceDetails.prodType === 'Fixed' || serviceDetails.prodType === 'Postpaid') ? "disabled" : ((renderState.planDowngrade === 'show') ? "active" : ""))
                                                                    // }
                                                                    onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'show', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'hide' })}
                                                                    role="tab">
                                                                    Plan Downgrade
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Plan Downgrade
                                                                </button>
                                                        }
                                                        {
                                                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    //disabled={/*!*/(serviceDetails.prodType === 'Prepaid' || serviceDetails.prodType === 'Postpaid')}
                                                                    // className={"nav-link  list-group-item list-group-item-action "
                                                                    //     + (/*!*/(serviceDetails.prodType === 'Prepaid' || serviceDetails.prodType === 'Postpaid') ? "disabled" : ((renderState.changeSIM === 'show') ? "active" : ""))
                                                                    // }
                                                                    onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'show', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'hide' })}
                                                                    role="tab">
                                                                    Change SIM
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Change SIM
                                                                </button>
                                                        }
                                                        {
                                                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    // disabled={(serviceDetails.prodType === 'Prepaid' || serviceDetails.prodType === 'Postpaid')}
                                                                    // className={"nav-link list-group-item list-group-item-action "
                                                                    //     + ((serviceDetails.prodType === 'Prepaid' || serviceDetails.prodType === 'Postpaid') ? "disabled" : ((renderState.teleportAndRelocate === 'show') ? "active" : ""))
                                                                    // }
                                                                    onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'show', changeServiceNbr: 'hide', termination: 'hide' })} role="tab">
                                                                    Teleport & Relocate
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Teleport & Relocate
                                                                </button>
                                                        }
                                                        {
                                                            (serviceDetails.status === 'ACTIVE' && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    //disabled={!(serviceDetails.prodType === 'Fixed' /*|| serviceDetails.prodType === 'Postpaid'*/)}
                                                                    // className={"nav-link list-group-item list-group-item-action "
                                                                    //     + (!(serviceDetails.prodType === 'Fixed' /*|| serviceDetails.prodType === 'Postpaid'*/) ? "disabled" : ((renderState.changeServiceNbr === 'show') ? "active" : ""))
                                                                    // }
                                                                    onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'show', termination: 'hide' })}
                                                                    role="tab">
                                                                    Change Service Number
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Change Service Number
                                                                </button>
                                                        }
                                                        {
                                                            ((serviceDetails.status === 'ACTIVE' || serviceDetails.status === 'TOS') && !['WONC', 'WONC-ACCSER', 'WONC-SER', 'BAR', 'UNBAR', 'UPGRADE', 'DOWNGRADE', 'TELEPORT', 'RELOCATE','TERMINATE'].includes(serviceDetails.badge)) ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    // className={"nav-link list-group-item list-group-item-action "
                                                                    //     + ((renderState.termination === 'show') ? "active" : "")
                                                                    // }
                                                                    //onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'show' })}
                                                                    role="tab">
                                                                    Terminate
                                                                </button>
                                                                :
                                                                (interactionData.length > 0 && interactionData  &&  interactionData[0]?.currStatus !== "CLOSED") ?
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    // className={"nav-link list-group-item list-group-item-action "
                                                                    //     + ((renderState.termination === 'show') ? "active" : "")
                                                                    // }
                                                                    //onClick={() => setRenderState({ ...renderState, serviceDetails: 'hide', planUpgrade: 'hide', planDowngrade: 'hide', changeSIM: 'hide', teleportAndRelocate: 'hide', changeServiceNbr: 'hide', termination: 'show' })}
                                                                    role="tab">
                                                                    Terminate
                                                                </button>
                                                                :
                                                                <button
                                                                    disabled="disabled"
                                                                    className="nav-link list-group-item list-group-item-action disabled"
                                                                    role="tab">
                                                                    Terminate
                                                                </button>
                                                        }

                                                    </div>
                                                </div>
                                                :
                                                <></>
                                        }
                                        <div className={(renderState.service === 'show') ? "col-sm-10" : "col-sm-12"}>
                                            <div className="tab-content p-0">
                                                <div className="tab-pane fade active show" role="tabpanel">
                                                    {
                                                        (renderState.service === 'show' && renderState.serviceDetails === 'show') ?
                                                            <>
                                                                {
                                                                    (serviceDetails.prodType === 'Postpaid' || serviceDetails.prodType === 'Prepaid') ?
                                                                        <MobileServiceDetailsView
                                                                            data={{
                                                                                serviceDetails: serviceDetails,
                                                                                selectedAccount: selectedAccount,
                                                                                renderState: renderState,
                                                                                connectionStatusLookup: connectionStatusLookup
                                                                            }}
                                                                            handler={{
                                                                                setServicesList: setServicesList,
                                                                                setRefreshServiceList: setRefreshServiceList,
                                                                                handleServicePopupClose:handleServicePopupClose,
                                                                                setRefreshPage: setRefreshPage
                                                                            }}
                                                                        />
                                                                        :
                                                                        <></>
                                                                }
                                                                {
                                                                    (serviceDetails.prodType === 'Fixed') ?
                                                                        <FixedServiceDetailsView
                                                                            data={{
                                                                                serviceDetails: serviceDetails,
                                                                                selectedAccount: selectedAccount,
                                                                                renderState: renderState,
                                                                                connectionStatusLookup: connectionStatusLookup
                                                                            }}
                                                                            handler={{
                                                                                setServicesList: setServicesList,
                                                                                handleServicePopupClose:handleServicePopupClose,
                                                                                setRefreshPage: setRefreshPage
                                                                            }}
                                                                        />
                                                                        :
                                                                        <></>
                                                                }
                                                            </>
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderState.service === 'show' && renderState.planUpgrade === 'show') ?
                                                            <PlanUpgrade
                                                                data={{
                                                                    selectedAccount: selectedAccount,
                                                                    serviceDetails: serviceDetails,
                                                                    upgradeDowngrade: 'upgrade'
                                                                }}
                                                                handler={{
                                                                    setRefreshServiceList: setRefreshServiceList,
                                                                    setRefreshServiceRequest: setRefreshServiceRequest,
                                                                    handleServicePopupClose:handleServicePopupClose,
                                                                    setRefreshPage: setRefreshPage
                                                                }}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderState.service === 'show' && renderState.planDowngrade === 'show') ?
                                                            <PlanDowngrade
                                                                data={{
                                                                    selectedAccount: selectedAccount,
                                                                    serviceDetails: serviceDetails,
                                                                    upgradeDowngrade: 'downgrade'
                                                                }}
                                                                handler={{
                                                                    setRefreshServiceList: setRefreshServiceList,
                                                                    setRefreshServiceRequest: setRefreshServiceRequest,
                                                                    handleServicePopupClose:handleServicePopupClose,
                                                                    setRefreshPage: setRefreshPage
                                                                }}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderState.teleportAndRelocate === 'show') &&
                                                        <TeleportAndRelocate
                                                            data={{
                                                                selectedAccount: selectedAccount,
                                                                serviceDetails: serviceDetails,
                                                                interactionData
                                                            }}
                                                            handler={{
                                                                setRefreshServiceList: setRefreshServiceList,
                                                                setRefreshServiceRequest: setRefreshServiceRequest,
                                                                handleServicePopupClose:handleServicePopupClose,
                                                                setRefreshPage: setRefreshPage
                                                            }}
                                                        />
                                                    }
                                                    {
                                                        (renderState.changeServiceNbr === 'show') &&
                                                        <ServiceNumberChange
                                                            data={{
                                                                serviceDetails: serviceDetails
                                                            }}
                                                            handleServicePopupClose={handleServicePopupClose}
                                                            setRefreshPage={setRefreshPage}
                                                        />
                                                    }

                                                    {
                                                        (renderState.termination === 'show') &&
                                                        <TerminationOfService
                                                            data={{
                                                                serviceDetails: serviceDetails,
                                                                selectedAccount,
                                                                interactionData
                                                            }}
                                                            handleServicePopupClose={handleServicePopupClose}
                                                            setRefreshPage= {setRefreshPage}
                                                        />
                                                    }


                                                    {
                                                        (renderState.booster === 'show') ?
                                                            <ManageBooster
                                                                data={{
                                                                    selectedAccount: selectedAccount,
                                                                    serviceDetails: serviceDetails,
                                                                    renderState: renderStateChange
                                                                }}
                                                                handler={{
                                                                    setRefreshServiceList: setRefreshServiceList,
                                                                    setRenderState: setRenderStateChange,
                                                                    handleServicePopupClose:handleServicePopupClose,
                                                                    setRefreshPage: setRefreshPage
                                                                }}
                                                                setRenderChange= {setRenderState}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderState.vas === 'show') ?
                                                            <ManageVAS
                                                                data={{
                                                                    selectedAccount: selectedAccount,
                                                                    serviceDetails: serviceDetails
                                                                }}
                                                                handleServicePopupClose={handleServicePopupClose}
                                                                setRefreshPage= {setRefreshPage}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                    {
                                                        (renderState.changeSIM === 'show') ?
                                                            <ChangeSIM
                                                                data={{
                                                                    selectedAccount: selectedAccount,
                                                                    serviceDetails: serviceDetails
                                                                }}
                                                                handler={{
                                                                    setRefreshServiceList: setRefreshServiceList,
                                                                    handleServicePopupClose:handleServicePopupClose,
                                                                    setRefreshPage: setRefreshPage
                                                                }}
                                                            />
                                                            :
                                                            <></>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            :
            <></>
    )
}
export default ServiceFullView;