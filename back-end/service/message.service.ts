import {Message} from "../model/message";
import userDb from "../repository/user.db";
import chatDb from "../repository/chat.db";
import messageDb from "../repository/message.db";
import {User} from "../model/user";
import {MessageCreateInput} from "../types";
import {Chat} from "../model/chat";
import WebsocketService from "./websocket.service";
import {Message as MessageType} from "../types";
import {prepareMessage} from "../util/dtoConverters";
import userService from "./user.service";
import {UnauthorizedError} from "express-jwt";

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

const createMessage = async (messageInput: MessageCreateInput, friendUsername?: string) : Promise<Message> => {
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

    const chat : Chat = friendUsername ? await chatDb.getPrivateChat(sender.getUsername(), friendUsername) : await chatDb.getPublicChat();
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

// Authenticated methods

const authGetAllPublicChatMessages = async (authUser : { username : string, role : string }) => {
    let messages;
    if (authUser.role === 'admin') {
        messages = await getAllPublicChatMessagesAdmin();
    } else {
        messages = await getAllPublicChatMessages();
    }

    const data: MessageType[] = messages as unknown as MessageType[];
    data.map((message: MessageType) => {
        prepareMessage(message);
    });

    return data;
}

const authGetAllPrivateChatMessages = async (authUser : { username : string, role : string }, friendUsername : string) => {
    if (authUser.role === 'admin') {
        const user = await userDb.getUserByUsername({ username: friendUsername });
        if (!user) {
            throw new Error('User not found.');
        }
        const friends = user.getFriends();
        if (!friends.map(f => f.getUsername()).includes(friendUsername)) {
            throw new Error('You are not friends with this user.');
        }

        const messages = await getAllPrivateChatMessagesAdmin(authUser.username, friendUsername);

        const data: MessageType[] = messages as unknown as MessageType[];
        data.map((message: MessageType) => {
            prepareMessage(message);
        });

        return data;
    } else if (authUser.role === 'user') {
        const user = await userDb.getUserByUsername({ username: authUser.username });
        if (!user) {
            throw new Error('User not found.');
        }
        const friends = user.getFriends();
        if (!friends.map(f => f.getUsername()).includes(friendUsername)) {
            throw new Error('You are not friends with this user.');
        }

        const messages = await getAllPrivateChatMessages(authUser.username, friendUsername);

        const data: MessageType[] = messages as unknown as MessageType[];
        data.map((message: MessageType) => {
            prepareMessage(message);
        });

        return data;
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authGetMessageById = async (authUser : { username : string, role : string }, id : number) => {
    if (authUser.role === 'admin') {
        const message = await messageDb.getMessageByIdAdmin(id);
        if (!message) {
            throw new Error('Message not found.');
        }

        const data: MessageType = message as unknown as MessageType;
        prepareMessage(data);

        return data;
    } else if (authUser.role === 'user') {
        const ownUser = await userDb.getUserByUsername({ username: authUser.username });
        if (!ownUser) {
            throw new Error('User not found.');
        }

        const message = await messageDb.getMessageById(id);
        if (!message) {
            throw new Error('Message not found.');
        }

        const chatId = message.getChat()?.getId();
        if (!chatId || await userService.hasChat(ownUser, chatId)) {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
        }

        const data: MessageType = message as unknown as MessageType;
        prepareMessage(data);

        return data;
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authCreateMessage = async (authUser : { username : string, role : string }, messageInput : MessageCreateInput) => {
    if (authUser.role === 'admin' || authUser.role === 'user') {
        messageInput.sender = { username: authUser.username }

        return await createMessage(messageInput);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authCreatePrivateChatMessage = async (authUser : { username : string, role : string }, friendUsername : string, messageInput : MessageCreateInput) => {
    if (authUser.role === 'admin' || authUser.role === 'user') {
        messageInput.sender = { username: authUser.username }

        return await createMessage(messageInput, friendUsername);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authDeleteMessageById = async (authUser : { username : string, role : string }, id : number) => {
    if (authUser.role === 'admin') {
        const message = await messageDb.getMessageByIdAdmin(id);
        if (!message) {
            throw new Error('Message not found.');
        }

        if (!message.getDeleted()) {
            await deleteMessage(id);
        } else {
            await permanentlyDeleteMessage(id);
        }
    } else if (authUser.role === 'user') {
        const user = await userDb.getUserByUsername({ username: authUser.username });
        if (!user) {
            throw new Error('User not found.');
        }

        const message = await messageDb.getMessageById(id);
        if (!message) {
            throw new Error('Message not found.');
        }
        if (message.getSender()?.getUsername() !== authUser.username) {
            throw new UnauthorizedError('credentials_bad_scheme', {message: 'You may only delete your own messages.'});
        }
        if (message.getDeleted()) {
            throw new Error('Message already deleted.');
        }

        await deleteMessage(id);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', {message: 'You do not have the required role to access this content.'})
    }
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
    permanentlyDeleteMessage,
    // Auth methods
    authGetAllPublicChatMessages,
    authGetAllPrivateChatMessages,
    authGetMessageById,
    authCreateMessage,
    authCreatePrivateChatMessage,
    authDeleteMessageById
}