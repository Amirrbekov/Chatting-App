import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useAuthStore from "../../../../zustand/useAuthStore";


const Footer = () => {

    const { logout } = useAuthStore();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };
    return (
        <div className="sidebar-footer">
            <NavLink  className="footer-button" to={"/profile"}>
                <FaUser className="footer-icon" />
                Profile
            </NavLink>
            <button className="footer-button">
                <FaCog className="footer-icon" />
                Settings
            </button>
            <button onClick={handleLogout} className="footer-button">
                <FaSignOutAlt className="footer-icon" />
                Logout
            </button>
        </div>
    )
}

export default Footer;