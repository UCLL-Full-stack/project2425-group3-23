import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {Message, User} from '@/types';
import ChatWindow from '../components/chatWindow';
import {getPublicMessages, getUser} from '@/services/api';
import {Box, MenuItem, Select, Typography} from "@mui/material";
import MessageWebSocket from "@/services/messageWebSocket";
import Header from '@/components/header';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";

const Home: React.FC = () => {
    const { t } = useTranslation();

    const [username, setUsername] = useState<string>("");
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);

    const updateMessages = async () => {
        try {
            const data = await getPublicMessages(token);
            setMessages(data);
        } catch (error) {
            setMessages([]);
            console.error(error);
        }
    }

    const updateUser = async () => {
        try {
            if (!username) {
                console.error("Failed to login", "No username");
                return;
            }
            if (!token) {
                console.error("Failed to login", "No token");
                return;
            }

            const data = await getUser(username, token);
            setUser(data);
        } catch (error) {
            setUser(null);
            console.error(error);
        }
    }

    useEffect(() => {
        const fetchMessages = async () => {
            const data = await getPublicMessages(token);
            setMessages(data);
        };
        fetchMessages();

        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setUsername(storedUser.username);
            setToken(storedUser.token);
        }

        // WebSocket functionality
        MessageWebSocket.getInstance(messages, setMessages);
    }, [token]);

    useEffect(() => {
        if (username && token) {
            updateUser();
        }
    }, [username, token]);

    return (
        <>
            <Head>
                <title>{t("chat.title")}</title>
            </Head>
            <Header />
            <main>
                <Typography variant="h3" sx={{ mb: '0.25em', width: '100%', textAlign: 'center' }}>
                    {t("chat.welcomePublic")}
                </Typography>
                {<ChatWindow messages={messages} updateMessages={updateMessages} user={user} updateUser={updateUser} />}
            </main>
        </>
    );
};

export const getServerSideProps = async (context) => {
    const {locale} = context;
    return{
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default Home;
