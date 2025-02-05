import { create } from "zustand";
import { ChannelMessages, Message } from "../utils/types";


interface MessageState {
    messages: Message[];
    channelMessages: ChannelMessages[]

    setMessages: (messages: Message[]) => void;
    setChannelMessages: (channelMessages: ChannelMessages[]) => void

    addMessage: (message: Message) => void;
    addChannelMessages: (channelMessage: ChannelMessages) => void

    clearMessages: () => void;
}

const useMessageStore = create<MessageState>((set) => ({
    messages: [],
    channelMessages: [],
  
    setMessages: (messages) => set({ messages }),
    setChannelMessages: (channelMessages) => set({ channelMessages }),
    
    addMessage: (message) => set((state) => ({ 
      messages: [...state.messages, message] 
    })),
    addChannelMessages: (channelMessage) => set((state) => ({ 
        channelMessages: [...state.channelMessages, channelMessage] 
    })),
    
    clearMessages: () => set({ messages: [], channelMessages: [] }),
}))

export default useMessageStore