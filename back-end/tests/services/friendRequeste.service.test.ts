
import userService from "../../service/user.service";
import friendRequestDb from "../../repository/friendRequest.db";
import { FriendRequest } from "../../model/friendRequest";
import friendRequestService from "../../service/friendRequest.service";

jest.mock("../../service/user.service");
jest.mock("../../repository/friendRequest.db");


describe("Friend Request Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("sendFriendRequest", () => {
        it("should throw an error if senderUsername is missing", async () => {
            await expect(
                friendRequestService.sendFriendRequest("", "receiverUser")
            ).rejects.toThrow("Sender username is required");
        });

        it("should throw an error if receiverUsername is missing", async () => {
            await expect(
                friendRequestService.sendFriendRequest("senderUser", "")
            ).rejects.toThrow("Receiver username is required");
        });

        it("should throw an error if sender and receiver are the same", async () => {
            await expect(
                friendRequestService.sendFriendRequest("senderUser", "senderUser")
            ).rejects.toThrow("Cannot send friend request to self");
        });

        it("should throw an error if users are already friends", async () => {
            (userService.isFriends as jest.Mock).mockResolvedValue(true);

            await expect(
                friendRequestService.sendFriendRequest("senderUser", "receiverUser")
            ).rejects.toThrow("Cannot send friend request, users are already friends");
        });

    });

    describe("acceptFriendRequest", () => {
        it("should throw an error if the friend request is not found", async () => {
            (friendRequestDb.getFriendRequestById as jest.Mock).mockResolvedValue(undefined);

            await expect(friendRequestService.acceptFriendRequest(1)).rejects.toThrow(
                "Friend request not found"
            );
        });
    });

    describe("declineFriendRequest", () => {
        it("should throw an error if the friend request is not found", async () => {
            (friendRequestDb.getFriendRequestById as jest.Mock).mockResolvedValue(undefined);

            await expect(friendRequestService.declineFriendRequest(1)).rejects.toThrow(
                "Friend request not found"
            );
        });
    });
});
