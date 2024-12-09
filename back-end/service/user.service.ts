import {User} from "../model/user";
import userDb from "../repository/user.db";
import {FriendRequest} from "../model/friendRequest";
import friendRequestDb from "../repository/friendRequest.db";

const getAllUsers = async () => {
    return userDb.getAllUsers();
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

export default {
    getAllUsers,
    getUserByUsername,
    getFriends,
    isFriends,
    addFriend,
    removeFriend,
    getFriendRequests
}