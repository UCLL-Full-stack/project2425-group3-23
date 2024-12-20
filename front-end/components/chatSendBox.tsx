import React, {useEffect, useState} from 'react';
import {createPrivateMessage, createPublicMessage} from '@services/messageService';
import {Box, Button, TextField} from "@mui/material";
import GenericErrorDialog from "@/components/genericErrorDialog";
import {useTranslation} from "next-i18next";

type Props = {
    senderUsername: string;
    chatPartnerUsername?: string;
}

const ChatSendBox: React.FC<Props> = ({ senderUsername, chatPartnerUsername }) => {
    const { t } = useTranslation();

    const [content, setContent] = useState<string>('');
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = React.useState('');
    const [token, setToken] = useState<string>('');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser) {
            setToken(storedUser.token);
        }
    }, []);

    const openErrorDialog = (message: string) => {
        setErrorDialogMessage(message);
        setErrorDialogOpen(true);
    }

    const closeErrorDialog = () => {
        setErrorDialogOpen(false);
    }

    const validateMessage = (message: string) => {
        if (message === '') {
            openErrorDialog(t('chat.chatWindow.messageEmpty'));
            return false;
        }
        if (message.length > 1000) {
            openErrorDialog(t('chat.chatWindow.messageTooLong'));
            return false;
        }

        return true;
    }

    return (
        <>
            <Box component="form" sx={{ display: 'flex', alignItems: 'center', gap: '0.5em' }} onSubmit={(event) => {
                event.preventDefault();

                if (!validateMessage(content)) {
                    return;
                }

                if (!chatPartnerUsername) {
                    createPublicMessage(content, senderUsername, token)
                        .then(() => {
                            setContent('');
                        })
                        .catch((error) => {
                            openErrorDialog(error.message);
                        });
                } else {
                    createPrivateMessage(content, senderUsername, chatPartnerUsername, token)
                        .then(() => {
                            setContent('');
                        })
                        .catch((error) => {
                            openErrorDialog(error.message);
                        });
                }
            }}>
                <TextField
                    sx={{ flexGrow: 1 }}
                    placeholder={t('chat.chatWindow.placeholder')}
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    className="flex-1 bg-[#2c2f33] text-white placeholder-gray-500 p-3 rounded-lg outline-none border border-[#3a3f45] focus:border-[#7289da]"
                />
                <Button
                    variant="contained"
                    type="submit"
                    sx={{ flexShrink: 0, height: '4em', width: '7.5em' }}
                >
                    {t('chat.chatWindow.send')}
                </Button>
            </Box>
            {errorDialogOpen && <GenericErrorDialog open={errorDialogOpen} onClose={closeErrorDialog} errorMessage={errorDialogMessage} />}
        </>
    );
}

export default ChatSendBox;