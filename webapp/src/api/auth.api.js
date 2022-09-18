import { axiosInstance } from "./axios.api";

export const login = async (username, password) => {
    const response = await axiosInstance.post('/auth/signin', { username, password }, { withCredentials: true });
    return response.data;
}

export const register = async (username, password, email) => {
    const response = await axiosInstance.post('/auth/signup', { username, password, email });
    return response.data;
}

export const silentLogin = async () => {
    const response = await axiosInstance.get('/auth/refreshtoken', { withCredentials: true });
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
    return response.data;
}