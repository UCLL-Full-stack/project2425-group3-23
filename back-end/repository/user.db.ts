import {User} from "../model/user";
import database from "./database";
import {FriendRequest} from "../model/friendRequest";
import bcrypt from "bcrypt";

const addUser = async ({ user } : { user: User }) : Promise<void> => {
    try {
        await database.user.create({
            data: {
                username: user.getUsername(),
                password: await bcrypt.hash(user.getPassword(), 12),
                role: user.getRole()
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getAllUsers = async () : Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            include: {
                messages: true,
                chats: true,
                ownsFriends: true,
                receivedFriendRequests: true
            }
        });
        return usersPrisma.map((user : any) => User.from(user));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getUserByUsername = async ({ username }: { username: string }) : Promise<User | undefined> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                username: username
            },
            include: {
                messages: true,
                chats: true,
                ownsFriends: true,
                receivedFriendRequests: true
            }
        });
        return userPrisma ? User.from(userPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getFriends = async ({ username }: { username: string }) : Promise<User[]> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                username: username
            },
            include: {
                ownsFriends: true
            }
        });

        console.log(userPrisma);

        return userPrisma ? userPrisma.ownsFriends.map((user : any) => User.from(user)) : [];
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const addFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    try {
        // Add the friend to the user's list of friends
        await database.user.update({
            where: {
                username: username
            },
            data: {
                ownsFriends: {
                    connect: {
                        username: friendUsername
                    }
                }
            }
        });
        // Add the user to the friend's list of friends
        await database.user.update({
            where: {
                username: friendUsername
            },
            data: {
                ownsFriends: {
                    connect: {
                        username: username
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const removeFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    try {
        // Remove the friend from the user's list of friends
        await database.user.update({
            where: {
                username: username
            },
            data: {
                ownsFriends: {
                    disconnect: {
                        username: friendUsername
                    }
                }
            }
        });
        // Remove the user from the friend's list of friends
        await database.user.update({
            where: {
                username: friendUsername
            },
            data: {
                ownsFriends: {
                    disconnect: {
                        username: username
                    }
                }
            }
        });
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getFriendRequests = async ({ username }: { username: string }) : Promise<FriendRequest[] | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: {
                username: username
            },
            include: {
                receivedFriendRequests: true
            }
        });

        return userPrisma ? userPrisma.receivedFriendRequests.map((friendRequest : any) => FriendRequest.from(friendRequest)) : null;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

export default {
    addUser,
    getAllUsers,
    getUserByUsername,
    getFriends,
    addFriend,
    removeFriend,
    getFriendRequests
}