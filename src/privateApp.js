// import logo from './logo.svg';
import { ToastContainer, toast } from "react-toastify";
// import "./App.css";
import Header from "./common/header";
import MainMenu from "./common/mainMenu";
import Footer from "./common/footer";
import TableGrid from "./common/agGridTable";
function PrivateApp() {
  toast.configure({});
  return (
    <div id="wrapper" className="App">
      <div className="navbar-custom">
        <Header></Header>
      </div> 
      <div className="topnav shadow-lg">
        <MainMenu></MainMenu>
      </div>
      <ToastContainer hideProgressBar closeButton={false} />
      <div className="content-page">
        <TableGrid></TableGrid>
        <Footer></Footer>
      </div>
    </div>
  );
}

export default PrivateApp;
