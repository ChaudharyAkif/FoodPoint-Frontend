import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuthContext";
import Loader from "../components/ScreenLoader/Loader";

const SuperAdmin = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Loader
  if (isLoading) {
    return (
     <Loader/>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ROLE BASED REDIRECT
  if (user.role === "superadmin") {
    return <Navigate to="/superadmin/details" replace />;
  }

  if (user.role === "cashier") {
    return <Navigate to="/cashier" replace />;
  }

  // fallback
  return <Navigate to="/" replace />;
};

export default SuperAdmin;
