import {Message} from "../model/message";
import database from "./database";

const getAllMessages = async () : Promise<Message[]> => {
    try {
        const messagesPrisma = await database.message.findMany({ include: { sender: true, chat: true } });
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
                        username: message.getSender().getUsername()
                    }
                },
                chat: {
                    connect: {
                        id: message.getChat().getId()
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

export default {
    getAllMessages,
    getMessageById,
    addMessage,
}