import {Message} from "./message";

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
    }) {
        this.username = user.username;
        this.role = user.role;
        this.password = user.password;
        this.messages = [];
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
}