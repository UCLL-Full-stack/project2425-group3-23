import { PrismaClient }  from "@prisma/client";
import { set } from "date-fns";

const prisma = new PrismaClient();

const main = async () => {
    await prisma.chat.deleteMany();
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();

    const userYorick = await prisma.user.create({
        data: {
            username: 'Yorick',
            password: 'Password01',
            role: 'user',
        },
    });

    const userSofie = await prisma.user.create({
        data: {
            username: 'Sofie',
            password: 'Password01',
            role: 'user',
        },
    });

    const publicChat = await prisma.chat.create({
        data: {
            type: 'public',
            users: {
                connect: [
                    { username: userYorick.username },
                    { username: userSofie.username },
                ],
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

    const friendRequest = await prisma.friendRequest.create({
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