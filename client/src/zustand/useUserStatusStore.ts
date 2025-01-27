import { create } from "zustand";

interface UserStatusState {
    onlineUsers: Set<string>;
    setOnlineUsers: (users: string[]) => void;
    updateUserStatus: (userId: string, status: 'online' | 'offline') => void;
    isUserOnline: (userId: string) => boolean;
}

const useUserStatusStore = create<UserStatusState>((set, get) => ({

    onlineUsers: new Set<string>(),

    setOnlineUsers: (users) => set({
        onlineUsers: new Set(users)
    }),

    updateUserStatus: (userId, status) => set((state) => {
        const newOnlineUsers = new Set(state.onlineUsers);
        if(status === 'online') newOnlineUsers.add(userId);
        else newOnlineUsers.delete(userId);

        return { onlineUsers: newOnlineUsers }
    }),

    isUserOnline: (userId) => get().onlineUsers.has(userId),
}))

export default useUserStatusStore;