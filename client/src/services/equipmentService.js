import api from './api';

const equipmentService = {
    getEquipment: async (keyword = '') => {
        const response = await api.get(`/equipment?keyword=${keyword}`);
        return response.data;
    },
    getEquipmentById: async (id) => {
        const response = await api.get(`/equipment/${id}`);
        return response.data;
    },
    createEquipment: async (data) => {
        const response = await api.post('/equipment', data);
        return response.data;
    },
    updateEquipment: async (id, data) => {
        const response = await api.put(`/equipment/${id}`, data);
        return response.data;
    },
    deleteEquipment: async (id) => {
        const response = await api.delete(`/equipment/${id}`);
        return response.data;
    }
};

export default equipmentService;
