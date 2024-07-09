import axios from 'axios';
const API_URL = 'http://localhost:3001';
export const initRepo = (repoPath) => {
    return axios.post(`${API_URL}/init`, { repoPath });
};
export const addFile = (repoPath, filePath) => {
    return axios.post(`${API_URL}/add`, { repoPath, filePath });
};
export const commitChanges = (repoPath, message) => {
    return axios.post(`${API_URL}/commit`, { repoPath, message });
};
export const getStatus = (repoPath) => {
    return axios.get(`${API_URL}/status`, { params: { repoPath } });
};
