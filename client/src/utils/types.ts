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
    username: string
}

export interface Channel {
    id: string
    createdAt: Date
    updatedAt: Date
    name: string
    description: string
    users: User[]
    owner: User
    messages: Message[]
}

export interface Conversation {
    id: string
    createdAt: Date
    updatedAt: Date
    creator: User
    recipient: User
    messages: Message[]
}

export interface Message {
    id: string
    createdAt: Date
    updatedAt: Date
    text: string
    author: {
        id: string
        username: string
    }
    channel: {
        id: string
        name: string
    }
    conversation: {
        id: string
    }
}

export interface ProfileData {
    username: string
    email: string
    avatarUrl: string
}