export type User ={
    username: string;
    role?: string;
    password: string;
    friends?: User[];
    friendRequests?: FriendRequest[];
    isBanned?: boolean;
}

export interface Message {
    id: number;
    content: string;
    deleted: boolean;
    sender: User;
}

export interface FriendRequest {
    id: number;
    status: string;
    sender: User;
    receiver: User;
}

export interface Response {
    message: string;
    status: string;
}
export type StatusMessage = {
    message: string;
    type: "error" | "success";
};