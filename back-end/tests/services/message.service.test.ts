import messageDb from '../../repository/message.db';
import { Message } from '../../model/message';
import {User} from "../../model/user";
import messageService from "../../service/message.service";
import {Chat} from "../../model/chat";
import chatDb from "../../repository/chat.db";
import userDb from "../../repository/user.db";

jest.mock('../../repository/message.db');
jest.mock('../../repository/chat.db')
jest.mock('../../repository/user.db')

describe('Message Service', () => {
    let mockChat = new Chat({
        id: 1,
        type: 'public',
        messages: [],
        users: []
    });

    let mockMessage = new Message({
        id: 1,
        content: 'Hello, World!',
        deleted: false,
        chat: mockChat,
        sender: new User({
            username: 'JohnDoe',
            password: 'Password01',
            role: 'user',
            messages: [],
            friends: [],
            friendRequests: []
        })
    });

    const mockUser1 = new User({
        username: 'JohnDoe',
        password: 'Password01',
        role: 'user',
        messages: [mockMessage],
        friends: [],
        friendRequests: []
    });

    const mockUser2 = new User({
        username: 'JaneDoe',
        password: 'Password01',
        role: 'user',
        messages: [mockMessage],
        friends: [],
        friendRequests: []
    });

    describe('getAllPublicChatMessages', () => {
        it('should return messages', async () => {
            (messageDb.getAllMessagesByChatId as jest.Mock).mockResolvedValue([mockMessage]);
            (chatDb.getPublicChat as jest.Mock).mockResolvedValue(mockChat);
            const messages = await messageService.getAllPublicChatMessages();
            expect(messages).toEqual([mockMessage]);
        });
    });

    describe('getAllPrivateChatMessages', () => {
        it('should return messages', async () => {
            (messageDb.getAllMessagesByChatId as jest.Mock).mockResolvedValue([mockMessage]);
            (chatDb.getPrivateChat as jest.Mock).mockResolvedValue(mockChat);
            const messages = await messageService.getAllPrivateChatMessages(mockUser1.getUsername(), mockUser2.getUsername());
            expect(messages).toEqual([mockMessage]);
        });
    });

    describe('getMessageById', () => {
        it('should return message', async () => {
            (messageDb.getMessageById as jest.Mock).mockResolvedValue(mockMessage);
            const message = await messageService.getMessageById(1);
            expect(message).toEqual(mockMessage);
        });
    });

    describe('createMessage', () => {
        it('should create message', async () => {
            (messageDb.addMessage as jest.Mock).mockResolvedValue(mockMessage);
            (userDb.getUserByUsername as jest.Mock).mockResolvedValue(mockUser1);
            (chatDb.getPublicChat as jest.Mock).mockResolvedValue(mockChat);
            const message = await messageService.createMessage({
                content: 'Hello, World!',
                sender: {
                    username: 'JohnDoe'
                }
            });
            expect(message).toEqual(mockMessage);
        });
    });

    describe('deleteMessage', () => {
        it('should delete message', async () => {
            (messageDb.deleteMessage as jest.Mock).mockResolvedValue(mockMessage);
            await messageService.deleteMessage(1);
        });
    });

    describe('permanentlyDeleteMessage', () => {
        it('should permanently delete message', async () => {
            (messageDb.permanentlyDeleteMessage as jest.Mock).mockResolvedValue(mockMessage);
            (messageDb.getMessageByIdAdmin as jest.Mock).mockResolvedValue(mockMessage);
            await messageService.permanentlyDeleteMessage(1);
        });
    });
});