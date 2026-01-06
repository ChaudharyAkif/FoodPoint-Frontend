import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuthContext';
import Loader from '../components/ScreenLoader/Loader';
import type { ReactNode } from 'react';
interface ProtectedRouteProps {
  children: ReactNode; 
  allowedRoles?: string[];
}
const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  // 1. If not logged in, send to Login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. If roles are defined, check if user has permission
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If user is logged in but doesn't have the right role, send to Home or specific error page
    return <Navigate to="/" replace />;
  }

  // 3. Permission granted
  return children;
};

export default ProtectedRoute;