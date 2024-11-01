export type User = {
    username: string;
    role: string;
    password: string;
}

export type Message = {
    id?: number;
    content: string;
    deleted: boolean;
    sender: User;
}