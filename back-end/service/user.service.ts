import {User} from "../model/user";
import userDb from "../repository/user.db";

const getAllUsers = async () => {
    return userDb.getAllUsers();
}

const getUserByUsername = async (username: string) : Promise<User | undefined> => {
    return userDb.getUserByUsername({ username });
}

export default {
    getAllUsers,
    getUserByUsername
}