import { Chat } from "../../model/chat";
import chatDb from "../../repository/chat.db";
import chatService from "../../service/chat.service";


jest.mock("../../repository/chat.db");

describe("Chat Service", () => {
    const mockChat = new Chat({
        id: 1,
        type: "public",
        users: [],
        messages: [],
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getPublicChat", () => {
        it("should return the public chat", async () => {
            (chatDb.getPublicChat as jest.Mock).mockResolvedValue(mockChat);

            const result = await chatService.getPublicChat();

            expect(chatDb.getPublicChat).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockChat);
        });

        it("should throw an error if the public chat cannot be retrieved", async () => {
            (chatDb.getPublicChat as jest.Mock).mockRejectedValue(new Error("Database error"));

            await expect(chatService.getPublicChat()).rejects.toThrow("Database error");
        });
    });

    describe("addUserToChat", () => {
        it("should add a user to the chat successfully", async () => {
            const chatId = 1;
            const username = "testuser";

            (chatDb.addUserToChat as jest.Mock).mockResolvedValue(undefined);

            await chatService.addUserToChat(chatId, username);

            expect(chatDb.addUserToChat).toHaveBeenCalledTimes(1);
            expect(chatDb.addUserToChat).toHaveBeenCalledWith(chatId, username);
        });

        it("should throw an error if adding a user to the chat fails", async () => {
            const chatId = 1;
            const username = "testuser";

            (chatDb.addUserToChat as jest.Mock).mockRejectedValue(new Error("Database error"));

            await expect(chatService.addUserToChat(chatId, username)).rejects.toThrow("Database error");
        });
    });
});