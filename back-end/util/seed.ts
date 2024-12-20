import { PrismaClient }  from "@prisma/client";
import { set } from "date-fns";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.chat.deleteMany();
    await prisma.message.deleteMany();
    await prisma.friendRequest.deleteMany();
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({
        data: {
            username: 'user1',
            password: await bcrypt.hash('user1', 12),
            role: 'user',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            username: 'user2',
            password: await bcrypt.hash('user2', 12),
            role: 'admin',
        },
    });

    const userYorick = await prisma.user.create({
        data: {
            username: 'Yorick',
            password: await bcrypt.hash('Password01', 12),
            role: 'user',
        },
    });

    const userSofie = await prisma.user.create({
        data: {
            username: 'Sofie',
            password: await bcrypt.hash('Password01', 12),
            role: 'user',
        },
    });

    const userAdmin = await prisma.user.create({
        data: {
            username: 'Admin',
            password: await bcrypt.hash('Password01', 12),
            role: 'admin',
        },
    });

    const publicChat = await prisma.chat.create({
        data: {
            type: 'public',
            users: {
                connect: [
                    { username: userYorick.username },
                    { username: userSofie.username },
                    { username: userAdmin.username },
                    { username: user1.username },
                    { username: user2.username },
                ],
            },
        },
    });

    const chatUser1Member = await prisma.chat.update({
        where: { id: publicChat.id },
        data: {
            users: {
                connect: { username: user1.username },
            },
        },
    });

    const user1ChatMember = await prisma.user.update({
        where: { username: user1.username },
        data: {
            chats: {
                connect: { id: publicChat.id },
            },
        },
    });

    const chatUser2Member = await prisma.chat.update({
        where: { id: publicChat.id },
        data: {
            users: {
                connect: { username: user2.username },
            },
        },
    });

    const user2ChatMember = await prisma.user.update({
        where: { username: user2.username },
        data: {
            chats: {
                connect: { id: publicChat.id },
            },
        },
    });

    const chatSofieMember = await prisma.chat.update({
        where: { id: publicChat.id },
        data: {
            users: {
                connect: { username: userSofie.username },
            },
        },
    });

    const sofieChatMember = await prisma.user.update({
        where: { username: userSofie.username },
        data: {
            chats: {
                connect: { id: publicChat.id },
            },
        },
    });

    const chatYorickMember = await prisma.chat.update({
        where: { id: publicChat.id },
        data: {
            users: {
                connect: { username: userYorick.username },
            },
        },
    });

    const yorickChatMember = await prisma.user.update({
        where: { username: userYorick.username },
        data: {
            chats: {
                connect: { id: publicChat.id },
            },
        },
    });

    const chatAdminMember = await prisma.chat.update({
        where: { id: publicChat.id },
        data: {
            users: {
                connect: { username: userAdmin.username },
            },
        },
    });

    const adminChatMember = await prisma.user.update({
        where: { username: userAdmin.username },
        data: {
            chats: {
                connect: { id: publicChat.id },
            },
        },
    });

    const yorickSofieChat = await prisma.chat.create({
        data: {
            type: 'private',
            users: {
                connect: [
                    { username: userYorick.username },
                    { username: userSofie.username },
                ],
            },
        },
    });

    const yorickSofieChatMember = await prisma.chat.update({
        where: { id: yorickSofieChat.id },
        data: {
            users: {
                connect: { username: userYorick.username },
            },
        },
    });

    const sofieYorickChatMember = await prisma.chat.update({
        where: { id: yorickSofieChat.id },
        data: {
            users: {
                connect: { username: userSofie.username },
            },
        },
    });

    const yorickSofieChatMessage = await prisma.message.create({
        data: {
            content: 'Hi Sofie! 😊',
            sender: {
                connect: { username: userYorick.username },
            },
            chat: {
                connect: { id: yorickSofieChat.id },
            },
        },
    });

    const firstMessage = await prisma.message.create({
        data: {
            content: 'Hello, world! 🤖',
            sender: {
                connect: { username: userYorick.username },
            },
            chat: {
                connect: { id: publicChat.id },
            },
        },
    });

    const secondMessage = await prisma.message.create({
        data: {
            content: 'Hey Yorick! 😅',
            sender: {
                connect: { username: userSofie.username },
            },
            chat: {
                connect: { id: publicChat.id },
            },
        },
    });

    const deletedMessage = await prisma.message.create({
        data: {
            content: 'Only cool people can see this message. 😎',
            sender: {
                connect: { username: userAdmin.username },
            },
            deleted: true,
            chat: {
                connect: { id: publicChat.id },
            },
        },
    });

    const user1User2FriendRequest = await prisma.friendRequest.create({
        data: {
            status: 'pending',
            sender: {
                connect: { username: user1.username },
            },
            receiver: {
                connect: { username: user2.username },
            },
        },
    });

    const user1sFriend = await prisma.user.update({
        where: { username: user1.username },
        data: {
            ownsFriends: {
                connect: { username: user2.username },
            },
            friendsOf: {
                connect: { username: user2.username },
            },
        },
    });

    const user2sFriend = await prisma.user.update({
        where: { username: user2.username },
        data: {
            ownsFriends: {
                connect: { username: user1.username },
            },
            friendsOf: {
                connect: { username: user1.username },
            },
        },
    });

    const sofieYorickFriendRequest = await prisma.friendRequest.create({
        data: {
            status: 'accepted',
            sender: {
                connect: { username: userYorick.username },
            },
            receiver: {
                connect: { username: userSofie.username },
            },
        },
    });

    const sofiesFriend = await prisma.user.update({
        where: { username: userSofie.username },
        data: {
            ownsFriends: {
                connect: { username: userYorick.username },
            },
            friendsOf: {
                connect: { username: userYorick.username },
            },
        },
    });

    const yoricksFriend = await prisma.user.update({
        where: { username: userYorick.username },
        data: {
            ownsFriends: {
                connect: {username: userSofie.username},
            },
            friendsOf: {
                connect: {username: userSofie.username},
            },
        }
    });
}

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();