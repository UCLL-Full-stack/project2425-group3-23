import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Message } from '../types';
import ChatWindow from '../components/chatWindow';
import ChatSendBox from '../components/chatSendBox';
import { getMessages } from '../services/api';

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
        <div>
            <Head>
                <title>Public Chat</title>
            </Head>
            <main>
                <h1>Welcome to the Public Chat</h1>
                <ChatWindow messages={messages} />
                <ChatSendBox />
            </main>
        </div>
    );
};

export default Home;
