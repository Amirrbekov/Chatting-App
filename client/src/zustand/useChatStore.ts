import { create } from "zustand";
import { Channel, Message } from "../utils/types";
import axiosApi from "../utils/axiosApi";

interface ChatState {
    channels: Channel[];
    messages: Message[];

    setMessages: (messages: Message[]) => void;
    setChannels: (channels: Channel[]) => void;

    activeChat: any;
    setActiveChat: (chat: any) => void;

    // addMessage: (message: Message) => void;
    // createConversation: (participantId: number) => Promise<void>;

    fetchChannels: () => Promise<void>;
    fetchMessages: () => Promise<void>;

}

const useChatStore = create<ChatState>((set) => ({
    channels: [],
    messages: [],

    activeChat: null,
    setActiveChat: (chat) => set({activeChat: chat}),

    setMessages: (messages) => set({ messages }),
    setChannels: (channels) => set({ channels }),

    fetchChannels: async () => {
        const response = await axiosApi.get(`/channel`);
        set({ channels: response.data });
    },

    fetchMessages: async () => {
        const response = await axiosApi.get('/message')
        set({ messages: response.data})
    }
}))

export default useChatStore;