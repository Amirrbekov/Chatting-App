import { useEffect, useState } from "react";

import '../../../../styles/AddUserModal.css'
import { getUsers } from "../../../../services/userService";
import { User } from "../../../../utils/types";
import useAuthStore from "../../../../zustand/useAuthStore";
import { getSocket } from "../../../../lib/socket";

interface AddUserProps {
    activeChannel: any;
    onClose: () => void;
}

const AddUserModal = ({ activeChannel, onClose }: AddUserProps) => {

    const { user } = useAuthStore();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]); 
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const socket = getSocket();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
            const users = await getUsers();
            setUsers(users);
            } catch (error) {
            console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    });

    const handleAddUsers = () => {
        if (!socket) return;

        socket.emit('addMemberToChannel', {
            channelId: activeChannel.id,
            userIds: selectedUsers,
        });

        console.log("Adding users:", selectedUsers);
        onClose();
    };

    const filteredUsers = users.filter(
        (userR) =>
            userR.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
            userR.id !== user?.id
    );

    return (
        <div className="modal-overlay">
            <div className="add-user-modal">
                <div className="modal-header">
                    <button className="close-button" onClick={onClose}>
                        <span className="close-icon">X</span>
                    </button>
                </div>
                <h3>Add Users to {activeChannel?.name}</h3>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                <div className="user-list">
                    {filteredUsers.map((userR) => (
                        <label key={userR.id} className="user-item">
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(userR.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedUsers([...selectedUsers, userR.id]);
                                    } else {
                                        setSelectedUsers(selectedUsers.filter((id) => id !== userR.id));
                                    }
                                }}
                            />
                            <span>{userR.username}</span>
                        </label>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirm-button" onClick={handleAddUsers}>
                        Add Users
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;