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