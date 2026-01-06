import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardRedirect: React.FC = () => {
  // ✅ Get role directly from AuthContext - NO API CALL, NO LOADER!
  const { user, role } = useAuth();

  // 🔒 User not logged in
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // 🧑‍💼 Role based redirect - INSTANT!
  if (role === 'superadmin') {
    return <Navigate to="/dashboard/superadmin/details" replace />;
  }

  if (role === 'cashier') {
    return <Navigate to="/" replace />;
  }

  // Default fallback
  return <Navigate to="/auth/login" replace />;
};

export default DashboardRedirect;