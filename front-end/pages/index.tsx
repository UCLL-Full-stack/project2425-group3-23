import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {Message, User} from '@/types';
import ChatWindow from '../components/chatWindow';
import {getMessages, getUser} from '@/services/api';
import {Box, Typography} from "@mui/material";
import MessageWebSocket from "@/services/messageWebSocket";

const Home: React.FC = () => {
    const [username, setUsername] = useState<string | null>("Sofie");
    const [user, setUser] = useState<User | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    const updateUser = async () => {
        if (!username) return;

        const data = await getUser(username);
        setUser(data);
    }

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getMessages();
            setMessages(data);
        };
        fetchMessages();

        const fetchUser = async () => {
            if (!username) return;

            const data = await getUser(username);
            setUser(data);
        }
        fetchUser();

        // WebSocket functionality
        MessageWebSocket.getInstance(messages, setMessages);
    }, []);

    return (
        <div className="min-h-screen bg-[#23272a] text-white flex flex-col">
            <Head>
                <title>Public Chat</title>
            </Head>
            <main className="flex-1 flex flex-col justify-between max-w-4xl mx-auto">
                <Typography variant="h3" sx={{ mb: '0.25em', width: '100%', textAlign: 'center' }}>
                    Welcome to the Public Chat!
                </Typography>
                <Box>
                    {user && <ChatWindow messages={messages} user={user} updateUser={updateUser} />}
                </Box>
            </main>
        </div>
    );
};

export default Home;
