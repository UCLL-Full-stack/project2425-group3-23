import {User} from "./user";

export class Message {
    // Primary Key
    private readonly id?: number;

    // Attributes
    private content: string;
    private deleted: boolean;

    // Relationships
    private sender: User; // Make this readonly later!

    constructor(message: {
        id?: number;
        content: string;
        deleted: boolean;
        sender: User;
    }) {
        this.id = message.id;
        this.content = message.content;
        this.deleted = message.deleted;
        this.sender = message.sender;
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

    getSender(): User {
        return this.sender;
    }

    setSender(user: User) {
        this.sender = user;
    }
}