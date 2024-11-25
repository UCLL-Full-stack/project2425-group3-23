import {User} from "../model/user";
import userDb from "../repository/user.db";

const getAllUsers = async () => {
    return userDb.getAllUsers();
}

const getUserByUsername = async (username: string) : Promise<User | undefined> => {
    return userDb.getUserByUsername({ username });
}

const getFriends = async (username: string) : Promise<User[]> => {
    return userDb.getFriends({ username });
}

const addFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    return userDb.addFriend({ username, friendUsername });
}

const removeFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    return userDb.removeFriend({ username, friendUsername });
}

export default {
    getAllUsers,
    getUserByUsername,
    getFriends,
    addFriend,
    removeFriend
}