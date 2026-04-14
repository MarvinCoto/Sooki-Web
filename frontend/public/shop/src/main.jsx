import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import AlertModal from './components/ui/AlertModal';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AlertProvider>
                    <App />
                    <AlertModal />
                </AlertProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);