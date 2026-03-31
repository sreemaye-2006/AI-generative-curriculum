import api from './api';

export const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const register = async (name, email, password, profileData = {}) => {
    const { data } = await api.post('/auth/register', { name, email, password, ...profileData });
    if (data.token) localStorage.setItem('token', data.token);
    return data;
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getProfile = async () => {
    const { data } = await api.get('/users/profile');
    return data;
};

export const updateProfile = async (userData) => {
    const { data } = await api.put('/users/profile', userData);
    return data;
};
