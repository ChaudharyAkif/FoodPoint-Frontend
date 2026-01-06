import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuthContext";
import Loader from "../components/ScreenLoader/Loader";

const AuthRedirectRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
     <Loader />
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthRedirectRoute;
