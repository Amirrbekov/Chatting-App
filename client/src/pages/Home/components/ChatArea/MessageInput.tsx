import { FaPaperclip, FaSmile } from "react-icons/fa"
import useChatStore from "../../../../zustand/useChatStore"
import { useEffect, useState } from "react";
import { getSocket } from "../../../../lib/socket";
import useMessageStore from "../../../../zustand/useMessageStore";
import { Message } from "../../../../utils/types";


const MessageInput = () => {

    const socket = getSocket();
    const { activeChat } = useChatStore();
    const { addMessage } = useMessageStore();
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {
        if (!socket) return;
    
        const handleNewMessage = (message: Message) => {
            console.log("Helo", message)
            addMessage(message)
        };
    
        socket.on('receiveMessage', handleNewMessage);
    
        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [socket, addMessage]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !socket) return

        try {
            socket.emit('sendMessage', {
                receiverId: activeChat.receiver.id,
                content: newMessage
            })
            setNewMessage('')
        } catch (error) {
            console.error('Error sending message:', error)
        }
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