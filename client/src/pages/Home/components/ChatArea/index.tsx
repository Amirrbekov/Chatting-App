import { FaComments, FaEllipsisV, FaPhone, FaSearch, FaVideo } from "react-icons/fa";
import Messages from "./Messages";
import useChatStore from "../../../../zustand/useChatStore";
import useUserStatusStore from "../../../../zustand/useUserStatusStore";
import MessageInput from "./MessageInput";

const ChatArea = () => {

    const { activeChat } = useChatStore();
    const { onlineUsers } = useUserStatusStore();

    if (!activeChat) {
        return (
          <div className="welcome-message">
            <div className="welcome-content">
              <FaComments className="welcome-icon" />
              <h2>Welcome to Chatting App!</h2>
              <p>Start a new chat or select an existing one to begin messaging.</p>
            </div>
          </div>
        );
    }

    const userStatus = onlineUsers.has(activeChat.id) ? 'Online' : 'Offline'
    return (
        activeChat.username ?
        <div className="chat-area">
            <div className="chat-header">
                <img src="/avatar.png" alt={activeChat.username} className="avatar" />
                <div className="chat-infoo">
                    <h2>{activeChat.username}</h2>
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
    )
}

export default ChatArea;