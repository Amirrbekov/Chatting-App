import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../../services/authService";
import useAuthStore from "../../../zustand/useAuthStore";
import { toast } from "react-toastify";


const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const initializeUser = useAuthStore(state => state.initializeUser);


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await login({ email, password })
        if (result?.access_token) {
            await localStorage.setItem('access_token', result.access_token);
            await initializeUser();
            navigate('/');
        } else {
            toast.error('Invalid email or password');
        }
    };

    return (
        <form className='auth-form' onSubmit={onSubmit}>
            <input 
                type="email" 
                id="email"
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
            />
            <input 
                type="password" 
                id="password"
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
            />
            <button type="submit">Login</button>
        </form>
    )
}

export default LoginForm