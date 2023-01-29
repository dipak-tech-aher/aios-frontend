import React, { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { hideSpinner, showSpinner } from '../common/spinner';
import NewCustomerPreview from '../customer/newCustomerPreview';
import { properties } from '../properties';
import { get } from '../util/restUtil';
import Modal from 'react-modal'
import { useReactToPrint } from 'react-to-print';
const ServiceRequestPreview = (props) => {

    const { serviceRequestData } = props.data;
    const { handleParentModalState } = props.stateHandlers;

    const [newCustomerData, setNewCustomerData] = useState({
        current: {
            customer: {}
        }
    })
    const [isOpen, setIsOpen] = useState(false);
    const plansList = useRef({});

    const renderMode = {
        customerTypeSelection: 'hide',
        customerDetails: 'hide',
        customerDetailsPreview: 'hide',
        accountDetails: 'hide',
        accountDetailsPreview: 'hide',
        serviceDetails: 'hide',
        previewAndSubmitButton: 'hide',
        previewButton: 'hide',
        previewCancelButton: 'hide',
        customerDetailsEditButton: 'hide',
        accountDetailsEditButton: 'hide',
        serviceDetailsEditButton: 'hide',
        submitted: 'no',
        submitButton: 'hide',
        printButton: 'show',
        previewCloseButton: 'show',
        serviceWorkOrderSection: 'show'
    }

    useEffect(() => {
        showSpinner();
        let customerData;
        get(properties.CUSTOMER360_API + '/' + serviceRequestData.customerId)
            .then((resp) => {
                if (resp && resp.data) {
                    customerData = resp.data;
                } else {
                    toast.error("Failed to fetch Customer Details - " + resp.status);
                }
                get(`${properties.ACCOUNT_DETAILS_API}/${serviceRequestData.customerId}?account-id=${serviceRequestData.accountId}`)
                    .then((resp) => {
                        if (resp && resp.data) {
                            customerData.account = [resp.data];
                        } else {
                            toast.error("Failed to fetch account ids data - " + resp.status);
                        }
                        get(`${properties.SERVICES_LIST_API}/${serviceRequestData.customerId}?account-id=${serviceRequestData.accountId}&service-id=${serviceRequestData.serviceId}&realtime=false`)
                            .then((resp) => {
                                if (resp && resp.data) {
                                    customerData.account[0].service = resp.data;
                                    setNewCustomerData({ current: { customer: customerData } })
                                    plansList.current = resp.data[0].plans
                                    setIsOpen(true);
                                } else {
                                    toast.error("Failed to fetch account ids data - " + resp.status);
                                }
                            }).finally(hideSpinner)
                    })
            }).finally();
    }, [])

    const handleOnCloseModal = () => {
        setIsOpen(false);
        handleParentModalState();
    }

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        isOpen &&
        <Modal isOpen={isOpen} >
            <NewCustomerPreview
                previewData={{
                    renderMode: renderMode
                }}
                data={{
                    newCustomerData: newCustomerData,
                    plansList: plansList,
                    serviceRequestData: serviceRequestData
                }}
                modalStateHandlers={{
                    handleNewCustomerPreviewModalClose: handleOnCloseModal,
                    handlePrint: handlePrint
                }}
                ref={componentRef}
            />
        </Modal>
    )
}

export default ServiceRequestPreview;