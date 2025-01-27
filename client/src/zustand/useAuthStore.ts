import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import jwtDecode from 'jwt-decode';

import { User } from '../utils/types';
import { logout } from '../services/authService';
import { getUser } from '../services/userService';
import { disconnectSocket, initializeSocket } from '../lib/socket';

interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    initializeUser: () => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user: User | null) => set({ user }),
            logout: async () => {
                disconnectSocket();
                await logout()
                localStorage.removeItem('access_token');
                set({ user: null });
            },
            initializeUser: async () => {
                const token = localStorage.getItem('access_token');
                
                if (!token) {
                    set({ user: null });
                    return;
                }
                try {
                    const { sub, email } = jwtDecode<{ sub: string; email: string }>(token);
                    const userData = await getUser(sub);

                    if (!userData) {
                        throw new Error('User data not found');
                    }

                    set({
                        user: {
                          id: sub,
                          email,
                          createdAt: Date.now().toString(),
                          username: userData.username
                        }
                    });
                    initializeSocket();
                } catch(err) {
                    console.error('Failed to initialize user:', err);
                    localStorage.removeItem('access_token');
                    set({ user: null });
                }
            }
        }),
        {
            name: 'auth-storage',
        }
    )
)

export default useAuthStore;