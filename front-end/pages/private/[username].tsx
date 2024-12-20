import React, {useEffect, useState} from "react";
import Head from "next/head";
import Header from "@components/header";
import {Typography} from "@mui/material";
import {useTranslation} from "next-i18next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {useRouter} from "next/router";
import {getPrivateMessages, getPublicMessages, getUser} from "@services/api";
import useSWR, {mutate} from "swr";
import MessageWebSocket from "@services/messageWebSocket";
import ChatWindow from "@components/chatWindow";

const PrivateChat = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { username: chatPartnerUsername } = router.query;
    const [ errorMessage, setErrorMessage ] = useState("");

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
            return await getPrivateMessages(loggedInUser.username, chatPartnerUsername as string, loggedInUser.token);
        } catch (error) {
            if (error.message === "You are not friends with this user.") {
                setErrorMessage(t("chat.privateChatNotFriends"));
                setTimeout(() => {
                    router.push('/');
                }, 5000);
            }
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
                <title>Private Chat</title>
            </Head>
            <Header />
            <main>
                <Typography variant="h3" sx={{ mb: '0.25em', width: '100%', textAlign: 'center' }}>
                    {t("chat.privateChatWith") + chatPartnerUsername}
                </Typography>
                {errorMessage && <Typography variant="h6" sx={{ mb: '1em', width: '100%', textAlign: 'center', color: 'error' }}>{errorMessage}</Typography>}
                {messages && <ChatWindow messages={messages} updateMessages={() => {mutate('messages')}} user={loggedInUser} updateUser={() => {mutate('userWithToken')}} chatPartnerUsername={chatPartnerUsername as string} />}
            </main>
        </>
    )
}

export const getServerSideProps = async (context) => {
    const {locale} = context;
    return{
        props: {
            ...(await serverSideTranslations(locale ?? "en", ["common"])),
        },
    };
};

export default PrivateChat;