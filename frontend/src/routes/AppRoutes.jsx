import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Pages
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import EquipmentList from '../pages/EquipmentList';
import EquipmentDetails from '../pages/EquipmentDetails';
import BookingPage from '../pages/BookingPage';
import ForgotPassword from '../pages/ForgotPassword';
import VerifyOTP from '../pages/VerifyOTP';
import ResetPassword from '../pages/ResetPassword';
import UserDashboard from '../pages/UserDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import EquipmentManagement from '../pages/admin/EquipmentManagement';
import OrderConfirmation from '../pages/admin/OrderConfirmation';
import UsersManagement from '../pages/admin/UsersManagement';
import PaymentsManagement from '../pages/admin/PaymentsManagement';
import Profile from '../pages/Profile';
import MyBookings from '../pages/MyBookings';
import Loader from '../components/Loader';

const PrivateRoute = ({ children, adminOnly = false, farmerOnly = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loader fullPage />;
    if (!user) return <Navigate to="/login" replace />;
    if (adminOnly && user.role !== 'admin') return <Navigate to="/farmer-dashboard" replace />;
    if (farmerOnly && user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;

    return children;
};

const BlockAdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <Loader fullPage />;
    if (user && user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
                <Route path="verify-otp" element={<VerifyOTP />} />
                <Route path="reset-password" element={<ResetPassword />} />
                <Route path="marketplace" element={<BlockAdminRoute><EquipmentList /></BlockAdminRoute>} />
                <Route path="equipment/:id" element={<BlockAdminRoute><EquipmentDetails /></BlockAdminRoute>} />
                <Route path="booking/:id" element={
                    <PrivateRoute farmerOnly>
                        <BookingPage />
                    </PrivateRoute>
                } />

                {/* Protected Routes */}
                <Route path="farmer-dashboard" element={
                    <PrivateRoute>
                        <UserDashboard />
                    </PrivateRoute>
                } />
                <Route path="my-bookings" element={
                    <PrivateRoute>
                        <MyBookings />
                    </PrivateRoute>
                } />
                <Route path="admin-dashboard" element={
                    <PrivateRoute adminOnly>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="admin/equipment-management" element={
                    <PrivateRoute adminOnly>
                        <EquipmentManagement />
                    </PrivateRoute>
                } />
                <Route path="admin/order-confirmation" element={
                    <PrivateRoute adminOnly>
                        <OrderConfirmation />
                    </PrivateRoute>
                } />
                <Route path="admin/users" element={
                    <PrivateRoute adminOnly>
                        <UsersManagement />
                    </PrivateRoute>
                } />
                <Route path="admin/payments" element={
                    <PrivateRoute adminOnly>
                        <PaymentsManagement />
                    </PrivateRoute>
                } />
                <Route path="profile" element={
                    <PrivateRoute>
                        <Profile />
                    </PrivateRoute>
                } />
                <Route path="dashboard" element={
                    <PrivateRoute>
                        <DashboardRedirect />
                    </PrivateRoute>
                } />
            </Route>
        </Routes>
    );
};

// Helper for generic /dashboard path
const DashboardRedirect = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin-dashboard" replace />;
    return <Navigate to="/farmer-dashboard" replace />;
};

export default AppRoutes;
