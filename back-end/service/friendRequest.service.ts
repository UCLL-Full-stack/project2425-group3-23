import {FriendRequest} from "../model/friendRequest";
import friendRequestDb from "../repository/friendRequest.db";
import UserService from "./user.service";

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

export default {
    getAllFriendRequests,
    getFriendRequestById,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest
}