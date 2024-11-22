import {User} from "../model/user";
import database from "./database";

const getAllUsers = async () : Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({ include: { messages: true } });
        return usersPrisma.map((user : any) => User.from(user));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getUserByUsername = async ({ username }: { username: string }) : Promise<User | undefined> => {
    try {
        const userPrisma = await database.user.findUnique({ where: { username }, include: { messages: true } });
        return userPrisma ? User.from(userPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

export default {
    getAllUsers,
    getUserByUsername
}