import { FaCog, FaSignOutAlt, FaUser } from "react-icons/fa";
import { NavLink } from "react-router-dom";


const Footer = () => {
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
            <button className="footer-button">
                <FaSignOutAlt className="footer-icon" />
                Logout
            </button>
        </div>
    )
}

export default Footer;