import { createContext, useContext, useState, useEffect } from "react";

const RecoveryContext = createContext();

export const useRecovery = () => useContext(RecoveryContext);

export const RecoveryProvider = ({ children }) => {
  const getInitialState = () => {
    try {
      const savedData = sessionStorage.getItem("recoveryState");
      if (savedData) {
        const parsed = JSON.parse(savedData);
        return { isVerified: parsed.isVerified || false, email: parsed.email || "" };
      }
    } catch (error) {
      console.error("Error al obtener el estado de recovery:", error);
    }
    return { isVerified: false, email: "" };
  };

  const initialState = getInitialState();
  const [isVerified, setIsVerified] = useState(initialState.isVerified);
  const [email, setEmail] = useState(initialState.email);

  useEffect(() => {
    try {
      sessionStorage.setItem("recoveryState", JSON.stringify({ isVerified, email }));
    } catch (error) {
      console.error("Error al guardar el estado de recovery:", error);
    }
  }, [isVerified, email]);

  const clearRecoveryState = () => {
    setIsVerified(false);
    setEmail("");
    try {
      sessionStorage.removeItem("recoveryState");
    } catch (error) {
      console.error("Error al limpiar el estado de recovery:", error);
    }
  };

  return (
    <RecoveryContext.Provider value={{ isVerified, setIsVerified, email, setEmail, clearRecoveryState }}>
      {children}
    </RecoveryContext.Provider>
  );
};