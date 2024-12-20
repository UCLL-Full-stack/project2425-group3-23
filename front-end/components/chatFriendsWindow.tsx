import {User} from "@/types";
import {Box, Button, Dialog, TextField, Typography} from "@mui/material";
import {
    acceptFriendRequest,
    declineFriendRequest,
    getFriendRequests,
    removeFriend,
    sendFriendRequest
} from "@services/messageService";
import React from "react";
import GenericErrorDialog from "@/components/genericErrorDialog";
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useTranslation} from "next-i18next";
import useSWR, { mutate } from "swr";
import {useRouter} from "next/router";

type ChatFriendsWindowProps = {
    user: User;
    updateUser: () => void;
};

const ChatFriendsWindow: React.FC<ChatFriendsWindowProps> = ({ user, updateUser }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const [friendUsername, setFriendUsername] = React.useState('');
    const [errorDialogOpen, setErrorDialogOpen] = React.useState(false);
    const [errorDialogMessage, setErrorDialogMessage] = React.useState('');
    const [friendRequestsDialogOpen, setFriendRequestsDialogOpen] = React.useState(false);

    const storedUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const token = storedUser?.token;

    const fetcher = async () => {
        return getFriendRequests(user.username, token).then(friendRequests => friendRequests.filter(friendRequest => friendRequest.status === 'pending'));
    }
    const { data: friendRequests = [], error } = useSWR(
        'chatFriendsWindow',
        fetcher
    );

    const openErrorDialog = (message: string) => {
        setErrorDialogMessage(message);
        setErrorDialogOpen(true);
    };

    const closeErrorDialog = () => {
        setErrorDialogOpen(false);
    };

    const handleFriendAction = async (action, ...args) => {
        try {
            await action(...args);
            updateUser();
            await mutate('chatFriendsWindow');
        } catch (error: any) {
            openErrorDialog(error.message);
        }
    };

    const sendFriendRequestClick = async () => {
        await handleFriendAction(sendFriendRequest, user.username, friendUsername, token);
        setFriendUsername('');
    };

    function handleFriendPrivateChat(friendUsername: string) {
        router.push(`/private/${friendUsername}`);
    }

    return (
        <Box sx={{
            width: '25%',
            minWidth: '400px',
            m: '0 auto',
            p: '1em',
            bgcolor: '#F3F3F3',
            borderRadius: '1em',
            maxHeight: '75vh',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Typography variant='h4' sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                    {t("chat.friendsWindow.friends")}
                </Typography>
                <Box sx={{ position: 'absolute', right: 0 }}>
                    <NotificationsIcon
                        sx={{ fontSize: '2rem', cursor: 'pointer', color: friendRequests.length > 0 ? 'yellow' : 'inherit' }}
                        onClick={() => setFriendRequestsDialogOpen(true)}
                    />
                </Box>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
                {user.friends.map(friend => (
                    <Box key={friend.username} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: '0.5em',
                        borderBottom: '1px solid #D3D3D3'
                    }}>
                        <Typography variant='h6'>{friend.username}</Typography>
                        <Box sx={{ display: 'flex', gap: '0.5em' }}>
                            <Button variant='contained' color='info' onClick={() => handleFriendPrivateChat(friend.username)}>{t("chat.friendsWindow.chat")}</Button>
                            <Button variant='contained' color='error' onClick={() => handleFriendAction(removeFriend, user.username, friend.username, token)}>{t("chat.friendsWindow.remove")}</Button>
                        </Box>
                    </Box>
                ))}
            </Box>
            <Box>
                <Typography variant="h5">{t("chat.friendsWindow.sendFriendRequest.title")}</Typography>
                <Box sx={{
                    display: 'flex',
                    gap: '1em',
                    alignItems: 'center'
                }}>
                    <TextField
                        fullWidth
                        placeholder={t("chat.friendsWindow.sendFriendRequest.placeholder")}
                        value={friendUsername}
                        onChange={(event) => setFriendUsername(event.target.value)}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={sendFriendRequestClick}
                        sx={{ height: '4em', width: '8em' }}
                    >
                        {t("chat.friendsWindow.sendFriendRequest.send")}
                    </Button>
                </Box>
            </Box>
            <Dialog open={friendRequestsDialogOpen} onClose={() => setFriendRequestsDialogOpen(false)}>
                <Box sx={{ p: '2em', minWidth: '300px' }}>
                    <Typography variant='h4' sx={{ mb: '1em', textAlign: 'center' }}>{t("notifications.friendRequests")}</Typography>
                    {friendRequests.length > 0 ? (
                        friendRequests.map(request => (
                            <Box key={request.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '1em' }}>
                                <Typography variant='h6'>{request.sender.username}</Typography>
                                <Box sx={{ display: 'flex', gap: '0.5em' }}>
                                    <Button variant='contained' color='primary' onClick={() => handleFriendAction(acceptFriendRequest, request.id, token)}>{t("notifications.accept")}</Button>
                                    <Button variant='contained' color='error' onClick={() => handleFriendAction(declineFriendRequest, request.id, token)}>{t("notifications.decline")}</Button>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        <Typography variant='body1' sx={{ textAlign: 'center' }}>{t("notifications.noFriendRequests")}</Typography>
                    )}
                </Box>
            </Dialog>
            {errorDialogOpen && <GenericErrorDialog open={errorDialogOpen} errorMessage={errorDialogMessage} onClose={closeErrorDialog} />}
        </Box>
    );
};

export default ChatFriendsWindow;