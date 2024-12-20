import {Chat} from "../model/chat";
import chatDb from "../repository/chat.db";

const getPublicChat = async () : Promise<Chat> => {
    return chatDb.getPublicChat();
}

const addUserToChat = async (chatId: number, username: string) : Promise<void> => {
    return chatDb.addUserToChat(chatId, username);
}

export default {
    getPublicChat,
    addUserToChat
}