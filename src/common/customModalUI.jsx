
import React from 'react';
import PropTypes from 'prop-types';

const CustomModalUI = (props) => {
    // The gray background
    if(!props.isOpen) {
        return null;
      }
    const backdropStyle = {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        padding: 50
    };

    // The modal "window"
    const modalStyle = {
        backgroundColor: '#fff',
        borderRadius: 5,
        maxWidth: '80%',
        minHeight: '80%',
        margin: '0 auto',
        padding: 30
    };

    return (
        <div className="backdrop" style={backdropStyle}>
            <div className="modal" style={modalStyle}>
                {props.children}

                <div className="footer">
                    <button onClick={props.onClose}>
                        Close
              </button>
                </div>
            </div>
        </div>
    );

}
CustomModalUI.propTypes = {
    onClose: PropTypes.func.isRequired,
    show: PropTypes.bool,
    children: PropTypes.node
};
export default CustomModalUI;