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