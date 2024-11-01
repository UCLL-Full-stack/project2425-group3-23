export interface User {
    username: string;
    role: string;
    password: string;
}

export interface Message {
    id?: number;
    content: string;
    deleted: boolean;
    sender: User;
}