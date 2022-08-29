import { axiosInstance } from "./axios.api";

export const login = async (username, password) => {
    const response = await axiosInstance.post('/auth/signin', { username, password });
    return response.data;
}

export const register = async (username, password, email) => {
    const response = await axiosInstance.post('/auth/signup', { username, password, email });
    return response.data;
}