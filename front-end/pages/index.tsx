import React, {useEffect} from 'react';
import Head from 'next/head';
import ChatWindow from '../components/chatWindow';
import {getPublicMessages} from '@services/messageService';
import {getUser} from '@services/userService';
import {Typography} from "@mui/material";
import MessageWebSocket from "@/services/messageWebSocket";
import Header from '@/components/header';
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useTranslation} from "next-i18next";
import useSWR, {mutate} from "swr";

const Home: React.FC = () => {
    const { t } = useTranslation();

    const loggedInUserFetcher = async () => {
        try {
            const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));

            let user = await getUser(storedUser.username, storedUser.token);
            user.token = storedUser.token;

            return user;
        } catch (error) {
            return null;
        }
    };
    const { data: loggedInUser } = useSWR('userWithToken', loggedInUserFetcher);

    const messagesFetcher = async() => {
        try {
            return getPublicMessages(loggedInUser?.token);
        } catch (error) {
            return null;
        }
    }
    const { data: messages } = useSWR('messages', messagesFetcher);

    useEffect(() => {
        // Update messages when (and if) user is updated
        mutate('messages');
    }, [loggedInUser]);

    useEffect(() => {
        // Websocket connection
        const websocket = MessageWebSocket.getInstance(messages, () => {mutate('messages')});
        websocket.onclose = () => {
            // If the websocket connection closes for one reason or the other fallback to polling
            // If the websocket closes because the page is being closed or refreshed, the polling will be stopped so no need to worry about that
            const intervalId = setInterval(() => {
                mutate('messages');
            }, 1000);

            return () => clearInterval(intervalId);
        }
    }, []);

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
                {messages && <ChatWindow messages={messages} updateMessages={() => {mutate('messages')}} user={loggedInUser} updateUser={() => {mutate('userWithToken')}} />}
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
