import bcrypt from "bcrypt";
import userDb from "../../repository/user.db";
import { User } from "../../model/user";
import accountService from "../../service/account.service";

jest.mock("../../repository/user.db");
jest.mock("../../util/jwt");
jest.mock("bcrypt");

describe("Authentication Service", () => {
  const mockUser = new User({
    username: "testuser",
    password: "hashedPassword1",
    role: "user",
    messages: [],
    friends: [],
    friendRequests: [],
  });

  const mockAdminUser = new User({
    username: "adminuser",
    password: "adminPassword1",
    role: "admin",
    messages: [],
    friends: [],
    friendRequests: [],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticate", () => {
    it("should throw an error if user is banned", async () => {
      const bannedUser = new User({
        username: "banneduser",
        password: "hashedPassword1",
        role: "user",
        messages: [],
        friends: [],
        friendRequests: [],
      });

      bannedUser.isUserBanned = jest.fn().mockReturnValue(true);

      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(bannedUser);

      await expect(
        accountService.authenticate({ username: "banneduser", password: "Password123" })
      ).rejects.toThrow("User with username: banneduser is banned");
    });

    it("should throw an error if credentials are incorrect", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        accountService.authenticate({ username: "testuser", password: "wrongpassword" })
      ).rejects.toThrow("Incorrect credentials.");
    });

    it("should throw an error if user does not exist", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(undefined);

      await expect(
        accountService.authenticate({ username: "nonexistentuser", password: "password123" })
      ).rejects.toThrow("Incorrect credentials.");
    });

  describe("register", () => {
    it("should register a new user", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(undefined);
      (userDb.addUser as jest.Mock).mockResolvedValue(undefined);

      await accountService.register({ username: "newuser", password: "Password123" });

      expect(userDb.getUserByUsername).toHaveBeenCalledWith({ username: "newuser" });
      expect(userDb.addUser).toHaveBeenCalledWith({
        user: expect.objectContaining({ username: "newuser", role: "user" }),
      });
    });

    it("should throw an error if the user already exists", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser);

      await expect(
        accountService.register({ username: "testuser", password: "password123" })
      ).rejects.toThrow("User with username: testuser already exists.");
    });
  });

  describe("banUser", () => {

    it("should throw an error if admin does not have permission", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser); 

      await expect(
        accountService.banUser({ adminUsername: "testuser", targetUsername: "anotheruser" })
      ).rejects.toThrow("User testuser does not have permission to ban users.");
    });

    it("should throw an error if the target user is an admin", async () => {
      (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockAdminUser);
      (userDb.getUserByUsername as jest.Mock).mockResolvedValueOnce(mockAdminUser);

      await expect(
        accountService.banUser({ adminUsername: "adminuser", targetUsername: "adminuser" })
      ).rejects.toThrow("Cannot ban another admin user.");
    });
  });
});});
