import api from './api';

const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    sendOtp: async (email) => {
        const response = await api.post('/auth/send-email-otp', { email });
        return response.data;
    },

    verifyOtp: async (email, otp) => {
        const response = await api.post('/auth/verify-email-otp', { email, otp });
        return response.data;
    },

    sendResetOtp: async (email) => {
        const response = await api.post('/auth/send-reset-otp', { email });
        return response.data;
    },

    verifyResetOtp: async (email, otp) => {
        const response = await api.post('/auth/verify-reset-otp', { email, otp });
        return response.data;
    },

    resetPassword: async (email, newPassword, confirmPassword) => {
        const response = await api.post('/auth/reset-password', { email, newPassword, confirmPassword });
        return response.data;
    }
};

export default authService;
