import { useState } from "react";
import { FaArrowLeft, FaSave, FaTimes } from "react-icons/fa";

import '../../styles/Profile.css'
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/useAuthStore";


const Profile = () => {
    const { user } = useAuthStore();
    const [avatar, setAvatar] = useState('/avatar.png');
    const [email, setEmail] = useState('user@example.com');
    const [username, setUsername] = useState('user123');
    const [displayName, setDisplayName] = useState('John Doe');

    const navigate = useNavigate();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setAvatar(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        alert('Profile updated successfully!');
    };

    const handleCancel = () => {
        setAvatar('/avatar.png');
        setEmail('user@example.com');
        setUsername('user123');
        setDisplayName('John Doe');
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="profile-container">
            <button className="back-button" onClick={handleBack}>
                <FaArrowLeft /> Back
            </button>
            <h1>Profile</h1>
    
            <div className="avatar-section">
                <img src={avatar} alt="Profile Avatar" className="profile-avatar" />
                <label htmlFor="avatar-upload" className="avatar-upload-label">
                    Change Avatar
                </label>
                <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }}
                />
            </div>
    
            <div className="profile-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={user?.email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        value={user?.username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Display Name</label>
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                    />
                </div>
            </div>

            <div className="action-buttons">
                <button className="save-button" onClick={handleSave}>
                    <FaSave /> Save Changes
                    </button>
                    <button className="cancel-button" onClick={handleCancel}>
                    <FaTimes /> Cancel
                    </button>
            </div>
        </div>
      );
}

export default Profile;