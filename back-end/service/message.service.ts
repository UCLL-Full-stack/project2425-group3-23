import {Message} from "../model/message";
import userDb from "../repository/user.db";
import messageDb from "../repository/message.db";
import {User} from "../model/user";

const getAllMessages = () => {
    return messageDb.getAllMessages();
}

const createMessage = (message: Message) => {
    if (message.getSender() == null) {
        throw new Error('Message must have a sender.');
    }

    const sender : User | undefined  = userDb.getUserByUsername({ username: message.getSender().getUsername() });

    if (!sender) throw new Error('Sender not found.');

    messageDb.addMessage({ message });
    userDb.addMessageToUser({ username: sender.getUsername(), message });
}

export default {
    getAllMessages,
    createMessage,
}