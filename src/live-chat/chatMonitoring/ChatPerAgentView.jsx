import React from "react";
import Modal from "react-modal";
import DynamicTable from '../../common/table/DynamicTable';

const ChatPerAgentModel=(props)=>{

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
    const { isOpen, chatData } = props.data;
    const { setIsOpen } = props.handler;
    return( 
        <>
        <Modal isOpen={isOpen} contentLabel="Modal" style={customStyles}>
            <div className="chat-his modal-dialog">
                <div className="modal-content">
                    <div className="modal-header mt-2 mb-1">
                        <button type="button" className="close" onClick={() => setIsOpen(false)}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="chat-history modal-body">
                        <div className="clearfix">
                            <h2 className="modal-title">Chat Per Agent</h2>
                        </div>
                        <table  className="table table-responsive table-striped dt-responsive nowrap w-100"
                                    style={{ textAlign: "center", marginLeft: "0px" }}>
                            <thead>                                            
                                <tr>  
                                    <th>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                                            <p>Agent Name</p>
                                        </div>
                                    </th>
                                    <th>
                                        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
                                            <p>Chat Count</p>
                                        </div>
                                    </th>                                                   
                                </tr>                                            
                            </thead>
                            <tbody>
                                {!!chatData.length ?                                
                                    (
                                        chatData && chatData.map((val, key)=>(                                        
                                            <tr key={key}>                                           
                                                <td>                                                                                          
                                                    {val.userName}      
                                                </td>
                                                <td>
                                                    {val.chatCount}      
                                                </td>                                               
                                        </tr>
                                       ))
                                    ) 
                                    :                                                                        
                                     <></>                                       
                                }                
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Modal>
        </>
    )
}

export default ChatPerAgentModel

const columns=[
    {
        Header: "Agent Name",
        accessor: "userName",
        disableFilters: true,
        click: false,
        id: "userName",
  
    },
    {
        Header: "Chat Count",
        accessor: "chatCount",
        disableFilters: true,
        click: false,
        id: "chatCount",
  
    }
]