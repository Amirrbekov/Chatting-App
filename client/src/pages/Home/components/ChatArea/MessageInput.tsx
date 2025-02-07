import { FaPaperclip, FaSmile } from "react-icons/fa"
import useChatStore from "../../../../zustand/useChatStore"
import { useState } from "react";
import { getSocket } from "../../../../lib/socket";
import useAuthStore from "../../../../zustand/useAuthStore";

const MessageInput = () => {

    const socket = getSocket();
    const { user } = useAuthStore();
    const { activeChat } = useChatStore();
   
    const [newMessage, setNewMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !socket) return

        if(activeChat.receiver) {
            socket.emit('sendMessage', {
                receiverId: activeChat.receiver.id === user?.id ? activeChat.sender.id : activeChat.receiver.id,
                content: newMessage
            })
        } else {
            socket.emit('sendMessageChannel', {
                channelId: activeChat.id,
                content: newMessage
            })
        }

        setNewMessage('')
    }

    return (
        <form className="message-input" onSubmit={handleSubmit}>
            <button className="file-button">
                <FaPaperclip />
            </button>
            <input 
                type="text" 
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
            />
            <button className="emoji-button">
                <FaSmile />
            </button>
            <button className="send-button" type="submit">Send</button>
        </form>
    )
}

export default MessageInput