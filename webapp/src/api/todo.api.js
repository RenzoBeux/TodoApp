import { axiosInstance } from "./axios.api";

export const getTodos = async (token,page,search,done) => {
    const response = await axiosInstance.get(`todo?page=${page}&size=6&search=${search}&doneFilter=${done}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
}

export const postTodo = async (token,todo) => {
    const response = await axiosInstance.post('/todo', todo,{
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    return response.data;
}

export const updateTodo = async (token, todo) => {
    const response = await axiosInstance.put(`/todo/${todo.id}`, todo,{
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    return response.data;
}

export const deleteTodo = async (token, id) => {
    const response = await axiosInstance.delete(`/todo/${id}`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
    });
    return response.data;
}

