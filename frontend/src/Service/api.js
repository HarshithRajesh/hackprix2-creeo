import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
      console.error('Error creating profile:', error.response?.data || error.message);
      throw error;
    }
  },
  getProfile: async (userId) => {
    try {
      const response = await api.get(`/profile`, { params: { id: userId } });
      const profile = response.data.message;
      // Parse Interests if it's a stringified array
      if (typeof profile.Interests === 'string') {
        try {
          profile.Interests = JSON.parse(profile.Interests);
        } catch (e) {
          console.error('Failed to parse Interests:', e);
          profile.Interests = [];
        }
      }
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      throw error.response?.data || { error: 'Failed to fetch profile' };
    }
  },
};

export const healthService = {
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const locationService = {
  postLocation: async (locationData) => {
    try {
      const sanitizedData = {
        id: parseInt(locationData.id),
        location: {
          lng: parseFloat(locationData.location.lng),
          lat: parseFloat(locationData.location.lat),
        },
      };
      const response = await api.post('/location', sanitizedData);
      return response.data;
    } catch (error) {
      console.error('Error posting location:', error.response?.data || error.message);
      throw error;
    }
  },
  fetchNearbyPeople: async (userId) => {
    try {
      const response = await api.get(`/nearby`, {
        params: {
          radius: 50000,
          id: parseInt(userId),
        },
      });
      // Parse Interests for each person if stringified
      const data = response.data.map((person) => ({
        ...person,
        interests: typeof person.interests === 'string' ? JSON.parse(person.interests) : person.interests || [],
      }));
      return data;
    } catch (error) {
      console.error('Error fetching nearby people:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default api;