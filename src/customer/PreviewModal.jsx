import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '75%',
        maxHeight: '70%'
    }
};

const PreviewModal = (props) => {
    const { isOpen, selectedCustomerType, renderMode } = props.previewData;
    const { setIsOpen, handleSubmit } = props.modalStateHandlers;
    return (
        <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} contentLabel="Complaint Search Modal" style={customStyles}>
            <div className="modal-content custom-app">
                <div className="modal-header">
                    <h5 className="modal-title pl-2">Preview</h5>
                    <button type="button" className="close" onClick={() => setIsOpen(false)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body overflow-auto">
                    <fieldset className="scheduler-border2">
                        <div className="row">
                            <div className="row col-12 pb-2 text-center">
                                <div className="col-2 mt-2">
                                    <img src="../assets/images/logo-sm.png" width="120px" alt="img" />
                                </div>
                                <div className="col-10 pt-3 text-center"><h4>Customer Application Form</h4></div>
                            </div>
                        </div>
                        {
                            (selectedCustomerType === 'RESIDENTIAL' && renderMode.customerDetails === 'view') && props.PersonalPreview
                        }
                        {
                            (selectedCustomerType === 'BUSINESS' && renderMode.customerDetails === 'view') && props.BusinessPreview
                        }
                        <div className="form-row justify-content-center">
                            {
                                (renderMode.submitButton === 'show') &&
                                <button type="button" className="btn btn-primary btn-md  waves-effect waves-light ml-2" onClick={handleSubmit}>Submit</button>
                            }
                            <button type="button" className="btn btn-secondary btn-md  waves-effect waves-light ml-2" onClick={() => setIsOpen(false)}>Cancel</button>
                        </div>
                    </fieldset>
                </div>
            </div>
        </Modal>
    )
}

export default PreviewModal;