import {Message} from "../model/message";
import userDb from "../repository/user.db";
import chatDb from "../repository/chat.db";
import messageDb from "../repository/message.db";
import {User} from "../model/user";
import {MessageCreateInput} from "../types";
import {Chat} from "../model/chat";
import WebsocketService from "./websocket.service";

const getAllPublicChatMessages = async () => {
    return messageDb.getAllMessages();
}

const getMessageById = async (id: number) : Promise<Message | undefined> => {
    return messageDb.getMessageById(id);
}

const createMessage = async (messageInput: MessageCreateInput) : Promise<Message> => {
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

    const chat : Chat = await chatDb.getPublicChat(); // Later change this!
    const message : Message = new Message({ content: messageInput.content, deleted: false, sender, chat });

    const savedMessage : Message = await messageDb.addMessage({ message });
    WebsocketService.broadcast(JSON.stringify(savedMessage));
    return savedMessage;
}

export default {
    getAllPublicChatMessages,
    getMessageById,
    createMessage,
}