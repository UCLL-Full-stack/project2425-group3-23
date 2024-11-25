import {FriendRequest} from "../model/friendRequest";
import database from "./database";

const getAllFriendRequests = async () : Promise<FriendRequest[]> => {
    try {
        const friendRequestsPrisma = await database.friendRequest.findMany({
            include: {
                sender: true,
                receiver: true
            }
        });
        return friendRequestsPrisma.map((friendRequest : any) => FriendRequest.from(friendRequest));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getFriendRequestById = async ({ id }: { id: number }) : Promise<FriendRequest | undefined> => {
    try {
        const friendRequestPrisma = await database.friendRequest.findUnique({
            where: {
                id: id
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return friendRequestPrisma ? FriendRequest.from(friendRequestPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getFriendRequestsByReceiver = async ({ receiverUsername }: { receiverUsername: string }) : Promise<FriendRequest[]> => {
    try {
        const friendRequestsPrisma = await database.friendRequest.findMany({
            where: {
                receiverUsername: receiverUsername
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return friendRequestsPrisma.map((friendRequest : any) => FriendRequest.from(friendRequest));
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const getFriendRequestByUsernames = async ({ senderUsername, receiverUsername }: { senderUsername: string, receiverUsername: string }) : Promise<FriendRequest | undefined> => {
    try {
        const friendRequestPrisma = await database.friendRequest.findFirst({
            where: {
                senderUsername: senderUsername,
                receiverUsername: receiverUsername
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return friendRequestPrisma ? FriendRequest.from(friendRequestPrisma) : undefined;
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const createFriendRequest = async ({ senderUsername, receiverUsername }: { senderUsername: string, receiverUsername: string }) : Promise<FriendRequest> => {
    try {
        const friendRequestPrisma = await database.friendRequest.create({
            data: {
                senderUsername: senderUsername,
                receiverUsername: receiverUsername
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return FriendRequest.from(friendRequestPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

const setFriendRequestStatus = async ({ id, status }: { id: number, status: string }) : Promise<FriendRequest> => {
    try {
        const friendRequestPrisma = await database.friendRequest.update({
            where: {
                id: id
            },
            data: {
                status: status
            },
            include: {
                sender: true,
                receiver: true
            }
        });
        return FriendRequest.from(friendRequestPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See server logs for details.');
    }
}

export default {
    getAllFriendRequests,
    getFriendRequestById,
    getFriendRequestsByReceiver,
    getFriendRequestByUsernames,
    createFriendRequest,
    setFriendRequestStatus
}