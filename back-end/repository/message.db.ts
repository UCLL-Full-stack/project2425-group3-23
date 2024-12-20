import {Message} from "../model/message";
import database from "./database";

const getAllMessages = async () : Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({ include: { sender: true, chat: true } });
        return messagesPrisma.map((message : any) => Message.from(message)).filter((message : Message) => !message.getDeleted());
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getAllMessagesAdmin = async () : Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({ include: { sender: true, chat: true } });
        return messagesPrisma.map((message : any) => Message.from(message));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getAllMessagesByChatId = async (chatId : number) : Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            where: {
                chatId: chatId
            },
            include: { sender: true, chat: true }
        });
        return messagesPrisma.map((message : any) => Message.from(message)).filter((message : Message) => !message.getDeleted());
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getAllMessagesByChatIdAdmin = async (chatId: number) : Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({
            where: {
                chatId: chatId
            },
            include: { sender: true, chat: true }
        });
        return messagesPrisma.map((message : any) => Message.from(message));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getMessageById = async (id : number) : Promise<Message | undefined> => {
    try {
        const messagePrisma = await database.message.findUnique({
            where: {
                id: id
            },
            include: { sender: true, chat: true }
        });
        if (!messagePrisma) {
            return undefined;
        }

        const message : Message = Message.from(messagePrisma);
        return message.getDeleted() ? undefined : message;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.')
    }
}

const getMessageByIdAdmin = async (id : number) : Promise<Message | undefined> => {
    try {
        const messagePrisma = await database.message.findUnique({
            where: {
                id: id
            },
            include: {sender: true, chat: true}
        });
        if (!messagePrisma) {
            return undefined;
        }

        return Message.from(messagePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.')
    }
}

const addMessage = async ({ message }: { message: Message }) : Promise<Message> => {
    try {
        let createdMessagePrisma = await database.message.create({
            data: {
                content: message.getContent(),
                deleted: message.getDeleted(),
                sender: {
                    connect: {
                        username: message.getSender()?.getUsername()
                    }
                },
                chat: {
                    connect: {
                        id: message.getChat()?.getId()
                    }
                }
            },
            include: { sender: true, chat: true }
        });

        return Message.from(createdMessagePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const deleteMessage = async (id : number) : Promise<Message> => {
    try {
        let messagePrisma = await database.message.findUnique({
            where: {
                id: id
            },
            include: { sender: true, chat: true }
        });
        if (!messagePrisma) {
            throw new Error('Message not found.');
        }

        let deletedMessagePrisma = await database.message.update({
            where: {
                id: id
            },
            data: {
                deleted: true
            },
            include: { sender: true, chat: true }
        });

        return Message.from(deletedMessagePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const permanentlyDeleteMessage = async (id : number) : Promise<Message> => {
    try {
        let messagePrisma = await database.message.findUnique({
            where: {
                id: id
            },
            include: { sender: true, chat: true }
        });
        if (!messagePrisma) {
            throw new Error('Message not found.');
        }

        let deletedMessagePrisma = await database.message.delete({
            where: {
                id: id
            },
            include: { sender: true, chat: true }
        });

        return Message.from(deletedMessagePrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

export default {
    getAllMessages,
    getAllMessagesAdmin,
    getAllMessagesByChatId,
    getAllMessagesByChatIdAdmin,
    getMessageById,
    getMessageByIdAdmin,
    addMessage,
    deleteMessage,
    permanentlyDeleteMessage,
}