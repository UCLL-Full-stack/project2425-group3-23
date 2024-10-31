import {User} from "../model/user";
import {Message} from "../model/message";

// This is currently a dummy database for users!
const users = [
    new User({
        username: 'Yorick',
        role: 'user',
        password: 'password01',
    }),
    new User({
        username: 'Sofie',
        role: 'user',
        password: 'password01',
    }),
];

const getAllUsers = () : User[] => {
    return users;
}

const getUserByUsername = ({ username }: { username: string }) : User | undefined => {
    return users.find((user: User) => user.getUsername() === username);
}

const addMessageToUser = ({ username, message }: { username: string, message: Message }) : void => {
    const user : User | undefined = getUserByUsername({ username });

    if (!user) {
        throw new Error('User not found.');
    } else if (message.getSender() == null) {
        throw new Error('Message must have a sender.');
    } else if (message.getSender().getUsername() != username) {
        throw new Error('Message sender must be the user.');
    }

    user.addMessage(message);
}

export default {
    getAllUsers,
    getUserByUsername,
    addMessageToUser,
}