import axiosApi from "../utils/axiosApi";
import { SignInFormType, SignUpFormType } from "../utils/types";


export const register = async ({ username, email, password, confirmPassword}: SignUpFormType) => {
    try {
        const { data } = await axiosApi.post(`/auth/register`, {
            username,
            email,
            password,
            confirmPassword
        });

        return data;
    } catch {
        return { statusCode: '409', message: 'User already exists.' };
    }
}

export const login = async ({email, password}: SignInFormType) => {
    try {
        const { data } = await axiosApi.post(`/auth/login`, {
            email,
            password
        });
        return data;

    } catch {
        return { statusCode: '401', message: 'Wrong email or password.' }
    }
}

export const logout = async () => {
    try {
        await axiosApi.post('/auth/logout')
    } catch (error) {
        return { statusCode: '500', message: error }
    }
}