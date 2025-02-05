import Sidebar from "./components/sidebar";
import '../../styles/Home.css'
import ChatArea from "./components/ChatArea";
import { useEffect } from "react";
import { getSocket } from "../../lib/socket";
import useUserStatusStore from "../../zustand/useUserStatusStore";
import useChatStore from "../../zustand/useChatStore";
import useAuthStore from "../../zustand/useAuthStore";

const Home = () => {

    const { user } = useAuthStore();
    const { setActiveChat } = useChatStore();
    const { setOnlineUsers } = useUserStatusStore();
    const socket = getSocket();

    useEffect(() => {
        
        if (!socket) return;
        
        const handleOnlineUsers = (users: string[]) => {
            setOnlineUsers(users);
        };
    
        socket.on('users:online', handleOnlineUsers);

        socket.emit('users:online');
    
        return () => {
            socket.off('users:online', handleOnlineUsers);
        };
    }, [socket, setOnlineUsers])

    const handleChatSelect = async (chat: any) => {
        const otherUser = chat.sender.id === user?.id ? chat.receiver.id : chat.sender.id;
        setActiveChat(chat);
        if (chat.receiver) {
            socket?.emit('conversation:join', { otherUserId: otherUser })
        } else {
            socket?.emit('channel:join', { channelId: chat.id })
        }
    };

    return (
        <div className="home-container">
            <Sidebar onChatSelect={handleChatSelect}/>
            <ChatArea />
        </div>
    )
}

export default Home;