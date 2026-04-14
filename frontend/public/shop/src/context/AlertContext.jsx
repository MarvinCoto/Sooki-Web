import { createContext, useContext, useState, useCallback } from "react";

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState(null);
    // alert: { type, message, onConfirm } | null
    // type: "success" | "error" | "delete"

    const showAlert = useCallback((type, message, onConfirm = null) => {
        setAlert({ type, message, onConfirm });
    }, []);

    const closeAlert = useCallback(() => {
        setAlert(null);
    }, []);

    const confirmAlert = useCallback(() => {
        if (alert?.onConfirm) alert.onConfirm();
        setAlert(null);
    }, [alert]);

    return (
        <AlertContext.Provider value={{ alert, showAlert, closeAlert, confirmAlert }}>
            {children}
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) throw new Error("useAlert must be used within AlertProvider");
    return context;
};