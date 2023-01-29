import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import { toast } from "react-toastify";

import InlineSpinner from '../common/inline-spinner';
import { get, post } from "../util/restUtil";
import { properties } from "../properties";

import DynamicTable from "../common/table/DynamicTable";
import { InquiryListColumns, InquiryHiddenColumns } from "./serviceRequestColumns";
import InquiryWorkflowHistory from "./inquiryWorkflowHistory";
import { formatISODateDDMMMYY, formatISODateTime } from '../util/dateUtil'

function InquiryList(props) {

  const leftNavCounts = props.handler.leftNavCounts
  const setLeftNavCounts = props.handler.setLeftNavCounts
  const refreshList = props.data.refreshList
  const refreshInquiry = props.data.refreshInquiry

  const customerDetails = props.data.customerDetails

  const selectedAccount = props.data.selectedAccount

  const activeService = props.data.activeService

  let value = ""

  const history = useHistory();
  const [workFlowData, setWorkFlowData] = useState()
  const [isOpen, setIsOpen] = useState(false)
  const [inquiry, setInquiry] = useState([])
  const [inlineSpinnerData, setInlineSpinnerData] = useState({ state: false, message: '' })

  useEffect(() => {
    if (customerDetails && customerDetails.customerId && selectedAccount && selectedAccount.accountId && activeService) {
      setInlineSpinnerData({ state: true, message: 'Loading inquiry...please wait...' })
      get(properties.SERVICE_REQUEST_LIST_BY_CUSTOMER + '/' + customerDetails.customerId + 
      '?intxn-type=REQINQ&account-id=' + selectedAccount.accountId + '&service-id=' + activeService)
        .then((resp) => {
          if (resp && resp.data) {
            let inquirys = resp.data.filter((item) => item.intxnType === "REQINQ")
            setInquiry(inquirys)
            //setServiceRequests(resp.data)
            setLeftNavCounts({ ...leftNavCounts, inqCount: inquirys.length })
          } else {
            toast.error("Failed to fetch Inquiry - " + resp.status);
          }
          setInlineSpinnerData({ state: false, message: '' })
        }).finally();
    }
  }, [customerDetails, refreshInquiry, selectedAccount, activeService]);


  const handleLinkClick = (e, rowData) => {
    const { intxnId, Connection, Account, srType } = rowData;
    const { accountId } = Account;
    const { description } = srType;
    history.push(`${process.env.REACT_APP_BASE}/edit-${description.toLowerCase()}`, {
      data: {
        customerId: customerDetails.customerId,
        serviceId: Connection ? Connection.connectionId : '',
        interactionId: intxnId,
        accountId,
        type: description.toLowerCase()
      }
    })
  }

  const handleCellRender = (cell, row) => {
    if (cell.column.Header === "Inquiry ID") {
      return (<span className="text-primary cursor-pointer" onClick={(e) => handleLinkClick(e, row.original)}>{cell.value}</span>)
    } else if (cell.column.Header === "Created Date") {
      return (<span>{formatISODateTime(cell.value)}</span>)
    }
    else if (cell.column.Header === "Created By") {
      return (<span>{row.original.userId.firstName + " " + row.original.userId.lastName}</span>)
    }
    else {
      return (<span>{cell.value}</span>)
    }

    // else if (cell.column.Header === "Action") {
    //   return (<button type="button"
    //     className="btn btn-outline-primary waves-effect waves-light btn-sm"
    //     onClick={() => {
    //       setIsOpen(true);
    //       setWorkFlowData(row.original);
    //     }}
    //   >
    //     Status
    //   </button>
    //   )
    // }
  }

  return (
    <>
      {
        (inquiry && inquiry.length > 0) ?
          <DynamicTable
            row={inquiry}
            header={InquiryListColumns}
            hiddenColumns={InquiryHiddenColumns}
            itemsPerPage={10}
            handler={{
              handleCellRender: handleCellRender,
              handleLinkClick: handleLinkClick
            }}
          />
          :
          <span className="msg-txt">No Inquiry Available</span>
      }
      {
        (inlineSpinnerData.state) ?
          <>
            <InlineSpinner data={inlineSpinnerData.message} />
          </>
          :
          <></>
      }
      {
        isOpen ?
          <InquiryWorkflowHistory workFlowData={workFlowData} isOpen={isOpen} setIsOpen={setIsOpen} />
          :
          <></>
      }
    </>
  );
}

export default InquiryList;
