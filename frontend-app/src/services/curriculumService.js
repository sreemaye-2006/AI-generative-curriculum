import api from './api';

export const generateCurriculum = async () => {
    const { data } = await api.post('/curriculum/generate');
    return data;
};

export const getCurrentCurriculum = async () => {
    const { data } = await api.get('/curriculum/current');
    return data;
};

export const toggleTopicCompletion = async (topicId) => {
    const { data } = await api.put(`/curriculum/topics/${topicId}`);
    return data;
};

export const getAIContent = async (type, topic) => {
    const { data } = await api.get(`/curriculum/content/${type}`, { params: { topic } });
    return data;
};
