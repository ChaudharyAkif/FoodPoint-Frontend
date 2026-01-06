import { Route, Routes } from 'react-router-dom';
import LoginPage from './LoginPage';
import ResetPasswordPage from './ResetPassword';
import AuthRedirectRoute from '../../routes/AuthRedirectRoute';
import ForgetPasswordPage from './ForgotPassword';

const AuthRoutes = () => {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <AuthRedirectRoute>
            <LoginPage />
          </AuthRedirectRoute>
        }
      />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      {/* Super Admin Only Routes */}
      <Route
        path="/forget-password"
        element={
            <ForgetPasswordPage />
        }
      />
    </Routes>
  );
};

export default AuthRoutes;
