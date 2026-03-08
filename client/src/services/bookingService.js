import api from './api';

const bookingService = {
    createBooking: async (data) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    getBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
    getUserBookings: async (userId) => {
        const response = await api.get(`/bookings/user/${userId}`);
        return response.data;
    },
    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },
    updateBookingStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    }
};

export default bookingService;
