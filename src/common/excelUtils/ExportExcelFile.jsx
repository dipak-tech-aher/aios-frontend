import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { formatISODateDDMMMYY, formatISODateTime } from '../../util/dateUtil';
import { hideSpinner, showSpinner } from '../spinner';
import { formFilterObject } from '../../util/util';
import { properties } from '../../properties';
import { get, post } from '../../util/restUtil';
import moment from 'moment'

const ExportToExcelFile = ({ fileName, listKey, listSearch, listSelectedTab, filters, handleExportButton }) => {

    const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    const exportToCSV = (checkListKey, apiData, fileName) => {
        let tableData = [];
        let objConstruct = {};

        apiData.forEach(element => {

            if (checkListKey === "Campaign Listing") {
                objConstruct = {
                    "Campaign Name": element.campName,
                    "Campaign Description": element.campDescription,
                    "Access Number": element.serviceNo,
                    "Valid From": formatISODateDDMMMYY(new Date(element.validFrom)),
                    "Valid To": formatISODateDDMMMYY(new Date(element.validTo))
                }
            }
            if (checkListKey.includes("Monthly Data") || checkListKey.includes("Today Data")) {
                objConstruct = {
                    "Customer Number": element?.whatsapp_number,
                    "Customer Name": element?.customer_name,
                    "Account Number": element?.account_no,
                    "Account Name": element?.account_name,
                    "Access Number": element?.access_number,
                    "Service Type": element?.service_type,
                    "Contact Number": element?.contact_number,
                    "Email ID": element?.email,
                    "Whatsapp Visit Date/Time": moment(element?.created_at).format('DD MMM YYYY hh:mm:ss A'),
                }
            } else if (checkListKey.includes("Followup Data")) {
                objConstruct = {
                    "AIOS Interaction ID": element.intxn_id,
                    "Customer Number": element.whatsapp_number,
                    "customer Name": element.customer_name,
                    "Account Number": element.account_no,
                    "Account Name": element.account_name,
                    "Access Number": element.access_number,
                    "Service Type": element.service_type,
                    "Contact Number": element.contact_number,
                    "Email ID": element.email,
                    "Interaction status": element.curr_status,
                    "Interaction Created On": moment(element.interaction_created_date).format('DD MMM YYYY hh:mm:ss A'),
                    "Last Followed Up On": moment(element.flw_created_at).format('DD MMM YYYY hh:mm:ss A'),
                    "Whatsapp Visit Date/Time": moment(element.visted_date).format('DD MMM YYYY hh:mm:ss A')
                }
            } else if (checkListKey.includes("Monthly Complaints Data")) {
                objConstruct = {
                    "AIOS Interaction ID": element.intxn_id,
                    "Customer Number": element.whatsapp_number,
                    "customer Name": element.customer_name,
                    "Account Number": element.account_no,
                    "Account Name": element.account_name,
                    "Access Number": element.access_number,
                    "Service Type": element.service_type,
                    "Contact Number": element.contact_number,
                    "Email ID": element.email,
                    "Interaction status": element.curr_status,
                    "Interaction Created On": moment(element.interaction_created_date).format('DD MMM YYYY hh:mm:ss A'),
                    "Whatsapp Visit Date/Time": moment(element.visted_date).format('DD MMM YYYY hh:mm:ss A')
                }
            } else if (checkListKey === "WhatsApp Search") {
                objConstruct = {
                    "WhatsApp ID (Number)": element?.whatsappNumber,
                    "Session Start From": element?.createdAt ? moment(element?.createdAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Session End To": element?.endAt ? moment(element?.endAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Service Type": element?.serviceType,
                    "Access Number": element?.accessNumber,
                    "Customer Name": element?.customerName,
                    "Contact Number": element?.contactNumber,
                    "Email ID": element?.email,
                    "Interaction ID": element?.intxnId,
                    "Interaction Status": element?.interactionDetails?.currStatusDesc?.description,
                }
            } else if (checkListKey === "Interactions Search") {
                objConstruct = {
                    "Interaction ID": element.intxnId,
                    "Ticket ID": element?.ticketId,
                    "Interaction Category Type": element.ticketTypeDesc,
                    "Work Order Type": element.woTypeDescription,
                    "Access Number": element.accessNbr,
                    "Service Type": element.prodType,
                    "Customer Name": element.customerName,
                    "Customer Number": element.customerNbr,
                    "Account Name": element.accountName,
                    "Account Number": element.accountNo,
                    "Contact Number": element.contactNo,
                    "Assigned": element.assigned,
                    "Created Date": formatISODateDDMMMYY(new Date(element.createdAt)),
                    "Created By": element.createdBy,
                    "Status": element.currStatus
                }
            } else if (checkListKey === "Admin View User-User Management") {
                objConstruct = {
                    "First Name": element.firstName,
                    "Last Name": element.lastName,
                    "Email Id": element.email,
                    "Contact No": element.contactNo,
                    "User Type": element.userTypeDet?.description,
                    "Status": element.status
                }
            } else if (checkListKey === "Admin View User-Roles Setup") {
                objConstruct = {
                    "Role ID": element.roleId,
                    "Role Name": element.roleName,
                    "Role Description": element.roleDesc,
                    "Is Admin": element.isAdmin
                }
            } else if (checkListKey === "Catalogue Listing") {
                objConstruct = {
                    "Plan ID": element.planId,
                    "Refill Profile ID": element.refillProfileId,
                    "Tariff Code": element.prodType,
                    "Bundle Name": element.planName,
                    "Bundle Category": element.planType,
                    "Services": element.prodType,
                    "Denomination": element.charge
                }
            } else if (checkListKey === "Customer Advance Search") {
                objConstruct = {
                    "Customer Number": element.customerNo,
                    "Customer Name": element.customerName,
                    "Account Number": element.accountNo,
                    "Account Name": element.accountName,
                    "Access Number": element.accessNbr,
                    "Service Type": element.prodType,
                    "Primary Contact Number": element.contactNo,
                    "ID Number": element.idValue,
                    "Service Status": element.serviceStatus
                }
            } else if (checkListKey === "Manage Parametrs") {
                objConstruct = {
                    "Business Parameter Name": element.code,
                    "Business Parameter Description": element.description,
                    "Parent Category": element.codeType,
                    "Status": element.status
                }
            }
            else if (checkListKey === "View All Notifications") {
                objConstruct = {
                    "Notification Title": element.source + " " + element.referenceId,
                    "Broadcast Message": element.subject,
                    "Notification Date - Time": formatISODateTime(element.createdAt)
                }
            }
            else if (checkListKey === "ChatAgent") {
                objConstruct = {
                    "Chat ID": element?.chatId,
                    "Customer Name": element?.customerName,
                    "Chat Category": element?.category,
                    "Access Number": element?.accessNo,
                    "Contact Number": element?.contactNo,
                    "Email ID": element?.emailId,
                    "ID Value": element?.idValue,
                    "Start Date Time": element?.startAt ? moment(element?.startAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "End Date Time": element?.startAt ? moment(element?.endAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Status": element?.status,
                    "Agent Name": element?.agentName && element?.agentName ? element?.agentName : "-"
                }
            }
            else if (checkListKey === "Interaction Report") {
                objConstruct = {
                    "Interaction Id": element?.interactionId,
                    "Created Date": element?.createdDate ? moment(element?.createdDate).format('DD MMM YYYY hh:mm:ss A') : '-',
                    // "Created Date":element?.createdDate,
                    "Comment Source": element?.commentSourceDesc,
                    "Comment Channel": element?.commentChannelDesc,
                    "Customer Segment": element?.customerSegment,
                    "Customer Name": element?.customerName,
                    "Service No": element?.serviceNo,
                    "Service Type": element?.serviceType,
                    "Ticket Type": element?.ticketTypeDesc,
                    "Comment Type": element?.commentTypeDesc,
                    "Comment Cause": element?.commentCauseDesc,
                    "Rebound": element?.Rebound,
                    "Ticket Id": element?.ticketId,
                    "Ticket Validity": element?.ticketValidity,
                    "Ticket Desc": element?.ticketDesc,
                    "Priority": element?.priorityDesc,
                    "Created By": element?.createdBy,
                    "Current Status": element?.currStatusDesc,
                    "Current Role": element?.currentRole,
                    "Current User": element?.currentUser,
                    "Pending Close Date": element?.pendingCloseDate ? moment(element?.pendingCloseDate).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Pending Close By": element?.pendingCloseBy,
                    "Closed Date": element?.closedDate ? moment(element?.closedDate).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Closed By": element?.closedBy,
                    "Send Survey Y/N": element?.surveySent,
                    "Contact No": element?.contactNo,
                    "Contact Email": element?.contactEmail,
                    "Work Order Type": element?.workOrderTypeDesc,
                    "Created By Role": element?.createdByRole,
                    "Cancelled By": element?.cancelledBy,
                    "Cancelled Reason": element?.cancelledReason
                }
            }
            else if (checkListKey === "Chat Report") {

                let msgContent = ''

                if (element && element.message && element.message.length > 0) {
                    for (let val of element.message) {
                        if (val && val.from && val.from !== '' && val.msg.trim() !== '' && (val.msg.indexOf('\n') >= 0)) {
                            let contentData = (val.msg.replace('text@@@', '')).split('\n')
                            msgContent += '[' + val.from + ' ' + contentData[1] + ']-> ' + contentData[0] + '\r\n'
                        } else {
                            msgContent = element?.message
                        }
                    }
                } else {
                    msgContent = element?.message
                }

                objConstruct = {
                    "Chat ID": element?.chatId,
                    "Contact Number": element?.contactNo,
                    "Email ID": element?.emailId,
                    "Customer Name": element?.customerName,
                    "Response Time": `${(element?.responseMin) ? element?.responseMin : '0'} mins ${(element?.responseSec) ? element?.responseSec : '0'} secs`,
                    "Start At": element?.createdAt ? moment(element?.createdAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "End At": element?.endAt ? moment(element?.endAt).format('DD MMM YYYY hh:mm:ss A') : '-',
                    "Status": element?.statusDesc,
                    "Chat Message": msgContent,
                    "service Type": element?.type,
                    "Access Number": element?.accessNo,
                    "Category": element?.category,
                    "ID Value": element?.idValue,
                    "Agent Attended": element?.agentName && element?.agentName ? element?.agentName : "-",
                    "Queue Wait (min)": `${(element?.queueWaitMin) ? element?.queueWaitMin : '0'} mins ${(element?.queueWaitSec) ? element?.queueWaitSec : '0'} secs`,
                    "Duration of Chat (min)": `${(element?.chatDurationMin) ? element?.chatDurationMin : '0'} mins ${(element?.chatDurationSec) ? element?.chatDurationSec : '0'} secs`
                }

            }
            else if (checkListKey === "Daily New Customer Requests Chat Report") {
                objConstruct = {
                    "Customer Name": element ?.customerName,
                    "Customer Mobile Number": element ?.customerMobileNumber,
                    "Customer Email ID": element ?.customerEmailId,
                    "ID Number": element ?.idNumber,
                    "Access Number": element ?.accessNumber,
                    "Service Type": element ?.serviceType,
                    "Created Date": element ?.createdDate,
                }
            }
            else if (checkListKey === "Daily Booster Purchase Chat Report") {
                objConstruct = {
                    "Access Number": element ?.accessNumber,
                    "Customer Name": element ?.customerName,
                    "Contact No": element ?.contactNo,
                    "Email ID": element ?.emailId,
                    //"ID Value": element ?.idValue,
                    "Booster Name": element ?.boosterName,
                    "Purchase Date": element ?.purchaseDate,
                    "Status": element ?.status,
                }
            }
            else if (checkListKey === "Daily Chat Customer Report Count") {
                objConstruct = {
                    "Customers Visited Chat2US Count": element ?.connectedWithLiveAgentCount,
                    "Customers Connected with Live Chat Agent Count": element ?.visitedCustomerCount
                }
            }
            tableData.push(objConstruct);
        });


        if (tableData.length !== 0) {
            const ws = XLSX.utils.json_to_sheet(tableData,
                {
                    origin: 'A2',                 //----Starting Excel cell Position
                    skipHeader: false             //----Header Skip 
                });

            //----Header As Upper Case The Origin Should Be A1 uncomment 123 to 129------//
            // var range = XLSX.utils.decode_range(ws['!ref']);
            // for (var C = range.s.r; C <= range.e.r; ++C) {
            //     var address = XLSX.utils.encode_col(C) + "1";
            //     if (!ws[address]) continue;
            //     ws[address].v = ws[address].v.toUpperCase();
            // }
            //----Header As Upper Case ------//


            const wb = {
                Sheets: { data: ws },
                SheetNames: ["data"]
            };

            const excelBuffer = XLSX.write(wb, {
                bookType: "xlsx",
                type: "array"
            });

            const data = new Blob(
                [excelBuffer], { type: fileType }
            );

            FileSaver.saveAs(data, fileName + fileExtension);
        }
    };

    const handleOnExportClick = async (e) => {
        fetchData();
    }

    const fetchData = () => {
        showSpinner();
        let url, requestBody, getApiMethod = 'NA';
        if (listSearch === 'NA') {
            requestBody = { filters: formFilterObject(filters) }
        } else {
            requestBody = listSearch;
        }

        if (listKey === "Campaign Listing") {
            url = `${properties.CAMPAIGN_API}/list`
            getApiMethod = "POST"

        } else if (listKey === "Interactions Search") {

            url = `${properties.INTERACTION_API}/search`
            getApiMethod = "POST"

        } else if (listKey === "Admin View User-User Management") {

            url = `${properties.USER_API}/search?excel=true`
            getApiMethod = "POST"

        } else if (listKey === "Admin View User-Roles Setup") {

            url = `${properties.ROLE_API}`
            getApiMethod = "GET"

        } else if (listKey === "Catalogue Listing") {

            url = `${properties.CATALOGUE_API}/list`
            getApiMethod = "POST"

        } else if (listKey === "Customer Advance Search") {

            url = `${properties.CUSTOMER_API}/search`
            getApiMethod = "POST"

        } else if (listKey === "Manage Parametrs") {

            if (listSelectedTab != "NA") {
                url = `${properties.BUSINESS_PARAMETER_API}/list/` + listSelectedTab
                getApiMethod = "GET"
            }
        }
        else if (listKey === "View All Notifications") {

            url = `${properties.NOTIFICATION_API}`
            getApiMethod = "GET"

        }
        else if (listKey === "ChatAgent") {

            url = `${properties.CHAT_API}/search`
            getApiMethod = "POST"

        }
        else if (listKey === "Interaction Report") {
            url = `${properties.REPORTS_API}/interactions`
            getApiMethod = "POST"
        }
        else if (listKey === "Chat Report") {
            url = `${properties.REPORTS_API}/chats`
            getApiMethod = "POST"
        }
        else if (listKey === "WhatsApp Search") {
            url = `${properties.WHATSAPP}/search?excel=true`
            getApiMethod = "POST"
        }
        else if (listKey.includes("Today Data") || listKey.includes("Monthly Data")) {
            url = `${properties.WHATSAPP}/count-details`
            getApiMethod = "POST"
        }
        else if (listKey.includes("Followup Data")) {
            url = `${properties.WHATSAPP}/count-details`
            getApiMethod = "POST"
        }
        else if (listKey.includes("Monthly Complaints Data")) {
            url = `${properties.WHATSAPP}/count-details`
            getApiMethod = "POST"
        }
        else if (listKey === "Daily New Customer Requests Chat Report") {
            url = `${properties.REPORTS_API}/chat-daily-report-new-customer-req`
            getApiMethod = "POST"
        }
        else if (listKey === "Daily Booster Purchase Chat Report") {
            url = `${properties.REPORTS_API}/chat-daily-report-booster-purchase`
            getApiMethod = "POST"
        }
        else if (listKey === "Daily Chat Customer Report Count") {
            url = `${properties.REPORTS_API}/chat-daily-report-counts`
            getApiMethod = "POST"
        }
        if (getApiMethod === "GET") {
            get(url).then(response => {
                if (response && response.data && response.data.length > 0) {
                    exportToCSV(listKey, response.data, fileName)
                } else if (response && response.data.rows) {
                    exportToCSV(listKey, response.data.rows, fileName)
                }
                handleExportButton(true)
            }).finally(hideSpinner)

        } else {
            post(url, requestBody)
                .then((response) => {
                    exportToCSV(listKey, response.data.rows, fileName)
                    handleExportButton(true)
                })
                .finally(hideSpinner)
        }
    };

    return (
        <div className="col-md-12 text-left mt-0">
            <div class="justify-content-center excel">
                <button class="btn btn-primary btn-md  waves-effect waves-light m-2 float-left"
                    onClick={handleOnExportClick}>Export to Excel</button>
            </div>
        </div>
    );
};

export default ExportToExcelFile;
