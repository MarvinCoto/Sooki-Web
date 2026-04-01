import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useRecovery } from "../context/RecoveryContext";

const RecoveryRoute = () => {
  const { isVerified, email } = useRecovery();
  const location = useLocation();
  const pathname = location.pathname;

  if (pathname === "/verifycode" && !email) {
    return <Navigate to="/passwordrecovery" replace />;
  }

  if (pathname === "/resetpassword" && (!email || !isVerified)) {
    return <Navigate to="/passwordrecovery" replace />;
  }

  return <Outlet />;
};

export default RecoveryRoute;