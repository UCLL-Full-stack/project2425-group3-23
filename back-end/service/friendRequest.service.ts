import {FriendRequest} from "../model/friendRequest";
import friendRequestDb from "../repository/friendRequest.db";
import UserService from "./user.service";
import {prepareFriendRequest} from "../util/dtoConverters";
import {UnauthorizedError} from "express-jwt";
import {FriendRequest as FriendRequestType} from "../types";
import jwtUtils from "../util/jwt";

const getAllFriendRequests = async () : Promise<FriendRequest[]> => {
    return friendRequestDb.getAllFriendRequests();
}

const getFriendRequestById = async (id: number) : Promise<FriendRequest | undefined> => {
    return friendRequestDb.getFriendRequestById({ id });
}

const sendFriendRequest = async (senderUsername: string, receiverUsername: string) : Promise<void> => {
    if (!senderUsername) {
        throw new Error("Sender username is required");
    }
    if (!receiverUsername) {
        throw new Error("Receiver username is required");
    }
    if (senderUsername === receiverUsername) {
        throw new Error("Cannot send friend request to self");
    }

    const isFriends = await UserService.isFriends({ username: senderUsername, friendUsername: receiverUsername });
    if (isFriends) {
        throw new Error("Cannot send friend request, users are already friends");
    }

    const receivedFriendRequests = await friendRequestDb.getFriendRequestsByUsernames({ senderUsername: receiverUsername, receiverUsername: senderUsername });
    const sentFriendRequests = await friendRequestDb.getFriendRequestsByUsernames({ senderUsername, receiverUsername });

    if (receivedFriendRequests?.some(req => req.getStatus() === 'pending')) {
        throw new Error("Cannot send friend request, the user has already sent you a pending friend request");
    }
    if (sentFriendRequests?.some(req => req.getStatus() === 'pending')) {
        throw new Error("Cannot send friend request, you have already sent a pending friend request to this user");
    }

    await friendRequestDb.createFriendRequest({senderUsername, receiverUsername});
}

const acceptFriendRequest = async (id: number) : Promise<void> => {
    const friendRequest = await friendRequestDb.getFriendRequestById({ id });

    if (!friendRequest) {
        throw new Error("Friend request not found");
    }
    if (friendRequest?.getStatus() == "accepted") {
        throw new Error("Friend request already accepted");
    }
    if (friendRequest?.getStatus() == "declined") {
        throw new Error("Friend request already declined");
    }

    const username = friendRequest.getSender()?.getUsername();
    const friendUsername = friendRequest.getReceiver()?.getUsername();
    if (!username || !friendUsername) {
        throw new Error("Friend request sender or receiver not found");
    }

    await UserService.addFriend({username, friendUsername});
    await friendRequestDb.setFriendRequestStatus({ id, status: 'accepted' });
}

const declineFriendRequest = async (id: number) : Promise<void> => {
    const friendRequest = await friendRequestDb.getFriendRequestById({ id });

    if (!friendRequest) {
        throw new Error("Friend request not found");
    }
    if (friendRequest?.getStatus() == "accepted") {
        throw new Error("Friend request already accepted");
    }
    if (friendRequest?.getStatus() == "declined") {
        throw new Error("Friend request already declined");
    }

    await friendRequestDb.setFriendRequestStatus({ id, status: 'declined' });
}

// Authenticated methods

const authGetFriendRequests = async (authUser : { username : string, role : string}) : Promise<FriendRequestType[]> => {
    if (authUser.role == 'admin') {
        // Admins can see all friend requests
        const friendRequests = await friendRequestDb.getAllFriendRequests();

        const data: FriendRequestType[] = friendRequests as unknown as FriendRequestType[];
        data.map((friendRequest: FriendRequestType) => {
            prepareFriendRequest(friendRequest);
        });

        return data;
    } else if (authUser.role == 'user') {
        // User can see only their friend requests
        const friendRequests = await friendRequestDb.getAllFriendRequests();
        const userFriendRequests = friendRequests.filter((friendRequest) => {
            return friendRequest.getSender()?.getUsername() === authUser.username || friendRequest.getReceiver()?.getUsername() === authUser.username;
        });

        const data: FriendRequestType[] = userFriendRequests as unknown as FriendRequestType[];
        data.map((friendRequest: FriendRequestType) => {
            prepareFriendRequest(friendRequest);
        });

        return data;
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authGetFriendRequestById = async (authUser : { username : string, role : string}, id: number) : Promise<FriendRequestType> => {
    if (authUser.role == 'admin') {
        // Admins can see all friend requests
        const friendRequest = await friendRequestDb.getFriendRequestById({ id });

        if (!friendRequest) {
            throw new Error(`Friend request ${id} not found`);
        }

        const data: FriendRequestType = friendRequest as unknown as FriendRequestType;
        prepareFriendRequest(data);

        return data;
    } else if (authUser.role == 'user') {
        // User can see only their friend requests
        const friendRequest = await friendRequestDb.getFriendRequestById({ id });

        if (!friendRequest) {
            throw new Error(`Friend request ${id} not found`);
        }

        if (friendRequest.getSender()?.getUsername() !== authUser.username && friendRequest.getReceiver()?.getUsername() !== authUser.username) {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You are not a part of this friend request.' });
        }

        const data: FriendRequestType = friendRequest as unknown as FriendRequestType;
        prepareFriendRequest(data);

        return data;
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authSendFriendRequest = async (authUser : { username : string, role : string}, receiverUsername: string) : Promise<void> => {
    if (authUser.role == 'admin' || authUser.role == 'user') {
        // Users and admins can send friend requests
        await sendFriendRequest(authUser.username, receiverUsername);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authAcceptFriendRequest = async (authUser : { username : string, role : string}, id: number) : Promise<void> => {
    if (authUser.role == 'admin' || authUser.role == 'user') {
        // Users and admins can accept received friend requests
        const friendRequest = await friendRequestDb.getFriendRequestById({ id });
        if (!friendRequest) {
            throw new Error(`Friend request ${id} not found`);
        }
        if (friendRequest.getReceiver()?.getUsername() !== authUser.username) {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You did not receive this friend request.' });
        }

        await acceptFriendRequest(id);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

const authDeclineFriendRequest = async (authUser : { username : string, role : string}, id: number) : Promise<void> => {
    if (authUser.role == 'admin' || authUser.role == 'user') {
        // Users and admins can decline received friend requests
        const friendRequest = await friendRequestDb.getFriendRequestById({ id });
        if (!friendRequest) {
            throw new Error(`Friend request ${id} not found`);
        }
        if (friendRequest.getReceiver()?.getUsername() !== authUser.username) {
            throw new UnauthorizedError('credentials_bad_scheme', { message: 'You did not receive this friend request.' });
        }

        await declineFriendRequest(id);
    } else {
        throw new UnauthorizedError('credentials_bad_scheme', { message: 'You do not have the required role to access this content.' })
    }
}

export default {
    getAllFriendRequests,
    getFriendRequestById,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    // Auth methods
    authGetFriendRequests,
    authGetFriendRequestById,
    authSendFriendRequest,
    authAcceptFriendRequest,
    authDeclineFriendRequest
}