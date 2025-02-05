import { FaCircle } from "react-icons/fa";
import useUserStatusStore from "../../../../zustand/useUserStatusStore";
import { useEffect } from "react";
import useChatStore from "../../../../zustand/useChatStore";
import useAuthStore from "../../../../zustand/useAuthStore";
import { Message, User } from "../../../../utils/types";

interface ChatListProps {
    onChatSelect: (chat: any) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {

    const user = useAuthStore(state => state.user)
    const { channels, messages, fetchChannels, fetchMessages } = useChatStore();
    const { onlineUsers } = useUserStatusStore();

    useEffect(() => {
        fetchChannels();
        fetchMessages();
    }, [fetchChannels, fetchMessages])

    const uniqueConversations = messages.reduce((acc, message) => {
        const otherUser = message.sender.id === user?.id ? message.receiver : message.sender;
        
        if (!acc[otherUser.id]) {
          acc[otherUser.id] = {
            lastMessage: message,
            otherUser
          };
        } else if (new Date(message.timestamp) > new Date(acc[otherUser.id].lastMessage.timestamp)) {
          acc[otherUser.id].lastMessage = message;
        }
        
        return acc;
    }, {} as Record<string, { lastMessage: Message; otherUser: User }>);

    return (
        <>
            <div className="channels-section">
                <h3>Channels</h3>
                {
                    channels.map(channel => (
                        <div key={channel.id} onClick={() => onChatSelect(channel)} className="channel-item">
                            <img src="/avatar.png" alt={`${channel.name}`} className="avatar" />
                            <div className="channel-info">
                                <h3>{channel.name}</h3>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className="chat-list">
                {Object.values(uniqueConversations).map(({ lastMessage, otherUser }) => {
                    const userStatus = onlineUsers.has(otherUser.id) ? 'online' : 'offline';
                    
                    return (
                        <div 
                            key={otherUser.id} 
                            onClick={() => onChatSelect(lastMessage)} 
                            className="chat-item active"
                        >
                                <img src="/avatar.png" alt={`${otherUser.username}`} className="avatar" />
                            <div className="chat-info">
                                <h3>{otherUser.username}</h3>
                                <p>{lastMessage.content}</p>
                            </div>
                            <div className="chat-status">
                                <FaCircle className={userStatus} />
                                <span className="timestamp">
                                    {new Date(lastMessage.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    )
}

export default ChatList;