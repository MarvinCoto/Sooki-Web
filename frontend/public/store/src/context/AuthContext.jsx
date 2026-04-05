import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLoginLimit } from "./LoginLimitContext";
import { API_BASE_URL } from "../utils/api";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const location = useLocation();
  const { checkAccountLock, recordFailedAttempt, clearLoginAttempts } = useLoginLimit();

  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  const publicRoutes = [
    "/", "/login", "/register", "/verifyemail", "/passwordrecovery",
    "/verifycode", "/resetpassword", "/products", "/categories",
    "/stores", "/aboutUs", "/contactUs",
  ];

  const isPublicRoute = (pathname = location.pathname) => {
    if (publicRoutes.includes(pathname)) return true;
    const dynamicRoutes = ["/stores/", "/products/", "/categories/"];
    return dynamicRoutes.some((route) => pathname.startsWith(route));
  };

  // LOGIN TRADICIONAL
  const Login = async (email, password) => {
    if (!email || !password) {
      toast.error("Debes completar el email y la contraseña para continuar");
      return false;
    }

    const lockCheck = checkAccountLock(email);
    if (!lockCheck.success) return lockCheck;

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const failureResult = recordFailedAttempt(email);

        let errorMessage = "Error al iniciar sesión";
        if (response.status === 401) errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña";
        else if (response.status === 404) errorMessage = "No existe una cuenta con este email";
        else if (response.status === 429) errorMessage = "Demasiados intentos. Espera unos minutos";
        else errorMessage = data.message || "Error al iniciar sesión. Intenta nuevamente";

        toast.error(errorMessage);

        if (failureResult.isLocked) return failureResult;
        return { success: false, message: `${errorMessage}. ${failureResult.message}`, remainingAttempts: failureResult.remainingAttempts };
      }

      // Solo clientes pueden acceder
      if (data.user.userType !== "client") {
        return { success: false, error: "Solo clientes pueden acceder" };
      }

      if (!data.user.isVerified) {
        toast.error("Debes verificar tu cuenta de email antes de iniciar sesión");
        return { success: false, needsVerification: true, email: data.user.email, error: "Email no verificado" };
      }

      clearLoginAttempts(email);

      const userData = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        lastname: data.user.lastname,
        userType: data.user.userType,
        isVerified: data.user.isVerified,
        photo: data.user.photo || null,
      };

      setUser(userData);
      setIsLoggedIn(true);
      toast.success(`Bienvenido, ${userData.name}`);
      return { success: true, user: userData };
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      setIsLoggedIn(false);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // LOGOUT
  const logOut = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: "POST", credentials: "include" });
    } catch (error) {
      console.log("Error en logout del servidor:", error);
    }

    setUser(null);
    setIsLoggedIn(false);
    return true;
  };

  // VERIFY TOKEN
  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/verify`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        setUser(null);
        setIsLoggedIn(false);
        return { success: false, reason: "invalid_token" };
      }

      const data = await response.json();

      if (data.success && data.user) {
        if (data.user.isVerified && data.user.userType === "client") {
          const userData = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            lastname: data.user.lastname,
            userType: data.user.userType,
            isVerified: data.user.isVerified,
            photo: data.user.photo || null,
          };
          setUser(userData);
          setIsLoggedIn(true);
          return { success: true, user: userData };
        } else {
          setUser(null);
          setIsLoggedIn(false);
          return { success: false, reason: "invalid_user_type" };
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
        return { success: false, reason: "invalid_token" };
      }
    } catch (error) {
      console.error("Error verificando token:", error);
      setUser(null);
      setIsLoggedIn(false);
      return { success: false, reason: "network_error" };
    }
  };

  // INITIALIZE AUTH
  const initializeAuth = async () => {
    if (hasCheckedAuth) return;
    setIsLoading(true);
    try {
      await verifyToken();
    } catch (error) {
      console.error("Error en inicialización de auth:", error);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setHasCheckedAuth(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isPublicRoute() && !isLoggedIn && hasCheckedAuth) {
      setHasCheckedAuth(false);
    }
  }, [location.pathname]);

  const checkAuthStatus = async () => {
    if (!hasCheckedAuth || (!isLoggedIn && !isPublicRoute())) {
      await initializeAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        Login,
        logOut,
        verifyToken,
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        checkAuthStatus,
        hasCheckedAuth,
        auth: {
          isAuthenticated: isLoggedIn,
          email: user?.email || "",
          userId: user?.id || null,
          userName: user?.name || "",
          userFullName: user ? `${user.name} ${user.lastname}` : "",
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};