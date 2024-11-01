
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Message } from '../types';
import ChatWindow from '../components/chatWindow';

const Home: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Fetch messages from backend API
        const fetchMessages = async () => {
            try {
                const response = await fetch('http://localhost:3000/messages');
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data: Message[] = await response.json();
                setMessages(data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
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
            </main>
        </div>
    );
};

export default Home;
