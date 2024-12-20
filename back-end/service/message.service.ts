import {Message} from "../model/message";
import userDb from "../repository/user.db";
import chatDb from "../repository/chat.db";
import messageDb from "../repository/message.db";
import {User} from "../model/user";
import {MessageCreateInput} from "../types";
import {Chat} from "../model/chat";
import WebsocketService from "./websocket.service";

const getAllPublicChatMessages = async () => {
    const chat = await chatDb.getPublicChat();
    return await messageDb.getAllMessagesByChatId(chat.getId() as number);
}

const getAllPublicChatMessagesAdmin = async () => {
    const chat = await chatDb.getPublicChat();
    return await messageDb.getAllMessagesByChatIdAdmin(chat.getId() as number);
}

const getAllPrivateChatMessages = async (user1: string, user2: string) => {
    try {
        const chat = await chatDb.getPrivateChat(user1, user2);
        return await messageDb.getAllMessagesByChatId(chat.getId() as number);
    } catch (error) {
        const chat = await chatDb.createPrivateChat(user1, user2);
        return await messageDb.getAllMessagesByChatId(chat.getId() as number);
    }
}

const getAllPrivateChatMessagesAdmin = async (user1: string, user2: string) => {
    try {
        const chat = await chatDb.getPrivateChat(user1, user2);
        return await messageDb.getAllMessagesByChatIdAdmin(chat.getId() as number);
    } catch (error) {
        throw new Error('Chat not found.');
    }
}

const getMessageById = async (id: number) : Promise<Message | undefined> => {
    return await messageDb.getMessageById(id);
}

const getMessageByIdAdmin = async (id: number) : Promise<Message | undefined> => {
    return await messageDb.getMessageByIdAdmin(id);
}

const createMessage = async (messageInput: MessageCreateInput, username?: string) : Promise<Message> => {
    if (!messageInput.content) {
        throw new Error('Message must have content.');
    }
    if (!messageInput.sender) {
        throw new Error('Message must have a sender.');
    }
    if (!messageInput.sender.username) {
        throw new Error('Sender must have a username.');
    }

    const sender : User | undefined  = await userDb.getUserByUsername({ username: messageInput.sender.username });
    if (!sender) {
        throw new Error('Sender not found.');
    }

    const chat : Chat = username ? await chatDb.getPrivateChat(sender.getUsername(), username) : await chatDb.getPublicChat();
    const message : Message = new Message({ content: messageInput.content, deleted: false, sender, chat });

    const savedMessage : Message = await messageDb.addMessage({ message });
    WebsocketService.broadcast(JSON.stringify(savedMessage));
    return savedMessage;
}

const deleteMessage = async (id: number) : Promise<void> => {
    const message : Message | undefined = await messageDb.getMessageById(id);

    if (!message) {
        throw new Error('Message not found.');
    }
    if (message.getDeleted()) {
        throw new Error('Message already deleted.');
    }

    await messageDb.deleteMessage(id);
}

const permanentlyDeleteMessage = async (id: number) : Promise<void> => {
    const message : Message | undefined = await messageDb.getMessageByIdAdmin(id);
    if (!message) {
        throw new Error('Message not found.');
    }

    await messageDb.permanentlyDeleteMessage(id);
}

export default {
    getAllPublicChatMessages,
    getAllPublicChatMessagesAdmin,
    getAllPrivateChatMessages,
    getAllPrivateChatMessagesAdmin,
    getMessageById,
    getMessageByIdAdmin,
    createMessage,
    deleteMessage,
    permanentlyDeleteMessage
}