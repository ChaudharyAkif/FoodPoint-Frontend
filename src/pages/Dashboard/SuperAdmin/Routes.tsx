import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Profile from '../Profile';
import EditCashier from './EditCashier';
import Cashiers from './Casher';
import AddProductForm from '../../../components/AddProducts/AddProductForm';
import { MenuManagement } from '../../../views/MenuManagement';

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path='/details' element={<AdminDashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="cashiers" element={<Cashiers />} />
      <Route path="cashiers/edit/:id" element={<EditCashier />} />
      <Route path="/add-products" element={<AddProductForm />} />
      <Route path="/menu-management" element={<MenuManagement />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
