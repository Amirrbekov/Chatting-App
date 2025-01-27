import RegisterForm from "./components/RegisterForm";

import '../../styles/Auth.css';

const Register = () => {
    return (
        <div className="auth-container">
            <h2>Register</h2>
            <RegisterForm/>
            <p>
                Already have an account? <a href="/login">Sign in here</a>
            </p>
        </div>
    )
}

export default Register;