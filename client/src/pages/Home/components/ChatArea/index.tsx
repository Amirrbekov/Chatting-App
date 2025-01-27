import { FaEllipsisV, FaPaperclip, FaPhone, FaSearch, FaSmile, FaVideo } from "react-icons/fa";
import Messages from "./Messages";
import { getSocket } from "../../../../lib/socket";
import useUserStatusStore from "../../../../zustand/useUserStatusStore";
import { useEffect } from "react";


const ChatArea = () => {

    const { setOnlineUsers } = useUserStatusStore()

    const socket = getSocket();

    useEffect(() => {
        socket.on('users:online', (users: string[]) => {
            setOnlineUsers(users)
        })

        socket.emit('users:online')

        return () => {
            socket.off('users:online')
        }
    }, [socket])

    return (
        <div className="chat-area">
            <div className="chat-header">
                <img src="/avatar.png" alt="John Doe" className="avatar" />
                <div className="chat-infoo">
                    <h2>John Doe</h2>
                    <p className="status">Online</p>
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
            <Messages/>
            <div className="message-input">
                <button className="file-button">
                    <FaPaperclip />
                </button>
                <input type="text" placeholder="Type a message..." />
                <button className="emoji-button">
                    <FaSmile />
                </button>
                <button className="send-button">Send</button>
            </div>
        </div>
    )
}

export default ChatArea;