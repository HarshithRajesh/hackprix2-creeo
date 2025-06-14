import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const profileService = {
    createProfile: async (profileData) => {
        try {
            const response = await api.post('/profile/create', profileData);
            return response.data;
        } catch (error) {
            console.error('Error creating profile:', error);
            throw error;
        }
    },
};

export const healthService = {
    checkHealth: async () => {
        try {
            const response = await api.get('/health');
            return response.data;
        } catch (error) {
            console.error('Error checking health:', error);
            throw error;
        }
    },
};

export default api; 