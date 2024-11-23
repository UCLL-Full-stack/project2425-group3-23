import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Message } from '../types';
import ChatWindow from '../components/chatWindow';
import ChatSendBox from '../components/chatSendBox';
import { getMessages } from '../services/api';
import {Box, Typography} from "@mui/material";

const Home: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getMessages();
            setMessages(data);
        };

        fetchMessages();
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
                    <ChatWindow messages={messages} />
                </Box>
            </main>
        </div>
    );
};

export default Home;
