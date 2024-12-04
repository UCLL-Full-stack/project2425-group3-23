export interface MessageCreateUserInput {
    username: string;
}

export interface MessageCreateInput {
    content: string;
    sender: MessageCreateUserInput;
}

export interface User {
    username?: string;
    role?: string;
    password?: string;
    messages?: Message[];
    chats?: Chat[];
    friends?: User[];
    friendRequests?: FriendRequest[];
}

export interface Message {
    id?: number;
    content?: string;
    deleted?: boolean;
    sender?: User;
    chat?: Chat;
}

export interface Chat {
    id?: number;
    type?: string;
    users?: User[];
    messages?: Message[];
}

export interface FriendRequest {
    id?: number;
    status?: string;
    sender?: User;
    receiver?: User;
}

export interface AuthenticationResponse {
    token: string;
    username: string;
    role: string;
}