import api from './api';

const paymentService = {
    createPayment: async (data) => {
        const response = await api.post('/payments/create', data);
        return response.data;
    },

    verifyPayment: async (data) => {
        const response = await api.post('/payments/verify', data);
        return response.data;
    }
};

export default paymentService;
