import { useEffect, useRef } from "react";
import { ChannelMessages, Message } from "../../../../utils/types";
import useAuthStore from "../../../../zustand/useAuthStore";
import { getSocket } from "../../../../lib/socket";
import useMessageStore from "../../../../zustand/useMessageStore";
import useChatStore from "../../../../zustand/useChatStore";

const Messages = () => {

    const { user } = useAuthStore()
    const { setMessages, setChannelMessages, addMessage, addChannelMessage} = useMessageStore();
    const messages = useMessageStore(state => state.messages);
    const channelMessages = useMessageStore(state => state.channelMessages);
    const { activeChat } = useChatStore();
    const socket = getSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('conversation:messages', (message: Message[]) => {
            setMessages(message)
        })

        socket.on('channel:messages', (message: ChannelMessages[]) => {
            setChannelMessages(message)
        })

        socket.on('receiveMessage', (message: any) => {
            addMessage(message)
        })
    
        socket.on('receiveChannelMessage', (message: any) => {
            addChannelMessage(message);
        });

        return () => {
            socket.off('receiveChannelMessage');
            socket.off('receiveMessage');
            socket.off('conversation:messages');
        };
    }, [socket, setMessages, addMessage, addChannelMessage])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, channelMessages])

    const formatTimestamp = (timestamp: Date) => {
        return new Date(timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        })
    }

    return (
        activeChat.receiver ?   
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
        :
        <div className="messages">
            {
                channelMessages.map(message => (
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