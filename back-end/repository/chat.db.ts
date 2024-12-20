import {Chat} from '../model/chat';
import database from './database';

const getAllChats = async (): Promise<Chat[]> => {
    try {
        const chatsPrisma = await database.chat.findMany({ include: { messages: true } });
        return chatsPrisma.map((chat: any) => Chat.from(chat));
    } catch (error) {
        throw new Error('Database error. See server logs for details.');
    }
}

const getPublicChat = async (): Promise<Chat> => {
    try {
        // Find the public chat
        let chatPrisma = await database.chat.findFirst({ where: { type: "public" }, include: { messages: true, users: true } });
        if (!chatPrisma) {
            // If the public chat does not exist, create it
            chatPrisma = await database.chat.create({
                data: {
                    type: "public"
                },
                include: { messages: true, users: true }
            });
        }

        return Chat.from(chatPrisma);
    } catch (error) {
        throw new Error('Database error. See server logs for details.');
    }
}

const getPrivateChat = async (user1: string, user2: string): Promise<Chat> => {
    try {
        const chatPrisma = await database.chat.findFirst({
            where: {
                type: "private",
                users: {
                    some: {
                        username: user1 || user2
                    }
                }
            },
            include: { messages: true, users: true }
        });

        if (!chatPrisma) {
            throw new Error('Chat not found.');
        }

        return Chat.from(chatPrisma);
    } catch (error) {
        throw new Error('Database error. See server logs for details.');
    }
}

const createPrivateChat = async (user1: string, user2: string): Promise<Chat> => {
    try {
        const chatPrisma = await database.chat.create({
            data: {
                type: "private",
                users: {
                    connect: [{ username: user1 }, { username: user2 }]
                }
            },
            include: { messages: true, users: true }
        });

        return Chat.from(chatPrisma);
    } catch (error) {
        throw new Error('Database error. See server logs for details.');
    }
}

export default {
    getAllChats,
    getPublicChat,
    getPrivateChat,
    createPrivateChat
}