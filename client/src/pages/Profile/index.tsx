import { useEffect, useState } from "react";
import { FaArrowLeft, FaSave, FaTrash } from "react-icons/fa";

import '../../styles/Profile.css'
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../zustand/useAuthStore";
import axiosApi from "../../utils/axiosApi";


const Profile = () => {
    const { user } = useAuthStore();
    const [avatar, setAvatar] = useState(user?.avatarUrl || '/avatar.png');
    const [formData, setFormData] = useState({
        email: user?.email || '',
        username: user?.username || ''
      });
    const navigate = useNavigate();

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;
      
        const formData = new FormData();
        formData.append("file", file);
      
        try {
          const response = await axiosApi.post(`/user/${user.id}/avatar`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      
          useAuthStore.getState().setUser({
            ...user,
            avatarUrl: response.data.avatarUrl,
          });
      
          setAvatar(`${response.data.avatarUrl}?t=${Date.now()}`);
        } catch (error) {
          console.error("Upload failed:", error);
          setAvatar(user.avatarUrl || "/avatar.png");
        }
      };


  const handleDeleteAvatar = async () => {
    try {
        const response = await axiosApi(`/user/${user?.id}/avatar`);

        setAvatar('/avatar.png');
        } catch (error) {
            console.error('Error deleting avatar:', error);
        }
    };

    return (
        <div className="profile-container">
            <button className="back-button" onClick={() => navigate(-1)}>
            <FaArrowLeft />
            Back
            </button>
    
            <h1>Profile Settings</h1>
    
            <div className="avatar-section">
            <img 
                src={`${avatar}?t=${Date.now()}`} 
                alt={`${user?.username}'s avatar`}
                className="profile-avatar" 
            />
            <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
            />
            </div>
    
            <div className="profile-form">
            <div className="form-group">
                <label>Email Address</label>
                <input
                type="email"
                value={user?.email}
                disabled
                className="form-control"
                />
            </div>
    
            <div className="form-group">
                <label>Username</label>
                <input
                type="text"
                value={user?.username}
                disabled
                className="form-control"
                />
            </div>
            </div>
    
            <div className="action-buttons">
                <button className="save-button">
                    <FaSave /> Save Changes
                </button>
                <button className="save-button" onClick={handleDeleteAvatar}>
                    <FaTrash /> Remove Picture
                </button>
            </div>
        </div>
      );
}

export default Profile;