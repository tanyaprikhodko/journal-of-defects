import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthorizeContainer from './containers/AuthorizeContainer';   
import MainView from './containers/MainView';
import NotFoundPage from './containers/NotFoundPage';

const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    // return !!localStorage.getItem('authToken');
    return true;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRouter: React.FC = () => {
    return (
        <Router>
            <div style={{ height: '100vh',width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#f7fdfe' }}>
            <Routes>
                <Route path="/login" element={<AuthorizeContainer />} />
                <Route
                    path="/main-view"
                    element={
                        <PrivateRoute>
                            <MainView />
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;