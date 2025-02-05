import { useEffect, useRef } from "react";
import { ChannelMessages, Message } from "../../../../utils/types";
import useAuthStore from "../../../../zustand/useAuthStore";
import { getSocket } from "../../../../lib/socket";
import useMessageStore from "../../../../zustand/useMessageStore";

const Messages = () => {

    const { user } = useAuthStore()
    const { messages, setMessages } = useMessageStore();
    const socket = getSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('conversation:messages', (message: Message[]) => {
            setMessages(message)
        })
    }, [socket, setMessages])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
      }, [messages])

    const formatTimestamp = (timestamp: Date) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    return (
        <div className="messages">
            {
                messages.map(message => (
                    <div key={message.id} className={`message ${message.sender.id === user?.id ? 'sent' : 'received'}`}>
                        <p>{message.content}</p>
                        <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
                    </div >
                ))
            }
            <div ref={messagesEndRef} />
        </div>
    )
}

export default Messages;