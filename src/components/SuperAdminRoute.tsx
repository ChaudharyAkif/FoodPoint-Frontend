import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

const SuperAdminRoute = ({ children }: SuperAdminRouteProps) => {
  // ✅ Get role directly from AuthContext - NO API CALL, NO LOADER!
  const { role } = useAuth();

  // ✅ Show access denied if not superadmin - INSTANT CHECK, NO LOADING!
  if (role !== 'superadmin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This page is only accessible to Super
            Admins.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ✅ Render children immediately - NO DELAY!
  return <>{children}</>;
};

export default SuperAdminRoute;