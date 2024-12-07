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

    const existingFriendRequests = await friendRequestDb.getFriendRequestsByUsernames({senderUsername, receiverUsername});
    if (existingFriendRequests && existingFriendRequests.map(friendRequest => friendRequest.getStatus()).includes("pending")) {
        throw new Error("Friend request already pending");
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

    if (friendRequest) {
        const username = friendRequest.getSender().getUsername();
        const friendUsername = friendRequest.getReceiver().getUsername();
        await UserService.addFriend({username, friendUsername});
        await friendRequestDb.setFriendRequestStatus({ id, status: 'accepted' });
    }
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