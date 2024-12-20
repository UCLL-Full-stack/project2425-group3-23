import {User} from "../model/user";
import {User as UserType, FriendRequest as FriendRequestType} from "../types/index"
import userDb from "../repository/user.db";
import {FriendRequest} from "../model/friendRequest";
import friendRequestDb from "../repository/friendRequest.db";
import chatDb from "../repository/chat.db";
import {prepareFriend, prepareFriendRequest, prepareUser, prepareUserStrict} from "../util/dtoConverters";
import {UnauthorizedError} from "express-jwt";

const getAllUsers = async () => {

}

const getUserByUsername = async (username: string) : Promise<User | undefined> => {
    return userDb.getUserByUsername({ username });
}

const getFriends = async (username: string) : Promise<User[]> => {
    return userDb.getFriends({ username });
}

const isFriends = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<boolean> => {
    return userDb.isFriend({ username, friendUsername });
}

const addFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const friend = await userDb.getUserByUsername({ username: friendUsername });
    if (!friend) {
        throw new Error('Friend not found');
    }

    const isFriend = await userDb.isFriend({ username, friendUsername });
    if (isFriend) {
        throw new Error('Users are already friends');
    }

    return userDb.addFriend({ username, friendUsername });
}

const removeFriend = async ({ username, friendUsername }: { username: string, friendUsername: string }) : Promise<void> => {
    const user = await userDb.getUserByUsername({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const friend = await userDb.getUserByUsername({ username: friendUsername });
    if (!friend) {
        throw new Error('Friend not found');
    }

    const isFriend = await userDb.isFriend({ username, friendUsername });
    if (!isFriend) {
        throw new Error('Users are not friends');
    }

    return userDb.removeFriend({ username, friendUsername });
}

const getFriendRequests = async ({ username }: { username: string }) : Promise<FriendRequest[] | null> => {
    const lazyFriendRequests = await userDb.getFriendRequests({ username });
    if (!lazyFriendRequests) {
        return null;
    }

    // Eagerly load the friend requests
    let result: FriendRequest[] = [];
    for (let i = 0; i < lazyFriendRequests.length; i++) {
        const friendRequest = lazyFriendRequests[i];
        const foundFriendRequest = await friendRequestDb.getFriendRequestById({ id: friendRequest.getId() });
        if (foundFriendRequest) {
            result.push(foundFriendRequest);
        }
    }

    return result;
}

const hasChat = async (user: User, chatId: number) : Promise<boolean> => {
    const chats = await chatDb.getAllChats();
    return chats.some(chat => chat.getId() === chatId && chat.getUsers()?.some(u => u.getUsername() === user.getUsername()));
}

// Authenticated methods

const authGetAllUsers = async (authUser: { username: string, role: string }) : Promise<User[]> => {
    if (authUser.role !== 'admin') {
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }

    const users = await userDb.getAllUsers();

    const data = users as unknown as UserType[];
    data.map((user) => {
        prepareUser(user);
    });

    return users;
}

const authGetUserByUsername = async (authUser: { username: string, role: string }, username: string) : Promise<UserType> => {
    if (authUser.role == "admin") {
        // Admins can see all users
        const user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        const data: UserType = user as unknown as UserType;
        prepareUser(data);

        return data;
    } else if (authUser.role == "user") {
        // Normal users can see all users
        const user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        const data: UserType = user as unknown as UserType;
        if (username !== authUser.username) {
            prepareUserStrict(data, authUser as unknown as UserType); // But only their username and role
        } else {
            prepareUser(data); // And if it's themselves, show everything
        }

        return data;
    } else {
        // Unauthorized
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }
}

const authGetFriends = async (authUser: { username: string, role: string }, username: string) : Promise<UserType[]> => {
    if (authUser.role == "admin") {
        // Admins can see everyone's friends
        const user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        const friends = await userDb.getFriends({ username });

        const data = friends as unknown as UserType[];
        data.map((user: UserType) => {
            prepareFriend(user);
        });

        return data;
    } else if (authUser.role == "user") {
        // Normal user can only see their friends
        const user = await userDb.getUserByUsername({ username });

        if (!user) {
            throw new Error(`User ${username} not found`);
        }
        if (username !== authUser.username) {
            // Unauthorized
            throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You cannot view another user\'s friends.' });
        }

        const friends = await userDb.getFriends({ username });

        const data = friends as unknown as UserType[];
        data.map((user: UserType) => {
            prepareUserStrict(user, authUser as unknown as UserType);
        });

        return data;
    } else {
        // Unauthorized
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }
}

const authRemoveFriend = async (authUser: { username: string, role: string }, username: string, friendUsername: string) : Promise<void> => {
    if (authUser.role == "admin" || authUser.role == "user") {
        // Users and admins can remove their own friends
        await userDb.removeFriend({ username, friendUsername });
    } else {
        // Unauthorized
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }
}

const authGetFriendRequests = async (authUser: { username: string, role: string }, username: string) : Promise<FriendRequest[]> => {
    if (authUser.role == "admin") {
        // Admins can see everyone's friend requests
        const friendRequests = await userDb.getFriendRequests({username});
        if (!friendRequests) {
            throw new Error(`User ${username} not found`);
        }

        const data = friendRequests as unknown as FriendRequestType[];
        data.map((friendRequest: FriendRequestType) => {
            prepareFriendRequest(friendRequest);
        });

        return friendRequests;
    } else if (authUser.role == "user") {
        // Normal user can only see their friend requests
        if (username !== authUser.username) {
            // Unauthorized
            throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You cannot view another user\'s friend requests.' });
        }

        const friendRequests = await userDb.getFriendRequests({username});
        if (!friendRequests) {
            throw new Error(`User ${username} not found`);
        }

        const data = friendRequests as unknown as FriendRequestType[];
        data.map((friendRequest: FriendRequestType) => {
            prepareFriendRequest(friendRequest);
        });

        return friendRequests;
    } else {
        // Unauthorized
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }
}

const authBanUser = async (authUser: { username: string, role: string }, username: string) : Promise<void> => {
    if (authUser.role == "admin") {
        // Admins can ban users
        const user = await userDb.getUserByUsername({ username });
        if (!user) {
            throw new Error(`User ${username} not found`);
        }

        await userDb.banUser(username);
    } else {
        // Unauthorized
        throw new UnauthorizedError( 'credentials_bad_scheme', { message: 'You do not have the required role to access this content.' });
    }
}

export default {
    getAllUsers,
    getUserByUsername,
    getFriends,
    isFriends,
    addFriend,
    removeFriend,
    getFriendRequests,
    hasChat,
    // Auth methods
    authGetAllUsers,
    authGetUserByUsername,
    authGetFriends,
    authRemoveFriend,
    authGetFriendRequests,
    authBanUser
}