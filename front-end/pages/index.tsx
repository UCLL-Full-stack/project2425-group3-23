import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {Message, User} from '@/types';
import ChatWindow from '../components/chatWindow';
import {getMessages, getUser} from '@/services/api';
import {Box, MenuItem, Select, Typography} from "@mui/material";
import MessageWebSocket from "@/services/messageWebSocket";
import Header from '@/components/header';

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

    useEffect(() => {
        updateUser();
    }, [username]);

    return (
        <div className="min-h-screen bg-[#23272a] text-white flex flex-col">
            <Head>
                <title>Public Chat</title>
            </Head>
            <Header /> 
            <main>
                <Typography variant="h3" sx={{ mb: '0.25em', width: '100%', textAlign: 'center' }}>
                    Welcome to the Public Chat!
                </Typography>
                {user && <ChatWindow messages={messages} user={user} updateUser={updateUser} />}
                <Box display='flex' justifyContent='center'>
                    <Select defaultValue={"Sofie"} onChange={(event) => setUsername(event.target.value)} sx={{ width: '50%', mt: '1em' }}>
                        <MenuItem value="Sofie">Sofie</MenuItem>
                        <MenuItem value="Yorick">Yorick</MenuItem>
                    </Select>
                </Box>
            </main>
        </div>
    );
};

export default Home;
