import {User} from "./user";
import {
    FriendRequest as FriendRequestPrisma,
    User as UserPrisma
} from "@prisma/client";
import {Chat} from "./chat";

export class FriendRequest {
    // Primary Key
    private id: number;

    // Attributes
    private status: string;

    // Relationships
    private sender?: User;
    private receiver?: User;

    constructor(friendRequest: {
        id: number;
        status: string;
        sender?: User;
        receiver?: User;
    }) {
        this.validate(friendRequest);

        this.id = friendRequest.id;
        this.status = friendRequest.status;
        this.sender = friendRequest.sender;
        this.receiver = friendRequest.receiver;
    }

    getId(): number {
        return this.id;
    }

    getStatus(): string {
        return this.status;
    }

    setStatus(value: string) : void {
        this.status = value;
    }

    getSender(): User | undefined {
        return this.sender;
    }

    setSender(value: User) : void {
        this.sender = value;
    }

    getReceiver(): User | undefined {
        return this.receiver;
    }

    setReceiver(value: User) : void {
        this.receiver = value;
    }

    validate(friendRequest: { id: number; status: string; sender?: User; receiver?: User; }) {
        if (!friendRequest.id) {
            throw new Error('ID is required');
        }
        if (!friendRequest.status) {
            throw new Error('Status is required');
        }
        if (!friendRequest.sender) {
            throw new Error('Sender is required');
        }
        if (!friendRequest.receiver) {
            throw new Error('Receiver is required');
        }
    }

    static from({
        id,
        status,
        sender,
        receiver
    } : FriendRequestPrisma & {
        sender?: UserPrisma;
        receiver?: UserPrisma;
    }) {
        return new FriendRequest({
            id,
            status,
            sender: sender ? User.from(sender) : new User({
                username: '?',
                role: '?',
                password: 'Password01'
            }),
            receiver: receiver ? User.from(receiver) : new User({
                username: '?',
                role: '?',
                password: 'Password01'
            })
        });
    }
}