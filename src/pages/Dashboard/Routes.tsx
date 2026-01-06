import { Routes, Route } from 'react-router-dom';
import SuperAdminRoute from '../../components/SuperAdminRoute';
import SuperAdminRoutes from './SuperAdmin/Routes';
import Cashier from './CashierDashboard/OrderDetails';
import DashboardRedirect from '../../routes/DashboardRedirect';

const DashboardRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardRedirect />} />
      <Route path="cashier/order/:id" element={<Cashier />} />
      <Route
        path="superadmin/*"
        element={
          <SuperAdminRoute>
            <SuperAdminRoutes />
          </SuperAdminRoute>
        }
      />

      <Route path="cashier" element={<Cashier />} />
    </Routes>
  );
};

export default DashboardRoutes;
