import { FaComments, FaEllipsisV, FaPhone, FaSearch, FaTimes, FaTrash, FaUserPlus, FaVideo } from "react-icons/fa";
import Messages from "./Messages";
import useChatStore from "../../../../zustand/useChatStore";
import useUserStatusStore from "../../../../zustand/useUserStatusStore";
import MessageInput from "./MessageInput";
import { useEffect, useState } from "react";
import AddUserModal from "./AddUserModal";
import useAuthStore from "../../../../zustand/useAuthStore";
import { User } from "../../../../utils/types";
import { getSocket } from "../../../../lib/socket";
import EmojiPicker from "emoji-picker-react";

const ChatArea = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [channelMembers, setChannelMembers] = useState<User[]>([]);

    const socket = getSocket();
    const { user } = useAuthStore();
    const { activeChat, setActiveChat, fetchChannels } = useChatStore();
    const { onlineUsers } = useUserStatusStore();

    useEffect(() => {
        if(activeChat){
            setChannelMembers(activeChat.members!)
        }
    }, [activeChat])

    const handleDeleteChannel = () => {
        if (!socket) return;

        socket.emit('channel:delete', {
            channelId: activeChat.id,
        });
        setActiveChat(null)
        fetchChannels();
        setShowDropdown(false);
    };

    const handleRemoveMember = (userId: string) => {
        if (!socket) return;

        socket.emit('addMemberToChannel', {
            channelId: activeChat.id,
            userId,
        });

        setChannelMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== userId)
        );

        console.log(`Removed user ${userId} from channel ${activeChat.id}`);
    }

    if (!activeChat) {
        return (
          <div className="welcome-message">
            <div className="welcome-content">
              <FaComments className="welcome-icon" />
              <h2>Welcome to Chatting App!</h2>
              <p>Start a new chat or select an existing one to begin messaging.</p>
              <EmojiPicker />
            </div>
          </div>
        );
    }

    
    const otherUser = activeChat.receiver?.id === user?.id ? activeChat.sender : activeChat.receiver
    const userStatus = onlineUsers.has(otherUser?.id) ? 'Online' : 'Offline'
    return (
        activeChat.receiver ?
        <div className="chat-area">
            <div className="chat-header">
                <img src="/avatar.png" alt={otherUser.username} className="avatar" />
                <div className="chat-infoo">
                    <h2>{otherUser.username}</h2>
                    <p>{userStatus}</p>
                </div>
                <div className="chat-actions">
                    <button className="action-button">
                        <FaPhone />
                    </button>
                    <button className="action-button">
                        <FaVideo />
                    </button>
                    <button className="action-button">
                        <FaSearch />
                    </button>
                    <button className="action-button">
                        <FaEllipsisV />
                    </button>
                </div>
            </div>
            <Messages />
            <MessageInput/>
        </div>     
        
        :

        <div className="chat-area">
            <div className="chat-header">
                <img src="/avatar.png" alt={activeChat.name} className="avatar" />
                <div className="chat-infoo">
                    <h2>{activeChat.name}</h2>
                </div>
                <div className="chat-actions">
                    <button className="action-button" onClick={() => setShowDropdown(!showDropdown)}>
                        <FaEllipsisV />
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <button 
                                className="dropdown-item" 
                                onClick={handleDeleteChannel}
                            >
                                <FaTrash /> Delete Channel
                            </button>
                            <button 
                                className="dropdown-item" 
                                onClick={() => {
                                    setShowAddUserModal(true);
                                    setShowDropdown(false);
                                }}
                            >
                                <FaUserPlus /> Add User
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showAddUserModal && (
                <AddUserModal
                activeChannel={activeChat}
                onClose={() => setShowAddUserModal(false)}
                />
            )}
            <Messages />
            <MessageInput/>
        </div> 
    )
}

export default ChatArea;