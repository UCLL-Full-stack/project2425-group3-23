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

    // Relationships
    private messages : Message[];
    private chats : Chat[]; // User's chat
    private friends : User[]; // User's friends
    private friendRequests : FriendRequest[]; // User's received friend requests

    constructor(user: {
        username: string;
        role: string;
        password: string;
        messages: Message[];
        chats: Chat[];
        friends: User[];
        friendRequests: FriendRequest[];
    }) {
        this.validate(user);

        this.username = user.username;
        this.role = user.role;
        this.password = user.password;
        if (user.messages) {
            this.messages = user.messages;
        } else {
            this.messages = [];
        }
        if (user.chats) {
            this.chats = user.chats;
        } else {
            this.chats = [];
        }
        if (user.friends) {
            this.friends = user.friends;
        } else {
            this.friends = [];
        }
        if (user.friendRequests) {
            this.friendRequests = user.friendRequests;
        } else {
            this.friendRequests = [];
        }
    }

    validate(user: { username: string; role: string; password: string }) {
        if (!user.username) {
            throw new Error('Username is required');
        }
        if (!user.role) {
            throw new Error('Role is required');
        }
        if (!user.password) {
            throw new Error('Password is required');
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

    getMessages(): Message[] {
        return this.messages;
    }

    addMessage(message: Message) : void {
        this.messages.push(message);
    }

    setMessages(messages: Message[]) {
        this.messages = messages;
    }

    getChats(): Chat[] {
        return this.chats;
    }

    addChat(chat: Chat) : void {
        this.chats.push(chat);
    }

    setChats(chats: Chat[]) {
        this.chats = chats;
    }

    getFriends(): User[] {
        return this.friends;
    }

    addFriend(friend: User) : void {
        this.friends.push(friend);
    }

    setFriends(friends: User[]) {
        this.friends = friends;
    }

    getFriendRequests(): FriendRequest[] {
        return this.friendRequests;
    }

    addFriendRequest(friendRequest: FriendRequest) : void {
        this.friendRequests.push(friendRequest);
    }

    setFriendRequests(friendRequests: FriendRequest[]) {
        this.friendRequests = friendRequests;
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
            username: username,
            role: role,
            password: password,
            messages: !messages ? [] : messages.map((message) => {
                return new Message({
                    id: message.id,
                    content: message.content,
                    deleted: message.deleted,
                    sender: new User({
                        username: message.senderUsername,
                        role: "?",
                        password: "?",
                        chats: [],
                        messages: [],
                        friends: [],
                        friendRequests: []
                    }),
                    chat: new Chat({
                        id: message.chatId,
                        type: "?",
                        users: [],
                        messages: []
                    })
                });
            }),
            chats: !chats ? [] : chats.map((chat) => {
                return new Chat({
                    id: chat.id,
                    type: chat.type,
                    users: [],
                    messages: []
                });
            }),
            friends: !ownsFriends ? [] : ownsFriends.map((friend) => {
                return new User({
                    username: friend.username,
                    role: friend.role,
                    password: friend.password,
                    messages: [],
                    chats: [],
                    friends: [],
                    friendRequests: []
                });
            }),
            friendRequests: !receivedFriendRequests ? [] : receivedFriendRequests.map((friendRequest) => {
                return new FriendRequest({
                    id: friendRequest.id,
                    status: friendRequest.status,
                    sender: new User({
                        username: friendRequest.senderUsername,
                        role: "?",
                        password: "?",
                        messages: [],
                        chats: [],
                        friends: [],
                        friendRequests: []
                    }),
                    receiver: new User({
                        username: friendRequest.receiverUsername,
                        role: "?",
                        password: "?",
                        messages: [],
                        chats: [],
                        friends: [],
                        friendRequests: []
                    })
                });
            })
        });
    }
}