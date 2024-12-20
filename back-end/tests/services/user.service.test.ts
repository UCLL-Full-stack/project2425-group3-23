import userDb from "../../repository/user.db";
import friendRequestDb from "../../repository/friendRequest.db";
import userService from "../../service/user.service";
import { User } from "../../model/user";
import { FriendRequest } from "../../model/friendRequest";

jest.mock("../../repository/user.db");
jest.mock("../../repository/friendRequest.db");

describe("User Service", () => {
  const mockUser = new User({
    username: "testuser",
    role: "user",
    password: "Password1",
    isBanned: false,
  });

  const mockFriend = new User({
    username: "frienduser",
    role: "user",
    password: "Password2",
    isBanned: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      (userDb.getAllUsers as jest.Mock).mockResolvedValue([mockUser]);

      const users = await userService.getAllUsers();

      expect(users).toEqual([mockUser]);
      expect(userDb.getAllUsers).toHaveBeenCalledTimes(1);
    });
  });

  describe("getUserByUsername", () => {
    it("should return a user by username", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

      const user = await userService.getUserByUsername("testuser");

      expect(user).toEqual(mockUser);
      expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: "testuser" });
    });

    it("should return undefined if user does not exist", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(undefined);

      const user = await userService.getUserByUsername("nonexistent");

      expect(user).toBeUndefined();
    });
  });

  describe("addFriend", () => {
    it("should add a friend successfully", async () => {
      (userDb.getUserByUsername as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockFriend);
      (userDb.isFriend as jest.Mock).mockResolvedValue(false);

      await userService.addFriend({ username: "testuser", friendUsername: "frienduser" });

      expect(userDb.addFriend).toHaveBeenCalledWith({
        username: "testuser",
        friendUsername: "frienduser",
      });
    });

    it("should throw an error if user does not exist", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(undefined);

      await expect(
        userService.addFriend({ username: "nonexistent", friendUsername: "frienduser" })
      ).rejects.toThrow("User not found");
    });

    it("should throw an error if users are already friends", async () => {
      (userDb.getUserByUsername as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(mockFriend);
      (userDb.isFriend as jest.Mock).mockResolvedValue(true);

      await expect(
        userService.addFriend({ username: "testuser", friendUsername: "frienduser" })
      ).rejects.toThrow("Users are already friends");
    });
  });

  describe("getFriends", () => {
    it("should return a list of friends", async () => {
      (userDb.getFriends as jest.Mock).mockResolvedValue([mockFriend]);

      const friends = await userService.getFriends("testuser");

      expect(friends).toEqual([mockFriend]);
      expect(userDb.getFriends).toHaveBeenCalledWith({ username: "testuser" });
    });
  });

  describe("getFriendRequests", () => {
    it("should return friend requests for a user", async () => {
      const mockFriendRequest = new FriendRequest({
        id: 1,
        sender: mockFriend,
        receiver: mockUser,
        status: "pending",
      });

      (userDb.getFriendRequests as jest.Mock).mockResolvedValue([mockFriendRequest]);
      (friendRequestDb.getFriendRequestById as jest.Mock).mockResolvedValue(mockFriendRequest);

      const friendRequests = await userService.getFriendRequests({ username: "testuser" });

      expect(friendRequests).toEqual([mockFriendRequest]);
    });

    it("should return null if no friend requests are found", async () => {
      (userDb.getFriendRequests as jest.Mock).mockResolvedValue(null);

      const friendRequests = await userService.getFriendRequests({ username: "testuser" });

      expect(friendRequests).toBeNull();
    });
  });
});
