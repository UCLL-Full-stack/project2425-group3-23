import {Message} from "./message";
import {
    User as UserPrisma,
    Message as MessagePrisma
} from "@prisma/client";
import {Chat} from "./chat";

export class User {
    // Primary Key
    private username: string;

    // Attributes
    private role: string;
    private password: string;

    // Relationships
    private messages : Message[];

    constructor(user: {
        username: string;
        role: string;
        password: string;
        messages: Message[];
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

    static from({
        username,
        role,
        password,
        messages
    } : UserPrisma & { messages: MessagePrisma[] }) : User {
        return new User({
            username: username,
            role: role,
            password: password,
            messages: messages.map((message) => {
                return new Message({
                    id: message.id,
                    content: message.content,
                    deleted: message.deleted,
                    sender: new User({
                        username: message.senderUsername,
                        role: "?",
                        password: "?",
                        messages: []
                    }),
                    chat: new Chat({
                        id: message.chatId,
                        type: "?",
                        users: [],
                        messages: []
                    })
                });
            })
        });
    }
}