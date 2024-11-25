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
    const existingFriendRequest = await friendRequestDb.getFriendRequestByUsernames({senderUsername, receiverUsername});
    if (existingFriendRequest) {
        const sender = await UserService.getUserByUsername(senderUsername);
        if (!sender) {
            throw new Error("Sender not found");
        }

        if (sender.getFriends().find(friend => friend.getUsername() == receiverUsername)) {
            throw new Error("Users are already friends"); // Users are already friends
        }
        if (existingFriendRequest.getStatus() == "pending") {
            throw new Error("Friend request already sent"); // Friend request already sent
        }
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