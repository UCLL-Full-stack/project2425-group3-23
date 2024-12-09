import {User} from "./user";
import {Message} from "./message";
import {
    User as UserPrisma,
    Message as MessagePrisma,
    Chat as ChatPrisma
} from "@prisma/client";

export class Chat {
    // Primary Key\
    private readonly id?: number;

    // Attributes
    private type: string;

    // Relationships
    private users?: User[];
    private messages?: Message[];

    constructor(chat: {
        id?: number;
        type: string;
        users: User[];
        messages: Message[];
    }) {
        this.validate(chat);

        this.id = chat.id;
        this.type = chat.type;
        if (chat.users) {
            this.users = chat.users;
        } else {
            this.users = [];
        }
        if (chat.messages) {
            this.messages = chat.messages;
        } else {
            this.messages = [];
        }
    }

    validate(chat: { type: string; users: User[]; messages: Message[] }) {
        if (!chat.type) {
            throw new Error('Type is required');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getType(): string {
        return this.type;
    }

    setType(value: string) {
        this.type = value;
    }

    getUsers(): User[] | undefined {
        return this.users;
    }

    setUsers(value: User[]) {
        this.users = value;
    }

    getMessages(): Message[] | undefined {
        return this.messages;
    }

    setMessages(value: Message[]) {
        this.messages = value;
    }

    static from({
        id,
        type,
        users,
        messages
    } : ChatPrisma & { users?: UserPrisma[], messages?: MessagePrisma[] }): Chat {
        return new Chat({
            id,
            type,
            users: users ? users.map(user => User.from(user)) : [],
            messages: messages ? messages.map(message => Message.from(message)) : []
        });
    }
}