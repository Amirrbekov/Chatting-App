import { FaCircle } from "react-icons/fa";
import { getSocket } from "../../../../lib/socket";
import { useEffect } from "react";
import useUserStatusStore from "../../../../zustand/useUserStatusStore";


const ChatList = () => {

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
        <>
            <div className="channels-section">
                <h3>Channels</h3>
                <div className="channel-item">
                    <img src="/avatar.png" alt="Tech News" className="avatar" />
                    <div className="channel-info">
                        <h3>Tech News</h3>
                        <p>Latest in technology</p>
                    </div>
                </div>
                <div className="channel-item">
                    <img src="/avatar.png" alt="Design Trends" className="avatar" />
                    <div className="channel-info">
                        <h3>Design Trends</h3>
                        <p>Explore design trends</p>
                    </div>
                </div>
            </div>
            <div className="chat-list">
                <div className="chat-item">
                    <img src="/avatar.png" alt="John Doe" className="avatar" />
                    <div className="chat-info">
                        <h3>John Doe</h3>
                        <p>Hey, how are you?</p>
                    </div>
                    <div className="chat-status">
                        <FaCircle className="online" />
                        <span className="timestamp">10:00 AM</span>
                    </div>
                </div>
                <div className="chat-item">
                    <img src="/avatar.png" alt="John Doe" className="avatar" />
                    <div className="chat-info">
                        <h3>Jane Smith</h3>
                        <p>See you later!</p>
                    </div>
                    <div className="chat-status">
                        <FaCircle className="offline" />
                        <span className="timestamp">Yesterday</span>
                    </div>
                </div>
                <div className="chat-item">
                    <img src="/avatar.png" alt="John Doe" className="avatar" />
                    <div className="chat-info">
                        <h3>Alice Johnson</h3>
                        <p>Sent a photo</p>
                    </div>
                    <div className="chat-status">
                        <FaCircle className="online" />
                        <span className="timestamp">2 days ago</span>
                    </div>
                </div>
                <div className="chat-item">
                    <img src="/avatar.png" alt="John Doe" className="avatar" />
                    <div className="chat-info">
                        <h3>Alice Johnson</h3>
                        <p>Sent a photo</p>
                    </div>
                    <div className="chat-status">
                        <FaCircle className="online" />
                        <span className="timestamp">2 days ago</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatList;