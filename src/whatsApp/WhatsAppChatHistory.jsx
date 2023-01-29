import React from 'react' 
import Modal from 'react-modal'
import _ from "lodash";

const WhatsAppChatHistory = (props) => {

    const customStyles = {
        content: {
            position: 'absolute',
            top: '45%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            maxHeight: '100%'
        }
    };
    const { isOpen, whatsappHistoryData } = props.data;
    const { setIsOpen } = props.handler;

    return (
        <>
            <Modal isOpen={isOpen} contentLabel="Worflow History Modal" style={customStyles}>
                <div className="chat-his modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header mb-1">
                            <button type="button" className="close" onClick={() => setIsOpen(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="chat-history modal-body">
                            <div className="clearfix">
                                <div className="hd-left"><h2 className="modal-title">WhatsApp ID(Number) - {whatsappHistoryData?.whatsappData?.whatsappNumber|| ""}</h2></div>
                                <div className="hd-right"><h2 className="modal-title">Access Number - {whatsappHistoryData?.whatsappData?.accessNumber || ""} </h2></div>  
                            </div>
                            <div className="ps-container ps-theme-default ps-active-y chat-history" id="chat-content" style={{overflowY: "scroll !important", height:"400px !important"}}>
                                <div className="media media-chat"> 
                                    <div className="media-body"  style={{whiteSpace: "pre-line"}}>
                                        {
                                            whatsappHistoryData.history.map((value, index) => {
                                                return <div style={{width:"100%",float:"left"}} className="pl-3 pr-5">
                                                            <div style={{width:"fit-content", float:(value.source === 'USER' ? "right" : "left")}}>
                                                                <li style={{ borderRadius:"50px", padding:"12px 30px", width:"fit-content", backgroundColor: (value.source === 'USER' ? '#F7941E' : '#F0532D'), textAlign:(value.source === 'USER' ? "left" : "left")}} key={index}>{value.message}</li>
                                                            </div>          
                                                        </div>
                                                })    
                                        } 
                                    </div>
                                </div>                      
                                <div className="ps-scrollbar-x-rail" tyle={{left: "0px", bottom: "0px"}} >
                                    <div className="ps-scrollbar-x" tabindex="0" style={{left: "0px", width: "0px"}}></div>
                                </div>
                                <div className="ps-scrollbar-y-rail" style={{top: "0px", height: "0px",right: "2px"}}>
                                    <div className="ps-scrollbar-y" tabindex="0" style={{top: "0px", height: "2px"}} ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default WhatsAppChatHistory