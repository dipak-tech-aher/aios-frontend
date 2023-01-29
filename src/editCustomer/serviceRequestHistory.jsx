import React from 'react'

function serviceRequestHistory() {
   return (
      <div className='mt-4'>
         <div className="col-md-12 text-left">
            <h4 id="list-item-2">Service Request History</h4>
            <hr />
            <table id="ticket-history" className="table table-striped dt-responsive nowrap w-100">
               <thead>
                  <tr>
                     <th>SR Id</th>
                     <th>Created Date</th>
                     <th>Status</th>
                     <th>Close Date</th>
                     <th>Remarks</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <td><a href="#" className="btn text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#bs-example-modal-lg">SR435678</a>
                     </td>
                     <td>14/01/2021</td>
                     <td>Assigned</td>
                     <td>15/01/2021</td>
                     <td>Broadband Plan Upgrade</td>
                     <td><button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#workflowmodal"><small>Workflow History</small></button></td>
                  </tr>
                  <tr>
                     <td><a href="#" className="btn text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#bs-example-modal-lg">SR13405</a>
                     </td>
                     <td>24/01/2021</td>
                     <td>Closed</td>
                     <td>25/01/2021</td>
                     <td>Broad Plan Downgrade</td>
                     <td><button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#workflowmodal"><small>Workflow History</small></button></td >
                  </tr >
                  <tr>
                     <td><a href="#" className="btn text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#bs-example-modal-lg">SR17811</a>
                     </td>
                     <td>17/02/2021</td>
                     <td>Closed</td>
                     <td>19/02/2021</td>
                     <td>New Data Plan</td>
                     <td><button type="button" className="btn btn-outline-primary text-primary waves-effect waves-light btn-xs" data-toggle="modal" data-target="#workflowmodal"><small>Workflow History</small></button></td >
                  </tr >
               </tbody >
            </table >
         </div >
      </div >
   )
}

export default serviceRequestHistory
