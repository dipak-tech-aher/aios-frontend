import React from 'react';
import { ToastContainer } from 'react-toastify';
import Header from '../header';
import MainMenu from '../mainMenu';

const AppLayout = ({ isAuthenticated, children }) => {
    return (
        <div id="wrapper" className="App">
            <ToastContainer hideProgressBar closeButton={false} style={{ zIndex: 99999 }} />
            {
                isAuthenticated &&
                <>
                    <Header />
                    <MainMenu />
                </>
            }
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AppLayout;