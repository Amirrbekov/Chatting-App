import LoginForm from "./components/LoginForm";

import '../../styles/Auth.css';

import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    return (
        <div className="auth-container">
            <h2>Login</h2>
            <LoginForm/>
            <p>
                Don't have an account? <a href="/register">Register here</a>
            </p>
            <ToastContainer/>
        </div>
    )
}

export default Login;