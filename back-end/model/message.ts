import {User} from "./user";
import {
    User as UserPrisma,
    Message as MessagePrisma,
    Chat as ChatPrisma
} from "@prisma/client";
import {Chat} from "./chat";

export class Message {
    // Primary Key
    private readonly id?: number;

    // Attributes
    private content: string;
    private deleted: boolean;

    // Relationships
    private sender?: User;
    private chat?: Chat;

    constructor(message: {
        id?: number;
        content: string;
        deleted?: boolean;
        sender?: User;
        chat?: Chat;
    }) {
        this.validate(message);

        this.id = message.id;
        this.content = message.content;
        if (message.deleted) {
            this.deleted = message.deleted;
        } else {
            this.deleted = false;
        }
        this.sender = message.sender;
        this.chat = message.chat;
    }

    validate(message: { content: string, sender?: User, chat?: Chat }) {
        if (!message.content) {
            throw new Error('Content is required');
        }
        if (!message.sender) {
            throw new Error('Sender is required');
        }
        if (!message.chat) {
            throw new Error('Chat is required');
        }
        if (message.content.length > 1000) {
            throw new Error('Content is too long');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getContent(): string {
        return this.content;
    }

    setContent(value: string) {
        this.content = value;
    }

    getDeleted(): boolean {
        return this.deleted;
    }

    setDeleted(value: boolean) {
        this.deleted = value;
    }

    getSender(): User | undefined {
        return this.sender;
    }

    setSender(value: User) {
        this.sender = value;
    }

    getChat(): Chat | undefined {
        return this.chat;
    }

    setChat(value: Chat) {
        this.chat = value;
    }

    static from({
        id,
        content,
        deleted,
        sender,
        chat,
    } : MessagePrisma & { sender?: UserPrisma, chat?: ChatPrisma }) : Message {
        return new Message({
            id,
            content,
            deleted,
            sender: sender ? User.from(sender) : new User({
                username: '?',
                role: '?',
                password: 'Password01'
            }),
            chat: chat ? Chat.from(chat) : new Chat({
                type: '?',
                users: [],
                messages: []
            })
        });
    }
}