export type SignInFormType = {
    email: string;
    password: string;
};

export type SignUpFormType = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface User {
    id: string
    createdAt: string
    email: string
    avatarUrl: string | null
    username: string
}

export interface Channel {
    id: string
    createdAt: Date
    name: string
    members: User[]
    createdBy: User
}

export interface Message {
    id: string
    content: string
    timestamp: Date
    isRead: boolean
    messageType: string
    sender: User
    receiver: User
}

export interface ChannelMessages {
    id: string
    content: string
    timestamp: Date
    sender: User
    channel: Channel
}