import React from "react";
import { Switch, Redirect, Router } from "react-router-dom";
import { history } from "./util/history";
import { PrivateRoute, PublicRoute } from "./common/route";
import Dashboard from "./dashboard/dashboard";
import Login from "./user/login";
import Signup from "./user/signup";
import ChangePassword from "./user/changePassword";
import Logout from "./common/logout";
import ClearAuth from "./common/clearAuth";
import CampaignList from "./campaign/campaignList"
import NewCustomer from './customer/newCustomer'
import CustomerSearch from './customer/customerSearch'
import Demo from "./customer/demo";
import UserView from "./admin/userView";
import Customer360 from "./customer360/customer360";
import RoleTable from "./role/RoleTable";
import NewRole from "./role/NewRole";
import UpdateRole from "./role/UpdateRole";
import EditCustomer from "./editCustomer/editCustomer";
import FileUpload from "./common/uploadAttachment/fileUpload";
import CreateEnquireNewCustomer from "./inquiry/createInquiryNewCustomer";
import EditTicketsLandingPage from "./complaint/EditTicketsLandingPage";
import CreateComplaintOrServiceRequest from "./complaint/CreateComplaintOrServiceRequest";
import ExistingCustomerCreateInquiry from "./inquiry/exsitingCustomerCreateInquiry";
import InteractionSearch from "./interactionSearch/InteractionSearch";
import LeadDataTable from "./lead/leadDataTable";
import CreateCatalog from "./catalogue/createCatalogue";
import EditServiceRequest from "./serviceRequest/editServiceRequest";
import CatalogueListView from "./catalogue/cataloueListView";
import ViewCatalogDetails from "./catalogue/viewCatalog";
import CustomerAdvanceSearch from "./customerAdvanceSearch/CustomerAdvanceSearch";
import EditCustomersInquiryDetails from "./inquiry/editCustomerInquiryNew";
import MyProfile from "./user/myProfile";
import EditProfile from "./user/EditProfile";

import ForgotPassword from "./user/ForgotPassword";
import LoginToForgotPass from "./user/loginToForgot";
import Register from "./user/register";
import RegisterVerify from "./user/registerVerify";
import UploadCampaign from "./campaign/uploadCampaign";
import AddEditCampaign from "./campaign/AddEditCampaign";
import UploadCatalog from "./catalogue/catalogUpload";
import ManageParameters from "./manageParameters/manageParameters";
import ScrollToTop from "./ScrollToTop";
import AddParameter from "./manageParameters/addParameter";
import EditParameter from "./manageParameters/editParameter";
import ParametersMapping from "./manageParameters/ParametersMapping";
import NotificationTable from "./common/notificationTable";
import ExternalLogin from "./user/ExternalLogin";
import AgentChatBox from "./live-chat/agent-chat";
import AgentChatListView from "./live-chat/agentChatListView";
import AmeyoRedirect from "./Ameyo/AmeyoRedirect";
import ChangePasswordInitial from "./user/changePasswordInitial";
import ChatDashboard from "./live-chat/chatMonitoring/ChatDashboard";
import SalesDashboard from "./dashboard/SalesDashboard"
import InteractionReport from "./reports/InteractionReport";
import ChatReport from "./reports/chatReport";
import BranchSalesDashboard from "./dashboard/sales/BranchSalesDashboard"
import SalesReport from "./dashboard/sales/SalesReport";
import CreateRecordExtractor from "./RecordExtractor/CreateRecordExtractor";
import WFViewer from "./wf/wfViewer";
import WFModeler from "./wf/wfModeler";
import AddEditWorkflow from "./wf/addEditWorkflow";
import WFStatusViewer from "./wf/wfStatusViewer";
import WhatsAppSearch from "./whatsApp/WhatsAppSearch";
import WhatsAppDashboard from "./whatsApp/WhatsAppDashboard";
import DailyChatReportNewCustomers from "./reports/DailyChatReportNewCustomers";
import DailyChatReportBoosterPurchase from "./reports/DailyChatReportBoosterPurchase";
import DailyChatReportCustomerCounts from "./reports/DailyChatReportCustomerCounts";

function App() {
  return (
    <Router history={history} basename={`${process.env.REACT_APP_BASE}`}>
      <ScrollToTop />
      <Switch>
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/`} component={Dashboard} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/wf-modeler`} component={WFModeler} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/wf-viewer`} component={WFViewer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/wf-addedit`} component={AddEditWorkflow} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/wf-status-viewer`} component={WFStatusViewer} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/login`} component={Login} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/logout`} component={Logout} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/clearAuth`} component={ClearAuth} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/demo`} component={Demo} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/admin-user-view`} component={UserView} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/search`} component={CustomerSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/new-customer`} component={NewCustomer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-customer/:id`} component={EditCustomer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/customer360`} component={Customer360} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-inquiry-new-customer`} component={CreateEnquireNewCustomer} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-inquiry-existing-customer`} component={ExistingCustomerCreateInquiry} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-customer-inquiry`} component={EditCustomersInquiryDetails} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-catalogue`} component={CreateCatalog} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/catalogue-list-view`} component={CatalogueListView} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-catalogue`} component={CreateCatalog} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/view-catalogue`} component={ViewCatalogDetails} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/upload-catalogue`} component={UploadCatalog} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/role`} component={RoleTable} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/newrole`} component={NewRole} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/attachment`} component={FileUpload} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/updaterole`} component={UpdateRole} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-complaint`} component={CreateComplaintOrServiceRequest} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-service-request`} component={CreateComplaintOrServiceRequest} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-complaint`} component={EditTicketsLandingPage} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-inquiry`} component={EditTicketsLandingPage} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-service-request`} component={EditTicketsLandingPage} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/ticket-search`} component={InteractionSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/lead`} component={LeadDataTable} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-service-request`} component={EditServiceRequest} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/add-campaign`} component={AddEditCampaign} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/campaignlist`} component={CampaignList} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-campaign`} component={AddEditCampaign} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/upload-campaign`} component={UploadCampaign} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/manage-parameters`} component={ManageParameters} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/edit-parameters`} component={EditParameter} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/add-parameters`} component={AddParameter} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/notification`} component={NotificationTable} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/external-login`} component={ExternalLogin} />

        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/agent-chat`} component={AgentChatBox} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/agentChatListView`} component={AgentChatListView} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/chat-monitoring`} component={ChatDashboard} />


        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/mapping-parameters`} component={ParametersMapping} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/customer-advance-search`} component={CustomerAdvanceSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/signup/:inviteToken`} component={Signup} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/changepassword`} component={ChangePassword} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/myprofile`} component={MyProfile} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/user/editprofile`} component={EditProfile} />

        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/ameyo/create-ticket*`} component={AmeyoRedirect} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/changePasswordInitial/:forgotpasswordtoken`} component={ChangePasswordInitial} />
        {/* <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/changepassword/init*`} component={ChangePasswordInitial} /> */}
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/forgotpassword/setpassword/:forgotpasswordtoken`} component={ForgotPassword} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/forgotpassword`} component={LoginToForgotPass} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/register`} component={Register} />
        <PublicRoute exact path={`${process.env.REACT_APP_BASE}/user/registerverify/:inviteToken`} component={RegisterVerify} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/interaction-report`} component={InteractionReport} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/chat-report`} component={ChatReport} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/sales-dashboard`} component={SalesDashboard} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/Branch-sales-dashboard`} component={BranchSalesDashboard} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/sales-report`} component={SalesReport} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/create-record-extractor`} component={CreateRecordExtractor} />

        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/whatsApp-search`} component={WhatsAppSearch} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/whatsApp-dashboard`} component={WhatsAppDashboard} />

        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/reports/new-customer-request`} component={DailyChatReportNewCustomers} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/reports/booster-purchase`} component={DailyChatReportBoosterPurchase} />
        <PrivateRoute exact path={`${process.env.REACT_APP_BASE}/reports/customer-counts`} component={DailyChatReportCustomerCounts} />
        <Redirect to={`${process.env.REACT_APP_BASE}/`} />
      </Switch>
    </Router>
  );
}

export default App;
