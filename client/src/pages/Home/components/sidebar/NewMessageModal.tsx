import { useEffect, useState } from 'react';
import '../../../../styles/MessageListModal.css'
import { getUsers } from '../../../../services/userService';
import { User } from '../../../../utils/types';
import useAuthStore from '../../../../zustand/useAuthStore';

interface UserListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSelect: (user: User) => void;
}

const UserListModal: React.FC<UserListModalProps> = ({ isOpen, onClose, onUserSelect }) => {

  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((userR) =>
    userR.username.toLowerCase().includes(searchTerm.toLowerCase()) && 
  userR.id !== user?.id 
  );

  useEffect(() => {
    if (isOpen) {
      const fetchUsers = async () => {
        try {
          const users = await getUsers();
          setUsers(users);
        } catch (error) {
          console.error('Failed to fetch users:', error);
        }
      };
      fetchUsers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="user-list-modal">
      <div className="modal-content">
        <div className="close-button-container">
          <button className="close-button" onClick={onClose}>
            <span className="close-icon">X</span>
          </button>
        </div>
        <h3>Select a user to start chatting</h3>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Scrollable User List */}
        <div className="user-list-scrollable">
          {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="user-item"
                onClick={() => onUserSelect(user)}
              >
                <img src="/avatar.png" alt={user.username} className="avatar" />
                <div className="user-info">
                  <h3>{user.username}</h3>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;