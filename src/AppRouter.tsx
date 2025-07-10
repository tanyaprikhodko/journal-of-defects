import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthorizeContainer from './containers/AuthorizeContainer';   
import MainView from './containers/MainView';
import NotFoundPage from './containers/NotFoundPage';
import EditPage from './containers/EditPage';
import DeletePage from './containers/DeletePage';

const isAuthenticated = () => {
    // Replace this with your actual authentication logic
    return localStorage.getItem('accessToken') !== null;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

const AppRouter: React.FC = () => {
    const RedirectToProperPage: React.FC = () => {
        if (isAuthenticated()) {
            return <Navigate to="/main-view" replace />;
        }
        return <Navigate to="/login" replace />;
    };
    return (
        <Router>
            <div style={{ height: '100vh',width: '100vw', display: 'flex', flexDirection: 'column', backgroundColor: '#f7fdfe', overflow: 'hidden' }}>
            <Routes>
                <Route path="/" element={<RedirectToProperPage />} />
                <Route path="/login" element={<AuthorizeContainer />} />
                <Route
                    path="/main-view"
                    element={
                        <PrivateRoute>
                            <MainView />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit/:id"
                    element={
                        <PrivateRoute>
                            <EditPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create/:id"
                    element={
                        <PrivateRoute>
                            <EditPage />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/create-copy/:id"
                    element={
                        <PrivateRoute>
                            <EditPage />
                        </PrivateRoute>
                    }
                />
                <Route path="/edit" element={<Navigate to="/main-view" replace />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </div>
        </Router>
    );
};

export default AppRouter;