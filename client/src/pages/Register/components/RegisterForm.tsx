import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../../services/authService";


const RegisterForm = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setconfirmPassword] = useState('');

    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }
        await register({ username: username, email: email, password: password, confirmPassword: confirmPassword });

        navigate('/login');
    }

    return (
        <form className='auth-form' onSubmit={onSubmit}>
            <input 
                type="username" 
                id="username"
                placeholder="Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
            />
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
            <input 
                type="password" 
                id="confirmPassword"
                placeholder="Confirm Password" 
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
                required 
            />
            <button type="submit">Register</button>
        </form>
    )
}

export default RegisterForm;