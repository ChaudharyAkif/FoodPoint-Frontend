// src/routes/AppRoutes.tsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AuthRoutes from '../pages/Auth/Routes';
import DashboardRoutes from '../pages/Dashboard/Routes';
// import AddProductForm from '../components/AddProducts/AddProductForm';
// import { MenuManagement g} from '../views/MenuManagement';
// import { EditItemPage } from '../views/EditItemPage';
// import { useCallback, useEffect, useState } from 'react';
// import { DealGallery } from '../components/MenuItems/DealGallery';
// import { ProductSelection } from '../components/MenuItems/ProductSelection';
// import type { Deal } from '../types';
import Navbar from '../components/Header/Navbar';
// import axiosInstance from '../api/axiosInstance';
import HomePage from './../pages/HomePage';
// import CartPage from '../pages/CartPage';
import NotFound from '../pages/Frontend/NotFound';
import AnalyticsDashboard from '../pages/Frontend/AnalyticsDashboard';
// import { MenuItemsPage } from '../views/MenuItemPage';
import { useAuth } from '../context/useAuthContext';
// import OrdersPage from '../pages/Frontend/Orders';

const AppRoutes = () => {
  const { role} = useAuth();
  const showNavbar = role === 'cashier' || role === 'superadmin';
  return (
    <>
      {/* {showNavbar && <Navbar />} */}
      <Routes>
        {/* === PUBLIC ROUTES (Everyone) === */}
        {/* <Route path="/" element={<HomePage />} /> */}
        {/* <Route path="/cart" element={<CartPage />} /> */}
        <Route path="/auth/*" element={<AuthRoutes />} />

        {/* === PROTECTED ROUTES === */}

        {/* 1. DASHBOARD: Super Admin & Cashier */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'cashier']}>
              <DashboardRoutes />
            </ProtectedRoute>
          }
        />

        {/* 2. MENU ITEMS: Super Admin & Cashier */}
        {/* <Route
          path="/menu-items"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'cashier']}>
              <MenuItemsPage />
            </ProtectedRoute>
          }
        /> */}

        {/* 3. EDIT ITEMS: Super Admin & Cashier */}
        {/* <Route
          path="/edit-item/:id"
          element={
            <ProtectedRoute allowedRoles={['superadmin', 'cashier']}>
              <EditItemPage />
            </ProtectedRoute>
          }
        /> */}

        {/* 4. ADD PRODUCTS: Super Admin ONLY */}
        {/* <Route
          path="/add-products"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AddProductForm />
            </ProtectedRoute>
          }
        /> */}

        {/* 5. MENU MANAGEMENT: Super Admin ONLY */}
        {/* <Route
          path="/menu-management"
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <MenuManagement />
            </ProtectedRoute>
          }
        /> */}
        {/* <Route path="orders" element={<Cart />} /> */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        <Route path="/analytic" element={<AnalyticsDashboard />} />
        {/* <Route path='/orders' element={<OrdersPage/>}/> */}
      </Routes>
    </>
  );
};

export default AppRoutes;
