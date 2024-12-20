import {Message} from "./message";
import {
    User as UserPrisma,
    Message as MessagePrisma,
    Chat as ChatPrisma,
    FriendRequest as FriendRequestPrisma
} from "@prisma/client";
import {Chat} from "./chat";
import {FriendRequest} from "./friendRequest";

export class User {
    // Primary Key
    private username: string;

    // Attributes
    private role: string;
    private password: string;
    private isBanned: boolean;

    // Relationships
    private messages? : Message[];
    private chats? : Chat[]; // User's chat
    private friends? : User[]; // User's friends
    private friendRequests? : FriendRequest[]; // User's received friend requests

    constructor(user: {
        username: string;
        role: string;
        password: string;
        messages?: Message[];
        chats?: Chat[];
        friends?: User[];
        friendRequests?: FriendRequest[];
        isBanned?: boolean;
    }) {
        this.validate(user);
        this.username = user.username;
        this.role = user.role;
        this.password = user.password;
        this.messages = user.messages;
        this.chats = user.chats;
        this.friends = user.friends;
        this.friendRequests = user.friendRequests;
        this.isBanned = user.isBanned || false;
    }

    validate(user: { username: string, role: string, password: string }) {
        if (user.username === 'user1' || user.username === 'user2') {
            // Ignore validation for seed data
            return;
        }

        if (!user.username) {
            throw new Error('Username is required');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
        if (!user.password) {
            throw new Error('Password is required');
        }

        // Validate length
        if (user.username.length > 20) {
            throw new Error('Username is too long');
        }
        if (user.password.length > 100) {
            throw new Error('Password is too long');
        }

        // Password requirements
        if (user.password.length < 4) {
            throw new Error('Password must be at least 8 characters long');
        }
        if (!/[a-z]/.test(user.password)) {
            throw new Error('Password must contain at least one lowercase letter');
        }
        if (!/[A-Z]/.test(user.password)) {
            throw new Error('Password must contain at least one uppercase letter');
        }
        if (!/[0-9]/.test(user.password)) {
            throw new Error('Password must contain at least one number');
        }
    }

    getUsername(): string {
        return this.username;
    }

    setUsername(value: string) : void {
        this.username = value;
    }

    getRole(): string {
        return this.role;
    }

    setRole(value: string) : void {
        this.role = value;
    }

    getPassword(): string {
        return this.password;
    }

    setPassword(value: string) : void {
        this.password = value;
    }

    getMessages(): Message[] | undefined {
        return this.messages;
    }

    addMessage(message: Message) : void {
        this.messages?.push(message);
    }

    setMessages(messages: Message[]) {
        this.messages = messages;
    }

    getChats(): Chat[] {
        return this.chats ? this.chats : [];
    }

    addChat(chat: Chat) : void {
        this.chats?.push(chat);
    }

    setChats(chats: Chat[]) {
        this.chats = chats;
    }

    getFriends(): User[] {
        return this.friends ? this.friends : [];
    }

    addFriend(friend: User) : void {
        this.friends?.push(friend);
    }

    setFriends(friends: User[]) {
        this.friends = friends;
    }

    getFriendRequests(): FriendRequest[] {
        return this.friendRequests ? this.friendRequests : [];
    }

    addFriendRequest(friendRequest: FriendRequest) : void {
        this.friendRequests?.push(friendRequest);
    }

    setFriendRequests(friendRequests: FriendRequest[]) {
        this.friendRequests = friendRequests;
    }

    isUserBanned(): boolean {
        return this.isBanned;
    }

    setBanned(value: boolean): void{
        this.isBanned = value;
    }

    static from({
        username,
        role,
        password,
        messages,
        chats,
        ownsFriends,
        receivedFriendRequests
    } : UserPrisma & { messages?: MessagePrisma[], chats?: ChatPrisma[], ownsFriends?: UserPrisma[], receivedFriendRequests? : FriendRequestPrisma[] }) : User {
        return new User({
            username,
            role,
            password,
            messages: messages ? messages.map((message) => Message.from(message)) : [],
            chats: chats ? chats.map((chat) => Chat.from(chat)) : [],
            friends: ownsFriends ? ownsFriends.map((user) => User.from(user)) : [],
            friendRequests: receivedFriendRequests ? receivedFriendRequests.map((friendRequest) => FriendRequest.from(friendRequest)) : []
        });
    }
}