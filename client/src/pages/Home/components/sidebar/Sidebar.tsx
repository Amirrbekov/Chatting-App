import Searchbar from "./Searcbar";
import ChatList from "./ChatList";
import Footer from "./Footer";
import { FaPlus, FaUsers } from "react-icons/fa";
import { ChannelModal } from "./CreateChannelModal";
import { useEffect, useState } from "react";
import { getSocket } from "../../../../lib/socket";
import useChatStore from "../../../../zustand/useChatStore";
import UserListModal from "./NewMessageModal";
import { User } from "../../../../utils/types";
import useAuthStore from "../../../../zustand/useAuthStore";


interface SidebarProps {
    onChatSelect: (chat: any) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChatSelect }) => {

    const {
        messages,
        setActiveChat,
        fetchChannels,
    } = useChatStore();

    const { user } = useAuthStore();
    const [isUserListOpen, setIsUserListOpen] = useState(false);
    const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false)

    const socket = getSocket();


    const handleCreateChannel = (channelName: string) => {
        if (!channelName.trim()) return
        if (!socket) return;
        
        socket.emit('channel:create', {
            name: channelName,
        })
        fetchChannels();
        setIsCreateChannelOpen(false)
    }

    const handleUserSelect = async (userR: User) => {
        const existingConversation = messages.find(
            (conv) => conv.receiver.id === userR.id && conv.sender.id === userR.id
        );

        if (existingConversation) {
            setActiveChat(existingConversation);
        } else {
            const tempChat = {
                id: user?.id,
                receiver: userR,
                username: user?.username,
                messages: [],
            };
            setActiveChat(tempChat);
        }
        setIsUserListOpen(false);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-buttons">
                <button onClick={() => setIsUserListOpen(true)} className="new-message-button">
                    <FaPlus /> New Message
                </button>
                 <button onClick={() => setIsCreateChannelOpen(true)} className="create-channel-button">
                    <FaUsers /> Create Channel
                </button>
            </div>
            <Searchbar/>
            <ChannelModal
                isOpen={isCreateChannelOpen} 
                onClose={() => setIsCreateChannelOpen(false)}
                onCreateChannel={handleCreateChannel}
            />
            <UserListModal
                isOpen={isUserListOpen}
                onClose={() => setIsUserListOpen(false)}
                onUserSelect={handleUserSelect}
            />
            <ChatList onChatSelect={onChatSelect}/>
            <Footer/>
        </div>
    )
}

export default Sidebar;