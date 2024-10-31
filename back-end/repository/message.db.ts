import {Message} from "../model/message";
import {User} from "../model/user";

// This is currently a dummy database for messages!
const messages : Message[] = [
    new Message({
        id: 1,
        content: 'Hello, world!',
        deleted: false,
        sender: new User({
            username: 'Yorick',
            role: 'user',
            password: 'password01',
        })
    }),
    new Message({
        id: 2,
        content: 'Hi, Yorick! 😅',
        deleted: false,
        sender: new User({
            username: 'Sofie',
            role: 'user',
            password: 'password01',
        })
    })
];

const getAllMessages = () : Message[] => {
    return messages;
}

const getMessageById = ({ id }: { id: number }) : Message | undefined => {
    return messages.find((message: Message) => message.getId() === id);
}

const addMessage = ({ message }: { message: Message }) : void => {
    if (message.getSender() == null) {
        throw new Error('Message must have a sender.');
    }

    messages.push(message);
}

export default {
    getAllMessages,
    getMessageById,
    addMessage,
}