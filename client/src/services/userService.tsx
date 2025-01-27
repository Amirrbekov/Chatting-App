import axiosApi from "../utils/axiosApi";
import { User } from "../utils/types";

export const getUsers = async (): Promise<User[]> => {
    const response = await axiosApi.get(`/user`);    
    return response.data.users;
}

export const getUser = async (id: string) => {
    const { data: user } = await axiosApi.get(`/user/${id}`);
    return user;
}

export const updateUser = async (id: string, user: any) => {
    const { data } = await axiosApi.put(`/user/${id}`, user);
    return data;
}